---
week: 21
title: Feature Flags, Rollouts, Debugging and Threat Modelling
phase: "7. Production"
hours: "8–10"
topics: [feature flags, staged rollouts, canary, rollback, PostHog, production debugging, STRIDE, threat modelling, API versioning, statistical traps]
threads: ["B. Statistical traps", "C. Debugging drills", "D. Threat modelling"]
system_design: "API versioning and migrations + threat model"
ways_of_working: "Case study: a bad rollout"
deliverable: "FollowUp with flags and staged rollout, a STRIDE threat model, and a debugging-drill log"
---

# Week 21 — Feature Flags, Rollouts, Debugging and Threat Modelling

**Phase 7 · Threads B, C and D · System design #9**

## 1. Concept brief

**Vocabulary**

- **Feature flag:** a runtime switch that decouples *deploy* (code is live) from *release* (users see it). The main kinds are release, experiment, ops (kill switch) and permission flags.
- **Staged rollout / canary:** 1% → 10% → 50% → 100%, watching metrics at each step.
- **Rollback vs roll-forward:** revert to the previous version, or fix quickly and deploy again.
- **Expand–contract migration:** add the new column → write to both → backfill → read the new one → drop the old one. Zero downtime.
- **Threat model:** a structured look at what can go wrong security-wise. **STRIDE** stands for Spoofing, Tampering, Repudiation, Information disclosure, Denial of service and Elevation of privilege.
- **Mean time to detect / restore (MTTD / MTTR):** how fast you notice a problem, and how fast you fix it.

## 2. Guided lab (~3 hrs)

**PostHog flags and analytics:**

```bash
cd ~/dev/followup && pnpm add posthog-js posthog-node
```

1. Add PostHog (EU cloud) with page views and the 8–10 events from your week 8 tracking plan, adapted to FollowUp.
2. Create a flag `new-request-form`, evaluate it server-side, and build the new form behind it.
3. Roll it out to yourself only, then to 20%, then to 50%. Watch the error rate in Sentry and the event counts in PostHog at each step.
4. Practise a rollback: turn the flag off and confirm users get the old form within seconds, with no deploy.

**Expand–contract migration:** rename `requests.owner` to `assignee_id` with zero downtime, using the five expand–contract steps across separate PRs.

## 3. Unguided challenge (~2.5 hrs) — debugging drills

Ask Claude to act as a chaos engineer: *"Give me 4 production-style bugs to inject into FollowUp or the ticket service, one at a time, without telling me what they are."* Ask for a mix of:

- a slow query (missing index)
- an N+1 query
- a misconfigured environment variable in preview only
- a race condition on status updates
- a memory leak in a worker
- a third-party timeout without a retry

For each one, diagnose it using **only** logs, traces, metrics and `git bisect`. Record each drill in `docs/debug-log.md` with these headings: symptom → hypotheses → evidence → root cause → fix → the test that would have caught it → time to diagnose.

## 4. Thread D — threat model (~1 hr)

Draw a data-flow diagram of FollowUp: the browser, Vercel, Supabase, PostHog, Sentry, email, and the LLM if you've added one. Mark the trust boundaries.

Apply STRIDE to each boundary and list at least 12 threats, each with a likelihood, an impact and a mitigation. Pay special attention to what you send to analytics and error tracking. Is any PII or regulated data leaking into PostHog or Sentry breadcrumbs?

## 5. Thread B — statistical traps (~1 hr)

Work through one example of each (Claude can generate datasets for these):

- **Simpson's paradox:** AI-handled tickets look better overall but worse within every plan tier. Why?
- **Selection bias:** only engaged users saw the new form.
- **Survivorship bias:** analysing only resolved tickets.
- **Novelty effect:** the uplift fades after a week.
- **Confounding:** draw a simple causal DAG for "users who use filters close requests faster." What else could explain it?

## 6. System design #9 — versioning and threat modelling (~45 min)

You must ship a **breaking change** to the ticket API used by partners. Cover:

- the versioning strategy (URL vs header)
- the deprecation timeline
- an expand–contract approach for the data
- communicating with partners
- monitoring old-version traffic

Then threat-model the new endpoint. Write an ADR and an exec summary.

## 7. Check

1. Deploy vs release: what's the difference?
2. Name the five steps of expand–contract.
3. What does STRIDE stand for?
4. What's an N+1 query, and how do you spot it in a trace?
5. Explain Simpson's paradox in one sentence.

Recycled:

- SLO vs SLA?
- What's a minimum detectable effect?

## 8. Teach-back

Write "I debugged four production bugs with only traces and logs."

## Done when

- [ ] PostHog events and flag with a staged rollout and rollback demo
- [ ] Zero-downtime rename done
- [ ] 4 debugging drills logged
- [ ] STRIDE model with 12+ threats, PII leaks checked
- [ ] Stats traps done
- [ ] Versioning ADR defended
- [ ] Check and teach-back done
