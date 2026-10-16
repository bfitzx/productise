---
week: 23
title: Capstone I — Discovery and Architecture
phase: "Capstone"
hours: "8–10"
topics: [agent swarm discovery, problem framing, opportunity solution tree, success metrics, architecture design doc, ADRs, build plan]
threads: ["A. Capstone discovery sprint"]
system_design: "Capstone architecture review"
ways_of_working: "Swarms (applied)"
deliverable: "A capstone brief, architecture design doc and shaped build plan"
---

# Week 23 — Capstone I: Discovery and Architecture

**Capstone · Thread A · System design #10**

> **Domain pack:** This is where your domain pack pays off: build the capstone on your own industry's public data.

## The capstone

Over four weeks you build **one product end to end**: discovery → prototype → data → AI → shipped → measured. It should combine at least:

- a **user-facing app** (Next.js)
- a **backend/API** with tests
- a **data pipeline** (Databricks or dbt) feeding analytics
- an **AI feature** with evals (LLM, RAG, agent or voice)
- **production practices**: flags, observability, a runbook and an experiment

**Pick a theme from your own domain.** See `domain-packs.md` for public datasets and capstone ideas in pharma and life sciences, healthcare, fintech and e-commerce. Some examples:

- **Pharma:** a drug-label Q&A and comparison tool over openFDA labels, with a pipeline tracking label changes, and evals for answer accuracy.
- **Pharma:** an adverse-event signal explorer over FAERS data: medallion pipeline, disproportionality stats, and an LLM that drafts plain-language signal summaries for review.
- **Life sciences:** a clinical-trial landscape explorer over ClinicalTrials.gov: site and sponsor analytics, plus an agent that answers protocol questions with citations.
- **General:** extend the course's ticket service into an AI support co-pilot: triage, RAG answers, escalation analytics.

Use public or synthetic data only. Never use real personal or patient data.

## 1. Discovery sprint (~3.5 hrs) — swarm plus judgement

1. **Frame it** using the week 3 format: problem, users, constraints, non-goals.
2. **Run an agent swarm.** Use five parallel Claude sessions or subagents:
   - competitive landscape
   - user-pain hypotheses from public sources (forums, reviews)
   - regulatory and compliance constraints
   - technical feasibility spike (what's hard?)
   - a devil's advocate
3. **Talk to at least 3 real people** in the target role (or 5 simulated personas, clearly labelled).
4. **Synthesise** into an opportunity solution tree. Pick **one** opportunity.
5. **Define success:**
   - a north-star metric
   - 2 guardrail metrics
   - the eval pass bar for the AI feature
   - the experiment you'll run in week 26

## 2. Architecture (~3 hrs)

Write `capstone/docs/design.md`, the full design doc:

- context and goals / non-goals
- a system diagram showing app, API, database, pipeline, AI, third parties, trust boundaries and sensitive-data flows
- the data model and pipeline (bronze/silver/gold)
- the AI design: model choice, prompts, tools, eval plan, cost and latency budget, fallbacks
- an API sketch
- observability: SLOs, dashboards, alerts
- security and compliance: a STRIDE summary, vendor BAA/DPA needs
- the cost estimate at pilot scale
- risks, and what you'll cut first

Write ADRs for the 3–5 biggest decisions.

## 3. Shape the build (~1 hr)

Set an appetite of three weeks at about 8 hours each. Break the work into scopes (Shape Up style), and mark must-haves vs nice-to-haves. Produce:

- a **"not doing" list**
- an estimation sheet: your estimates now, with the actuals filled in later

## 4. System design #10 — capstone architecture review (~1 hr)

Present the design doc to Claude as a panel (staff SWE plus data engineer). Iterate on the doc until it survives the review.

## 5. Check

1. What's the single riskiest assumption in your capstone, and how will you test it first?
2. Which component would you cut if you lost a week?
3. Where does sensitive data flow in your diagram?
4. What's the AI feature's eval pass bar, and why that number?
5. What's your cost per active user at pilot scale?

## 6. Teach-back

Write "How I chose my capstone: discovery with a swarm."

## Done when

- [ ] Discovery sprint done (swarm, conversations, opportunity tree)
- [ ] Success metrics defined
- [ ] Design doc and ADRs written
- [ ] Build shaped, with a "not doing" list
- [ ] Architecture review passed
- [ ] Teach-back written
