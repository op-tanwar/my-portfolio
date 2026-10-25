---
title: "Next.js Performance Optimization: How I Hit Lighthouse 100"
description: "Core Web Vitals, image optimization, bundle splitting, caching, and font loading — a complete playbook for squeezing every millisecond out of Next.js in production."
publishDate: 2025-05-18
updatedDate: 2026-06-10
category: "Next.js"
tags: ["Next.js", "Performance", "Core Web Vitals", "Lighthouse", "Optimization"]
featured: true
accent: "#00fff7"
image: "../../assets/blog/nextjs-performance-optimization.jpg"
imageAlt: "Analytics dashboard showing performance metrics and Lighthouse scores"
---

Hitting Lighthouse 100 on mobile isn't luck, and it isn't a vanity metric I chase for screenshots. I've had clients lose Upwork contracts because their Next.js app's mobile performance score was 42. I've also had clients win enterprise deals because their dashboard loaded in under a second on a throttled connection. The difference is systematic optimization applied before launch — and maintained after.

This is my complete Next.js performance playbook. It covers measurement, images, fonts, caching, bundle splitting, third-party scripts, and the deployment configuration I use on production client projects. Everything here has been validated on real sites serving US, UK, and EU traffic — not just localhost benchmarks.

## Start With Measurement, Not Optimization

Optimizing without baselines is guesswork. Before touching code, I collect data from three sources:

**Lighthouse (lab data):**

```bash
npx lighthouse https://yoursite.com --preset=mobile --view
npx lighthouse https://yoursite.com --preset=desktop --view
```

**Bundle analysis:**

```bash
# Add to next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

# Run analysis
ANALYZE=true npm run build
```

**Field data (CrUX via Search Console):**

Check Experience → Core Web Vitals for the URL groups that matter. Field data is what Google uses for rankings. A Lighthouse 100 with failing CrUX means your lab conditions don't match real users.

I also add real-user monitoring on client projects:

```tsx
// app/components/WebVitals.tsx
"use client";

import { useEffect } from "react";
import { onLCP, onINP, onCLS } from "web-vitals";

export function WebVitals() {
  useEffect(() => {
    function send(metric: { name: string; value: number; id: string }) {
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        page: window.location.pathname,
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/vitals", body);
      }
    }

    onLCP(send);
    onINP(send);
    onCLS(send);
  }, []);

  return null;
}
```

Document your baselines. Every optimization should move a specific number.

## Image Optimization: The Highest-Impact Fix

Images are the LCP element on most Next.js pages. The `next/image` component is non-negotiable for production:

```tsx
import Image from "next/image";
import heroImage from "@/public/hero.webp";

<Image
  src={heroImage}
  alt="Product dashboard showing real-time analytics"
  priority
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="rounded-lg"
/>
```

Rules I enforce on every project:

- **Always set dimensions** — use static imports for automatic width/height, or explicit `width` and `height` props
- **`priority` only for above-the-fold LCP images** — one, maybe two per page
- **`sizes` attribute is mandatory** for responsive images — without it, Next.js serves the wrong size
- **Use WebP/AVIF** — configure in `next.config.js`:

```js
// next.config.js
module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

For CMS images with unknown dimensions, use the `fill` prop with a sized container:

```tsx
<div className="relative aspect-video w-full">
  <Image
    src={post.coverImage}
    alt={post.title}
    fill
    sizes="(max-width: 768px) 100vw, 800px"
    className="object-cover"
  />
</div>
```

**Never lazy-load the LCP image.** If it's above the fold, use `priority`. Lazy-loading your hero image is one of the most common LCP mistakes I see.

## Font Optimization With next/font

Render-blocking font requests destroy LCP. `next/font` self-hosts fonts and eliminates layout shift:

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

For custom fonts:

```tsx
import localFont from "next/font/local";

const customFont = localFont({
  src: [
    { path: "../public/fonts/custom-regular.woff2", weight: "400" },
    { path: "../public/fonts/custom-bold.woff2", weight: "700" },
  ],
  display: "swap",
  variable: "--font-custom",
});
```

Limit font weights to what you actually use. Loading Regular, Medium, SemiBold, Bold, and Black when your design uses Regular and Bold wastes 200+ KB.

## Caching and Rendering Strategy

Next.js gives you multiple rendering modes. Pick the right one per page — don't default everything to dynamic.

### Static Generation (Default)

```tsx
// app/about/page.tsx — statically generated at build time
export default function AboutPage() {
  return <h1>About Us</h1>;
}
```

### ISR — Incremental Static Regeneration

```tsx
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // Rebuild every hour

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}
```

### On-Demand Revalidation

```tsx
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get("path");
  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
  }

  return NextResponse.json({ message: "Missing path" }, { status: 400 });
}
```

### Fetch Caching

```tsx
// Cached for 1 hour
const posts = await fetch("https://cms.example.com/api/posts", {
  next: { revalidate: 3600 },
});

