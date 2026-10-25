---
title: "Real-World SEO Strategies for Astro Projects"
description: "Practical SEO tactics I use on client Astro sites — metadata, structured data, sitemaps, Core Web Vitals, and content architecture that drives organic traffic."
publishDate: 2026-02-08
updatedDate: 2026-06-10
category: "SEO"
tags: ["SEO", "Astro", "Structured Data", "Core Web Vitals", "Technical SEO"]
featured: false
accent: "#38BDF8"
image: "../../assets/blog/real-world-seo-strategies-astro-projects.png"
imageAlt: "SEO analytics on screen with search ranking graphs"
---

A client in the legal sector came to me with a problem that had nothing to do with design. Their Astro rebuild looked great. Their Core Web Vitals were green. But organic traffic flatlined for three months after launch. The issue wasn't the framework — it was everything around the framework. Missing canonical tags, duplicate title tags across 40 service pages, no structured data, and a sitemap that listed draft URLs.

SEO on Astro projects isn't automatic. The framework gives you fast, crawlable HTML — which is a prerequisite, not a strategy. After fixing that law firm's technical SEO and rebuilding their content architecture, organic sessions recovered and grew 28% quarter over quarter. This article covers the specific tactics I apply on every Astro client project.

## Why Astro Creates a Strong SEO Foundation

Search engines want three things: fast pages, clear content hierarchy, and trustworthy signals. Astro delivers the first two by default.

Static HTML means Googlebot gets full content on first crawl — no waiting for JavaScript execution. Compare that to client-rendered SPAs where crawlers may index a loading spinner instead of your H1.

```astro
<!-- What Googlebot sees from an Astro page -->
<article>
  <h1>Commercial Lease Review Services in London</h1>
  <p>Our solicitors review commercial leases for UK businesses...</p>
</article>
```

That's the entire rendered output. No hydration required. No `useEffect` fetching the title after paint. The content is there from byte one.

But a strong foundation without intentional SEO work is like building a fast car with no steering wheel. You need metadata, structure, and content strategy layered on top.

## Metadata Architecture Per Page

Every page needs unique, descriptive metadata. I centralize defaults in a layout and override per page.

```astro
---
// src/layouts/SEOLayout.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

const {
  title,
  description,
  image = "/og-default.jpg",
  noindex = false,
  type = "website",
  publishedTime,
  modifiedTime,
} = Astro.props;

const siteName = "Example Legal";
const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
const canonical = new URL(Astro.url.pathname, Astro.site).href;
const ogImage = new URL(image, Astro.site).href;
---

<head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  {noindex && <meta name="robots" content="noindex, nofollow" />}

  <meta property="og:type" content={type} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:site_name" content={siteName} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />

  {type === "article" && publishedTime && (
    <meta property="article:published_time" content={publishedTime} />
  )}
  {type === "article" && modifiedTime && (
    <meta property="article:modified_time" content={modifiedTime} />
  )}
</head>
```

Critical rules:

- **Title tags:** 50–60 characters, unique per page, primary keyword near the front
- **Meta descriptions:** 150–160 characters, include a call to action, unique per page
- **Canonical URLs:** Always absolute, always self-referencing unless consolidating duplicates
- **OG images:** 1200×630px minimum, unique per important page when possible

## Structured Data With JSON-LD

Structured data helps search engines understand your content and can unlock rich results. I inject JSON-LD in page templates, not globally.

```astro
---
// Blog post structured data
const { post } = Astro.props;
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.data.title,
  description: post.data.description,
  image: new URL(post.data.image ?? "/og-default.jpg", Astro.site).href,
  datePublished: post.data.publishDate.toISOString(),
  dateModified: (post.data.updatedDate ?? post.data.publishDate).toISOString(),
  author: {
    "@type": "Person",
    name: "Omprakash Tanwar",
    url: "https://example.com/about",
  },
  publisher: {
    "@type": "Organization",
    name: "Example Legal",
    logo: {
      "@type": "ImageObject",
      url: "https://example.com/logo.png",
    },
  },
};
---

<script type="application/ld+json" set:html={JSON.stringify(articleSchema)} />
```

