---
title: "JavaScript Performance Best Practices for Modern Web Apps"
description: "JavaScript performance tactics from production client apps—bundle size, hydration, memoization, lazy loading, and profiling workflows that fix real bottlenecks."
publishDate: 2026-05-06
updatedDate: 2026-06-10
category: "Performance"
tags: ["JavaScript", "Performance", "React", "Next.js"]
featured: true
accent: "#f7df1e"
image: "../../assets/blog/javascript-performance-best-practices.jpg"
imageAlt: "JavaScript code on a developer monitor"
---

A US analytics startup hired me to investigate why their React dashboard felt sluggish. Lighthouse said 87 performance—not terrible. Users said typing in the search filter had noticeable lag. Opening the settings panel caused a half-second freeze. The engineering lead suspected the backend. Profiling told a different story: 340KB of JavaScript executing on every page load, a chart library imported globally, and a `useEffect` that re-ran a data transformation on every keystroke across 10,000 rows.

We didn't rewrite the app. Over three weeks, we cut the initial JS bundle by 62%, fixed the filter debounce, virtualized the data table, and moved chart rendering behind a dynamic import. INP dropped from 480ms to 120ms. The search filter felt instant. The lead engineer said it was the first performance improvement users actually noticed.

JavaScript performance is where frontend engineering directly affects user experience—not in abstract benchmark scores, but in whether interactions feel responsive. This article covers the JavaScript performance practices I implement on React, Next.js, and Astro projects for clients across US, UK, and EU markets.

## Understanding the Modern Performance Model

The metrics that matter for JavaScript performance shifted with Core Web Vitals updates:

- **INP (Interaction to Next Paint)** — replaces FID; measures responsiveness across all interactions, not just the first
- **TBT (Total Blocking Time)** — lab metric correlating with main-thread congestion
- **Bundle size** — not a Core Web Vital, but the primary driver of parse and compile time

JavaScript hurts performance in four ways:

1. **Download time** — bytes over the network
2. **Parse and compile** — CPU cost before code runs
3. **Execution** — running code blocks the main thread
4. **Hydration** — React attaching event listeners to server-rendered HTML

Fixing performance requires knowing which of these is the bottleneck. I start every investigation with Chrome DevTools Performance panel and the React Profiler—not guesswork.

## Measure Before Optimizing

The most expensive mistake in JavaScript performance is optimizing the wrong thing. My profiling workflow:

**Step 1: Bundle analysis**

```bash
# Next.js
npx @next/bundle-analyzer

# Vite/Astro
npx vite-bundle-visualizer
```

Identify the largest dependencies. On the analytics dashboard, `@mui/material` (unused but imported), `moment.js` (imported for one date format), and `recharts` (imported globally) accounted for 180KB of unnecessary JavaScript.

**Step 2: Runtime profiling**

1. Open Chrome DevTools → Performance
2. Start recording
3. Perform the slow interaction (type in search, open modal, scroll table)
4. Stop recording
5. Look for long tasks (red bars over 50ms) and identify the function calls

**Step 3: React Profiler**

```tsx
import { Profiler } from "react";

function onRenderCallback(id, phase, actualDuration) {
  if (actualDuration > 16) {
    console.warn(`Slow render: ${id} took ${actualDuration.toFixed(1)}ms (${phase})`);
  }
}

<Profiler id="DataTable" onRender={onRenderCallback}>
  <DataTable rows={data} />
</Profiler>
```

Components rendering over 16ms (one frame at 60fps) get investigated. Data from the Profiler—not intuition—drives what I optimize.

## Bundle Size: The First Lever

Smaller bundles mean faster download, parse, and compile. Strategies ranked by impact:

### Dynamic Imports for Heavy Dependencies

