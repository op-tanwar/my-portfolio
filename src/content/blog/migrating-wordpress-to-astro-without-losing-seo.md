---
title: "Migrating WordPress to Astro Without Losing SEO"
description: "A step-by-step migration playbook from a freelancer who's moved 15+ WordPress sites to Astro — redirects, metadata, structured data, and the mistakes that tank rankings."
publishDate: 2025-09-20
category: "Astro"
tags: ["Astro", "WordPress", "SEO", "Migration", "Performance"]
featured: true
accent: "#00fff7"
image: "../../assets/blog/migrating-wordpress-to-astro-without-losing-seo.jpg"
imageAlt: "Website migration and SEO analytics on screen"
---

Six months after migrating a UK accounting firm's WordPress site to Astro, their marketing director emailed me a screenshot from Google Search Console. Impressions were up 41%. Average position improved across their top twenty keywords. Organic traffic hadn't just held — it had grown.

She asked the question every client asks during a migration: "Are we sure we didn't break SEO?"

We hadn't. But that outcome wasn't accidental. WordPress-to-Astro migrations fail SEO when teams treat them as redesigns instead of URL-preserving infrastructure upgrades. I've seen businesses lose half their organic traffic because someone forgot redirect maps, changed slug structures without planning, or dropped structured data during the move.

This article is the playbook I use on client migrations — the technical steps, the SEO safeguards, and the post-launch monitoring that catches problems before Google does.

## Why Businesses Leave WordPress

WordPress powers a huge slice of the web, and for good reason. It's accessible, the plugin ecosystem is vast, and non-technical teams know how to use it. But the combination that kills performance is familiar: bloated page builders, twenty plugins for features that should be native, unoptimized images, render-blocking scripts, and database queries on every page load.

The accounting firm I mentioned was running Divi with six marketing plugins, a live chat widget, and a slider that loaded 2.1 MB of JavaScript on the homepage. Mobile Lighthouse score: 38. Their content was excellent. Google just couldn't serve it efficiently.

They didn't leave WordPress because WordPress is bad. They left because their *instance* of WordPress had become unmaintainable, slow, and expensive to extend. Astro gave them static HTML, a headless CMS for their team, and hosting costs that dropped from $89/month to $0 on Cloudflare Pages.

The migration goal: same URLs, same content, better performance, zero ranking disruption.

## Pre-Migration Audit: What to Capture

Before touching Astro, I export everything WordPress currently provides to search engines.

### URL Inventory

Crawl the live site with Screaming Frog, Sitebulb, or a custom script. Export:

- Every indexable URL (posts, pages, categories, tags, custom post types)
- Current status codes
- Canonical tags
- Meta titles and descriptions
- H1 tags
- Internal link graph

This spreadsheet becomes the migration contract. If a URL exists in this export, it must exist (or redirect intentionally) after launch.

### Redirect Map

Identify URLs that will change:

```
/old-blog/2023/tax-tips/     →  /blog/tax-tips/
/category/updates/           →  /blog/
/author/jane/                →  /about/team/  (or 410 if retiring)
```

Every changed URL needs a 301 redirect. Not a meta refresh. Not a JavaScript redirect. A server-level 301.

In Astro on Netlify or Cloudflare, redirects live in config:

```toml
# netlify.toml
[[redirects]]
  from = "/old-blog/*"
  to = "/blog/:splat"
  status = 301
```

```js
// astro.config.mjs with @astrojs/cloudflare adapter
export default defineConfig({
  redirects: {
    "/old-blog/[...slug]": "/blog/[...slug]",
  },
});
```

### Structured Data Inventory

WordPress plugins like Yoast and Rank Math output JSON-LD for articles, breadcrumbs, and organization info. Export examples from live pages. You'll recreate these in Astro — plugins don't migrate automatically.

For a blog post, I typically implement:

```astro
---
// src/pages/blog/[slug].astro
const { post } = Astro.props;
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.data.title,
  datePublished: post.data.publishDate.toISOString(),
  dateModified: (post.data.updatedDate ?? post.data.publishDate).toISOString(),
  author: {
    "@type": "Person",
    name: post.data.author ?? "Omprakash Tanwar",
  },
  image: post.data.image,
  description: post.data.description,
};
---

<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

Missing structured data won't always tank rankings immediately, but rich results disappear from SERPs — and that's measurable traffic loss for content sites.

### Backlink Analysis

Pull top linked pages from Ahrefs, Semrush, or Google Search Console. These URLs are non-negotiable. If you must change them, 301 redirects are mandatory. If a high-authority backlink points to `/resources/guide-to-vat/` and you rename it to `/guides/vat/`, that redirect better work on day one.

## Content Migration Strategy

WordPress content lives in a MySQL database. Astro content typically lives in markdown files, a headless CMS, or both.

### Option A: Markdown + Content Collections

Best for sites under 200 pages where the client is comfortable with Git-based workflows or will use Decap CMS.

I export WordPress via WP REST API or XML export, then convert to markdown with a script:

```ts
// scripts/wp-to-markdown.ts (simplified)
import fs from "node:fs";

