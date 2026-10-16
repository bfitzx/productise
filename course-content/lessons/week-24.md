---
week: 24
title: Capstone II — Data and Backend
phase: "Capstone"
hours: "8–10"
topics: [repo setup, CI, synthetic data, pipeline, data contracts, API, tests, migrations, deployment]
threads: []
ways_of_working: "Swarming on your own blockers"
deliverable: "Capstone data pipeline and API running in CI and deployed to a dev environment"
---

# Week 24 — Capstone II: Data and Backend

**Capstone · Build week 1 of 3**

## Goal

By Sunday, data flows from source to gold tables, and an API serves the data the app and the AI feature need. Everything should be deployed to a **dev** environment from CI.

## 1. Setup (~1 hr)

- [ ] Monorepo or polyrepo decision recorded in an ADR
- [ ] Dev container or `compose.yaml` that runs everything locally with one command
- [ ] CI covering lint, types and tests for each component, plus secrets scanning (gitleaks)
- [ ] Branch protection; trunk-based workflow with small PRs

## 2. Data (~3.5 hrs)

- [ ] A synthetic data generator with realistic volume, mess and edge cases. Document what's simulated.
- [ ] Bronze → silver → gold pipeline (Databricks Bundles or dbt + Dagster), deployed from CI
- [ ] Data contracts for every source, with drift tests in CI
- [ ] Expectations and data-quality tests, with bad rows quarantined and counted
- [ ] Governance: sensitive (PII or regulated) columns tagged and masked
- [ ] Gold tables documented, with grain stated

## 3. Backend (~3.5 hrs)

- [ ] API (FastAPI or Next.js route handlers) with an OpenAPI spec
- [ ] Postgres schema via migrations, with RLS where there are users
- [ ] Unit, integration and contract tests, at 80%+ coverage on business logic
- [ ] Idempotent writes where clients might retry
- [ ] OTel tracing and structured logs from day one
- [ ] Deployed to dev (Vercel, Fly or Render, plus a hosted database)

## 4. Daily discipline

Each day:

- write a 3-line log entry in `capstone/LOG.md`: done, next, blocked
- update the estimate-vs-actual sheet

If you're blocked for more than 45 minutes, **swarm it**: open parallel Claude sessions with different hypotheses, then pick one.

## 5. Mid-week check-in (~30 min)

Midweek, paste your log and repo link to Claude: *"Staff engineer: what am I about to regret?"*

## 6. Check

1. What's the most fragile part of your pipeline today?
2. Which test would fail first if a source added a column?
3. Show a trace of one API request end to end.
4. Where's your biggest estimate miss so far, and why?
5. What did you cut?

## Done when

- [ ] Pipeline produces gold tables from CI
- [ ] Contracts and DQ tests in place
- [ ] API deployed to dev with tests and traces
- [ ] LOG and estimate sheet updated daily
