---
title: "PM to Product Engineer"
subtitle: "A 26-week, hands-on path from senior product manager to product engineer"
weeks: 26
hours_per_week: "8–10"
---

# PM to Product Engineer

**A 26-week, hands-on path for experienced product managers who want to build, ship and measure real software, and hold their own with software and data engineers.**

## Who it's for

Experienced product managers who already know discovery, prioritisation and stakeholders, and want the engineering half: the CLI, git, Python and TypeScript, full-stack apps, data pipelines on Databricks, AI features with evals, and production operations.

It also suits designers, analysts and founders who want to build. No prior coding is assumed, but you'll need a Mac (or Linux; Windows with WSL works with small changes) and 8–10 hours a week.

## What you'll be able to do

- Build and ship small products end to end, then measure whether they worked.
- Follow and contribute to design reviews, PR discussions and pipeline debates.
- Make sound trade-offs across UI, backend, data and AI, and explain them to executives.
- Know where your knowledge ends, and say so.

**Not the goal:** senior-engineer depth, designing large distributed systems alone, or production on-call.

## How it works

Each week (8–10 hours):

1. **Concept brief:** a short explainer and the vocabulary you'll hear in standups
2. **Guided lab:** exact commands, on your own machine
3. **Unguided challenge:** clear acceptance criteria, no hand-holding
4. **Thread items:** product, stats, testing, security, frontend, cost, responsible AI
5. **System design** every two weeks: a one-page design doc and ADR, defended
6. **Mock reviews** every 3–4 weeks: an AI tutor plays a sceptical staff engineer, data engineer or SRE
7. **Check:** 5 questions plus 2 recycled for spaced repetition
8. **Teach-back:** explain it in your own words

An AI coding assistant is your pair programmer from week 5. For weeks 1–4, you type everything yourself.

## The phases

| Phase | Weeks | You ship |
|---|---|---|
| 0. Workstation | 1 | A reproducible dev setup in git |
| 1. CLI fluency | 2–3 | A CLI tool: API → JSON → CSV |
| 2. Git & GitHub | 4 | CI on every PR |
| 3. Code core | 5–8 | A typed, tested FastAPI service and TypeScript client |
| 4. Full-stack product | 9–11 | A deployed Next.js + Postgres app with real users |
| 5. Data engineering & Databricks | 12–15 | A medallion pipeline deployed from CI, plus a dbt/Dagster comparison |
| 6. AI engineering | 16–19 | Structured outputs, RAG, an MCP agent with evals in CI, a voice-agent prototype |
| 7. Production | 20–22 | Containers, tracing, flags, an A/B test, a runbook and a postmortem |
| Capstone | 23–26 | One product: discovery → data → AI → shipped → measured → defended |

## Cross-cutting threads

- **Product discovery & metrics:** problem framing, opportunity trees, north-star and guardrail metrics, user research, readouts
- **Stats & experimentation:** percentiles, eval statistics, power and sample size, Simpson's paradox, causal basics
- **Testing & debugging:** test pyramid, contract tests, Playwright e2e, debugging drills, light data structures and algorithms
- **Security & compliance:** OWASP Top 10, RLS and least privilege, STRIDE, HIPAA and GDPR, incident response
- **Frontend & UX:** rendering strategies, accessibility, Core Web Vitals, design tokens
- **Cost & operations:** DBUs, token budgets, FinOps, Kubernetes concepts
- **Responsible AI:** RAG failure modes, prompt injection, PHI leakage, bias, human-in-the-loop
- **Communication:** ADRs, exec summaries, estimation, runbooks, launch memos

## Ways of working

One topic a week: product engineers vs PMs, AI-native teams, agent swarms for discovery, continuous discovery, Shape Up, evals-driven development, trunk-based development and DORA, instrumentation-first, Team Topologies, cost-aware building, reading an engineering org, working with data teams, honest estimation, and communicating trade-offs.

## Your domain

Every lesson uses one simple **running example** that anyone can follow: a support-ticket service with tickets, customer accounts, messages and a help centre.

**Domain packs** let you swap in your own industry from week 12 onwards. Each pack gives you the entity mapping, public datasets, compliance topics and capstone ideas, so the portfolio you finish with is relevant to the work you want to do. Packs cover:

- **Pharma and life sciences:** openFDA, FAERS, DailyMed, ClinicalTrials.gov; GxP and Part 11
- **Healthcare:** Synthea, FHIR; HIPAA
- **Fintech:** PaySim, EDGAR; PCI and KYC
- **E-commerce:** Olist, Instacart; GDPR and accessibility law
- **Bring your own:** five questions to map any domain

Public or synthetic data only. No real personal data.

## Stack

macOS · Homebrew · Ghostty · zsh · mise · uv · pnpm · Docker/OrbStack · git · GitHub Actions · Python · FastAPI · pydantic · TypeScript · zod · Next.js · Postgres (Supabase) · Drizzle · Playwright · DuckDB · Databricks (Delta, Unity Catalog, Lakeflow, Bundles) · dbt · Dagster · Kafka/Redpanda · Claude API · MCP · pgvector · whisper.cpp · OpenTelemetry · Jaeger · OpenTofu · PostHog · Sentry · Vercel
