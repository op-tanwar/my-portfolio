---
title: "Optimizing Core Web Vitals on Modern Frontend Projects"
description: "A practitioner's guide to fixing LCP, INP, and CLS on React, Next.js, and Astro sites — with real client examples, debugging tools, and measurable targets."
publishDate: 2026-02-22
updatedDate: 2026-06-10
category: "Performance"
tags: ["Core Web Vitals", "Performance", "LCP", "INP", "CLS", "Web Vitals"]
featured: true
accent: "#00D4AA"
image: "../../assets/blog/optimizing-core-web-vitals-modern-frontend.jpg"
imageAlt: "Performance monitoring dashboard with web vitals metrics"
---

Google doesn't care how clever your React hooks are if your LCP is 4.2 seconds. Core Web Vitals — LCP, INP, and CLS — are measurable, user-centric metrics that affect search rankings and conversion rates. I've fixed failing vitals on client sites built with React SPAs, Next.js App Router apps, and Astro static sites. The frameworks differ. The underlying problems repeat.

A UK e-commerce client came to me with a 38 mobile Lighthouse performance score. Cart abandonment was 72%. After a focused two-week vitals sprint — not a full rewrite — LCP dropped from 5.1s to 1.8s, INP from 420ms to 95ms, and CLS from 0.31 to 0.02. Conversion rate improved 19% in the following month. Same design. Same features. Better delivery.

## Understanding the Three Metrics

### LCP — Largest Contentful Paint

Measures when the largest visible content element renders. Usually a hero image, heading block, or video poster.

- **Good:** ≤ 2.5 seconds
- **Needs improvement:** 2.5–4.0 seconds
- **Poor:** > 4.0 seconds

### INP — Interaction to Next Paint

Replaced FID in March 2024. Measures responsiveness across all page interactions — clicks, taps, key presses. Reports the worst (or nearly worst) interaction latency.

- **Good:** ≤ 200 milliseconds
- **Needs improvement:** 200–500 milliseconds
- **Poor:** > 500 milliseconds

### CLS — Cumulative Layout Shift

Measures visual stability. Elements shifting during load — images without dimensions, ads injecting content, fonts swapping — accumulate a CLS score.

- **Good:** ≤ 0.1
- **Needs improvement:** 0.1–0.25
- **Poor:** > 0.25

These aren't abstract benchmarks. They're computed from real Chrome users via the Chrome User Experience Report (CrUX). Your Lighthouse score in dev tools is a lab test. CrUX is the field data Google uses for rankings.

## Diagnosing Problems: Lab vs Field Data

Start with both data sources. They often tell different stories.

**Lab data (Lighthouse, WebPageTest):**

```bash
npx lighthouse https://yoursite.com --preset=desktop --view
npx lighthouse https://yoursite.com --preset=mobile --view
```

**Field data (CrUX, Search Console):**

Check Google Search Console → Experience → Core Web Vitals. This shows what real users on real devices experience. A site that scores 95 in Lighthouse but fails CrUX has a problem that lab tests aren't reproducing — usually slow networks, low-end devices, or geographic latency.

I also use the `web-vitals` library for real-user monitoring:

```ts
import { onLCP, onINP, onCLS, onFCP, onTTFB } from "web-vitals";

function reportMetric(metric) {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
    page: window.location.pathname,
  };

  navigator.sendBeacon("/api/vitals", JSON.stringify(body));
}

onLCP(reportMetric);
onINP(reportMetric);
onCLS(reportMetric);
onFCP(reportMetric);
onTTFB(reportMetric);
```

Field RUM data on client sites has caught issues Lighthouse never flagged — a third-party chat widget spiking INP on mobile, a CDN cache miss adding 800ms to TTFB in Australia.

## Fixing LCP: The Most Common Bottleneck

LCP failures usually come from one of four sources: slow server response, render-blocking resources, slow resource load times, or client-side rendering delay.

### Optimize the LCP Element Directly

Identify what's being measured as LCP (Lighthouse tells you). Usually it's an image or text block.

```astro
---
import { Image } from "astro:assets";
import hero from "../assets/hero.webp";
---

<link rel="preload" as="image" href={hero.src} fetchpriority="high" />

<Image
  src={hero}
  alt="Team collaborating on product design"
  widths={[640, 1024, 1280]}
  sizes="100vw"
  loading="eager"
  decoding="async"
  class="hero-image"
/>
```

