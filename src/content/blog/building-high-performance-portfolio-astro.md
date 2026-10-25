---
title: "Building a High-Performance Portfolio With Astro"
description: "Step-by-step guide to building a portfolio that scores 95+ on Lighthouse using Astro, Tailwind, content collections, and performance patterns I use for clients."
publishDate: 2026-01-15
updatedDate: 2026-06-10
category: "Astro"
tags: ["Astro", "Portfolio", "Performance", "Tailwind", "Web Vitals"]
featured: true
accent: "#ff006e"
image: "../../assets/blog/building-high-performance-portfolio-astro.jpg"
imageAlt: "Clean portfolio website design displayed on laptop and phone"
---

Your portfolio is the one project where performance directly affects your income. A recruiter on a crowded train in London opens your link. If it takes four seconds to load, they've already swiped to the next candidate. I've rebuilt portfolios for developers who had beautiful Dribbble shots buried inside 300 KB JavaScript bundles. The work was good. The delivery was killing them.

I built my own portfolio on Astro after shipping similar sites for freelance clients. This article walks through the architecture, decisions, and code patterns I use to consistently hit 95+ Lighthouse scores on mobile — without sacrificing animations, project showcases, or a blog.

## Starting With Requirements, Not Frameworks

Before writing code, I define what a portfolio actually needs:

- **Homepage** with hero, services summary, featured projects, and CTA
- **Projects page** with filterable case studies
- **Blog** for technical articles (SEO funnel for freelance leads)
- **About and contact** pages
- **Dark mode** toggle
- **Sub-1.5s LCP** on mobile 4G
- **Accessible** navigation and form controls

That's a content site with sprinkles of interactivity — exactly Astro's sweet spot. No authentication, no real-time data, no shopping cart. If your portfolio needs those, you're building something else.

## Project Structure

Here's the folder layout I use:

```text
src/
├── components/
│   ├── layout/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── BaseLayout.astro
│   ├── ui/
│   │   ├── Button.astro
│   │   └── Card.astro
│   └── islands/
│       ├── ThemeToggle.tsx
│       ├── ProjectFilter.tsx
│       └── ContactForm.tsx
├── content/
│   ├── blog/
│   ├── projects/
│   └── config.ts
├── layouts/
│   ├── BaseLayout.astro
│   └── BlogLayout.astro
├── pages/
│   ├── index.astro
│   ├── projects/
│   ├── blog/
│   ├── about.astro
│   └── contact.astro
├── styles/
│   └── global.css
└── lib/
    ├── blog.ts
    └── projects.ts
```

The rule: `.astro` files for static markup, `islands/` folder for anything that needs `client:` directives. Keeping the boundary explicit prevents accidental hydration bloat.

## Base Layout With Critical CSS

The layout sets global metadata, fonts, and structure. Keep it lean — no heavy imports here.

```astro
---
// src/layouts/BaseLayout.astro
import Header from "../components/layout/Header.astro";
import Footer from "../components/layout/Footer.astro";
import "../styles/global.css";

interface Props {
  title: string;
  description: string;
  image?: string;
}

const { title, description, image } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {image && <meta property="og:image" content={image} />}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <Header />
    <main id="main-content">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

Font loading is a common LCP killer. I self-host fonts and use `font-display: swap`:

```css
/* src/styles/global.css */
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}

body {
  font-family: "Inter", system-ui, sans-serif;
}
```

Avoid Google Fonts CDN render-blocking requests. Self-hosted WOFF2 files with preload in the layout head cut 200–400ms off LCP.

## Content Collections for Projects and Blog

Type-safe content is non-negotiable for portfolios with 10+ projects and growing blog archives.

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    image: z.string(),
    imageAlt: z.string(),
    client: z.string().optional(),
    liveUrl: z.string().url().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    accent: z.string().optional(),
  }),
});

export const collections = { projects, blog };
```

Querying at build time keeps pages fast:

```astro
---
// src/pages/index.astro
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import ProjectCard from "../components/ui/ProjectCard.astro";

const projects = await getCollection("projects");
const featured = projects
  .filter((p) => p.data.featured)
  .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
  .slice(0, 3);
---

<BaseLayout title="Omprakash Tanwar — Frontend Developer" description="...">
  <section class="hero">
    <h1>Frontend developer for US, UK & EU clients</h1>
    <p>React, Next.js, Astro, Tailwind — shipped to production.</p>
  </section>

  <section class="featured-projects">
    <h2>Selected work</h2>
  {featured.map((project) => (
    <ProjectCard project={project} />
  ))}
  </section>
</BaseLayout>
```

