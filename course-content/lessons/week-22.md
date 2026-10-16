---
week: 22
title: Experiments, Incidents and Runbooks
phase: "7. Production"
hours: "8–10"
topics: [A/B testing, experiment readout, confidence intervals, incident response, severity levels, runbooks, blameless postmortems, on-call]
threads: ["A. Metrics readout", "B. Run an A/B test", "D. Incident response", "H. Runbook"]
mock_review: "Incident review — your app went down (SRE)"
ways_of_working: "Case study: a public postmortem"
deliverable: "An A/B test readout, a runbook, and a postmortem from a simulated incident"
---

# Week 22 — Experiments, Incidents and Runbooks

**Phase 7 · Threads A, B, D and H · Mock review #6**

## 1. Concept brief

You've built, shipped and instrumented. This week you **measure** honestly and **respond** when things break: the two things that earn trust from engineering teams.

**Vocabulary**

- **Readout:** the write-up of an experiment's result and the decision it leads to.
- **Confidence interval:** the range of plausible true effects. "+4% (−1% to +9%)" means you don't know yet.
- **Statistical vs practical significance:** an effect can be real but too small to matter.
- **Incident severity (SEV1–SEV4):** impact-based levels that set who gets paged and how fast.
- **Incident commander (IC):** the person coordinating the response. They don't debug.
- **Runbook:** step-by-step instructions for known failure scenarios.
- **Blameless postmortem:** the timeline, contributing factors and actions. It focuses on systems, not people.

## 2. Guided lab (~2.5 hrs) — run the experiment

1. Launch the A/B test you planned in week 20 using a PostHog experiment, or a flag with a 50/50 split plus your own analysis.
2. Let it run as long as your sample-size plan allows. With few users, extend the run or simulate additional traffic (label it as simulated).
3. Export the results and analyse them yourself in a notebook:

```python
from statsmodels.stats.proportion import proportions_ztest, confint_proportions_2indep
# successes and totals per arm
stat, p = proportions_ztest([s_b, s_a], [n_b, n_a])
low, high = confint_proportions_2indep(s_b, n_b, s_a, n_a)
```

4. Compare your numbers with PostHog's. Do they agree? If not, why not?

## 3. Unguided challenge (~3 hrs) — incident simulation

**Write the runbook first** (`docs/runbook.md`):

- the service overview and dependencies
- dashboards and log links
- the five most likely failures, each with symptoms, checks and mitigations (database connections exhausted, a bad deploy, a third-party outage, a flag misfire, a quota or limit hit)
- how to roll back, how to flip the kill switch, and who to contact

**Then run a game day.** Ask Claude to run a live incident against you: *"SRE mode, run a SEV2 game day on FollowUp. Feed me alerts and symptoms over time; I'll respond."* You act as IC and responder:

- declare the severity
- post status updates every 10 minutes
- mitigate first, then find the root cause

**Write the postmortem** (`docs/postmortems/001.md`):

- summary
- impact
- timeline
- contributing factors (5 whys)
- what went well and what didn't
- action items with owners

## 4. Thread A — metrics readout (~1 hr)

One page for stakeholders:

- Did FollowUp move its north-star metric since week 11? What do the guardrails say?
- What was the experiment's result, and what's the decision (ship, kill or iterate)?
- What would you build next, and what would you stop?

Use plain language, confidence intervals instead of "p < 0.05", and one chart.

## 5. Mock review #6 — incident review (~1 hr)

Claude plays an SRE reviewing your postmortem: *"Why did detection take 14 minutes? Why wasn't this in the runbook? Are your action items actually going to prevent a recurrence?"*

## 6. Ways of working (~30 min)

Read one well-known public postmortem (search for a major cloud provider or SaaS outage postmortem). What did they do that you didn't?

## 7. Check

1. Statistical vs practical significance: give an example.
2. What does the incident commander *not* do?
3. Why are postmortems blameless?
4. What belongs in a runbook entry?
5. Your experiment shows "+3% (−2% to +8%)". What do you decide, and why?

Recycled:

- What's the novelty effect?
- What does STRIDE stand for?

## 8. Teach-back

Write "I ran my first incident: what I'd tell my old PM self."

## Done when

- [ ] A/B test run and analysed independently, with the readout written
- [ ] Runbook written
- [ ] Game day run as IC
- [ ] Postmortem with action items
- [ ] Mock review passed
- [ ] Check and teach-back done
