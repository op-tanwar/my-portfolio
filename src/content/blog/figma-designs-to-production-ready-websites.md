---
title: "From Figma Designs to Production-Ready Websites"
description: "My end-to-end Figma-to-code workflow for client sites—handoff audits, token extraction, responsive strategy, and shipping pixel-faithful UI without rework."
publishDate: 2026-03-12
updatedDate: 2026-06-10
category: "Design"
tags: ["Figma", "Design", "React", "Workflow"]
featured: true
accent: "#ff006e"
image: "../../assets/blog/figma-designs-to-production-ready-websites.jpg"
imageAlt: "UI design mockups on screen during development"
---

The Figma file looked perfect. Auto-layout everywhere, component variants for every state, a color styles panel that would make any designer proud. The UK startup client was thrilled. Then I opened the dev mode inspect panel on the hero section and found a gradient overlay at 37% opacity, text set in a font that wasn't licensed for web, and a "desktop" frame that was 1,440px wide with no tablet or mobile companion.

This gap between beautiful Figma files and production-ready websites is where most client projects lose time and budget. I've spent three years translating designs into React, Next.js, and Astro code for US, UK, and EU clients. The difference between a smooth build and a painful one almost never comes down to coding skill. It comes down to what happens before the first component gets written.

This article is my complete workflow—from design audit through token extraction, responsive implementation, and QA—for shipping Figma designs as production websites that match intent without endless revision rounds.

## The Pre-Development Design Audit

Before I quote timeline or write code, I run a design audit. This takes 2-4 hours and saves days of rework. I send the client a structured checklist:

**Structure and completeness**
- Are all pages designed, or only happy-path desktop views?
- Do mobile and tablet breakpoints exist for every unique layout?
- Are hover, focus, active, disabled, error, and loading states defined?
- Is there a empty state for lists, search results, and dashboards?

**Technical feasibility**
- Are fonts licensed for web embedding?
- Do animations have timing/easing specs or just "make it smooth"?
- Are images final assets or low-res placeholders?
- Does the design account for real content length (long names, multilingual text)?

**Design system consistency**
- Are colors defined as styles/variables, or one-off fills?
- Is spacing on a consistent scale, or arbitrary values everywhere?
- Do components use variants, or are similar elements duplicated?

On a US agency subcontract last year, the audit caught 14 undrawn responsive screens and 6 interactive states missing from the checkout flow. We renegotiated scope before development started instead of discovering gaps in week three. The client appreciated the transparency; the agency avoided a margin-killing change order.

## Extracting Design Tokens Before Writing Components

Token extraction is the highest-ROI step in the entire Figma-to-code pipeline. I export or manually map:

| Figma | Code |
|-------|------|
| Color styles | `@theme` CSS variables |
| Text styles | Typography component variants |
| Effect styles | Shadow/radius tokens |
| Spacing in auto-layout | Approved Tailwind spacing scale |
| Grid columns | Layout grid config |

```css
/* Extracted from Figma variables */
@theme {
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-text-primary: #0f172a;
  --color-text-secondary: #64748b;
  --color-surface: #ffffff;
  --color-border: #e2e8f0;

  --font-heading: "Cal Sans", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px rgb(0 0 0 / 0.07);
}
```

**Mistake I used to make:** eyeballing colors from Figma's inspect panel and hardcoding hex values in JSX. They were always slightly wrong because of color profile differences, and they never updated when the designer tweaked the palette.

Tools that help: Figma's variables export (JSON), Tokens Studio plugin for structured export, and manual spreadsheets for smaller projects. The method matters less than having a single source of truth that both designer and developer reference.

## Typography: Where Designs Break First

Figma text boxes rarely match how browsers render type. Line height, letter spacing, and font weight perception differ between design tools and CSS.

My typography workflow:

1. Map each Figma text style to a component variant
2. Test with real content—especially long headlines and German compound words (EU clients)
3. Use `clamp()` for fluid heading sizes instead of fixed breakpoint jumps

```tsx
const headingVariants = {
  h1: "font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight",
  h2: "font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-snug",
  body: "font-body text-base leading-relaxed text-text-secondary",
  small: "font-body text-sm leading-normal text-text-secondary",
} as const;
```

On a EU legal services site, the designer's fixed 64px hero headline broke on every mobile preview. Fluid type with `clamp()` matched the Figma intent at 1,440px and remained readable at 375px—without a separate mobile design frame.

## Layout: Auto-Layout Maps to Flexbox and Grid

Figma auto-layout translates cleanly to CSS when you understand the mapping:

| Figma auto-layout | CSS |
|-------------------|-----|
| Direction: vertical | `flex flex-col` |
| Direction: horizontal | `flex flex-row` |
| Gap | `gap-{n}` on Tailwind scale |
| Padding | `p-{n}` |
| Fill container | `flex-1` or `w-full` |
| Hug contents | `w-fit` or `shrink-0` |
| Space between | `justify-between` |

