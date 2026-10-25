---
title: "TypeScript Patterns I Use on Every React Project"
description: "Practical TypeScript patterns for React and Next.js — typed props, API contracts, generics, and lessons from production client codebases in the US, UK, and Europe."
publishDate: 2026-05-20
updatedDate: 2026-06-11
category: "React"
tags: ["TypeScript", "React", "Next.js", "Architecture", "Best Practices"]
featured: false
accent: "#38BDF8"
image: "../../assets/blog/typescript-patterns-for-react-projects.jpg"
imageAlt: "TypeScript and React code on a developer monitor"
---

A US healthtech startup hired me to add features to their React dashboard. The codebase was JavaScript with JSDoc comments pretending to be types. Every PR broke something in a different file. Prop shapes drifted from API responses. Refactors were terrifying.

We migrated to TypeScript over three sprints — not a big-bang rewrite, but module by module starting with shared types and API layers. Bug rate in frontend PRs dropped noticeably. New developers onboarded faster because the types documented what the code expected.

TypeScript isn't about satisfying the compiler. It's about making invalid states unrepresentable and giving your team confidence to change code.

## Why TypeScript on Client Projects

Clients hire me to ship fast *and* maintainable. TypeScript pays for itself when:

- Multiple developers touch the same codebase
- API contracts change frequently
- The app will live longer than six months
- You integrate payments, auth, or regulated data

I enable `strict: true` in `tsconfig.json` on every new project. Loose TypeScript is JavaScript with extra steps.

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

`noUncheckedIndexedAccess` catches `array[0]` possibly being undefined — a common runtime crash source.

## Start With Domain Types, Not Component Props

The mistake I see: developers type components first and retrofit API types later.

Start from your data model:

```ts
// types/order.ts
export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export interface Order {
  id: string;
  reference: string;
  status: OrderStatus;
  total: number;
  currency: "USD" | "GBP" | "EUR";
  createdAt: string;
  lineItems: OrderLineItem[];
}

export interface OrderLineItem {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}
```

Then API functions return typed data:

```ts
export async function fetchOrders(orgId: string): Promise<Order[]> {
  const res = await fetch(`/api/orgs/${orgId}/orders`);
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return OrderListSchema.parse(await res.json()); // Zod validation at boundary
}
```

Components consume `Order` — they don't define their own parallel interfaces.

## Zod at API Boundaries

TypeScript types erase at runtime. External data lies.

```ts
import { z } from "zod";

export const OrderSchema = z.object({
  id: z.string().uuid(),
  reference: z.string(),
  status: z.enum(["pending", "paid", "shipped", "cancelled"]),
  total: z.number().nonnegative(),
  currency: z.enum(["USD", "GBP", "EUR"]),
  createdAt: z.string().datetime(),
  lineItems: z.array(
    z.object({
      sku: z.string(),
      name: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().nonnegative(),
    }),
  ),
});

export type Order = z.infer<typeof OrderSchema>;
```

On a UK marketplace project, Zod caught a backend deploy that renamed `unitPrice` to `unit_price`. The app showed a clear error in staging instead of `NaN` prices in production.

## Component Props: Explicit and Narrow

```tsx
interface OrderRowProps {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  isSelected?: boolean;
}

export function OrderRow({ order, onStatusChange, isSelected = false }: OrderRowProps) {
  return (
    <tr aria-selected={isSelected}>
      <td>{order.reference}</td>
      <td>
        <StatusBadge status={order.status} />
      </td>
    </tr>
  );
}
```

Avoid `props: any` and avoid overly generic `Record<string, unknown>` unless you're building a truly generic utility.

For polymorphic components (button vs link):

```tsx
type ButtonProps<T extends React.ElementType = "button"> = {
  as?: T;
  variant?: "primary" | "ghost";
} & React.ComponentPropsWithoutRef<T>;

export function Button<T extends React.ElementType = "button">({
  as,
  variant = "primary",
  ...props
}: ButtonProps<T>) {
  const Component = as ?? "button";
  return <Component className={buttonVariants({ variant })} {...props} />;
}
```

