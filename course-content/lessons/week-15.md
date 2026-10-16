---
week: 15
title: Data Quality, Contracts, Cost and Portability
phase: "5. Data engineering & Databricks"
hours: "8–10"
topics: [data contracts, data quality, schema evolution, partitioning, liquid clustering, DBUs, serverless vs classic, Declarative Automation Bundles, CI/CD for data, Genie, AI/BI dashboards, dbt, Dagster]
threads: ["F. Databricks cost", "Portability: dbt + DuckDB + Dagster"]
system_design: "Batch vs streaming architectures"
mock_review: "\"Why is this pipeline slow and expensive?\" (Senior data engineer)"
ways_of_working: "Case study: a data incident"
deliverable: "The pipeline deployed from CI with Bundles, plus a dbt/Dagster rebuild of one gold table"
---

# Week 15 — Data Quality, Contracts, Cost and Portability

**Phase 5 · Thread F · System design #6 · Mock review #4**

## 1. Concept brief

**Vocabulary**

- **Data contract:** an agreed schema, semantics, SLAs and owner between a data producer and its consumers. Breaking it is like breaking an API.
- **Schema evolution:** adding, renaming or retyping columns safely. Delta can `mergeSchema`, but downstream consumers may still break.
- **Partitioning / liquid clustering:** organising files so queries can skip data. Liquid clustering is Databricks' newer, adaptive alternative to static partitions.
- **DBU:** Databricks Unit, the billing unit for compute. Your cost is roughly DBUs × rate, plus cloud infrastructure.
- **Declarative Automation Bundles** (still widely called **Asset Bundles**, or DABs): pipelines, jobs and config defined as YAML in git and deployed with the CLI. This is infrastructure-as-code for Databricks.
- **dbt:** SQL-first transformation framework (models, tests, docs) that runs on any warehouse.
- **Dagster / Airflow:** general-purpose orchestrators.

## 2. Guided lab (~3.5 hrs) — Bundles and CI

```bash
cd ~/dev && databricks bundle init     # choose the default Python or pipeline template
cd <bundle> && tree
```

1. Move your week 14 pipeline code into the bundle, and define the pipeline and job in `resources/*.yml`.
2. Deploy and run it:

```bash
databricks bundle validate
databricks bundle deploy -t dev
databricks bundle run -t dev <job_key>
```

3. Add a GitHub Actions workflow that runs `databricks bundle validate` on PRs and `deploy -t prod` on merge to `main`. Use a **service principal** or OAuth token stored as a GitHub secret, never your personal token.

**Quality and contracts:**

1. Write `contracts/tickets.yml`: columns, types, allowed values, nullability, freshness SLA (for example, "data no more than 2 hours old"), owner, and consumers.
2. Add a CI test that compares the bronze schema with the contract and fails on drift.

**Cost:**

1. Open the system tables (`system.billing.usage`) if available, or the usage page. Which runs cost the most?
2. Apply `CLUSTER BY (ticket_date, account_id)` to silver, and compare query time and bytes scanned before and after.

## 3. Unguided challenge (~2.5 hrs) — portability

Rebuild **one gold table** outside Databricks:

```bash
mkdir -p ~/dev/support-dbt && cd $_ && uv init
uv add dbt-duckdb dagster dagster-webserver dagster-dbt
uv run dbt init support
```

1. Write staging and mart models in dbt over last week's Parquet files, with `not_null`, `unique` and `accepted_values` tests.
2. Run `uv run dbt build`, then `uv run dbt docs generate && uv run dbt docs serve`.
3. Wrap the dbt project in Dagster (`dagster-dbt`), run `uv run dagster dev`, and materialise the assets from the UI.

Write `docs/comparison.md` comparing the two stacks on developer experience, testing, lineage, orchestration, cost model, governance of sensitive data, and which one you'd choose for a 5-person team vs a 500-person organisation.

## 4. Mock review #4 — slow and expensive pipeline (~1 hr)

Claude plays a senior data engineer: *"Your pipeline costs €3k/month and the gold table is 6 hours stale. Walk me through it."* Expect questions on:

- cluster sizing
- serverless vs classic compute
- small files
- clustering
- full vs incremental recompute
- schedule frequency
- whether anyone actually uses the table

## 5. System design #6 — batch vs streaming (~1 hr)

Should support analytics be **real-time** or **nightly**? Decide per consumer: ops dashboard, customer SLA reports, ML training, billing. Cost both options and recommend a hybrid. Write an ADR and an exec summary.

## 6. Ways of working (~30 min)

Read one public data-incident postmortem; search for "data pipeline postmortem" or a dbt Labs or Monte Carlo case study. What contract or test would have caught it?

## 7. Check

1. What goes in a data contract?
2. Why is renaming a column in silver risky?
3. What does a bundle give you that clicking in the UI doesn't?
4. Liquid clustering vs partitioning, in one sentence?
5. Name two drivers of Databricks cost you can control.

Recycled:

- What does Auto Loader do?
- What's a Kafka offset?

## 8. Teach-back

Write "Databricks vs dbt + Dagster: what I'd tell my CTO."

## Done when

- [ ] Pipeline deployed via Bundles from CI with a service principal
- [ ] Contract and drift test in CI
- [ ] Clustering before/after measured
- [ ] dbt + Dagster rebuild running with tests
- [ ] Comparison doc written
- [ ] Mock review and design ADR done
- [ ] Check and teach-back done