```tsx
// Figma: horizontal auto-layout, space-between, 24px gap, center aligned
<header className="flex items-center justify-between gap-6">
  <Logo />
  <nav className="flex items-center gap-8">{/* links */}</nav>
  <Button>Get started</Button>
</header>
```

When Figma uses absolute positioning heavily—common in marketing hero sections—I push back and ask for auto-layout versions. Absolute positioning in production creates fragile layouts that break with every content change. I've rebuilt two hero sections because the designer positioned elements at fixed pixel coordinates that only worked with placeholder text.

## Responsive Strategy When Mobile Designs Don't Exist

About 40% of client Figma files I receive are desktop-only. I don't block development—I define a responsive strategy document the client approves:

**My default breakpoints:**
- `sm` (640px): stack horizontal layouts, increase touch targets
- `md` (768px): navigation changes, sidebar appears
- `lg` (1024px): match desktop Figma layout
- `xl` (1280px): max-width container, generous whitespace

**Rules I document:**
- Navigation: hamburger below `md`, horizontal at `md+`
- Typography: fluid `clamp()` scales, no fixed mobile sizes unless designed
- Grids: 1 column mobile, 2 at `sm`, designed column count at `lg`
- Images: `object-cover` with defined aspect ratios, never fixed heights

```tsx
<section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
  {features.map((feature) => (
    <FeatureCard key={feature.id} {...feature} />
  ))}
</section>
```

This approach shipped a US consulting firm's desktop-only Figma across 12 pages in four weeks. The designer reviewed staging on real devices, made adjustments in a single revision round, and signed off. Waiting for complete responsive designs would have delayed launch by a month.

## Asset Export and Image Pipeline

Design handoff isn't complete without an asset strategy. I request:

- SVG for icons and logos (outlined, not flattened unless intentional)
- WebP or AVIF sources at 1x and 2x where raster is necessary
- Named files matching component usage (`icon-arrow-right.svg`, not `Frame 247.svg`)

```tsx
import Image from "next/image";

<Image
  src="/images/hero-dashboard.webp"
  alt="Analytics dashboard showing revenue trends and user growth charts"
  width={1200}
  height={800}
  priority
  className="rounded-lg shadow-md"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 960px"
/>
```

**Common Figma export mistakes:**
- PNG icons at 24px that should be SVG (blurry on retina)
- Hero images exported at display size instead of 2x
- Background images baked into JPG exports instead of separate CSS backgrounds
- Missing `alt` text guidance—I add an "alt text" column to my implementation spreadsheet

## Building a Component Match Plan

I create a mapping document before coding:

```
Figma Component     →  Code Component         →  Priority
─────────────────────────────────────────────────────────
Button/Primary      →  <Button variant="primary">  P0
Button/Secondary    →  <Button variant="secondary"> P0
Card/Product        →  <ProductCard>               P1
Input/Text          →  <Input>                     P0
Input/Error         →  <Input error={msg}>         P0
Modal/Confirmation  →  <Dialog>                    P1
```

P0 components get built in week one. They're the design system's foundation. P1 and P2 follow as pages are assembled. This prevents the trap of building page-specific markup that should have been a shared component.

For a UK property listing site, the match plan identified that Figma's "Property Card" and "Featured Property Card" differed only in image aspect ratio and badge presence. One `PropertyCard` component with variants replaced two nearly duplicate implementations.

## Implementation Order That Minimizes Rework

My page build sequence:

1. **Global shell** — header, footer, navigation, page container
2. **Design system components** — buttons, inputs, cards, badges
3. **Section patterns** — hero, feature grid, testimonial strip, CTA banner
4. **Page assembly** — compose sections into routes
5. **Polish** — animations, micro-interactions, responsive fine-tuning

```tsx
// pages/index.tsx — assembly, not bespoke markup
export default function HomePage() {
  return (
    <>
      <HeroSection
        headline="Ship faster with confidence"
        subheadline="Production-ready components for growing teams."
        cta={{ label: "Start free trial", href: "/signup" }}
      />
      <LogoCloud logos={clientLogos} />
      <FeatureGrid features={features} />
      <TestimonialSection testimonials={testimonials} />
      <CtaBanner
        headline="Ready to get started?"
        cta={{ label: "Book a demo", href: "/contact" }}
      />
    </>
  );
}
```

Section components accept content as props—marketing can swap copy without touching layout code. This pattern came from an Astro marketing site where the client updated hero text weekly during a launch campaign.

## Design QA: The Comparison Workflow

"Pixel-perfect" is a misleading goal. Browsers and Figma render differently. What I promise clients is **intent-perfect**: correct hierarchy, spacing relationships, colors, typography scale, and interactive behavior.

My QA process:

1. **Side-by-side review** — Figma frame next to staging in the same viewport width
2. **Screenshot overlay** — tools like Pixelay or manual opacity overlay in DevTools
3. **Spacing audit** — measure key gaps with DevTools, compare to Figma auto-layout values
4. **State review** — click every interactive element, verify against Figma component variants
5. **Content stress test** — long text, empty states, error states

```tsx
// Stress test with extreme content during development
<HeroSection
  headline="Enterprise-grade analytics for cross-functional revenue operations teams"
  subheadline="This subheadline is intentionally long to verify line wrapping behavior matches design intent at all breakpoints without overlapping the CTA or breaking the grid layout."
/>
```

I schedule a formal design review at 50% and 90% completion—not continuously. Constant micro-feedback destroys velocity. Structured review rounds with documented change requests keep both sides efficient.

## Handling Design Changes Mid-Build

Design changes are inevitable. How you handle them determines whether the project stays profitable.

**Change request protocol I use:**
1. Client submits change with Figma link or description
2. I classify: token-level (fast), component-level (moderate), layout-level (significant)
3. Estimate impact in hours before implementing
4. Batch changes into weekly revision rounds, not ad-hoc

Token-level changes are why token extraction matters. When the UK startup shifted their primary color from indigo to violet, I updated one CSS variable. Every button, link, and badge updated together. Without tokens, that change would have been a multi-day grep exercise.

## Real Project Scenario: SaaS Marketing Site in Three Weeks

A US SaaS client needed a marketing site live before a product launch. Figma file: 8 pages, desktop and mobile designed, component library with 22 variants. Stack: Next.js, Tailwind, Vercel.

**Week 1:**
- Design audit (half day—file was well prepared)
- Token extraction and Tailwind theme setup
- 12 P0 components built with Storybook
- Global shell: header, footer, mobile nav

**Week 2:**
- 6 section patterns composed from components
- 8 pages assembled from sections
- CMS integration for blog (Markdown content collections)
- Responsive QA on real devices

**Week 3:**
- Animations: scroll reveals, hover states per Figma specs
- Performance pass: image optimization, font subsetting
- Design review round → 14 minor spacing tweaks
- Launch

The site scored 95+ on Lighthouse performance. The designer said it was the closest Figma-to-production match she'd seen from a freelancer. The secret wasn't precision tooling—it was front-loaded token work, component-first building, and disciplined review rounds.

## Tools in My Figma-to-Code Stack

| Tool | Purpose |
|------|---------|
| Figma Dev Mode | Inspect spacing, export assets |
| Tokens Studio | Structured token export |
| Storybook | Component review with designers |
| VisBug / DevTools | Spacing and alignment QA |
| `@font-face` + Google Fonts | Typography implementation |
| Next.js Image / Astro Image | Optimized responsive images |
| Percy or manual screenshots | Visual regression between deploys |

I don't use Figma-to-code auto-generators for production output. Tools like Anima or Locofy produce markup that requires complete rewrite. They're fine for prototypes; they're not fine for maintainable client deliverables.

## Conclusion

Turning Figma designs into production-ready websites is a process discipline, not a pixel-copying exercise. Audit designs before quoting. Extract tokens before components. Map auto-layout to flexbox and grid. Define responsive rules when mobile frames are missing. Export assets correctly. Build components before pages. Review in structured rounds.

The UK startup with the perfect-looking but incomplete Figma file? We spent two days on audit and token setup, then shipped the MVP in five weeks with one revision round. The design was beautiful in Figma; the production site matched because we built the bridge between them intentionally.

That's the workflow I bring to every client engagement—and it's why design-to-development handoff stops being the bottleneck.


When the Figma is ready and you need production HTML/CSS/React without rebuilding layouts in QA, work with a [Figma to code developer](/figma-to-code-developer) who maps tokens and components before page assembly.


When Figma is the start of a full-site refresh — not a single landing slice — that engagement is usually [website redesign services](/website-redesign-services).

## Key Takeaways

- Run a pre-development design audit covering breakpoints, states, fonts, and content edge cases before writing code
- Extract design tokens into CSS variables first—colors, typography, spacing, shadows, and radii
- Map Figma text styles to typed component variants; use fluid `clamp()` typography for responsive headings
- Translate auto-layout to flexbox/grid; push back on absolute positioning in content-sensitive layouts
- When mobile designs are missing, document and approve a responsive strategy instead of guessing per page
- Export SVG icons, 2x raster images, and meaningful file names; specify `alt` text during implementation
- Build a Figma-to-code component match plan prioritized P0/P1/P2 before page assembly
- Implement in order: shell → design system → sections → pages → polish
- QA for design intent, not pixel perfection—side-by-side review at 50% and 90% completion
- Batch mid-build design changes into classified, estimated revision rounds; tokens make global changes cheap
