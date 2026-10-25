import type { ServiceLandingConfig } from "../../lib/landing";

export const hireTypescriptDeveloper: ServiceLandingConfig = {
  slug: "hire-typescript-developer",
  keyword: "Hire TypeScript Developer",
  title: "Hire TypeScript Developer | Typed Frontends & Safer Refactors | Omprakash Tanwar",
  description:
    "Hire a TypeScript developer for production frontends, shared types, API contracts, and refactors that do not break on deploy. React, Next.js, and Astro — for startups and product teams in the US, UK, and EU.",
  tags: [
    "Hire TypeScript Developer",
    "TypeScript Developer for Hire",
    "Freelance TypeScript Developer",
    "TypeScript React Developer",
    "Frontend TypeScript Specialist",
  ],
  accent: "#3178C6",
  accentSecondary: "#00fff7",
  eyebrow: "// hire.typescript_developer()",
  h1Before: "Hire TypeScript",
  h1Accent: "Developer_",
  lead: "TypeScript is not a checkbox — it is how you stop shipping silent runtime failures. I help teams adopt or tighten TypeScript on real products: strict configs, domain types, API boundaries, and React/Next patterns that make refactors boring in the best way.",
  heroPoints: [
    "Strict, pragmatic tsconfig and ESLint rules — not type gymnastics for their own sake",
    "Shared types between UI, hooks, and API layers so contracts stay honest",
    "Incremental migration paths for JS codebases that cannot afford a six-month freeze",
  ],
  primaryCta: "Hire TypeScript Developer",
  secondaryCta: "View Typed Projects",
  badges: [
    { label: "Top Rated", sub: "Upwork", color: "#14a800" },
    { label: "Strict TS", sub: "Production", color: "#3178C6" },
    { label: "3+ Years", sub: "Typed UI", color: "#00fff7" },
    { label: "< 24h", sub: "Response", color: "#bf00ff" },
  ],
  capabilitiesTitle: "TypeScript capabilities",
  capabilitiesAccent: "that pay off in prod_",
  capabilitiesIntro:
    "Typed frontend work where correctness and velocity both matter — greenfield apps, migrations, and hardening existing React/Next code.",
  capabilities: [
    {
      id: "01",
      title: "Strict Config & Tooling",
      desc: "tsconfig, path aliases, ESLint/Prettier integration, and CI type checks so bad merges get caught before users do.",
      tags: ["tsconfig", "ESLint", "CI"],
      accent: "#3178C6",
    },
    {
      id: "02",
      title: "Domain & API Types",
      desc: "Zod/io-ts validation at boundaries, generated or hand-written API types, and discriminated unions for UI state machines.",
      tags: ["Zod", "API Contracts", "Unions"],
      accent: "#00fff7",
    },
    {
      id: "03",
      title: "React + TS Patterns",
      desc: "Generic components, hook return types, context typing, and event handlers that do not devolve into `any` at the third prop.",
      tags: ["React", "Hooks", "Generics"],
      accent: "#bf00ff",
    },
    {
      id: "04",
      title: "JS → TS Migration",
      desc: "Phased allowJs adoption, module-by-module strictness, and refactors that keep shipping while coverage climbs.",
      tags: ["Migration", "allowJs", "Refactor"],
      accent: "#f7df1e",
    },
  ],
  problemsHeading: "TypeScript problems I fix",
  problemsIntro: "Teams hire TypeScript help when types feel decorative or the compiler fights daily velocity.",
  problems: [
    {
      title: "`any` everywhere despite `strict: true`",
      desc: "Loose escapes and suppressed errors. I tighten boundaries and replace shortcuts with types that actually describe your domain.",
    },
    {
      title: "API shapes that drift from the UI",
      desc: "Backend changes break screens silently. Shared schemas and validation at the edge catch mismatches in CI, not in support tickets.",
    },
    {
      title: "Generics nobody wants to touch",
      desc: "Over-abstracted utilities with unreadable signatures. I simplify patterns so the team extends components without fear.",
    },
    {
      title: "Migration stalled at 40% coverage",
      desc: "Half-typed repos are the worst of both worlds. I plan incremental modules with clear done criteria per sprint.",
    },
  ],
  processHeading: "How I work as your TypeScript developer",
  processIntro: "Audit first, then typed delivery — whether a greenfield stack or a cautious migration on a live product.",
  process: [
    {
      num: "01",
      title: "Type health audit",
      label: "Assess",
      desc: "tsconfig review, `any` hotspots, API touchpoints, and where runtime validation is missing today.",
      color: "#3178C6",
    },
    {
      num: "02",
      title: "Typing strategy",
      label: "Plan",
      desc: "Strictness roadmap, shared type locations, and conventions for components, hooks, and server actions.",
      color: "#00fff7",
    },
    {
      num: "03",
      title: "Implement in slices",
      label: "Type",
      desc: "Vertical features with types first at boundaries — you see safer code land in PRs, not a giant theoretical RFC.",
      color: "#bf00ff",
    },
    {
      num: "04",
      title: "Document & enforce",
      label: "Sustain",
      desc: "Team notes, lint rules, and CI gates so the next hire does not undo the work in week one.",
      color: "#f7df1e",
    },
  ],
  techHeading: "TypeScript stack I ship with",
  techIntro: "Typed tooling chosen for long-lived frontends — not experimental type plugins for demo day.",
  tech: [
    { name: "TypeScript", color: "#3178C6" },
    { name: "React", color: "#61DAFB" },
    { name: "Next.js", color: "#ffffff" },
    { name: "Zod", color: "#00fff7" },
    { name: "tRPC", color: "#398CCB" },
    { name: "ESLint", color: "#4B32C3" },
    { name: "Astro", color: "#FF5D01" },
    { name: "Vitest", color: "#6E9F18" },
  ],
  reasonsHeading: "Why teams hire me for TypeScript",
  reasons: [
    "Daily TypeScript on production React, Next.js, and Astro codebases",
    "I balance strictness with shipping — types serve the product, not the other way around",
    "Clear API typing habits that reduce integration bugs with backend teams",
    "Remote-friendly async workflow with US, UK, and EU clients",
    "Top Rated Upwork profile with documented delivery milestones",
    "Honest stack advice — I will say when untyped scripts or a smaller surface area makes more sense",
  ],
  proofHeading: "Typed work in the portfolio",
  proofIntro: "Projects where TypeScript discipline shows up in architecture and maintainability.",
  proof: [
    {
      title: "GoQuant Orderbook",
      type: "Real-Time Trading UI",
      desc: "Heavily typed React orderbook with WebSocket message schemas, Redux state typing, and sub-100ms update handling without `any` escape hatches.",
      tags: ["TypeScript", "React", "WebSockets", "Redux Toolkit"],
      accent: "#00fff7",
      metric: "500+ updates/s",
    },
    {
      title: "SchoolDekho",
      type: "Discovery Platform",
      desc: "Typed React frontend with structured filter models, API response shapes, and SEO page props — built to scale past 1000 school listings.",
      tags: ["TypeScript", "React", "Node.js", "SEO"],
      accent: "#3178C6",
      href: "https://www.schooldekho.org/",
      metric: "1000+ schools",
    },
  ],
  faqs: [
    {
      question: "Do you only work in strict TypeScript from day one?",
      answer:
        "No. For brownfield apps I often start with targeted strict islands — API layers, shared hooks, critical flows — then expand. The goal is safer code without a feature freeze.",
    },
    {
      question: "Can you type an existing JavaScript React codebase?",
      answer:
        "Yes. I use incremental migration: allowJs, rename to .tsx module by module, and add validation at API boundaries first where bugs hurt most.",
    },
    {
      question: "Do you work with backend teams on shared types?",
      answer:
        "Absolutely. OpenAPI, Zod schemas, or hand-maintained shared packages — whatever fits your org. The point is one source of truth for request/response shapes.",
    },
    {
      question: "Is TypeScript worth it for a small startup MVP?",
      answer:
        "Usually yes if you expect the product to live past the demo. I keep configs lean so types help velocity rather than ceremony — and I will say when a tiny static site does not need it.",
    },
    {
      question: "How do you price TypeScript migration work?",
      answer:
        "Scoped by module or outcome: e.g. typed API layer, strict tsconfig rollout, or feature-area migration. I share estimates after a short audit of the repo and priorities.",
    },
  ],
  relatedServices: [
    { href: "/hire-react-developer", label: "Hire React Developer", desc: "Production React UI delivery" },
    { href: "/hire-nextjs-developer", label: "Hire Next.js Developer", desc: "App Router and full-stack frontends" },
    { href: "/frontend-consulting-services", label: "Frontend Consulting", desc: "Architecture audits before you build" },
    { href: "/frontend-developer-for-saas", label: "Frontend for SaaS", desc: "Typed product UI for subscription apps" },
  ],
  relatedReads: [
    { href: "/blog/typescript-patterns-for-react-projects", label: "TypeScript Patterns for React Projects" },
    { href: "/blog/how-to-structure-large-react-projects", label: "How to Structure Large React Projects" },
    { href: "/blog/designing-scalable-component-architectures-react", label: "Scalable Component Architectures in React" },
    { href: "/blog/implementing-authentication-modern-react", label: "Implementing Authentication in Modern React" },
    { href: "/blog/nextjs-app-router-best-practices", label: "Next.js App Router Best Practices" },
    { href: "/blog/frontend-security-best-practices", label: "Frontend Security Best Practices" },
  ],
  midCtaHeading: "Ready to hire a TypeScript developer?",
  midCtaBody:
    "Share your repo or a Loom walkthrough, note strictness goals, and what is breaking today. I will confirm fit and propose a typed delivery plan.",
};
