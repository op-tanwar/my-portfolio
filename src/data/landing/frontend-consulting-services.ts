import type { ServiceLandingConfig } from "../../lib/landing";

export const frontendConsultingServices: ServiceLandingConfig = {
  slug: "frontend-consulting-services",
  keyword: "Frontend Consulting Services",
  title: "Frontend Consulting Services | Audits, Architecture & Stack Advice | Omprakash Tanwar",
  description:
    "Frontend consulting services for founders and product leads — stack selection, architecture reviews, performance audits, and build-vs-buy guidance. Expert advice before you commit to a full build or hire the wrong framework.",
  tags: [
    "Frontend Consulting Services",
    "Frontend Architecture Consultant",
    "Website Technical Audit",
    "Frontend Stack Consultant",
    "UI Architecture Review",
  ],
  accent: "#bf00ff",
  accentSecondary: "#00fff7",
  eyebrow: "// frontend.consulting_services()",
  h1Before: "Frontend Consulting",
  h1Accent: "Services_",
  lead: "Not every problem needs a six-month build contract. Sometimes you need a senior frontend opinion — which framework, what to fix first, whether your agency quote is sane, or how to unblock the team before the next funding milestone. That is what consulting is for.",
  heroPoints: [
    "Stack and architecture guidance — Astro vs Next vs React SPA with reasons, not hype",
    "Actionable audits: performance, security surface, component debt, and CMS fit",
    "Founder-friendly deliverables — prioritized roadmap, not a 80-slide deck nobody reads",
  ],
  primaryCta: "Book Consulting Call",
  secondaryCta: "See Audit Examples",
  badges: [
    { label: "Audits", sub: "Actionable", color: "#00fff7" },
    { label: "Top Rated", sub: "Upwork", color: "#14a800" },
    { label: "No fluff", sub: "Reports", color: "#bf00ff" },
    { label: "< 24h", sub: "Response", color: "#f7df1e" },
  ],
  capabilitiesTitle: "Consulting offerings",
  capabilitiesAccent: "advice before the build_",
  capabilitiesIntro:
    "Short engagements with clear outputs — so you make better decisions before signing a large development SOW.",
  capabilities: [
    {
      id: "01",
      title: "Stack Selection Workshop",
      desc: "Astro, Next.js, React, or something smaller? We map SEO needs, editor workflows, app depth, and team skills to a recommendation you can defend to investors.",
      tags: ["Astro", "Next.js", "Strategy"],
      accent: "#bf00ff",
    },
    {
      id: "02",
      title: "Architecture Review",
      desc: "Folder structure, state boundaries, design system maturity, and API coupling — with a prioritized refactor list ranked by risk vs reward.",
      tags: ["Architecture", "Debt", "Roadmap"],
      accent: "#00fff7",
    },
    {
      id: "03",
      title: "Performance & CWV Audit",
      desc: "Lighthouse, field data, bundle analysis, and third-party script review — fixes grouped into quick wins vs structural work.",
      tags: ["LCP", "INP", "Bundles"],
      accent: "#f7df1e",
    },
    {
      id: "04",
      title: "Vendor & Agency Brief Review",
      desc: "Second opinion on proposals, timelines, and technical scope before you sign — especially when you are non-technical and the jargon is thick.",
      tags: ["Brief", "Scope", "RFP"],
      accent: "#38BDF8",
    },
  ],
  problemsHeading: "When consulting beats hiring a builder",
  problemsIntro: "Founders and leads book consulting when the path forward is unclear or expensive guesses are on the table.",
  problems: [
    {
      title: "Framework paralysis",
      desc: "Twitter says Next, your dev says Remix, marketing wants Webflow. I cut through noise with criteria tied to your actual product.",
    },
    {
      title: "Slow site, unclear owner",
      desc: "Agencies blame hosting, devs blame design assets. An audit assigns fixes to layers with effort estimates.",
    },
    {
      title: "Rewrite vs refactor decision",
      desc: "I quantify tech debt and migration risk so you do not torch a workable codebase — or pretend patches will fix a dead stack.",
    },
    {
      title: "Hiring before the role is defined",
      desc: "Job posts that ask for 'React ninja' attract mismatches. I help define the first 90 days and interview signals.",
    },
  ],
  processHeading: "How consulting engagements run",
  processIntro: "Tight scopes, written outputs, optional follow-on implementation only if you want it.",
  process: [
    {
      num: "01",
      title: "Discovery call",
      label: "Frame",
      desc: "Goals, constraints, access needs, and which decisions must be unblocked this month.",
      color: "#bf00ff",
    },
    {
      num: "02",
      title: "Access & review",
      label: "Analyze",
      desc: "Repo, analytics, Search Console, Figma, or vendor docs — whatever matches the engagement type.",
      color: "#00fff7",
    },
    {
      num: "03",
      title: "Findings delivery",
      label: "Report",
      desc: "Written summary with prioritized actions, effort bands, and what to ignore for now.",
      color: "#f7df1e",
    },
    {
      num: "04",
      title: "Working session",
      label: "Align",
      desc: "60–90 minute walkthrough with your team — Q&A, tradeoffs, and optional implementation quote.",
      color: "#38BDF8",
    },
  ],
  techHeading: "Stacks I advise on daily",
  techIntro: "Breadth from production work — recommendations grounded in what I actually ship.",
  tech: [
    { name: "Astro", color: "#FF5D01" },
    { name: "Next.js", color: "#ffffff" },
    { name: "React", color: "#61DAFB" },
    { name: "TypeScript", color: "#3178C6" },
    { name: "Sanity", color: "#F03E2F" },
    { name: "Tailwind CSS", color: "#38BDF8" },
    { name: "Vercel", color: "#ffffff" },
    { name: "Web Vitals", color: "#00fff7" },
  ],
  reasonsHeading: "Why clients hire me for consulting",
  reasons: [
    "Production builder background — advice is not academic; I know implementation cost",
    "I will tell you not to hire me for a full build when consulting is enough",
    "Clear written deliverables your CTO, agency, or cofounder can act on",
    "Experience with US, UK, and EU startups and marketing-led orgs",
    "Top Rated track record — same rigor on small advisory scopes",
    "Optional handoff to implementation engagements without sales pressure",
  ],
  proofHeading: "Problems consulting unlocks",
  proofIntro: "Representative systems I review — the same patterns that show up in audit engagements.",
  proof: [
    {
      title: "GoQuant Orderbook",
      type: "Real-Time Architecture",
      desc: "High-frequency React UI — consulting clients with live data products learn from patterns like WebSocket schemas, render budgeting, and state isolation used here.",
      tags: ["React", "Architecture", "WebSockets", "Performance"],
      accent: "#bf00ff",
      metric: "Real-time patterns",
    },
    {
      title: "This Portfolio",
      type: "Stack Reference",
      desc: "Astro + TypeScript marketing site — a concrete example when consulting clients debate whether they need Next.js complexity or a lean content stack.",
      tags: ["Astro", "Consulting", "SEO", "Performance"],
      accent: "#00fff7",
      href: "/",
      metric: "Lean stack",
    },
  ],
  faqs: [
    {
      question: "Is consulting just a sales funnel for development work?",
      answer:
        "No. Many engagements end with a report and your team executes. I offer implementation only when you want continuity — never as a requirement.",
    },
    {
      question: "What do I get in a performance audit?",
      answer:
        "Prioritized findings: LCP/INP drivers, bundle and image issues, third-party scripts, and caching gaps — with effort estimates and what to defer.",
    },
    {
      question: "Can you consult if we already have an agency?",
      answer:
        "Yes. Second opinions on scope, acceptance criteria, and technical reviews are common. I stay constructive — the goal is your outcome, not agency drama.",
    },
    {
      question: "How long does a typical consulting engagement take?",
      answer:
        "Stack workshops often fit in 1–2 weeks with async prep. Deeper architecture reviews may take 2–4 weeks depending on repo size and stakeholder count.",
    },
    {
      question: "Do you sign NDAs for consulting?",
      answer:
        "Yes. Audits often touch unreleased product plans and vendor contracts. Standard NDAs are fine.",
    },
  ],
  relatedServices: [
    { href: "/website-performance-optimization", label: "Performance Optimization", desc: "Hands-on speed fixes after the audit" },
    { href: "/website-redesign-or-new-site", label: "Redesign or New Website", desc: "When the decision is rebuild vs refresh" },
    { href: "/ai-website-optimization", label: "AI Website Optimization", desc: "Schema, entities, and AI-ready structure" },
    { href: "/hire-astro-developer", label: "Hire Astro Developer", desc: "Lean marketing stack implementation" },
  ],
  relatedReads: [
    { href: "/blog/choosing-frontend-stack-for-your-business", label: "Choosing a Frontend Stack for Your Business" },
    { href: "/blog/how-to-brief-frontend-developer-website-project", label: "How to Brief a Frontend Developer" },
    { href: "/blog/astro-vs-nextjs-which-to-choose-2026", label: "Astro vs Next.js — Which to Choose" },
    { href: "/blog/website-speed-audit-for-business-owners", label: "Website Speed Audit for Business Owners" },
    { href: "/blog/designing-scalable-component-architectures-react", label: "Scalable Component Architectures in React" },
    { href: "/blog/when-to-hire-frontend-developer-vs-page-builder", label: "Hire a Developer vs Page Builder" },
  ],
  midCtaHeading: "Need frontend clarity before you build?",
  midCtaBody:
    "Describe the decision you are stuck on — stack, audit, or agency scope. I will suggest a consulting format, timeline, and fixed fee range.",
};
