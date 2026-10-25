---
title: "Server Components vs Client Components in Next.js: A Practical Guide"
description: "When to use each, how to avoid hydration mistakes, and the mental model I teach client teams shipping production Next.js apps."
publishDate: 2026-03-18
category: "Next.js"
tags: ["Next.js", "React", "Server Components", "Architecture", "Performance"]
featured: true
accent: "#bf00ff"
image: "../../assets/blog/server-components-vs-client-components-nextjs.jpg"
imageAlt: "React and Next.js code on developer screen"
---

A client team's Next.js app was shipping 340 KB of JavaScript on a settings page that displayed a username and a toggle. The page was marked `"use client"` at the layout level because someone had added a theme switcher six months earlier. Every child component — including static headers, footers, and data tables that could have rendered on the server — hydrated on the client. Mobile INP was miserable. The CTO asked if Next.js was "worth it."

It was. The architecture wasn't.

React Server Components in Next.js App Router aren't a syntax novelty. They're a boundary decision: what runs on the server, what ships to the browser, and how much JavaScript your users download to read text and click buttons. After shipping four production App Router projects in 2025–2026, I've seen teams get this wrong in predictable ways. This guide is the mental model I teach before we write components.

## The Core Mental Model

**Server Components** render on the server (or at build time). They don't ship JavaScript to the client. They can fetch data directly, access databases and secrets, and render async.

**Client Components** render on the server for initial HTML, then hydrate on the client. They ship JavaScript. They can use state, effects, event handlers, and browser APIs.

```tsx
// Server Component (default in App Router — no directive needed)
// app/dashboard/page.tsx
import { getUser } from "@/lib/db";

export default async function DashboardPage() {
  const user = await getUser(); // direct DB access, no API route
  return <h1>Welcome, {user.name}</h1>;
}
```

```tsx
// Client Component — needs the directive
"use client";

import { useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  return (
    <button onClick={() => setDark(!dark)}>
      {dark ? "Light" : "Dark"} mode
    </button>
  );
}
```

The default is server. You opt into client. That inversion from the Pages Router era trips people up.

## What Server Components Can and Cannot Do

### Can do:

- `async/await` directly in the component
- Fetch from databases, file systems, internal APIs
- Use environment variables without `NEXT_PUBLIC_` prefix
- Import server-only packages (ORM clients, SDKs with secrets)
- Render large dependency trees without adding to client bundle

### Cannot do:

- `useState`, `useEffect`, `useRef`, or any React hooks (except `use` in specific cases)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `localStorage`, `navigator`)
- Custom hooks that depend on the above

If you need interactivity, you need a Client Component. The art is making that island as small as possible.

## The Composition Pattern That Works

Server Components can import and render Client Components. Client Components cannot import Server Components — but they can accept them as `children` or props.

```tsx
// app/settings/page.tsx — Server Component
import { getSettings } from "@/lib/db";
import { SettingsForm } from "./SettingsForm"; // Client Component
import { PageHeader } from "@/components/PageHeader"; // Server Component

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <PageHeader title="Settings" /> {/* stays server */}
      <p>Plan: {settings.plan}</p> {/* stays server */}
      <SettingsForm initialData={settings} /> {/* client island */}
    </div>
  );
}
```

```tsx
// SettingsForm.tsx
"use client";

import { useState } from "react";

export function SettingsForm({ initialData }: { initialData: Settings }) {
  const [name, setName] = useState(initialData.name);
  // interactive form logic
}
```

Data flows server → client as serializable props. The server fetches once, passes JSON, the client hydrates only the form.

### The Children Pattern

When you need a Client Component wrapper around Server Component content:

```tsx
// Modal.tsx — Client Component
"use client";

export function Modal({ children, open, onClose }: ModalProps) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
```

```tsx
// page.tsx — Server Component
import { Modal } from "./Modal";
import { ProductDetails } from "./ProductDetails"; // Server Component

export default async function Page() {
  const product = await getProduct();
  return (
    <Modal open={true} onClose={...}>
      <ProductDetails product={product} />
    </Modal>
  );
}
```

