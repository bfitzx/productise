---
week: 10
title: Auth, Deploy, Accessibility and Security
phase: "4. Full-stack product"
hours: "8–10"
topics: [authentication, sessions, OAuth, Vercel, environments, accessibility, WCAG, Core Web Vitals, OWASP Top 10]
threads: ["A. User research", "D. OWASP Top 10", "E. Accessibility", "E. Performance"]
ways_of_working: "Cost-aware building"
deliverable: "FollowUp deployed with auth, accessible, and security-reviewed; 5 user conversations done"
---

# Week 10 — Auth, Deploy, Accessibility and Security

**Phase 4 · Threads A, D and E · Ways of working: cost-aware building**

## 1. Concept brief

**Vocabulary**

- **Authentication vs authorisation:** who you are vs what you're allowed to do.
- **Session vs JWT:** a server-stored session referenced by a cookie, vs a signed token the client carries.
- **OAuth / OIDC:** "sign in with Google". The provider vouches for identity.
- **Magic link:** passwordless email login.
- **Environments:** local → preview (one per PR) → production. Each has its own environment variables and database.
- **WCAG:** accessibility guidelines covering perceivable, operable, understandable and robust. AA is the usual target.
- **Core Web Vitals:**
  - **LCP:** loading
  - **INP:** responsiveness
  - **CLS:** layout stability
- **OWASP Top 10:** the most common web security risks.

## 2. Guided lab (~3 hrs)

**Auth with Supabase:**

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

1. Follow the Supabase Next.js server-side auth guide to add magic-link login and middleware that refreshes the session.
2. Protect every page except `/login`.
3. Store `owner_id` on requests.

**Deploy:**

1. Create a hosted Supabase project and run your migrations against it.
2. Deploy:

```bash
pnpm dlx vercel@latest link
pnpm dlx vercel@latest env add DATABASE_URL production
pnpm dlx vercel@latest --prod
```

3. Open a PR and check that Vercel creates a preview deployment. Which database is it using? Should it?

**Accessibility and performance:**

```bash
pnpm add -D @axe-core/playwright   # used next week in e2e
```

- Run Lighthouse in Chrome DevTools on production and record LCP, INP, CLS and the accessibility score.
- Do a keyboard-only pass: can you create and update a request without a mouse?
- Turn on VoiceOver (Cmd-F5) and complete one task. Fix missing labels, focus states and contrast.

## 3. Unguided challenge (~2 hrs) — OWASP pass

Attack your own app and fix what you find. Document each finding as risk → test → fix.

- **Broken access control / IDOR:** can user A fetch or update user B's request by changing the ID in the URL?
- **Injection:** are all queries parameterised? (Drizzle does this. Prove it.)
- **XSS:** put `<img src=x onerror=alert(1)>` in a request title. Is it escaped?
- **CSRF:** how are Server Actions protected?
- **Security headers:** check them with `curl -I` on your production URL. Add a CSP.
- **SSRF:** if you added any "fetch this URL" feature, how would you protect it?

**Acceptance criteria:**

- A `docs/security-review.md` with at least 6 checks.
- Every issue you found is fixed with a test.

## 4. Thread A — user research (~1.5 hrs)

Run **5 short conversations** with real target users, or simulate them with Claude playing distinct personas if you must, and label them as simulated. Use a script that asks about their current workaround, the last time it failed, and what they'd pay attention to.

Synthesise the findings into:

- themes
- quotes
- surprises
- what you'll change

## 5. Ways of working (~1 hr)

**Cost-aware building.** Estimate FollowUp's monthly cost at 10, 1,000 and 100,000 users across Vercel, Supabase, email and (later) LLM tokens. What dominates at each scale? When does "free tier" become a trap?

## 6. Check

1. What's the difference between authentication and authorisation?
2. What is an IDOR, and how do you prevent it?
3. Why should preview deployments not use the production database?
4. What does CLS measure?
5. Name three things a keyboard-only user needs.

Recycled:

- When would you use ISR?
- What's a migration?

## 7. Teach-back

Write "I attacked my own app: what I found."

## Done when

- [ ] Auth working, deployed to production and preview
- [ ] Lighthouse and keyboard pass documented and fixed
- [ ] OWASP review with fixes and tests
- [ ] 5 conversations synthesised
- [ ] Cost model written
- [ ] Check and teach-back done
