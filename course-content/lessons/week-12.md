---
week: 12
title: SQL and Data Modelling
phase: "5. Data engineering & Databricks"
hours: "8–10"
topics: [advanced SQL, CTEs, window functions, DuckDB, star schema, facts and dimensions, slowly changing dimensions, descriptive statistics]
threads: ["B. Descriptive stats in SQL"]
ways_of_working: "Working with data teams"
deliverable: "A star-schema model of synthetic support data in DuckDB with an analysis notebook"
---

# Week 12 — SQL and Data Modelling

**Phase 5 · Thread B: descriptive stats · Ways of working: working with data teams**

> **Domain pack:** Using a domain pack? Model your domain's dataset instead (for pharma, FAERS adverse events with SCD2 on product labels). The SQL techniques are identical.

## 1. Concept brief

Data engineering starts with modelling: deciding what tables exist, at what grain, and how they join. Get this right and the dashboards are easy. Get it wrong and every number is argued over.

**Vocabulary**

- **OLTP vs OLAP:** transactional databases (Postgres, row-oriented, many small writes) vs analytical ones (DuckDB, Databricks, Snowflake; columnar, big scans).
- **Grain:** what one row represents ("one ticket"). Decide this first.
- **Fact table:** events and measures (tickets, response times).
- **Dimension:** descriptive context (account, date, category).
- **Star schema:** one fact table surrounded by dimensions.
- **Slowly changing dimensions:** SCD1 overwrites old values; SCD2 keeps history with `valid_from`/`valid_to` columns.
- **CTE:** a `WITH` clause — a named sub-query that makes SQL readable.
- **Window function:** a calculation across related rows without collapsing them (`ROW_NUMBER`, `LAG`, running totals).

## 2. Guided lab (~3.5 hrs)

```bash
brew install duckdb
mkdir -p ~/dev/support-analytics && cd $_ && uv init && uv add duckdb faker pandas jupyter
```

**Generate data.** Ask Claude Code to help you write `gen.py`, which produces about 200k tickets across about 500 customer accounts over 6 months:

- `tickets`: ticket_id, account_id, created_at, channel, category, first_response_s, status, handled_by (ai/human), csat (nullable)
- `accounts`: account_id, name, region, plan, with **some accounts changing plan mid-period** (for SCD2)
- `messages`: message_id, ticket_id, sent_at, author (customer/agent/ai)
- `resolutions`: ticket_id, resolved_at (nullable)

Write the tables out as Parquet files.

```bash
duckdb support.duckdb
```

```sql
create table tickets as select * from 'data/tickets.parquet';
-- CTE + aggregate
with by_account as (
  select account_id, count(*) n, avg(first_response_s) avg_resp,
         sum(case when status='escalated' then 1 else 0 end)::double / count(*) esc_rate
  from tickets group by 1)
select * from by_account order by esc_rate desc limit 10;

-- Window functions: message number per ticket, and gap since the previous message
create table messages as select * from 'data/messages.parquet';
select ticket_id, sent_at,
       row_number() over (partition by ticket_id order by sent_at) msg_no,
       sent_at - lag(sent_at) over (partition by ticket_id order by sent_at) gap
from messages limit 20;

-- Time to resolve: percentiles, not just averages
create table resolutions as select * from 'data/resolutions.parquet';
select quantile_cont(epoch(r.resolved_at - t.created_at)/3600, [0.5, 0.9, 0.99]) hours
from tickets t join resolutions r using (ticket_id) where r.resolved_at is not null;
```

## 3. Unguided challenge (~3 hrs)

Model a star schema:

- `fct_ticket` (grain: one ticket)
- `dim_account` as **SCD2**, with `valid_from`, `valid_to` and `is_current`
- `dim_date`
- `dim_category`

Write the SQL to build each table. Then answer, in a notebook:

1. Escalation rate by plan, *using the plan in effect when the ticket was created* (a point-in-time join on SCD2).
2. The median and 90th-percentile messages per resolved ticket.
3. Do AI-handled tickets have a different resolution rate or CSAT from human ones? (Describe only — no conclusions yet.)

**Acceptance criteria:**

- Every table has a documented grain.
- The SCD2 join is correct (test it on an account that changed plan).
- The notebook runs top to bottom.

## 4. Thread B — why averages lie (~1 hr)

For first-response time:

1. Compute the mean, median, p90 and p99, then plot a histogram.
2. Explain the gap between the mean and the median.
3. Find one metric in your real job that's reported as an average and should be a percentile.
4. Describe Anscombe's quartet in two sentences.

## 5. Ways of working (~1 hr)

**Working with data teams.** Data as a product, data mesh (domain ownership), data contracts, and the semantic layer. Who owns the definition of "resolved" (or your domain's equivalent key metric) at your organisation? Write the definition you'd propose and who should sign off on it.

## 6. Check

1. What's the grain of a table, and why decide it first?
2. SCD1 vs SCD2: when would you use each?
3. What does `LAG()` return?
4. Why is DuckDB fast at analytics but a poor fit for an app backend?
5. When is the median better than the mean?

Recycled:

- What does RLS do?
- What's a dead-letter queue?

## 7. Teach-back

Write "Facts, dimensions and why my dashboard numbers finally agree."

## Done when

- [ ] Synthetic data generated as Parquet
- [ ] Star schema with SCD2 built and tested
- [ ] Analysis notebook answers all three questions
- [ ] Stats exercise done
- [ ] Data definition proposal written
- [ ] Check and teach-back done