`ProductDetails` renders on the server. Its HTML passes through the client `Modal` as children. No server component imported inside a client file.

## Data Fetching: Server-First

In App Router, fetch in Server Components by default:

```tsx
// app/products/page.tsx
import { db } from "@/lib/db";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name} — ${p.price}</li>
      ))}
    </ul>
  );
}
```

No `useEffect`. No loading state on the client. No waterfall of client-side fetches after hydration.

For client-side refetching (filters, infinite scroll), use React Query or SWR inside Client Components — but keep the initial render on the server:

```tsx
// ProductList.tsx — Client Component for interactivity
"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";

export function ProductList({ initialProducts }: { initialProducts: Product[] }) {
  const [category, setCategory] = useState("all");
  const { data } = useProducts({ category, initialData: initialProducts });
  // ...
}
```

```tsx
// page.tsx
const initialProducts = await getProducts();
return <ProductList initialProducts={initialProducts} />;
```

Users see content immediately. Interactivity layers on without a loading spinner for first paint.

## Common Mistakes I Fix on Client Projects

### Mistake 1: `"use client"` at the layout level

```tsx
// app/dashboard/layout.tsx
"use client"; // ← this poisons the entire subtree

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div>
      <Sidebar open={sidebarOpen} />
      {children}
    </div>
  );
}
```

Every page under `/dashboard` now ships client JavaScript for static content. Fix: extract the interactive sidebar into a Client Component, keep the layout as a Server Component.

```tsx
// app/dashboard/layout.tsx — Server Component
import { Sidebar } from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

```tsx
// Sidebar.tsx
"use client";
// state and interactivity here only
```

### Mistake 2: Fetching in Client Components what the server already has

```tsx
"use client";

export function UserGreeting() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch("/api/user").then(r => r.json()).then(setUser);
  }, []);
  if (!user) return <Skeleton />;
  return <h1>Hi, {user.name}</h1>;
}
```

This pattern made sense in SPAs. In App Router, it's a regression. Fetch on the server, pass the user as a prop.

### Mistake 3: Importing server-only code into Client Components

```tsx
"use client";
import { db } from "@/lib/db"; // ERROR — Prisma in client bundle
```

Next.js will fail the build or leak server code into the client bundle. Keep database access in Server Components and Route Handlers.

### Mistake 4: Over-using Context

React Context requires Client Components. Putting `ThemeProvider`, `AuthProvider`, and `QueryClientProvider` at the root forces large subtrees client-side.

Mitigations:

- Push providers as deep as possible
- Use server-side session checks for auth gating
- Pass theme via CSS variables set server-side when possible

```tsx
// app/layout.tsx
export default async function RootLayout({ children }) {
  const theme = await getUserTheme(); // from cookie, server-side
  return (
    <html data-theme={theme}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Mistake 5: Ignoring loading and error boundaries

Server Components support Suspense natively:

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react";
import { SlowChart } from "./SlowChart";
import { ChartSkeleton } from "./ChartSkeleton";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<ChartSkeleton />}>
        <SlowChart />
      </Suspense>
    </div>
  );
}
```

```tsx
// app/dashboard/error.tsx
"use client";

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

`error.tsx` must be a Client Component (it uses `reset()` interactivity). `loading.tsx` can be a Server Component.

## Route Handlers vs. Server Actions

Two server-side mutation patterns:

**Route Handlers** — traditional API endpoints:

```ts
// app/api/products/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  const product = await db.product.create({ data: body });
  return Response.json(product);
}
```

**Server Actions** — RPC-style mutations called from forms and components:

```tsx
// app/actions.ts
"use server";

import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const name = formData.get("name") as string;
  await db.user.update({ where: { id: userId }, data: { name } });
  revalidatePath("/settings");
}
```

```tsx
// SettingsForm.tsx — can be Server or Client Component
import { updateProfile } from "@/app/actions";

export function SettingsForm() {
  return (
    <form action={updateProfile}>
      <input name="name" />
      <button type="submit">Save</button>
    </form>
  );
}
```