For service businesses, I add `LocalBusiness` or `ProfessionalService` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "Example Legal LLP",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Fleet Street",
    "addressLocality": "London",
    "postalCode": "EC4A 2AB",
    "addressCountry": "GB"
  },
  "telephone": "+44-20-1234-5678",
  "url": "https://example.com",
  "areaServed": "GB"
}
```

Validate every schema with Google's Rich Results Test before launch. Invalid JSON-LD is worse than none — it signals sloppiness to crawlers.

## Sitemap and robots.txt Configuration

Astro's sitemap integration generates XML automatically, but you need to configure it correctly.

```js
// astro.config.mjs
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/draft/") && !page.includes("/admin/"),
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
```

```txt
# public/robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://example.com/sitemap-index.xml
```

Common mistakes:

- Including `/404`, `/thank-you`, or staging URLs in the sitemap
- Forgetting to submit the sitemap in Google Search Console after launch
- Using relative URLs in sitemap entries (always absolute)

For blog-heavy sites, I also generate an RSS feed — it's not a direct ranking factor, but aggregators and Google Discover use it:

```js
// src/pages/rss.xml.js
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: "Example Legal Blog",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
  });
}
```

## URL Structure and Internal Linking

Clean URLs matter for both crawlers and humans. My Astro projects follow these patterns:

```text
/                          → Homepage
/services/                 → Service hub
/services/commercial-lease-review/  → Individual service
/blog/                     → Blog index
/blog/astro-seo-guide/     → Individual post
/about/                    → About page
/contact/                  → Contact page
```

Rules:

- Lowercase, hyphenated slugs
- Trailing slashes consistent site-wide (pick one and redirect the other)
- No date-based URLs for evergreen content (`/blog/2026/02/post` ages poorly)
- Breadcrumbs on every page deeper than level 2

Internal linking is the most underused SEO lever. Every blog post should link to 2–3 related posts and at least one service page. Every service page should link to relevant case studies and blog articles.

```astro
---
// src/components/RelatedPosts.astro
const { currentSlug, posts } = Astro.props;
const related = posts
  .filter((p) => p.id !== currentSlug)
  .filter((p) => p.data.category === currentCategory)
  .slice(0, 3);
---

<aside aria-label="Related articles">
  <h2>Related reading</h2>
  <ul>
    {related.map((post) => (
      <li>
        <a href={`/blog/${post.id}/`}>{post.data.title}</a>
      </li>
    ))}
  </ul>
</aside>
```

## Core Web Vitals as a Ranking Signal

Google uses LCP, INP, and CLS as ranking signals. Astro's architecture helps, but you still need discipline:

**LCP (Largest Contentful Paint):** Target under 2.5s. Preload hero images, self-host fonts, minimize server response time on SSR pages.

```html
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />
```

**INP (Interaction to Next Paint):** Target under 200ms. Minimize island hydration, defer non-critical JS.

**CLS (Cumulative Layout Shift):** Target under 0.1. Set explicit width/height on images, reserve space for embeds, avoid injecting content above existing content.

I add a `web-vitals` reporting snippet on client projects to track real-user metrics:

```ts
import { onLCP, onINP, onCLS } from "web-vitals";

