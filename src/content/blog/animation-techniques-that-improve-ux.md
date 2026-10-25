---
title: "Animation Techniques That Actually Improve UX"
description: "Motion with purpose — not decoration. How I use CSS transitions, Framer Motion, and GSAP to guide attention, provide feedback, and make interfaces feel polished without hurting performance."
publishDate: 2026-04-08
updatedDate: 2026-06-10
category: "UX"
tags: ["Animation", "UX", "Framer Motion", "CSS"]
featured: false
accent: "#00D4AA"
image: "../../assets/blog/animation-techniques-that-improve-ux.jpg"
imageAlt: "Smooth motion and animation design concept"
---

Animation is the first thing clients ask for and the first thing users disable when it makes them sick. I've watched agencies pitch "delightful micro-interactions" that turned into 800ms page transitions, parallax sections that tanked Lighthouse scores, and loading spinners that appeared after animations finished animating. The gap between animation that impresses in a demo and animation that serves users in production is where most frontend motion work fails.

After building animated interfaces for SaaS onboarding flows, e-commerce product pages, portfolio sites, and dashboard applications, I've developed a clear framework: animation should communicate state changes, guide attention, and provide feedback. Everything else is optional — and often harmful.

This article covers the techniques I use when a client says "make it feel smooth" and I need to deliver motion that improves UX without becoming a performance liability or accessibility failure.

## The Purpose Framework: When to Animate

Before choosing a library or writing keyframes, I ask what job the animation performs:

| Purpose | Example | Duration |
|---------|---------|----------|
| **Feedback** | Button press, form submission success | 100–200ms |
| **State change** | Modal open, tab switch, accordion expand | 200–300ms |
| **Guidance** | Highlight new feature, draw eye to CTA | 300–500ms |
| **Spatial continuity** | Page transition, list reorder, shared element | 300–400ms |
| **Delight** | Confetti on milestone, playful empty states | 500ms+ (sparingly) |

If an animation doesn't fit a purpose, remove it. Clients rarely push back when you frame it as "this animation adds 200ms to every interaction on the checkout page."

**The rule I follow:** feedback animations under 200ms, state changes under 300ms, never block user input during animation. Users should be able to click the next button before the previous animation finishes.

## CSS Transitions: The Foundation

Most UI motion doesn't need a JavaScript library. CSS transitions handle hover states, color changes, opacity fades, and simple transforms with zero bundle cost and GPU acceleration.

```css
.button {
  background-color: var(--color-primary);
  transform: scale(1);
  transition:
    background-color 150ms ease,
    transform 100ms ease;
}

.button:hover {
  background-color: var(--color-primary-hover);
}

.button:active {
  transform: scale(0.97);
}

.card {
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 300ms ease,
    transform 300ms ease;
}

.card.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

Toggle visibility with a class via Intersection Observer for scroll-triggered reveals:

```tsx
export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
```

**Easing matters.** Linear motion feels robotic. I default to `ease` for general transitions and `cubic-bezier(0.34, 1.56, 0.64, 1)` for subtle overshoot on elements that need energy — buttons, notifications. Avoid `ease-in` for elements entering the screen; they feel sluggish at the start.

## Respecting `prefers-reduced-motion`

This is non-negotiable. Vestibular disorders affect a significant user population, and operating systems expose a preference for reduced motion.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

In JavaScript libraries, check the preference before animating:

```tsx
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const duration = prefersReducedMotion ? 0 : 0.3;
```

Framer Motion handles this with the `useReducedMotion` hook:

```tsx
import { useReducedMotion } from "framer-motion";