async function migrate() {
  const posts = await fetch("https://old-site.com/wp-json/wp/v2/posts?per_page=100").then(r => r.json());

  for (const post of posts) {
    const frontmatter = `---
title: "${post.title.rendered.replace(/"/g, '\\"')}"
description: "${post.yoast_head_json?.description ?? ""}"
publishDate: ${new Date(post.date).toISOString().split("T")[0]}
slug: "${post.slug}"
---

${htmlToMarkdown(post.content.rendered)}
`;
    fs.writeFileSync(`src/content/blog/${post.slug}.md`, frontmatter);
  }
}
```

Preserve slugs exactly. If WordPress served `/blog/my-post/`, Astro should serve `/blog/my-post/` — not `/articles/my-post/`.

### Option B: Headless CMS (Sanity, Contentful)

Best when marketing teams need a familiar editing UI and the site has hundreds of pages.

I import WordPress content into Sanity using their migration tools or custom scripts, then wire Astro to fetch at build time:

```ts
// src/lib/sanity.ts
import { createClient } from "@sanity/client";

export const sanity = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});
```

The SEO-critical part: Astro still generates static HTML at build time. Google sees the same crawlable markup WordPress served — without the PHP overhead.

## Preserving Metadata and Open Graph

Every page needs:

- Unique `<title>` (50–60 characters, keyword-forward but human-readable)
- Meta description (150–160 characters)
- Canonical URL
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter card tags

In Astro, I use a shared SEO component:

```astro
---
// src/components/Seo.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  canonical: string;
  noindex?: boolean;
}

const { title, description, image, canonical, noindex } = Astro.props;
const siteName = "Acme Accounting";
const fullTitle = `${title} | ${siteName}`;
---

<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{noindex && <meta name="robots" content="noindex, nofollow" />}

