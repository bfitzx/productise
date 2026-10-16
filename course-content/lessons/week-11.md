---
week: 11
title: Ship to Real Users
phase: "4. Full-stack product"
hours: "8–10"
topics: [Playwright, end-to-end testing, row-level security, least privilege, state management, design tokens, prioritisation, queues]
threads: ["A. Prioritisation", "C. E2E tests", "D. Least privilege / RLS", "E. State management + design tokens"]
system_design: "Queues, async work, idempotency, retries, dead-letter queues"
mock_review: "\"Why did we pick Postgres?\" architecture review (Principal SWE)"
ways_of_working: "Reading an engineering org"
deliverable: "FollowUp v1 in the hands of 5+ real users, with e2e tests and RLS"
---

# Week 11 — Ship to Real Users

**Phase 4 · Threads A, C, D and E · System design #4 · Mock review #3 · Ways of working: reading an engineering org**

## 1. Concept brief

**Vocabulary**

- **End-to-end (e2e) test:** drives a real browser through a real user flow. Slow and valuable, so keep them few.
- **Flaky test:** passes and fails without code changes, usually because of timing. Fix it or delete it.
- **Row-level security (RLS):** Postgres policies that filter rows per user, so the database enforces authorisation even if app code forgets to.
- **Least privilege:** every key, role and service gets only the access it needs.
- **State management:** where UI state lives — URL, server, local component state, or a global store. Prefer the URL and the server.
- **Design tokens:** named values for colour, spacing and type that every component uses.
- **Queue:** a buffer of jobs processed asynchronously by workers.

## 2. Guided lab (~3 hrs)

**E2E with Playwright:**

```bash
pnpm create playwright
pnpm exec playwright codegen http://localhost:3000   # record a flow, then clean it up
pnpm exec playwright test --ui
```

1. Write three e2e tests: log in (use a test user and Supabase's admin API to create a session), create a request, change its status.
2. Add an axe accessibility check to each.
3. Run them in CI against the preview deployment URL.

**RLS:**

```sql
alter table requests enable row level security;
create policy "owners read" on requests for select using (owner_id = auth.uid());
create policy "owners write" on requests for update using (owner_id = auth.uid());
```

Then:

1. Write a test that proves user B gets zero rows.
2. Check which database role your app connects as. Does it really need superuser? Create a restricted role.

**Tokens and state:**

1. Move colours and spacing into CSS variables or Tailwind theme tokens.
2. Audit your components for state: what should live in the URL (filters), on the server (data) or locally (an open modal)?

## 3. Unguided challenge (~2.5 hrs) — ship

- **Prioritise ruthlessly (Thread A).** List everything you want to add. Set an appetite of 2 hours. Write the **"not doing" list**.
- Ship the remaining must-haves, then invite **5+ real users**.
- Add a feedback link and basic error tracking. The Sentry free tier is fine: `pnpm dlx @sentry/wizard@latest -i nextjs`.

**Acceptance criteria:**

- 5+ people have logged in and used the app for real.
- CI runs unit, e2e and axe checks.
- RLS is proven by a test.

## 4. System design #4 — queues (~1 hr)

Design **reliable outbound notifications** for the ticket service: 50k emails/SMS/webhooks a day, recipient time zones and quiet hours, retries with backoff, and no customer notified twice.

Cover:

- queue choice (SQS, a Postgres-backed queue such as pg-boss, or Kafka)
- idempotency keys
- at-least-once vs exactly-once delivery
- dead-letter queues
- poison messages
- visibility timeouts
- what the on-call engineer sees when it breaks

Write an ADR and an exec summary.

## 5. Mock review #3 — "Why Postgres?" (~1 hr)

Claude plays a principal engineer who would have picked DynamoDB. Defend Postgres for FollowUp *and* for the support-conversations datastore from week 7. Cover scaling limits, connection pooling, RLS and cost. Concede where they're right.

## 6. Ways of working (~30 min)

**Reading an engineering org.** RFCs, ADRs, incident reviews, on-call rotations and the tech-debt register are the documents that show how an engineering team really works. Find one example of each at your organisation, or a public one. What do they tell you about how decisions get made?

## 7. Check

1. Why keep e2e tests few?
2. What does RLS protect against that app-level checks don't?
3. At-least-once delivery means your consumer must be ____?
4. What's a dead-letter queue for?
5. Why put filters in the URL?

Recycled:

- What's an IDOR?
- Name the three Core Web Vitals.

## 8. Teach-back

Write "Shipping my first app to real users: what surprised me."

## Done when

- [ ] E2E plus axe running in CI
- [ ] RLS proven and the app uses a least-privilege role
- [ ] Design tokens in place
- [ ] 5+ real users onboarded
- [ ] "Not doing" list written
- [ ] Queue design defended
- [ ] Mock review done
- [ ] Check and teach-back done
