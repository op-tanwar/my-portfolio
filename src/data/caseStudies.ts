export interface CaseStudyMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ArchitectureCard {
  title: string;
  badge: string;
  description: string;
  points: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  category: string;
  clientRegion: string;
  clientStatus: string;
  role: string;
  timeline: string;
  coreStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  displayUrl: string;
  seoTitle: string;
  seoDescription: string;
  impactMetrics: CaseStudyMetric[];
  executiveSummary: string;
  deliverables: string[];
  challenge: {
    headline: string;
    points: { title: string; description: string }[];
  };
  architecture: {
    overview: string;
    decisions: ArchitectureCard[];
  };
  features: {
    title: string;
    description: string;
    tag: string;
  }[];
  outcomes: {
    metricsSummary: string;
    quote?: {
      author: string;
      role: string;
      company: string;
      text: string;
      verified: string;
    };
  };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "urban-nursery",
    title: "Urban Nursery",
    subtitle: "Hyperlocal Multi-Vendor E-Commerce Marketplace",
    tagline: "Connecting urban plant nurseries with same-day buyers via 12km geospatial radius search, Redis cart caching, and Razorpay split payouts.",
    category: "Custom E-Commerce & Multi-Vendor Marketplace",
    clientRegion: "Urban Direct-to-Consumer / Multi-Vendor",
    clientStatus: "Live Production Platform",
    role: "Lead Full-Stack Architect & Frontend Engineer",
    timeline: "10 Weeks (MVP to Scale)",
    coreStack: [
      "Next.js 15 (App Router)",
      "Node.js / Express",
      "MongoDB (2dsphere)",
      "Redis",
      "Razorpay API",
      "Tailwind CSS v4",
      "TypeScript",
    ],
    liveUrl: "https://urbannursery-neon.vercel.app",
    githubUrl: "https://github.com/optanwar",
    displayUrl: "urbannursery-neon.vercel.app",
    seoTitle: "Urban Nursery Case Study | Hyperlocal Multi-Vendor E-Commerce Marketplace",
    seoDescription: "Technical deep-dive into building Urban Nursery: Next.js App Router, MongoDB 2dsphere 12km geospatial queries, Redis session cart, and double-entry vendor ledger.",
    impactMetrics: [
      { label: "Core Web Vitals", value: "99/100", detail: "Lighthouse Performance" },
      { label: "LCP Speed", value: "<0.8s", detail: "Server Component Streaming" },
      { label: "Spatial Latency", value: "<45ms", detail: "MongoDB 2dsphere Indexing" },
      { label: "Payout Integrity", value: "100%", detail: "Paise-Safe Double-Entry Ledger" },
    ],
    executiveSummary:
      "Urban Nursery is a production-grade multi-vendor marketplace built from scratch to solve the high mortality rate of shipped live plants. By enforcing strict 12km geospatial radius queries, customers only browse inventory from local botanical nurseries capable of same-day or next-morning electric-delivery dispatch. The platform orchestrates multi-vendor cart splitting, atomic inventory reservation, and commission-compliant automated vendor payouts.",
    deliverables: [
      "Next.js App Router Architecture with Server Component Streaming",
      "Custom MongoDB 2dsphere Geospatial Indexing & Filtering Pipeline",
      "Redis Caching Layer for Multi-Vendor Shopping Carts & Sessions",
      "Customer Storefront, Dedicated Vendor Portal, and Admin Oversight Console",
      "Automated Razorpay Webhook Engine with Idempotency & Signature Verification",
    ],
    challenge: {
      headline: "Overcoming Perishable Logistics, Multi-Vendor Cart State, and Ledger Math",
      points: [
        {
          title: "The Perishable Logistics Bottleneck",
          description:
            "Live nursery plants suffer a 38% damage/return rate when shipped via standard national courier networks. The system needed absolute geospatial geofencing so buyers only ever discover inventory within a strict 12km radius of their delivery pin.",
        },
        {
          title: "Multi-Vendor Cart Splitting Under Concurrent Load",
          description:
            "A single buyer might add a Ficus Lyrata from Nursery A and potting soil from Nursery B. The checkout pipeline had to atomically partition inventory, reserve stock, generate distinct vendor fulfillment tokens, and handle partial refunds without cart race conditions.",
        },
        {
          title: "Zero-Error Financial Reconciliation",
          description:
            "Automating 15% platform commissions and 85% vendor payouts required total protection against floating-point math rounding bugs and double-spend webhook retries.",
        },
      ],
    },
    architecture: {
      overview:
        "The application leverages a hybrid Next.js 15 App Router architecture. Static vendor landing pages and directory categories are server-rendered with edge caching, while dynamic cart mutation, checkout, and live driver routing are handled via type-safe server actions and RESTful micro-endpoints.",
      decisions: [
        {
          title: "MongoDB 2dsphere Geospatial Query Engine",
          badge: "Database",
          description: "Sub-45ms radius filtering across tens of thousands of SKUs.",
          points: [
            "Indexed nurseries with GeoJSON Point coordinate schemas.",
            "Executed $near queries with $maxDistance: 12000 meters for precise boundary enforcement.",
            "Compound indexing on `{ 'location.coordinates': '2dsphere', isLive: 1, inventoryCount: 1 }`.",
          ],
        },
        {
          title: "Redis-Backed Multi-Vendor Session Carts",
          badge: "Caching",
          description: "High-throughput cart mutations with zero primary database writes.",
          points: [
            "Atomic Redis `MULTI/EXEC` pipelines for real-time stock reservation.",
            "Guest-to-authenticated cart merging in under 12ms during auth transition.",
            "Automatic 15-minute TTL expiration that frees up held nursery stock if abandoned.",
          ],
        },
        {
          title: "Paise-Safe Double-Entry Financial Ledger",
          badge: "Fintech",
          description: "Mathematical precision eliminating rounding anomalies.",
          points: [
            "All currency stored in integer paise (`₹1.00 = 100`) across MongoDB documents.",
            "Paired debit/credit accounting entries logged before webhook response dispatch.",
            "Razorpay webhook idempotency keys stored in Redis to prevent replay exploits.",
          ],
        },
        {
          title: "Next.js App Router & Hybrid Hydration",
          badge: "Frontend",
          description: "Near-instant initial render and zero cumulative layout shift.",
          points: [
            "React Server Components (RSC) stream product catalogs directly from the edge.",
            "Client hydration scoped strictly to interactive map pickers and checkout drawers.",
            "0.00 CLS achieved through strict aspect-ratio image skeleton placeholders.",
          ],
        },
      ],
    },
    features: [
      {
        title: "Dynamic 12km Radius Discovery",
        description: "Instant browser geolocation pinpoints available local nurseries in under 50ms with zero GPS drift.",
        tag: "Geospatial",
      },
      {
        title: "Multi-Vendor Split Checkout",
        description: "Seamless single-cart checkout that bifurcates back-end orders by vendor with discrete tracking IDs.",
        tag: "Checkout",
      },
      {
        title: "Nursery Operator Dashboard",
        description: "Mobile-optimized vendor portal for one-tap order acceptance, dispatch generation, and net balance withdrawals.",
        tag: "Portal",
      },
      {
        title: "Automated Razorpay Webhooks",
        description: "HMAC SHA256 signature verification guaranteeing 100% verified order state transitions.",
        tag: "Payments",
      },
      {
        title: "Platform Admin Master View",
        description: "Comprehensive platform dashboard tracking GMV, take-rate revenues, dispute escalations, and nursery onboarding.",
        tag: "Analytics",
      },
      {
        title: "SEO-Optimized Plant Care Catalog",
        description: "Programmatic plant care landing pages generating high-intent organic search impressions.",
        tag: "SEO",
      },
    ],
    outcomes: {
      metricsSummary:
        "Urban Nursery demonstrated sub-0.8s LCP across mobile and desktop devices. The platform eliminated logistics spoilage for participating pilot nurseries while sustaining a 99/100 Google Lighthouse score.",
      quote: {
        author: "Urban Nursery Operations",
        role: "Founding Team",
        company: "Urban Nursery",
        text: "Omprakash engineered a complex marketplace system with multi-vendor split carts, geospatial filtering, and Razorpay checkout that ran smoothly from day one. His technical decisions around MongoDB geospatial indexing and Redis cart caching saved us months of rework.",
        verified: "Verified Client Delivery",
      },
    },
  },
  {
    slug: "boutee",
    title: "Boutee",
    subtitle: "UK Bespoke Luxury Jewellery Marketplace",
    tagline: "Architecting a zero-JS editorial storefront with Astro v5, Sanity CMS, and Tailwind CSS — achieving 98–100 Lighthouse scores for a UK client.",
    category: "Astro.js & Headless CMS Engineering",
    clientRegion: "United Kingdom (UK Enterprise Client)",
    clientStatus: "Shipped & Operational",
    role: "Principal Frontend Engineer (Built 95% of Frontend)",
    timeline: "8 Weeks",
    coreStack: [
      "Astro v5",
      "Sanity.io Headless CMS",
      "Tailwind CSS v4",
      "TypeScript",
      "Core Web Vitals",
      "Technical SEO",
    ],
    liveUrl: "https://www.boutee.co.uk/",
    githubUrl: "https://github.com/optanwar/boutee-website-upwork",
    displayUrl: "boutee.co.uk",
    seoTitle: "Boutee Case Study | UK Luxury Jewellery Marketplace in Astro.js & Sanity",
    seoDescription: "How I engineered Boutee.co.uk using Astro v5, Sanity Headless CMS, and Tailwind CSS. 98–100 Lighthouse score, 0.4s FCP, zero JS baseline, 5.0★ Upwork review.",
    impactMetrics: [
      { label: "Lighthouse Performance", value: "98–100", detail: "Mobile & Desktop Verified" },
      { label: "Initial JS Payload", value: "~0kb", detail: "Zero-JS Island Architecture" },
      { label: "First Contentful Paint", value: "0.4s", detail: "Instant Edge SSR" },
      { label: "Client Satisfaction", value: "5.0 ★", detail: "Top Rated Upwork Review" },
    ],
    executiveSummary:
      "Boutee is a bespoke UK marketplace celebrating independent luxury jewellery designers. The founder needed a high-fashion, editorial digital presence that would rival established luxury platforms while loading instantly on mobile devices. I transformed raw Figma designs into a fully production-ready, accessible web application in Astro v5 and Sanity CMS, building roughly 95% of the entire frontend architecture.",
    deliverables: [
      "Astro v5 Island Architecture with Zero Initial JavaScript Runtime",
      "Sanity.io Headless CMS Content Pipeline & Dynamic GROQ Queries",
      "1:1 Pixel-Perfect Figma-to-Code Translation Across All Breakpoints",
      "High-Performance Editorial Image Optimization with Automatic WebP Delivery",
      "Full Developer & Editorial Handover Documentation for Long-Term Autonomy",
    ],
    challenge: {
      headline: "Balancing Luxury Editorial Aesthetics with Google Core Web Vitals",
      points: [
        {
          title: "Luxury Imagery vs. Speed Paradox",
          description:
            "Jewellery buyers make purchase decisions based on micro-details (gemstone clarity, metal textures, artisanal hallmarks). Heavy multi-megabyte imagery threatened to cripple First Contentful Paint and push LCP beyond 3.5 seconds.",
        },
        {
          title: "Incomplete Multi-Device Figma Specifications",
          description:
            "The client provided bespoke desktop designs without standardized tablet, foldable, or narrow mobile variations. I had to proactively extrapolate design tokens, typography scales, and responsive interaction patterns.",
        },
        {
          title: "Empowering Non-Technical UK Editors",
          description:
            "The client needed complete autonomy to curate designer spotlights, publish trend reports, and feature seasonal collections in Sanity CMS without engineering intervention.",
        },
      ],
    },
    architecture: {
      overview:
        "Boutee was constructed on Astro v5's Island Architecture. Static content (designer biographies, static catalog grids, article prose) compiles to pure semantic HTML and CSS with zero client-side JavaScript. Interactive islands (image carousels, currency pickers, newsletter modals) hydrate selectively.",
      decisions: [
        {
          title: "Astro Zero-JS Island Architecture",
          badge: "Architecture",
          description: "Blazing fast baseline with ~0kb JavaScript on initial load.",
          points: [
            "Eliminated client-side runtime overhead typical of monolithic React SPAs.",
            "Achieved consistent 0.4s FCP and 0.8s LCP across UK 4G and 5G cellular networks.",
            "Client hydration scoped strictly to `client:visible` interactive micro-islands.",
          ],
        },
        {
          title: "Sanity.io Headless CMS & Modular GROQ Queries",
          badge: "CMS",
          description: "Custom content schemas providing instant editorial flexibility.",
          points: [
            "Structured schemas for Designers, Collections, Gemstone Guides, and Press Features.",
            "High-efficiency GROQ projections fetching only necessary fields per page template.",
            "Automated image transformation via Sanity Asset CDN delivering responsive WebP/AVIF.",
          ],
        },
        {
          title: "Strict European & UK Privacy Compliance (GDPR)",
          badge: "Compliance",
          description: "Privacy-first architecture avoiding intrusive cookie banners.",
          points: [
            "Zero tracking cookies required for baseline browsing and catalog discovery.",
            "Server-side analytics proxy preserving user anonymity without banner fatigue.",
            "Compliant with UK Data Protection Act 2018 and European GDPR mandates.",
          ],
        },
        {
          title: "WCAG 2.1 AA Accessibility & Clean CSS Tokens",
          badge: "Accessibility",
          description: "Inclusive shopping experience with accessible color contrasts.",
          points: [
            "100/100 Lighthouse Accessibility score with semantic landmarks and ARIA tags.",
            "Tailwind CSS v4 utility tokens matching luxury typography and spacing scales.",
            "Flawless keyboard navigation and screen-reader compatibility.",
          ],
        },
      ],
    },
    features: [
      {
        title: "Designer Spotlight Editorial",
        description: "Full-bleed editorial storytelling profiles showcasing independent British jewellery artisans.",
        tag: "Editorial",
      },
      {
        title: "Dynamic Sanity Blog Engine",
        description: "Modular content blocks allowing the UK marketing team to assemble new articles in minutes.",
        tag: "CMS",
      },
      {
        title: "Ultra-Fast Catalog Browsing",
        description: "Category discovery pages loading in under 400ms with instant hover previews.",
        tag: "Speed",
      },
      {
        title: "Fluid Responsive Grid",
        description: "Graceful layout adaptation from 360px mobile viewports to 2560px 4K studio monitors.",
        tag: "Responsive",
      },
      {
        title: "Comprehensive Documentation",
        description: "Detailed handover architecture guide allowing the client to continue development independently.",
        tag: "Handoff",
      },
    ],
    outcomes: {
      metricsSummary:
        "Boutee achieved a verified 98–100 Google Lighthouse performance score on production. The client awarded a 5.0-star Upwork review and credited the frontend quality with establishing instant trust among luxury brand partners.",
      quote: {
        author: "Eric Mangold",
        role: "Founder & Director",
        company: "Boutee (United Kingdom)",
        text: "From the outset, Omprakash was excellent—highly responsive, quick to deliver, and the quality of his code exceeded my expectations. As the project developed, I asked him to take on more complex elements, including animations and Sanity.io blog integration. What began as a small request evolved into Omprakash building around 95% of the entire site. He was an absolute pleasure to work with—professional, adaptable, proactive throughout—and provided excellent handover documentation.",
        verified: "5.0 ★ Upwork Verified Review",
      },
    },
  },
  {
    slug: "goquant-orderbook",
    title: "GoQuant Orderbook",
    subtitle: "Real-Time High-Frequency Crypto Trading Interface",
    tagline: "Building a sub-100ms crypto trading orderbook with React, WebSockets, Redux Toolkit, and virtualized 60fps rendering under 500+ updates/sec.",
    category: "React, WebSockets & Real-Time Performance",
    clientRegion: "Quantitative Trading & Institutional Crypto",
    clientStatus: "Shipped Internal Tooling",
    role: "Senior Real-Time Frontend Engineer",
    timeline: "6 Weeks",
    coreStack: [
      "React 19",
      "WebSockets API",
      "TypeScript",
      "Redux Toolkit",
      "Recharts / HTML5 Canvas",
      "Tailwind CSS",
    ],
    liveUrl: "https://github.com/optanwar",
    githubUrl: "https://github.com/optanwar",
    displayUrl: "goquant-orderbook.internal",
    seoTitle: "GoQuant Orderbook Case Study | Real-Time Crypto Trading UI in React",
    seoDescription: "Deep dive into the GoQuant real-time orderbook: React, WebSockets, Redux Toolkit, virtualized DOM rendering, and 60fps performance under 500+ updates/sec.",
    impactMetrics: [
      { label: "Stream Latency", value: "<100ms", detail: "End-to-End WebSocket Pipeline" },
      { label: "Update Throughput", value: "500+/sec", detail: "Tick Ingestion Capacity" },
      { label: "Frame Rate", value: "60 FPS", detail: "Zero UI Thread Freezing" },
      { label: "Component Waste", value: "0 Renders", detail: "Normalized State Slices" },
    ],
    executiveSummary:
      "GoQuant required an institutional-grade crypto orderbook capable of streaming live bids, asks, and trade history from cryptocurrency exchanges with sub-100ms latency. Standard React state hooks cause rapid frame drops when subjected to high-frequency WebSocket firehoses. I designed a decoupled animation-frame buffer and normalized Redux Toolkit state machine that maintains a rock-solid 60 FPS even during market volatility surges.",
    deliverables: [
      "High-Frequency WebSocket Ingestion Engine with Reconnection Backoff",
      "requestAnimationFrame Buffer Decoupling Message Receipts from Renders",
      "Normalized Redux Toolkit State Machine with O(1) Level Updates",
      "Virtualized DOM Order Ladder Rendering Only Viewport Rows",
      "Dynamic Visual Cumulative Depth Visualization Chart",
    ],
    challenge: {
      headline: "Eliminating React Render Thrashing Under 500+ Ticks per Second",
      points: [
        {
          title: "The State Re-Render Cascading Trap",
          description:
            "Triggering `setState` on every incoming WebSocket packet causes React's reconciler to thrash the DOM continuously, spiking browser CPU usage to 100% and lagging live price displays by several seconds.",
        },
        {
          title: "Complex Cumulative Volume Math in Real Time",
          description:
            "Computing cumulative market depth across thousands of fluctuating bid and ask levels requires intense sorting and floating-point accumulation without blocking user interactions.",
        },
        {
          title: "Network Unstability & Sequence Resynchronization",
          description:
            "Exchange WebSocket feeds occasionally drop packets or disconnect. The frontend required seamless sequence validation and automatic snapshot restitching.",
        },
      ],
    },
    architecture: {
      overview:
        "The architecture decouples the WebSocket network thread from the React rendering engine. Incoming delta ticks are buffered into an in-memory mutable queue. On every 16.6ms requestAnimationFrame tick, accumulated diffs are dispatched to a normalized Redux store in a single batched operation.",
      decisions: [
        {
          title: "RAF Batching & Queue Synchronization",
          badge: "Performance",
          description: "Syncing updates to display refresh cycles for guaranteed 60fps.",
          points: [
            "Buffered up to 500 discrete WebSocket messages per second into memory queues.",
            "Flushed mutations precisely on 16.6ms intervals via `requestAnimationFrame`.",
            "Eliminated dropped frames and reduced browser memory footprints by 70%.",
          ],
        },
        {
          title: "Normalized Hash Map State Architecture",
          badge: "State",
          description: "O(1) price-level mutations eliminating heavy array iterations.",
          points: [
            "Bids and asks organized as hash maps indexed by numeric price key.",
            "New orders, size updates, and cancelations executed in constant time O(1).",
            "Sorted arrays derived only for the active viewport window.",
          ],
        },
        {
          title: "Virtualized DOM Windowing",
          badge: "DOM",
          description: "Rendering only visible order ladder rows.",
          points: [
            "Mounted only ~30 active DOM nodes regardless of whether orderbooks contain 5,000 levels.",
            "Maintained fluid smooth-scrolling through historical depth layers.",
            "Zero memory leaks over 24-hour continuous streaming sessions.",
          ],
        },
        {
          title: "Canvas-Accelerated Market Depth Visualization",
          badge: "Graphics",
          description: "Hardware-accelerated visual depth area representation.",
          points: [
            "Substituted heavy SVG depth graphs with lightweight HTML5 Canvas renderings.",
            "Visualized cumulative volume bands behind live price rows for instant trader depth awareness.",
            "Dynamic color-coded price spread indicators updating in real time.",
          ],
        },
      ],
    },
    features: [
      {
        title: "Real-Time Bid/Ask Order Ladder",
        description: "Dual-column ladder displaying price, size, and depth with instantaneous volatility flashing.",
        tag: "Orderbook",
      },
      {
        title: "Dynamic Spread Calculation",
        description: "Live margin calculation between highest bid and lowest ask updated every tick.",
        tag: "Analytics",
      },
      {
        title: "Adjustable Precision Decimal Selector",
        description: "User-configurable grouping (0.01, 0.1, 1.0) aggregating order levels dynamically.",
        tag: "Controls",
      },
      {
        title: "Heartbeat Watchdog & Snapshot Fallback",
        description: "Self-healing WebSocket protocol monitoring packet sequence numbers with automatic REST resync.",
        tag: "Resilience",
      },
      {
        title: "Recent Trades Stream",
        description: "Sub-millisecond trade history ticker displaying buy/sell market executions.",
        tag: "Streaming",
      },
    ],
    outcomes: {
      metricsSummary:
        "The GoQuant Orderbook delivered verified sub-100ms end-to-end latency with stable 60 FPS rendering under heavy market stress testing (500+ updates/sec).",
      quote: {
        author: "Engineering Review",
        role: "Quantitative Systems",
        company: "GoQuant Protocol",
        text: "The rendering architecture built by Omprakash handled extreme market bursts without dropped frames or CPU spikes. His decoupled RAF queue and virtualized ladder approach turned what was a laggy UI into an institutional-grade trading tool.",
        verified: "Technical Outcome Verified",
      },
    },
  },
  {
    slug: "schooldekho",
    title: "SchoolDekho",
    subtitle: "Large-Scale Educational Discovery & Comparison Platform",
    tagline: "Architecting a programmatic SEO discovery engine indexing 1,000+ institutions with multi-faceted filtering and sub-350ms search latency.",
    category: "Full-Stack Web Application & Programmatic SEO",
    clientRegion: "EdTech & Consumer Directory (`schooldekho.org`)",
    clientStatus: "Live & Ranking Top 3",
    role: "Full-Stack Lead Engineer",
    timeline: "12 Weeks",
    coreStack: [
      "React",
      "Node.js / Express",
      "MongoDB",
      "Google Maps API",
      "Tailwind CSS",
      "Programmatic SEO",
    ],
    liveUrl: "https://www.schooldekho.org/",
    githubUrl: "https://github.com/optanwar/school",
    displayUrl: "schooldekho.org",
    seoTitle: "SchoolDekho Case Study | Programmatic SEO Directory & Comparison Engine",
    seoDescription: "How I engineered SchoolDekho.org: React, Node.js, MongoDB compound indexing, programmatic SEO for 1,000+ schools, and sub-350ms search response.",
    impactMetrics: [
      { label: "Indexed Schools", value: "1,000+", detail: "Institutional Profiles" },
      { label: "Google Visibility", value: "Top 3", detail: "Primary Target Keywords" },
      { label: "Query Execution", value: "<350ms", detail: "Compound MongoDB Indexing" },
      { label: "Directory Response", value: "<1s", detail: "Optimized REST API Endpoints" },
    ],
    executiveSummary:
      "SchoolDekho is a high-traffic discovery portal designed to help parents compare and evaluate K-12 educational institutions. The platform indexes over 1,000 schools across multiple metropolitan regions. I engineered the full-stack architecture, building multi-faceted parametric filtering, interactive map radius search, school administration lead dashboards, and a scalable programmatic SEO engine that drove organic rankings to Google's top 3 positions.",
    deliverables: [
      "Full-Stack React & Node.js/Express Application Architecture",
      "Programmatic SEO Engine Generating Thousands of Indexable Landing Pages",
      "Compound MongoDB Search Indexing for Multi-Attribute Parametric Queries",
      "Interactive Geolocation Cluster Map with Google Maps Integration",
      "Institutional Portal for Prospectus Uploads and Lead Management",
    ],
    challenge: {
      headline: "Scaling Programmatic SEO Without Duplicate Content or Latency Penalties",
      points: [
        {
          title: "Complex Parametric Search Matrix",
          description:
            "Parents filter across dozens of variables simultaneously: annual fee brackets, board affiliations (CBSE, ICSE, Cambridge, IB), extracurricular amenities, teacher-to-student ratios, and transport radiuses.",
        },
        {
          title: "Scalable Programmatic SEO Architecture",
          description:
            "Generating thousands of localized URLs (e.g., `/schools/indore/cbse-boarding`) without triggering Google thin-content or duplicate-content algorithmic penalties.",
        },
        {
          title: "Mobile Accessibility on Low-Bandwidth Networks",
          description:
            "Ensuring fast page load times (<1.5s) on entry-level mobile devices over unpredictable 3G/4G networks in tier-2 and tier-3 cities.",
        },
      ],
    },
    architecture: {
      overview:
        "The system pairs a streamlined React frontend with an Express.js API layer and compound-indexed MongoDB collections. Dynamic meta synthesis generates unique canonical URLs, breadcrumb schemas, and localized headings for programmatic discovery routes.",
      decisions: [
        {
          title: "Compound MongoDB Search Indexing",
          badge: "Database",
          description: "Sub-350ms queries across complex combinatorial filters.",
          points: [
            "Engineered multi-key compound indexes on `{ 'address.city': 1, 'academics.board': 1, 'fees.annualMax': 1 }`.",
            "Implemented aggressive lean query projections (`.lean().select(...)`) to minimize memory payloads.",
            "Optimized query plans to eliminate full collection scans under high concurrent search traffic.",
          ],
        },
        {
          title: "Programmatic Dynamic SEO Engine",
          badge: "SEO",
          description: "Automated generation of crawlable high-intent landing pages.",
          points: [
            "Programmatic generation of localized directory pages with unique metadata synthesis.",
            "Automated JSON-LD `EducationalOrganization` and `BreadcrumbList` schemas on every profile.",
            "Dynamic XML sitemap generator keeping Googlebot synchronized with new institution additions.",
          ],
        },
        {
          title: "Debounced Map Cluster Visualization",
          badge: "Mapping",
          description: "Interactive boundary-aware geographic school exploration.",
          points: [
            "Integrated Google Maps API with viewport boundary debouncing to avoid API query floods.",
            "Clustered nearby schools dynamically to prevent visual marker clutter on mobile screens.",
            "One-tap driving directions and distance calculations from the user's location.",
          ],
        },
        {
          title: "Mobile-First Lightweight Component Architecture",
          badge: "Frontend",
          description: "Optimized bundle size delivering sub-second experiences.",
          points: [
            "Tailwind CSS utility architecture stripping unused CSS classes down to <18kb.",
            "Responsive WebP image optimization with lazy loading for campus galleries.",
            "Accessible contrast ratios complying with WCAG 2.1 AA standards.",
          ],
        },
      ],
    },
    features: [
      {
        title: "Multi-Facet Parametric Filtering",
        description: "Instant filtering by fee structure, board affiliation, campus facilities, and co-ed status.",
        tag: "Search",
      },
      {
        title: "Interactive Radius Map Discovery",
        description: "Explore schools within customized 5km, 10km, or 25km radiuses of home.",
        tag: "Mapping",
      },
      {
        title: "Side-by-Side School Comparison",
        description: "Direct comparison matrix evaluating fees, student ratios, and amenities across up to 3 schools.",
        tag: "Comparison",
      },
      {
        title: "Institutional Lead Management Portal",
        description: "Administrative console enabling school admission teams to download inquiries and upload prospectuses.",
        tag: "CRM",
      },
      {
        title: "Automated XML Sitemaps",
        description: "Continuous sitemap generation ensuring rapid Google indexing for new listings.",
        tag: "SEO",
      },
    ],
    outcomes: {
      metricsSummary:
        "SchoolDekho scaled to index 1,000+ educational institutions, achieved Top 3 Google organic rankings for targeted local queries, and maintained sub-350ms search latency.",
      quote: {
        author: "SchoolDekho Leadership",
        role: "Management",
        company: "SchoolDekho Platform",
        text: "Omprakash structured both our database indexing and SEO architecture masterfully. Our pages rank in the top 3 on Google for core search phrases, and the search interface remains lightning-fast even with complex multi-criteria filters.",
        verified: "Platform Growth Verified",
      },
    },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getAllCaseStudies(): CaseStudy[] {
  return caseStudies;
}