<meta property="og:type" content="website" />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
{image && <meta property="og:image" content={image} />}

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
{image && <meta name="twitter:image" content={image} />}
```

During migration, I compare old and new metadata side by side in a spreadsheet. If the WordPress title was "VAT Guide for Small Businesses | Acme Accounting" and the new site outputs "Blog Post | Acme", you've introduced regression.

## XML Sitemaps and robots.txt

WordPress plugins generate sitemaps automatically. In Astro, you build them:

```ts
// src/pages/sitemap.xml.ts
import type { APIRoute } from "astro";
import { getPublishedPosts } from "@/lib/blog";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPublishedPosts();
  const urls = [
    { loc: site, priority: "1.0" },
    { loc: `${site}/blog/`, priority: "0.8" },
    ...posts.map((post) => ({
      loc: `${site}/blog/${post.id}/`,
      lastmod: post.data.updatedDate?.toISOString() ?? post.data.publishDate.toISOString(),
      priority: "0.7",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.priority}</priority></url>`).join("\n")}
</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
```

Submit the new sitemap in Google Search Console on launch day. Keep `robots.txt` permissive unless you have staging constraints:

```
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml
```

## Handling Images and Media

WordPress uploads often live at `/wp-content/uploads/2023/04/image.jpg`. After migration, those paths break unless you:

1. **Migrate images** to Astro's `src/assets` or a CDN and update all references
2. **Proxy old paths** with redirects to new locations
3. **Keep the same URL structure** on a CDN bucket mapped to `/wp-content/uploads/`

I prefer option 1 with optimized formats. Astro's image component handles WebP conversion and responsive sizes:

```astro
---
import { Image } from "astro:assets";
import hero from "../assets/hero.jpg";
---

<Image src={hero} alt="Tax planning consultation" widths={[400, 800, 1200]} sizes="(max-width: 768px) 100vw, 800px" />
```

Broken images don't directly destroy rankings, but they increase bounce rates and break image search traffic — both indirect SEO hits.

## Performance Gains Without Content Changes

The accounting firm's SEO win wasn't from rewriting articles. It was from fixing Core Web Vitals.

Before migration:
- LCP: 4.1s
- CLS: 0.18
- INP: 320ms
- Total JavaScript: 1.8 MB

After migration:
- LCP: 0.9s
- CLS: 0.02
- INP: 85ms
- Total JavaScript: 28 KB

Google uses page experience signals as ranking factors. Faster sites with stable layouts earn better positions over time — especially on mobile. Migration is one of the few times you can dramatically improve vitals without touching content strategy.

## Launch Strategy: Staged vs. Big Bang

I prefer staged migrations for sites over 100 pages:

**Phase 1:** Launch blog on Astro at `/blog/` with WordPress still serving other pages. Validate redirects and indexing.

**Phase 2:** Migrate static pages (about, services, contact).

**Phase 3:** Migrate homepage and decommission WordPress.

For smaller sites (under 50 pages), big-bang launch works if you've run a complete redirect test in staging.

### Staging Environment Checklist

Before DNS cutover:

- [ ] Every URL from crawl inventory returns 200 or intentional 301
- [ ] No redirect chains longer than one hop
- [ ] Canonical tags point to production domain
- [ ] Structured data validates in Google's Rich Results Test
- [ ] Sitemap lists all indexable pages
- [ ] Internal links don't point to old WordPress domain
- [ ] `rel="noopener"` on external links preserved
- [ ] Analytics and Search Console verification tags present
- [ ] 404 page exists and is helpful

## Post-Launch Monitoring (First 90 Days)

SEO migration isn't done at launch. I monitor weekly for the first month, then biweekly through day 90.

**Google Search Console:**
- Coverage report — watch for spike in "Not found (404)" or "Page with redirect"
- Performance — compare impressions and clicks to pre-migration baseline
- Core Web Vitals — confirm field data improves

**Crawl comparison:**
Re-crawl the new site and diff against the pre-migration inventory. Any URL that returned 200 before must return 200 or 301 now.

**Rank tracking:**
Track twenty to fifty priority keywords. A temporary dip in week one is normal during re-crawl. A sustained drop after week three means something is wrong — usually redirects, canonical conflicts, or accidental noindex tags.

**Backlink spot checks:**
Manually test ten high-value backlinks from the Ahrefs export. If any hit 404, fix immediately.

## Common Migration Mistakes

**Changing URL structure for aesthetics.** `/blog/2023/03/post-name/` to `/blog/post-name/` requires redirects for every post. Do it if the old structure was genuinely harmful, but don't change slugs casually.

**Dropping pagination incorrectly.** If `/blog/page/2/` existed and you switch to infinite scroll with no paginated URLs, you lose indexable archive pages. Keep paginated routes or accept the SEO trade-off consciously.

**Leaving staging noindex on production.** I've seen it happen. Triple-check robots meta on launch day.

**Forgetting category and tag pages.** Thin tag pages might deserve `noindex`, but if they drove traffic, removing them without redirects causes 404 clusters.

**Launching Friday at 5 PM.** Give yourself Monday–Thursday runway to fix issues while your agency or freelancer is available.

## When Not to Migrate

WordPress isn't always the problem. If the site runs well on a lean theme, has few plugins, scores 85+ on Lighthouse, and the team loves the editor — optimize in place. Migration has cost and risk.

I also pause migrations when:

- A major product launch is within 30 days (don't compete for attention)
- The client hasn't documented their content workflow requirements
- No one owns post-launch SEO monitoring

Sometimes the right answer is WordPress with performance hardening, not Astro. Honest consulting saves everyone money.

## Conclusion

Migrating WordPress to Astro without losing SEO is a discipline problem, not a framework problem. The sites that gain rankings after migration do so because they preserved URLs, metadata, structured data, and internal linking while fixing the performance debt that was holding them back.

The accounting firm didn't get lucky. We crawled 847 URLs, mapped 23 redirects, validated JSON-LD on every template, launched on a Tuesday, and watched Search Console daily for three weeks. Their content was always good. Astro just let Google experience it the way users deserved.

If you're planning this migration, start with the URL inventory — not the design mockups. SEO is infrastructure. Treat it that way and your rankings will follow your performance gains.


Planning a WordPress → Astro move and want redirects, metadata, and CWV treated as launch blockers? Start with a dedicated [WordPress to Astro migration](/wordpress-to-astro-migration), or [hire an Astro developer](/hire-astro-developer) when the rebuild is broader than a straight cutover.

## Key Takeaways

- Crawl and export every indexable URL, meta tag, and structured data snippet before migration — this inventory is your contract
- Preserve slugs and paths wherever possible; every changed URL needs a tested 301 redirect
- Recreate JSON-LD, Open Graph, canonical tags, and sitemaps in Astro — plugins don't migrate automatically
- Migrate images deliberately and optimize them; broken media paths hurt user signals and image search traffic
- Core Web Vitals improvements after migration can boost rankings over time without changing content
- Use staged launches for large sites; validate redirects and indexing before decommissioning WordPress
- Monitor Google Search Console weekly for 90 days post-launch — catch 404 spikes and redirect issues early
- Don't migrate for ideology; migrate when WordPress performance and maintainability are genuinely blocking business goals
