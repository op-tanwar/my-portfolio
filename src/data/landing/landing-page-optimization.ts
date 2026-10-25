import type { ServiceLandingConfig } from "../../lib/landing";

export const landingPageOptimization: ServiceLandingConfig = {
  slug: "landing-page-optimization",
  keyword: "Landing Page Optimization",
  title: "Landing Page Optimization | CRO, Ads & Speed | Omprakash Tanwar",
  description:
    "Landing page optimization for Google Ads and Meta campaigns — conversion structure, Core Web Vitals, forms, and CTA clarity. Practical CRO for startups and marketing teams in the US, UK, EU, Canada, and Australia.",
  tags: [
    "Landing Page Optimization",
    "Landing Page Conversion Optimization",
    "Landing Page CRO",
    "Google Ads Landing Pages",
    "High Converting Landing Pages",
  ],
  accent: "#ff006e",
  accentSecondary: "#f7df1e",
  eyebrow: "// landing_page.optimize()",
  h1Before: "Landing Page",
  h1Accent: "Optimization_",
  lead: "You are paying for clicks. The page that receives them is where the money leaks. I offer landing page optimization for teams running Google Ads, Meta Ads, or outbound campaigns who need clearer messaging, faster mobile loads, stronger CTAs, and forms that actually submit — without a six-month brand redesign when a focused CRO sprint would move the needle.",
  heroPoints: [
    "Conversion structure first: one job per page, hierarchy that matches ad promise, proof placed where doubt appears",
    "Performance as a conversion feature — LCP and INP treated as CAC infrastructure, not a separate “SEO task”",
    "Implementation on Astro, Next.js, or React so experiments ship as real pages, not slide decks",
  ],
  primaryCta: "Optimize My Landing Pages",
  secondaryCta: "See Conversion Work",
  badges: [
    { label: "CRO Focus", sub: "Ads → lead", color: "#ff006e" },
    { label: "CWV Ready", sub: "Mobile first", color: "#f7df1e" },
    { label: "Top Rated", sub: "Upwork", color: "#14a800" },
    { label: "Forms", sub: "Lead quality", color: "#00fff7" },
  ],
  capabilitiesTitle: "Landing page work",
  capabilitiesAccent: "that protects ad spend_",
  capabilitiesIntro:
    "Focused landing page optimization for paid and high-intent traffic — structure, speed, UX, and measurement — so creative teams are not blamed for a page that never had a chance.",
  capabilities: [
    {
      id: "01",
      title: "Conversion Structure & Messaging Hierarchy",
      desc: "I rebuild how the page argues: headline match to ad copy, one primary CTA style, proof near the ask, and objection handling before the form. Features become benefits. Sections earn their scroll depth. The goal is not “more content” — it is less friction between click and decision. For multi-offer accounts I help you stop forcing every campaign onto a homepage that was never designed to convert strangers.",
      tags: ["CRO", "Messaging", "Hierarchy"],
      accent: "#ff006e",
    },
    {
      id: "02",
      title: "Google Ads & Meta Landing Templates",
      desc: "Paid landers need different rules than brochure sites: strip chrome that dilutes intent, freeze unsupervised third-party scripts during tests, and keep message match tight across variants. I build or remediate templates your media buyers can iterate without inventing a new layout every sprint — including query-aware variants when the stack supports them cleanly.",
      tags: ["Google Ads", "Meta Ads", "Templates"],
      accent: "#f7df1e",
    },
    {
      id: "03",
      title: "Speed, Core Web Vitals & Mobile UX",
      desc: "A five-second mobile LCP turns relevance scores into bounce rates. Landing page optimization includes image strategy, font loading, script deferral, and INP-friendly forms. Thumb-reachable CTAs, readable type, and stable layout matter as much as the headline. I measure the exact ad URL — including query strings that unlock banners — because staging green and production red is a common silent failure.",
      tags: ["LCP", "INP", "Mobile"],
      accent: "#00fff7",
    },
    {
      id: "04",
      title: "Forms, Trust Signals & Analytics Hooks",
      desc: "Lead quality dies in confusing forms and broken thank-you paths. I tighten field sets, validation, accessibility, and CRM/attribution events so sales and media share one truth. Trust blocks (specific outcomes, roles, logos with permission) sit where skepticism peaks — not as a footer afterthought. Tracking CTA clicks, form starts, and submissions from day one is part of the definition of done.",
      tags: ["Forms", "Trust", "Analytics"],
      accent: "#bf00ff",
    },
    {
      id: "05",
      title: "Figma-to-Lander Implementation",
      desc: "When design is ready, I implement conversion-focused pages with token discipline and performance budgets — so visual QA is polish, not rebuilding the page. When design is not ready, I can harden an existing lander first: hierarchy, copy placement, and speed often beat a full creative overhaul for CAC.",
      tags: ["Figma", "Astro", "Next.js"],
      accent: "#38BDF8",
    },
    {
      id: "06",
      title: "Experiment-Friendly Page Systems",
      desc: "A/B tests fail when every variant requires a developer archaeology project. I structure landers with swappable sections, content props, or CMS modules so headlines, proof, and CTAs can change without forking the codebase. Recommendations for what to test come with hypotheses — not “try a blue button” folklore.",
      tags: ["A/B Testing", "CMS", "Iteration"],
      accent: "#14a800",
    },
  ],
  problemsHeading: "Landing page problems that burn budget",
  problemsIntro:
    "If media performance looks fine and pipeline does not, the landing experience is usually the missing variable — not another creative refresh alone.",
  problems: [
    {
      title: "Clicks without conversions",
      desc: "Relevance and Quality Score look acceptable, but form fills stall. Often the page asks for too much, hides the offer, or breaks message match between ad and hero. Landing page optimization reconnects the promise to a single clear next step.",
    },
    {
      title: "Homepage used as an ads destination",
      desc: "Homepages tell brand stories. Ad landers repay clicks. Sending paid traffic to a mega-menu and carousel is an expensive habit. Dedicated templates with restrained navigation convert more honestly.",
    },
    {
      title: "Slow mobile landers",
      desc: "Desktop Lighthouse screenshots hide what field users feel on mid-tier Android. Chat widgets, heavy heroes, and unoptimized images destroy INP and LCP exactly where CAC is measured.",
    },
    {
      title: "Weak or competing CTAs",
      desc: "Three button styles, five offers, and a sticky bar fighting the form. Visitors do not convert when the page cannot decide what winning looks like. One dominant CTA pattern, repeated at decision moments, beats decoration.",
    },
    {
      title: "Forms that create fear or friction",
      desc: "Twelve fields before value, unclear privacy, no error recovery, or third-party embeds that block input. Sales wants qualification; users want speed. Good landing page CRO balances both without killing submit rate.",
    },
    {
      title: "No measurement of the funnel",
      desc: "Teams argue about “feel” because events are missing. Without CTA, form start, and thank-you tracking — plus a stable URL strategy for experiments — optimization is guessing. Instrumentation is part of the service, not an optional extra.",
    },
  ],
  processHeading: "How landing page optimization runs",
  processIntro:
    "Audit the money URLs, fix structure and speed, ship a measurable baseline, then iterate. No theatrical redesign when a targeted sprint would recover conversions.",
  process: [
    {
      num: "01",
      title: "Traffic & page diagnosis",
      label: "Diagnose",
      desc: "We review ad destinations, bounce and conversion data, mobile field feelings, and message match. I list what the page is trying to do versus what visitors experience — including competing CTAs, trust gaps, and script weight. You leave this step with a ranked problem list, not a vague “needs polish” note.",
      color: "#ff006e",
    },
    {
      num: "02",
      title: "Optimization plan with ROI order",
      label: "Plan",
      desc: "Quick wins (images, scripts, CTA clarity, form length) versus structural changes (new template, CMS modules, redesign). Effort, risk to live campaigns, and expected impact go in writing so marketing and engineering share one backlog.",
      color: "#f7df1e",
    },
    {
      num: "03",
      title: "Implement & harden",
      label: "Ship",
      desc: "I implement hierarchy, copy placement support, performance fixes, accessible forms, and analytics events on staging first. Paid URLs are lab-tested with real query strings. Launch includes a freeze on random tag additions during the first measurement window.",
      color: "#00fff7",
    },
    {
      num: "04",
      title: "Measure, recommend tests, hand off",
      label: "Learn",
      desc: "Before/after on load and conversion proxies where you have volume. I document what to A/B next and how to keep the template from drifting. Optional retainers cover ongoing lander variants when campaigns never sleep.",
      color: "#bf00ff",
    },
  ],
  techHeading: "Tools and stacks for high-intent pages",
  techIntro:
    "Landing page optimization sits on modern frontend delivery — not on hoping a page builder keeps CWV green under ad load.",
  tech: [
    { name: "Astro", color: "#FF5D01" },
    { name: "Next.js", color: "#ffffff" },
    { name: "React", color: "#61DAFB" },
    { name: "Tailwind CSS", color: "#38BDF8" },
    { name: "Core Web Vitals", color: "#0cce6b" },
    { name: "GA4 / GTM", color: "#f7df1e" },
    { name: "Figma", color: "#A259FF" },
    { name: "Sanity CMS", color: "#F03E2F" },
  ],
  reasonsHeading: "Why teams hire me for landing page CRO",
  reasons: [
    "I treat paid landers as conversion products — not miniature homepages with a form bolted on",
    "Performance and CRO are one engagement: slow pages are a conversion bug",
    "Production delivery on Astro, Next.js, and React — recommendations you can actually ship",
    "Clear async communication for US, UK, EU, Canada, and Australia time zones",
    "Honest scope: I will say when copy or offer is the bottleneck, not just UI",
    "Top Rated Upwork delivery with before/after notes stakeholders can approve",
    "Experiment hygiene: measurement and URL discipline so tests mean something",
    "Optional white-label work when agencies need lander capacity under their brand",
  ],
  proofHeading: "Relevant delivery patterns",
  proofIntro:
    "Portfolio work that demonstrates fast, conversion-aware frontend craft — the same discipline applied to landing page optimization.",
  proof: [
    {
      title: "Boutee",
      type: "Fast Marketing Frontend",
      desc: "Astro + Sanity brand site with near-zero JS by default and a 100 Lighthouse performance score — proof that design-led pages can still load like you paid for the click.",
      tags: ["Astro", "Performance", "CRO foundations"],
      accent: "#ff006e",
      href: "https://www.boutee.co.uk/",
      metric: "Perf 100",
    },
    {
      title: "YummyGummies",
      type: "Conversion-Critical Routes",
      desc: "Ecommerce frontend where route speed and checkout trust matter — the same priorities as high-intent landing funnels: clear hierarchy, fast LCP, and no accidental script tax.",
      tags: ["Next.js", "LCP", "Funnel UX"],
      accent: "#f7df1e",
      metric: "LCP focused",
    },
  ],
  faqs: [
    {
      question: "What is included in landing page optimization?",
      answer:
        "Typically a diagnosis of your money URLs, a prioritized plan, implementation of agreed structural and performance fixes, form/CTA improvements, analytics verification, and before/after notes. Full visual redesign is optional when the current design can still convert with better hierarchy and speed.",
    },
    {
      question: "How is this different from a full website redesign?",
      answer:
        "Landing page optimization targets specific high-intent destinations — often ad landers — to improve conversion and speed. A full redesign replaces brand systems across many URLs. Many accounts should optimize landers before funding a site-wide visual overhaul.",
    },
    {
      question: "Do you write the copy?",
      answer:
        "I structure hierarchy and can recommend messaging changes, but primary copy ownership usually stays with your marketing team or copywriter. I collaborate tightly so layout and words reinforce each other.",
    },
    {
      question: "Can you work with Google Ads and Meta media buyers?",
      answer:
        "Yes. Message match, URL parameters, variant systems, and script freezes during tests are part of how I work with paid teams. I do not manage bids — I make the page worthy of the click.",
    },
    {
      question: "Will you guarantee a conversion rate?",
      answer:
        "No honest partner guarantees a percentage. I improve the controllable factors: clarity, speed, trust placement, form friction, and measurement. Results depend on offer, audience, and traffic quality.",
    },
    {
      question: "What should I send to start?",
      answer:
        "Top ad URLs, current conversion rate or lead volume, Figma if you have it, and whether GTM/analytics access is available. A short note on what “good” looks like for sales quality helps more than a vague “make it convert better.”",
    },
    {
      question: "Do you support A/B testing tools?",
      answer:
        "I recommend test designs and implement pages so variants are cheap to ship. Tooling choice (native CMS variants, feature flags, or third-party testers) depends on your stack and privacy constraints — I will not bolt on a heavy tester that tanks INP.",
    },
  ],
  relatedServices: [
    {
      href: "/website-performance-optimization",
      label: "Website Performance Optimization",
      desc: "Broader speed work when more than landers are failing",
    },
    {
      href: "/improve-core-web-vitals",
      label: "Improve Core Web Vitals",
      desc: "Metric-specific LCP, INP, and CLS remediation",
    },
    {
      href: "/figma-to-code-developer",
      label: "Figma to Code Developer",
      desc: "Pixel-faithful lander builds from approved design",
    },
    {
      href: "/website-redesign-or-new-site",
      label: "Website Redesign or New Website",
      desc: "When lander fixes are not enough and the site itself is the ceiling",
    },
  ],
  relatedReads: [
    {
      href: "/blog/building-landing-pages-that-convert",
      label: "Building Landing Pages That Convert",
    },
    {
      href: "/blog/google-ads-landing-pages-core-web-vitals",
      label: "Google Ads Landing Pages and Core Web Vitals",
    },
    {
      href: "/blog/b2b-lead-capture-forms-that-convert",
      label: "B2B Lead Capture Forms That Convert",
    },
    {
      href: "/blog/optimizing-core-web-vitals-modern-frontend",
      label: "Optimizing Core Web Vitals on Modern Frontends",
    },
    {
      href: "/blog/website-speed-audit-for-business-owners",
      label: "Website Speed Audit for Business Owners",
    },
    {
      href: "/blog/how-businesses-lose-customers-slow-websites",
      label: "How Businesses Lose Customers to Slow Websites",
    },
  ],
  midCtaHeading: "Ready to stop wasting paid clicks?",
  midCtaBody:
    "Send your top landing URLs, which channels feed them, and what a qualified lead looks like. I will tell you whether you need a CRO sprint, a performance pass, a new template — or a narrower fix than you expected.",
};
