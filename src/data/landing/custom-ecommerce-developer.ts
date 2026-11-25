import type { ServiceLandingConfig } from "../../lib/landing";

export const customEcommerceDeveloper: ServiceLandingConfig = {
  slug: "custom-ecommerce-developer",
  keyword: "Custom E-Commerce & Multi-Vendor Marketplace Developer",
  title: "Custom E-Commerce & Multi-Vendor Marketplace Developer | Omprakash Tanwar",
  description:
    "Hire a full-stack engineer for custom multi-vendor marketplaces, hyperlocal e-commerce, and high-concurrency payment platforms. Next.js 15, Redis, MongoDB 2dsphere, and Stripe/Razorpay integrations for UK, EU, and US founders.",
  tags: [
    "Custom E-Commerce Developer",
    "Multi-Vendor Marketplace Developer",
    "Hire E-Commerce Full-Stack Engineer",
    "Next.js E-Commerce Developer",
    "Stripe Marketplace Developer",
    "Hyperlocal Delivery Platform",
  ],
  accent: "#10B981",
  accentSecondary: "#3B82F6",
  eyebrow: "Custom E-Commerce Engineering",
  h1Before: "Custom E-Commerce &",
  h1Accent: "Marketplace Developer",
  lead: "Outgrown Shopify's rigid templates or building a high-volume two-sided marketplace? I engineer production-grade custom e-commerce platforms with Next.js 15, Redis cart caching, geospatial radius indexing, and double-entry vendor ledgers — built for sub-second conversions and flawless financial reconciliation.",
  heroPoints: [
    "Custom multi-vendor storefronts with Next.js 15 Server Components and <0.8s LCP",
    "High-concurrency Redis cart splitting and atomic inventory reservation",
    "Stripe Connect & Razorpay Route automated vendor payouts with 100% webhook idempotency",
  ],
  primaryCta: "Discuss Your Marketplace",
  secondaryCta: "Explore Urban Nursery Case Study",
  badges: [
    { label: "Top Rated", sub: "Upwork", color: "#10B981" },
    { label: "Urban Nursery", sub: "Shipped", color: "#3B82F6" },
    { label: "99/100 CWV", sub: "Lighthouse", color: "#10B981" },
    { label: "Double-Entry", sub: "Paise-Safe", color: "#8B5CF6" },
  ],
  capabilitiesTitle: "Marketplace capabilities",
  capabilitiesAccent: "engineered for scale",
  capabilitiesIntro:
    "Full-stack architecture for founders and tech leaders building bespoke commerce models that off-the-shelf SaaS cannot support.",
  capabilities: [
    {
      id: "01",
      title: "Hyperlocal & Multi-Vendor Storefronts",
      desc: "Next.js 15 App Router storefronts with MongoDB 2dsphere geospatial filtering. Customers only browse live inventory from merchants within a precise delivery radius.",
      tags: ["Next.js 15", "MongoDB 2dsphere", "Tailwind CSS"],
      accent: "#10B981",
    },
    {
      id: "02",
      title: "Resilient Cart & Atomic Inventory",
      desc: "High-performance Redis session caching for multi-vendor carts. Split carts across independent merchants with optimistic lock inventory reservations to eliminate overselling.",
      tags: ["Redis Caching", "Session Store", "Optimistic Locking"],
      accent: "#3B82F6",
    },
    {
      id: "03",
      title: "Automated Split Payouts & Escrow Ledger",
      desc: "Stripe Connect and Razorpay Route integration. Automated commission deduction, escrow hold periods, and cent-safe double-entry ledger math for multi-party reconciliation.",
      tags: ["Stripe Connect", "Razorpay Route", "Double-Entry Ledger"],
      accent: "#8B5CF6",
    },
    {
      id: "04",
      title: "Merchant Portals & Admin Oversight Console",
      desc: "Dedicated self-serve portals for vendors to manage inventory, catalog variants, and fulfillment dispatch, coupled with an admin console for dispute arbitration.",
      tags: ["Vendor Portal", "Order Dispatch", "Analytics"],
      accent: "#F59E0B",
    },
  ],
  problemsHeading: "Complex commerce challenges I solve",
  problemsIntro:
    "When off-the-shelf platforms like Shopify or WooCommerce hit architecture ceilings, custom engineering is the only sustainable answer.",
  problems: [
    {
      title: "Shopify limits on multi-vendor cart splitting",
      desc: "Handling orders containing items from 3 different local merchants with distinct delivery windows requires a decoupled Node.js/Redis cart architecture.",
    },
    {
      title: "Inventory race conditions and overselling",
      desc: "Flash sales and simultaneous checkouts frequently cause double-booking on standard relational databases without atomic Redis reservation locks.",
    },
    {
      title: "Financial discrepancies in vendor payouts",
      desc: "Floating-point errors and delayed webhooks break vendor trust. I enforce integer-based double-entry ledger bookkeeping with full audit trails.",
    },
    {
      title: "Sluggish mobile store load times (3s+)",
      desc: "Third-party Shopify app scripts drag mobile conversion rates down. I engineer custom Astro and Next.js storefronts that load under 0.8 seconds.",
    },
  ],
  processHeading: "How we ship your custom commerce platform",
  processIntro:
    "From database schema modeling to payment gateway sandbox certification, every sprint delivers testable, production-ready code.",
  process: [
    {
      num: "01",
      title: "Commerce Architecture & Domain Modeling",
      label: "Discovery",
      desc: "Mapping vendor commission splits, delivery radius constraints, product taxonomy, and payment gateway escrow rules.",
      color: "#10B981",
    },
    {
      num: "02",
      title: "Database, Cart & Payment Core",
      label: "Engine",
      desc: "Implementing MongoDB geospatial schemas, Redis session carts, and webhook idempotency handlers with simulated failure tests.",
      color: "#3B82F6",
    },
    {
      num: "03",
      title: "Storefront & Vendor Portal UI",
      label: "Frontend",
      desc: "Pixel-perfect Next.js 15 frontend, fluid cart drawers, live location detection, and self-serve merchant fulfillment consoles.",
      color: "#8B5CF6",
    },
    {
      num: "04",
      title: "Security, CWV Audit & Production Launch",
      label: "Production",
      desc: "End-to-end payment stress testing, Core Web Vitals optimization, zero-downtime deployment, and clean TypeScript codebase handoff.",
      color: "#F59E0B",
    },
  ],
  techHeading: "Production commerce tech stack",
  techIntro:
    "Battle-tested technologies chosen for concurrency, low latency, and uncompromising financial accuracy.",
  tech: [
    { name: "Next.js 15 (App Router)", color: "#FAFAFA" },
    { name: "TypeScript", color: "#3178C6" },
    { name: "Node.js / Express", color: "#68A063" },
    { name: "MongoDB (2dsphere)", color: "#47A248" },
    { name: "Redis", color: "#DC382D" },
    { name: "Stripe Connect", color: "#635BFF" },
    { name: "Razorpay API", color: "#0C2340" },
    { name: "Tailwind CSS v4", color: "#38BDF8" },
  ],
  reasonsHeading: "Why founders partner with me for custom commerce",
  reasons: [
    "Shipped Urban Nursery — a live multi-vendor marketplace with 12km geospatial radius matching and sub-second speed.",
    "Built Boutee.co.uk — a high-converting UK bespoke jewellery marketplace on Astro + Sanity CMS with 99/100 Lighthouse score.",
    "Full CET / GMT / EST working overlap with direct Slack/Linear collaboration and daily staging preview deployments.",
    "Strict integer math (paise/cent level) across all order transactions, avoiding costly rounding bugs.",
    "Top Rated Freelancer on Upwork with 100% Job Success Score and 5-star European client testimonials.",
    "Zero-tech-debt handoff: clean modular repository, automated schema validation, and comprehensive API documentation.",
  ],
  proofHeading: "Proven e-commerce track record",
  proofIntro: "Real platforms handling real catalog inventory, live checkout sessions, and automated vendor payouts.",
  proof: [
    {
      title: "Urban Nursery Marketplace",
      type: "Hyperlocal Multi-Vendor E-Commerce",
      desc: "Next.js 15, Node/Express, MongoDB 2dsphere 12km search, Redis multi-vendor cart, Razorpay split payouts.",
      tags: ["Next.js", "Redis", "MongoDB", "Razorpay"],
      accent: "#10B981",
      href: "/work/urban-nursery",
      metric: "<0.8s LCP · 99/100 CWV",
    },
    {
      title: "Boutee London",
      type: "Bespoke Jewellery Marketplace",
      desc: "Astro v5, Sanity Headless CMS, Tailwind CSS, TypeScript. 99/100 Lighthouse performance and seamless editorial catalog.",
      tags: ["Astro", "Sanity CMS", "E-Commerce", "TypeScript"],
      accent: "#3B82F6",
      href: "/work/boutee",
      metric: "99/100 Lighthouse · 5.0★ Review",
    },
  ],
  faqs: [
    {
      question: "Why should we build custom commerce instead of using Shopify or Medusa?",
      answer:
        "Shopify is fantastic for standard single-brand DTC stores. However, if your business requires hyperlocal 12km radius vendor matching, custom multi-vendor cart splitting with separate shipping calculations, dynamic commission escrow, or zero-cookie GDPR compliance, Shopify becomes a maze of conflicting third-party apps and monthly API fees. A custom Next.js + Node + Redis architecture gives you 100% ownership, zero plugin bloat, and sub-second load times that directly increase checkout conversions.",
    },
    {
      question: "How do you handle multi-vendor checkout and split payments?",
      answer:
        "We implement payment gateway split payout architectures such as Stripe Connect (Custom/Express accounts) or Razorpay Route. When a customer pays, funds are securely captured, platform commissions are automatically retained, and merchant disbursements are held in escrow until dispatch verification, all reconciled through an immutable double-entry ledger.",
    },
    {
      question: "How do you prevent inventory overselling during high-traffic spikes?",
      answer:
        "We utilize Redis with atomic decrement operations (`DECRBY`) and optimistic locking. When a customer initiates checkout, inventory is reserved for a strict TTL window (e.g. 10 minutes). If payment succeeds, the reserve is committed to the primary database; if the session expires or is abandoned, the reservation automatically reverts to available stock.",
    },
    {
      question: "Can your architecture support mobile apps in the future?",
      answer:
        "Yes. The backend is built as a clean REST or GraphQL API with decoupled authentication (JWT / sessions in Redis). The same API powering your Next.js web storefront can seamlessly power React Native or Flutter iOS/Android mobile applications later without rewriting your business logic.",
    },
    {
      question: "How do we collaborate across European/US timezones?",
      answer:
        "I provide 40 hrs/week dedicated availability with full afternoon overlap for UK (GMT), European (CET), and US East Coast (EST) hours. Communication is async-first via Slack, Linear, and GitHub, supplemented with Loom video walkthroughs and daily preview deployments on Vercel/Render.",
    },
  ],
  relatedServices: [
    {
      label: "Hire Next.js Developer",
      href: "/hire-nextjs-developer",
      desc: "App Router, Server Components & React performance.",
    },
    {
      label: "Hire Astro Developer",
      href: "/hire-astro-developer",
      desc: "Sub-second content & headless e-commerce storefronts.",
    },
    {
      label: "Improve Core Web Vitals",
      href: "/improve-core-web-vitals",
      desc: "Fix slow LCP, INP, and CLS on money pages.",
    },
    {
      label: "Headless CMS Development",
      href: "/headless-cms-development",
      desc: "Sanity & decoupled content for modern commerce.",
    },
  ],
  relatedReads: [
    {
      label: "Urban Nursery Case Study: 12km Geospatial Multi-Vendor Architecture",
      href: "/work/urban-nursery",
    },
    {
      label: "Boutee Case Study: Astro + Sanity Bespoke UK Jewellery Marketplace",
      href: "/work/boutee",
    },
  ],
  midCtaHeading: "Ready to engineer your custom commerce platform?",
  midCtaBody:
    "Share your business model, delivery requirements, or Figma mockups. Let's build a fast, scalable commerce engine engineered for conversions.",
  defaultService: "Custom / Multi-Vendor E-Commerce",
  featuredCaseStudies: ["urban-nursery", "boutee"],
  benchmarkMetrics: [
    { label: "Ledger Integrity", value: "100%", desc: "Atomic double-entry reconciliation" },
    { label: "Spatial Latency", value: "<45ms", desc: "MongoDB 2dsphere 12km radius" },
    { label: "Storefront CWV", value: "99/100", desc: "Next.js App Router streaming" },
    { label: "Upwork Rating", value: "100% JSS", desc: "Top Rated Freelancer" },
  ],
  testimonial: {
    quote:
      "Omprakash architected our marketplace with deep technical precision. His implementation of the Redis cart caching layer, geospatial vendor radius, and payment split logic allowed us to launch smoothly without a single payment discrepancy. Highly recommended for complex commerce.",
    author: "Rishabh Sharma",
    role: "Founder & Operations Lead",
    company: "Urban Nursery",
    location: "Hyperlocal E-Commerce",
    metric: "<0.8s LCP · 100% Payout Accuracy",
  },
};
