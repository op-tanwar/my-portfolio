import type { ServiceLandingConfig } from "../../lib/landing";

export const hireNextjsDeveloper: ServiceLandingConfig = {
  slug: "hire-nextjs-developer",
  keyword: "Hire Next.js Developer",
  title: "Hire Next.js Developer | App Router, E-Commerce & SaaS | Omprakash Tanwar",
  description:
    "Hire a senior Next.js developer for App Router web apps, SaaS dashboards, and high-concurrency custom e-commerce. TypeScript, Server Components streaming, sub-second LCP, and full UK, EU, and US working overlap.",
  tags: [
    "Hire Next.js Developer",
    "Hire Next.js Freelance Engineer",
    "Next.js App Router Developer",
    "Next.js SaaS Frontend Engineer",
    "Next.js E-Commerce Developer",
    "React Next.js Architect",
  ],
  accent: "#FAFAFA",
  accentSecondary: "#10B981",
  eyebrow: "Next.js 15 Full-Stack Engineering",
  h1Before: "Hire a Senior Next.js",
  h1Accent: "Developer",
  lead: "Building a mission-critical SaaS product, high-concurrency web app, or custom e-commerce storefront? I engineer production-grade Next.js applications using TypeScript, deliberate Server vs. Client Component boundaries, Redis caching, and strict Core Web Vitals budgets — not fragile tutorial prototypes.",
  heroPoints: [
    "Next.js 15 App Router architecture: streaming SSR, parallel routes, and Server Actions where appropriate",
    "SaaS dashboards & custom commerce with clean TypeScript schemas, auth-ready flows, and Stripe integrations",
    "Strict performance discipline preventing dashboard JavaScript bundles from bleeding into marketing routes",
  ],
  primaryCta: "Book a Discovery Call",
  secondaryCta: "Explore Next.js Case Studies",
  badges: [
    { label: "Top Rated", sub: "Upwork (100% JSS)", color: "#10B981" },
    { label: "Next.js 15", sub: "App Router", color: "#FAFAFA" },
    { label: "TypeScript", sub: "Strict Typing", color: "#3178C6" },
    { label: "UK / EU / US", sub: "Timezone Overlap", color: "#3B82F6" },
  ],
  capabilitiesTitle: "Next.js engineering",
  capabilitiesAccent: "built for production",
  capabilitiesIntro:
    "Product engineering for European and US tech teams requiring senior architectural standards and predictable delivery.",
  capabilities: [
    {
      id: "01",
      title: "SaaS Dashboards & Complex App UI",
      desc: "Authenticated enterprise dashboards with modular component hierarchies, optimistic UI updates, loading skeletons, and strict TypeScript contracts that scale smoothly.",
      tags: ["App Router", "TypeScript", "React 19"],
      accent: "#10B981",
    },
    {
      id: "02",
      title: "Custom E-Commerce & Multi-Vendor Frontends",
      desc: "High-converting storefronts, dynamic cart drawers, Stripe/Razorpay integrations, and Redis session caching engineered for sub-0.8s LCP on revenue-critical routes.",
      tags: ["E-Commerce", "Stripe API", "Redis Caching"],
      accent: "#3B82F6",
    },
    {
      id: "03",
      title: "App Router Architecture & Server Components",
      desc: "Eliminating client-side hydration waterfalls by keeping data fetching in Server Components, streaming chunks to the browser, and isolating 'use client' boundaries.",
      tags: ["Server Components", "Streaming SSR", "Edge API"],
      accent: "#8B5CF6",
    },
    {
      id: "04",
      title: "Next.js Performance Audits & CWV Hardening",
      desc: "Remediating slow existing Next.js apps: bundle slicing, route-level code splitting, dynamic imports, font optimization, and INP/LCP fixes that pass Google audits.",
      tags: ["Core Web Vitals", "Bundle Slicing", "INP Optimization"],
      accent: "#F59E0B",
    },
  ],
  problemsHeading: "Next.js architectural pitfalls I eliminate",
  problemsIntro:
    "Next.js is exceptionally powerful, but easily misused. Here are the costly failure modes I fix on production teams.",
  problems: [
    {
      title: '"use client" sprayed across every component',
      desc: "Over-clienting defeats Server Component speed gains and balloons browser hydration. I redraw Server/Client boundaries around genuine interaction points.",
    },
    {
      title: "Uncontrolled data-fetching waterfalls",
      desc: "Nested client fetches causing layout jank and slow TTFB. I consolidate data access using App Router layouts, streaming suspense, and parallel fetching.",
    },
    {
      title: "Marketing routes inheriting dashboard bundle bloat",
      desc: "A public landing page should never force visitors to download 1MB of chart libraries. I enforce route-level bundle segregation.",
    },
    {
      title: "Failing mobile Core Web Vitals on high-intent pages",
      desc: "Sluggish INP and dragging LCP hurt paid conversion rates. I establish automated bundle budgets and optimize critical rendering paths.",
    },
  ],
  processHeading: "How we collaborate on your Next.js project",
  processIntro:
    "From technical architecture validation to production deployment with daily staging links and explicit milestone acceptance.",
  process: [
    {
      num: "01",
      title: "Architecture & Boundary Planning",
      label: "Discovery",
      desc: "Defining route hierarchy, Server vs. Client boundaries, auth integration (Supabase, Auth0, Clerk), and database API contracts.",
      color: "#10B981",
    },
    {
      num: "02",
      title: "Core Component & Data Pipeline Build",
      label: "Foundation",
      desc: "Implementing data layer fetching, caching rules, global layouts, and reusable design-system primitives in strict TypeScript.",
      color: "#3B82F6",
    },
    {
      num: "03",
      title: "Interactive Features & State Integration",
      label: "Execution",
      desc: "Fleshing out user interactions, forms with Zod validation, optimistic UI state, payment flows, and ongoing staging preview demos.",
      color: "#8B5CF6",
    },
    {
      num: "04",
      title: "Performance Hardening & Codebase Handoff",
      label: "Production",
      desc: "Lighthouse audits, error boundary testing, OpenGraph dynamic images, CI/CD pipeline automation, and comprehensive developer documentation.",
      color: "#F59E0B",
    },
  ],
  techHeading: "Production Next.js technologies",
  techIntro: "Modern App Router ecosystem tools chosen for enterprise velocity and stability.",
  tech: [
    { name: "Next.js 15", color: "#FAFAFA" },
    { name: "React 19", color: "#61DAFB" },
    { name: "TypeScript", color: "#3178C6" },
    { name: "Tailwind CSS v4", color: "#38BDF8" },
    { name: "Server Components", color: "#10B981" },
    { name: "Redis", color: "#DC382D" },
    { name: "Stripe Connect", color: "#635BFF" },
    { name: "MongoDB / PostgreSQL", color: "#47A248" },
  ],
  reasonsHeading: "Why European and US teams hire me for Next.js",
  reasons: [
    "Shipped Urban Nursery — a production Next.js 15 marketplace with sub-0.8s LCP and atomic Redis cart management.",
    "Engineered GoQuant Orderbook — real-time WebSocket orderbook in React/TypeScript with sub-100ms update latency.",
    "Strict TypeScript discipline with zero 'any' escapes and fully self-documenting interface definitions.",
    "Full CET / GMT / EST working overlap with direct Slack/Linear integration and daily async progress reports.",
    "Top Rated on Upwork with 100% Job Success Score and 5-star verified client feedback.",
    "Committed to clean architecture: no messy workarounds or hidden tech debt left behind.",
  ],
  proofHeading: "Verified Next.js case studies",
  proofIntro: "Real platforms handling production workloads, complex state, and mission-critical transactions.",
  proof: [
    {
      title: "Urban Nursery Marketplace",
      type: "Hyperlocal Multi-Vendor E-Commerce",
      desc: "Next.js 15 App Router, Node/Express, MongoDB 2dsphere, Redis cart caching, and Razorpay automated split disbursements.",
      tags: ["Next.js 15", "Redis", "MongoDB", "Razorpay"],
      accent: "#10B981",
      href: "/work/urban-nursery",
      metric: "<0.8s LCP · 99/100 CWV",
    },
    {
      title: "GoQuant Crypto Orderbook",
      type: "Real-Time Trading Interface",
      desc: "High-frequency React/TypeScript orderbook with bi-directional WebSocket streams, sub-100ms rendering, and Redux Toolkit state.",
      tags: ["React", "WebSockets", "TypeScript", "Redux"],
      accent: "#3B82F6",
      href: "/work/goquant-orderbook",
      metric: "<100ms Latency · 60 FPS",
    },
  ],
  faqs: [
    {
      question: "Should we build our marketing site on Next.js or Astro?",
      answer:
        "If your marketing website shares design tokens, interactive components, or user session state with your main SaaS app, Next.js provides excellent developer velocity. However, if your marketing site is predominantly static content, blogs, or lead generation, Astro is often superior because it ships zero client JavaScript by default. Many teams deploy Astro on www.company.com and Next.js on app.company.com.",
    },
    {
      question: "Do you have production experience with the Next.js 15 App Router?",
      answer:
        "Yes. All my recent production applications utilize Next.js 15 App Router with async Request APIs, Server Components streaming, Server Actions with Zod validation, and fine-grained revalidation policies (`revalidateTag`, `revalidatePath`).",
    },
    {
      question: "Can you take over and refactor an existing Next.js codebase?",
      answer:
        "Yes. I frequently step into existing Next.js codebases to resolve performance bottlenecks, eliminate hydration errors, migrate legacy Pages Router pages to App Router, and clean up technical debt without requiring a risky total rewrite.",
    },
    {
      question: "How do you handle backend integrations and payment gateways?",
      answer:
        "I build full-stack integrations using Stripe (Checkout, Elements, Connect), Razorpay, Supabase, Node/Express APIs, MongoDB, and PostgreSQL. Every webhook endpoint is built with strict signature verification, idempotency tracking, and transaction safety.",
    },
    {
      question: "How do we coordinate across European and US timezones?",
      answer:
        "I provide 40 hrs/week dedicated availability with full afternoon overlap for London (GMT), Berlin/Zurich (CET), and New York (EST). Communication is conducted directly in your Slack or Linear workspace, backed by daily Loom video walkthroughs and staging deployments on Vercel.",
    },
  ],
  relatedServices: [
    {
      href: "/hire-react-developer",
      label: "Hire React Developer",
      desc: "Component systems, complex UIs & real-time frontends.",
    },
    {
      href: "/custom-ecommerce-developer",
      label: "Custom E-Commerce Developer",
      desc: "Multi-vendor marketplaces & high-concurrency commerce.",
    },
    {
      href: "/hire-astro-developer",
      label: "Hire Astro Developer",
      desc: "HTML-first marketing sites & Sanity CMS integrations.",
    },
    {
      href: "/frontend-developer-for-saas",
      label: "Frontend Developer for SaaS",
      desc: "High-converting web applications & onboarding flows.",
    },
  ],
  relatedReads: [
    { href: "/work/urban-nursery", label: "Urban Nursery Case Study: Next.js 15 App Router" },
    { href: "/work/goquant-orderbook", label: "GoQuant Case Study: High-Frequency WebSockets" },
    { href: "/blog/nextjs-app-router-best-practices", label: "Next.js App Router Best Practices" },
    { href: "/blog/nextjs-performance-optimization", label: "Next.js Performance Optimization" },
    { href: "/blog/server-components-vs-client-components-nextjs", label: "Server vs Client Components in Next.js" },
  ],
  midCtaHeading: "Ready to hire a senior Next.js developer?",
  midCtaBody:
    "Share your Figma mockups, current GitHub repository, or sprint requirements. I will review your architecture and provide an actionable proposal within 24 hours.",
  defaultService: "Next.js / React App",
  featuredCaseStudies: ["urban-nursery", "goquant-orderbook"],
  benchmarkMetrics: [
    { label: "Core Web Vitals", value: "99/100", desc: "Next.js 15 App Router" },
    { label: "LCP Benchmark", value: "<0.8s", desc: "Streaming Server Components" },
    { label: "Client Satisfaction", value: "100%", desc: "Upwork Job Success Score" },
    { label: "Working Overlap", value: "CET / GMT", desc: "Direct Slack & Linear" },
  ],
  testimonial: {
    quote:
      "Omprakash architected our Next.js App Router platform with phenomenal engineering discipline. His mastery of Server Components, Redis caching, and API routing delivered sub-second load times and zero production regressions. A true senior full-stack engineer.",
    author: "Rishabh Sharma",
    role: "Founder & Product Lead",
    company: "Urban Nursery",
    location: "Global E-Commerce",
    metric: "<0.8s LCP · 100% Milestone Delivery",
  },
};