```tsx
// Bad — chart library in main bundle
import { LineChart, Line, XAxis, YAxis } from "recharts";

export function Dashboard() {
  return <LineChart data={data}>...</LineChart>;
}

// Good — loaded only when dashboard tab is active
import dynamic from "next/dynamic";
import { Suspense } from "react";

const LineChart = dynamic(() => import("@/components/charts/RevenueChart"), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <TabBar active={activeTab} onChange={setActiveTab} />
      {activeTab === "revenue" && (
        <Suspense fallback={<ChartSkeleton />}>
          <LineChart data={data} />
        </Suspense>
      )}
    </div>
  );
}
```

On the analytics dashboard, dynamic importing `recharts` alone saved 95KB from the initial bundle.

### Tree-Shaking Friendly Imports

```tsx
// Bad — imports entire lodash (70KB+)
import _ from "lodash";
const sorted = _.sortBy(items, "name");

// Good — imports only what's needed
import sortBy from "lodash/sortBy";
const sorted = sortBy(items, "name");

// Better — native JS for simple operations
const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
```

```tsx
// Bad — imports all MUI icons
import * as Icons from "@mui/icons-material";

// Good — per-icon import
import SearchIcon from "@mui/icons-material/Search";
```

I audit `package.json` dependencies quarterly on long-term client projects. Libraries that crept in for one feature but pull 50KB+ get replaced or dynamically imported.

### Route-Based Code Splitting

Next.js App Router code-splits by route automatically. React Router projects need manual lazy routes:

```tsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Settings = lazy(() => import("@/pages/Settings"));
const Reports = lazy(() => import("@/pages/Reports"));

export function AppRoutes() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Suspense>
  );
}
```

Users visiting `/dashboard` shouldn't download the JavaScript for `/reports`. Route splitting is free performance on multi-page apps.

## Hydration: The Hidden Cost in React

Server-rendered React apps pay a hydration tax—client JavaScript must match server HTML and attach interactivity. Strategies to reduce it:

### Server Components by Default (Next.js App Router)

```tsx
// app/products/page.tsx — Server Component, zero client JS
import { getProducts } from "@/lib/api";
import { ProductGrid } from "@/components/ProductGrid";

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}
```

```tsx
// components/ProductGrid.tsx — Client only where needed
"use client";

export function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState("");
  // interactive filtering logic
}
```

Push `"use client"` to the leaves of the component tree, not the trunk. A page that only needs interactivity on a filter input shouldn't hydrate the entire product grid wrapper.

### Selective Hydration with Astro Islands

For content-heavy sites with interactive widgets, Astro's island architecture ships JavaScript only for interactive components:

```astro
---
import StaticContent from "@/components/StaticContent.astro";
import InteractiveChart from "@/components/InteractiveChart.tsx";
---

<StaticContent />
<InteractiveChart client:visible data={chartData} />
```

`client:visible` hydrates the chart only when it scrolls into view. The rest of the page ships zero JavaScript. I've used this on marketing sites where a single interactive calculator was the only client-side requirement.

### Avoid Hydration Mismatches

Mismatches force React to re-render client-side, doubling work:

```tsx
// Bad — different output server vs client
function Greeting() {
  const hour = new Date().getHours();
  return <p>{hour < 12 ? "Good morning" : "Good afternoon"}</p>;
}

// Good — defer to client after mount
function Greeting() {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : "Good afternoon");
  }, []);

  return <p>{greeting}</p>;
}
```

## Memoization: When It Helps and When It Hurts

`useMemo`, `useCallback`, and `React.memo` are tools—not defaults. Premature memoization adds complexity and can hurt performance by preventing garbage collection of stale closures.

**Use memoization when:**

- A computation is genuinely expensive (sorting thousands of rows, complex filtering)
- A child component re-renders unnecessarily due to unstable references passed as props
- Profiling confirms a render bottleneck

```tsx
// Expensive filter across large dataset — memoize
const filteredRows = useMemo(() => {
  return rows.filter((row) =>
    row.name.toLowerCase().includes(query.toLowerCase())
  );
}, [rows, query]);

// Stable callback for memoized child
const handleSort = useCallback((column: string) => {
  setSortKey(column);
}, []);
```

**Don't memoize when:**

- The computation is trivial (string concatenation, simple math)
- The component renders in under 1ms
- You haven't profiled and confirmed a problem

