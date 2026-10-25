---
title: "Designing Scalable Component Architectures in React"
description: "Practical React architecture patterns from client projects—composition, state boundaries, folder structure, and how to scale without rewriting."
publishDate: 2026-02-03
updatedDate: 2026-06-10
category: "React"
tags: ["React", "Architecture", "Components", "TypeScript"]
featured: true
accent: "#38BDF8"
image: "../../assets/blog/designing-scalable-component-architectures-react.jpg"
imageAlt: "React logo and code on a development screen"
---

The first React project I inherited as a freelancer had a `components` folder with 200 files and no subfolders. Half were unused. A `UserProfile` component was 1,400 lines long and fetched its own data, managed four modals, and exported twelve helper functions that three other components imported. Changing the avatar upload flow took two days and broke the settings page.

That experience shaped how I think about component architecture today. Scalable doesn't mean enterprise-grade abstractions or micro-frontends on day one. It means organizing React code so that when requirements change—and they always do—you can change one thing without unraveling everything else.

This article covers the patterns I use on React and Next.js client projects for US, UK, and EU teams, from early-stage startups to established companies modernizing legacy frontends.

## What "Scalable" Actually Means for React Apps

Scalable component architecture solves three problems:

1. **Locality** — related code lives together; unrelated code doesn't
2. **Boundaries** — components have clear responsibilities and limited knowledge of the outside world
3. **Composition** — complex UI is built from smaller pieces, not grown from a single file

It does not mean predicting every future requirement. I've seen teams build elaborate plugin systems for features that never shipped. The best architectures I've maintained were boring: folders with clear names, components under 200 lines, and data fetching pushed to the edges.

## The Container/Presentational Split—Updated for 2026

The classic container/presentational pattern separated data logic from rendering. With React Server Components, hooks, and tools like TanStack Query, the split looks different—but the principle holds.

**Server Components and route-level data fetching** handle data at the boundary:

```tsx
// app/dashboard/page.tsx (Next.js App Router)
import { getOrders } from "@/lib/api/orders";
import { OrderTable } from "@/components/orders/OrderTable";

export default async function DashboardPage() {
  const orders = await getOrders();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Orders</h1>
      <OrderTable orders={orders} />
    </main>
  );
}
```

**Client components** handle interactivity only:

```tsx
"use client";

import { useState } from "react";
import type { Order } from "@/types/order";

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const [sortKey, setSortKey] = useState<keyof Order>("createdAt");

  const sorted = [...orders].sort((a, b) =>
    String(a[sortKey]).localeCompare(String(b[sortKey]))
  );

  return (
    <table>
      {/* rendering only — no fetch calls here */}
    </table>
  );
}
```

On a B2B portal for a UK manufacturer, this separation cut page load time because static shells rendered on the server while interactive islands hydrated independently. More importantly, when the API changed, I updated one data function—not twelve components.

**Mistake:** putting `useEffect` fetch calls inside presentational components because "it's just one API call." It never stays one.

## Composition Over Configuration

When components accept dozens of props to handle every possible variation, they become impossible to maintain. I prefer composition—slots, children, and compound components.

A tab interface with configuration props:

```tsx
// Hard to extend, hard to type
<Tabs
  tabs={[
    { label: "Overview", content: <Overview />, icon: HomeIcon },
    { label: "Settings", content: <Settings />, disabled: true },
  ]}
  variant="underline"
  onChange={handleChange}
/>
```

The same UI with compound components:

```tsx
<Tabs defaultValue="overview" onValueChange={handleChange}>
  <TabsList variant="underline">
    <TabsTrigger value="overview">
      <HomeIcon aria-hidden /> Overview
    </TabsTrigger>
    <TabsTrigger value="settings" disabled>
      Settings
    </TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <Overview />
  </TabsContent>
  <TabsContent value="settings">
    <Settings />
  </TabsContent>
</Tabs>
```

The compound pattern is more code upfront. On a SaaS settings area with 30+ tabs across different plans, it saved us from prop-drilling boolean flags into a monolithic `Tabs` component. Each tab panel owned its own lazy-loaded content.

## Folder Structure That Scales with the Team

I don't believe in one universal folder structure. I believe in picking one and documenting it. Here's what I use on most mid-size projects:

```
src/
  components/
    ui/           # design system primitives (Button, Input, Dialog)
    layout/       # Header, Sidebar, PageShell
  features/
    orders/
      components/ # OrderTable, OrderFilters, OrderStatusBadge
      hooks/      # useOrderFilters, useOrderExport
      api.ts      # order-specific fetch functions
      types.ts
    auth/
      components/
      hooks/
  lib/            # shared utilities, cn(), formatters
  types/          # global types only
```

**Rules I enforce:**

- `components/ui` never imports from `features/`
- Feature folders are self-contained—delete `features/orders` and orders disappear
- Shared logic used by 3+ features moves to `lib/`
- No default exports in feature code (named exports make refactoring grep-friendly)

For a EU edtech client with four frontend developers, we adopted feature folders after months of merge conflicts in a flat `components/` directory. PR scope shrank because changes were localized. Code review became faster because reviewers only opened the relevant feature folder.

## State Boundaries: Where State Should Live

Misplaced state is the number one cause of unnecessary re-renders and spaghetti dependencies. My decision tree:

1. **UI state** (open/closed, hover, input value before submit) → `useState` in the component that needs it
2. **Shared UI state** (modal open from a distant trigger) → React context scoped to a feature, or a state machine
3. **Server state** (API data, caching, mutations) → TanStack Query or equivalent
4. **Global client state** (auth user, theme, locale) → Zustand or context at the app root

```tsx
// Scoped context — not global
const OrderFiltersContext = createContext<FiltersContextValue | null>(null);

export function OrderFiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  return (
    <OrderFiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </OrderFiltersContext.Provider>
  );
}

export function useOrderFilters() {
  const ctx = useContext(OrderFiltersContext);
  if (!ctx) throw new Error("useOrderFilters must be used within OrderFiltersProvider");
  return ctx;
}
```

On a marketplace project, the previous developer had put the entire cart, user session, and UI preferences in one Redux store. Every cart update re-rendered the navigation bar's locale selector. Moving to scoped contexts and TanStack Query for server data made interactions noticeably snappier without touching the visual design.

## The Slot Pattern for Flexible Layouts

Page layouts in client projects constantly change—marketing wants a banner, product wants a sidebar, compliance wants a disclaimer footer. Hardcoding layout logic into every page doesn't scale.

I use layout slots via `children` and optional render props:

```tsx
interface PageShellProps {
  title: string;
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export function PageShell({ title, actions, sidebar, children }: PageShellProps) {
  return (
    <div className="flex min-h-screen">
      {sidebar && <aside className="w-64 shrink-0">{sidebar}</aside>}
      <div className="flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </header>
        {children}
      </div>
    </div>
  );
}
```

Usage stays readable at the call site:

```tsx
<PageShell
  title="Invoices"
  actions={<Button onClick={exportCsv}>Export</Button>}
  sidebar={<InvoiceFilters />}
>
  <InvoiceTable />
</PageShell>
```

## Error and Loading Boundaries as Architecture

Scalable architecture includes failure modes. On a US healthcare client's patient portal, unhandled errors in one widget crashed the entire dashboard. We restructured with React error boundaries per feature section:

```tsx
// features/dashboard/components/DashboardSection.tsx
import { ErrorBoundary } from "react-error-boundary";

export function DashboardSection({
  title,
  children,
  fallback,
}: DashboardSectionProps) {
  return (
    <section className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <ErrorBoundary
        fallback={<SectionError onRetry={fallback} />}
        onError={(error) => logError("dashboard-section", error)}
      >
        <Suspense fallback={<SectionSkeleton />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
```

Each dashboard widget—appointments, messages, billing—lived inside its own boundary. A failing API didn't white-screen the portal. This is architecture, not polish. It belongs in the initial design, not sprint six.

## TypeScript as Architectural Documentation

I use TypeScript types to encode boundaries between layers:

```tsx
// types/api.ts — raw API shapes
export interface OrderApiResponse {
  order_id: string;
  created_at: string;
  total_cents: number;
}

// features/orders/types.ts — domain shapes
export interface Order {
  id: string;
  createdAt: Date;
  total: Money;
}

// features/orders/mappers.ts — explicit transformation
export function mapOrder(raw: OrderApiResponse): Order {
  return {
    id: raw.order_id,
    createdAt: new Date(raw.created_at),
    total: centsToMoney(raw.total_cents),
  };
}
```

