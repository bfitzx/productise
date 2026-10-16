---
week: 9
title: Full-Stack Foundations — Next.js and Postgres
phase: "4. Full-stack product"
hours: "8–10"
topics: [Next.js App Router, React Server Components, SSR, SSG, ISR, Postgres, Supabase, Drizzle, migrations]
threads: ["A. Opportunity tree + north-star metric", "E. Rendering strategies"]
system_design: "Caching — where, invalidation, TTLs"
ways_of_working: "Team Topologies"
deliverable: "A Next.js app reading and writing Postgres, running locally, plus a product brief"
---

# Week 9 — Full-Stack Foundations: Next.js and Postgres

**Phase 4 · Threads A and E · System design #3 · Ways of working: Team Topologies**

## The Phase 4 app

For weeks 9–11 and 20–22 you'll build and run **one real app with real users**. Pick a small, real problem for a group you can reach: your team, a club, family, or a few contacts in your industry.

The default if you don't have one is **FollowUp**, a shared tracker for outstanding requests (approvals, data requests, callbacks, chases), with an owner, a status, due dates and a history.

## 1. Concept brief

**Vocabulary**

- **React component:** a function that returns UI. Props go in, JSX comes out.
- **Server vs Client Components:** Server Components run on the server and can query the database directly; Client Components (`"use client"`) run in the browser and handle interactivity.
- **Rendering strategies:**
  - **SSR:** render per request
  - **SSG:** render at build time
  - **ISR:** static, but regenerated periodically
  - **CSR:** render in the browser
- **Server Action:** a server function called directly from a form.
- **Migration:** a versioned, ordered change to the database schema, checked into git.
- **Connection pooling:** reusing database connections. Serverless functions need it (Supabase's pooler, PgBouncer).

## 2. Guided lab (~3.5 hrs)

```bash
cd ~/dev
pnpm create next-app@latest followup --ts --tailwind --eslint --app --src-dir --use-pnpm
cd followup
brew install supabase/tap/supabase
supabase init && supabase start      # local Postgres in Docker; note the DB URL
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit
```

1. Define the schema in `src/db/schema.ts` with Drizzle: `requests` (id, title, requester, status, owner, due_at, created_at) and `events` (request_id, type, at, note).
2. Create and apply migrations:

```bash
pnpm drizzle-kit generate && pnpm drizzle-kit migrate
psql "$DATABASE_URL" -c '\d requests'
```

3. Write a Server Component page that lists requests (query the database directly), and a form with a Server Action that creates one.
4. Rendering experiment. Make three pages:
   - `/live`, dynamic: `export const dynamic = "force-dynamic"`
   - `/static`, built once
   - `/isr`, with `export const revalidate = 60`

   Print `new Date()` on each. Run `pnpm build && pnpm start` and observe the differences.

## 3. Unguided challenge (~2.5 hrs)

- Add status changes (open → in progress → done) that write to `events`, plus a detail page showing the history.
- Add filtering by status and owner using URL search params.
- Seed script: `pnpm tsx scripts/seed.ts`.

**Acceptance criteria:**

- A schema change is made via a new migration, never by editing the database by hand.
- `pnpm build` passes.
- The README explains how to run it locally from scratch.

## 4. Thread A — product brief (~1 hr)

For your Phase 4 app, write `docs/product-brief.md` covering:

- the problem (the week 3 format)
- an opportunity solution tree: outcome → opportunities → solutions → experiments
- one **north-star metric** and two **guardrail metrics**
- who your first 5 users are

## 5. System design #3 — caching (~1 hr)

Where could you cache in FollowUp? Consider the browser, CDN, Next.js data cache, an in-process cache, Redis and Postgres itself. Then work through:

- When a request's status changes, what goes stale, and how do you invalidate it (`revalidatePath`, tags, TTLs)?
- What breaks if two users edit at once?

Write an ADR and an exec summary, then defend them.

## 6. Ways of working (~1 hr)

**Team Topologies.** There are four team types: stream-aligned, platform, enabling and complicated-subsystem. There are three interaction modes: collaboration, X-as-a-service and facilitating. Map your current organisation onto them. Where is the cognitive load too high?

## 7. Check

1. When would you choose ISR over SSR?
2. Why can a Server Component query the database but a Client Component can't?
3. Why must migrations be in git?
4. What's a guardrail metric?
5. What's the hardest part of caching?

Recycled:

- What does a contract test catch?
- Promise.all vs a sequential await loop?

## 8. Teach-back

Write "SSR, SSG, ISR and CSR explained with newspapers."

## Done when

- [ ] App runs locally with a migrations-managed schema
- [ ] Rendering experiment documented
- [ ] Product brief with opportunity tree and metrics written
- [ ] Caching ADR defended
- [ ] Check and teach-back done