```tsx
// Unnecessary — this is nanoseconds
const fullName = useMemo(() => `${first} ${last}`, [first, last]);
```

On the analytics dashboard, `useMemo` on the filter transformation was appropriate—10,000 rows filtered on every keystroke without it. Adding `React.memo` to every child component was not—it added comparison overhead without measurable benefit.

### Debounce and Throttle User Input

The search lag users reported was a missing debounce:

```tsx
import { useState, useMemo } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function SearchFilter({ rows, onFilter }: SearchFilterProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 200);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return rows;
    const lower = debouncedQuery.toLowerCase();
    return rows.filter((row) => row.name.toLowerCase().includes(lower));
  }, [rows, debouncedQuery]);

  useEffect(() => {
    onFilter(filtered);
  }, [filtered, onFilter]);

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

```typescript
// hooks/useDebouncedValue.ts
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

200ms debounce on search input is imperceptible to users but prevents running expensive filters 10 times per second during fast typing.

## Virtualization for Large Lists

Rendering 10,000 DOM nodes kills performance regardless of how optimized your React components are. Virtualization renders only visible rows:

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

export function VirtualTable({ rows }: { rows: Row[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: "absolute",
              top: 0,
              transform: `translateY(${virtualRow.start}px)`,
              height: `${virtualRow.size}px`,
              width: "100%",
            }}
          >
            <TableRow row={rows[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

The analytics dashboard table went from rendering 10,000 rows (DOM nodes: 60,000+) to rendering ~25 visible rows. Scroll performance went from janky to smooth. Initial render dropped from 800ms to 40ms.

**Rule of thumb:** virtualize lists over 100 items with complex row rendering; over 500 items regardless of complexity.

## Event Handler and Listener Discipline

Leaky event listeners and expensive handlers accumulate in long-lived SPAs:

```tsx
// Bad — new function and listener every render
useEffect(() => {
  window.addEventListener("scroll", () => {
    setScrollY(window.scrollY);
  });
});

// Good — stable handler, proper cleanup
useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY);
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

Use `{ passive: true }` on scroll and touch listeners—tells the browser you won't call `preventDefault()`, enabling scroll optimization.

For high-frequency events, throttle with `requestAnimationFrame`:

```typescript
function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current!);
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current!);
    };
  }, []);

  return scrollY;
}
```

## Web Workers for Heavy Computation

When computation can't be debounced or memoized away, move it off the main thread:

```typescript
// workers/filter.worker.ts
self.onmessage = (e: MessageEvent<{ rows: Row[]; query: string }>) => {
  const { rows, query } = e.data;
  const lower = query.toLowerCase();
  const filtered = rows.filter((row) => row.name.toLowerCase().includes(lower));
  self.postMessage(filtered);
};
```

```tsx
const workerRef = useRef<Worker>();

useEffect(() => {
  workerRef.current = new Worker(
    new URL("@/workers/filter.worker.ts", import.meta.url)
  );
  workerRef.current.onmessage = (e) => setFilteredRows(e.data);
  return () => workerRef.current?.terminate();
}, []);

const handleSearch = (query: string) => {
  workerRef.current?.postMessage({ rows, query });
};
```

I use web workers sparingly—only when profiling shows main-thread computation over 50ms that can't be reduced algorithmically. CSV parsing, complex data aggregation, and image processing are common candidates.

## Third-Party Script Management

Client sites often load analytics, chat widgets, A/B testing, and heatmaps—each adding JavaScript you don't control.

```tsx
// Next.js Script component with loading strategy
import Script from "next/script";

<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"
  strategy="afterInteractive"
/>

<Script
  src="https://widget.intercom.io/widget/xxx"
  strategy="lazyOnload"
