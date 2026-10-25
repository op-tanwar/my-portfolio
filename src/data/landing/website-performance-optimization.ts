import type { ServiceLandingConfig } from "../../lib/landing";

export const websitePerformanceOptimization: ServiceLandingConfig = {
  slug: "website-performance-optimization",
  keyword: "Website Performance Optimization Service",
  title: "Website Performance Optimization Service | Core Web Vitals | Omprakash Tanwar",
  description:
    "Website performance optimization service for Core Web Vitals, Lighthouse, and conversion-critical pages. Audits and fixes for React, Next.js, and Astro sites used by businesses in the US, UK, and Europe.",
  tags: [
    "Website Performance Optimization Service",
    "Core Web Vitals Optimization",
    "Lighthouse Performance Fix",
    "Website Speed Optimization",
    "Frontend Performance Audit",
  ],
  accent: "#38BDF8",
  accentSecondary: "#00fff7",
  eyebrow: "// performance.optimize()",
  h1Before: "Website Performance",
  h1Accent: "Optimization_",
  lead: "Slow pages tax every ad dollar and every SEO visit. I offer a website performance optimization service that measures lab and field data, ranks fixes by revenue impact, and ships remediation on React, Next.js, and Astro frontends — without a cosmetic redesign that stays slow.",
  heroPoints: [
    "Core Web Vitals (LCP, INP, CLS) treated as business metrics, not vanity scores",
    "Quick-win sprints and deeper architecture fixes sequenced so campaigns can keep running",
    "Proof after shipping: before/after measurements on the URLs that make money",
  ],
  primaryCta: "Book a Performance Audit",
  secondaryCta: "See Performance Work",
  badges: [
    { label: "CWV Focus", sub: "LCP · INP · CLS", color: "#38BDF8" },
    { label: "Lighthouse", sub: "Hardening", color: "#00fff7" },
    { label: "Top Rated", sub: "Upwork", color: "#14a800" },
    { label: "ROI-first", sub: "Prioritization", color: "#f7df1e" },
  ],
  capabilitiesTitle: "Performance services",
  capabilitiesAccent: "I deliver_",
  capabilitiesIntro:
    "From audit-only clarity for founders to full frontend remediation and rebuild planning.",
  capabilities: [
    {
      id: "01",
      title: "Performance Audits (Business-Readable)",
      desc: "Lab + field reading, money-page prioritization, and effort-ranked recommendations you can approve without drowning in red Lighthouse bars.",
      tags: ["Audit", "CrUX", "Lighthouse"],
      accent: "#38BDF8",
    },
    {
      id: "02",
      title: "Core Web Vitals Remediation",
      desc: "Image/font strategy, script deferral, layout shift fixes, and main-thread work reduction on templates that drive leads or sales.",
      tags: ["LCP", "INP", "CLS"],
      accent: "#00fff7",
    },
    {
      id: "03",
      title: "Next.js / React Performance Passes",
      desc: "Bundle analysis, Server/Client boundary fixes, route-level code splitting, and hydration cost cuts on App Router or SPA shells.",
      tags: ["Next.js", "React", "Bundles"],
      accent: "#bf00ff",
    },
    {
      id: "04",
      title: "Rebuild Planning (When Themes Cap Out)",
      desc: "If the stack cannot meet a budget, I plan Astro/Next migrations with SEO-safe redirects — after proving quick wins are exhausted.",
      tags: ["Astro", "Migration", "SEO"],
      accent: "#ff006e",
    },
  ],
  problemsHeading: "Symptoms this service targets",
  problemsIntro: "If any of these sound familiar, performance work is probably cheaper than buying more traffic.",
  problems: [
    {
      title: "Paid landers that bounce on mobile",
      desc: "Ad relevance is fine; LCP and INP are not. We harden the landing templates that spend the budget.",
    },
    {
      title: "Search Console CWV failing URLs",
      desc: "Field data is red while desktop lab screenshots look fine. We prioritize real-user failing pages.",
    },
    {
      title: "Third-party scripts unsupervised",
      desc: "Chat, tag managers, and heatmaps quietly destroy INP. We add a script policy and load strategies.",
    },
    {
      title: "Rebuilds that stay slow",
      desc: "Pretty redesigns reintroduce the same sins. Budgets and measurement become acceptance criteria.",
    },
  ],
  processHeading: "Optimization process",
  processIntro: "Measure → triage → ship wins → decide on architecture. No blind rewrite on day one.",
  process: [
    {
      num: "01",
      title: "Baseline & money URLs",
      label: "Measure",
      desc: "Lighthouse/WebPageTest + Search Console/CrUX focus on homepage, top landers, and checkout/lead pages.",
      color: "#38BDF8",
    },
    {
      num: "02",
      title: "Ranked remediation plan",
      label: "Triage",
      desc: "Quick wins vs structural vs architecture. Effort, risk, and expected impact in writing.",
      color: "#00fff7",
    },
    {
      num: "03",
      title: "Fix sprint",
      label: "Execute",
      desc: "Implement high-ROI items with staging validation. Protect analytics and forms while changing load order.",
      color: "#bf00ff",
    },
    {
      num: "04",
      title: "Prove & monitor",
      label: "Verify",
      desc: "Before/after lab, watch field CWV, document budgets so marketing does not re-break the site next month.",
      color: "#f7df1e",
    },
  ],
  techHeading: "Where I optimize",
  techIntro: "Frontend performance across the stacks I already ship in production.",
  tech: [
    { name: "Core Web Vitals", color: "#38BDF8" },
    { name: "Lighthouse CI", color: "#00fff7" },
    { name: "Next.js", color: "#ffffff" },
    { name: "Astro", color: "#FF5D01" },
    { name: "React", color: "#61DAFB" },
    { name: "Image CDN / AVIF", color: "#f7df1e" },
    { name: "WebPageTest", color: "#bf00ff" },
    { name: "Chrome UX Report", color: "#ff006e" },
  ],
  reasonsHeading: "Why hire me for performance work",
  reasons: [
    "I translate metrics into CAC and conversion language founders understand",
    "Shipped sites with aggressive LCP targets and Lighthouse 100 on content properties",
    "Remediate first; rebuild only when the platform is the ceiling",
    "Comfortable with Next, Astro, and React — not a single-framework auditor",
    "Optional retainers to stop regressions after marketing adds new tags",
    "Top Rated delivery with written reports you can share with stakeholders",
  ],
  proofHeading: "Performance-minded delivery",
  proofIntro: "Portfolio examples where speed was part of the product, not an afterthought.",
  proof: [
    {
      title: "Boutee",
      type: "Astro Brand Site",
      desc: "Near-zero JS content delivery with a 100 Lighthouse performance score — proof that design-heavy sites can still be fast.",
      tags: ["Astro", "CWV", "SEO"],
      accent: "#ff006e",
      href: "https://www.boutee.co.uk/",
      metric: "Perf 100",
    },
    {
      title: "YummyGummies",
      type: "Ecommerce Frontend",
      desc: "SSR/ISR ecommerce architecture aimed at sub-1s LCP across routes — performance treated as a store requirement.",
      tags: ["Next.js", "LCP", "Stripe"],
      accent: "#00fff7",
      metric: "LCP <1s",
    },
  ],
  faqs: [
    {
      question: "What is included in a website performance optimization service?",
      answer:
        "Typically a baseline audit, prioritized fix list, implementation of agreed items, and before/after proof on key URLs. Larger rebuilds are optional follow-ons after triage — not assumed.",
    },
    {
      question: "How is this different from a redesign?",
      answer:
        "Optimization targets speed and responsiveness metrics. Visual redesign can happen later or in parallel, but many conversion wins come from remediating the current site first.",
    },
    {
      question: "Can you help if our site is WordPress or a page builder?",
      answer:
        "Yes for audits and many frontend/asset/script fixes. If the platform cannot meet budgets, I document that and outline Astro/Next migration options with SEO precautions.",
    },
    {
      question: "How long until we see improvement?",
      answer:
        "Image, font, and script quick wins often land within days. Deep JavaScript architecture work takes longer. Field CWV updates in Search Console can lag behind lab improvements.",
    },
    {
      question: "Do you guarantee Lighthouse 100?",
      answer:
        "I target strong mobile scores and passing CWV where the stack allows. Third-party requirements and product complexity can make “100 everywhere” unrealistic — I set honest budgets per template.",
    },
  ],
  relatedServices: [
    { href: "/landing-page-optimization", label: "Landing Page Optimization", desc: "CRO + speed for paid landers" },
    { href: "/improve-core-web-vitals", label: "Improve Core Web Vitals", desc: "Metric-specific LCP, INP, and CLS fixes" },
    { href: "/fix-slow-website", label: "Fix Slow Website", desc: "Business-pain speed turnaround" },
    { href: "/hire-astro-developer", label: "Hire Astro Developer", desc: "Rebuild content sites for HTML-first speed" },
  ],
  relatedReads: [
    { href: "/blog/convert-slow-website-to-fast-modern-site", label: "Convert a Slow Website Into a Fast, Modern Site" },
    { href: "/blog/website-speed-audit-for-business-owners", label: "Website Speed Audit for Business Owners" },
    { href: "/blog/optimizing-core-web-vitals-modern-frontend", label: "Optimizing Core Web Vitals" },
    { href: "/blog/how-businesses-lose-customers-slow-websites", label: "How Businesses Lose Customers to Slow Websites" },
    { href: "/blog/common-frontend-mistakes-hurt-website-performance", label: "Common Frontend Mistakes That Hurt Performance" },
    { href: "/blog/google-ads-landing-pages-core-web-vitals", label: "Google Ads Landing Pages and Core Web Vitals" },
  ],
  midCtaHeading: "Want a performance plan for your money pages?",
  midCtaBody:
    "Send your top landing URLs and whether you have Search Console access. I will outline an audit or remediation sprint sized to impact — not fear.",
};
