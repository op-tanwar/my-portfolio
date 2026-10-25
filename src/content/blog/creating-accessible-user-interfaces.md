---
title: "Creating Accessible User Interfaces: A Practical Frontend Guide"
description: "Real accessibility patterns from client work—semantic HTML, keyboard flows, ARIA, contrast, and testing workflows that satisfy WCAG without slowing delivery."
publishDate: 2026-02-18
updatedDate: 2026-06-10
category: "Accessibility"
tags: ["Accessibility", "A11y", "WCAG", "React"]
featured: false
accent: "#00D4AA"
image: "../../assets/blog/creating-accessible-user-interfaces.jpg"
imageAlt: "Inclusive design concept with diverse users"
---

Accessibility came up on a proposal call for a UK government-adjacent contractor portal. The client asked, "Can you make it WCAG 2.1 AA compliant?" I said yes—and then spent the first week auditing their existing React app, which had `<div>` buttons, modals that trapped users with no escape, and form errors that only appeared as red borders with no text.

That project taught me accessibility isn't a checklist you run at the end. It's a design and development discipline that starts with the first component and shows up in code review the same way performance or security does. Over three years of freelance frontend work across US, UK, and EU clients, I've seen teams treat a11y as optional until legal or procurement forces the issue. The teams that bake it in from the start ship faster overall, because they aren't rewriting entire flows after an audit fails.

This guide covers what I actually implement—not abstract WCAG theory, but the patterns, tools, and mistakes that matter on production React, Next.js, and Astro projects.

## Why Accessibility Is a Business Requirement, Not a Nice-to-Have

Roughly 16% of the global population lives with some form of disability. That's not a niche audience—that's a significant share of your users, customers, and employees. In the EU, the European Accessibility Act is expanding requirements. In the US, ADA-related web lawsuits continue to increase. In the UK, public sector sites must meet accessibility standards by law.

But the business case isn't only legal. Accessible interfaces are better interfaces for everyone:

- Captions help people in noisy environments
- Keyboard navigation helps power users and people with temporary injuries
- Clear focus indicators help anyone using a screen in bright sunlight
- Semantic structure helps search engines understand your content

When I pitch accessibility to skeptical clients, I frame it as quality engineering with a compliance bonus—not charity work that slows down the roadmap.

## Semantic HTML: The Foundation Everything Else Builds On

The first rule I teach every team: use the correct HTML element before reaching for ARIA. Browsers ship decades of built-in accessibility for native elements. When you use a `<div>` with `onClick` and `role="button"`, you're reimplementing what `<button>` gives you for free: keyboard activation, focus management, and correct screen reader announcements.

```tsx
// Wrong — looks fine visually, fails accessibility
<div
  className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
  onClick={handleSubmit}
>
  Submit
</div>

// Right — semantic, keyboard accessible, form-associated when needed
<button
  type="submit"
  className="rounded bg-blue-600 px-4 py-2 text-white"
  onClick={handleSubmit}
>
  Submit
</button>
```

**Landmarks and headings** structure the page for screen reader navigation:

```tsx
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4">
        Skip to main content
      </a>
      <header role="banner">
        <nav aria-label="Main navigation">{/* ... */}</nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer role="contentinfo">{/* ... */}</footer>
    </>
  );
}
```

Use one `<h1>` per page. Headings should not skip levels (`h1` → `h3` breaks the document outline). On a marketing site I rebuilt for a EU nonprofit, fixing heading hierarchy alone resolved dozens of screen reader navigation complaints in user testing.

**Mistake I see constantly:** icon-only buttons without accessible names. A trash icon is not a label.

```tsx
<button type="button" aria-label="Delete invoice #1042" onClick={onDelete}>
  <TrashIcon aria-hidden="true" />
</button>
```

## Keyboard Navigation and Focus Management

Every interactive element must be reachable and operable via keyboard. That means:

- Tab order follows visual and logical order
- Custom widgets implement expected key patterns (arrows for tabs, Escape for dismiss)
- Focus is never lost or trapped unintentionally

For modals and dialogs, focus management is non-negotiable:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocus.current = document.activeElement as HTMLElement;
    dialogRef.current?.showModal();
    dialogRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      dialogRef.current?.close();
      previousFocus.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby="dialog-title"
      className="rounded-lg border bg-white p-6 shadow-xl backdrop:bg-black/50"
    >
      <h2 id="dialog-title" className="text-lg font-semibold">{title}</h2>
      {children}
      <button type="button" onClick={onClose} className="mt-4">
        Close
      </button>
    </dialog>,
    document.body
  );
}
```

Using the native `<dialog>` element gives you modal behavior, focus trapping, and backdrop handling with far less custom code than the div-based modals I used to build.

**Focus visibility** must never be removed for aesthetics:

```css
/* Never do this globally */
*:focus { outline: none; }

