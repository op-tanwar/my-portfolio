---
title: "How to Structure Large React Projects"
description: "Feature folders, shared modules, and colocation strategies that keep React codebases maintainable as teams and requirements grow — patterns from real client projects."
publishDate: 2026-03-22
updatedDate: 2026-06-10
category: "React"
tags: ["React", "Architecture", "Project Structure", "TypeScript"]
featured: false
accent: "#f7df1e"
image: "../../assets/blog/how-to-structure-large-react-projects.jpg"
imageAlt: "Large codebase on a developer screen with project structure"
---

Every large React project starts the same way: a clean `src/` folder, a handful of components, and confident comments about "keeping it simple." Six months later, there are 400 files, three developers stepping on each other's PRs, and a `utils/helpers.ts` file with 2,000 lines that everyone is afraid to touch.

I've been called in to restructure React codebases for clients at this exact inflection point — when feature velocity has slowed not because the team is bad, but because the architecture never scaled past the prototype phase. The restructuring always follows similar principles, even though the specific folder layout varies by project type.

This article is the structure I implement on large React projects today — feature-based organization, clear boundaries, colocation, and conventions that let teams move fast without creating a monolith of interconnected components.

## Why Structure Matters Before Scale

Project structure is not bureaucracy. It's the set of decisions that answer: "Where does this file go?" and "Who is allowed to import what?" Without clear answers, developers make inconsistent choices, coupling spreads, and onboarding new team members takes weeks instead of days.

The cost of bad structure is invisible until it's catastrophic:

- A bug fix in checkout breaks the admin dashboard because they share a poorly named utility
- Three different date formatting functions exist because nobody knew one already existed
- A "quick" feature takes two weeks because the developer couldn't find existing patterns

Good structure makes the right thing easy and the wrong thing obvious. When a developer creates a new modal, the folder convention tells them exactly where it goes and what it can depend on.

## Feature-Based vs. Type-Based Organization

The two dominant approaches:

**Type-based (layered):**
```
src/
  components/
  hooks/
  utils/
  services/
  pages/
```

**Feature-based (domain-driven):**
```
src/
  features/
    auth/
    checkout/
    products/
  shared/
    ui/
    lib/
```

Type-based works for small projects. At scale, it fails because related code scatters across folders. The checkout form component lives in `components/`, its hook in `hooks/`, its API calls in `services/`, and its types in `types/`. Changing checkout requires navigating four directories.

Feature-based colocates everything a domain needs:

```
src/features/checkout/
  components/
    CartSummary.tsx
    ShippingForm.tsx
    PaymentStep.tsx
  hooks/
    useCart.ts
    useCheckout.ts
  api/
    checkout.api.ts
  types/
    checkout.types.ts
  utils/
    calculateTotals.ts
  index.ts          # public API
```

I use feature-based as the default on every project with more than ten routes or more than two developers.

## The Folder Structure I Use in Production

Here's the complete structure for a typical SaaS or e-commerce React app:

```
src/
├── app/                    # Route definitions, layouts, providers
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── products/page.tsx
│   ├── layout.tsx
│   └── providers.tsx
├── features/
│   ├── auth/
│   ├── products/
│   ├── checkout/
│   └── orders/
├── shared/
│   ├── ui/                 # Design system primitives
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── index.ts
│   ├── lib/                # Pure utilities, no feature knowledge
│   │   ├── format.ts
│   │   ├── cn.ts
│   │   └── api-client.ts
│   ├── hooks/              # Generic hooks (useMediaQuery, useDebounce)
│   └── types/              # Global types (User, ApiResponse)
├── config/
│   ├── env.ts
│   └── constants.ts
└── test/
    ├── setup.ts
    └── utils/
```

**Key rules:**

- `features/` contains domain logic — auth, products, checkout
- `shared/` contains code with zero domain knowledge
- `app/` contains routing and composition only — thin files that import from features
- Features never import from other features directly — they communicate through shared abstractions or the app layer

## Feature Module Boundaries and Public APIs

Each feature exposes a public API through its `index.ts`:

```ts
// features/checkout/index.ts
export { CartDrawer } from "./components/CartDrawer";
export { useCart } from "./hooks/useCart";
export type { CartItem, CartState } from "./types/checkout.types";
```

Internal implementation details stay private:

```
features/checkout/
  components/
    CartDrawer.tsx       # exported
    CartLineItem.tsx     # internal — not in index.ts
  hooks/
    useCart.ts           # exported
    useCartPersistence.ts # internal
```

Enforce this with ESLint import restrictions:

