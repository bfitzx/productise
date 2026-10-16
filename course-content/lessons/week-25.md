---
week: 25
title: Capstone III — AI Feature and Frontend
phase: "Capstone"
hours: "8–10"
topics: [AI feature, evals in CI, red-teaming, frontend, accessibility, performance, instrumentation, feature flags]
threads: []
ways_of_working: "Builder-PM in practice"
deliverable: "Capstone AI feature gated by evals, a usable accessible UI, instrumentation and flags"
---

# Week 25 — Capstone III: AI Feature and Frontend

**Capstone · Build week 2 of 3**

## Goal

By Sunday, a user can complete the core job end to end, the AI feature passes its eval bar in CI, and everything is instrumented and behind flags.

## 1. AI feature (~3.5 hrs)

- [ ] Prompts and tools versioned in `prompts/`
- [ ] Structured outputs validated, with retries on validation failure
- [ ] Eval set of 30+ cases, 3 runs each, with confidence intervals; CI gate against the baseline
- [ ] Judge calibrated against hand labels (if you use LLM-as-judge)
- [ ] Red-team pass: injection, sensitive-data leakage, tool misuse, with mitigations tested
- [ ] Latency and cost per request measured against your week 23 budget
- [ ] Fallback when the model or provider fails; human escalation path where relevant
- [ ] Kill-switch flag

## 2. Frontend (~3 hrs)

- [ ] The core user flow is complete and the design tokens are applied
- [ ] Loading, empty and error states for every AI interaction (users must know when the AI is unsure)
- [ ] Accessibility: keyboard pass, screen-reader pass, axe in e2e, contrast checked
- [ ] Performance: Lighthouse at 90+ on the main page, Core Web Vitals recorded
- [ ] Playwright e2e for the core flow, running in CI against preview deployments

## 3. Instrumentation and release (~1.5 hrs)

- [ ] Tracking plan implemented (events → north-star and guardrail metrics)
- [ ] The week 26 experiment set up behind a flag, with the sample size calculated
- [ ] Dashboards for product metrics (PostHog) and system health (traces, errors, SLOs)
- [ ] No PII or regulated data in analytics or error payloads (verified)

## 4. Ways of working (~30 min)

**Builder-PM in practice.** Halfway through the build: which decisions did you make faster because you could build? Which did you make worse because you were too close to the code? Write half a page.

## 5. Mid-week check-in

Ask Claude, as an ML engineer: *"Review my evals and red-team report. Would you let this ship to a pilot?"*

## 6. Check

1. What's your current eval pass rate, and what's its confidence interval?
2. What does the user see when the AI fails?
3. What's the cost per core task?
4. Which flag would you flip first in an incident?
5. Is anything you built this week not instrumented?

## Done when

- [ ] Core flow usable end to end on preview
- [ ] AI feature passes its eval gate
- [ ] Red-team mitigations tested
- [ ] Accessibility and performance targets met
- [ ] Instrumentation, flags and experiment ready
