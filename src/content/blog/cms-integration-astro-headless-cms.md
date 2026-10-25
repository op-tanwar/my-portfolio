---
title: "CMS Integration with Astro and Headless CMS Platforms"
description: "How I integrate headless CMS content into Astro sites—Content Collections, Sanity, Contentful, webhooks, preview mode, and production patterns from client work."
publishDate: 2026-04-08
updatedDate: 2026-06-10
category: "Astro"
tags: ["Astro", "CMS", "Headless CMS", "Content"]
featured: false
accent: "#00fff7"
image: "../../assets/blog/cms-integration-astro-headless-cms.jpg"
imageAlt: "Developer integrating content management with code"
---

The marketing team at a UK consultancy wanted to update blog posts, case studies, and team bios without opening a pull request. Fair request. The previous agency had hardcoded every page in JSX—content changes meant developer hours and a two-day deploy cycle. They hired me to rebuild the site in Astro with a headless CMS that non-technical staff could actually use.

We evaluated three options, shipped with a hybrid approach, and had the marketing lead publishing her first blog post within an hour of training. Six months later, she'd published 40+ articles without touching code. The site stayed fast—static HTML, sub-second loads—because Astro's content layer handled the heavy lifting at build time.

This article covers how I integrate headless CMS platforms with Astro on client projects: when to use built-in Content Collections versus external CMS, how to structure schemas, preview workflows, webhook rebuilds, and the mistakes that turn CMS integrations into maintenance nightmares.

## Why Astro and Headless CMS Work Well Together

Astro's core philosophy—ship zero JavaScript by default, render content-heavy pages as static HTML—aligns perfectly with headless CMS architectures where content lives in a managed API and presentation lives in your codebase.

The integration patterns fall into three tiers:

| Tier | Approach | Best for |
|------|----------|----------|
| 1 | Astro Content Collections (local MD/MDX) | Developers or Git-savvy content editors |
| 2 | Git-based CMS (Decap, Tina) | Marketing teams comfortable with review workflows |
| 3 | API CMS (Sanity, Contentful, Storyblok) | Non-technical editors, complex content models |

Many projects I deliver use Tier 1 or 2 for blogs and Tier 3 for structured content like team profiles, case studies, or product data. This portfolio site uses Content Collections—markdown in `src/content/blog/` with Zod schema validation. Client marketing sites often need Tier 3 because the client explicitly can't use Git.

## Astro Content Collections: The Foundation

Even when an external CMS is the source of truth, I often mirror content into Astro's collection system for type safety and local development. Here's the schema pattern I use:

```typescript
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    accent: z.string().optional(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    industry: z.string(),
    results: z.array(z.string()),
    publishDate: z.coerce.date(),
    coverImage: z.string(),
  }),
});

export const collections = { blog, caseStudies };
```

Consuming collections in pages:

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection, render } from "astro:content";
import BlogLayout from "@/layouts/BlogLayout.astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BlogLayout post={post}>
  <Content />
