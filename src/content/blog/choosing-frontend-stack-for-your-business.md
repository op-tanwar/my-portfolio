---
title: "Choosing a Frontend Stack for Your Business (Without the Hype)"
description: "A practical framework for business owners and product leads — how I help clients pick between Astro, Next.js, React, and page builders based on goals, not Twitter trends."
publishDate: 2025-08-15
category: "Architecture"
tags: ["Architecture", "Business", "Astro", "Next.js", "React"]
featured: true
accent: "#bf00ff"
image: "../../assets/blog/choosing-frontend-stack-for-your-business.jpg"
imageAlt: "Business planning with laptop and charts"
---

Last month, a SaaS founder in Toronto sent me a Notion doc with twelve framework names highlighted in yellow. His co-founder had bookmarked three "best frontend stack 2025" listicles. Their actual product was a marketing site, a logged-in dashboard, and a blog. They didn't need twelve options. They needed a decision framework.

This happens constantly. Business owners aren't choosing between React and Vue because they love component lifecycles. They're choosing because the wrong stack costs money — slower launches, harder hiring, performance penalties that show up in conversion rates, and rebuilds eighteen months later when the page builder can't scale.

After five years of freelancing and shipping sites for startups, agencies, and established businesses, I've learned that the best stack isn't the newest one. It's the one that matches your business constraints: team skills, content update frequency, interactivity requirements, budget, and timeline. This article is the conversation I have with clients before we write a single line of code.

## Start With Business Goals, Not Framework Names

Before anyone mentions Next.js or Webflow, I ask five questions:

1. **What does this website need to do in twelve months?** A brochure site today might need e-commerce next quarter.
2. **Who updates content?** A developer, a marketing manager, or the founder copying from Google Docs?
3. **How interactive is the experience?** Static pages with a contact form, or a real-time dashboard with charts?
4. **What's your performance and SEO bar?** Local service business vs. national content publisher have different thresholds.
5. **What's your maintenance budget after launch?** Build cost is half the equation.

A London law firm needed fast pages, strong local SEO, and a blog their office manager could update. They didn't need server-side rendering for authenticated users. Astro with a headless CMS was the right call. A fintech startup needed KYC flows, account dashboards, and API integrations. Next.js with React was obvious.

The stack follows the brief. Not the other way around.

## The Four Categories of Frontend Projects

I bucket most client projects into four types. This simplifies conversations that otherwise spiral into framework theology.

### Content and Marketing Sites

Blogs, portfolios, landing pages, case studies, documentation. The HTML is mostly static. Data changes daily or weekly, not every second. Interactivity is localized — mobile menus, accordions, newsletter forms.

**Typical stack:** Astro, Eleventy, or a well-configured static site generator. Headless CMS for editing. Deploy to a CDN.

**Why not a full React SPA?** You're paying for a JavaScript runtime on pages that display text. Google can crawl it, but you're fighting unnecessary bundle weight. I've migrated three WordPress + page builder sites to Astro where LCP dropped from 3+ seconds to under 1.2 seconds without changing a word of copy.

### Web Applications

Dashboards, SaaS products, internal tools, member portals. Heavy client state, authentication, real-time updates, complex forms.

**Typical stack:** Next.js or Remix with React. TypeScript. API layer (REST, GraphQL, or tRPC). Hosted on Vercel, Railway, or AWS depending on compliance needs.

**Why not Astro alone?** Astro can host React islands, but when 80% of your UI is interactive, you're essentially building a React app with extra steps. Reach for the tool designed for applications.

### E-Commerce

Product catalogs, carts, checkout, inventory sync. Performance matters, but so do payment flows, webhooks, and edge cases around stock and discounts.

**Typical stack:** Shopify Hydrogen, Next.js with a commerce backend (Shopify, Medusa, Stripe), or Shopify itself if the client wants operational simplicity over custom UI.

I usually recommend Shopify for businesses under $2M annual revenue that don't need a fully custom storefront. Custom React storefronts make sense when brand experience is the differentiator and you have budget for ongoing maintenance.

### Hybrid Projects

Marketing site + app dashboard. Documentation + authenticated developer portal. This is increasingly common.