// Tag-based invalidation
const product = await fetch(`https://api.example.com/products/${id}`, {
  next: { tags: [`product-${id}`] },
});

// After update:
revalidateTag(`product-${id}`);
```

My rendering strategy per page type:

| Page | Rendering | Revalidation |
|------|-----------|--------------|
| Homepage | Static | On CMS publish |
| Blog posts | ISR | 3600s or on-demand |
| Product pages | ISR | 300–900s |
| User dashboard | Dynamic | N/A |
| Search results | Dynamic | N/A |
| API routes | Varies | Per endpoint |

## Bundle Splitting and Dynamic Imports

A 1.5 MB JavaScript bundle makes every interaction slow, regardless of how well you memoize components.

### Route-Level Splitting

App Router code-splits by route automatically. But importing heavy libraries in shared layouts defeats this:

```tsx
// Bad — chart library in root layout ships everywhere
import { Chart } from "heavy-chart-library";

// Good — dynamic import in the page that needs it
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("@/components/Chart"), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});
```

### Component-Level Splitting

```tsx
const PDFViewer = dynamic(() => import("@/components/PDFViewer"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
  ssr: false,
});

const RichTextEditor = dynamic(
  () => import("@/components/RichTextEditor"),
  { ssr: false },
);
```

Use `ssr: false` for components that depend on `window`, `document`, or browser-only APIs.

### Tree Shaking Imports

```tsx
// Bad
import { format, parseISO, addDays, subDays, isAfter } from "date-fns";

// Good — import only what you use
import { format } from "date-fns/format";
import { parseISO } from "date-fns/parseISO";
```

Run `ANALYZE=true npm run build` after every major feature addition. I routinely find a single import responsible for 25% of the bundle.

## Server Components for Performance

Server Components are Next.js's biggest performance lever. They render on the server and send HTML with zero client JavaScript:

```tsx
// app/products/page.tsx — Server Component
import { getProducts } from "@/lib/products";
import ProductGrid from "./ProductGrid"; // Client Component for filtering

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1>Products</h1>
      <ProductGrid initialProducts={products} />
    </div>
  );
}
```

Audit your `"use client"` directives. If more than 30% of your components are client-side, you're leaving performance on the table. Push interactivity to leaf components.

## Third-Party Script Management

Third-party scripts — analytics, chat widgets, payment processors, A/B testing — are the silent INP killer.

```tsx
import Script from "next/script";

// Load analytics after page is interactive
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
  strategy="afterInteractive"
/>

// Load chat widget only when idle
<Script
  src="https://widget.intercom.io/widget/xxxxx"
  strategy="lazyOnload"
/>
```

Script loading strategies:

- `beforeInteractive` — critical scripts only (rare)
- `afterInteractive` — analytics, default choice
- `lazyOnload` — chat widgets, social embeds, non-critical tools
- `worker` — experimental web worker loading

On a client e-commerce site, deferring the live chat script from `afterInteractive` to `lazyOnload` and gating it to `/contact` and `/support` pages cut site-wide INP by 180ms.

Audit third-party impact in Chrome DevTools → Performance → Bottom-Up → Group by Domain.

## CSS and Styling Performance

### Tailwind CSS Purging

Tailwind purges unused classes in production automatically with the default config. Verify your `content` paths include all template files:

```js
// tailwind.config.ts
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
```

### Avoid Runtime CSS-in-JS for Static Content

CSS-in-JS libraries (styled-components, Emotion) add runtime overhead. For App Router projects, I prefer Tailwind or CSS Modules:

```tsx
// CSS Modules — zero runtime cost
import styles from "./Card.module.css";

export function Card({ children }) {
  return <div className={styles.card}>{children}</div>;
}
```

If you must use CSS-in-JS, ensure it's compatible with Server Components or isolate it in Client Components.

## Prefetching and Navigation Performance

Next.js prefetches linked routes in the viewport by default. Control this behavior:

```tsx
import Link from "next/link";

// Disable prefetch for rarely visited pages
<Link href="/admin/settings" prefetch={false}>
  Settings
</Link>
```

For data prefetching on hover:

```tsx
"use client";

import { useRouter } from "next/navigation";

