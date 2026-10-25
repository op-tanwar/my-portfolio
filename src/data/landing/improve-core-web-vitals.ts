import type { ServiceLandingConfig } from "../../lib/landing";

export const improveCoreWebVitals: ServiceLandingConfig = {
  slug: "improve-core-web-vitals",
  keyword: "Improve Core Web Vitals",
  title: "Improve Core Web Vitals | LCP, INP & CLS Fixes | Omprakash Tanwar",
  description:
    "Improve Core Web Vitals with metric-specific remediation for LCP, INP, and CLS — not vague performance audits. Field-data fixes for React, Next.js, and Astro sites serving US, UK, and EU traffic.",
  tags: [
    "Improve Core Web Vitals",
    "Core Web Vitals Fix",
    "LCP Optimization Service",
    "INP Improvement",
    "CLS Remediation",
  ],
  accent: "#0cce6b",
  accentSecondary: "#38BDF8",
  eyebrow: "// cwv.remediate()",
  h1Before: "Improve Core",
  h1Accent: "Web Vitals_",
  lead: "Search Console shows failing URLs. Your agency sent a Lighthouse PDF. What you actually need is Core Web Vitals remediation — LCP, INP, and CLS diagnosed from field data and fixed on the templates that earn traffic. I improve Core Web Vitals with surgical frontend work, not a 40-page audit that never ships.",
  heroPoints: [
    "Each metric gets its own fix playbook — hero LCP, interaction INP, layout CLS",
    "CrUX and Search Console URLs prioritized over random blog posts nobody visits",
    "Before/after proof on the exact routes Google grades — lab and field",
  ],
  primaryCta: "Fix My Core Web Vitals",
  secondaryCta: "See CWV Work",
  badges: [
    { label: "LCP", sub: "Hero & fonts", color: "#0cce6b" },
    { label: "INP", sub: "Main thread", color: "#38BDF8" },
    { label: "CLS", sub: "Layout stable", color: "#f7df1e" },
    { label: "CrUX", sub: "Field data", color: "#bf00ff" },
  ],
  capabilitiesTitle: "Metric-specific",
  capabilitiesAccent: "CWV remediation_",
  capabilitiesIntro:
    "Targeted fixes per vital — distinct from broad speed audits or full platform rebuilds unless the data proves you need one.",
  capabilities: [
    {
      id: "01",
      title: "LCP Remediation",
      desc: "Hero image priority, responsive srcset, font-display strategy, server/CDN TTFB alignment, and render-blocking CSS cuts on above-the-fold templates.",
      tags: ["LCP", "Images", "Fonts"],
      accent: "#0cce6b",
    },
    {
      id: "02",
      title: "INP / Interaction Fixes",
      desc: "Long tasks, event handler debouncing, third-party script deferral, hydration slimming, and input responsiveness on forms, nav, and carousels.",
      tags: ["INP", "JS", "Hydration"],
      accent: "#38BDF8",
    },
    {
      id: "03",
      title: "CLS Stabilization",
      desc: "Explicit image/video dimensions, ad/embed reservations, font swap discipline, and dynamic UI that does not shove content mid-read.",
      tags: ["CLS", "Layout", "Embeds"],
      accent: "#f7df1e",
    },
    {
      id: "04",
      title: "CWV Monitoring Setup",
      desc: "Per-template budgets, regression alerts, and documentation so the next marketing tag or A/B script does not silently fail INP again.",
      tags: ["RUM", "Budgets", "CI"],
      accent: "#bf00ff",
    },
  ],
  problemsHeading: "CWV failures I see in the field",
  problemsIntro: "Lab scores green while real users on mid-tier Android still fail — that is what we fix.",
  problems: [
    {
      title: "LCP stuck on a decorative hero",
      desc: "Massive unoptimized WebP, lazy-loaded LCP candidate, or fonts blocking paint. We identify the actual LCP element and fix load order.",
    },
    {
      title: "INP red after chat and analytics",
      desc: "GTM, Intercom, and A/B tools compete on the main thread. We sequence, defer, or fence third parties without losing measurement.",
    },
    {
      title: "CLS from ads and cookie banners",
      desc: "Consent UI and dynamic promos inject height after paint. Reserved space and stable skeletons stop the layout jump users feel.",
    },
    {
      title: "Passing desktop, failing mobile",
      desc: "CrUX is mobile-weighted. Fixes target real-device throttling and the URLs Search Console flags — not just your MacBook screenshot.",
    },
  ],
  processHeading: "CWV remediation workflow",
  processIntro: "Diagnose by metric → fix highest-traffic failing URLs → verify field recovery.",
  process: [
    {
      num: "01",
      title: "Field data triage",
      label: "Diagnose",
      desc: "Search Console CWV report + CrUX breakdown per URL. Separate LCP vs INP vs CLS root causes — they rarely share one fix.",
      color: "#0cce6b",
    },
    {
      num: "02",
      title: "Per-metric fix plan",
      label: "Prescribe",
      desc: "Written remediation per vital with effort and expected movement. No generic “optimize images” list without naming the LCP node.",
      color: "#38BDF8",
    },
    {
      num: "03",
      title: "Template-level surgery",
      label: "Fix",
      desc: "Implement on homepage, top landers, and product templates first. Staging validation on mobile throttling before production.",
      color: "#f7df1e",
    },
    {
      num: "04",
      title: "Field watch window",
      label: "Prove",
      desc: "Lab before/after plus guidance on CrUX lag. Handoff notes so stakeholders know when to expect green in Search Console.",
      color: "#bf00ff",
    },
  ],
  techHeading: "CWV tooling & stacks",
  techIntro: "Measurement and remediation across the frontends I ship in production.",
  tech: [
    { name: "Chrome UX Report", color: "#0cce6b" },
    { name: "Search Console", color: "#38BDF8" },
    { name: "Lighthouse", color: "#f7df1e" },
    { name: "WebPageTest", color: "#bf00ff" },
    { name: "Next.js", color: "#ffffff" },
    { name: "Astro", color: "#FF5D01" },
    { name: "React", color: "#61DAFB" },
    { name: "Partytown", color: "#00fff7" },
  ],
  reasonsHeading: "Why hire me for Core Web Vitals",
  reasons: [
    "I fix LCP, INP, and CLS as separate engineering tasks — not one vague “speed project”",
    "Shipped sites with Lighthouse 100 and aggressive LCP targets on real content",
    "Comfortable remediating React hydration cost and Astro image pipelines alike",
    "Reports written for marketing leads — what failed, what we changed, what to expect",
    "Remote delivery for US, UK, and EU teams with async staging reviews",
    "I escalate to rebuild only when metric ceilings are architectural — with data",
  ],
  proofHeading: "CWV outcomes in portfolio",
  proofIntro: "Projects where vitals were a defined success criterion.",
  proof: [
    {
      title: "Boutee",
      type: "Astro Marketing Site",
      desc: "Content-heavy brand site hitting Lighthouse 100 performance — minimal JS, disciplined images, and stable layout across breakpoints.",
      tags: ["Astro", "LCP", "CLS"],
      accent: "#0cce6b",
      href: "https://www.boutee.co.uk/",
      metric: "Perf 100",
    },
    {
      title: "YummyGummies",
      type: "Ecommerce Frontend",
      desc: "Next.js storefront engineered for sub-1s LCP on product routes — image strategy, ISR, and interaction paths tuned for mobile buyers.",
      tags: ["Next.js", "LCP", "INP"],
      accent: "#38BDF8",
      metric: "LCP <1s",
    },
  ],
  faqs: [
    {
      question: "How is this different from a general performance audit?",
      answer:
        "Audits list problems. CWV remediation implements fixes for LCP, INP, and CLS on URLs that fail in field data — with acceptance criteria tied to each metric, not a single Lighthouse score.",
    },
    {
      question: "Can you fix only one failing metric?",
      answer:
        "Yes. Many engagements start with LCP on the homepage or INP on lead forms. We scope to the vital and URLs that matter most to your traffic.",
    },
    {
      question: "How long until Search Console shows green?",
      answer:
        "Lab improvements are immediate after deploy. CrUX and Search Console field reports can take 28+ days to reflect changes — I set expectations upfront so nobody panics at week two.",
    },
    {
      question: "Do you work on WordPress and page-builder sites?",
      answer:
        "Often for LCP image/font fixes and script deferral. If the platform cannot meet INP budgets, I document the ceiling and point to migration options — honestly.",
    },
    {
      question: "Will improving Core Web Vitals help SEO and ads?",
      answer:
        "CWV is a ranking signal and slow pages hurt Quality Score and conversion. Fixing failing vitals on money URLs is usually higher ROI than more ad spend on a sluggish lander.",
    },
  ],
  relatedServices: [
    { href: "/website-performance-optimization", label: "Website Performance Optimization", desc: "Broader speed strategy and audits" },
    { href: "/fix-slow-website", label: "Fix Slow Website", desc: "Business-first turnaround when users complain" },
    { href: "/hire-nextjs-developer", label: "Hire Next.js Developer", desc: "App Router CWV hardening" },
    { href: "/hire-astro-developer", label: "Hire Astro Developer", desc: "HTML-first rebuild for content sites" },
  ],
  relatedReads: [
    { href: "/blog/optimizing-core-web-vitals-modern-frontend", label: "Optimizing Core Web Vitals on Modern Frontends" },
    { href: "/blog/google-ads-landing-pages-core-web-vitals", label: "Google Ads Landing Pages and Core Web Vitals" },
    { href: "/blog/image-optimization-strategies-faster-websites", label: "Image Optimization Strategies for Faster Websites" },
    { href: "/blog/javascript-performance-best-practices", label: "JavaScript Performance Best Practices" },
    { href: "/blog/common-frontend-mistakes-hurt-website-performance", label: "Common Frontend Mistakes That Hurt Performance" },
    { href: "/blog/react-performance-optimization-techniques", label: "React Performance Optimization Techniques" },
  ],
  midCtaHeading: "Failing LCP, INP, or CLS on money pages?",
  midCtaBody:
    "Share Search Console CWV export or your worst URLs. I will identify which vital is failing, why, and what a focused remediation sprint looks like — metric by metric.",
};
