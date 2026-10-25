---
title: "How I Build Fast React Applications"
description: "A production playbook for React performance — architecture, code splitting, state boundaries, and profiling lessons from client projects across the US, UK, and Europe."
publishDate: 2025-03-22
updatedDate: 2026-06-11
category: "React"
tags: ["React", "Performance", "Architecture", "TypeScript", "Profiling"]
featured: false
accent: "#bf00ff"
image: "../../assets/blog/fast-react-applications.jpg"
imageAlt: "React code on a development screen with performance profiling tools"
---

A London fintech client called me three weeks before launch because their React dashboard felt "sticky." Not broken — sticky. Dropdowns lagged. Tables stuttered when filters changed. Lighthouse showed decent scores, but real users on corporate laptops were complaining.

The problem wasn't one slow component. It was death by a thousand re-renders: global context updates, unmemoized table rows, and a charting library loaded on every route. We fixed it without rewriting the app. That project shaped how I approach React performance on every client build since.

Performance in React isn't a pre-launch checkbox. It's an architectural decision you make when you choose where state lives, how you split bundles, and what you measure in production.

## Why React Apps Get Slow

React is fast at updating the DOM. What hurts is doing too much work before the update happens.

In practice, slowness usually comes from:

1. **Unnecessary re-renders** — parent state changes cascade through large trees
2. **Heavy synchronous work on the main thread** — parsing, filtering, chart calculations
3. **Oversized JavaScript bundles** — users download code for routes they never visit
4. **Waterfalls** — serial data fetching that blocks rendering
5. **Third-party scripts** — analytics, chat widgets, A/B testing layers

The fix is never "add `memo` everywhere." You profile, find the actual bottleneck, and apply the smallest change that moves user-facing metrics.

## Start With Architecture, Not Micro-Optimizations

On a US-based logistics SaaS project, the team had already sprinkled `useMemo` across 40 files. INP was still poor. The real issue was a single `AppProvider` that held user, permissions, filters, and UI preferences. Every filter keystroke re-rendered the entire authenticated layout.

We split context by update frequency:

```tsx
// contexts/AuthContext.tsx — changes rarely
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// contexts/FilterContext.tsx — changes often, scoped to list views
export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const value = useMemo(() => ({ filters, setFilters }), [filters]);
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
```

Then we wrapped the layout so filters only wrapped the routes that needed them — not the settings page, not the billing page.

**Rule I follow:** state should live as close as possible to where it's used. Lift only when multiple siblings genuinely need the same data at the same time.

## Component Boundaries That Contain Re-Renders

Split components by how often they update, not by how the Figma file is organized.

```tsx
// Slow-changing shell
function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// Fast-changing data island
const LiveShipmentCount = memo(function LiveShipmentCount({
  count,
}: {
  count: number;
}) {
  return (
    <p className="font-mono text-sm text-cyan-300" aria-live="polite">
      {count.toLocaleString()} active shipments
    </p>
  );
});
```

For a German e-commerce admin panel, virtualizing a 3,000-row order table with `@tanstack/react-virtual` dropped interaction time more than any memoization pass. We rendered ~20 DOM nodes instead of 3,000.

## Code Splitting at Route and Feature Level

Users should not download the admin analytics bundle to view a marketing landing page.

```tsx
import { lazy, Suspense } from "react";

const AdminAnalytics = lazy(() => import("./AdminAnalytics"));
const ExportWizard = lazy(() => import("./ExportWizard"));

export function AdminRoutes() {
  return (
    <Suspense fallback={<RouteSkeleton label="Loading analytics" />}>
      <Routes>
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/export" element={<ExportWizard />} />
      </Routes>
    </Suspense>
  );
}
```

In Next.js App Router projects, I keep Server Components as the default and push `"use client"` only to interactive leaves — date pickers, modals, drag-and-drop boards. That pattern alone reduced client JS on a UK agency site by roughly 40%.

**Performance consideration:** each lazy boundary needs a meaningful fallback. A blank screen feels broken; a skeleton that matches layout feels fast even when load time is identical.

## Data Fetching Without Waterfalls

Serial fetching is silent performance debt.

```tsx
// Bad: waterfall — user waits for A, then B, then C
const user = await fetchUser(id);
const org = await fetchOrg(user.orgId);
const projects = await fetchProjects(org.id);

// Better: parallel where dependencies allow
const user = await fetchUser(id);
const [org, preferences] = await Promise.all([
  fetchOrg(user.orgId),
  fetchPreferences(id),
]);
```

In React 19 / Next.js projects, I use Suspense boundaries around independent data regions so one slow widget doesn't block the entire page shell.

For client-side React (Vite + React Router), TanStack Query with stale-while-revalidate gives instant cached renders while background refetches keep data fresh. On a EU marketplace dashboard, showing cached inventory counts immediately while refreshing in the background cut perceived load time dramatically.

## Memoization: Targeted, Not Blanket

`useMemo`, `useCallback`, and `memo` have a cost — React still compares dependencies. Use them when profiling shows a problem.

```tsx
const filteredOrders = useMemo(() => {
  return orders.filter((order) => matchesFilters(order, filters));
}, [orders, filters]);

const handleStatusChange = useCallback(
  (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  },
  [updateOrderStatus],
);

const OrderRow = memo(function OrderRow({ order, onStatusChange }: OrderRowProps) {
  return (
    <tr>
      <td>{order.reference}</td>
      <td>
        <StatusSelect value={order.status} onChange={(s) => onStatusChange(order.id, s)} />
      </td>
    </tr>
  );
});
```

I memo list rows when the parent re-renders often but row data is stable. I skip memo on static marketing sections — the comparison overhead isn't worth it.

## Measuring What Users Actually Feel

Lab scores lie sometimes. Field data tells the truth.

