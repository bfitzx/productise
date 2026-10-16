---
week: 20
title: Containers, Infrastructure and Observability
phase: "7. Production"
hours: "8–10"
topics: [Docker, multi-stage builds, docker compose, Kubernetes concepts, infrastructure as code, Terraform, OpenTelemetry, logs, metrics, traces, FinOps, GDPR, regulated-domain compliance, experiment design]
threads: ["B. Experiment design", "D. Compliance realities", "F. FinOps + Kubernetes concepts"]
ways_of_working: "Case study: a cloud bill"
deliverable: "The ticket service containerised, traced end to end, with infra as code and an experiment plan"
---

# Week 20 — Containers, Infrastructure and Observability

**Phase 7 · Threads B, D and F**

> **Domain pack:** The compliance thread has a section per domain. Pick the one that matches your work.

## 1. Concept brief

Production means you can **reproduce** the environment (containers, infrastructure as code), **see** what it's doing (observability), and **afford** it (FinOps).

**Vocabulary**

- **Image vs container:** the packaged template vs a running instance of it.
- **Multi-stage build:** build in one stage and copy only the output into a small runtime image.
- **docker compose:** defines multiple services (API, database, worker) to run together locally.
- **Kubernetes (K8s) concepts:**
  - **pod:** one or more containers running together
  - **deployment:** keeps N pods running
  - **service:** a stable network address for pods
  - **ingress:** external traffic in
  - **HPA:** autoscaling

  You don't need to operate K8s, but you need the vocabulary.
- **IaC:** infrastructure defined in code (Terraform/OpenTofu, Pulumi), reviewed and applied like software.
- **Three pillars of observability:**
  - **logs:** events
  - **metrics:** numbers over time
  - **traces:** a request's path across services, made of **spans**
- **OpenTelemetry (OTel):** the vendor-neutral standard for emitting all three.
- **SLI / SLO / SLA:** a measured indicator, an internal target, and a contractual promise.

## 2. Guided lab (~3.5 hrs)

**Containerise the ticket service:**

```dockerfile
# Dockerfile
FROM python:3.12-slim AS base
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY . .
EXPOSE 8000
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t ticket-service . && docker images ticket-service
docker run --rm -p 8000:8000 ticket-service
```

Write `compose.yaml` with `api`, `postgres` and `jaeger` (`jaegertracing/all-in-one`, UI on port 16686), then run `docker compose up`.

**Add tracing:**

```bash
uv add opentelemetry-distro opentelemetry-exporter-otlp
uv run opentelemetry-bootstrap -a install
OTEL_SERVICE_NAME=ticket-service OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317 \
  uv run opentelemetry-instrument uvicorn main:app
```

1. Make requests, then open Jaeger. Find the spans for the HTTP handler and the database query.
2. Add a custom span around the LLM call from week 16, with token counts as attributes.
3. Switch to structured JSON logs that include the `trace_id`.

**IaC taster:**

```bash
brew install opentofu
```

Write a small `main.tf` that creates something free and harmless, such as a GitHub repo with the `integrations/github` provider. Run `tofu init`, `tofu plan` and `tofu apply`, then destroy it. Notice that plan, review and apply work like a PR for infrastructure.

## 3. Unguided challenge (~2 hrs)

- Define **two SLOs** for FollowUp or the ticket service (for example, 99.5% of requests under 500 ms and 99.9% availability), and show the SLI query for each.
- Build a minimal dashboard (Grafana via compose, or your hosting provider's metrics) covering request rate, error rate and p95 latency.
- Write `docs/k8s-mapping.md`: how your compose services would map to K8s objects, and why you'd *not* use K8s for this app yet.

## 4. Thread F — FinOps (~45 min)

Take your cost models from weeks 10, 15 and 17 and build one **monthly cloud bill** for the whole system at 1k and 100k users. For each line item, give its driver (requests, GB, DBUs, tokens) and one right-sizing lever. Which three items make up 80% of the cost?

## 5. Thread D — compliance realities (~45 min)

One page each:

- **Everyone — GDPR (or your local privacy law):** personal vs special-category data, lawful basis, DPAs with every vendor (including LLM providers), data residency, retention, the right to erasure vs immutable logs.
- **Your domain — pick one:**
  - *Pharma / life sciences:* GxP, 21 CFR Part 11 (audit trails, e-signatures), computer system validation, pharmacovigilance reporting duties.
  - *Healthcare:* HIPAA — PHI, minimum necessary, BAAs, audit logs, breach notification.
  - *Fintech:* PCI DSS scope, KYC/AML data, SOX controls.
  - *General SaaS:* SOC 2 controls and evidence.

Map both onto your system. Where is sensitive data stored, processed, logged or traced? Are traces leaking it?

## 6. Thread B — experiment design (~45 min)

Plan the A/B test you'll run in week 22 on FollowUp. Write down:

- the hypothesis
- the primary metric and the guardrail metrics
- the unit of randomisation
- the **minimum detectable effect** and the **sample size** (use an online calculator, then explain what it did)
- the duration
- why "peeking" at the results early is dangerous

## 7. Check

1. Image vs container?
2. What's a span?
3. SLO vs SLA?
4. Name two compliance requirements in your domain that affect vendor choice.
5. What's a minimum detectable effect?

Recycled:

- What is barge-in?
- What does a kill switch protect against?

## 8. Teach-back

Write "Logs, metrics, traces: what I can now see."

## Done when

- [ ] Containerised, compose stack running
- [ ] Traces in Jaeger, including LLM spans
- [ ] IaC plan/apply/destroy done
- [ ] SLOs and dashboard
- [ ] K8s mapping written
- [ ] Unified cost model
- [ ] Compliance map
- [ ] Experiment plan
- [ ] Check and teach-back done
