import type { ServiceLandingConfig } from "../../lib/landing";

export const wordpressToAstroMigration: ServiceLandingConfig = {
  slug: "wordpress-to-astro-migration",
  keyword: "WordPress to Astro Migration",
  title: "WordPress to Astro Migration | Fast, SEO-Safe Rebuild | Omprakash Tanwar",
  description:
    "WordPress to Astro migration for content sites that need speed, simpler hosting, and SEO preserved. Headless CMS options, redirect maps, and HTML-first delivery for US, UK, and EU businesses.",
  tags: [
    "WordPress to Astro Migration",
    "Migrate WordPress to Astro",
    "WordPress Astro Migration Service",
    "Headless WordPress Astro",
    "WordPress Replacement Astro",
  ],
  accent: "#FF5D01",
  accentSecondary: "#00fff7",
  eyebrow: "// migrate.wp_to_astro()",
  h1Before: "WordPress to Astro",
  h1Accent: "Migration_",
  lead: "WordPress made sense years ago. Now plugin updates, security patches, and slow mobile loads eat your week. I migrate WordPress sites to Astro — HTML-first pages, optional headless CMS, and SEO carried forward so rankings and backlinks survive the move.",
  heroPoints: [
    "Content and URL inventory with 301 redirect maps before a single template ships",
    "Astro islands: ship JavaScript only where interaction actually needs it",
    "Hosting simplification — static or edge deployment without PHP maintenance drag",
  ],
  primaryCta: "Plan My Migration",
  secondaryCta: "See Astro Work",
  badges: [
    { label: "SEO Safe", sub: "Redirects", color: "#00fff7" },
    { label: "Astro", sub: "HTML-first", color: "#FF5D01" },
    { label: "Top Rated", sub: "Upwork", color: "#14a800" },
    { label: "CMS Ready", sub: "Headless", color: "#bf00ff" },
  ],
  capabilitiesTitle: "WordPress → Astro",
  capabilitiesAccent: "migration scope_",
  capabilitiesIntro:
    "Marketing sites, blogs, and content-heavy businesses — not trying to rebuild WooCommerce complexity inside Astro without discussion.",
  capabilities: [
    {
      id: "01",
      title: "Content & URL Migration",
      desc: "Export posts, pages, and media; map WordPress slugs to Astro routes; preserve categories, authors, and internal links.",
      tags: ["Content", "Redirects", "Slugs"],
      accent: "#FF5D01",
    },
    {
      id: "02",
      title: "Headless CMS Wiring",
      desc: "Sanity, Contentful, or markdown/git workflows so editors keep a UI without dragging WordPress PHP along.",
      tags: ["Sanity", "CMS", "Preview"],
      accent: "#00fff7",
    },
    {
      id: "03",
      title: "Template Rebuild in Astro",
      desc: "Component-based layouts, responsive design, and image pipelines that beat theme bloat on LCP from day one.",
      tags: ["Astro", "Tailwind", "Images"],
      accent: "#bf00ff",
    },
    {
      id: "04",
      title: "Launch & Indexing Verification",
      desc: "Sitemap, robots, Search Console resubmission, and post-cutover monitoring for 404 spikes or ranking dips.",
      tags: ["SEO", "Launch", "Monitor"],
      accent: "#f7df1e",
    },
  ],
  problemsHeading: "Why teams leave WordPress",
  problemsIntro: "Migration conversations usually start after maintenance cost exceeds value.",
  problems: [
    {
      title: "Plugin dependency spiral",
      desc: "SEO, forms, cache, and security each need another plugin. Astro frontends shed runtime PHP and most of that stack.",
    },
    {
      title: "Speed ceiling on shared hosting",
      desc: "Optimized WordPress still ships more than a content site needs. Astro defaults to static HTML — faster globally, cheaper to host.",
    },
    {
      title: "Security and update fatigue",
      desc: "Core, theme, and plugin patches on a site that rarely changes. Static Astro output shrinks the attack surface dramatically.",
    },
    {
      title: "Design trapped in theme logic",
      desc: "Every visual change fights PHP templates. A custom Astro frontend matches Figma without hooking into wp_enqueue_script chaos.",
    },
  ],
  processHeading: "Migration process",
  processIntro: "Audit → parallel build → SEO-safe cutover — with staging you can share before DNS flips.",
  process: [
    {
      num: "01",
      title: "WP audit & export",
      label: "Inventory",
      desc: "Plugins, custom post types, forms, and analytics. Decide what migrates, what retires, and what gets a new integration.",
      color: "#FF5D01",
    },
    {
      num: "02",
      title: "Astro architecture",
      label: "Design",
      desc: "Route structure, CMS choice, component plan, and redirect spreadsheet signed off before bulk content import.",
      color: "#00fff7",
    },
    {
      num: "03",
      title: "Build & content import",
      label: "Construct",
      desc: "Templates first on high-traffic URLs, then long tail. Staging for editor review and visual QA.",
      color: "#bf00ff",
    },
    {
      num: "04",
      title: "Cutover weekend",
      label: "Launch",
      desc: "DNS, redirects, Search Console, and a hypercare window for fixes — not a silent handoff into production firefighting.",
      color: "#f7df1e",
    },
  ],
  techHeading: "Migration stack",
  techIntro: "Proven Astro ecosystem — chosen for editor happiness and long-term speed.",
  tech: [
    { name: "Astro", color: "#FF5D01" },
    { name: "Sanity", color: "#F03E2F" },
    { name: "Tailwind CSS", color: "#38BDF8" },
    { name: "WordPress", color: "#21759B" },
    { name: "Vercel", color: "#ffffff" },
    { name: "Netlify", color: "#00C7B7" },
    { name: "Cloudinary", color: "#3448C5" },
    { name: "Google Search Console", color: "#f7df1e" },
  ],
  reasonsHeading: "Why hire me for WordPress → Astro",
  reasons: [
    "I build Astro sites in production — migration is not a tutorial exercise for me",
    "SEO preservation is scoped work: redirects, metadata, and sitemaps are deliverables",
    "Headless CMS setups editors can actually use without calling you for every post",
    "Performance outcomes you can measure — not “feels faster” hand-waving",
    "Remote delivery for US, UK, and EU with documented cutover runbooks",
    "Straight talk on when Astro fits — and when Next.js or staying on WP is smarter",
  ],
  proofHeading: "Astro migration credibility",
  proofIntro: "Live Astro projects demonstrating the destination stack quality.",
  proof: [
    {
      title: "Boutee",
      type: "Astro Brand Site",
      desc: "Marketing site on Astro with Lighthouse 100 performance — the kind of fast, maintainable frontend WordPress content sites can become post-migration.",
      tags: ["Astro", "Performance", "SEO"],
      accent: "#FF5D01",
      href: "https://www.boutee.co.uk/",
      metric: "Perf 100",
    },
    {
      title: "Portfolio",
      type: "Astro Content Site",
      desc: "This portfolio — Astro, content collections, and minimal client JS — shows how editorial and service pages stay fast without WordPress overhead.",
      tags: ["Astro", "Content", "Tailwind"],
      accent: "#00fff7",
      href: "/",
      metric: "Zero WP",
    },
  ],
  faqs: [
    {
      question: "Will migrating WordPress to Astro hurt my SEO?",
      answer:
        "Not if done correctly. URL mapping, 301 redirects, preserved titles/descriptions, and sitemap resubmission protect rankings. I treat SEO as a migration workstream, not launch luck.",
    },
    {
      question: "How will my team edit content after migration?",
      answer:
        "Usually a headless CMS like Sanity with preview, or a git-based workflow for technical teams. We match the editor experience to your staff — not force markdown on non-technical marketers.",
    },
    {
      question: "Can you migrate WooCommerce stores to Astro?",
      answer:
        "Astro is ideal for content-heavy marketing sites. Full ecommerce often needs Next.js or a dedicated platform. I assess catalog complexity before recommending Astro.",
    },
    {
      question: "How long does a typical WordPress to Astro migration take?",
      answer:
        "Small marketing sites with ready design: a few weeks. Larger blogs, custom fields, and multilingual content take longer. Inventory call first, then a fixed milestone plan.",
    },
    {
      question: "Astro vs Next.js — which should I choose?",
      answer:
        "Astro when the site is mostly content with light interactivity. Next.js when you need heavy auth, dashboards, or app-like features. I recommend based on your roadmap, not a default bias.",
    },
  ],
  relatedServices: [
    { href: "/hire-astro-developer", label: "Hire Astro Developer", desc: "Ongoing Astro development" },
    { href: "/headless-cms-development", label: "Headless CMS Development", desc: "Editor workflows without WordPress" },
    { href: "/improve-core-web-vitals", label: "Improve Core Web Vitals", desc: "Post-migration CWV verification" },
    { href: "/website-redesign-services", label: "Website Redesign Services", desc: "Rebrand during migration" },
  ],
  relatedReads: [
    { href: "/blog/migrating-wordpress-to-astro-without-losing-seo", label: "Migrating WordPress to Astro Without Losing SEO" },
    { href: "/blog/why-astro-is-my-first-choice-content-websites", label: "Why Astro Is My First Choice for Content Websites" },
    { href: "/blog/cms-integration-astro-headless-cms", label: "CMS Integration with Astro Headless CMS" },
    { href: "/blog/custom-frontend-vs-wordpress-theme-growing-business", label: "Custom Frontend vs WordPress Theme for Growing Businesses" },
    { href: "/blog/real-world-seo-strategies-astro-projects", label: "Real-World SEO Strategies for Astro Projects" },
    { href: "/blog/building-high-performance-portfolio-astro", label: "Building a High-Performance Portfolio with Astro" },
  ],
  midCtaHeading: "Ready to retire WordPress maintenance?",
  midCtaBody:
    "Share your WordPress URL, editor needs, and must-keep plugins or forms. I will outline Astro architecture, CMS options, SEO cutover steps, and a realistic migration timeline.",
};
