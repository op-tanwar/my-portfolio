---
title: "Sanity CMS + Astro: A Production Content Workflow"
description: "How I wire Sanity and Astro together for client projects — schema design, preview, image pipelines, and the editorial workflow marketing teams actually use."
publishDate: 2025-11-28
category: "Astro"
tags: ["Sanity", "Astro", "CMS", "Content", "Headless"]
featured: true
accent: "#00D4AA"
image: "../../assets/blog/sanity-cms-astro-content-workflow.jpg"
imageAlt: "Content management workflow on multiple screens"
---

The marketing team at a SaaS startup in Austin was drowning in Notion docs. Engineers copied markdown into the repo for every blog post. Launch dates slipped because nobody wanted to open a pull request to fix a typo in a headline. Their Astro site was fast and beautiful. Their content workflow was held together with Slack messages and good intentions.

We integrated Sanity in a week. Two weeks later, their content lead published three articles without touching GitHub. Preview URLs let her share drafts with the CEO before publish. Build times stayed under 45 seconds. The site still scored 97 on Lighthouse.

Sanity plus Astro is my default stack for client content sites where non-developers need to edit structured content and developers need type safety, performance, and control. This article walks through the full production workflow — not a hello-world tutorial, but the patterns I reuse across projects.

## Why Sanity With Astro (Not WordPress, Not Notion)

Astro generates static HTML at build time. That's the performance win. But static doesn't mean stale — it means content is fetched during the build (or on a webhook-triggered rebuild) and served as fast HTML from a CDN.

Sanity fits this model because:

- **Structured content** — you define schemas, not page layouts. Content is data, templates are Astro.
- **Real-time editing** — Sanity Studio is a React app your clients log into. Changes don't require developer intervention.
- **GROQ queries** — fetch exactly the fields you need, nothing more.
- **Image CDN** — Sanity handles transforms, formats, and responsive URLs.
- **Preview** — draft content visible on staging before publish triggers a build.

WordPress couples content and presentation. Notion couples content and a tool engineers don't want in production pipelines. Sanity decouples content from Astro cleanly.

## Project Structure

Here's the layout I use on most engagements:

```
project/
├── astro-site/           # Astro frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── lib/
│   │       └── sanity.ts
│   └── astro.config.mjs
└── sanity-studio/        # Sanity Studio (separate or monorepo)
    ├── schemas/
    │   ├── post.ts
    │   ├── author.ts
    │   └── page.ts
    └── sanity.config.ts
```

Monorepo or separate repos both work. I prefer a monorepo with npm workspaces for smaller teams — one PR can update schema and frontend together.

## Schema Design: Start With the Editorial Model

The biggest mistake is mirroring web page structure in Sanity schemas. Instead, model content the way editors think about it.

For a B2B blog, I typically define:

```ts
// sanity-studio/schemas/post.ts
import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "publishDate",
      title: "Publish Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "mainImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          fields: [{ name: "alt", type: "string", title: "Alt Text" }],
        },
        { type: "codeBlock" },
        { type: "callout" },
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "featured",
      title: "Featured Post",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", media: "mainImage", subtitle: "publishDate" },
  },
});
```

Custom block types (`codeBlock`, `callout`) keep rich content structured instead of dumping raw HTML. I'll cover portable text rendering shortly.

**Client tip:** Involve the marketing lead in schema design for one hour. They'll tell you they need "a pull quote block" or "a CTA banner block" — build those into the schema upfront instead of hacking them in later.

## Sanity Client in Astro

```ts
// astro-site/src/lib/sanity.ts
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanity = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: import.meta.env.PROD,
});

const builder = imageUrlBuilder(sanity);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

GROQ queries live alongside:

```ts
// astro-site/src/lib/queries.ts
export const allPostsQuery = `*[_type == "post" && defined(slug.current)] | order(publishDate desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  publishDate,
  mainImage,
  "author": author->{ name, image },
  "category": category->{ title, "slug": slug.current }
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  publishDate,
  body,
  mainImage,
  "author": author->{ name, bio, image },
  "category": category->{ title, "slug": slug.current }
}`;
```

Fetch at build time in Astro pages:

```astro
---
// astro-site/src/pages/blog/[slug].astro
import { sanity } from "@/lib/sanity";
import { postBySlugQuery } from "@/lib/queries";
import PortableText from "@/components/PortableText.astro";

export async function getStaticPaths() {
  const posts = await sanity.fetch(`*[_type == "post"]{ "slug": slug.current }`);
  return posts.map((post) => ({ params: { slug: post.slug } }));
}