## Discriminated Unions for UI State

Async UI state is a typing goldmine:

```ts
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function OrderPanel({ state }: { state: FetchState<Order[]> }) {
  switch (state.status) {
    case "idle":
    case "loading":
      return <Skeleton />;
    case "error":
      return <ErrorMessage message={state.error} />;
    case "success":
      return <OrderTable orders={state.data} />;
  }
}
```

TypeScript narrows `state.data` inside the `success` branch. No optional chaining roulette.

## Generics Where Reuse Is Real

```tsx
interface DataTableProps<T> {
  rows: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string;
}

export function DataTable<T>({ rows, columns, getRowId }: DataTableProps<T>) {
  return (
    <table>
      <tbody>
        {rows.map((row) => (
          <tr key={getRowId(row)}>
            {columns.map((col) => (
              <td key={col.id}>{col.cell(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

Don't genericize prematurely. One table with hardcoded `Order` types is fine until you have a second table sharing 80% of logic.

## Next.js App Router Typing

```tsx
// app/blog/[slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <Article post={post} />;
}
```

Next.js 15 made `params` async — typing catches forgotten `await` immediately.

For Server Actions:

```ts
"use server";

import { z } from "zod";

const ContactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
});

export async function submitContact(formData: FormData) {
  const parsed = ContactSchema.safeParse({
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten() };
  }

  await sendEmail(parsed.data);
  return { ok: true as const };
}
```

`as const` on return literals enables precise client-side narrowing.

## Common Mistakes

**Using `any` to "save time."** You pay it back with interest in debugging.

**Duplicating types** — `UserDTO`, `UserModel`, `UserProps` that drift apart. Single source of truth.

**Ignoring `strictNullChecks`.** The most valuable strict flag.

**Type assertions without validation** — `data as Order` when data comes from `fetch`.

**Over-engineering branded types** for a marketing site that ships once. Match complexity to project lifespan.

## Best Practices

1. Enable `strict` mode from project init
2. Validate external data with Zod at API boundaries
3. Define domain types first; derive component props from them
4. Use discriminated unions for async and form state
5. Colocate types with features (`features/orders/types.ts`)
6. Run `tsc --noEmit` in CI — don't rely on IDE only
7. Share types between client and server via a `packages/shared` workspace when using monorepos

## Performance Considerations

TypeScript has zero runtime cost — it compiles away. Build time increases slightly on large projects. Mitigations:

- `incremental: true` in tsconfig
- Project references for monorepos
- `@astrojs/check` or `tsc --noEmit` in CI, not on every dev save if slow

## Incremental Migration From JavaScript

You rarely migrate 200 files in one PR. My approach on client projects:

1. **Enable `allowJs: true`** temporarily and add `checkJs` to shared utilities
2. **Rename shared types first** — `types/api.ts`, `types/user.ts`
3. **Convert leaf components** (no children dependencies) before containers
4. **Leave route pages for last** — they compose already-typed children
5. **Remove `allowJs`** once coverage hits the team's comfort threshold

On the healthtech migration, we tracked progress in a simple spreadsheet: module name, owner, status. Two developers converted ~15 files per sprint without blocking feature work.

## Utility Types That Save Time

```ts
// Pick only what a card needs — don't pass full User everywhere
type UserCardData = Pick<User, "id" | "name" | "avatarUrl" | "role">;

// Make update payloads partial but require id
type UpdateOrderPayload = { id: string } & Partial<Omit<Order, "id">>;

// Extract async function return type
type OrdersResponse = Awaited<ReturnType<typeof fetchOrders>>;
```

`Pick` and `Omit` keep components decoupled from bloated domain objects. I use `Awaited<ReturnType<...>>` constantly when wiring TanStack Query hooks to API functions.

## Shared Types in Monorepos

When frontend and backend share a Turborepo or Nx workspace:

```
packages/types/
  src/
    order.ts
    user.ts
    index.ts
