# Omprakash Tanwar — Portfolio & Blog

Personal portfolio, technical blog, and SEO service landing pages for a freelance frontend developer. Built with Astro and Tailwind CSS.

## Project overview

The site includes:

- **Homepage** — hero, about, services, projects, skills, why-me, and contact sections
- **Blog** — 59 articles with categories, tags, search, pagination, RSS, and related posts
- **Service landing pages** — SEO-focused hire/service pages, linked contextually with the blog

## Service landing pages

| Route | Primary keyword |
| :---- | :-------------- |
| `/hire-astro-developer` | Hire Astro Developer |
| `/hire-nextjs-developer` | Hire Next.js Developer |
| `/hire-react-developer` | Hire React Developer |
| `/hire-typescript-developer` | Hire TypeScript Developer |
| `/hire-tailwind-css-developer` | Hire Tailwind CSS Developer |
| `/hire-sanity-developer` | Hire Sanity Developer |
| `/figma-to-code-developer` | Figma to Code Developer |
| `/headless-cms-development` | Headless CMS Development |
| `/website-performance-optimization` | Website Performance Optimization |
| `/improve-core-web-vitals` | Improve Core Web Vitals |
| `/fix-slow-website` | Fix Slow Website |
| `/frontend-developer-for-agencies` | Frontend Developer for Agencies |
| `/white-label-frontend-development` | White Label Frontend Development |
| `/website-maintenance-services` | Website Maintenance Services |
| `/frontend-consulting-services` | Frontend Consulting Services |
| `/frontend-developer-for-saas` | Frontend Developer for SaaS |
| `/frontend-developer-for-startups` | Frontend Developer for Startups |
| `/website-redesign-services` | Website Redesign Services |
| `/wordpress-to-astro-migration` | WordPress to Astro Migration |
| `/wordpress-to-nextjs-migration` | WordPress to Next.js Migration |
| `/website-redesign-or-new-site` | website-redesign-or-new-site |
| `/ai-website-optimization` | ai-website-optimization |
| `/landing-page-optimization` | landing-page-optimization |

Each landing page uses the shared `ServiceLanding` component and config under `src/data/landing/`. Pages cross-link related services and supporting blog posts (`relatedServices` / `relatedReads`). Blog posts link back to the most relevant landing page(s) with natural anchor text.

## Project structure

```
src/
  assets/blog/          # Blog cover images
  components/
    blog/               # Blog UI (cards, TOC, search, pagination, etc.)
    common/             # Navbar, Footer
    home/               # Homepage sections
    landing/            # ServiceLanding.astro
  content/blog/         # Markdown posts (Astro content collection)
  data/landing/         # Config for each service landing page
  layouts/              # Shared Layout.astro
  lib/                  # Site helpers, landing types
  pages/
    index.astro         # Homepage
    blog/               # Blog index, slug, category, tag, pagination
    hire-*.astro        # Hire / service landings
    figma-to-code-developer.astro
    website-performance-optimization.astro
    frontend-developer-for-agencies.astro
    rss.xml.ts
  styles/global.css
public/                 # Static assets, robots.txt, favicon
```

## Tech stack

- [Astro](https://astro.build/) — site framework and content collections
- [Tailwind CSS](https://tailwindcss.com/) v4 via `@tailwindcss/postcss`
- `@astrojs/sitemap` — XML sitemap
- `@astrojs/rss` — blog RSS feed
- `@vercel/analytics` — analytics
- `rehype-slug` — heading IDs for TOC / anchors

## Scripts

From the project root:

| Command | Description |
| :------ | :---------- |
| `npm install` | Install dependencies |
| `npm run dev` | Start local development server |
| `npm run build` | Build the site for production |
| `npm run preview` | Preview the production build locally |

## Requirements

- Node.js `>=22.12.0`

## Internal linking notes

- Blog → landing: contextual markdown links inside conclusions/CTAs (not forced into every post)
- Landing → blog: `relatedReads` on each service config
- Landing → landing: `relatedServices` for topical adjacency
- Prefer descriptive, varied anchor text; avoid stuffing every service into one article

## Deploy

Configured for static output suitable for Vercel, Netlify, or any static host. Run `npm run build` and deploy the `dist/` output (or connect the repo to your host’s Astro integration).