const { slug } = Astro.params;
const post = await sanity.fetch(postBySlugQuery, { slug });

if (!post) return Astro.redirect("/404");
---
```

## Portable Text Rendering

Sanity's rich text is Portable Text — JSON, not HTML. Astro needs a renderer:

```astro
---
// astro-site/src/components/PortableText.astro
import { PortableText as PT } from "astro-portabletext";
import Callout from "./blocks/Callout.astro";
import CodeBlock from "./blocks/CodeBlock.astro";

const { value } = Astro.props;
---

<PT
  value={value}
  components={{
    type: {
      callout: Callout,
      codeBlock: CodeBlock,
    },
    mark: {
      link: "a",
    },
  }}
/>
```

Custom blocks map to Astro components with full styling control. The Austin SaaS client's callout block matched their design system exactly — something impossible when editors paste HTML from Google Docs.

## Image Pipeline

Sanity's image CDN is a major reason I choose it over Git-based CMS options.

```astro
---
import { urlFor } from "@/lib/sanity";

const imageUrl = urlFor(post.mainImage)
  .width(1200)
  .height(630)
  .fit("crop")
  .auto("format")
  .url();
---

<img
  src={imageUrl}
  alt={post.mainImage.alt}
  width="1200"
  height="630"
  loading="eager"
  fetchpriority="high"
/>
```

For responsive images, generate srcset:

```ts
export function buildSrcSet(image: SanityImageSource, widths = [400, 800, 1200]) {
  return widths
    .map((w) => `${urlFor(image).width(w).auto("format").url()} ${w}w`)
    .join(", ");
}
```

Editors upload once. The pipeline handles WebP, sizing, and crop focus (hotspot). No more 4 MB PNGs in the repo.

## Preview Workflow

Editors need to see drafts before they go live. I set up preview with Sanity's presentation tool or a custom preview route.

**Approach 1: Webhook-triggered staging builds**

1. Editor saves draft in Sanity
2. Sanity webhook hits Netlify/Cloudflare build hook
3. Staging site rebuilds with draft content (using a preview token)
4. Editor reviews staging URL
5. Editor publishes in Sanity → production webhook → production build

```ts
// Preview client fetches draft content
export const previewClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: import.meta.env.SANITY_PREVIEW_TOKEN,
  perspective: "previewDrafts",
});
```

**Approach 2: Visual editing with Presentation**

Sanity's Presentation tool overlays editing on the live preview. More setup, better UX for larger editorial teams. I enable this when clients publish more than eight articles per month.

## Webhooks and Rebuild Strategy

Static sites need rebuilds when content changes. Configure Sanity webhooks:

```json
{
  "name": "Production Build",
  "url": "https://api.netlify.com/build_hooks/xxxxx",
  "dataset": "production",
  "filter": "_type in ['post', 'page']",
  "projection": "{ _id }",
  "triggerOn": ["create", "update", "delete"],
  "includeDrafts": false
}
```

Build times matter. If your site takes six minutes to build and editors publish five times a day, that's friction. Optimize:

- Fetch only needed fields in GROQ
- Use incremental builds if your host supports them
- Split large content types into separate build triggers

For the Austin client, builds run in 38 seconds. Editors don't notice the delay.

## Type Safety With sanity-typegen

Generate TypeScript types from schemas:

```bash
npx sanity schema extract
npx sanity typegen generate
```

This produces types for GROQ results. Combined with Zod validation on the Astro side, you catch schema mismatches at build time:

```ts
import { z } from "zod";

const PostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  publishDate: z.string(),
  body: z.array(z.unknown()),
});

const post = PostSchema.parse(rawPost);
```

When a developer renames a Sanity field and forgets to update Astro, the build fails — not production.

## Editorial Workflow Features Clients Love

Beyond basic CRUD, I configure Studio for how teams actually work:

**Custom desk structure** — group posts by category, surface featured content, separate drafts from published.

```ts
// sanity.config.ts
import { structureTool } from "sanity/structure";