/* Do this instead */
:focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
}
```

On a US fintech app, the designer wanted invisible focus rings. We compromised: subtle custom rings that matched the brand palette but still met 3:1 contrast against adjacent colors. Compliance and aesthetics can coexist with intentional design.

## ARIA: Use It When HTML Isn't Enough

ARIA fills gaps—it doesn't replace semantics. The first rule of ARIA: don't use ARIA if a native element works.

When you do need ARIA:

**Live regions** for dynamic content:

```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>
```

Use `polite` for non-urgent updates (form saved), `assertive` for critical alerts (payment failed).

**Describedby and labelledby** connect elements to their descriptions:

```tsx
<label htmlFor="email">Email address</label>
<input
  id="email"
  type="email"
  aria-describedby="email-hint email-error"
  aria-invalid={!!error}
  aria-required="true"
/>
<p id="email-hint" className="text-sm text-gray-500">
  We'll send your receipt here.
</p>
{error && (
  <p id="email-error" role="alert" className="text-sm text-red-600">
    {error}
  </p>
)}
```

**Expanded/collapsed states** for disclosure widgets:

```tsx
<button
  type="button"
  aria-expanded={isOpen}
  aria-controls="faq-panel-3"
  onClick={() => setIsOpen(!isOpen)}
>
  What is your refund policy?
</button>
<div id="faq-panel-3" hidden={!isOpen}>
  {/* content */}
</div>
```

## Color, Contrast, and Visual Design

WCAG 2.1 AA requires:

- **4.5:1** contrast for normal text
- **3:1** for large text (18px+ regular or 14px+ bold)
- **3:1** for UI components and graphical objects

I run contrast checks during design handoff, not after implementation. Tools I use daily:

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Figma plugins: Stark, A11y - Color Contrast Checker
- `eslint-plugin-jsx-a11y` in CI

Don't rely on color alone to convey meaning:

```tsx
// Bad — red/green only indicates status
<span className={status === "error" ? "text-red-500" : "text-green-500"}>
  {status}
</span>

// Good — icon + text + color
<span className="flex items-center gap-2">
  {status === "error" ? (
    <XCircleIcon aria-hidden className="text-red-500" />
  ) : (
    <CheckCircleIcon aria-hidden className="text-green-500" />
  )}
  <span>{status === "error" ? "Failed" : "Complete"}</span>
</span>
```

On the government contractor portal, we had a dashboard that used only green and amber dots for system health. Colorblind users couldn't distinguish statuses. Adding shapes (checkmark vs. triangle) and text labels fixed it without redesigning the layout.

## Forms: Where Most Accessibility Audits Fail

Forms are the highest-impact area for accessibility work because they're where users complete critical tasks—sign up, pay, apply, submit support tickets.

My form checklist:

1. Every input has a visible `<label>` associated via `htmlFor`/`id`
2. Required fields are indicated in text, not only with `*`
3. Errors are programmatically associated and announced
4. Autocomplete attributes are set correctly
5. Field groups use `<fieldset>` and `<legend>`

```tsx
<fieldset>
  <legend className="text-base font-medium">Shipping address</legend>
  <div className="grid gap-4">
    <div>
      <label htmlFor="street">Street address</label>
      <input
        id="street"
        name="street"
        autoComplete="street-address"
        required
        aria-required="true"
      />
    </div>
    {/* more fields */}
  </div>
</fieldset>
```

**Mistake:** placeholder text as the only label. Placeholders disappear on input and often fail contrast requirements. They're hints, not labels.

## Images, Media, and Motion

**Alt text** should convey the image's purpose, not describe every pixel:

```tsx
// Decorative — empty alt
<img src="/hero-pattern.svg" alt="" aria-hidden="true" />

// Informative
<img
  src="/team-photo.jpg"
  alt="Five team members collaborating around a whiteboard in the London office"
/>

// Functional (linked image)
<a href="/pricing">
  <img src="/pricing-banner.png" alt="View pricing plans" />
