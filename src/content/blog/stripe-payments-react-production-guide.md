---
title: "Stripe Payments in React: A Production-Ready Guide"
description: "Checkout Sessions, webhooks, subscriptions, guest carts, and error handling — the complete Stripe integration flow I ship on client e-commerce and SaaS projects."
publishDate: 2026-05-28
updatedDate: 2026-06-10
category: "React"
tags: ["Stripe", "React", "Payments", "E-Commerce"]
featured: true
accent: "#ff006e"
image: "../../assets/blog/stripe-payments-react-production-guide.jpg"
imageAlt: "Secure online payment processing on a laptop"
---

Stripe integration tutorials usually stop at the happy path: create a Checkout Session, redirect the user, show a success page. Then you deploy, a customer pays, the success page renders, and nothing happens in your database because you never built the webhook handler. Or worse — you trust the success page URL parameter as proof of payment and ship orders that were never completed.

I've integrated Stripe on a dozen client projects — one-time payments, subscriptions, marketplace payouts with Connect, and guest-to-authenticated cart merges. The pattern is consistent: client-side code initiates payment, server-side code confirms it, and webhooks are the only source of truth.

This guide covers the full production flow I implement, including the edge cases that tutorials skip and the mistakes that cost clients money.

## Architecture: Never Trust the Client

The payment flow has four actors:

```
React App → Your API → Stripe → Webhook → Your Database
```

| Layer | Responsibility |
|-------|---------------|
| React | Display products, collect cart, initiate checkout |
| API routes | Create sessions, validate prices, handle webhooks |
| Stripe | Process payment, send events |
| Webhook handler | Fulfill orders, grant access, send confirmations |

**Golden rule:** The success page is UX. The webhook is truth. Never fulfill an order based on `?session_id=` in the URL alone — always verify the session status server-side.

```tsx
// success/page.tsx — verify, don't trust
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return <p>Invalid session.</p>;
  }

  // Server-side verification
  const order = await getOrderBySessionId(sessionId);

  if (!order) {
    return <p>Processing your payment...</p>; // webhook may not have fired yet
  }

  return <OrderConfirmation order={order} />;
}
```

## Environment Setup

Separate test and live keys from day one:

```env
# .env.local (never commit)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_URL=http://localhost:3000
```

```ts
// lib/stripe.ts — server only
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});
```

The secret key (`sk_`) never appears in client code. The publishable key (`pk_`) is safe for the browser but still shouldn't be hardcoded — use environment variables.

Install Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the webhook signing secret it outputs to STRIPE_WEBHOOK_SECRET
```

## One-Time Payments with Checkout Sessions

Stripe Checkout is the fastest path to production for one-time payments. Stripe hosts the payment form — PCI compliance, card validation, Apple Pay, and Google Pay included.

**Server: create checkout session**

```ts
// app/api/checkout/route.ts
import { stripe } from "@/lib/stripe";
import { getServerSession } from "@/lib/auth";
import { getCart } from "@/lib/cart";

