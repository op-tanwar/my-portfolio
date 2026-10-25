import { SITE_URL, getSiteUrl } from "./site";

export { SITE_URL, getSiteUrl };

export const SITE_NAME = "Omprakash Portfolio";
export const AUTHOR_NAME = "Omprakash Tanwar";
export const AUTHOR_JOB_TITLE = "Frontend Developer";
export const DEFAULT_OG_IMAGE = "/og-image.png";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const AREA_SERVED = [
  { "@type": "Country", name: "United States" },
  { "@type": "Country", name: "United Kingdom" },
  { "@type": "Country", name: "Germany" },
  { "@type": "Country", name: "Switzerland" },
  { "@type": "Country", name: "Canada" },
  { "@type": "Country", name: "Netherlands" },
  { "@type": "Country", name: "Australia" },
  { "@type": "Place", name: "Europe" },
];

export const KNOWS_ABOUT = [
  "Astro Development",
  "Next.js Development",
  "React Development",
  "TypeScript Development",
  "Tailwind CSS",
  "Sanity CMS",
  "Headless CMS",
  "Frontend Development",
  "Website Performance Optimization",
  "Core Web Vitals",
  "White Label Frontend",
  "Figma to Code",
  "Website Maintenance",
  "Website Redesign",
  "WordPress Migration",
];

export const SAME_AS = [
  "https://www.upwork.com/freelancers/~013f75d3791e17fa5d",
  "https://www.fiverr.com/optanwar1",
  "https://github.com/optanwar",
  "https://www.linkedin.com/in/optanwar/",
];

export const SERVICE_OFFERINGS = [
  { name: "Astro Development", url: "/hire-astro-developer" },
  { name: "Next.js Development", url: "/hire-nextjs-developer" },
  { name: "React Development", url: "/hire-react-developer" },
  { name: "TypeScript Development", url: "/hire-typescript-developer" },
  { name: "Tailwind CSS Development", url: "/hire-tailwind-css-developer" },
  { name: "Sanity CMS Development", url: "/hire-sanity-developer" },
  { name: "Figma to Code", url: "/figma-to-code-developer" },
  { name: "Headless CMS Development", url: "/headless-cms-development" },
  {
    name: "Website Performance Optimization",
    url: "/website-performance-optimization",
  },
  { name: "Core Web Vitals Improvement", url: "/improve-core-web-vitals" },
  { name: "Fix Slow Website", url: "/fix-slow-website" },
  {
    name: "Frontend Development for Agencies",
    url: "/frontend-developer-for-agencies",
  },
  {
    name: "White Label Frontend Development",
    url: "/white-label-frontend-development",
  },
  { name: "Website Maintenance", url: "/website-maintenance-services" },
  { name: "Frontend Consulting", url: "/frontend-consulting-services" },
  { name: "Frontend for SaaS", url: "/frontend-developer-for-saas" },
  { name: "Frontend for Startups", url: "/frontend-developer-for-startups" },
  { name: "Website Redesign", url: "/website-redesign-services" },
  {
    name: "WordPress to Astro Migration",
    url: "/wordpress-to-astro-migration",
  },
  {
    name: "WordPress to Next.js Migration",
    url: "/wordpress-to-nextjs-migration",
  },
  { name: "AI Website Optimization", url: "/ai-website-optimization" },
  { name: "Landing Page Optimization", url: "/landing-page-optimization" },
] as const;

export function absoluteUrl(
  path: string,
  site?: URL | string | undefined,
): string {
  const base = getSiteUrl(site);
  if (!path || path === "/") return `${base}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function absoluteImageUrl(
  imagePath: string,
  site?: URL | string | undefined,
): string {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return absoluteUrl(imagePath, site);
}

export function buildPersonSchema(siteUrl: string = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: AUTHOR_NAME,
    url: siteUrl,
    jobTitle: AUTHOR_JOB_TITLE,
    image: absoluteImageUrl(DEFAULT_OG_IMAGE, siteUrl),
    sameAs: SAME_AS,
    knowsAbout: KNOWS_ABOUT,
    worksFor: { "@id": `${siteUrl}/#organization` },
  };
}

export function buildOrganizationSchema(siteUrl: string = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: AUTHOR_NAME,
    url: siteUrl,
    logo: absoluteImageUrl(DEFAULT_OG_IMAGE, siteUrl),
    image: absoluteImageUrl(DEFAULT_OG_IMAGE, siteUrl),
    sameAs: SAME_AS,
    founder: { "@id": `${siteUrl}/#person` },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      url: `${siteUrl}/#contact`,
      availableLanguage: ["English"],
      areaServed: AREA_SERVED,
    },
  };
}

