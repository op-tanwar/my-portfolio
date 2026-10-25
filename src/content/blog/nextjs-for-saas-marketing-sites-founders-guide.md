---
title: "Next.js for SaaS Marketing Sites: What Founders Should Know"
description: "Should your SaaS marketing site use Next.js? A founder-focused guide to when Next.js is the right public-site choice, when Astro is leaner, and how to avoid shipping a sluggish brochure site on an application framework."
publishDate: 2026-07-08
category: "Next.js"
tags: ["Next.js", "SaaS", "Business", "Marketing", "Architecture"]
featured: false
accent: "#bf00ff"
image: "../../assets/blog/nextjs-for-saas-marketing-sites-founders-guide.jpg"
imageAlt: "Next.js development for SaaS marketing websites and startup founders"
---

SaaS founders often default to Next.js for everything because the product already uses React. That default is sometimes correct — and sometimes how you end up with a 400KB homepage for a pricing page that should have been static HTML.

I build both Next.js SaaS marketing sites and Astro marketing sites for product companies. This article is the advice I give founders during discovery: when Next.js serves the go-to-market site well, when it adds needless complexity, and how to keep the public site fast even when you choose Next.

For a broader Astro-vs-Next product decision, see [Astro vs Next.js in 2026](/blog/astro-vs-nextjs-which-to-choose-2026). This post zooms specifically into **SaaS marketing** surfaces: homepage, pricing, blog, docs lite, and campaign landers.

## What a SaaS Marketing Site Actually Needs

Typical requirements:

- Fast load on mobile (ads + organic)
- CMS or MDX workflow for blog/changelog
- Experiment-friendly landing pages
- Clean integration with product auth ("Log in" / "Start trial")
- SEO for category and comparison pages
- Design fidelity to brand

Heavy client state is usually *not* a requirement for these pages. The app owns that.

## When Next.js Is the Right Call

Choose Next.js for the marketing site when:

1. **Shared design system / component library** with the product already in React
2. **Personalization or gated content** that benefits from server logic in the same ecosystem
3. **Mid-market SEO apps** (interactive calculators, authenticated resource hubs) living on `www`
4. **One engineering team** owns web end-to-end and context-switching costs more than JS weight
5. You will use Server Components carefully so brochure routes stay lean ([Server vs Client Components guide](/blog/server-components-vs-client-components-nextjs))

Next.js is also reasonable when you're already standardized on Vercel and the team knows the App Router well.

## When Astro (or Static) Is Leaner

Choose Astro when:

- Marketing is mostly content and conversion pages
- Performance and content-editor independence are the priority
- Product engineers shouldn't be blocked by blog publishing
- You want near-zero JS by default on public pages

I've seen Series A companies cut homepage JS dramatically by moving `www` to Astro while keeping `app` on Next. The brand stayed consistent via shared tokens. Paid landing LCP improved enough to matter to CAC.

## The Hybrid Pattern Most SaaS Companies Eventually Want

```text
www.example.com   → marketing + blog (Astro or Next, HTML-first)
app.example.com   → product (Next.js / React)
docs.example.com  → docs platform
```

Shared: brand, analytics conventions, cookie/consent strategy.
Separated: deploy cadence, performance budgets, failure domains.

If your SPA currently mixes these, read [Is Your React SPA Hurting SEO?](/blog/react-spa-hurting-seo-signs-and-fixes).

## Performance Rules If You Do Use Next.js for Marketing

Founders should demand these engineering defaults:

- Server Components by default on content routes
- No client JS for static pricing tables without interaction
- Next/Image (or equivalent) with explicit sizes for heroes
- Third-party tags loaded with intent — not a tag-manager free-for-all
- Lighthouse CI or equivalent on staging for key templates

Without these rules, Next.js marketing sites regress into SPA-shaped brochure pages. The playbook in [Next.js Performance Optimization](/blog/nextjs-performance-optimization) is essentially mandatory if ads spend is real money.

## CMS Options Founders Ask About