## Image Optimization With astro:assets

Portfolio sites are image-heavy. Unoptimized screenshots destroy LCP.

```astro
---
import { Image } from "astro:assets";
import heroScreenshot from "../assets/projects/saas-dashboard.webp";
---

<Image
  src={heroScreenshot}
  alt="SaaS dashboard redesign showing analytics charts"
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="eager"
  decoding="async"
  class="rounded-lg shadow-xl"
/>
```

Rules I follow:

- Convert all screenshots to WebP or AVIF at build time
- Set explicit `widths` and `sizes` for responsive srcset
- `loading="eager"` only for above-the-fold hero images
- `loading="lazy"` for everything below the fold
- Never use 4K PNGs when 1200px WebP suffices

## Islands for the Few Interactive Pieces

My portfolio has exactly three hydrated components:

```astro
---
import ThemeToggle from "../components/islands/ThemeToggle.tsx";
import ProjectFilter from "../components/islands/ProjectFilter.tsx";
import ContactForm from "../components/islands/ContactForm.tsx";
---

<ThemeToggle client:load />
<ProjectFilter client:visible />
<ContactForm client:idle />
```

**ThemeToggle** uses `client:load` because it's in the header and users expect instant response. It's 2 KB.

**ProjectFilter** uses `client:visible` because it's below the hero on the projects page. No reason to hydrate before scroll.

**ContactForm** uses `client:idle` because it's at the bottom of the contact page. Form validation can wait until the browser is idle.

Total island JavaScript across the entire site: under 35 KB gzipped.

## Animations Without Killing Performance

Clients want motion. Performance budgets want stillness. The compromise is CSS-first animation with optional JS enhancement.

```css
.project-card {
  opacity: 0;
  transform: translateY(16px);
  animation: fadeUp 0.6s ease forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

For scroll-triggered reveals, I use CSS `@scroll-timeline` where supported and fall back to static layout elsewhere. If a client insists on complex scroll animations, I reach for a small Svelte island with `client:visible` — not a site-wide GSAP import.

## View Transitions for SPA Feel

Astro's View Transitions API gives smooth page changes without shipping a router:

```astro
---
// src/layouts/BaseLayout.astro (add to <head>)
import { ViewTransitions } from "astro:transitions";
---

<head>
  <ViewTransitions />
</head>
```

```astro
<!-- Persist header across navigations -->
<header transition:persist>
  <Header />
</header>
```

Users perceive the site as fast and cohesive. Lighthouse still sees static HTML pages. Best of both worlds for a portfolio.

## SEO Setup That Brings Inbound Leads

A portfolio isn't a vanity project — it's a lead generation engine. I implement:

- Unique `<title>` and `<meta description>` per page (150–160 chars)
- JSON-LD structured data for `Person` and `WebSite`
- XML sitemap via `@astrojs/sitemap`
- RSS feed for the blog
- Internal linking between blog posts and related projects

```astro
---
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Omprakash Tanwar",
  jobTitle: "Frontend Developer",
  url: "https://omprakash.dev",
  sameAs: [
    "https://github.com/omprakash",
    "https://linkedin.com/in/omprakash",
  ],
};
---

<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

Blog articles targeting "Astro developer for hire" or "Next.js freelancer UK" have brought me qualified Upwork invitations without paid ads.

## Performance Audit Checklist

Before every portfolio launch, I run this checklist:

