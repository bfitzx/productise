---
week: 7
title: TypeScript and Async
phase: "3. Code core"
hours: "8–10"
topics: [TypeScript, Node.js, pnpm, types vs interfaces, async/await, promises, fetch, zod]
threads: ["C. DSA kata"]
system_design: "Datastores — relational vs document vs key-value"
ways_of_working: "Trunk-based development, feature flags, DORA metrics"
deliverable: "A typed TypeScript client and CLI for the ticket service"
---

# Week 7 — TypeScript and Async

**Phase 3 · System design #2 · Ways of working: trunk-based development and DORA**

## 1. Concept brief

TypeScript is JavaScript with a type system, and it's the language of most modern frontends and a lot of backends. The key mental shift is **async**: almost everything (network, disk) returns a *promise* you `await`.

**Vocabulary**

- **Type vs interface:** both describe shapes. Interfaces can be extended and merged; types handle unions (`"a" | "b"`).
- **Union / narrowing:** `string | null`, then `if (x)` narrows it to `string`.
- **Generics:** `Array<T>` — types that take types.
- **Promise / async / await:** a value that arrives later. `await` pauses the function, not the program.
- **Runtime validation:** TS types disappear at runtime; `zod` validates real data from the network.
- **Event loop:** how Node runs many I/O tasks on one thread.
- **pnpm:** a fast, disk-efficient npm alternative.

## 2. Guided lab (~3 hrs)

```bash
npm i -g pnpm
mkdir -p ~/dev/ticket-client && cd $_
pnpm init
pnpm add zod
pnpm add -D typescript tsx @types/node vitest
pnpm tsc --init --strict --target es2022 --module nodenext --moduleResolution nodenext
```

Create `src/client.ts`:

```ts
import { z } from "zod";

export const Status = z.enum(["open", "pending", "resolved", "escalated"]);
export const Ticket = z.object({
  id: z.number(),
  account_id: z.string(),
  customer_email: z.string(),
  subject: z.string(),
  status: Status,
  created_at: z.string(),
});
export type Ticket = z.infer<typeof Ticket>;

export class TicketClient {
  constructor(private base = "http://localhost:8000") {}

  async get(id: number): Promise<Ticket> {
    const res = await fetch(`${this.base}/tickets/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Ticket.parse(await res.json());
  }
}
```

Practise:

- `Promise.all` vs a sequential `for` loop with `await`; time both against 20 GETs
- `try/catch` around `await`
- `setTimeout` wrapped in a promise (a sleep function)
- `Array.map`, `.filter`, `.reduce`
- optional chaining `?.` and nullish coalescing `??`

```bash
pnpm tsx src/demo.ts
pnpm vitest
```

## 3. Unguided challenge (~3 hrs)

Build `tickets-cli` in TypeScript. It should:

- run as `pnpm tsx src/cli.ts list --status escalated`, `create --account A1 ...` and `stats A1`
- validate every response with zod
- retry with exponential backoff on 5xx or network errors (max 3 tries), but **not** on 4xx
- include vitest tests that mock `fetch` (with `vi.spyOn(global, 'fetch')`), covering the retry logic

**Acceptance criteria:**

- `pnpm tsc --noEmit` is clean in strict mode.
- Tests cover success, 4xx with no retry, and 5xx retried then succeeding.

## 4. Thread C — kata (~30 min)

Solve [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) in TypeScript using a stack. What's the Big-O?

## 5. System design #2 — datastores (~1.5 hrs)

Pick and justify a datastore for **support conversations**. Assume 2M tickets a month, each with metadata, a message thread, status-change events and attachments, and a need for analytics plus customer-level lookups.

Compare Postgres, a document store (MongoDB or DynamoDB) and a key-value store (Redis). Cover access patterns, indexes, transactions, schema evolution, where message threads and attachments go (blob storage?), and cost.

Deliverables:

- a design doc
- ADR 0002
- an exec summary

Defend it to Claude.

## 6. Ways of working (~1 hr)

**Trunk-based development and DORA.** Short-lived branches, merging to `main` daily, and feature flags that separate *deploy* from *release*. DORA's four metrics are:

- deploy frequency
- lead time for changes
- change failure rate
- time to restore

How would your current team score on each? Which would you fix first?

## 7. Check

1. Why do you still need zod if you have TypeScript types?
2. What's the difference between `Promise.all` and awaiting in a loop?
3. Why not retry on a 400?
4. What does narrowing mean?
5. Which DORA metric is hurt most by large, long-lived branches?

Recycled:

- What does an index trade off?
- When shouldn't you mock?

## 8. Teach-back

Write "Async explained with a restaurant kitchen."

## Done when

- [ ] `tickets-cli` working, strict TypeScript clean, retry tests passing
- [ ] Kata done
- [ ] Datastore design doc, ADR 0002 and exec summary committed and defended
- [ ] DORA reflection written
- [ ] Check and teach-back done