function AnimatedModal({ isOpen, children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

I include reduced motion support in every client project proposal. It's a legal requirement in some jurisdictions and a moral one everywhere.

## Framer Motion for React State Transitions

When CSS transitions can't handle the logic — exit animations, layout changes, gesture-driven motion — I reach for Framer Motion. It's my default React animation library because of `AnimatePresence`, layout animations, and the declarative API.

**Modal with enter/exit:**

```tsx
import { AnimatePresence, motion } from "framer-motion";

export function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <h2 id="modal-title">{title}</h2>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

`AnimatePresence` is essential — without it, React unmounts components immediately and exit animations never play.

**List animations for add/remove:**

```tsx
function CartItems({ items }) {
  return (
    <ul>
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.li
            key={item.id}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CartLineItem item={item} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
```

The `layout` prop animates position changes when siblings are added or removed — critical for cart and notification lists where items shift without jarring jumps.

## Layout Animations and Shared Element Transitions

Layout animations solve the "this element moved and it looked like a glitch" problem. When a sidebar collapses, a grid reflows, or a card expands, `layout` on Framer Motion components interpolates between positions.

```tsx
<motion.div layout className="sidebar" style={{ width: isCollapsed ? 64 : 240 }}>
  <nav>{/* nav items */}</nav>
</motion.div>
```

For shared element transitions — a product thumbnail expanding into a detail view — use `layoutId`:

```tsx
// Product grid
<motion.img layoutId={`product-${product.id}`} src={product.image} />

// Product detail page
<motion.img layoutId={`product-${product.id}`} src={product.image} />
```

Framer Motion morphs between the two elements if they're in an `AnimatePresence` tree during navigation. The effect communicates spatial relationship between views — users understand they're looking at the same object, not a new page.

**Performance note:** Layout animations trigger reflows. Use them on small element counts. Animating layout on a 200-item virtualized list will stutter. For large lists, animate only opacity and transform.

## GSAP for Complex Timeline Animation

Framer Motion handles 90% of UI motion. I reach for GSAP when timelines get complex — sequenced hero animations, scroll-driven storytelling, SVG path animations, or physics-based effects.

```tsx
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.from(".hero-title", { y: 40, opacity: 0, duration: 0.6 })
        .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.4 }, "-=0.2")
        .from(".hero-image", { scale: 0.9, opacity: 0, duration: 0.7 }, "-=0.4");
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef}>
      <h1 className="hero-title">Build faster</h1>
      <p className="hero-subtitle">Ship products users love</p>
      <button className="hero-cta">Get started</button>
      <img className="hero-image" src="/hero.png" alt="" />
    </div>
  );
}
```

GSAP's timeline with overlap (`"-=0.3"`) creates choreographed sequences that would be painful in CSS. ScrollTrigger pins sections and scrubs animations to scroll position — powerful for marketing pages, dangerous for performance if overused.

**Rule for client marketing pages:** one scroll-driven section per page maximum. Every additional ScrollTrigger instance adds scroll listener overhead and complicates mobile behavior.

## Loading States and Skeleton Screens

Animation during loading serves a psychological purpose — perceived performance. A skeleton screen with a subtle pulse feels faster than a blank page with a spinner, even when load times are identical.

```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-secondary) 25%,
    var(--surface-tertiary) 50%,
    var(--surface-secondary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    opacity: 0.6;
  }
}
```

Match skeleton layout to actual content layout — mismatched skeletons that morph into different structures cause layout shift and feel broken:

```tsx
function ProductCardSkeleton() {
  return (
    <div className="product-card">
      <div className="skeleton" style={{ aspectRatio: "1", width: "100%" }} />
      <div className="skeleton" style={{ height: 16, width: "60%", marginTop: 12 }} />
      <div className="skeleton" style={{ height: 14, width: "40%", marginTop: 8 }} />
      <div className="skeleton" style={{ height: 20, width: "30%", marginTop: 12 }} />
    </div>
  );
}
```

For button loading states, animate the transition between label and spinner — don't swap abruptly:

```tsx
function SubmitButton({ isLoading, children }) {
  return (
    <button disabled={isLoading} className="submit-button">
      <motion.span
        animate={{ opacity: isLoading ? 0 : 1, width: isLoading ? 0 : "auto" }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.span>
      {isLoading && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: 0.1 }}
        >
          <Spinner size="sm" />
        </motion.span>
      )}
    </button>
  );
}
```

## Page Transitions in SPA and SSR Apps

Page transitions in React SPAs risk feeling slow if every navigation animates a full-screen fade. I use subtle transitions — content area opacity fade, or a progress bar at the top.

```tsx
// Next.js with Framer Motion template pattern
"use client";

import { motion } from "framer-motion";

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

