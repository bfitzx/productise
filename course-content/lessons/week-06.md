---
week: 6
title: Persistence, Testing and Big-O
phase: "3. Code core"
hours: "8–10"
topics: [SQLite, SQLModel, SQL basics, test pyramid, fixtures, mocking, Big-O, data structures]
threads: ["C. Test pyramid", "C. Lightweight DSA"]
ways_of_working: "Evals-driven development"
deliverable: "The ticket service backed by a real database, with a layered test suite"
---

# Week 6 — Persistence, Testing and Big-O

**Phase 3 · Thread C: testing + DSA · Ways of working: evals-driven development**

## 1. Concept brief

An in-memory dict disappears when the server restarts. This week the service gets a real database, and you learn how engineers decide what to test and why some code is fast and some is slow.

**Vocabulary**

- **ORM:** maps classes to tables (SQLModel, SQLAlchemy). Convenient, but it can hide slow queries.
- **Primary key / foreign key / index:** identity, relationships, and fast lookup.
- **Transaction:** a group of writes that all succeed or all fail.
- **Test pyramid:** many fast unit tests, fewer integration tests, very few end-to-end tests.
- **Fixture:** reusable test setup (a fresh database per test, for example).
- **Mock:** a fake stand-in for a dependency. Mock what you don't own and is slow or flaky (external APIs); don't mock your own database logic.
- **Big-O:** how work grows with input size. O(1) is constant, O(log n) is like binary search, O(n) is a scan, O(n²) is nested loops.

## 2. Guided lab (~3 hrs)

```bash
cd ~/dev/ticket-service
uv add sqlmodel
```

Then:

1. Replace the dict with SQLModel. Define `Ticket` as a `table=True` model, create the engine with `sqlite:///tickets.db`, and use a `get_session` dependency.
2. Explore the database directly:

```bash
sqlite3 tickets.db ".tables" ".schema ticket"
sqlite3 tickets.db "select status, count(*) from ticket group by status;"
sqlite3 tickets.db "explain query plan select * from ticket where account_id='A12';"
sqlite3 tickets.db "create index ix_account on ticket(account_id);"
sqlite3 tickets.db "explain query plan select * from ticket where account_id='A12';"   # compare the plans
```

3. Testing layers. Create `tests/conftest.py` with a fixture that builds a fresh in-memory SQLite engine and overrides `get_session`. Then write:
   - **unit tests** for pure functions (for example a `can_transition(old, new)` state-machine function)
   - **integration tests** that hit endpoints against the real (in-memory) database
   - a **mock** test: add a `notify_account()` function that calls an external webhook URL with `httpx`, and use `respx` or `unittest.mock` to fake it

```bash
uv add --dev respx pytest-cov
uv run pytest --cov=. --cov-report=term-missing
```

## 3. Unguided challenge (~3 hrs)

- Add a `Account` table with a foreign key from `Ticket`, and an endpoint `GET /accounts/{id}/stats` that returns counts by status. Do the counting in SQL, not in Python.
- Seed 10,000 tickets with `faker` (`uv add --dev faker`), then time the stats endpoint with and without an index.
- Reach 85% or more coverage, and explain in the README which lines you chose *not* to test, and why.

**Acceptance criteria:**

- The stats endpoint is correct (tested).
- An index timing comparison is in the README.
- CI is green.

## 4. Thread C — lightweight DSA (~1.5 hrs)

1. In a notebook or script, time a membership check `x in list` vs `x in set` for n = 1k, 100k and 1M. Plot or print the results. Explain them using hash tables.
2. Implement binary search yourself. Why does it need sorted input?
3. Why is a database index usually a B-tree? (Read a 10-minute explainer.)
4. Kata: [Two Sum](https://leetcode.com/problems/two-sum/). Solve it in O(n²), then in O(n) with a dict.

## 5. Ways of working (~1 hr)

**Evals-driven development.** In AI products, the spec is increasingly a test suite: a set of inputs with graded expected outputs. Take a feature from your current or past work and write 10 eval cases as a table (input, expected behaviour, how you'd grade it). This is what you'll automate in week 18.

## 6. Check

1. What does an index trade off?
2. When should you *not* mock something?
3. What's the Big-O of looking up a key in a dict? And in a list?
4. Why use a fresh database per test?
5. What does a transaction guarantee?

Recycled:

- What does 409 mean?
- Why use an idempotency key?

## 7. Teach-back

Write "The test pyramid, explained to a PM who wants 100% coverage."

## Done when

- [ ] SQLModel persistence, Account relationship and stats endpoint done
- [ ] Unit, integration and mock tests written, coverage at 85%+
- [ ] Index timing comparison documented
- [ ] DSA exercises and kata done
- [ ] Eval table written
- [ ] Check and teach-back done