I use Server Actions for form submissions and simple mutations. Route Handlers for webhooks, third-party API consumers, and complex request/response logic.

## Performance Impact: Real Numbers

On a client project (B2B SaaS dashboard), we audited component boundaries:

| Before | After |
|--------|-------|
| Settings page: 340 KB JS | 48 KB JS |
| Dashboard LCP: 2.8s | 1.4s |
| 12 Client Component pages | 3 Client Component pages |

Changes: moved layouts to server, extracted interactive widgets into islands, fetched data in Server Components, removed redundant client-side fetches.

The remaining client JavaScript was actual interactivity: charts, drag-and-drop, modals. Not static text.

## Decision Flowchart

When writing a new component, I ask:

1. **Does it need state, effects, or event handlers?** → Client Component
2. **Does it need browser APIs?** → Client Component
3. **Does it fetch data?** → Server Component (async)
4. **Is it purely presentational with static props?** → Server Component
5. **Does it wrap interactive UI around static content?** → Client wrapper with server children

If unsure, start server. Promote to client only when the compiler or runtime demands it.

## Teaching This to Client Teams

Developers coming from Create React App or Pages Router default to `"use client"` everywhere. I run a 90-minute workshop covering:

1. Default server, opt-in client
2. Composition patterns (children, props)
3. Data fetching on server
4. Layout audit exercise on their actual codebase

The layout audit alone usually finds 30–50% unnecessary client JavaScript. Teams leave with a PR checklist:

- [ ] No `"use client"` in layout files unless absolutely necessary
- [ ] Data fetched in Server Components, passed as props
- [ ] Interactive parts extracted to smallest possible Client Components
- [ ] No `useEffect` for data that could be fetched server-side

## Server Components Aren't Free

Server rendering adds latency for dynamic data. Every server fetch blocks that component's render. Use:

- **Parallel fetching** with `Promise.all`
- **Streaming** with Suspense for slow data
- **Caching** with `fetch` options or `unstable_cache`

```tsx
export default async function Page() {
  const [user, stats, notifications] = await Promise.all([
    getUser(),
    getStats(),
    getNotifications(),
  ]);
  // ...
}
```

```tsx
const getCachedProducts = unstable_cache(
  async () => db.product.findMany(),
  ["products"],
  { revalidate: 60 }
);
```

Don't fetch sequentially in Server Components when requests are independent. That's the new waterfall.

## When Pages Router Still Makes Sense

I still use Pages Router for:

- Legacy codebases where App Router migration isn't justified yet
- Simple projects where the team knows Pages Router and timeline is tight

For new Next.js projects in 2026, App Router with Server Components is the default recommendation — but only if the team commits to learning the model. Half-understood App Router is worse than confident Pages Router.

## Conclusion

Server Components vs. Client Components isn't a framework debate. It's a shipping discipline. The CTO's team didn't have a Next.js problem. They had a boundary problem — client JavaScript everywhere because one interactive feature infected the layout.

The fix is almost always the same: server by default, client at the leaves, data fetched where it's cheapest, and layouts that stay on the server.

Next.js App Router rewards teams that think about the network boundary. Punishes teams that treat it like a SPA with extra steps. Learn the model once, apply it on every component, and your bundle sizes will tell you it's working.


Getting the Server/Client boundary wrong is expensive. If you need that boundary set correctly on an existing App Router app, [hire a Next.js developer](/hire-nextjs-developer) who defaults to the server and promotes only what must hydrate.

## Key Takeaways

- Server Components are the default in App Router — use them unless you need interactivity, hooks, or browser APIs
- Never put `"use client"` at the layout level unless you intend to hydrate the entire subtree
- Fetch data in Server Components and pass serializable props to Client Components — avoid client-side fetch waterfalls
- Client Components can wrap Server Components via `children` props, not direct imports
- Use Server Actions for form mutations; Route Handlers for webhooks and external API consumers
- Audit existing codebases for unnecessary Client Components — layout-level directives are the most common culprit
- Use Suspense and parallel fetching to avoid server-side render waterfalls
- Start server, promote to client only when required — your bundle size is the scorecard