Mapping at the boundary means components never deal with snake_case API fields or cent integers. When the backend changed `order_id` to `id`, I updated one mapper—not forty components.

## Real Project Scenario: Component Audit and Refactor

A US real estate startup brought me in with a Next.js app that had grown to 60,000 lines over a year. Feature velocity had stalled. New hires took three weeks to ship their first PR.

**Audit findings:**
- 12 "god components" over 500 lines
- Data fetching duplicated in 8 places for the same endpoint
- 34 components in `components/` used by only one page but not colocated
- Prop drilling five levels deep for auth user data

**Twelve-week refactor plan:**

| Phase | Focus | Outcome |
|-------|-------|---------|
| 1-2 | Feature folder migration | Colocate 80% of components |
| 3-4 | Extract god components | Split into composed pieces |
| 5-6 | TanStack Query adoption | Centralize server state |
| 7-8 | Auth context + layout slots | Remove prop drilling |
| 9-12 | Error boundaries + loading | Per-feature resilience |

We didn't freeze feature development. New work used the new patterns; old code migrated opportunistically. After twelve weeks, average PR size dropped by 40%, and the lead engineer told me onboarding docs finally matched the codebase.

## Anti-Patterns I Actively Remove

**The utility component.** A `Box` that accepts `padding`, `margin`, `display`, `flexDirection`, and `background` as props is just CSS with extra steps. Use Tailwind or styled components directly.

**Premature micro-frontends.** Teams with fewer than eight frontend developers rarely need module federation. Feature folders solve the same isolation problem with far less operational overhead.

**Global event buses.** Custom `EventEmitter` instances for React state create invisible dependencies. If two components need to communicate, lift state, use context, or use a URL parameter.

**Render props for everything.** Render props solved problems before hooks existed. In 2026, `children` and custom hooks are almost always clearer.

## Testing Architecture, Not Just Components

Scalable architecture is testable architecture. My approach:

- **Unit test** pure functions: mappers, formatters, hooks with `@testing-library/react`
- **Integration test** feature flows: user fills form → sees confirmation
- **Don't unit test** implementation details like internal state variable names

```tsx
// features/orders/hooks/useOrderFilters.test.ts
import { renderHook, act } from "@testing-library/react";
import { useOrderFilters } from "./useOrderFilters";

test("toggleStatus adds and removes status from filters", () => {
  const { result } = renderHook(() => useOrderFilters());

  act(() => result.current.toggleStatus("shipped"));
  expect(result.current.filters.statuses).toContain("shipped");

  act(() => result.current.toggleStatus("shipped"));
  expect(result.current.filters.statuses).not.toContain("shipped");
});
```

Testing hooks in isolation means I can refactor `OrderFilters` UI without rewriting tests—as long as the hook contract stays stable.

## Conclusion

Scalable React component architecture isn't a framework or a boilerplate repo. It's a set of habits: compose instead of configure, colocate by feature, fetch at boundaries, scope state narrowly, and design for failure from the start.

The 1,400-line `UserProfile` from my early freelance days would today be a server component page, three client islands for interactive sections, and a `features/profile` folder with components under 150 lines each. Same functionality. Radically different maintainability.

When you organize components around how the product actually works—not around how you think CSS should be abstracted—scaling stops being a rewrite conversation and becomes a normal Tuesday.


If your product UI is outgrowing ad-hoc components and you need someone to establish features, boundaries, and composition patterns, [hire a React developer](/hire-react-developer) who designs architecture for the next twelve months — not just the next ticket.

## Key Takeaways

- Scalable architecture optimizes for locality, boundaries, and composition—not premature abstraction
- Fetch data at route or feature boundaries; keep presentational components free of side effects
- Prefer compound components and composition over components with dozens of configuration props
- Organize by feature folders with strict import rules between `ui`, `features`, and `lib`
- Place state at the lowest level that works: local UI state, scoped context, TanStack Query for server data
- Use layout slots (`children`, optional sections) so pages evolve without restructuring
- Error and loading boundaries per feature section prevent cascading failures
- Map API types to domain types at the boundary—components should never know about raw API shapes
- Refactor incrementally: new code follows new patterns, old code migrates opportunistically
- Test hooks and user flows, not implementation details