```tsx
import { onINP, onLCP, onCLS } from "web-vitals";

function report(metric: Metric) {
  // Send to your analytics endpoint
  navigator.sendBeacon("/api/vitals", JSON.stringify(metric));
}

onINP(report);
onLCP(report);
onCLS(report);
```

React DevTools Profiler shows which components re-rendered and why. Chrome Performance panel shows long tasks blocking the main thread. I run both before and after changes on throttled CPU (4× slowdown) to simulate real devices.

For a US healthcare portal, INP dropped from 340ms to 120ms after we moved filter computation to a Web Worker. LCP was already fine — the issue was interaction latency, not loading.

## Common Mistakes I See on Client Audits

**Putting everything in global context.** If your root provider has more than three concerns, split it.

**Fetching in `useEffect` without caching.** Every navigation refetches the same user profile. Use TanStack Query, SWR, or Remix/Next loaders.

**Animating layout properties.** `width`, `height`, and `top` trigger layout. Use `transform` and `opacity`.

**Shipping chart libraries on every page.** Recharts, Chart.js, and D3 are heavy. Lazy-load per route.

**Ignoring list keys.** Unstable keys cause full list re-mounts. Never use array index for dynamic sorted lists.

**Over-using client components in Next.js.** If it doesn't need browser APIs or event handlers, it probably doesn't need `"use client"`.

## Best Practices I Ship on Every React Project

1. **Route-level code splitting** for any feature over ~15KB gzipped
2. **Colocated state** with context scoped to subtrees
3. **Virtualized lists** above ~100 interactive rows
4. **Skeleton loaders** that match final layout dimensions (helps CLS)
5. **Error boundaries** per feature area so one widget crash doesn't white-screen the app
6. **TypeScript strict mode** — catches prop drilling mistakes that cause unnecessary renders
7. **Bundle analysis** in CI (`rollup-plugin-visualizer` or `@next/bundle-analyzer`)

## Performance Considerations for Production

- **Prefetch** likely next routes on hover/focus for internal links
- **Debounce** search inputs; don't filter 10,000 items on every keystroke without virtualization
- **Compress API payloads** — sometimes the slow part isn't React, it's parsing 2MB of JSON
- **Set `content-visibility: auto`** on below-fold sections in content-heavy pages
- **Preconnect** to API and CDN origins in `<head>`

## SEO and Accessibility Tie-Ins

Fast React apps rank better because Core Web Vitals are ranking signals. But speed also helps accessibility:

- Keyboard users feel laggy focus states immediately
- Screen reader users suffer when dynamic updates flood `aria-live` regions
- Motion-sensitive users need `prefers-reduced-motion` respected in animated components

```tsx
function ExpandablePanel({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? "auto" : 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
    >
      {children}
    </motion.div>
  );
}
```

Server-rendered HTML (Next.js, Remix) also gives crawlers content without waiting for hydration — important for marketing pages and blogs.

## A Real Refactor Timeline

On that London fintech dashboard, we spent:

- **Day 1:** Profile with React DevTools + field INP data
- **Day 2:** Split context, virtualize table
- **Day 3:** Lazy-load charts and export module
- **Day 4:** QA on throttled devices, deploy behind feature flag

Total: four days. No rewrite. INP went from "needs improvement" to "good" in CrUX within three weeks.

That's the outcome I optimize for — measurable user impact, not theoretical purity.

## Tooling I Add on Day One

Every React client project gets:

- **ESLint** with `eslint-plugin-react-hooks` — catches missing dependencies
- **Bundle analyzer** in CI on main branch merges
- **Web Vitals reporting** to staging before production
- **React Query Devtools** in development only

These aren't performance fixes themselves — they make performance visible before users complain.

## When to Reach for React Server Components

If the project is Next.js App Router, I default to Server Components for data fetching and static structure. Client Components only where interactivity is required. On a UK legal tech site, moving document listing to Server Components cut client JS by 52KB and improved LCP by 0.8 seconds on 4G.

For Vite SPAs without SSR, the equivalent is route-based code splitting and aggressive lazy loading — you don't get Server Components, but you can still minimize what hydrates on first paint.

## Bundle Budget Example From a Client Proposal

I document JS budgets in proposals so stakeholders understand tradeoffs:

| Route | Budget (gzipped) | Notes |
|-------|------------------|-------|
| Marketing home | < 80KB | Astro or RSC-heavy |
| Login | < 120KB | Minimal MUI or custom form |
| Dashboard | < 250KB | DataGrid lazy-loaded |
| Analytics | < 350KB | Charts on demand |

When a feature threatens the budget, we discuss: lazy load, server-render, or descope. Performance becomes a product conversation, not a post-launch surprise.

## Conclusion

Fast React applications come from intentional architecture: scoped state, split bundles, parallel data fetching, and profiling-driven memoization. The framework is rarely the bottleneck. How you structure updates and load code is.

When a client asks me to "make it faster," I don't reach for a new library. I find what's re-rendering, what's blocking the main thread, and what's shipping unnecessarily. Fix those three, and users notice.


Want those performance habits applied to your product UI? [Hire a React developer](/hire-react-developer) who profiles before optimizing — or pair implementation with a [website performance optimization](/website-performance-optimization) pass when CWV is already failing in the field.

## Key Takeaways

- Split context and state by update frequency — don't store everything at the root
- Code-split at route and heavy-feature boundaries with meaningful Suspense fallbacks
- Profile with React DevTools and field Core Web Vitals before optimizing
- Virtualize long lists; lazy-load heavy libraries like charts
- Parallelize independent data fetches; avoid `useEffect` waterfalls
- Use memoization surgically after identifying real re-render problems
- Fast interactions (INP) matter as much as fast loads (LCP) for SaaS and dashboards