```js
// eslint.config.js
{
  rules: {
    "no-restricted-imports": ["error", {
      patterns: [
        {
          group: ["**/features/*/!(index)"],
          message: "Import from feature public API (index.ts) only.",
        },
        {
          group: ["**/features/checkout/**"],
          importNames: ["*"],
          message: "Do not import checkout internals from outside the feature.",
        },
      ],
    }],
  },
}
```

When a developer needs checkout data in the orders feature, the choice is clear: either orders imports from `@/features/checkout` public API, or the shared data moves to `shared/` or a dedicated store. No reaching into `features/checkout/hooks/useCartPersistence.ts`.

## Colocation: Keep Related Code Together

Colocation means placing code as close as possible to where it's used. React's component model naturally supports this — a component's styles, tests, types, and sub-components live alongside it.

```
shared/ui/Button/
  Button.tsx
  Button.test.tsx
  Button.module.css
  Button.stories.tsx   # if using Storybook
  index.ts
```

For feature components with sub-components only used in one place:

```
features/products/components/ProductCard/
  ProductCard.tsx
  ProductCardImage.tsx      # only used by ProductCard
  ProductCardActions.tsx    # only used by ProductCard
  ProductCard.module.css
  index.ts
```

**Anti-pattern I refactor constantly:** a global `components/` folder with 200 files flat or grouped by type. `ProductCard.tsx` next to `AdminUserTable.tsx` next to `Footer.tsx` tells you nothing about ownership or dependencies.

Promote to `shared/ui/` only when a component is used by three or more features. Until then, keep it in the feature.

## Shared UI vs. Feature Components

The distinction between design system primitives and feature components is critical:

**Shared UI (`shared/ui/`):** Generic, reusable, zero business logic.

```tsx
// shared/ui/Button/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(styles.button, styles[variant], styles[size])}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : children}
    </button>
  );
}
```

**Feature components:** Domain-specific, compose shared UI.

```tsx
// features/checkout/components/CheckoutButton.tsx
export function CheckoutButton() {
  const { items, total } = useCart();
  const { mutate, isPending } = useCheckout();

  return (
    <Button
      variant="primary"
      size="lg"
      isLoading={isPending}
      disabled={items.length === 0}
      onClick={() => mutate()}
    >
      Pay {formatCurrency(total)}
    </Button>
  );
}
```

When a client asks "should this be a shared component?", my test: remove all business context. If what's left is generic enough for any app, it's shared UI. If it references cart, products, or user roles, it's a feature component.

## State Management Architecture

Large projects need a clear state strategy. I use this hierarchy:

1. **Local state (`useState`, `useReducer`)** — UI state scoped to one component
2. **Shared state via context** — scoped to a feature subtree (cart, auth)
3. **Server state (TanStack Query)** — API data with caching, invalidation, optimistic updates
4. **Global client state (Zustand)** — only when truly cross-feature (theme, sidebar collapse)

```tsx
// features/checkout/providers/CartProvider.tsx
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
```

Mount providers at the narrowest scope that works:

```tsx
// app/(shop)/layout.tsx — cart only needed in shop routes
export default function ShopLayout({ children }) {
  return (
    <CartProvider>
      <ShopHeader />
      {children}
    </CartProvider>
  );
}
```

**Avoid:** a single Redux store with 40 slices imported everywhere. **Prefer:** feature-scoped state with TanStack Query handling server data. I've migrated three client projects from over-engineered Redux setups to this model and watched bundle size drop 30% with simpler mental models for the team.

## API Layer Organization

Centralize HTTP configuration, scatter domain API functions by feature:

```ts
// shared/lib/api-client.ts
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }

  return res.json();
}
```

```ts
// features/products/api/products.api.ts
import { apiClient } from "@/shared/lib/api-client";
import type { Product, ProductListParams } from "../types/products.types";

export const productsApi = {
  list: (params: ProductListParams) =>
    apiClient<{ items: Product[]; total: number }>(
      `/products?${new URLSearchParams(params as Record<string, string>)}`,
    ),

  getBySlug: (slug: string) =>
    apiClient<Product>(`/products/${slug}`),
};
```

TanStack Query hooks wrap API functions in the same feature:

```tsx
// features/products/hooks/useProducts.ts
export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.list(params),
    staleTime: 60_000,
  });
}
```

## Naming Conventions That Scale

Consistent naming prevents the "which file is the real one?" problem:

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase, `use` prefix | `useCart.ts` |
| Utilities | camelCase | `formatCurrency.ts` |
| Types | PascalCase, `.types.ts` suffix | `checkout.types.ts` |
| API modules | camelCase, `.api.ts` suffix | `products.api.ts` |
| Constants | SCREAMING_SNAKE in `.constants.ts` | `MAX_CART_ITEMS` |
| Tests | Same name + `.test.tsx` | `ProductCard.test.tsx` |