function ProductLink({ id, name }) {
  const router = useRouter();

  return (
    <a
      href={`/products/${id}`}
      onMouseEnter={() => router.prefetch(`/products/${id}`)}
    >
      {name}
    </a>
  );
}
```

## Production Configuration

```js
// next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "@radix-ui/react-icons"],
  },
  headers: async () => [
    {
      source: "/:all*(svg|jpg|png|webp|avif|woff2)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
};

module.exports = withBundleAnalyzer(nextConfig);
```

`optimizePackageImports` automatically tree-shakes barrel exports from popular libraries. This single config option has saved me hundreds of KB on icon-heavy projects.

## Lighthouse CI in the Deploy Pipeline

Prevent performance regressions before they reach production:

```json
// lighthouse-budget.json
[
  {
    "path": "/*",
    "resourceSizes": [
      { "resourceType": "script", "budget": 300 },
      { "resourceType": "total", "budget": 500 }
    ],
    "timings": [
      { "metric": "first-contentful-paint", "budget": 1500 },
      { "metric": "largest-contentful-paint", "budget": 2500 },
      { "metric": "interactive", "budget": 3500 },
      { "metric": "cumulative-layout-shift", "budget": 0.1 }
    ]
  }
]
```

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci && npm run build
      - uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/blog
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
```

PRs that exceed budgets get flagged before merge. Performance becomes a CI gate, not a launch-day panic.

## Real Client Case Study

A US SaaS client's Next.js marketing site scored 48 on mobile Lighthouse. Their App Router setup was sound, but execution was sloppy. Here's what we fixed over 10 days:

| Issue | Fix | Impact |
|-------|-----|--------|
| 2.4 MB hero PNG | WebP + `next/image` with `priority` | LCP: 4.8s → 1.6s |
| Google Fonts CDN | `next/font` self-hosted | LCP: -400ms |
| Recharts on homepage | Dynamic import, `ssr: false` | JS: -420 KB |
| 6 font weights loaded | Reduced to 2 weights | Fonts: -180 KB |
| Intercom on every page | `lazyOnload` + page-gated | INP: 380ms → 110ms |
| No `sizes` on images | Added responsive `sizes` | LCP: -300ms |
| All pages dynamic | ISR for blog + marketing | TTFB: 800ms → 120ms |

Final score: 96 mobile, 100 desktop. Organic bounce rate dropped 22%. The CTO said it was the highest-ROI sprint of the quarter.

## The Complete Optimization Checklist

1. Measure baselines — Lighthouse, bundle analyzer, CrUX field data
2. Replace all `<img>` with `next/image` — set `priority`, `sizes`, dimensions
3. Migrate fonts to `next/font` — limit weights, use `display: swap`
4. Audit `"use client"` usage — maximize Server Components
5. Dynamic import heavy components — charts, editors, PDF viewers
6. Configure ISR for semi-dynamic pages — blog, products, docs
7. Defer third-party scripts — `lazyOnload` for non-critical
8. Enable `optimizePackageImports` in next.config.js
9. Set cache headers for static assets
10. Add Lighthouse CI to prevent regressions
11. Monitor CrUX data monthly post-launch

## Common Mistakes

**Optimizing Lighthouse instead of CrUX.** Lab scores are for development. Rankings follow field data.

**`priority` on every image.** Defeats the purpose. One LCP image per page.

**Fetching in Client Components when Server Components work.** Adds loading states and client JS for free.

**Ignoring `sizes` attribute.** Next.js can't serve responsive images without it.

**Dynamic rendering everything.** Static and ISR pages are faster and cheaper to serve.

**Skipping bundle analysis.** You don't know what's slow until you measure the bundle.

## Conclusion

Next.js gives you every tool to build fast production apps — image optimization, font self-hosting, Server Components, ISR, dynamic imports, script loading strategies. The framework doesn't make you fast by default. It makes you *able* to be fast if you apply these patterns consistently.

Measure first. Fix the biggest bottleneck. Deploy. Monitor field data. Repeat. That's how you hit Lighthouse 100 — and more importantly, how you keep it after the next feature ships.


Hitting Lighthouse 100 on Next is mostly discipline: images, fonts, Server Components, and third-party budgets. For that hardening work, [hire a Next.js developer](/hire-nextjs-developer) or bring in a focused [website performance optimization](/website-performance-optimization) engagement.

## Key Takeaways

- Measure with Lighthouse, bundle analyzer, and CrUX field data before optimizing anything
- `next/image` with `priority`, `sizes`, and WebP/AVIF is the single highest-impact LCP fix
- `next/font` eliminates render-blocking font requests and layout shift from font swapping
- Use Server Components for 70–80% of your UI; push `"use client"` to interactive leaves only
- ISR and fetch caching turn dynamic data into fast static pages without sacrificing freshness
- Dynamic imports for heavy libraries (charts, editors) can cut hundreds of KB from your bundle
- Defer third-party scripts with `next/script` strategies — chat widgets are often the INP culprit
- Add Lighthouse CI with performance budgets to catch regressions before they reach production