For Next.js App Router, the `template.tsx` file re-mounts on navigation, triggering the animation. Keep duration under 200ms — users navigating between dashboard pages want speed, not theatre.

NProgress-style top bars work well for data-fetching navigation:

```tsx
import NProgress from "nprogress";

export function useRouteProgress() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.done();
  }, [pathname]);
}
```

## Performance: Animate Only Transform and Opacity

Browsers composite `transform` and `opacity` on the GPU without triggering layout or paint. Animating `width`, `height`, `top`, `left`, or `margin` causes reflows that jank on lower-end devices.

```css
/* Bad — triggers layout on every frame */
.panel {
  transition: width 300ms ease;
}

/* Good — GPU composited */
.panel {
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 300ms ease;
}
.panel.is-open {
  transform: scaleX(1);
}
```

When you need height animations (accordions), use `height: auto` tricks carefully or Framer Motion's layout animation which handles measurement. Test on a throttled CPU in Chrome DevTools — if frames drop below 60fps, simplify.

**Will-change sparingly:**

```css
.modal-content {
  will-change: transform, opacity;
}
```

Apply `will-change` only during animation, remove after. Permanent `will-change` wastes GPU memory.

## Real Scenarios: Animation Decisions on Client Projects

**E-commerce product page:** Image gallery uses crossfade between thumbnails (CSS opacity, 150ms). Add-to-cart button scales on press (CSS transform, 100ms). Cart drawer slides in from right (Framer Motion, 250ms spring). No parallax, no scroll-jacking.

**SaaS onboarding:** Step transitions use horizontal slide (Framer Motion, 300ms) to communicate progression. Progress bar fills with CSS transition. Celebration confetti on completion (GSAP, one-time, 1.5s) — disabled with `prefers-reduced-motion`.

**Portfolio site:** Hero text staggers in with GSAP timeline (one-time on load). Project cards fade up on scroll (Intersection Observer + CSS). Client wanted "wow factor" — delivered with performant techniques that score 95+ on Lighthouse.

**Dashboard app:** Minimal animation. Table row hover highlight (CSS, 100ms). Toast notifications slide in (Framer Motion, 200ms). Sidebar collapse uses layout animation. No page transitions — data density is the priority.

## Common Animation Mistakes

1. **Animating everything** — motion fatigue is real; users stop noticing and start waiting
2. **Blocking interactions** — disable buttons during 500ms "success" animations
3. **Ignoring reduced motion** — legal and ethical requirement
4. **Animating layout properties** — width, height, margin cause jank
5. **Heavy scroll listeners** — ScrollTrigger on every section kills mobile performance
6. **No animation on instant state changes** — jarring pops when items appear/disappear without transition
7. **Autoplay video backgrounds** — not animation libraries, but the worst UX offender in the same conversations

## Conclusion

Animation improves UX when it communicates — feedback on actions, continuity between states, guidance to important elements. It hurts UX when it decorates, delays, or excludes users with vestibular sensitivities.

My client workflow: start with CSS transitions for 80% of needs, add Framer Motion for enter/exit and layout, reserve GSAP for hero and marketing moments. Measure performance after every animation pass. Test with reduced motion enabled.

The interfaces clients remember as "polished" are almost always the ones where motion is purposeful and invisible — users feel the quality without consciously noticing the animations.


Motion that improves UX still has to respect INP and reduced-motion. When animations are part of a wider speed problem, fold them into [website performance optimization](/website-performance-optimization) — not a separate vanity pass.

## Key Takeaways

- **Every animation needs a purpose** — feedback, state change, guidance, or spatial continuity. Decorative motion is optional and often removable.
- **CSS transitions handle most UI motion** with zero bundle cost; reach for libraries when you need exit animations, layout, or timelines.
- **`prefers-reduced-motion` is mandatory** — implement globally and in every animation library configuration.
- **Framer Motion excels at React state transitions** — modals, lists, layout changes, and shared element morphing.
- **GSAP is for complex timelines and scroll-driven sequences** — use sparingly on marketing pages, never on data-heavy dashboards.
- **Animate only `transform` and `opacity`** for 60fps performance; skeleton screens beat spinners for perceived speed.
- **Keep durations short** — feedback under 200ms, state changes under 300ms, and never block user input.