</BlogLayout>
```

Zod validation catches content errors at build time—a missing `publishDate` fails CI instead of rendering a broken page in production. This alone has saved multiple clients from embarrassing deploys.

## Sanity Integration: My Go-To for Complex Content

For clients who need rich content modeling, collaborative editing, and real-time preview, I default to Sanity. The Astro integration fetches content at build time:

```typescript
// src/lib/sanity.ts
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export async function getPosts() {
  return sanityClient.fetch<GroqPost[]>(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      "author": author->name,
      "categories": categories[]->title
    }`
  );
}
```

```astro
---
// src/pages/blog/[slug].astro
import { getPosts } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import PortableText from "@/components/PortableText.astro";

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({
    params: { slug: post.slug.current },
    props: { post },
  }));
}

const { post } = Astro.props;
const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).url() : null;
---

<article>
  <h1>{post.title}</h1>
  {imageUrl && <img src={imageUrl} alt={post.mainImage.alt ?? ""} />}
  <PortableText value={post.body} />
</article>
```

**Sanity schema example** for the UK consultancy:

```typescript
// sanity/schemas/post.ts
export default {
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    { name: "title", type: "string", validation: (Rule) => Rule.required() },
    {
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    },
    { name: "publishedAt", type: "datetime" },
    { name: "excerpt", type: "text", rows: 3 },
    { name: "mainImage", type: "image", options: { hotspot: true } },
    { name: "body", type: "array", of: [{ type: "block" }, { type: "image" }] },
    { name: "author", type: "reference", to: [{ type: "author" }] },
  ],
};
```

Sanity's Portable Text requires a renderer component, but it gives editors flexible rich text without breaking layout—unlike WYSIWYG HTML that imports inline styles from Word paste.

## Contentful as an Alternative

Some enterprise clients already have Contentful licenses. The integration pattern is similar—fetch at build time, generate static paths:

```typescript
// src/lib/contentful.ts
import { createClient } from "contentful";

const client = createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
});

export async function getBlogPosts() {
  const response = await client.getEntries({
    content_type: "blogPost",
    order: ["-fields.publishDate"],
  });
  return response.items;
}
```

Contentful's content model UI is more approachable for non-technical editors than Sanity's studio customization—but less flexible for complex relational content. I recommend Contentful when the client's team already knows it; Sanity when we're starting fresh and need customization.

## Hybrid Architecture: The Pattern I Use Most

On a US agency's client site, we used:

- **Sanity** — team bios, case studies, testimonials, homepage hero content
- **Content Collections** — technical blog posts the development team writes in MDX
- **JSON config files** — navigation, footer links, feature flags

```
content sources
     │
     ├── Sanity API ──────► build-time fetch ──► /about, /work, /team
     ├── src/content/blog ► Astro collections ──► /blog
     └── src/data/nav.json ► static import ──────► global layout
```

This avoids forcing developers to write blog posts in a CMS GUI while giving marketing full control over client-facing marketing content. The boundary is documented: "If it's a case study or team profile, it's in Sanity. If it's a technical article, it's in the repo."

## Preview Mode for Draft Content

Editors need to see unpublished content before triggering a production build. Astro supports SSR routes for preview:

```typescript
// src/pages/api/preview.ts
import type { APIRoute } from "astro";
import { sanityClient } from "@/lib/sanity";

export const GET: APIRoute = async ({ request, redirect, cookies }) => {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const slug = url.searchParams.get("slug");

  if (secret !== import.meta.env.PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  cookies.set("preview-mode", "true", { httpOnly: true, path: "/" });
  return redirect(`/blog/${slug}`);
};
```

```astro
---
// Preview route fetches draft content
const isPreview = Astro.cookies.has("preview-mode");
const client = isPreview
  ? sanityClient.withConfig({ token: import.meta.env.SANITY_PREVIEW_TOKEN, useCdn: false })
  : sanityClient;

const post = await client.fetch(
  `*[_type == "post" && slug.current == $slug][0]`,
  { slug: Astro.params.slug }
);
---
```

For simpler setups, I generate preview deploys on Vercel/Netlify for each CMS branch—Sanity's webhook triggers a preview build with draft content included. The marketing team gets a unique URL to review before publishing.

## Webhooks and Rebuild Strategy

Static sites need rebuilds when CMS content changes. I configure webhooks:

```
Sanity/Contentful publish event
        │
        ▼
Webhook POST → /api/rebuild (or platform deploy hook)
        │
        ▼
CI builds Astro site with fresh content
        │
        ▼
Deploy to production (2-4 minutes typical)
```

```typescript
// src/pages/api/rebuild.ts
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${import.meta.env.REBUILD_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const deployHook = import.meta.env.VERCEL_DEPLOY_HOOK;
  await fetch(deployHook, { method: "POST" });

  return new Response(JSON.stringify({ triggered: true }), { status: 200 });
};
```

**Mistake:** triggering rebuilds on every autosave. Debounce webhooks to publish events only. One client burned through their Vercel build minutes because Sanity's draft save fired a webhook on every keystroke.

For high-frequency content (news sites), consider Astro SSR with on-demand rendering or incremental static regeneration patterns. For marketing sites publishing weekly, build-time fetching is simpler and faster for visitors.

## Image Handling Across CMS Platforms

CMS images need optimization in Astro. Sanity's image CDN handles transforms via URL parameters:

```typescript
urlFor(image).width(800).height(600).fit("crop").auto("format").url();
```

Contentful images use their own transform API:

```typescript
const imageUrl = `https:${fields.heroImage.fields.file.url}?w=1200&fm=webp&q=80`;
```

For local Content Collections, I use Astro's built-in image service:

```astro
---
import { Image } from "astro:assets";
import heroImage from "@/assets/hero.jpg";
---

<Image src={heroImage} alt="Team collaboration" widths={[400, 800, 1200]} formats={["webp", "avif"]} />
```

Always define `width`, `height`, or `aspectRatio` to prevent CLS. Always provide `alt` text—in Sanity, I make alt a required field on image types.

## Content Modeling Best Practices

Poor content models cause more CMS pain than poor code. Principles I follow:

**Single responsibility per content type.** Don't create a "Page" type that tries to be blog post, landing page, and product page simultaneously. Separate types with shared field groups.

**References over duplication.** Team member bios live in one `author` document, referenced by blog posts. Update the bio once; it updates everywhere.

```typescript
// Sanity shared field group
export const seoFields = [
  { name: "metaTitle", type: "string", title: "Meta Title" },
  { name: "metaDescription", type: "text", rows: 3, title: "Meta Description" },
  { name: "ogImage", type: "image", title: "Social Share Image" },
];
```

**Slug conventions.** Lowercase, hyphenated, validated unique. I add validation rules in the CMS schema, not just in the frontend.

**Required fields for publishing.** Title, slug, publish date, and meta description required before a document can be published. Optional everything else.

## Real Project Scenario: Consultancy Site Migration

The UK consultancy project in detail:

**Before:** WordPress site, 3.2s load time, constant plugin security updates, editor afraid to touch anything.

**After:** Astro + Sanity, 0.8s load time, marketing team self-sufficient.

**Content model:**
- `post` — blog articles
- `caseStudy` — client work with results metrics
- `teamMember` — bios, photos, social links
- `page` — flexible landing pages with section blocks
- `siteSettings` — global nav, footer, contact info (singleton)

**Section blocks** for flexible pages:

```typescript
// sanity/schemas/blocks/heroBlock.ts
export default {
  name: "heroBlock",
  title: "Hero Section",
  type: "object",
  fields: [
    { name: "headline", type: "string" },
    { name: "subheadline", type: "text", rows: 2 },
    { name: "ctaText", type: "string" },
    { name: "ctaLink", type: "url" },
    { name: "image", type: "image" },
  ],
};
```

```astro
---
// Render section blocks dynamically
const { sections } = Astro.props.page;

const blockComponents = {
  heroBlock: Hero,
  featureGrid: FeatureGrid,
  testimonialStrip: TestimonialStrip,
  ctaBanner: CtaBanner,
};
---

{sections.map((block) => {
  const Component = blockComponents[block._type];
  return Component ? <Component {...block} /> : null;
})}
```

Marketing assembled new landing pages from predefined blocks—no developer needed. Devs added new block types when genuinely new layouts were required, roughly once per quarter.

**Migration:** 80 blog posts exported from WordPress via WP GraphQL, transformed to Sanity documents with a one-time script. Redirects mapped old URLs to new slugs. Zero SEO traffic loss confirmed in Search Console after 30 days.

## Developer Experience and Local Development

CMS integrations fail when local development requires network calls to production APIs. My setup:

```bash
# .env.local
SANITY_PROJECT_ID=abc123
SANITY_DATASET=development  # separate dataset for local/preview
CONTENTFUL_SPACE_ID=xyz
CONTENTFUL_DELIVERY_TOKEN=preview-token
```

- **Separate CMS datasets** for development and production
- **Fallback content** in Content Collections when API is unavailable
- **Seed scripts** to populate development datasets from production snapshots

```typescript
// Graceful fallback in development
export async function getPosts() {
  try {
    return await sanityClient.fetch(POSTS_QUERY);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Sanity unavailable, using local content");
      const { getCollection } = await import("astro:content");
      return getCollection("blog");
    }
    throw error;
  }
}
```

## Security and Environment Variables

CMS tokens in static sites are build-time only—they never reach the browser. Rules I enforce:

- Delivery/preview tokens in environment variables, never committed
- Preview tokens scoped to read-only draft access
- Webhook endpoints protected with shared secrets
- Rebuild deploy hooks stored as platform secrets

```typescript
// Only public values use PUBLIC_ prefix
// SANITY_PROJECT_ID can be public
// SANITY_API_TOKEN must NEVER be PUBLIC_
```

For EU clients with data residency requirements, Sanity and Contentful both offer EU-hosted datasets. I confirm region settings during project setup—not after launch.

## Conclusion

CMS integration with Astro isn't about picking the trendiest headless platform. It's about matching content workflow to the people who actually manage content, then building a type-safe, performant rendering layer that keeps the site fast regardless of how much content marketing publishes.

The UK consultancy's marketing lead didn't need to understand Astro or Git. She needed a Sanity studio with sensible content types and a publish button that triggered a rebuild. The development team needed Zod schemas and component blocks that made new pages composable without new code.

When both sides get what they need, CMS integration stops being a project risk and becomes a reason clients recommend you for the next engagement.


Need Astro wired to Sanity, Contentful, or another headless CMS with preview and publish hooks? That is [headless CMS development](/headless-cms-development) — and when delivery is Astro-first, you can also [hire an Astro developer](/hire-astro-developer) for editable, still-fast sites.

## Key Takeaways

- Match CMS tier to your editors: Content Collections for devs, API CMS for non-technical marketing teams
- Use Zod schemas in Astro Content Collections to catch content errors at build time
- Sanity excels at complex relational content; Contentful when the client already has licenses
- Hybrid architectures work well—external CMS for marketing content, local MDX for technical writing
- Implement preview mode with draft tokens or preview deploys before enabling self-service publishing
- Configure webhooks on publish events only, not autosave—protect build minutes
- Model content with single-purpose types, references over duplication, and required SEO fields
- Use section blocks for flexible landing pages marketing can assemble without developer help
- Separate development and production CMS datasets; add fallbacks for local offline development
- Keep API tokens build-time only; protect webhook and deploy hook endpoints with secrets
