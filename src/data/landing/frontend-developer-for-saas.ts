import type { ServiceLandingConfig } from "../../lib/landing";

export const frontendDeveloperForSaas: ServiceLandingConfig = {
  slug: "frontend-developer-for-saas",
  keyword: "Frontend Developer for SaaS",
  title: "Frontend Developer for SaaS | Product UI, Auth & Billing | Omprakash Tanwar",
  description:
    "Frontend developer for SaaS startups — onboarding flows, authenticated dashboards, Stripe billing UI, and marketing sites that convert. React, Next.js, and TypeScript for founders in the US, UK, and EU.",
  tags: [
    "Frontend Developer for SaaS",
    "SaaS UI Developer",
    "SaaS Frontend Engineer",
    "React SaaS Developer",
    "Next.js SaaS Developer",
  ],
  accent: "#00fff7",
  accentSecondary: "#61DAFB",
  eyebrow: "// frontend.developer_for_saas()",
  h1Before: "Frontend Developer",
  h1Accent: "for SaaS_",
  lead: "SaaS frontend is half product UI, half trust signal. I build the screens users live in — auth, settings, billing, empty states — plus the marketing pages that get them to sign up, with TypeScript discipline and performance that survives your first enterprise pilot.",
  heroPoints: [
    "Authenticated product UI: onboarding, dashboards, settings, and role-aware views",
    "Stripe checkout, portals, and plan-change flows wired without leaking edge cases",
    "Marketing + app cohesion in Next.js — one design language from landing page to logged-in home",
  ],
  primaryCta: "Hire for SaaS UI",
  secondaryCta: "View SaaS-Relevant Work",
  badges: [
    { label: "SaaS UI", sub: "Product", color: "#00fff7" },
    { label: "Stripe", sub: "Billing UI", color: "#635BFF" },
    { label: "Auth", sub: "Modern", color: "#61DAFB" },
    { label: "< 24h", sub: "Response", color: "#bf00ff" },
  ],
  capabilitiesTitle: "SaaS frontend capabilities",
  capabilitiesAccent: "from signup to subscription_",
  capabilitiesIntro:
    "Product-minded frontend for subscription businesses — not brochure sites with a login button bolted on.",
  capabilities: [
    {
      id: "01",
      title: "Onboarding & Activation UI",
      desc: "Multi-step setup, checklist dashboards, and progressive disclosure that reduce time-to-value without overwhelming new tenants.",
      tags: ["Onboarding", "UX", "Empty states"],
      accent: "#00fff7",
    },
    {
      id: "02",
      title: "Auth & Session UX",
      desc: "Login, SSO hooks, magic links, and session handling with clear error states — security-conscious without feeling enterprise-stiff.",
      tags: ["Auth", "Sessions", "SSO"],
      accent: "#61DAFB",
    },
    {
      id: "03",
      title: "Billing & Plan Management",
      desc: "Stripe Checkout, customer portal integration, upgrade/downgrade flows, and usage meters when pricing is not flat-rate.",
      tags: ["Stripe", "Billing", "Plans"],
      accent: "#635BFF",
    },
    {
      id: "04",
      title: "SaaS Marketing Pages",
      desc: "Pricing, comparisons, docs-style layouts, and changelog pages in Next.js — fast, SEO-aware, and aligned with in-app UI.",
      tags: ["Next.js", "SEO", "Pricing"],
      accent: "#bf00ff",
    },
  ],
  problemsHeading: "SaaS UI problems I solve",
  problemsIntro: "Founders hire SaaS frontend help when the MVP login works but the product does not feel shippable.",
  problems: [
    {
      title: "Onboarding that loses users on step two",
      desc: "I design flows with save-and-resume, sane defaults, and instrumentation-friendly steps so you can measure drop-off.",
    },
    {
      title: "Billing edge cases exposed in production",
      desc: "Failed payments, proration surprises, and portal links that 404. I implement Stripe paths with UI that explains what happened.",
    },
    {
      title: "Marketing site disconnected from product",
      desc: "Different fonts, colors, and tone erode trust. Unified tokens and shared components across marketing and app shells.",
    },
    {
      title: "Dashboards that buckle with real data",
      desc: "Tables, filters, and charts that stay usable at scale — virtualization and loading patterns from real-time product experience.",
    },
  ],
  processHeading: "How SaaS frontend projects run",
  processIntro: "Outcome-led milestones tied to activation, conversion, or retention — not arbitrary page counts.",
  process: [
    {
      num: "01",
      title: "JTBD & funnel mapping",
      label: "Discover",
      desc: "Signup → activation → paid conversion. We align UI milestones with metrics you already track.",
      color: "#00fff7",
    },
    {
      num: "02",
      title: "Design system slice",
      label: "Foundation",
      desc: "Core components, auth layouts, and marketing primitives shared across app and public pages.",
      color: "#61DAFB",
    },
    {
      num: "03",
      title: "Vertical feature shipping",
      label: "Build",
      desc: "End-to-end slices — e.g. onboarding v1 with analytics hooks — demoable each sprint.",
      color: "#bf00ff",
    },
    {
      num: "04",
      title: "Harden for scale",
      label: "Polish",
      desc: "Error boundaries, perf pass on data views, handoff docs, and warranty on agreed defects.",
      color: "#f7df1e",
    },
  ],
  techHeading: "SaaS frontend stack",
  techIntro: "Production defaults for subscription products — integratable with your backend of choice.",
  tech: [
    { name: "React", color: "#61DAFB" },
    { name: "Next.js", color: "#ffffff" },
    { name: "TypeScript", color: "#3178C6" },
    { name: "Stripe", color: "#635BFF" },
    { name: "Tailwind CSS", color: "#38BDF8" },
    { name: "Radix UI", color: "#00fff7" },
    { name: "TanStack Query", color: "#FF4154" },
    { name: "Vercel", color: "#ffffff" },
  ],
  reasonsHeading: "Why SaaS founders hire me",
  reasons: [
    "Product UI experience including real-time data views and complex tables",
    "I ship billing and auth flows that survive edge cases — not happy-path demos",
    "Marketing + app frontend in one engagement when you want cohesive brand execution",
    "Remote collaboration with US, UK, and EU SaaS teams — async-friendly",
    "Top Rated Upwork delivery with milestone demos investors can click",
    "I say when you need backend help or a dedicated design partner — scope stays honest",
  ],
  proofHeading: "SaaS-relevant portfolio work",
  proofIntro: "Projects demonstrating product UI depth, data density, and production rigor.",
  proof: [
    {
      title: "GoQuant Orderbook",
      type: "Data-Dense Product UI",
      desc: "Real-time trading interface with sub-100ms updates, complex tables, and state sync — the same UI challenges SaaS dashboards face at scale.",
      tags: ["React", "Real-time", "TypeScript", "Product UI"],
      accent: "#00fff7",
      metric: "500+ updates/s",
    },
    {
      title: "SchoolDekho",
      type: "Multi-Role Platform",
      desc: "Discovery product with search, filters, admin listings, and SEO landing pages — parallel to SaaS needs for public marketing plus logged-in experiences.",
      tags: ["React", "SaaS patterns", "Admin UI", "SEO"],
      accent: "#61DAFB",
      href: "https://www.schooldekho.org/",
      metric: "1000+ listings",
    },
  ],
  faqs: [
    {
      question: "Do you build backend APIs for SaaS too?",
      answer:
        "My focus is frontend — React/Next UI, auth integration, Stripe client flows. I collaborate with your backend team or recommend partners when API work is the bottleneck.",
    },
    {
      question: "Can you work on just our marketing site while another dev owns the app?",
      answer:
        "Yes, though I often recommend shared design tokens early to avoid drift. Split ownership works with clear component boundaries.",
    },
    {
      question: "Which auth providers do you integrate?",
      answer:
        "Clerk, Auth0, Supabase Auth, NextAuth, and custom JWT flows — depending on your threat model and team preferences.",
    },
    {
      question: "How do you approach Stripe billing UI?",
      answer:
        "Checkout for conversion, Customer Portal for self-serve, and in-app plan management when you need custom UX — always with webhooks owned by backend, UI reflecting truth.",
    },
    {
      question: "What should a SaaS founder prepare before hiring?",
      answer:
        "User roles, pricing model, activation metric, Figma or wireframes, and API docs or mocks. A one-page PRD beats a vague 'build our SaaS' brief.",
    },
  ],
  relatedServices: [
    { href: "/hire-nextjs-developer", label: "Hire Next.js Developer", desc: "Full-stack-friendly SaaS marketing + app" },
    { href: "/hire-react-developer", label: "Hire React Developer", desc: "Product UI and component systems" },
    { href: "/hire-typescript-developer", label: "Hire TypeScript Developer", desc: "Typed SaaS codebases" },
    { href: "/frontend-developer-for-startups", label: "Frontend for Startups", desc: "Early-stage product delivery" },
  ],
  relatedReads: [
    { href: "/blog/nextjs-for-saas-marketing-sites-founders-guide", label: "Next.js for SaaS Marketing Sites" },
    { href: "/blog/implementing-authentication-modern-react", label: "Implementing Authentication in Modern React" },
    { href: "/blog/stripe-payments-react-production-guide", label: "Stripe Payments in React — Production Guide" },
    { href: "/blog/building-real-time-features-react-websockets", label: "Building Real-Time Features with WebSockets" },
    { href: "/blog/nextjs-app-router-best-practices", label: "Next.js App Router Best Practices" },
    { href: "/blog/server-components-vs-client-components-nextjs", label: "Server vs Client Components in Next.js" },
  ],
  midCtaHeading: "Building a SaaS and need frontend depth?",
  midCtaBody:
    "Share your stage, activation goal, and stack. I will confirm fit and outline milestones for product UI, billing, or marketing — or both.",
};
