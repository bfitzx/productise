---
week: 17
title: Retrieval-Augmented Generation
phase: "6. AI engineering"
hours: "8–10"
topics: [embeddings, vector search, pgvector, chunking, hybrid search, reranking, citations, RAG failure modes]
threads: ["G. RAG failure modes", "F. Cost estimate in design"]
system_design: "Scaling — horizontal vs vertical, load balancing, rate limiting, cost estimation"
ways_of_working: "Retro on your own work so far"
deliverable: "A cited Q&A over a help-centre and policy knowledge base, with a retrieval test set"
---

# Week 17 — Retrieval-Augmented Generation

**Phase 6 · Threads G and F · System design #7**

> **Domain pack:** Using a domain pack? Use your domain's public documents as the corpus, for example openFDA or DailyMed drug labels for pharma.

## 1. Concept brief

Models don't know your organisation's documents. **RAG** finds relevant passages first, then asks the model to answer *using only those passages*, with citations. Most RAG failures are retrieval failures, not model failures.

**Vocabulary**

- **Embedding:** a vector of numbers representing meaning. Similar texts produce nearby vectors.
- **Vector search:** finding nearest neighbours by cosine similarity. `pgvector` adds this to Postgres.
- **Chunking:** splitting documents into retrievable pieces. Size and overlap matter a lot.
- **Hybrid search:** keyword search (BM25 / full-text) plus vector search. Keywords catch exact terms such as error codes or product IDs.
- **Reranking:** a second model reorders the top-k results for relevance.
- **Grounding / citations:** the answer points to its sources, so users can verify it.
- **Recall@k:** how often the right chunk appears in the top k results. This is the core retrieval metric.

## 2. Guided lab (~3.5 hrs)

**Corpus.** Ask Claude to generate about 40 synthetic help-centre articles and internal policies: refunds, SLAs per plan, data export, SSO setup, error codes. Make some contradict each other and some go out of date. (Or use a public corpus from your domain pack.)

```bash
cd ~/dev/support-ai
uv add "psycopg[binary]" pgvector voyageai   # or another embeddings provider; check current options
docker run -d --name pgv -e POSTGRES_PASSWORD=pw -p 5433:5432 pgvector/pgvector:pg17
psql postgresql://postgres:pw@localhost:5433/postgres -c "create extension vector;"
```

```sql
create table chunks (id serial primary key, doc_id text, plan text,
  updated_at date, content text, embedding vector(1024));
create index on chunks using hnsw (embedding vector_cosine_ops);
create index on chunks using gin (to_tsvector('english', content));
```

Then:

1. Write `ingest.py`: chunk the documents (try 300 and 800 tokens), embed them, and insert.
2. Write `ask.py`: embed the question, take the top 5 chunks by cosine similarity, and prompt the model to answer **only from those sources** and cite chunk IDs, or say "not found".
3. Add hybrid retrieval: combine the vector rank with full-text rank (reciprocal rank fusion).

## 3. Unguided challenge (~2.5 hrs)

- **Retrieval test set:** 25 questions, each labelled with the chunk(s) that contain the answer. Compute recall@5 for vector-only vs hybrid, and for both chunk sizes.
- Return citations in the API response, and refuse to answer when the top score is below a threshold.
- Add a metadata filter, for example `plan`, so the model can't mix one plan's policy with another's.

**Acceptance criteria:**

- A recall@5 table in the README.
- Answers always cite sources or explicitly decline.

## 4. Thread G — RAG failure modes (~1 hr)

Deliberately trigger and document each of these:

- **Retrieval miss:** the answer exists, but it isn't retrieved.
- **Stale data:** an outdated policy wins over the current one. Fix it with `updated_at` filtering or boosting.
- **Citation hallucination:** a cited chunk doesn't support the claim. Detect it with a second check.
- **Conflicting sources:** what should the system say?

## 5. System design #7 — scaling with cost (~1 hr)

Handle **100× volume**: from 50k to 5M triaged tickets a day. Cover:

- horizontal scaling of the API
- load balancing
- queueing the LLM calls
- provider rate limits and your own rate limits
- batching
- caching repeated questions
- a **monthly cost estimate** (LLM tokens, embeddings, compute, database)

What do you cut first if the budget is half? Write an ADR and an exec summary.

## 6. Ways of working (~30 min)

**Retro on your own work.** Halfway point. What's working, what isn't, and what will you change for weeks 18–26? Update your estimation log.

## 7. Check

1. What does an embedding represent?
2. Why does hybrid search beat vector-only for error codes?
3. What does recall@5 measure?
4. Name two ways to handle stale documents.
5. What's the cheapest way to reduce LLM spend at 100× volume?

Recycled:

- Why use tool schemas for extraction?
- What's in a data contract?

## 8. Teach-back

Write "Why most RAG problems are search problems."

## Done when

- [ ] pgvector RAG with hybrid retrieval and citations
- [ ] Retrieval test set with a recall table
- [ ] Four failure modes documented
- [ ] Scaling and cost ADR defended
- [ ] Mid-course retro done
- [ ] Check and teach-back done