export async function POST(req: Request) {
  const session = await getServerSession();
  const cart = await getCart(session?.userId);

  if (!cart.items.length) {
    return Response.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Always calculate prices server-side — never trust client-sent amounts
  const lineItems = await Promise.all(
    cart.items.map(async (item) => {
      const product = await getProduct(item.productId);

      if (!product || product.price !== item.price) {
        throw new Error(`Price mismatch for product ${item.productId}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
            metadata: { productId: product.id },
          },
          unit_amount: product.price, // cents
        },
        quantity: item.quantity,
      };
    }),
  );

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: session?.email,
    client_reference_id: session?.userId ?? cart.guestId,
    metadata: {
      cartId: cart.id,
      userId: session?.userId ?? "",
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB"],
    },
    automatic_tax: { enabled: true },
  });

  return Response.json({ url: checkoutSession.url });
}
```

**Critical security point:** Prices come from your database, not the client request. A manipulated client could send `price: 1` for a $100 product. Server-side price lookup prevents this.

**Client: redirect to Stripe**

```tsx
"use client";

import { useState } from "react";

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
      >
        {isLoading ? "Redirecting to checkout..." : "Proceed to payment"}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
```

Use `window.location.href` for redirect, not fetch — Checkout Sessions return a hosted URL that must be navigated to.

## Webhook Handler: The Source of Truth

Webhooks are how Stripe tells your server that payment succeeded, failed, or was disputed. Without webhooks, you have no reliable order fulfillment.

```ts
// app/api/webhooks/stripe/route.ts
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { fulfillOrder } from "@/lib/orders";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await fulfillOrder(session);
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await releaseInventory(session.metadata?.cartId);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err);
    return Response.json({ error: "Handler failed" }, { status: 500 });
  }

  return Response.json({ received: true });
}
```

**Why return 500 on handler failure:** Stripe retries failed webhooks with exponential backoff for up to three days. Return 200 only when you've successfully processed the event. Return 500 if your database is down — Stripe will retry.

**Fulfillment must be idempotent:** Webhooks can deliver the same event multiple times.

```ts
// lib/orders.ts
export async function fulfillOrder(session: Stripe.Checkout.Session) {
  const existingOrder = await db.order.findUnique({
    where: { stripeSessionId: session.id },
  });

  if (existingOrder) {
    console.log(`Order already fulfilled for session ${session.id}`);
    return existingOrder;
  }

  const order = await db.order.create({
    data: {
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      userId: session.metadata?.userId || null,
      cartId: session.metadata?.cartId!,
      amount: session.amount_total!,
      currency: session.currency!,
      status: "paid",
      shippingAddress: session.shipping_details,
    },
  });

  await sendOrderConfirmationEmail(order);
  await decrementInventory(order);
  await clearCart(session.metadata?.cartId!);

  return order;
}
```

## Guest Cart to Authenticated User Merge

E-commerce sites lose conversions by forcing login before checkout. Support guest checkout, then merge when users authenticate.

```ts
// lib/cart.ts
const GUEST_CART_KEY = "guest_cart_id";

export function getGuestCartId(): string {
  if (typeof window === "undefined") return "";

  let guestId = localStorage.getItem(GUEST_CART_KEY);
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem(GUEST_CART_KEY, guestId);
  }
  return guestId;
}

export async function mergeGuestCart(userId: string, guestId: string) {
  const guestCart = await db.cart.findUnique({
    where: { guestId },
    include: { items: true },
  });

  if (!guestCart?.items.length) return;

  const userCart = await db.cart.upsert({
    where: { userId },
    create: { userId, items: { create: guestCart.items } },
    update: {},
    include: { items: true },
  });

  // Merge items — combine quantities for duplicates
  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find(
      (i) => i.productId === guestItem.productId,
    );

    if (existing) {
      await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + guestItem.quantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: guestItem.productId,
          quantity: guestItem.quantity,
          price: guestItem.price,
        },
      });
    }
  }

  await db.cart.delete({ where: { id: guestCart.id } });
  localStorage.removeItem(GUEST_CART_KEY);
}
```

Call merge on login and registration:

```tsx
async function handleLogin(email: string, password: string) {
  const user = await login(email, password);
  const guestId = getGuestCartId();

  if (guestId) {
    await mergeGuestCart(user.id, guestId);
  }

  router.push("/cart");
}
```

Pass `client_reference_id` and `metadata` in the Checkout Session so the webhook knows which cart to fulfill regardless of guest or authenticated status.

## Subscriptions and SaaS Billing

For SaaS clients, Stripe Billing handles recurring payments:

```ts
const checkoutSession = await stripe.checkout.sessions.create({
  mode: "subscription",
  line_items: [
    {
      price: process.env.STRIPE_PRICE_ID_PRO!, // pre-created in Stripe Dashboard
      quantity: 1,
    },
  ],
  customer_email: session?.email,
  metadata: { userId: session?.userId ?? "" },
  success_url: `${process.env.NEXT_PUBLIC_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
  subscription_data: {
    trial_period_days: 14,
    metadata: { userId: session?.userId ?? "" },
  },
});
```

Handle subscription lifecycle webhooks:

```ts
case "customer.subscription.created":
case "customer.subscription.updated": {
  const subscription = event.data.object as Stripe.Subscription;
  await syncSubscription(subscription);
  break;
}
case "customer.subscription.deleted": {
  const subscription = event.data.object as Stripe.Subscription;
  await revokeAccess(subscription.metadata.userId);
  break;
}
case "invoice.payment_failed": {
  const invoice = event.data.object as Stripe.Invoice;
  await notifyPaymentFailed(invoice);
  break;
}
```

Expose a customer portal for self-service plan changes:

```ts
// app/api/billing/portal/route.ts
export async function POST() {
  const session = await getServerSession();
  const user = await getUser(session!.userId);

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/settings/billing`,
  });

  return Response.json({ url: portalSession.url });
}
```

## Embedded Checkout vs. Hosted Checkout

Stripe offers two integration styles:

| Approach | Pros | Cons |
|----------|------|------|
| **Hosted Checkout** | Fastest, PCI handled, Apple/Google Pay | Redirects away from your site |
| **Embedded Checkout** | Stays on your domain | More setup, still Stripe-hosted form |
| **Payment Element** | Fully custom UI | Most complex, you handle more edge cases |

For most client projects, I start with hosted Checkout. Conversion rates are excellent because Stripe optimizes the form continuously. Move to Payment Element only when branding requirements demand a fully custom experience.

Embedded Checkout in React:

```tsx
"use client";

import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export function EmbeddedCheckoutPage({ clientSecret }: { clientSecret: string }) {
  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
```

Server creates session with `ui_mode: "embedded"`:

```ts
const session = await stripe.checkout.sessions.create({
  ui_mode: "embedded",
  mode: "payment",
  line_items: lineItems,
  return_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
});
// Return session.client_secret instead of session.url
```

## Error Handling and Edge Cases

Production Stripe integrations encounter predictable failures:

**Webhook arrives before user returns to success page**

Show a "processing" state on the success page. Poll for order creation or use Server-Sent Events:

```tsx
function SuccessPage({ sessionId }: { sessionId: string }) {
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", sessionId],
    queryFn: () => fetchOrderBySession(sessionId),
    retry: 10,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });

  if (isLoading || !order) {
    return <p>Confirming your payment...</p>;
  }

  return <OrderConfirmation order={order} />;
}
```

**Payment succeeds but webhook fails**

Stripe retries webhooks, but monitor for stuck sessions. A cron job reconciles:

```ts
async function reconcilePendingSessions() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const pendingCarts = await db.cart.findMany({
    where: {
      checkoutStartedAt: { lt: oneHourAgo },
      order: null,
    },
  });

  for (const cart of pendingCarts) {
    if (!cart.stripeSessionId) continue;

    const session = await stripe.checkout.sessions.retrieve(
      cart.stripeSessionId,
    );

    if (session.payment_status === "paid") {
      await fulfillOrder(session);
    }
  }
}
```

**Double-click on checkout button**

Disable the button immediately on click (shown above). Add idempotency on the server:

```ts
const checkoutSession = await stripe.checkout.sessions.create(
  { /* ... */ },
  { idempotencyKey: `checkout-${cart.id}-${cart.updatedAt}` },
);
```

**Currency and tax**

Use Stripe Tax for automatic calculation. Display prices consistently — never mix currencies without conversion. Store amounts in cents (integers) to avoid floating-point errors:

```ts
// Always integer cents
const priceInCents = 1999; // $19.99
// Never
const price = 19.99; // floating point risks
```

## Testing Strategy

Before every production launch:

```bash
# Terminal 1: dev server
npm run dev

# Terminal 2: forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 3: trigger test events
stripe trigger checkout.session.completed
```

**Test card numbers:**

| Scenario | Card number |
|----------|-------------|
| Success | 4242 4242 4242 4242 |
| Decline | 4000 0000 0000 0002 |
| 3D Secure | 4000 0027 6000 3184 |
| Insufficient funds | 4000 0000 0000 9995 |

Test the full flow: add to cart → checkout → pay → webhook fires → order in database → confirmation email → inventory decremented. Then test: cancel checkout, expired session, failed payment, and duplicate webhook delivery.

## Security Checklist

Before going live, verify:

- [ ] Secret key only on server — grep codebase for `sk_live` and `sk_test`
- [ ] Webhook signature verification enabled
- [ ] Prices calculated server-side from database
- [ ] Idempotent webhook handlers
- [ ] HTTPS on production (Stripe requires it)
- [ ] Webhook endpoint not behind auth middleware
- [ ] Error responses don't leak internal details to client
- [ ] Stripe API version pinned in code
- [ ] Test mode fully separated from live mode
- [ ] Reconciliation job for missed webhooks

## Conclusion

Stripe makes payments feel simple until production edge cases arrive — guest carts, webhook retries, price tampering, and sessions that complete while your server is deploying. The architecture is straightforward: client initiates, server validates, Stripe processes, webhooks fulfill. Skip any step and money or inventory gets lost.

When clients hire me for Stripe integration, I deliver the full loop — not just a checkout button. That means server-side price validation, webhook handlers with idempotent fulfillment, guest cart merge, error states on the success page, and a testing protocol with Stripe CLI. It's more work than the tutorial path, but it's the difference between payments that demo well and payments that run a business.


If you're wiring Stripe into a React checkout and need webhooks, idempotency, and guest flows done correctly, [hire a React developer](/hire-react-developer) who treats payment truth as a server concern.


Billing UI, webhooks, and gated upgrades are SaaS frontend work — hire a [frontend developer for SaaS](/frontend-developer-for-saas) when checkout and account flows must stay trustworthy.

## Key Takeaways

- **Webhooks are the only source of payment truth** — never fulfill orders based on the success page URL alone.
- **Always calculate prices server-side** from your database — never trust client-sent amounts.
- **Webhook handlers must be idempotent** — Stripe delivers events more than once.
- **Support guest checkout with cart merge** on login to maximize conversion.
- **Return 500 on webhook handler failures** so Stripe retries; return 200 only on success.
- **Use Stripe CLI** to test webhooks locally before every production deploy.
- **Build reconciliation** for sessions where webhooks fail — a cron job retrieving paid sessions prevents lost orders.