```tsx
// Next.js equivalent
import Image from "next/image";
import hero from "../assets/hero.webp";

<Image
  src={hero}
  alt="Team collaborating on product design"
  priority
  sizes="100vw"
  className="hero-image"
/>
```

Key LCP fixes:

- **Preload the LCP image** with `<link rel="preload">` or `priority` prop
- **Use modern formats** — WebP/AVIF over JPEG/PNG
- **Serve responsive images** with correct `sizes` attribute
- **Eliminate render-blocking CSS** — inline critical CSS, defer the rest
- **Reduce TTFB** — CDN, edge caching, static generation where possible

### Font Loading Strategy

Fonts are a silent LCP killer. A hero heading can't paint until its font loads if you haven't handled it correctly.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0000-00FF;
}
```

```html
<link
  rel="preload"
  href="/fonts/inter-var.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

Avoid `@import` for fonts in CSS. Avoid loading 6 font weights when you use 2. Self-host instead of chaining through Google Fonts CDN unless you need the dynamic subsetting and accept the latency trade-off.

### Server Response Time (TTFB)

For SSR pages, TTFB directly impacts LCP. Targets:

- Static/CDN: < 100ms
- SSR with caching: < 200ms
- SSR without caching: < 600ms

```ts
// Next.js — cache data fetching
export const revalidate = 3600;

export default async function Page() {
  const data = await fetch("https://api.example.com/posts", {
    next: { revalidate: 3600 },
  });
  // ...
}
```

## Fixing INP: Making Interactions Feel Instant

INP measures the full interaction lifecycle: input delay + processing time + presentation delay. Long JavaScript tasks on the main thread are the primary enemy.

### Break Up Long Tasks

Any task over 50ms can delay the next interaction. Split heavy computation:

```ts
function processLargeDataset(items: Item[]) {
  const CHUNK_SIZE = 50;
  let index = 0;

  function processChunk() {
    const end = Math.min(index + CHUNK_SIZE, items.length);
    for (; index < end; index++) {
      processItem(items[index]);
    }
    if (index < items.length) {
      requestIdleCallback(processChunk);
    }
  }

  processChunk();
}
```

### Defer Non-Critical JavaScript

```tsx
// Load chat widget only after page is interactive
useEffect(() => {
  const timer = setTimeout(() => {
    import("./ChatWidget").then(({ init }) => init());
  }, 3000);
  return () => clearTimeout(timer);
}, []);
```

### Optimize Event Handlers

Debouncing isn't just for search inputs — it protects INP on resize, scroll, and filter handlers:

```ts
function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const handleFilter = debounce((value: string) => {
  applyFilter(value);
}, 150);
```

### Audit Third-Party Scripts

On the e-commerce client site, a live chat script added 280ms to INP on every page load. Moving it to load after `requestIdleCallback` and only on `/contact` and `/support` pages cut site-wide INP in half.

Use Chrome DevTools Performance panel → Interactions track to find the culprit scripts.

## Fixing CLS: Stop the Page From Jumping

CLS frustrates users and costs conversions. A "Add to Cart" button shifting down 40px right as someone taps it is a direct revenue leak.

### Always Set Image Dimensions

```astro
<Image
  src={product}
  alt="Blue ceramic mug"
  width={400}
  height={400}
  class="product-thumb"
/>
```

```html
<!-- If you can't use a framework Image component -->
<img
  src="product.jpg"
  alt="Blue ceramic mug"
  width="400"
  height="400"
  style="aspect-ratio: 1 / 1;"
/>
```

### Reserve Space for Dynamic Content

```css
.ad-slot {
  min-height: 250px;
  contain: layout style paint;
}

.skeleton-card {
  height: 320px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### Font Loading Without Layout Shift

Use `font-display: swap` with matched fallback fonts:

```css
body {
  font-family: "Inter", system-ui, -apple-system, sans-serif;
}

/* Adjust fallback to match Inter metrics */
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2");
  font-display: swap;
  size-adjust: 100%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

