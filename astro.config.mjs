// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://optanwar.vercel.app",
  integrations: [
    sitemap({
      // Paginated archives are noindex; keep sitemap focused on indexable URLs.
      filter: (page) => !page.includes("/page/"),
      serialize(item) {
        const url = item.url;
        if (url.endsWith("/") || url.match(/\/optanwar\.vercel\.app\/?$/)) {
          return { ...item, changefreq: "weekly", priority: 1.0 };
        }
        if (url.includes("/blog/") && !url.includes("/category/") && !url.includes("/tag/")) {
          return { ...item, changefreq: "monthly", priority: 0.8 };
        }
        if (url.includes("/blog/category/") || url.includes("/blog/tag/")) {
          return { ...item, changefreq: "weekly", priority: 0.6 };
        }
        if (url.endsWith("/blog")) {
          return { ...item, changefreq: "daily", priority: 0.9 };
        }
        // Service landing pages
        return { ...item, changefreq: "monthly", priority: 0.85 };
      },
    }),
  ],
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["math"],
    },
    shikiConfig: {
      theme: "github-dark",
      wrap: false,
    },
    rehypePlugins: ["rehype-slug"],
  },
});
