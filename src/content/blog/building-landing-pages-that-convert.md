---
title: "Building Landing Pages That Convert"
description: "Landing page patterns from real client campaigns—hero structure, CTA placement, social proof, performance, and A/B-ready architecture that drives signups."
publishDate: 2026-03-25
updatedDate: 2026-06-10
category: "Marketing"
tags: ["Landing Pages", "Conversion", "Next.js", "Astro"]
featured: false
accent: "#bf00ff"
image: "../../assets/blog/building-landing-pages-that-convert.jpg"
imageAlt: "Analytics dashboard showing conversion metrics"
---

A US SaaS founder hired me to rebuild their landing page after a paid campaign burned $12,000 in ad spend with a 0.4% conversion rate. The page looked modern—gradient hero, feature grid, testimonial carousel. It also loaded in 4.8 seconds on mobile, buried the signup form below three scroll depths, and used vague copy like "Revolutionize your workflow" that told visitors nothing about what the product actually did.

We relaunched in two weeks. Same ad budget, same traffic source. Conversion rate climbed to 3.2%. The design wasn't dramatically different. The structure, copy hierarchy, performance, and CTA placement were.

Landing pages are where freelance frontend work directly impacts revenue. Over three years building marketing sites with React, Next.js, and Astro for US, UK, and EU clients, I've learned that conversion optimization is mostly engineering discipline applied to persuasion architecture—not tricks, dark patterns, or manipulative urgency timers.

This article covers how I build landing pages that convert, with patterns you can implement on the next client project.

## What Conversion Actually Means

Before touching code, I align with the client on the single primary conversion action:

- Sign up for free trial
- Book a demo call
- Download a lead magnet
- Purchase a product
- Join a waitlist

Every element on the page either supports that action or distracts from it. Secondary actions (blog links, feature deep-dives, social media icons in the hero) get demoted or removed.

On the SaaS rebuild, the primary action was free trial signup. We removed the "Watch demo video" button from the hero—moved it below the fold—and gave the email capture form visual priority. Controversial with the founder, who loved the video. Data supported the change within a week.

**Mistake:** designing landing pages like homepages with equal-weight navigation to every section. Landing pages are single-purpose. The nav should be minimal: logo, maybe one anchor link, and the CTA.

## Above-the-Fold: The Five-Second Test

Visitors decide whether to stay within five seconds. The above-the-fold section must answer:

1. **What is this?** — clear product category
2. **Who is it for?** — target audience signal
3. **What's the benefit?** — outcome, not feature list
4. **What do I do next?** — obvious CTA

```tsx
<section className="relative overflow-hidden px-6 py-20 lg:py-28">
  <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
    <div>
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-brand-500">
        For freelance developers
      </p>
      <h1 className="font-display text-4xl font-bold leading-tight lg:text-5xl">
        Send invoices and get paid in days, not weeks
      </h1>
      <p className="mt-6 text-lg text-white/70">
        Automated payment reminders, Stripe integration, and client portals—
        so you spend less time chasing money and more time shipping code.
      </p>
      <form className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          placeholder="you@company.com"
          aria-label="Email address"
          className="flex-1 rounded-lg border bg-white/5 px-4 py-3"
          required
        />
        <button type="submit" className="rounded-lg bg-brand-500 px-6 py-3 font-semibold">
          Start free trial
        </button>
      </form>
      <p className="mt-3 text-sm text-white/50">
        No credit card required · 14-day free trial
      </p>
    </div>
    <div className="relative">
      <img
        src="/images/product-hero.webp"
        alt="Invoice dashboard showing three paid invoices and one pending payment"
        className="rounded-xl shadow-2xl"
        width={600}
        height={450}
      />
    </div>
  </div>
</section>
```

Notice the headline leads with an outcome ("get paid in days"), not a feature ("invoicing software"). The audience qualifier ("freelance developers") filters visitors early—better for conversion than generic appeal that attracts unqualified clicks.

## CTA Hierarchy and Placement

One primary CTA, styled consistently, repeated at logical scroll points:

| Position | Purpose |
|----------|---------|
| Hero | Capture ready-to-convert visitors |
| After social proof | Convert skeptics who needed validation |
| After features | Convert researchers who needed details |
| Final section | Capture scrollers who read everything |

```tsx
function CtaButton({ children, href = "/signup" }: CtaButtonProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
    >
      {children}
    </a>
  );
}
```

Secondary CTAs use visually subordinate styling—outline buttons, text links:

```tsx
<div className="flex flex-col items-center gap-4 sm:flex-row">
  <CtaButton>Start free trial</CtaButton>
  <a href="/demo" className="text-sm font-medium text-white/70 underline-offset-4 hover:underline">
    Watch 2-min demo →
  </a>
</div>
```

**Anti-pattern:** multiple competing primary buttons in the same viewport. "Sign up" and "Book demo" and "Contact sales" all styled as filled buttons creates decision paralysis. Pick one primary action per viewport height.

## Social Proof That Builds Trust

Generic "Trusted by thousands" means nothing. Specific social proof converts:

```tsx
<section className="border-y border-white/10 bg-white/[0.02] py-12">
  <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-white/50">
    Used by 2,400+ freelance developers in 38 countries
  </p>
  <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
    {logos.map((logo) => (
      <img key={logo.name} src={logo.src} alt={logo.name} className="h-8 w-auto" />
    ))}
  </div>
</section>
```

Testimonials need specificity—name, role, company, and a concrete result:

```tsx
<blockquote className="rounded-xl border bg-white/[0.03] p-8">
  <p className="text-lg leading-relaxed text-white/80">
    "I used to spend 6 hours a month chasing late payments. After switching,
    my average collection time dropped from 34 days to 11. I actually got paid
    before my credit card bill was due for the first time in two years."
  </p>
  <footer className="mt-6 flex items-center gap-4">
    <img src="/testimonials/sarah.jpg" alt="" className="h-12 w-12 rounded-full" />
    <div>
      <cite className="font-semibold not-italic">Sarah Chen</cite>
      <p className="text-sm text-white/50">Independent React developer, Austin</p>
    </div>
  </footer>
</blockquote>
```

On a UK coaching client's landing page, swapping generic testimonials for ones with specific metrics ("increased client inquiries by 40% in 6 weeks") improved form submissions measurably in a two-week A/B test.

## Feature Sections: Benefits Before Bullets

Feature grids fail when they list capabilities without connecting to outcomes. My structure for each feature block:

1. **Benefit headline** — what the user gains
2. **Supporting detail** — how the feature delivers it
3. **Visual** — screenshot, illustration, or icon
4. **Optional proof** — stat, mini-testimonial, or integration logo

```tsx
const features = [
  {
    headline: "Get paid without awkward follow-ups",
    description:
      "Automated reminders go out at 3, 7, and 14 days. You stay professional; the system stays persistent.",
    image: "/features/reminders.webp",
    imageAlt: "Automated payment reminder email preview",
  },
  {
    headline: "Clients pay in one click",
    description:
      "Stripe-powered payment links in every invoice. No account creation required for your clients.",
    image: "/features/payment-link.webp",
    imageAlt: "One-click payment button on client invoice portal",
  },
];
```

Three to five features above the fold depth. More than seven and visitors stop reading. If the product has twenty features, the landing page shows five and links to a features page for the rest.

## Performance as a Conversion Factor

Every 100ms of load time impacts conversion. Google's research consistently shows bounce rates increase as load time grows. For landing pages—especially paid traffic—performance isn't a nice-to-have.

My landing page performance checklist:

- **LCP under 2.5s** — hero image optimized, preloaded, correctly sized
- **INP under 200ms** — minimal JavaScript on initial load
- **CLS near zero** — explicit image dimensions, font display swap
- **Total page weight under 1MB** for above-the-fold content

```tsx
// Next.js hero image optimization
import Image from "next/image";

<Image
  src="/hero.webp"
  alt="Product dashboard"
  width={1200}
  height={800}
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
  className="rounded-xl"
/>
```

For the SaaS rebuild, switching from a client-rendered hero animation (Framer Motion, 180KB JS) to a CSS fade-in with a static WebP image cut LCP from 4.8s to 1.6s on 4G. That change alone likely contributed more to conversion than any copy edit.

**Astro advantage:** for pure marketing landing pages with minimal interactivity, Astro ships zero JavaScript by default. I've built campaign landing pages in Astro that score 100 on Lighthouse performance with zero optimization hacks.

## Mobile-First Is Non-Negotiable for Paid Traffic

Over 60% of paid ad traffic lands on mobile for most B2C and many B2B campaigns. Mobile landing pages need:

- Thumb-reachable CTAs (not top-right corner buttons)
- Forms with large touch targets (minimum 44px height)
- Single-column layouts without horizontal scroll
- Click-to-call for high-touch sales pages
- Reduced content density—shorter headlines, fewer features above fold

```tsx
{/* Sticky mobile CTA bar */}
<div className="fixed inset-x-0 bottom-0 z-50 border-t bg-surface/95 p-4 backdrop-blur lg:hidden">
  <CtaButton className="w-full">Start free trial</CtaButton>
</div>
```

Sticky mobile CTAs increased tap-through on a EU e-commerce campaign landing page by 18% in client analytics. Some designers find them aggressive; I include them when the data supports it and the CTA is genuinely useful—not manipulative.

## Building for A/B Testing from Day One

Clients always say "we might A/B test later." Later rarely comes if the page isn't structured for it. I build landing pages with swappable sections:

```tsx
// content/landing/homepage.ts
export const heroVariants = {
  control: {
    headline: "Send invoices and get paid in days, not weeks",
    subheadline: "Automated payment reminders, Stripe integration, and client portals.",
    cta: "Start free trial",
  },
  variant_b: {
    headline: "Stop chasing clients for payment",
    subheadline: "Freelancers using PayFlow collect 2.3x faster on average.",
    cta: "Try it free for 14 days",
  },
};

// pages/index.tsx
const variant = getAbVariant("hero"); // from cookie, query param, or analytics tool
const hero = heroVariants[variant];

<HeroSection {...hero} />
```