| Approach | Best when |
|----------|-----------|
| MDX/content collections in repo | Engineers are fine with PRs; low editor count |
| Sanity / other headless CMS | Marketing ships weekly without eng |
| Hybrid | Docs/engineering content in git; campaigns in CMS |

Sanity + Astro is a common client workflow — see [Sanity CMS + Astro: A Production Content Workflow](/blog/sanity-cms-astro-content-workflow). Sanity + Next also works; pick based on where marketing lives.

## Cost and Ownership Implications

Next.js marketing sites are not automatically more expensive than Astro sites. Cost follows scope, design readiness, and CMS complexity. The hidden cost is **ongoing JS discipline**. If your team treats the marketing site like the app, performance debt accumulates.

Budget ranges for scoped marketing builds appear in [How Much Does a Freelance Frontend Developer Cost in 2026?](/blog/how-much-does-freelance-frontend-developer-cost).

## Case Study: Series A Defaulted to Next — Then Split — Toronto

A Toronto Series A had Next.js for the product and copied the same App Router repo for `www`. Six months later the homepage imported chart libraries "just in case," marketing waited on product release trains for blog typo fixes, and paid landers failed mobile LCP.

We moved marketing to Astro with shared design tokens exported from the design system. Product stayed on Next. Conference campaign landers shipped same-day from the CMS without an eng sprint. CAC conversations got less defensive because LCP stop being the excuse.

Next wasn't "wrong." Using it as an ungoverned dumping ground for brochure pages was.

## Case Study: Next.js Marketing Done Well — Dublin

A Dublin B2B SaaS needed interactive ROI calculators and personalized resource hubs on `www` — genuinely server-logic territory. Astro would have fought them weekly.

We kept Next for marketing with explicit rules:

- Server Components by default on content routes
- Calculators isolated as client islands
- Shared UI package with the app, but separate deploy and performance CI
- Third-party tags allowlisted per template

That's the version of "one framework" that works — constraints first, familiarity second. Component judgment lives in [Server Components vs Client Components in Next.js](/blog/server-components-vs-client-components-nextjs).

## Founder Decision Tree

```text
Do marketing pages need shared React with the app?
  no → prefer Astro/static for www
  yes → Do you need server logic / gated resources on www?
           no → shared tokens + Astro still OK
           yes → Next.js marketing with SC defaults + budgets
Are release cadences fighting each other?
  yes → split hosts even if both use React/Next
Is SEO/content a primary growth channel?
  yes → HTML-first budgets non-negotiable either way
```

Print this before the architecture debate turns tribal. Companion comparison: [Astro vs Next.js in 2026](/blog/astro-vs-nextjs-which-to-choose-2026).

## Landing Page Systems for Paid Acquisition

SaaS founders running Google/LinkedIn ads should demand a **landing template system**, not one-off pages that rot:

| Piece | Why it matters |
|-------|----------------|
| Shared hero/form patterns | Fast experiment assembly |
| Performance budget per template | Prevents "special" pages from breaking CWV |
| CMS fields for headline/CTA/proof | Marketing iterates without deploys |
| Isolated tracking stubs | Avoid tag soup per campaign |

Whether that system lives in Next or Astro matters less than whether someone owns the budget when a new chat widget appears. Remediation sequencing if you've already slipped: [Convert a Slow Website Into a Fast, Modern Site](/blog/convert-slow-website-to-fast-modern-site).

## Docs, Blog, and Changelog: Don't Mix Casually

A common failure mode: dumping docs into the marketing Next app because "it's all web." Docs have different IA, search, and versioning needs. Prefer:

- Blog/changelog near marketing CMS workflow
- Product docs on a docs platform or dedicated route with its own performance profile
- Clear navigation between `www` ↔ `docs` ↔ `app` without one mega-bundle

Founders undervalue editorial independence until a broken product deploy blocks a funding announcement post.

## Anti-Patterns I Push Back On

