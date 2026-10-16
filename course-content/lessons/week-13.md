---
week: 13
title: Databricks Foundations
phase: "5. Data engineering & Databricks"
hours: "8–10"
topics: [Databricks Free Edition, lakehouse, Delta Lake, ACID, time travel, Unity Catalog, governance, lineage, notebooks, jobs, Databricks CLI]
threads: ["D. Data governance for personal data", "H. Estimation practice"]
system_design: "Consistency, replication, CAP in practice"
ways_of_working: "Estimation honestly"
deliverable: "Support data loaded into Unity Catalog Delta tables with governance controls and a scheduled job"
---

# Week 13 — Databricks Foundations

**Phase 5 · Threads D and H · System design #5 · Ways of working: estimation**

## 1. Concept brief

Databricks is a **lakehouse**: cheap object storage (files) with a transactional table layer (Delta) and governance (Unity Catalog) on top, so one copy of the data serves BI, data engineering and ML.

**Vocabulary**

- **Data lake vs warehouse vs lakehouse:** raw files vs managed tables vs both together.
- **Delta Lake:** Parquet files plus a transaction log. It gives you ACID writes, `MERGE`, schema enforcement and **time travel** (query old versions).
- **Unity Catalog (UC):** the governance layer. A three-level namespace, `catalog.schema.table`, with grants, lineage and audit.
- **Managed vs external table:** Databricks owns the files, or you point at your own.
- **Volume:** UC-governed storage for non-tabular files (CSV drops, PDFs).
- **Compute:** serverless or classic clusters, and SQL warehouses for BI.
- **Notebook vs job:** interactive exploration vs a scheduled, parameterised, monitored run.

## 2. Guided lab (~3.5 hrs)

1. Sign up for **Databricks Free Edition** (search "Databricks Free Edition").
2. Install and authenticate the CLI:

```bash
brew tap databricks/tap && brew install databricks
databricks auth login --host https://<your-workspace>.cloud.databricks.com
databricks current-user me
databricks catalogs list
```

3. Create a schema and a volume (in a SQL editor or notebook):

```sql
create schema if not exists workspace.support;
create volume if not exists workspace.support.raw;
```

4. Upload last week's Parquet files:

```bash
databricks fs cp -r ./data dbfs:/Volumes/workspace/support/raw/ --overwrite
databricks fs ls dbfs:/Volumes/workspace/support/raw/
```

5. In a notebook (Python plus SQL cells):

```python
df = spark.read.parquet("/Volumes/workspace/support/raw/tickets.parquet")
df.printSchema(); display(df.limit(10))
df.write.mode("overwrite").saveAsTable("workspace.support.tickets")
```

```sql
describe history workspace.support.tickets;
update workspace.support.tickets set status = 'resolved' where ticket_id = 1;
select * from workspace.support.tickets version as of 0 where ticket_id = 1;   -- time travel
describe detail workspace.support.tickets;   -- where are the files?
```

6. Look at the **Catalog Explorer**: find lineage, permissions and history for your table.

## 3. Unguided challenge (~2.5 hrs)

- Load all the tables, then write a `MERGE INTO` that upserts a "late-arriving" batch of 1,000 updated attempts.
- Convert your week 12 star-schema SQL to Databricks SQL and build `fct_` and `dim_` tables in a `workspace.support_gold` schema.
- Wrap the build in a **Job** (Workflows → Jobs) that runs daily, with an email notification on failure.

**Acceptance criteria:**

- The `MERGE` is idempotent: running it twice leaves the same result.
- The job runs successfully on a schedule.
- History shows each version.

## 4. Thread D — governing personal data (~1 hr)

Treat `customer_email` as personal data (PII).

1. Create a column mask so that only a `pii_readers` group sees it in clear (search "Unity Catalog column masks"). Test as a user who isn't in that group, or reason through the policy if Free Edition limits groups.
2. Add a table comment and column tags (`pii`, `sensitive`).
3. Explain how lineage helps answer "where did this customer's data go?"

## 5. Thread H — estimation practice (~30 min)

Before starting the challenge, estimate each part in hours and write the estimates down. Afterwards, record the actual time and explain the gap. Keep a running log for the rest of the course.

## 6. System design #5 — consistency (~1 hr)

Your FollowUp app goes multi-region with read replicas. A user updates a request status and immediately sees the old one. Explain:

- replication lag and read-after-write consistency
- options: read-your-writes routing, sticky sessions, reading from the primary after a write
- CAP and PACELC in plain language
- which parts of a support platform need strong consistency and which can be eventual

Write an ADR and an exec summary.

## 7. Ways of working (~30 min)

**Estimation, honestly.** Estimates slip because of unknown unknowns, integration work and review queues. Better questions than "how long will it take?" include:

- "What's the riskiest part?"
- "What would make this twice as long?"
- "What can we cut and still learn?"

Write five questions you'll use in your next planning session.

## 8. Check

1. What does Delta add on top of Parquet?
2. Name UC's three-level namespace.
3. Why should a `MERGE` be idempotent?
4. Notebook vs job: when does exploration become production?
5. What is read-after-write consistency?

Recycled:

- What's the grain of `fct_ticket`?
- When is SCD2 needed?

## 9. Teach-back

Write "What a lakehouse is, without the marketing."

## Done when

- [ ] CLI authenticated
- [ ] Tables loaded in UC, with time travel demonstrated
- [ ] Idempotent `MERGE` and gold tables built
- [ ] Scheduled job running
- [ ] PII mask and tags applied
- [ ] Estimates vs actuals logged
- [ ] Consistency ADR defended
- [ ] Check and teach-back done