Tools like [Fallback Font Generator](https://screenspan.net/fallback) help match metrics between custom and system fonts.

## Framework-Specific Patterns

### Astro

Astro's defaults help LCP and CLS. INP stays good if you limit island hydration:

```astro
<HeavyChart client:visible />
<SearchBar client:idle />
<!-- Never client:load unless above-fold and critical -->
```

### Next.js App Router

Server Components improve LCP by sending HTML without client JS. But `"use client"` boundaries can creep:

```tsx
// Bad — entire page becomes client-side
"use client";
export default function Page() { ... }

// Good — isolate client interactivity
// page.tsx (Server Component)
import InteractiveFilter from "./InteractiveFilter";

export default async function Page() {
  const data = await getData();
  return (
    <>
      <StaticContent data={data} />
      <InteractiveFilter initialData={data} />
    </>
  );
}
```

### React SPA

SPAs have the hardest vitals challenge because everything depends on JS execution. Mitigations:

- Server-side render critical routes (or migrate to a meta-framework)
- Code-split aggressively with `React.lazy()` and `Suspense`
- Pre-render marketing pages as static HTML

## Performance Budgets I Set for Client Projects

| Resource | Budget (gzipped) |
|----------|------------------|
| Total JavaScript | < 150 KB |
| Total CSS | < 50 KB |
| LCP image | < 100 KB |
| Web fonts | < 80 KB |
| Third-party scripts | < 50 KB |

| Metric | Target |
|--------|--------|
| LCP | < 2.0s |
| INP | < 150ms |
| CLS | < 0.05 |
| TTFB | < 200ms |

I enforce these with Lighthouse CI in the deploy pipeline:

```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v11
  with:
    urls: |
      https://staging.example.com/
      https://staging.example.com/services/
      https://staging.example.com/blog/sample-post/
    budgetPath: ./lighthouse-budget.json
    uploadArtifacts: true
```

## The Two-Week Vitals Sprint Process

When a client hires me specifically for vitals, here's my sprint plan:

**Days 1–2:** Audit with Lighthouse, CrUX, and RUM data. Identify the LCP element, worst INP interactions, and CLS sources.

**Days 3–5:** Fix LCP — images, fonts, TTFB, render-blocking resources.

**Days 6–8:** Fix CLS — image dimensions, dynamic content slots, font fallbacks.

**Days 9–11:** Fix INP — long tasks, third-party scripts, event handler optimization.

**Days 12–14:** Re-measure, deploy, monitor CrUX for 28 days.

This isn't a rewrite. It's surgical optimization with measurable before/after data.

## Common Mistakes That Waste Optimization Effort

**Optimizing Lighthouse score instead of CrUX.** Lab scores are useful for development. Rankings follow field data.

**Lazy-loading the LCP image.** Never `loading="lazy"` on above-the-fold hero images. It directly harms LCP.

**Adding a performance plugin to WordPress instead of fixing root causes.** Plugins can't fix 2 MB of page builder bloat.

**Measuring only on fast WiFi.** Throttle to 4G in DevTools. That's what half your users experience.

**Ignoring third-party scripts.** Analytics, chat, A/B testing, and social embeds are often the real INP problem.

## Conclusion

Core Web Vitals aren't a checklist you run once before launch. They're ongoing signals that your site respects users' time and devices. The fixes are technical — preload your LCP image, set image dimensions, break up long tasks, audit third-party scripts — but the impact is business-critical. Faster sites convert better, rank better, and cost less to serve.

Start with field data, fix the metric that's failing worst, measure again. Repeat until CrUX shows green across all three.


If lab green and field red still diverge on your money pages, start with work to [improve Core Web Vitals](/improve-core-web-vitals) — or a broader [website performance optimization](/website-performance-optimization) engagement when the backlog spans architecture, not only vitals.

## Key Takeaways

- LCP, INP, and CLS are field metrics from real Chrome users — CrUX data matters more than Lighthouse lab scores
- LCP fixes target the largest visible element: preload images, optimize fonts, reduce TTFB
- INP failures come from long JavaScript tasks and third-party scripts blocking the main thread
- CLS fixes require explicit image dimensions, reserved space for dynamic content, and matched font fallbacks
- Use both lab tools (Lighthouse) and field data (Search Console, web-vitals RUM) for complete diagnosis
- Set performance budgets for JS, CSS, fonts, and third-party scripts — enforce with Lighthouse CI
- Astro helps by default; React SPAs need the most intentional optimization work
- A focused two-week vitals sprint can improve conversion rates without a full site rewrite