```

Both `apps/web` and `apps/api` import `@acme/types`. API handlers return typed responses; React hooks consume the same shapes. When the backend adds a field, TypeScript fails in both places until you handle it.

For external APIs you don't control, generate types with `openapi-typescript` from OpenAPI specs. I regenerate on CI when the spec changes — manual type maintenance against third-party APIs always drifts.

## Event Handlers and Strict Typing

```tsx
function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") onSearch(event.currentTarget.value);
  };

  return <input type="search" onChange={handleChange} onKeyDown={handleKeyDown} />;
}
```

Use `React.ChangeEvent`, `React.FormEvent`, and `React.KeyboardEvent` — not generic `Event`. The DOM types catch mistakes like calling `event.target` on forms where `currentTarget` is correct.

## Testing With Types

TypeScript complements testing — it doesn't replace it.

```ts
// Vitest + typed mocks
import { vi } from "vitest";
import type { Order } from "@/types/order";

const mockOrder: Order = {
  id: "ord_1",
  reference: "REF-001",
  status: "paid",
  total: 99.5,
  currency: "GBP",
  createdAt: "2026-01-15T10:00:00Z",
  lineItems: [],
};

vi.mocked(fetchOrders).mockResolvedValue([mockOrder]);
```

Typed fixtures catch shape drift when APIs change. If `mockOrder` fails to compile, your test data is wrong before you run anything.

## Accessibility and SEO

Types don't directly affect a11y/SEO, but they prevent bugs that break them — wrong heading levels from mistyped CMS data, missing alt text when image props are optional without enforcement:

```tsx
interface ArticleImageProps {
  src: string;
  alt: string; // required, not optional
  width: number;
  height: number;
}
```

## Conclusion

TypeScript is a communication tool between you, your teammates, and your future self. On client projects, it reduces regression risk and speeds up refactors — the two things that matter most after launch.

I don't use TypeScript to impress anyone. I use it so I can change a prop name and let the compiler find every callsite in four seconds.

## What I Tell Clients Who Resist TypeScript

"We'll move slower for two weeks, then faster for two years." The upfront cost is real — types, Zod schemas, stricter CI. The payoff is fewer production bugs, safer refactors, and faster onboarding when they hire a second developer.

On fixed-bid projects, I include TypeScript in the base scope for anything over four weeks. For a one-page landing, plain JavaScript or Astro is fine.

## Performance and Build Pipeline Notes

TypeScript adds compile time, not runtime overhead. On a 400-file Next.js app, cold `tsc` might take 30–45 seconds — acceptable in CI. Use `incremental: true` and cache `.tsbuildinfo` in GitHub Actions.

For Astro content sites with React islands, I type the islands and leave markdown content untyped. Pragmatic scope beats 100% coverage on day one.

## Linking Types to Component Libraries

When I ship MUI or custom Tailwind components, props interfaces document the contract:

```tsx
export interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}
```

Consumers get autocomplete in VS Code. Designers get a finite set of variants. QA gets predictable UI states to test. Types connect design systems to implementation — especially when multiple freelancers touch the same codebase across US and EU time zones.


If your React app needs stricter typing without ceremony that slows shipping, [hire a TypeScript developer](/hire-typescript-developer) — or [hire a React developer](/hire-react-developer) when UI architecture is the larger gap — who uses Zod at boundaries and keeps domain types honest.

## Key Takeaways

- Enable `strict: true` and `noUncheckedIndexedAccess` on new projects
- Define domain types first; validate API responses with Zod at boundaries
- Use discriminated unions for loading/error/success UI states
- Avoid `any` and unsafe type assertions on external data
- Type Next.js 15 `params` and Server Action return values precisely
- Run `tsc --noEmit` in CI to catch drift before deploy
- Match typing complexity to project lifespan — don't over-engineer marketing sites
