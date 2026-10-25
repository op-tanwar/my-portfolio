---
title: "Framer Motion vs GSAP: Choosing the Right Animation Tool"
description: "When I reach for Framer Motion vs GSAP on client projects — React micro-interactions, scroll storytelling, performance budgets, and accessibility lessons from production."
publishDate: 2025-01-10
updatedDate: 2026-06-11
category: "Animation"
tags: ["Framer Motion", "GSAP", "Animation", "UX", "Performance"]
featured: false
accent: "#ff006e"
image: "../../assets/blog/framer-motion-gsap-animation.jpg"
imageAlt: "Abstract gradient shapes representing motion design and web animation"
---

A US marketing agency wanted their client's homepage to "feel like Apple." Smooth scroll reveals. Staggered text. Parallax on the hero image. They'd already tried Framer Motion and said it felt "janky" on scroll.

They weren't wrong — for that specific job. Framer Motion excels at component-level React animations. GSAP with ScrollTrigger excels at choreographed scroll narratives. We rebuilt the scroll sequence in GSAP, kept Framer Motion for hover states and page transitions, and shipped in a week.

That project taught me animation library choice isn't about loyalty. It's about matching the tool to the interaction model.

## What Each Library Optimizes For

**Framer Motion** is built for React. Declarative props, layout animations, gesture handlers, and exit animations via `AnimatePresence`. It thinks in components.

**GSAP** is built for timelines. Precise sequencing, scroll-driven triggers, SVG morphing, and cross-element choreography. It thinks in seconds and easing curves.

Both are production-grade. Both are used on high-traffic sites. The wrong choice costs you dev time and frame drops.

## Framer Motion: Where It Wins

### Page and Component Transitions

On a UK SaaS onboarding flow, I used Framer Motion for step transitions:

```tsx
import { AnimatePresence, motion } from "framer-motion";

function OnboardingStep({ step }: { step: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <StepContent step={step} />
      </motion.div>
    </AnimatePresence>
  );
}
```

`mode="wait"` prevents overlapping exits and entrances — critical for multi-step forms where content height changes.

### Layout Animations

Framer Motion's `layout` prop handles reorders beautifully:

```tsx
<motion.li layout layoutId={item.id} className="rounded-lg border border-white/10 p-4">
  {item.title}
</motion.li>
```

I used this on a EU project management tool's kanban board. Dragging cards between columns animated smoothly without manual position calculations.

### Micro-Interactions

Hover, tap, and focus feedback:

```tsx
<motion.button
  whileHover={{ y: -2 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
  className="px-5 py-2.5 bg-cyan-400 text-black font-bold"
>
  Save changes
</motion.button>
```

These subtle motions improve perceived quality. Users describe the UI as "responsive" even when data load times are unchanged.

## GSAP: Where It Wins

### Scroll-Driven Storytelling