1. Lighthouse mobile score ≥ 95 (performance, accessibility, SEO)
2. LCP < 1.5s on throttled 4G
3. CLS < 0.05 (images have dimensions, fonts don't swap layout)
4. INP < 100ms (minimal hydration, no long tasks)
5. Total JS < 50 KB gzipped
6. All images in WebP/AVIF with responsive srcset
7. No render-blocking third-party scripts
8. `robots.txt` and sitemap submitted to Search Console

I add Lighthouse CI to GitHub Actions so PRs that regress performance get flagged before merge.

## Common Portfolio Performance Mistakes

**Embedding a Behance or Dribbble iframe on the homepage.** External embeds are LCP poison. Screenshot the work, optimize the image, link out.

**Using a animation library site-wide.** Framer Motion on every page for a fade-in effect costs 40+ KB. Use CSS.

**Hydrating the entire project grid.** Filtering 12 projects doesn't need React on page load. Use `client:visible`.

**Skipping alt text on project screenshots.** Accessibility and SEO both suffer. Describe what the screenshot shows.

**Deploying without compression.** Ensure your host serves Brotli/gzip for HTML, CSS, and JS. Cloudflare and Netlify do this by default.

## Deployment Configuration

I deploy portfolios to Cloudflare Pages or Netlify with this Astro config:

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://omprakash.dev",
  integrations: [tailwind(), sitemap(), react()],
  build: {
    inlineStylesheets: "auto",
  },
  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
  },
});
```

`inlineStylesheets: "auto"` inlines critical CSS for above-the-fold content. Sharp handles image optimization at build time. Total deploy time for a 30-page portfolio: under 60 seconds.

## Case Study Pages That Convert

Project case studies are where portfolios win freelance contracts. Structure them for both human readers and search engines.

```astro
---
// src/pages/projects/[slug].astro
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import { Image } from "astro:assets";

export async function getStaticPaths() {
  const projects = await getCollection("projects");
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await project.render();
---

<BaseLayout
  title={`${project.data.title} — Case Study`}
  description={project.data.description}
>
  <article>
    <header>
      <h1>{project.data.title}</h1>
      <p class="meta">{project.data.client} · {project.data.tags.join(", ")}</p>
    </header>

    <Image
      src={project.data.image}
      alt={project.data.imageAlt}
      widths={[800, 1200]}
      sizes="(max-width: 768px) 100vw, 1200px"
    />

    <div class="prose">
      <Content />
    </div>

    {project.data.liveUrl && (
      <a href={project.data.liveUrl} target="_blank" rel="noopener">
        View live project
      </a>
    )}
  </article>
</BaseLayout>
```

Each case study should answer four questions a prospective client asks: What was the problem? What did you build? What technologies did you use? What was the measurable outcome? "Reduced LCP from 4.2s to 1.1s" beats "built a beautiful website" every time.

## Contact Forms Without Sacrificing Performance

The contact form is the highest-stakes island on your portfolio. It needs validation, spam protection, and reliable delivery — but it shouldn't block the rest of the page.

```tsx
// src/components/islands/ContactForm.tsx
"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" },
    });

    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required placeholder="Your name" />
      <input name="email" type="email" required placeholder="Email" />
      <textarea name="message" required placeholder="Project details" />
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
      {status === "sent" && <p>Thanks — I'll reply within 24 hours.</p>}
    </form>
  );
}
```

I pair this with a serverless function (Netlify Functions or Cloudflare Workers) that forwards to email via Resend or SendGrid. Honeypot fields catch bots without reCAPTCHA's performance penalty. The form island loads with `client:idle` — the page is readable and interactive for navigation before the form hydrates.

## Conclusion

A high-performance portfolio on Astro isn't about stripping away personality. It's about being intentional — static HTML for content, islands for interactivity, optimized assets for speed, and structured content for SEO. The developers who get hired aren't always the ones with the flashiest animations. They're the ones whose portfolios load instantly and demonstrate that they understand the craft they're selling.

Build yours like you'd build a client's site: measure, optimize, ship, and let the Lighthouse score speak before you do.


Building a lead-gen portfolio on Astro is the same discipline I bring to client content sites — if you need that delivery, [hire an Astro developer](/hire-astro-developer) who obsesses over Lighthouse budgets.

## Key Takeaways

- Treat your portfolio as a lead-generation content site, not a JavaScript showcase
- Use Content Collections for type-safe projects and blog posts queried at build time
- Keep interactive components in an `islands/` folder with deliberate `client:` directives
- Optimize images with `astro:assets`, WebP/AVIF, and responsive `sizes` attributes
- Self-host fonts with `font-display: swap` to protect LCP
- Use CSS animations first; reserve JS animation libraries for specific islands
- View Transitions add SPA polish without SPA JavaScript payloads
- Run Lighthouse CI in your deploy pipeline to catch performance regressions before they reach production