/>
```

**Loading strategies ranked by performance impact:**

1. `beforeInteractive` — only for critical scripts (rare)
2. `afterInteractive` — analytics after page is usable
3. `lazyOnload` — chat widgets, heatmaps, non-essential tools
4. Self-hosted with dynamic import — maximum control

On a EU client's site, deferring Intercom from `afterInteractive` to `lazyOnload` improved INP by 80ms. Users who needed chat waited two extra seconds; most users never noticed because they never opened chat.

Audit third-party scripts quarterly. I've removed "zombie" tracking pixels that agencies installed years ago and nobody remembered.

## Real Project Scenario: E-Commerce Product Filter

A UK fashion retailer had a product listing page with 2,400 items, client-side filtering by size/color/price, and a 890ms INP when toggling filters. Stack: Next.js, React, Tailwind.

**Diagnosis:**
- Entire product catalog loaded as JSON on page load (1.2MB)
- Filter re-rendered all 2,400 product cards on every toggle
- No memoization on filter logic
- Framer Motion animations on every card

**Fixes over two weeks:**

1. **Paginated API** — load 48 products per page, server-side filter params
2. **URL-based filters** — `?color=blue&size=m` for shareable, cacheable states
3. **Memoized filter logic** on client-side remaining filters
4. **Removed per-card animations** — CSS transition on hover only
5. **Dynamic import** for filter sidebar on mobile

```tsx
// Server-side filtering with search params
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { color?: string; size?: string; page?: string };
}) {
  const products = await getProducts({
    color: searchParams.color,
    size: searchParams.size,
    page: Number(searchParams.page) || 1,
    limit: 48,
  });

  return (
    <>
      <FilterSidebar />
      <ProductGrid products={products} />
      <Pagination total={products.totalPages} current={products.page} />
    </>
  );
}
```

**Results:**
- Initial JSON payload: 1.2MB → 45KB
- INP on filter toggle: 890ms → 95ms
- Lighthouse performance: 54 → 88

## Performance Budgets in CI

Preventing regression matters as much as fixing current issues:

```javascript
// next.config.ts with bundle size limits
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "@mui/icons-material"],
  },
};
```

```yaml
# GitHub Actions performance check
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v11
  with:
    configPath: "./lighthouserc.js"
    uploadArtifacts: true
```

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    assert: {
      assertions: {
        "interaction-to-next-paint": ["error", { maxNumericValue: 200 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
      },
    },
  },
};
```

Performance budgets fail PRs that regress metrics. Teams learn to check bundle size before merging dependency additions.

## Conclusion

JavaScript performance isn't about micro-optimizing every function. It's about measuring real bottlenecks, reducing what ships to the browser, deferring what isn't immediately needed, and keeping the main thread free for user interactions.

The analytics dashboard users didn't care that Lighthouse improved from 87 to 94. They cared that search felt instant and settings opened without freezing. That came from bundle analysis, debounced input, virtualized tables, and dynamic imports—practical techniques applied where profiling showed they mattered.

Every kilobyte of JavaScript is a tax on your users' devices and attention. Ship less. Measure everything. Optimize what profiling proves is slow.


Bundle size and long tasks are product problems as much as framework ones. For site-wide CWV recovery, use [website performance optimization](/website-performance-optimization); for React-heavy UI, [hire a React developer](/hire-react-developer) who profiles before guessing.

## Key Takeaways

- Profile before optimizing—bundle analyzer for download cost, DevTools Performance for runtime, React Profiler for render bottlenecks
- Dynamic import heavy dependencies (charts, editors, maps) behind user actions or tab switches
- Import tree-shakeable modules (`lodash/sortBy`, per-icon imports) and audit dependencies quarterly
- Push `"use client"` to component leaves; use Server Components and Astro islands to minimize hydration
- Memoize only expensive computations confirmed by profiling—not every value and callback
- Debounce search and filter inputs (200ms) to prevent expensive operations on every keystroke
- Virtualize lists over 100-500+ items with `@tanstack/react-virtual` or equivalent
- Use `{ passive: true }` on scroll listeners; throttle high-frequency events with `requestAnimationFrame`
- Defer third-party scripts (chat, heatmaps) to `lazyOnload`; audit and remove unused tracking
- Set performance budgets in CI to prevent regression on INP, TBT, and bundle size
