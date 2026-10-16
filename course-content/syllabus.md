---
title: "Syllabus"
subtitle: "PM to Product Engineer — 26 weeks"
---

# Syllabus

**Format:** 26 weeks · 8–10 hours a week · one GitHub repo (`product-engineer-lab`) as your course spine · your own laptop as the workstation

## Goal

By week 26 you can build and ship small products end to end, and hold your own in technical conversations with software and data engineers: design reviews, PR discussions, pipeline debates. You also know where your knowledge ends.

- **In scope:** hands-on and conversational fluency; sound trade-off judgement; reading and reviewing code; building production-shaped prototypes and measuring whether they work.
- **Out of scope:** senior-engineer depth, designing large distributed systems alone, production on-call, and operating Kubernetes (you'll learn the concepts only).

## Structure

1. **Build track** (~60%): phased modules, each ending in something that works
2. **Cross-cutting threads** (~15%): product, stats, testing, security, frontend, cost, responsible AI, communication
3. **System design thread** (~10%): a design exercise every two weeks
4. **Ways of working** (~10%): one topic a week
5. **Mock reviews** (~5%): every 3–4 weeks an AI tutor plays a sceptical staff engineer, data engineer or SRE

**Running example:** a support-ticket service (tickets, accounts, messages, help centre). Swap in your own industry with a [domain pack](domain-packs.md).

## Build track

| Phase | Weeks | Topics | Deliverable |
|---|---|---|---|
| 0. Workstation | 1 | Homebrew, Ghostty, zsh, dotfiles, mise, uv, Docker/OrbStack, Claude Code | Reproducible setup script in git |
| 1. CLI fluency | 2–3 | Filesystem, pipes, rg, jq, processes, env vars, SSH, scripting, tmux | CLI tool: API → JSON → CSV |
| 2. Git & GitHub | 4 | Branching, rebase vs merge, PRs, `gh`, code review, GitHub Actions | CI on every PR |
| 3. Code core | 5–8 | Python (types, pytest), FastAPI, SQL basics, TypeScript, async, zod, reading and refactoring code | Typed, tested ticket service and TS client |
| 4. Full-stack product | 9–11 | Next.js, Postgres (Supabase), Drizzle, auth, deploy (Vercel), accessibility, performance | A deployed app with real users and a success metric |
| 5. Data engineering & Databricks | 12–15 | Modelling (star schema, SCD2), Delta, Unity Catalog, Lakeflow pipelines, Kafka basics, contracts, Bundles, cost, dbt + Dagster comparison | Medallion pipeline deployed from CI |
| 6. AI engineering | 16–19 | LLM APIs, structured outputs, RAG, MCP, agents, evals, voice pipelines, responsible AI | Agent with an eval suite gating CI; voice prototype |
| 7. Production | 20–22 | Containers, IaC, OpenTelemetry, flags, rollouts, experiments, threat modelling, compliance, incident response | Flags, tracing, an A/B test, a runbook, a postmortem |
| Capstone | 23–26 | Everything together, in your domain | One product: discovery → data → AI → shipped → measured → defended |

## Cross-cutting threads

| Thread | Where it appears |
|---|---|
| A. Product discovery & metrics | Problem framing (wk 3) · opportunity tree and north-star metric (9) · user research (10) · prioritisation (11) · metrics readout (22) · capstone discovery (23) |
| B. Stats & experimentation | Descriptive stats (12) · eval statistics (18) · experiment design (20) · statistical traps (21) · A/B readout (22) |
| C. Testing, debugging & CS fundamentals | Test pyramid and Big-O (6) · katas (6–7) · refactoring and contract tests (8) · e2e (11) · debugging drills (21) |
| D. Security, compliance & reliability | Secrets (4) · OWASP (10) · least privilege / RLS (11) · data governance (13) · compliance by domain (20) · STRIDE (21) · incident response (22) |
| E. Frontend & UX | Rendering strategies (9) · accessibility and Core Web Vitals (10) · state management and design tokens (11) |
| F. Cost & operations | Databricks cost (15) · scaling cost (17) · LLM cost and latency (19) · FinOps and Kubernetes concepts (20) |
| G. Responsible AI | RAG failure modes (17) · prompt injection and data leakage (18) · bias, human-in-the-loop, kill switches (19) |
| H. Communication | An ADR and exec summary for every design exercise from week 5 · estimation (13) · runbook (22) · launch memo (26) |

## System design thread (fortnightly)

Each exercise produces a one-page design doc and an ADR, which you then defend.

| Week | Topic | Exercise |
|---|---|---|
| 5 | APIs: REST vs GraphQL vs gRPC, idempotency | Design the partner API for the ticket service |
| 7 | Datastores: relational vs document vs key-value | Choose a store for support conversations |
| 9 | Caching | Add caching to your app — what breaks? |
| 11 | Queues, idempotency, retries, dead-letter queues | Reliable outbound notifications |
| 13 | Consistency and replication | Read-after-write in a multi-region app |
| 15 | Batch vs streaming | Real-time vs nightly analytics, per consumer |
| 17 | Scaling, rate limits, cost estimation | 100× volume, priced |
| 19 | AI system design | A voice support agent with human fallback |
| 21 | API versioning, threat modelling | A breaking change shipped safely |
| 23 | Capstone architecture | Full design doc |

## Ways of working (weekly)

1. What a product engineer is
2. The AI-native team
3. Swarms: agent swarms for discovery, and team swarming
4. Continuous discovery
5. Shape Up
6. Evals-driven development
7. Trunk-based development, feature flags, DORA
8. Instrumentation-first
9. Team Topologies
10. Cost-aware building
11. Reading an engineering org
12. Working with data teams
13. Estimating honestly
14. Communicating trade-offs
15–26. Case studies, retros and applied practice

## Mock reviews

| Week | Format | Persona |
|---|---|---|
| 4 | PR review: defend your CI | Staff SWE |
| 8 | API design review | Staff SWE |
| 11 | "Why Postgres?" | Principal SWE |
| 15 | "Why is this pipeline slow and expensive?" | Senior data engineer |
| 19 | AI feature launch review | ML/AI engineer |
| 22 | Incident review | SRE |
| 26 | Capstone defence | Full panel + exec |

**Pass bar:** you defend decisions with trade-offs, ask the question that exposes the risk, and say "I don't know, here's how I'd find out" when that's the honest answer.

## Weekly loop

1. **Concept brief and vocabulary.**
2. **Guided lab:** run the exact commands yourself.
3. **Unguided challenge,** with acceptance criteria.
4. **Thread items.**
5. **PR review** by your AI tutor.
6. **Check:** 5 new questions plus 2 recycled from earlier weeks.
7. **Teach-back:** a short write-up in your own words.

**Rules:**

- Type everything yourself in weeks 1–4.
- From week 5, an AI coding assistant is your pair programmer. You direct it, and you read every line it writes.

## Using an AI tutor

Any capable AI assistant can act as your tutor. Paste the week's lesson in and ask it to:

- explain any concept you're stuck on
- review your PR "as a senior engineer"
- run the mock reviews and game days in the persona listed
- check your answers to the weekly check