The US agency homepage I mentioned used GSAP ScrollTrigger:

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=120%",
        scrub: 0.6,
        pin: true,
      },
    });

    tl.from(".hero-title", { y: 80, opacity: 0, duration: 0.8 })
      .from(".hero-subtitle", { y: 40, opacity: 0, duration: 0.6 }, "-=0.5")
      .from(".hero-cta", { scale: 0.9, opacity: 0, duration: 0.5 }, "-=0.3")
      .to(".hero-image", { scale: 1.08, duration: 1.2 }, 0);
  });

  return () => ctx.revert();
}, []);
```

`gsap.context()` plus cleanup on unmount prevents ScrollTrigger leaks — a common production bug when React re-renders recreate animations.

### Complex Timelines Across Non-React DOM

GSAP works on any DOM. For an Astro portfolio section with vanilla JS islands, GSAP doesn't require wrapping everything in React components. Framer Motion would.

### SVG and Morphing

A fintech client's landing page had an animated chart line drawing on scroll. GSAP's DrawSVG plugin (Club GreenSock) handled it in ~30 lines. Framer Motion would fight SVG path lengths.

## Decision Matrix From Real Projects

| Scenario | My choice | Why |
|----------|-----------|-----|
| React modal enter/exit | Framer Motion | `AnimatePresence` is built for this |
| Kanban / sortable lists | Framer Motion | `layout` animations |
| Marketing scroll narrative | GSAP + ScrollTrigger | Timeline scrubbing, pinning |
| Astro static site animations | GSAP or CSS | No React runtime needed |
| SVG line drawing | GSAP | Plugin ecosystem |
| Mobile drawer menu | Framer Motion | Gesture + spring physics |
| Hero parallax (5+ elements) | GSAP | Precise stagger control |

## Using Both Together

This is normal on client projects. I don't pick one library for the entire codebase.

On a recent EU e-commerce launch:

- **Framer Motion** — product card hovers, cart drawer, filter panel
- **GSAP** — homepage scroll story, brand film section
- **CSS** — simple fades on blog content (no JS cost)

Bundle size matters. Framer Motion is ~30KB gzipped. GSAP core is smaller but plugins add up. Load GSAP only on pages that need scroll choreography.

```tsx
const ScrollHero = lazy(() => import("./ScrollHero")); // contains GSAP
```

## Performance Considerations

Animations should run on the compositor thread when possible.

**Animate these (cheap):**
- `transform` (translate, scale, rotate)
- `opacity`

**Avoid animating (expensive):**
- `width`, `height`, `top`, `left`
- `box-shadow` on large elements
- `filter: blur()` on full-screen layers

```tsx
// Good — GPU-friendly
animate={{ x: 0, opacity: 1 }}

// Bad — triggers layout every frame
animate={{ width: "100%" }}
```

For lists with many animated children, I cap simultaneous tweens. On a US client's team page with 40 employee cards, we staggered entrance by 50ms and only animated opacity + translateY — held 60fps on mid-range Android.

**INP impact:** scroll-linked animations with `scrub` are generally fine because they're driven by scroll position, not main-thread input handlers. Heavy `mousemove` parallax is not — it fires constantly and tanks INP. I use CSS `transform: translateX(var(--parallax))` with scroll-driven custom properties where possible.

## Accessibility: `prefers-reduced-motion`

Animation without an accessibility plan is negligence.

```tsx
import { useReducedMotion } from "framer-motion";

function FadeIn({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
    >
      {children}
    </motion.div>
  );
}
```

For GSAP:

```tsx
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  gsap.set(".hero-title, .hero-subtitle, .hero-cta", { opacity: 1, y: 0 });
} else {
  // full timeline
}
```

WCAG 2.2 doesn't ban motion — it requires respecting user preference. I also avoid flashing content (>3 flashes per second) and provide non-animated paths to all information.

## SEO Considerations

Google renders JavaScript, but content hidden at `opacity: 0` without animation completing can theoretically affect LCP element detection. For hero text that starts invisible:

- Ensure content is in the DOM (not delayed by JS fetch)
- Keep initial animation under 500ms for above-fold content
- On content sites, prefer CSS `@keyframes` with `animation-fill-mode: forwards`

For Astro content sites, I default to CSS animations for blog/prose and reserve GSAP for marketing landing pages where the client budget supports the JS cost.

## Common Mistakes

**Animating everything.** Motion fatigue is real. If every element bounces, nothing feels special.

**No cleanup in React + GSAP.** ScrollTrigger instances survive route changes and cause scroll jank. Always `ctx.revert()`.

**Ignoring mobile performance.** A scroll-pinned hero that works on a MacBook Pro stutters on a 2020 Android phone. Test on real devices.

**800ms+ durations.** UI animations should feel snappy — 200–400ms for micro-interactions, 600–800ms max for hero entrances.

**Disabling focus outlines while animating.** If you animate buttons, keep `focus-visible` styles.

**Loading Framer Motion on Astro static pages.** Wrap in a `client:visible` island or use CSS instead.

## Client Project: Portfolio for a Creative Director

A Berlin creative director wanted "cinematic" page loads. We used:

- GSAP for horizontal scroll gallery (pinned section, 6 panels)
- Framer Motion for project card hover reveals
- CSS `@media (prefers-reduced-motion)` fallback that showed all panels in a vertical stack

Total animation JS: ~45KB gzipped, loaded only on the homepage. Inner pages used CSS transitions only. Lighthouse performance score stayed at 94 mobile.

The client cared about the homepage impression. Users spent 80% of session time on case study pages — so we kept those lean.

## Best Practices I Follow

1. **Define a motion budget** per page (max KB, max simultaneous animations)
2. **Respect `prefers-reduced-motion`** on every animated component
3. **Use Framer Motion for React UI** — modals, lists, gestures
4. **Use GSAP for scroll narratives** — pinning, scrubbing, complex stagger
5. **Lazy-load animation libraries** on routes that need them
6. **Animate transform + opacity only** unless there's a strong reason not to
7. **Clean up GSAP contexts** on React unmount
8. **Test on mid-range mobile** with CPU throttling

## Astro and Static Sites: Animation Without React Bloat

This portfolio is Astro-first. For blog and marketing sections, I use CSS animations and minimal JS. When a client needs scroll storytelling on Astro, GSAP loads in a `<script>` tag or island — not Framer Motion across the whole site.

```astro
<section class="hero" data-animate-hero>
  <h1 class="hero-title">Ship faster</h1>
