---
week: 5
title: Python Core and Your First API
phase: "3. Code core"
hours: "8–10"
topics: [Python, uv, type hints, pydantic, HTTP, REST, FastAPI, ADRs]
threads: ["H. ADR + exec summary"]
system_design: "APIs — REST vs GraphQL vs gRPC"
ways_of_working: "Shape Up"
deliverable: "A typed FastAPI service skeleton with an ADR"
---

# Week 5 — Python Core and Your First API

**Phase 3 · System design #1 · Ways of working: Shape Up**

From this week on, Claude Code is your pair programmer. **Rule:** you write the first version of each function yourself, then ask Claude to review it or extend it. Read every line it writes before you accept it.

## 1. Concept brief

Python is the lingua franca of data and AI work. FastAPI is the modern way to put a Python function behind an HTTP endpoint, with type hints doing double duty as validation and documentation.

**Vocabulary**

- **HTTP methods:** `GET` (read), `POST` (create), `PUT`/`PATCH` (update), `DELETE`.
- **Status codes:** `2xx` success, `4xx` the client's fault, `5xx` the server's fault. Learn 200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500 and 503.
- **REST:** resources as URLs (`/tickets/42`), with methods as verbs.
- **Type hints:** `def f(x: int) -> str`. They're not enforced at runtime unless a library like pydantic does it.
- **Pydantic model:** a class that validates and serialises data.
- **OpenAPI:** a machine-readable API description. FastAPI generates it for you at `/docs`.
- **Virtual environment:** isolated per-project packages. `uv` manages it for you.

## 2. Guided lab (~3 hrs)

```bash
cd ~/dev && uv init ticket-service && cd ticket-service
uv add fastapi uvicorn pydantic
uv add --dev pytest httpx ruff mypy
```

Create `main.py`:

```python
from datetime import datetime
from enum import Enum
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Ticket Service")

class Status(str, Enum):
    open = "open"
    pending = "pending"
    resolved = "resolved"
    escalated = "escalated"

class TicketIn(BaseModel):
    account_id: str = Field(min_length=2)
    customer_email: str
    subject: str

class Ticket(TicketIn):
    id: int
    created_at: datetime
    status: Status = Status.open

DB: dict[int, Ticket] = {}

@app.post("/tickets", status_code=201)
def create(req: TicketIn) -> Ticket:
    new = Ticket(id=len(DB) + 1, created_at=datetime.now(), **req.model_dump())
    DB[new.id] = new
    return new

@app.get("/tickets/{req_id}")
def get(req_id: int) -> Ticket:
    if req_id not in DB:
        raise HTTPException(404, "not found")
    return DB[req_id]
```

```bash
uv run uvicorn main:app --reload
# In a second tmux pane:
curl -s -X POST localhost:8000/tickets -H 'content-type: application/json' \
  -d '{"account_id":"A12","customer_email":"sam@example.com","subject":"Cannot export report"}' | jq
curl -s localhost:8000/tickets/1 | jq
curl -s -X POST localhost:8000/tickets -H 'content-type: application/json' -d '{}' | jq   # 422 — read the error
open http://localhost:8000/docs
uv run ruff check . && uv run mypy main.py
```

Python fundamentals to practise in a REPL (`uv run python`):

- lists, dicts and comprehensions
- f-strings
- `for`/`enumerate`
- functions with default arguments
- exceptions and `try/except`
- `with` blocks
- `dataclass` vs pydantic

## 3. Unguided challenge (~3 hrs)

Extend the service with:

- `GET /tickets`, with `?status=` filtering and `limit`/`offset` pagination
- `PATCH /tickets/{id}` to update the status; return `409` if the ticket is already `resolved`
- a `tests/test_api.py` with at least 6 tests using FastAPI's `TestClient`
- a CI workflow running ruff, mypy and pytest

**Acceptance criteria:**

- `uv run pytest` passes.
- CI is green.
- `/docs` shows every endpoint with example payloads.

## 4. System design #1 — APIs (~1.5 hrs)

Design the public API for the ticket service, as used by partner companies that create and track tickets from their own systems. One page:

- resources and endpoints
- authentication approach
- pagination style (offset or cursor, and why)
- error format
- idempotency for `POST`: what happens if the partner retries? (Look up `Idempotency-Key` headers.)
- why REST rather than GraphQL or gRPC here, and when you'd choose each

Then write your first **ADR** (Architecture Decision Record) in `docs/adr/0001-rest-api.md`, with sections for Context, Decision, Consequences and Alternatives. Add a **three-line exec summary** for a non-technical stakeholder.

Defend it: *"Claude, staff engineer mode, poke holes in this API design."*

## 5. Ways of working (~1 hr)

**Shape Up** (Basecamp): fixed time with variable scope, appetite rather than estimates, shaping before betting, 6-week cycles plus cooldown. Compare it with the sprint process you know. Where would it break at a 500-person company?

## 6. Check

1. What's the difference between 401 and 403?
2. Why does FastAPI return 422 rather than 400 for a bad body?
3. What does pydantic give you that type hints alone don't?
4. Offset vs cursor pagination: name one failure mode of offset.
5. What problem does an idempotency key solve?

Recycled:

- When would you rebase rather than merge?
- What's an environment variable?

## 7. Teach-back

Write "What actually happens when you call an API."

## Done when

- [ ] Service extended, tests passing, CI green
- [ ] API design doc, ADR 0001 and exec summary committed
- [ ] Design defended
- [ ] Check and teach-back done
