---
week: 8
title: Reading, Refactoring and Contract Tests
phase: "3. Code core"
hours: "8–10"
topics: [reading unfamiliar code, refactoring, code smells, open-source contribution, contract testing, OpenAPI]
threads: ["C. Refactoring", "C. Contract testing"]
mock_review: "API design review (Staff SWE)"
ways_of_working: "Instrumentation-first"
deliverable: "A merged (or submitted) open-source PR and contract tests between service and client"
---

# Week 8 — Reading, Refactoring and Contract Tests

**Phase 3 · Thread C · Mock review #2 · Ways of working: instrumentation-first**

## 1. Concept brief

Most engineering time goes on *reading* code, not writing it. This week you navigate a codebase you didn't write, change it safely, and make sure two services can't silently drift apart.

**Vocabulary**

- **Entry point:** where execution starts (`main`, the route handlers, the CLI command).
- **Call graph:** who calls whom. Use "go to definition" and "find references" in your editor.
- **Code smell:** a sign of trouble — long functions, duplicated logic, flag arguments, deep nesting.
- **Refactor:** change the structure without changing behaviour. Tests first, small steps.
- **Characterisation test:** a test that pins down *current* behaviour before you change it.
- **Contract test:** verifies a client and a server agree on the API shape (from the OpenAPI schema, or consumer-driven with Pact).
- **Breaking change:** a change that makes existing clients fail.

## 2. Guided lab (~3 hrs) — read a real codebase

Pick a mid-sized, well-maintained open-source Python or TypeScript project you use. Good options: `httpx`, `rich`, `typer`, or a small FastAPI or Next.js example app.

```bash
gh repo fork <owner>/<repo> --clone && cd <repo>
tree -L 2 -I node_modules
rg -n "def main|if __name__|export default" | head
git log --oneline | head -30          # what changes often?
git log --format='%an' | sort | uniq -c | sort -rn | head   # who owns it?
rg -c "TODO|FIXME" | sort -t: -k2 -rn | head
```

Then:

1. Draw (on paper or in Excalidraw) the main modules and how one request or command flows through them.
2. Run the test suite locally, following `CONTRIBUTING.md`.
3. Ask Claude Code to explain one module, then check its explanation against the code. Where was it wrong?

## 3. Unguided challenge (~3 hrs)

**Part 1 — contribute.** Find a `good first issue` (or a docs or type-hint improvement). Fix it with a test, and open a PR following the project's conventions.

**Part 2 — refactor your own code.** In `ticket-service`:

- write characterisation tests for the stats endpoint first
- extract the business logic out of route handlers into a `services/` module
- remove duplication and add type hints everywhere

**Part 3 — contract tests.** Export the OpenAPI schema with `curl localhost:8000/openapi.json > openapi.json`, then:

- generate TS types with `pnpm dlx openapi-typescript openapi.json -o src/api.d.ts`
- add a CI job that regenerates the schema and fails if `api.d.ts` or the zod schemas would change without a commit
- try [Schemathesis](https://schemathesis.readthedocs.io) on your API: `uvx schemathesis run http://localhost:8000/openapi.json`

**Acceptance criteria:**

- The upstream PR is opened.
- The refactor has no behaviour change (tests stay green).
- Renaming a field in the API breaks CI.

## 4. Mock review #2 — API design review (~1 hr)

Bring your week 5 design doc, updated with what you've built since. Ask Claude to be a staff engineer reviewing it for production readiness. Expect questions on:

- versioning
- pagination at scale
- error contracts
- auth
- rate limits
- what breaks partners when you change things

## 5. Ways of working (~1 hr)

**Instrumentation-first.** Decide what you'll measure *before* building: events, properties, and the question each one answers. Write a tracking plan (event name, trigger, properties, the decision it informs) for the ticket service: 8–10 events.

## 6. Check

1. What's a characterisation test for?
2. Name three code smells.
3. What does a contract test catch that unit tests don't?
4. Is adding an optional field a breaking change? Is renaming one?
5. What's the first thing you look at in an unfamiliar repo?

Recycled:

- Why validate with zod at runtime?
- What's a fixture?

## 7. Teach-back

Write "How to read a codebase you didn't write: my checklist."

## Done when

- [ ] Codebase map drawn
- [ ] Upstream PR opened
- [ ] Refactor done with tests green
- [ ] Contract test fails on drift
- [ ] Mock review done
- [ ] Tracking plan written
- [ ] Check and teach-back done
