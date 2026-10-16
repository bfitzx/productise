---
week: 26
title: Capstone IV — Ship, Measure, Defend
phase: "Capstone"
hours: "8–10"
topics: [staged rollout, pilot users, experiment readout, runbook, launch memo, capstone defence, retrospective, publishing]
threads: ["H. Launch memo"]
mock_review: "Capstone defence — full panel (SWE + DE + SRE + exec)"
ways_of_working: "Course retrospective"
deliverable: "Capstone live with pilot users, measured, defended, and written up publicly"
---

# Week 26 — Capstone IV: Ship, Measure, Defend

**Capstone · Mock review #7: the final panel**

## 1. Ship (~2.5 hrs)

- [ ] Production environment separate from dev and preview, deployed from CI only
- [ ] Staged rollout: you → 2–3 friendly users → full pilot group, watching SLOs and errors at each step
- [ ] Runbook covering the top 5 failure modes, kill switch, rollback and contacts
- [ ] The experiment from week 25 running

## 2. Measure (~2 hrs)

At the end of the week (or as late as the sample allows):

- [ ] Experiment readout with a confidence interval and a decision (ship, kill or iterate)
- [ ] North-star and guardrail metrics against the targets set in week 23
- [ ] AI-feature production quality: a sample of real outputs graded against your eval rubric. Did production match the offline evals?
- [ ] Actual cost vs the estimate

## 3. Launch memo (~1 hr)

Write one page for an exec audience covering:

- what you built and for whom
- the result, with numbers and uncertainty
- the risks you've handled and the ones that remain
- what it would cost to scale
- the recommendation and the next three bets

No jargon.

## 4. Capstone defence (~1.5 hrs)

Tell Claude: *"Run the final panel: a staff SWE, a senior data engineer, an SRE and an exec. 60 minutes. Don't go easy."* Present:

- the design doc
- a demo
- eval results
- the experiment readout
- the cost
- the postmortem from any real incident

**Pass bar:**

- You defend each major decision with its trade-offs.
- You identify your system's weakest point before the panel does.
- You say "I don't know, here's how I'd find out" where that's the honest answer.
- The exec understands the memo without asking for translation.

## 5. Retrospective (~1 hr)

Write `retro.md`:

- your week 1 vs week 26 self-assessment on CLI, git, Python, TypeScript, SQL, Databricks, AI engineering, production, system design and stats (1–5 each)
- where estimates were most wrong, across the whole course
- what you'd now do differently as a PM, and what you'll stop doing
- the next 3 skills to deepen

## 6. Publish (~1 hr)

- Clean up the repo: README, architecture diagram, how to run it, and screenshots.
- Turn your 26 teach-backs into an index page.
- Write a public post: "26 weeks from PM to product engineer: what I built and what I learned."

## Done when

- [ ] Capstone live with pilot users
- [ ] Experiment readout and metrics reviewed
- [ ] Launch memo written
- [ ] Final panel passed
- [ ] Retrospective written
- [ ] Repo and teach-backs published
