---
title: "Technical SEO Checklist Before You Launch a Website"
description: "A pre-launch technical SEO checklist for business websites — indexing, metadata, sitemaps, redirects, Core Web Vitals, and analytics — so your new frontend doesn't waste the traffic you paid to acquire."
publishDate: 2026-07-10
category: "SEO"
tags: ["SEO", "Technical SEO", "Business", "Frontend", "Launch"]
featured: false
accent: "#f7df1e"
image: "../../assets/blog/technical-seo-checklist-before-website-launch.jpg"
imageAlt: "Technical SEO checklist for a successful website launch"
---

Launch day excitement has a way of skipping boring work: robots rules, redirects, canonical tags, sitemap submission, and conversion event QA. I've seen beautiful frontends go live and then spend months recovering from avoidable indexing mistakes.

This checklist is what I run before a client site replaces production. It's written for founders, marketers, and PMs who need to know what "done" means — and for the frontend developer accountable for shipping it. Astro-specific tactics live in [Real-World SEO Strategies for Astro Projects](/blog/real-world-seo-strategies-astro-projects); this is the cross-stack launch gate.

## 1. Crawl and Index Controls

- [ ] `robots.txt` allows important sections; blocks only what should be blocked
- [ ] No accidental `noindex` on production templates
- [ ] Staging locked down (auth, robots, or both) so it doesn't compete with prod
- [ ] Canonical tags present and self-referential on primary URLs
- [ ] Pagination/filter URLs handled deliberately (index or canonicalize)

## 2. URL Strategy and Redirects

- [ ] Final URL inventory signed off by SEO/marketing
- [ ] 301 redirects mapped for every changed/retired URL with traffic or backlinks
- [ ] Trailing slash policy consistent
- [ ] HTTP → HTTPS and apex ↔ `www` resolved to one preferred host
- [ ] Custom 404 with path back into key sections

Migrations amplify this risk — the discipline in [Migrating WordPress to Astro Without Losing SEO](/blog/migrating-wordpress-to-astro-without-losing-seo) applies to any platform change.

## 3. Metadata and Share Previews

- [ ] Unique title and meta description templates for key page types
- [ ] Open Graph / Twitter cards resolve correct title, description, image
- [ ] No "Home" or "Untitled" titles on interior pages
- [ ] Article pages include sensible author/date fields when relevant

Spot-check with real link debuggers, not only localhost.

## 4. Information Architecture Signals

- [ ] One clear H1 per primary page
- [ ] Heading hierarchy doesn't skip absurdly for style reasons
- [ ] Internal links connect hub pages to money pages
- [ ] Blog/category routes are reachable without orphaning
- [ ] HTML sitemap or clear footer IA for humans (bonus for crawlers)

## 5. Structured Data (Where It Earns Its Keep)

- [ ] Organization/Person as appropriate on the site shell
- [ ] Article schema on blog posts
- [ ] Breadcrumb schema on nested pages when useful
- [ ] Product/FAQ schema only when accurate — never fake rich-result markup

Invalid structured data is worse than none.

## 6. Performance as SEO Infrastructure

- [ ] Mobile LCP/INP/CLS checked on homepage + top landing templates
- [ ] LCP image prioritized; decorative images lazy-loaded
- [ ] Third-party scripts deferred or limited on acquisition pages
- [ ] Fonts don't cause layout thrash

Core Web Vitals are ranking-adjacent and conversion-critical. See [Optimizing Core Web Vitals](/blog/optimizing-core-web-vitals-modern-frontend) and [Convert a Slow Website Into a Fast, Modern Site](/blog/convert-slow-website-to-fast-modern-site).

## 7. Content Parity and Indexability

- [ ] Primary copy exists in HTML (not only behind client-only rendering)
- [ ] Images have meaningful alt text where they convey information
- [ ] Legal pages present (privacy, terms) if you collect data
- [ ] Soft-404s don't return 200 with empty shells

If marketing runs on a React SPA shell, read [Is Your React SPA Hurting SEO?](/blog/react-spa-hurting-seo-signs-and-fixes) before launch.

