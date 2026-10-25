import rss from "@astrojs/rss";
import { getPublishedPosts, formatDateISO } from "../lib/blog";
import { AUTHOR_NAME, SITE_URL } from "../lib/seo";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();
  const site = (context.site?.toString() || SITE_URL).replace(/\/$/, "");

  return rss({
    title: `${AUTHOR_NAME} — Frontend Development Blog`,
    description:
      "Articles on React, Next.js, Astro, TypeScript, Tailwind CSS, Core Web Vitals, and modern frontend development.",
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}`,
      categories: [post.data.category, ...post.data.tags],
      author: AUTHOR_NAME,
      customData: `<guid isPermaLink="true">${site}/blog/${post.id}</guid>`,
    })),
    customData: `<language>en-us</language><lastBuildDate>${formatDateISO(new Date())}</lastBuildDate>`,
  });
};
