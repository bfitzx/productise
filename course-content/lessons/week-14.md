---
week: 14
title: Pipelines, Orchestration and Streaming
phase: "5. Data engineering & Databricks"
hours: "8–10"
topics: [Lakeflow Declarative Pipelines, medallion architecture, bronze/silver/gold, Auto Loader, DAGs, retries, backfills, batch vs streaming, Kafka, Redpanda]
threads: []
ways_of_working: "Communicating trade-offs to non-engineers"
deliverable: "A bronze → silver → gold declarative pipeline fed by incremental file drops, plus a local Kafka demo"
---

# Week 14 — Pipelines, Orchestration and Streaming

**Phase 5 · Ways of working: communicating trade-offs**

## 1. Concept brief

Last week you ran SQL by hand and in a job. Real pipelines are **declarative**: you describe the tables you want and their quality rules, and the engine works out the order, the incremental processing and the retries.

**Vocabulary**

- **Medallion architecture:**
  - **bronze:** raw, as landed
  - **silver:** cleaned, deduplicated, conformed
  - **gold:** business-level aggregates
- **Lakeflow Declarative Pipelines:** Databricks' declarative ETL framework, formerly Delta Live Tables (DLT).
- **Streaming table vs materialised view:** incrementally appends new data, vs a recomputed result.
- **Auto Loader:** incrementally picks up new files from storage (`cloudFiles`).
- **DAG:** a directed acyclic graph of task dependencies. Orchestrators (Airflow, Dagster, Databricks Jobs) run DAGs.
- **Backfill:** re-running a pipeline for historical periods.
- **Batch vs streaming:** process in chunks on a schedule, vs continuously as events arrive.
- **Kafka:** a durable, partitioned event log. Producers write to topics, consumers read at their own offset.

## 2. Guided lab (~3.5 hrs)

1. Split your tickets into daily Parquet or JSON files, and upload days 1–30 to `/Volumes/workspace/support/landing/`.
2. Create a pipeline (Jobs & Pipelines → Create → ETL pipeline) with a Python source file:

```python
from pyspark import pipelines as dp     # older workspaces: import dlt as dp
from pyspark.sql import functions as F

@dp.table(comment="Raw tickets as landed")
def bronze_tickets():
    return (spark.readStream.format("cloudFiles")
            .option("cloudFiles.format", "parquet")
            .load("/Volumes/workspace/support/landing/"))

@dp.table(comment="Cleaned, deduplicated tickets")
@dp.expect_or_drop("valid_status", "status IN ('open','pending','resolved','escalated','closed')")
@dp.expect("non_negative_response", "first_response_s >= 0")
def silver_tickets():
    return (spark.readStream.table("bronze_tickets")
            .dropDuplicates(["ticket_id"])
            .withColumn("ticket_date", F.to_date("created_at")))

@dp.materialized_view(comment="Daily status counts by account")
def gold_daily_account_status():
    return (spark.read.table("silver_tickets")
            .groupBy("ticket_date", "account_id", "status").count())
```

3. Run it and study the pipeline graph and the data-quality metrics.
4. Upload days 31–35 and run again. Only the new files should be processed. Check the event log.
5. Upload a file containing bad rows (negative response times, an unknown status). Where did they go?

**Local streaming with Kafka (Redpanda):**

```bash
docker run -d --name redpanda -p 9092:9092 redpandadata/redpanda:latest \
  redpanda start --overprovisioned --smp 1 --kafka-addr 0.0.0.0:9092 --advertise-kafka-addr localhost:9092
docker exec -it redpanda rpk topic create ticket-events -p 3
docker exec -it redpanda rpk topic produce ticket-events     # type a few JSON events, then Ctrl-C
docker exec -it redpanda rpk topic consume ticket-events --offset start
```

Then write a tiny Python producer and consumer with `uv add confluent-kafka`. Kill the consumer, produce more events, and restart it. Did it resume from the right offset?

## 3. Unguided challenge (~2.5 hrs)

- Add `accounts` as a second source with **SCD2 handling** using `create_auto_cdc_flow` (formerly `apply_changes`); search the current docs for the exact API.
- Add a gold view of the escalation rate by plan at the time of the ticket.
- Schedule the pipeline in a Job that runs after a "file arrival" trigger, or daily.
- Document the DAG and say what a backfill of last month would involve.

**Acceptance criteria:**

- Incremental runs process only new files.
- Bad rows are dropped and counted.
- SCD2 history is correct.

## 4. Ways of working (~1 hr)

**Communicating trade-offs.** Write a 150-word note to a non-technical director explaining why "real-time support dashboards" would cost about 4× more than hourly ones, and what they'd gain. Use no jargon. Give one recommendation and one alternative.

## 5. Check

1. What belongs in bronze vs silver vs gold?
2. What does `expect_or_drop` do differently from `expect`?
3. What's a consumer offset in Kafka?
4. Why are declarative pipelines easier to backfill?
5. Streaming table vs materialised view: when would you use each?

Recycled:

- What's Delta time travel?
- What is a UC column mask?

## 6. Teach-back

Write "Bronze, silver, gold: a pipeline explained as a kitchen."

## Done when

- [ ] Declarative pipeline running with expectations
- [ ] Incremental loads proven
- [ ] SCD2 via auto CDC working
- [ ] Kafka producer and consumer demo with offsets understood
- [ ] Director note written
- [ ] Check and teach-back done