## 8. Analytics and Conversion Integrity

- [ ] Analytics base tag fires once
- [ ] Conversion events tested on staging and production
- [ ] Thank-you pages or events align with ad platform pixels
- [ ] Consent/CMP behavior doesn't silently drop needed measurement in your jurisdictions

SEO traffic you can't attribute still matters — but teams fund what they can measure.

## 9. Sitemap and Search Console

- [ ] XML sitemap generated and linked from robots
- [ ] Sitemap contains only canonical 200 URLs you want indexed
- [ ] Google Search Console property verified for the final domain
- [ ] Sitemap submitted post-launch
- [ ] Bing Webmaster Tools optional but cheap insurance

## 10. Post-Launch Watch Window (First 14 Days)

- [ ] Coverage reports monitored for sudden spikes in excluded/error pages
- [ ] Top landing pages compared vs pre-launch baselines
- [ ] Redirect hits sampled for chains/loops
- [ ] CWV field data watched as CrUX updates

Assign an owner. Checklists without owners are decoration.

## How I Use This With Clients

When businesses hire me to ship a marketing frontend, this checklist is part of acceptance — not an optional SEO add-on. Launch is a technical event with business consequences.

If your team is approaching launch and wants a second set of eyes on technical SEO before DNS flips, [ping me](/#contact) with staging access and the URL diff from the old site — and treat money-page CWV as part of [website performance optimization](/website-performance-optimization), especially on Astro launches where you [hire an Astro developer](/hire-astro-developer).

## Case Study: Redesign Launch Without Redirect QA — Leeds

A Leeds consultancy relaunched on a modern frontend with prettier URLs. Nobody owned the redirect spreadsheet. Within two weeks, Search Console showed soft losses on money service pages that had ranked for years. Paid ads still pointed at old paths that 404'd intermittently depending on CDN cache.

Recovery meant emergency 301s, sitemap cleanup, and an awkward conversation about "launch ownership." The frontend looked great. The technical SEO gate had been treated as optional polish.

Now when I ship redesigns with clients, redirect sign-off is a named acceptance criterion — same seriousness as forms into CRM. The migration mindset in [Migrating WordPress to Astro Without Losing SEO](/blog/migrating-wordpress-to-astro-without-losing-seo) applies even when you're only changing URL taste.

## Case Study: SPA Soft-404s — Copenhagen

A Copenhagen product company launched a marketing refresh still embedded in a client-rendered shell. Staging had looked fine with JS on. Production "About" and several campaign URLs returned 200 with empty roots for scrapers and some preview bots.

We blocked launch of phase-two landers until public routes were prerendered and status codes were verified with curl and a crawler — not only Chrome with JS enabled. If that sentence feels relevant, read [Is Your React SPA Hurting SEO?](/blog/react-spa-hurting-seo-signs-and-fixes) before you flip DNS.

## Pre-Launch Roles: Who Owns Which Box?

Checklists fail without names:

| Area | Typical owner | Frontend owns? |
|------|---------------|----------------|
| Redirect map | SEO/marketing lead | Implements |
| robots/staging locks | Frontend + DevOps | Yes |
| Titles/meta templates | Marketing + Frontend | Implements patterns |
| Structured data accuracy | Marketing (claims) + Frontend | Markup only if true |
| CWV on money templates | Frontend | Yes |
| Analytics/pixels | Marketing ops | Wires + verifies |
| Search Console | Marketing | Verifies property |

On smaller teams one person wears many hats — still write the hat names down so nothing is "assumed."

## Staging vs Production Gotchas

```text
Staging must:
  - Disallow indexing (robots + preferably auth)
  - Use non-production analytics properties when possible
  - Mirror redirect rules you'll ship

Production must:
  - Allow intended sections
  - Use final canonical host
  - Fire production pixels after consent rules
```

I've watched staging get indexed because someone copied a prod robots file "temporarily." Temporary is forever on the internet.

## Minimal Command-Line Sanity Checks

Before DNS cutover, I still run boring checks:

```bash
# headers and status
curl -I https://www.example.com/old-path

# follow redirects (look for chains)
curl -sI -L https://example.com | findstr /I "HTTP location"

# confirm HTML has primary copy (not empty shell)
curl -s https://www.example.com/pricing | findstr /I "Pricing"
```

Use your OS equivalents — the point is verifying without trusting only a logged-in browser session. Pair with Lighthouse on mobile for [Core Web Vitals](/blog/optimizing-core-web-vitals-modern-frontend) on the same templates you'd advertise.

## Launch-Day Sequence I Prefer

1. Final freeze on URL changes
2. Redirects deployed and sampled
3. Sitemap live; Search Console submit
4. Analytics and conversion smoke tests with real thank-you paths
5. DNS / go-live
6. Immediate crawl sample of top 20 equity URLs
7. 48-hour and 14-day Scan Console reviews

Skipping to champagne between steps 4 and 6 is how "mysterious" organic dips get blamed on algorithm updates unfairly.

## Content Launches vs Domain Migrations

Not every launch is a migration — but if you're changing hosts, frameworks, or URL patterns, treat it like one. Preserve equity. Document exceptions. If you're also fixing a slow stack, sequence performance work with the gate in [Convert a Slow Website Into a Fast, Modern Site](/blog/convert-slow-website-to-fast-modern-site) so you don't launch "technically correct" but still sluggish money pages.

## International and Multi-Domain Extras

If you launch with hreflang, country domains, or language prefixes:

- [ ] Language/region codes are correct and reciprocal
- [ ] Canonical strategy doesn't fight hreflang
- [ ] Currency/locale landing pages aren't thin doorways
- [ ] Consent and analytics respect regional requirements

A Berlin–London dual-language launch I supported almost shipped inverted `hreflang` pairs. Technical SEO is unforgiving of "we'll fix locale next sprint" on day one.

## Image and Media SEO Often Skipped

Frontend launches focus on templates and forget media:

- Descriptive filenames when relevant (not only `IMG_2031.jpg`)
- Alt text for informative images; empty alt for pure decoration
- OG images cropped for sharing, not accidental screenshots
- Lazy-load below-fold; don't lazy-load the LCP image

Media mistakes rarely tank a whole domain alone — they nick CTR and accessibility while you're celebrating Lighthouse. Bundle them into the same gate as metadata.

## Sign-Off Document Template

Before DNS:

```text
Site: …
Owner of redirects: …
Owner of Search Console: …
Owner of analytics: …
CWV money URLs checked: …
Known exceptions (accepted risks): …
Rollback plan: …
Watch window owner (14 days): …
```

Print it. Sign it. Optional sentiment: champagne. Required artifact: this page.

## Don't Launch Broken Measurement Blindly

If consent Mode or a CMP isn't fully configured, document the gap. Shipping with partial analytics is sometimes unavoidable — shipping without knowing you're blind is how teams invent false "SEO wins" or losses. Note the limitation in the sign-off, schedule the fix, and avoid major channel judgments until events fire correctly in production.

One more habit: assign a human to watch Search Console daily for the first week — not a shared inbox nobody opens. Indexing surprises love weekends.

## Conclusion

Technical SEO before launch is mostly unglamorous verification: index controls, redirects, metadata, HTML-first content, performance, analytics, and Search Console. Skipping it turns a frontend launch into an organic recovery project.

Print this checklist. Assign owners. Don't celebrate launch until the boring boxes are green.

When launch also needs machine-readable clarity for classic search and AI assistants, fold schema, entity consistency, and crawlable HTML into [AI website optimization](/ai-website-optimization) — after the checklist gates pass, not instead of them.

## Key Takeaways

- Lock staging out of the index; keep production intentionally crawlable
- Redirect anything with equity; don't "simplify" URLs casually
- Validate titles, canonicals, and social previews on real templates
- Treat Core Web Vitals as launch criteria on money pages
- Ensure primary content is HTML-visible, not only client-rendered
- Submit a clean sitemap and watch Search Console for two weeks
---