export default defineConfig({
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Published Posts")
              .child(
                S.documentList()
                  .title("Published")
                  .filter('_type == "post" && !(_id in path("drafts.**"))')
              ),
            S.listItem()
              .title("Drafts")
              .child(
                S.documentList()
                  .title("Drafts")
                  .filter('_type == "post" && _id in path("drafts.**")')
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !["post"].includes(item.getId()!)
            ),
          ]),
    }),
  ],
});
```

**Validation rules** — required alt text, max title length, slug format enforcement. Accessibility and SEO baked into the CMS.

**AI assist (optional)** — Sanity's AI features help editors draft descriptions. I enable with guidelines so it doesn't generate off-brand copy.

**Roles and permissions** — authors edit posts, editors publish, admins manage schemas. Sanity's role system handles this without custom code.

## Astro Content Collections vs. Sanity: When to Use Both

Some projects use Astro Content Collections for developer-authored docs and Sanity for marketing content. This works well:

```astro
---
// Merge local docs and Sanity blog posts on the blog index
import { getCollection } from "astro:content";
import { sanity } from "@/lib/sanity";

const localDocs = await getCollection("docs");
const sanityPosts = await sanity.fetch(allPostsQuery);

const allContent = [
  ...localDocs.map((d) => ({ ...d, source: "local" })),
  ...sanityPosts.map((p) => ({ ...p, source: "sanity" })),
].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
---
```

Engineers write technical docs in markdown with PR review. Marketers publish thought leadership in Sanity. One blog index, two workflows.

## Deployment and Environment Setup

Typical hosting:

- **Astro site:** Cloudflare Pages, Netlify, or Vercel
- **Sanity Studio:** `sanity deploy` to `your-project.sanity.studio` or embedded at `yoursite.com/studio`

Environment variables:

```env
PUBLIC_SANITY_PROJECT_ID=abc123
PUBLIC_SANITY_DATASET=production
SANITY_PREVIEW_TOKEN=sk...   # server/preview only, never public
```

CORS origins must include your Studio URL and preview domains. Sanity's dashboard handles this under API settings.

## Costs and Scaling

Sanity's free tier covers most freelance client projects:

- 3 non-admin users
- 10,000 documents
- 1M API CDN requests
- 100GB bandwidth

Paid tiers kick in when editorial teams grow or API requests spike from aggressive ISR patterns. For static Astro builds that fetch at build time, API usage stays low.

Hosting for the Astro site is typically free tier on Cloudflare or Netlify until traffic reaches serious scale.

## Common Pitfalls

**Over-fetching in GROQ.** Don't pull `body` for list pages. Select only card fields.

**Skipping alt text validation.** Images without alt text ship to production. Enforce in schema.

**No webhook for deletes.** Editor deletes a post in Sanity. Site still shows it until someone manually rebuilds. Webhooks on delete matter.

**Building Studio before aligning on schema.** One schema workshop saves a week of rework.

**Treating preview as optional.** Clients will publish typos. Preview is not a luxury.

## Handoff Documentation

When I hand off a Sanity + Astro project, the client receives:

1. Studio URL and login instructions
2. Loom walkthrough of publishing workflow
3. "What triggers a rebuild" explainer
4. Schema field guide (what each field affects on the site)
5. Emergency contact for schema changes vs. content edits

Schema changes need a developer. Content edits don't. Clear boundary prevents confusion.

## Conclusion

Sanity and Astro together give you static-site performance with dynamic editorial flexibility. The Austin SaaS team's workflow went from "Slack the developer a Google Doc" to self-serve publishing with preview, structured content, and sub-minute rebuilds.

The integration isn't exotic — it's a client, GROQ queries, webhooks, and Portable Text components. The value is in schema design, preview workflow, and editorial UX that matches how your client's team actually works.

If you're building a content site where marketers need independence and users need speed, this stack deserves serious consideration.


When marketing needs Studio independence and users still deserve static-fast HTML, [hire an Astro developer](/hire-astro-developer) experienced with Sanity schemas, GROQ, and rebuild hooks.


If your next content platform needs Studio modeling plus a fast public frontend, that is exactly [headless CMS development](/headless-cms-development) — not a one-off embed.

## Key Takeaways

- Sanity provides structured content editing; Astro turns that content into fast static HTML at build time
- Design Sanity schemas around editorial mental models, not page HTML structure
- Use GROQ to fetch only the fields each page needs — avoid over-fetching body content on list views
- Portable Text custom blocks give editors flexibility without sacrificing design system consistency
- Sanity's image CDN handles optimization, formats, and responsive URLs automatically
- Set up webhooks for create, update, and delete events to keep static builds in sync with CMS changes
- Preview workflows (staging builds or Presentation tool) prevent publishing mistakes and build client confidence
- Use sanity-typegen and Zod validation to catch schema mismatches at build time, not in production