**Typical stack:** Split architecture. Astro or static marketing site. Next.js app on a subdomain or path-based routing. Shared design tokens, separate codebases.

A US health-tech client runs exactly this: `www` on Astro for SEO-critical pages, `app` on Next.js for patient dashboards. Two repos, one design system package. Clean separation, no compromise on either side.

## Framework Decision Matrix

Here's the simplified matrix I share with clients after the goals conversation:

| Requirement | Lean Toward |
|-------------|-------------|
| Mostly static content, SEO critical | Astro, static SSG |
| Heavy interactivity, auth, dashboards | Next.js + React |
| Non-technical team edits daily | Headless CMS + either stack |
| Need to ship in 2 weeks, budget under $3k | Quality template + light customization |
| Complex animations, brand-heavy marketing | Astro or Next.js with motion library |
| Real-time collaboration features | Next.js + WebSockets or dedicated backend |
| Team only knows WordPress | Consider WordPress block editor + performance audit, or migrate |

No row says "use whatever is trending." Every row connects a business need to a technical direction.

## Astro: When and Why I Recommend It

I recommend Astro frequently because most business websites are content sites pretending to be apps. Astro ships near-zero JavaScript by default, compiles to static HTML, and lets you add React or Vue components only where needed.

For a Berlin creative agency, we rebuilt their portfolio site in Astro. Their previous Squarespace site scored 54 on mobile Lighthouse. The Astro build scored 97. Same design, same images (optimized), same copy. The only change was architecture.

Astro makes sense when:

- Page speed and Core Web Vitals are business priorities
- Your team publishes articles, case studies, or docs regularly
- Interactivity is limited to forms, menus, and maybe a pricing calculator
- You want hosting costs under $20/month at moderate traffic

Astro is the wrong primary choice when the product is mostly behind a login with charts, tables, drag-and-drop, and optimistic UI updates.

## Next.js and React: When the Application Is the Product

When I join a project where users spend twenty minutes per session inside a logged-in interface, we're in React territory. Next.js adds routing, API routes, middleware, server components, and a deployment story that teams already understand.

A client building a project management tool for construction teams needed Gantt charts, file uploads, role-based permissions, and offline-tolerant forms on tablets. That's not a content site. We chose Next.js with TypeScript, Prisma for the database, and deployed on Vercel with preview environments for their QA team.

Next.js makes sense when:

- Authentication and authorization are core requirements
- You need API routes in the same codebase
- SEO matters for marketing pages but the product is the logged-in experience
- Your team already hires React developers

The cost is complexity. Server components vs. client components, caching strategies, hydration boundaries — these require experienced developers. Budget for that experience.

## Page Builders and No-Code: Honest Assessment

Webflow, Framer, Squarespace, and WordPress page builders aren't enemies. They're tools with a cost curve.

**Page builders win when:**

- You need to launch in days, not weeks
- The site is small (under 20 pages) and unlikely to grow into an app
- No developer is in the budget for six months post-launch
- Design iteration speed matters more than performance optimization

**Page builders lose when:**

- You need custom integrations (CRM, proprietary APIs, complex checkout)
- Performance and SEO are competitive advantages in your industry
- Multiple developers need to work in the codebase simultaneously
- You outgrow the platform's layout and CMS constraints

I've been hired to rebuild Webflow sites that hit the platform ceiling. I've also recommended Webflow to a solo consultant who needed a polished site in a week and would update it twice a year. Context matters.

## Headless CMS: The Piece Most Businesses Skip

Regardless of Astro or Next.js, content-heavy businesses need a CMS that non-developers can use. I default to Sanity or Decap CMS depending on budget and editor sophistication.

Sanity gives structured content, real-time preview, and image pipelines. Decap is free and Git-based — great for technical-adjacent teams. Contentful and Strapi appear on enterprise projects.

The CMS choice affects the frontend stack less than people think. Both Astro and Next.js integrate cleanly with headless CMS APIs. Pick the CMS based on who edits content and how often, then pick the frontend based on interactivity needs.

## Team and Hiring Reality

Your stack should match who maintains it after I leave. A beautiful Next.js codebase is a liability if your only in-house technical person is a WordPress admin.

Questions I ask:

- Can you hire React developers in your market and budget?
- Does your agency retainer include framework-specific expertise?
- Will you need to hand off to an internal team in six months?

If the answer to all three is no, bias toward simpler architectures — Astro with minimal islands, or a well-structured WordPress block theme with performance discipline. A stack you can maintain beats a stack that impresses developers on Twitter.

## Budget and Timeline Trade-offs

Rough ranges from my freelance practice (USD, 2025–2026):

| Project Type | Typical Range | Timeline |
|--------------|---------------|----------|
| Marketing site (Astro, 10–15 pages) | $4,000–$8,000 | 2–4 weeks |
| Marketing site (Next.js, content-heavy) | $6,000–$12,000 | 3–5 weeks |
| SaaS MVP (auth, dashboard, 5 core screens) | $15,000–$35,000 | 8–12 weeks |
| Page builder setup + customization | $1,500–$4,000 | 1–2 weeks |
| WordPress → Astro migration | $5,000–$15,000 | 3–6 weeks |

Cheaper isn't always better. A $2,000 page builder site that loads in 4 seconds can cost more in lost leads than an $8,000 Astro site that loads in 1 second. I help clients model that trade-off with their actual traffic and conversion data when available.

## Red Flags in Stack Conversations

Walk away or push back when:

- An agency recommends rebuilding everything in the newest framework with no business justification
- Someone insists on a SPA for a 10-page brochure site "for future flexibility"
- Performance is dismissed because "our users have good internet"
- The stack is chosen because the developer wants resume material
- No one can explain who updates content after launch

I've rescued projects where the previous developer chose micro-frontends for a team of two. The architecture was impressive and the product was six months late.

## My Process for Stack Recommendations

When a client hires me for architecture consulting before build, here's the deliverable:

1. **Requirements doc** — goals, users, content workflow, integrations, performance targets
2. **Stack recommendation** — primary framework, CMS, hosting, key libraries
3. **Risk notes** — what could force a pivot later (e.g., "if you add real-time chat, budget for WebSocket infrastructure")
4. **Rough timeline and phases** — MVP vs. full feature set
5. **Maintenance plan** — who owns what after launch

This takes 3–5 hours and saves weeks of wrong-direction building. If you're a business owner reading this, ask any developer you interview for something similar before they quote a build.

## Conclusion

Choosing a frontend stack for your business isn't a technical vanity contest. It's an operational decision that affects speed, cost, hiring, SEO, and how painful every future feature will be to ship.

Astro wins for content. Next.js wins for applications. Page builders win for speed and simplicity at small scale. Hybrids win when you honestly have two different products wearing one brand.

The founder in Toronto? We mapped their project to the hybrid model: Astro for marketing and blog, Next.js for the dashboard. One design system, two deployments, clear boundaries. They shipped the marketing site in three weeks and the dashboard MVP in ten. No yellow highlights required.

If you're facing this decision right now, start with your twelve-month business goals — not the framework leaderboard. The right stack is the one your team can ship, maintain, and afford. Everything else is noise.


After you pick a direction, I can help you [hire an Astro developer](/hire-astro-developer) for content-led sites or [hire a Next.js developer](/hire-nextjs-developer) when the product is the marketing site's sibling.


If you want a written recommendation before committing to a six-month build, start with [frontend consulting services](/frontend-consulting-services) — stack, risks, and phased scope without hiring a full delivery team yet. When the open question is redesign versus rebuild, use [website redesign or new website](/website-redesign-or-new-site) as the decision frame before you buy mockups for the wrong project type.

## Key Takeaways

- Choose your frontend stack based on business goals, content workflow, and maintenance capacity — not hype or download counts
- Content and marketing sites usually don't need a full React runtime; Astro or static generators often outperform SPAs on speed and SEO
- Web applications with auth, dashboards, and complex state belong in Next.js or similar full-stack React frameworks
- Hybrid architectures (Astro marketing + Next.js app) are valid and often optimal for growing businesses
- Page builders are legitimate for small, simple sites — but plan for a rebuild when you hit platform limits
- Pair any modern frontend with a headless CMS when non-developers need to edit content regularly
- Budget for the team that maintains the stack after launch, not just the initial build
- Ask for a written stack recommendation with risks and phases before committing to a large build