export function buildWebSiteSchema(siteUrl: string = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE_NAME,
    alternateName: AUTHOR_NAME,
    url: siteUrl,
    description:
      "Portfolio and services of Omprakash Tanwar — Frontend Developer specializing in Astro, Next.js, React, TypeScript, and performance-focused web development.",
    inLanguage: "en",
    publisher: { "@id": `${siteUrl}/#person` },
    author: { "@id": `${siteUrl}/#person` },
  };
}

export function buildProfessionalServiceSchema(siteUrl: string = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#professional-service`,
    name: `${AUTHOR_NAME} — Frontend Development Services`,
    url: siteUrl,
    image: absoluteImageUrl(DEFAULT_OG_IMAGE, siteUrl),
    description:
      "Freelance frontend development services including Astro, Next.js, React, TypeScript, Tailwind CSS, Sanity CMS, performance optimization, and white-label agency support for clients in the US, UK, Europe, Canada, and Australia.",
    provider: { "@id": `${siteUrl}/#person` },
    areaServed: AREA_SERVED,
    serviceType: KNOWS_ABOUT,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Frontend Development Services",
      itemListElement: SERVICE_OFFERINGS.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: service.name,
          url: absoluteUrl(service.url, siteUrl),
        },
      })),
    },
  };
}

export function buildWebPageSchema(options: {
  siteUrl?: string;
  url: string;
  name: string;
  description: string;
  type?: "WebPage" | "ContactPage" | "CollectionPage" | "AboutPage";
  dateModified?: string;
  datePublished?: string;
}) {
  const siteUrl = options.siteUrl ?? SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": options.type ?? "WebPage",
    "@id": `${options.url}#webpage`,
    url: options.url,
    name: options.name,
    description: options.description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#person` },
    inLanguage: "en",
    ...(options.datePublished
      ? { datePublished: options.datePublished }
      : {}),
    ...(options.dateModified ? { dateModified: options.dateModified } : {}),
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildCollectionPageSchema(options: {
  siteUrl?: string;
  url: string;
  name: string;
  description: string;
  itemUrls?: string[];
}) {
  const siteUrl = options.siteUrl ?? SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${options.url}#webpage`,
    url: options.url,
    name: options.name,
    description: options.description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#person` },
    inLanguage: "en",
    ...(options.itemUrls && options.itemUrls.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: options.itemUrls.map((url, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url,
            })),
          },
        }
      : {}),
  };
}

export function buildBlogSchema(options: {
  siteUrl?: string;
  url: string;
  name: string;
  description: string;
}) {
  const siteUrl = options.siteUrl ?? SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${options.url}#blog`,
    name: options.name,
    description: options.description,
    url: options.url,
    inLanguage: "en",
    author: { "@id": `${siteUrl}/#person` },
    publisher: { "@id": `${siteUrl}/#organization` },
    isPartOf: { "@id": `${siteUrl}/#website` },
  };
}

export function buildBlogPostingSchema(options: {
  siteUrl?: string;
  url: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  keywords: string[];
  articleSection: string;
  wordCount: number;
  readingTimeMinutes?: number;
}) {
  const siteUrl = options.siteUrl ?? SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${options.url}#article`,
    headline: options.headline,
    description: options.description,
    image: {
      "@type": "ImageObject",
      url: options.image,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
    },
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    author: {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: AUTHOR_NAME,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: AUTHOR_NAME,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteImageUrl(DEFAULT_OG_IMAGE, siteUrl),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": options.url,
    },
    isPartOf: {
      "@type": "Blog",
      "@id": `${siteUrl}/blog#blog`,
    },
    keywords: options.keywords.join(", "),
    articleSection: options.articleSection,
    wordCount: options.wordCount,
    inLanguage: "en",
    ...(options.readingTimeMinutes
      ? { timeRequired: `PT${options.readingTimeMinutes}M` }
      : {}),
  };
}

export function buildServiceSchema(options: {
  siteUrl?: string;
  url: string;
  name: string;
  description: string;
  serviceType: string;
}) {
  const siteUrl = options.siteUrl ?? SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: options.name,
    description: options.description,
    url: options.url,
    provider: {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: AUTHOR_NAME,
      url: siteUrl,
      jobTitle: AUTHOR_JOB_TITLE,
    },
    areaServed: AREA_SERVED,
    serviceType: options.serviceType,
  };
}