1. Client-rendering the pricing page "for flexibility"
2. Shipping the app shell on thought-leadership articles
3. Animating everything because the product dashboard is animated
4. Letting Tag Manager become an unreviewed second engineering org
5. Skipping [Next.js performance practices](/blog/nextjs-performance-optimization) because "Vercel is fast"

Hosting is not a substitute for discipline.

## What to Put in the Brief for a Freelancer

If you hire me (or anyone) for a SaaS marketing frontend, include:

- Sitemap of public routes vs app routes
- Whether personalization/gating exists on `www`
- CMS owners and publishing frequency
- Ad landing URL list and spend sensitivity
- Existing design system / token source
- Preference: unify on Next vs split Astro/`www`

That brief turns a framework argument into a scoped proposal — with Soft CTAs optional, numbers preferred.

## Metric Dashboard Founders Should Review Monthly

If Next hosts marketing, put these on a recurring agenda:

| Metric | Healthy signal |
|--------|----------------|
| Mobile LCP on `/` and top lander | Within budget |
| JS transferred on pricing | Not climbing every release |
| Time-to-publish a blog post | Hours, not sprint tickets |
| Broken tag regressions | Caught in staging |
| Organic landing CVR | Stable or improving after deploys |

When JS weight creeps and publishing time grows, your "one framework" advantage is eroding. Remediate early with [Next.js Performance Optimization](/blog/nextjs-performance-optimization) practices — or revive the split conversation before CAC apologies become a habit.

## Experimentation Without Breaking the Shell

SaaS marketing lives on experiments. Structure them so they can't torpedo CWV:

1. Campaign landers inherit a performance-approved template
2. Optional widgets are route-scoped, not global
3. Variants change content fields first, JS second
4. Winners get design-system promotion; losers get deleted, not left as dead code

I've seen "temporary" countdown scripts from a Q4 campaign still punishing INP in June. Temporary needs an owner and an expiry date.

## Design System Sharing Without Bundle Sharing

Shared React packages are valuable. Shared accidental imports are not. Techniques that work:

- Tokens (color, type, space) as the primary sync mechanism
- A thin UI package with tree-shakeable components
- Explicit bans on importing app-only providers into marketing layouts
- Visual QA against brand, not against shipping the entire product dependency graph

Brand consistency is a design-ops problem first. Framework unity is optional.

## Hiring Signal for This Work

Whether you hire a freelancer or assign an in-house engineer, look for someone who has shipped **marketing** Next routes under a budget — not only product dashboards. Dashboard instincts optimize for interactivity; marketing instincts optimize for HTML weight and publish speed. Ask for a before/after LCP on a pricing or blog template they've owned. Resume keywords that say "Next.js" without that story are incomplete for `www`.

If you're weighing Astro versus Next for the public site right now, keep the decision tree above handy — and remember CAC cares about milliseconds more than which React logo is on the deploy badge.

## Conclusion

Next.js is a solid SaaS marketing choice when React reuse, server logic, or team simplicity outweigh the risk of over-shipping JavaScript. Astro is often leaner for HTML-first GTM pages. Many durable setups split `www` and `app` instead of forcing one framework to do both jobs poorly.

If you're planning a SaaS site relaunch and want a clear recommendation — Next, Astro, or split — [send me your current sitemap and product constraints](/#contact). For product-aware marketing UI, hire a [frontend developer for SaaS](/frontend-developer-for-saas); when Next wins for www, [hire a Next.js developer](/hire-nextjs-developer); when content speed wins, [hire an Astro developer](/hire-astro-developer). I'll map them to a stack that protects CAC and SEO, not just developer familiarity.

## Key Takeaways

- Don't default to Next.js for marketing only because the product uses React
- Use Next when shared React systems or server logic on `www` create real leverage
- Prefer Astro/static when content speed and minimal JS matter most
- Split marketing and app hosts when release cadences and budgets conflict
- Enforce Server Components + third-party discipline if Next hosts brochure pages
- CMS choice should follow who publishes — not which logo is trendy
---