</section>

<script>
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".hero-title", { y: 40, opacity: 0, duration: 0.8 });
  }
</script>
```

The performance win: zero React hydration for static content. Animations enhance — they don't block rendering.

## Negotiating Animation Scope With Clients

Animation is where budgets expand. I scope in proposals:

- **Tier 1:** CSS transitions, hover states (included)
- **Tier 2:** Framer Motion page transitions, component entrances (+2–3 days)
- **Tier 3:** GSAP scroll narrative, pinned sections (+5–8 days)

A Berlin agency tried to bundle Tier 3 into a two-week landing page. We delivered Tier 1 + selective Tier 2 on hero and CTA only. The site still felt premium because motion was focused, not everywhere.

## Debugging Animation Jank

When animations stutter in production:

1. Chrome Performance → check for long tasks during scroll
2. Verify no `width`/`height` animations on large elements
3. Count active ScrollTrigger instances — leaks multiply on SPA navigations
4. Test with `prefers-reduced-motion` off AND on

On a US SaaS marketing site, jank came from animating `box-shadow` on 20 cards simultaneously. Switching to `opacity` + `translateY` fixed it.

## E-Commerce Product Page Motion

On a EU fashion client's product pages, we used Framer Motion sparingly:

- Image gallery swipe — Framer Motion drag gestures
- Add-to-cart button — `whileTap` scale only
- No scroll animations on product description — content readability first

Cart conversion improved after we **removed** a scroll-triggered size guide animation that obscured the CTA on mobile. Motion should guide attention, not compete with revenue.

## Internal Linking Between Animation and Performance Content

Animation choices affect Core Web Vitals. I cross-reference performance budgets with motion scope in every proposal. If you're optimizing INP on the same site where we're adding ScrollTrigger pinning, we measure before and after on real devices — not just Lighthouse in CI.

## Conclusion

Framer Motion and GSAP aren't competitors — they overlap in some areas but optimize for different problems. I choose based on the interaction: component lifecycle vs scroll timeline, React vs framework-agnostic, micro-interaction vs cinematic sequence.

The agencies that struggle picked one library and forced every animation through it. The projects that feel premium used the right tool per job and respected performance and accessibility from the start.


Faithful motion from design files is implementation work; keeping ScrollTrigger off the LCP path is performance work. I handle both as a [Figma to code developer](/figma-to-code-developer) and, when field CWV is failing, through [website performance optimization](/website-performance-optimization).

## Key Takeaways

- Framer Motion for React component animations, layout, and gestures
- GSAP + ScrollTrigger for scroll-driven storytelling and complex timelines
- Using both on the same project is normal — split by interaction type
- Animate `transform` and `opacity` for GPU-friendly performance
- Always handle `prefers-reduced-motion` with instant or simplified fallbacks
- Clean up GSAP with `gsap.context().revert()` in React `useEffect` cleanup
- Lazy-load animation libraries; set a per-page motion budget
- Test on real mobile devices — scroll-pinned heroes are a common failure point