</a>
```

**Video and audio** need captions and transcripts for prerecorded content. Autoplaying media should be avoided or muted with user control.

**Motion and animation** must respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

A US client's marketing site had scroll-triggered animations that made users with vestibular disorders nauseous. Adding reduced-motion support was a half-day fix that eliminated an entire category of support tickets.

## Real Project Scenario: WCAG Remediation on a React SaaS App

A EU HR software company hired me for a four-week accessibility sprint before their enterprise sales cycle. Their app served 50,000 users; a prospect's procurement team had flagged accessibility in a security questionnaire.

**Week 1 — Audit**
- Automated scan with axe DevTools across 40 core pages
- Manual keyboard walkthrough of primary user journeys
- Screen reader testing with NVDA (Windows) and VoiceOver (macOS)
- Delivered prioritized issue list: 12 critical, 28 serious, 45 moderate

**Week 2 — Critical fixes**
- Replaced div-buttons with semantic buttons across shared components
- Fixed modal focus trap and Escape handling
- Added skip link and landmark regions to app shell
- Form error association on checkout and onboarding flows

**Week 3 — Component library**
- Updated design system: focus styles, contrast-compliant color tokens
- Documented a11y requirements per component in Storybook
- Added `eslint-plugin-jsx-a11y` to CI (warnings → errors over two weeks)

**Week 4 — Verification**
- Retest with assistive technology
- Client team training: 90-minute workshop on keyboard testing and alt text
- Delivered VPAT-aligned documentation for the prospect

Result: critical issues to zero. The enterprise deal closed. The component library changes meant new features inherited accessibility by default.

## Testing Workflow I Use on Every Project

Accessibility testing is layered—no single tool catches everything.

**Automated (CI on every PR):**
- `eslint-plugin-jsx-a11y`
- `@axe-core/playwright` on critical paths
- Lighthouse accessibility score as a trend, not a gate (it misses a lot)

**Manual (every sprint):**
- Tab through new features without a mouse
- VoiceOver or NVDA on one major flow per release
- 200% browser zoom—does layout break? Is text still readable?

**User testing (quarterly for long engagements):**
- Include participants who use assistive technology
- Observe task completion, don't lead them

```typescript
// e2e/a11y/checkout.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("checkout page has no critical a11y violations", async ({ page }) => {
  await page.goto("/checkout");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(results.violations.filter((v) => v.impact === "critical")).toEqual([]);
});
```

## Building an Accessibility Culture on Small Teams

Freelancers leave; patterns should stay. What I document for handoff:

- **Component a11y requirements** — every Button has focus style, every Dialog traps focus
- **PR review checklist** — keyboard test, alt text, form labels, contrast check for new colors
- **Definition of done** — includes "no new axe critical/serious violations"
- **Known gaps log** — honest list of deferred items with remediation timeline

Accessibility isn't one person's job. On the HR SaaS project, the designer started including focus states in Figma. The backend developer added proper error messages to API responses so the frontend could announce them. That cross-functional shift mattered more than any individual fix I shipped.

## Conclusion

Creating accessible user interfaces isn't about achieving a perfect Lighthouse score or memorizing every WCAG success criterion. It's about respecting the people who use what you build—whether they navigate with a keyboard, hear your interface through a screen reader, or need sufficient contrast to read a form at all.

The patterns in this article—semantic HTML, keyboard flows, intentional ARIA, contrast-aware design, and layered testing—are the same ones I implement on client projects where accessibility is contractual and on projects where it's simply the right thing to do. Both deserve the same rigor.

Start with the next component you build. Use a real `<button>`. Add a visible focus ring. Write alt text that means something. Small decisions compound into interfaces everyone can use.


Accessible implementation of keyboard, focus, and form patterns is part of faithful design delivery — not an optional extra. Ask for it explicitly when you hire a [Figma to code developer](/figma-to-code-developer).

## Key Takeaways

- Accessibility is a business and legal requirement in US, UK, and EU markets—not an optional polish phase
- Use semantic HTML first; ARIA only fills gaps native elements can't cover
- Every interactive element needs keyboard access, visible focus, and an accessible name
- Modals and dialogs require focus trapping, Escape dismissal, and focus restoration on close
- Don't rely on color alone; pair status indicators with text, icons, or shapes
- Forms need visible labels, associated errors, and proper `autocomplete` attributes
- Respect `prefers-reduced-motion` and provide captions/transcripts for media
- Layer testing: automated axe/eslint in CI, manual keyboard and screen reader checks each sprint
- Fix shared components first—accessibility improvements in the design system multiply across the app
- Document patterns and PR checklists so accessibility survives after the freelancer leaves