function sendToAnalytics(metric) {
  // Send to your analytics endpoint
  console.log(metric.name, metric.value);
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

## Content Strategy That Compounds

Technical SEO gets you crawled. Content gets you ranked. For Astro client sites, I recommend a hub-and-spoke model:

- **Hub pages** target broad keywords (`/services/commercial-property/`)
- **Spoke pages** target long-tail queries (`/blog/what-to-check-before-signing-a-commercial-lease-uk/`)
- **Spokes link back to hubs** with descriptive anchor text

For the legal client, we published 24 articles over six months targeting specific search queries their sales team heard on calls. Each article linked to the relevant service page. Service pages linked back to the top-performing articles. Organic leads from search went from 3/month to 11/month — measurable revenue impact.

## Handling Multilingual and Multi-Region SEO

EU clients often need content in multiple languages. Astro supports this with localized routes:

```text
/en/services/     → English
/de/leistungen/   → German
/fr/services/     → French
```

Each locale needs:

- `hreflang` tags pointing to all language variants
- Unique translated content (not machine-translated garbage)
- Locale-specific canonical URLs

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/services/" />
<link rel="alternate" hreflang="de" href="https://example.com/de/leistungen/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/services/" />
```

## Migration SEO: Don't Lose Rankings

When migrating an existing site to Astro, protect your rankings:

1. **Audit current URLs** — export all indexed URLs from Search Console
2. **Map old URLs to new URLs** — 1:1 redirects wherever possible
3. **Implement 301 redirects** in `_redirects` (Netlify) or `_worker.js` (Cloudflare)
4. **Keep title tags and meta descriptions** similar to well-ranking pages
5. **Monitor Search Console** for 404 spikes and crawl errors for 30 days post-launch
6. **Don't launch on Friday** — give yourself a week to fix issues

```txt
# public/_redirects (Netlify)
/old-blog/:slug    /blog/:slug    301
/services/old-name /services/new-name 301
```

I've seen clients lose 40% of organic traffic from sloppy migrations. The rebuild was faster. The redirects weren't.

## Measuring SEO Success

Track these monthly for every Astro client project:

| Metric | Tool | Target |
|--------|------|--------|
| Organic sessions | Google Analytics 4 | Month-over-month growth |
| Indexed pages | Search Console | Match published page count |
| Average position | Search Console | Improving for target keywords |
| Core Web Vitals | Search Console + CrUX | All "Good" |
| Crawl errors | Search Console | Zero critical errors |
| Backlinks | Ahrefs or Search Console | Growing naturally |

SEO is a 3–6 month game on new domains, shorter on established domains with good migrations. Set client expectations accordingly.

## Common SEO Mistakes on Astro Projects

**Duplicate title tags across pages.** Happens when the layout default isn't overridden. Audit with Screaming Frog.

**Missing alt text on images.** Astro doesn't add it for you. Every `<Image>` needs a descriptive `alt`.

**Blocking CSS/JS in robots.txt.** Some teams block `/assets/` thinking it's security. Google needs those files to render pages.

**Noindex on staging that leaks to production.** Check `astro.config` environment variables carefully.

**Thin content pages.** A service page with 100 words won't rank. Aim for 800+ words of genuine expertise per service page.

## Conclusion

Astro gives you the technical prerequisites for SEO — fast, crawlable, well-structured HTML. The strategy layer is still your responsibility: unique metadata, structured data, intentional URL architecture, internal linking, and content that answers real search queries.

The law firm client didn't need a different framework. They needed canonical tags, a proper sitemap, and articles targeting the questions their prospects were already typing into Google. Fix the technical foundation, build the content engine, and measure relentlessly. That's how Astro projects turn into organic traffic machines.


If your next content platform needs those SEO habits baked into the build — not bolted on later — [hire an Astro developer](/hire-astro-developer) who ships metadata, sitemaps, and internal linking by default. The same foundations support realistic [AI website optimization](/ai-website-optimization) for answer engines and AI search — schema, entities, and HTML-first content — without promising placements in any chat product.

## Key Takeaways

- Astro's static HTML is an SEO prerequisite, not a complete strategy — you still need metadata, structure, and content
- Every page needs unique title tags, meta descriptions, canonical URLs, and Open Graph tags
- JSON-LD structured data for Articles, LocalBusiness, and FAQ can unlock rich search results
- Configure sitemaps to exclude drafts and admin pages; submit to Google Search Console
- Use hub-and-spoke content architecture with strong internal linking between blog posts and service pages
- Protect rankings during migrations with 301 redirects and Search Console monitoring
- Core Web Vitals are ranking signals — Astro helps, but image optimization and minimal JS still matter
- Measure organic sessions, indexed pages, and crawl errors monthly — SEO results take 3–6 months to compound