File names match their default export. `ProductCard.tsx` exports `ProductCard`, not `Card` or `ProductCardComponent`.

Avoid generic names at the feature level: `utils.ts`, `helpers.ts`, `types.ts`, `constants.ts` without domain prefix. In a large codebase, six files named `utils.ts` is six future bugs.

## Route and Layout Organization

In Next.js App Router projects, I keep route files thin:

```tsx
// app/(dashboard)/products/page.tsx
import { ProductListPage } from "@/features/products/components/ProductListPage";

export default function Page() {
  return <ProductListPage />;
}
```

The page file handles routing concerns (metadata, params). The feature component handles everything else. This separation makes features testable without Next.js routing infrastructure and portable if the client ever changes frameworks.

Layout nesting mirrors user-facing structure:

```
app/
  (marketing)/          # Public pages, marketing layout
  (auth)/               # Minimal layout, centered forms
  (dashboard)/          # Sidebar layout, auth required
  (shop)/               # Shop header, cart provider
```

Each route group gets its own layout with appropriate providers scoped to that section.

## Testing Structure Mirrors Source

Tests live next to the code they test:

```
features/checkout/
  components/
    CartSummary.tsx
    CartSummary.test.tsx
  hooks/
    useCart.ts
    useCart.test.ts
```

Integration tests that cross features live in `test/integration/`:

```
test/
  integration/
    checkout-flow.test.tsx
  e2e/
    checkout.spec.ts       # Playwright
```

Shared test utilities in `test/utils/` — custom render with providers, mock data factories:

```tsx
// test/utils/render.tsx
export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={testQueryClient}>
      <AuthProvider user={mockUser}>
        {ui}
      </AuthProvider>
    </QueryClientProvider>,
  );
}
```

## Documentation and Onboarding

Structure alone isn't enough — document the decisions:

```
docs/
  architecture.md         # Overview of folder structure and rules
  adding-a-feature.md     # Step-by-step guide for new features
  state-management.md     # When to use what
```

I include an `architecture.md` in every client handoff explaining where things go and why. New developers read one document and start contributing on day one instead of day five.

For monorepos (growing trend on larger client projects):

```
apps/
  web/                    # Customer-facing Next.js app
  admin/                  # Admin dashboard
packages/
  ui/                     # Shared design system
  config/                 # ESLint, TypeScript configs
  types/                  # Shared type definitions
```

Turborepo or Nx manages the monorepo. Features that are app-specific stay in the app; truly shared code moves to packages.

## Common Mistakes When Scaling React Projects

1. **Premature abstraction** — building a generic `DataTable` before you have three tables to compare
2. **God components** — 800-line files that handle fetching, formatting, rendering, and event handling
3. **Circular dependencies** — features importing each other; fix with shared abstractions or event patterns
4. **Global everything** — one context, one store, one utils file for the entire app
5. **Ignoring bundle analysis** — features that import the entire lodash library for one function
6. **No import boundaries** — ESLint rules exist; use them from week one, not after the refactor

## Conclusion

Large React projects don't fail because React is inadequate. They fail because structure wasn't designed for growth. Feature-based organization, colocation, public APIs, scoped state, and enforced import boundaries give teams a codebase that scales with requirements instead of fighting them.

When I start a new client project expected to grow, I set up this structure on day one — even when day one only has three features. The cost of empty folders is zero. The cost of restructuring at 400 files is measured in weeks.

Your future self — and every developer who joins the project after you — will thank you for the boring, consistent folder structure that makes "where does this go?" a solved problem.


Restructuring a growing React codebase is easier with a partner who has already lived through feature-folder migrations — [hire a React developer](/hire-react-developer) who treats import boundaries as product infrastructure.


Feature folders and typed boundaries stick when TypeScript is treated as architecture. For that discipline across a growing repo, [hire a TypeScript developer](/hire-typescript-developer).

## Key Takeaways

- **Organize by feature, not by file type** — colocate components, hooks, API calls, and types within domain folders.
- **Expose feature public APIs through index.ts** and enforce import boundaries with ESLint.
- **Shared UI is generic; feature components contain business logic** — promote to shared only after three or more consumers.
- **Scope state narrowly** — local state first, feature context second, TanStack Query for server data, global store last.
- **Keep route files thin** — composition and metadata in routes, logic in features.
- **Mirror test structure to source** with shared render utilities for provider-heavy components.
- **Document architecture decisions** so onboarding doesn't depend on tribal knowledge.