export function buildFaqSchema(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** Category-specific meta description helpers for unique SERP copy. */
export const CATEGORY_SEO: Record<
  string,
  { titleSuffix: string; description: string }
> = {
  Accessibility: {
    titleSuffix: "Accessible UI & Inclusive Frontend",
    description:
      "Guides on accessible interfaces, semantic HTML, ARIA, and inclusive frontend patterns for production React, Next.js, and Astro sites.",
  },
  Animation: {
    titleSuffix: "Motion & UI Animation",
    description:
      "Practical articles on Framer Motion, GSAP, and performant UI animation for modern frontend products without hurting Core Web Vitals.",
  },
  Architecture: {
    titleSuffix: "Frontend Architecture",
    description:
      "Articles on structuring large React and Next.js codebases, scalable UI systems, and maintainable frontend architecture.",
  },
  Astro: {
    titleSuffix: "Astro Development Guides",
    description:
      "Astro.js tutorials and case notes on content sites, islands architecture, CMS workflows, SEO, and high-performance marketing builds.",
  },
  "Best Practices": {
    titleSuffix: "Frontend Best Practices",
    description:
      "Production-ready frontend best practices covering code quality, delivery, and maintainable UI systems for agencies and product teams.",
  },
  Business: {
    titleSuffix: "Frontend Business Insights",
    description:
      "Business-focused frontend articles on retainers, hiring decisions, project scoping, and how website performance affects growth.",
  },
  CMS: {
    titleSuffix: "Headless CMS & Content",
    description:
      "Guides on Sanity CMS, headless content workflows, and editor-friendly CMS integrations with Astro and modern frontends.",
  },
  CSS: {
    titleSuffix: "Modern CSS Techniques",
    description:
      "CSS articles covering layout systems, responsive design, and maintainable styling approaches for production websites.",
  },
  Design: {
    titleSuffix: "Design-to-Code",
    description:
      "Articles bridging design and engineering — Figma fidelity, design systems, and shipping polished UI in production.",
  },
  "E-Commerce": {
    titleSuffix: "Ecommerce Frontends",
    description:
      "Frontend guides for ecommerce UX, multi-vendor storefronts, payments UI, and conversion-focused product pages.",
  },
  Freelancing: {
    titleSuffix: "Freelance Frontend Career",
    description:
      "Lessons on freelance frontend development, pricing, client expectations, and building a sustainable independent practice.",
  },
  Marketing: {
    titleSuffix: "Marketing Sites & Conversion",
    description:
      "Articles on landing pages, lead capture, Google Ads landers, and marketing site engineering that converts.",
  },
  "Next.js": {
    titleSuffix: "Next.js Development",
    description:
      "Next.js guides covering App Router, Server Components, performance optimization, and production SaaS frontends.",
  },
  Performance: {
    titleSuffix: "Web Performance & CWV",
    description:
      "Deep dives on Core Web Vitals, LCP, INP, CLS, and practical website performance optimization for real business sites.",
  },
  React: {
    titleSuffix: "React Development",
    description:
      "React articles on performance, state, real-time features, authentication, and production-ready component systems.",
  },
  Security: {
    titleSuffix: "Frontend Security",
    description:
      "Frontend security best practices for modern React and Next.js applications — auth, XSS prevention, and safer defaults.",
  },
  SEO: {
    titleSuffix: "Technical SEO for Frontends",
    description:
      "Technical SEO checklists and strategies for Astro, React SPAs, migrations, and crawlable, indexable frontend architecture.",
  },
  Tailwind: {
    titleSuffix: "Tailwind CSS Patterns",
    description:
      "Tailwind CSS best practices, design-system patterns, and scalable UI workflows for large frontend projects.",
  },
  UX: {
    titleSuffix: "UX & Interface Quality",
    description:
      "UX-focused frontend writing on responsive design, accessible interfaces, and user experience that ships in production.",
  },
};

export function getCategorySeo(categoryName: string): {
  title: string;
  description: string;
} {
  const entry = CATEGORY_SEO[categoryName];
  if (entry) {
    return {
      title: `${categoryName} Articles | ${entry.titleSuffix} | ${AUTHOR_NAME}`,
      description: entry.description,
    };
  }
  return {
    title: `${categoryName} Articles | Frontend Development Blog | ${AUTHOR_NAME}`,
    description: `Articles about ${categoryName} — frontend development insights on React, Next.js, Astro, and modern web engineering by ${AUTHOR_NAME}.`,
  };
}

export function getTagSeo(tagName: string, postCount: number): {
  title: string;
  description: string;
} {
  return {
    title: `#${tagName} Articles | Frontend Development Blog | ${AUTHOR_NAME}`,
    description: `${postCount} article${postCount === 1 ? "" : "s"} tagged “${tagName}” covering frontend development, performance, and modern web engineering by ${AUTHOR_NAME}.`,
  };
}
