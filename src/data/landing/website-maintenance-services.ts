import type { ServiceLandingConfig } from "../../lib/landing";

export const websiteMaintenanceServices: ServiceLandingConfig = {
  slug: "website-maintenance-services",
  keyword: "Website Maintenance Services",
  title: "Website Maintenance Services | Updates, Security & Performance | Omprakash Tanwar",
  description:
    "Website maintenance services for React, Next.js, and Astro sites — dependency updates, bug fixes, performance monitoring, and security patches. Reliable retainer support for businesses in the US, UK, and EU.",
  tags: [
    "Website Maintenance Services",
    "Website Maintenance Developer",
    "Frontend Maintenance Retainer",
    "React Website Maintenance",
    "Astro Site Maintenance",
  ],
  accent: "#f7df1e",
  accentSecondary: "#38BDF8",
  eyebrow: "// website.maintenance_services()",
  h1Before: "Website Maintenance",
  h1Accent: "Services_",
  lead: "Launch day is not finish line. I keep production frontends healthy — dependency updates without surprise breakages, bug fixes that actually ship, performance regressions caught early, and a clear channel when something breaks on a Tuesday night.",
  heroPoints: [
    "Structured monthly maintenance: updates, patches, smoke tests, and changelog you can forward to stakeholders",
    "React, Next.js, and Astro codebases — not generic WordPress plugin babysitting",
    "Performance and security hygiene so Core Web Vitals and npm advisories do not become emergencies",
  ],
  primaryCta: "Start Maintenance Plan",
  secondaryCta: "View Maintained Sites",
  badges: [
    { label: "Retainer", sub: "Friendly", color: "#14a800" },
    { label: "Security", sub: "npm audit", color: "#bf00ff" },
    { label: "CWV", sub: "Monitored", color: "#38BDF8" },
    { label: "< 24h", sub: "Response", color: "#00fff7" },
  ],
  capabilitiesTitle: "Maintenance capabilities",
  capabilitiesAccent: "beyond break-fix tickets_",
  capabilitiesIntro:
    "Proactive frontend care for sites that matter to revenue — not a ticket queue that ignores root causes.",
  capabilities: [
    {
      id: "01",
      title: "Dependency & Framework Updates",
      desc: "Scheduled React, Next, Astro, and Tailwind upgrades with test passes — fewer 'we cannot update because last time prod broke' years.",
      tags: ["npm", "Upgrades", "CI"],
      accent: "#f7df1e",
    },
    {
      id: "02",
      title: "Bug Fixes & Small Features",
      desc: "Production defects, CMS edge cases, and minor UI improvements within retainer hours — scoped so scope creep stays visible.",
      tags: ["Bugs", "CMS", "UI fixes"],
      accent: "#38BDF8",
    },
    {
      id: "03",
      title: "Performance Monitoring",
      desc: "Lighthouse checks, bundle drift alerts, and INP/LCP investigations before Google Search Console complains.",
      tags: ["LCP", "INP", "Bundles"],
      accent: "#00fff7",
    },
    {
      id: "04",
      title: "Security Hygiene",
      desc: "Dependency advisories, headers review, and auth surface checks on apps that handle user data.",
      tags: ["CVE", "Headers", "Auth"],
      accent: "#bf00ff",
    },
  ],
  problemsHeading: "Why sites need maintenance",
  problemsIntro: "Neglected frontends slow down, break quietly, and become expensive rewrite candidates.",
  problems: [
    {
      title: "Framework versions stuck three majors behind",
      desc: "I plan incremental upgrades with rollback paths so security patches are not a annual crisis project.",
    },
    {
      title: "Nobody owns the bug backlog",
      desc: "A retainer gives you a named frontend owner who triages, fixes, and documents — not rotating freelancers.",
    },
    {
      title: "Performance degraded since launch",
      desc: "New scripts, images, and third-party tags accumulate. Regular audits catch regressions before conversion drops show up in analytics.",
    },
    {
      title: "CMS edits break layouts",
      desc: "Content teams push edge cases. I harden templates and fix portable text or component gaps without blaming editors.",
    },
  ],
  processHeading: "How maintenance retainers work",
  processIntro: "Predictable rhythm — monthly care plus defined response for urgent production issues.",
  process: [
    {
      num: "01",
      title: "Site health audit",
      label: "Baseline",
      desc: "Repo access, hosting map, dependency age, open bugs, and monitoring gaps documented in a one-page status.",
      color: "#f7df1e",
    },
    {
      num: "02",
      title: "Retainer plan",
      label: "Agree",
      desc: "Hours, SLAs, included work types, and escalation path for out-of-scope builds.",
      color: "#38BDF8",
    },
    {
      num: "03",
      title: "Monthly cadence",
      label: "Maintain",
      desc: "Updates, fixes, performance snapshot, and short report your team can skim in five minutes.",
      color: "#00fff7",
    },
    {
      num: "04",
      title: "Quarterly review",
      label: "Improve",
      desc: "Tech debt priorities, upgrade roadmap, and honest signal if the site needs redesign vs more patches.",
      color: "#bf00ff",
    },
  ],
  techHeading: "Stacks I maintain",
  techIntro: "Modern JavaScript frontends — where maintenance means real engineering, not cPanel clicks.",
  tech: [
    { name: "React", color: "#61DAFB" },
    { name: "Next.js", color: "#ffffff" },
    { name: "Astro", color: "#FF5D01" },
    { name: "TypeScript", color: "#3178C6" },
    { name: "Tailwind CSS", color: "#38BDF8" },
    { name: "Sanity", color: "#F03E2F" },
    { name: "Vercel", color: "#ffffff" },
    { name: "GitHub Actions", color: "#ffffff" },
  ],
  reasonsHeading: "Why teams retain me for maintenance",
  reasons: [
    "I built and still understand the architectures I maintain — context is not lost each ticket",
    "Honest reporting: I flag when patches are masking a redesign need",
    "Security and performance treated as recurring work, not annual panic",
    "Async-friendly for US, UK, and EU businesses with documented handoffs",
    "Top Rated Upwork delivery habits — clear hours, no mystery invoices",
    "I escalate to project work when fixes exceed retainer — no silent scope expansion",
  ],
  proofHeading: "Sites that benefit from ongoing care",
  proofIntro: "Long-lived properties where maintenance discipline keeps revenue pages fast and stable.",
  proof: [
    {
      title: "SchoolDekho",
      type: "Discovery Platform",
      desc: "React platform with dynamic listings and SEO pages — the kind of product surface that needs ongoing fixes, dependency care, and performance checks as data grows.",
      tags: ["React", "Maintenance", "SEO", "Node.js"],
      accent: "#38BDF8",
      href: "https://www.schooldekho.org/",
      metric: "1000+ schools",
    },
    {
      title: "Boutee",
      type: "Ecommerce Storefront",
      desc: "Astro + Sanity ecommerce where seasonal campaigns, CMS updates, and frontend dependencies require steady hands after launch.",
      tags: ["Astro", "Sanity", "Ecommerce", "Updates"],
      accent: "#f7df1e",
      href: "https://www.boutee.co.uk/",
      metric: "Live commerce",
    },
  ],
  faqs: [
    {
      question: "What is included in a website maintenance retainer?",
      answer:
        "Typically dependency updates, bug fixes within agreed hours, small content-template fixes, performance snapshots, and security advisory response. New features and redesigns are quoted separately.",
    },
    {
      question: "Do you maintain WordPress sites?",
      answer:
        "My focus is modern JS frontends — React, Next.js, Astro, and headless setups. For WordPress-heavy stacks I may recommend a specialist or a migration path.",
    },
    {
      question: "How fast do you respond to production outages?",
      answer:
        "Retainer SLAs define urgent response — often same-business-day for critical breakage, with honest limits on nights and holidays unless premium on-call is agreed.",
    },
    {
      question: "Can you maintain a site you did not build?",
      answer:
        "Yes, after an onboarding audit. I need repo access, staging, and a walkthrough. The first month often includes stabilization before aggressive upgrades.",
    },
    {
      question: "When should we switch from maintenance to a redesign?",
      answer:
        "When fixes cost more than incremental value — outdated UX, unmaintainable CSS, or framework dead-ends. I tell you plainly in quarterly reviews rather than patching forever.",
    },
  ],
  relatedServices: [
    { href: "/website-performance-optimization", label: "Performance Optimization", desc: "Deep speed improvement passes" },
    { href: "/improve-core-web-vitals", label: "Improve Core Web Vitals", desc: "Targeted CWV remediation" },
    { href: "/fix-slow-website", label: "Fix Slow Website", desc: "Emergency performance triage" },
    { href: "/frontend-consulting-services", label: "Frontend Consulting", desc: "Architecture review before big fixes" },
  ],
  relatedReads: [
    { href: "/blog/maintaining-frontend-codebases-long-term", label: "Maintaining Frontend Codebases Long Term" },
    { href: "/blog/do-you-need-frontend-developer-retainer", label: "Do You Need a Frontend Developer Retainer?" },
    { href: "/blog/frontend-security-best-practices", label: "Frontend Security Best Practices" },
    { href: "/blog/javascript-performance-best-practices", label: "JavaScript Performance Best Practices" },
    { href: "/blog/common-frontend-mistakes-hurt-website-performance", label: "Frontend Mistakes That Hurt Performance" },
    { href: "/blog/freelance-frontend-development-lessons", label: "Freelance Frontend Development Lessons" },
  ],
  midCtaHeading: "Need reliable website maintenance?",
  midCtaBody:
    "Share your stack, current pain (bugs, speed, updates), and monthly budget range. I will propose a retainer tier or honest project alternative.",
};