Section components accept content via props or content files—not hardcoded strings in JSX. This lets marketing swap copy without developer involvement and enables tools like Vercel Edge Config, Optimizely, or simple query-param variants.

## Analytics and Event Tracking

A landing page without measurement is a guess. Minimum tracking I implement:

```typescript
// lib/analytics.ts
export function trackEvent(name: string, properties?: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.plausible?.(name, { props: properties });
  // or gtag, posthog, etc.
}

// CTA click
<button
  onClick={() => trackEvent("cta_click", { location: "hero", variant: "primary" })}
>
  Start free trial
</button>

// Form submission
trackEvent("signup_submit", { source: "landing_hero" });
```

Events I always track:
- `cta_click` with location property (hero, sticky, footer)
- `form_start` and `form_submit` (or `form_error`)
- `scroll_depth` at 25%, 50%, 75%, 100%
- `outbound_click` on demo/video links

Privacy-conscious EU clients often prefer Plausible or Fathom over Google Analytics. I implement whatever they use—consistently, from launch day.

## Real Project Scenario: Product Launch Landing Page

A EU fintech startup needed a launch page for a waitlist campaign. Budget: two weeks. Stack: Astro + Tailwind. Goal: 1,000 waitlist signups in 30 days.

**Structure:**
1. Hero with waitlist email capture
2. Problem statement (3 pain points)
3. Product preview (animated screenshot, CSS only)
4. Social proof (advisor logos, early access user count)
5. FAQ (4 questions addressing objections)
6. Final CTA

**Technical decisions:**
- Astro for zero-JS static delivery
- Form submission to ConvertKit via API route
- WebP images, subset fonts (Inter 400, 600 only)
- Open Graph images auto-generated per deploy

**Results:**
- Lighthouse: 100 performance, 100 accessibility
- 1,400 waitlist signups in 30 days (40% above goal)
- 2.1s LCP on mobile median (Vercel analytics)

The founder attributed success to clear problem-solution copy and fast load times on mobile Instagram traffic. The page wasn't fancy. It was focused.

## Common Landing Page Mistakes

**Clever over clear.** Puns and brand voice are fine below the fold. The headline should be understood instantly.

**Feature dumping.** Listing every capability overwhelms visitors. Curate ruthlessly.

**Slow hero animations.** Fade-in effects that delay content visibility hurt LCP. Animate opacity on already-visible content, or skip animation on mobile.

**No objection handling.** FAQ sections exist to address "but what about security/pricing/cancellation" before visitors leave. Four to six questions, honest answers.

**Hidden pricing signals.** Even "starting at $29/mo" in the hero subtext filters unqualified leads and builds trust. "Contact for pricing" on a self-serve SaaS landing page kills conversion.

**Ignoring form friction.** Every form field reduces completion. Email-only for top-of-funnel. Collect details after signup.

## Legal and Trust Elements

EU and UK pages often need:

- Cookie consent before non-essential tracking
- Privacy policy link near forms
- GDPR-compliant data processing language
- Company registration details in footer

US pages often need:

- Terms of service and privacy policy links
- CAN-SPAM compliant email opt-in language
- Accessibility statement for enterprise prospects

These aren't conversion killers—they're trust signals for informed visitors:

```tsx
<p className="mt-3 text-xs text-white/40">
  By signing up, you agree to our{" "}
  <a href="/privacy" className="underline">Privacy Policy</a>.
  We'll never sell your data.
</p>
```

## Conclusion

Landing pages that convert aren't built on tricks—they're built on clarity, speed, and structure. One primary action. A hero that passes the five-second test. Social proof with specifics. Features framed as benefits. Performance under 2.5s LCP. Mobile-first layout. Analytics from day one.

The SaaS founder who burned $12,000 on a beautiful but slow page learned that frontend decisions are business decisions. When I build landing pages now—for startups, agencies, or established companies—I treat every millisecond and every headline word as part of the conversion architecture.

That's the difference between a page that looks good in a portfolio and a page that shows up in revenue reports.


Converting landing designs into fast, testable pages is exactly the job of a [Figma to code developer](/figma-to-code-developer) — and when paid traffic is on the line, pair that build with [landing page optimization](/landing-page-optimization) and [website performance optimization](/website-performance-optimization).


Founders shipping first landers and pricing pages often need a [frontend developer for startups](/frontend-developer-for-startups) who balances speed-to-learn with Core Web Vitals — not a six-month design system project.

## Key Takeaways

- Define one primary conversion action; every element supports it or gets removed
- Above-the-fold must answer what, who, benefit, and next step within five seconds
- Use one visually dominant CTA style; repeat at hero, post-proof, post-features, and footer
- Social proof needs specifics—numbers, names, roles, and measurable outcomes
- Frame features as benefits; limit to 3-5 above significant scroll depth
- Target LCP under 2.5s—optimize hero images, minimize JS, consider Astro for static pages
- Design mobile-first with thumb-reachable CTAs and optional sticky mobile CTA bars
- Structure content for A/B testing with swappable props and content files, not hardcoded copy
- Track CTA clicks, form events, and scroll depth from launch day
- Handle objections in FAQ sections; include legal/trust elements near forms for EU/UK compliance
