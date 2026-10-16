---
week: 16
title: LLM APIs and Structured Outputs
phase: "6. AI engineering"
hours: "8–10"
topics: [LLM APIs, tokens, context windows, system prompts, temperature, streaming, structured outputs, JSON schema, tool use basics, prompt caching]
threads: []
ways_of_working: "Case study: an AI-native product team"
deliverable: "A support-conversation triage service that returns validated structured output via an API endpoint"
---

# Week 16 — LLM APIs and Structured Outputs

**Phase 6 · Ways of working: AI-native team case study**

> **Domain pack:** Using a domain pack? Extract structured fields from your domain's text instead, for example drug, dose, reaction and seriousness from synthetic case narratives.

## 1. Concept brief

An LLM call is just an HTTP request: messages in, text (or structured data) out. Product engineering with LLMs is about making that probabilistic component **reliable**, with schemas, validation, retries, evals and cost control around it.

**Vocabulary**

- **Token:** the unit of text the model reads and bills by (roughly ¾ of an English word).
- **Context window:** the maximum number of tokens in plus out per call.
- **System prompt:** standing instructions, separate from the user's message.
- **Temperature:** randomness. Use low values for extraction and higher ones for ideation.
- **Structured output:** forcing the response to match a JSON schema, via native structured-output features or tool-use with an input schema.
- **Tool use / function calling:** the model asks *your code* to run a function and gets the result back.
- **Streaming:** receiving tokens as they're generated, which improves perceived latency.
- **Prompt caching:** reusing a long, unchanged prompt prefix cheaply.

## 2. Guided lab (~3.5 hrs)

```bash
mkdir -p ~/dev/support-ai && cd $_ && uv init
uv add anthropic pydantic fastapi uvicorn python-dotenv
echo "ANTHROPIC_API_KEY=sk-..." > .env && echo ".env" >> .gitignore
```

```python
# hello.py
import anthropic
from dotenv import load_dotenv; load_dotenv()

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-5"   # check docs.claude.com for the current model names

msg = client.messages.create(
    model=MODEL, max_tokens=300,
    system="You are a concise assistant for a customer support team.",
    messages=[{"role": "user", "content": "Summarise what a support SLA is in two sentences."}],
)
print(msg.content[0].text)
print(msg.usage)   # input and output tokens: this is your cost
```

**Structured output via a tool schema:**

```python
from pydantic import BaseModel
from typing import Literal

class TicketTriage(BaseModel):
    category: Literal["billing", "bug", "how_to", "account_access", "feature_request"]
    priority: Literal["low", "normal", "high", "urgent"]
    needs_human: bool
    summary: str
    sentiment: Literal["positive", "neutral", "negative"]
    confidence: float

tool = {"name": "record_summary", "description": "Record the structured ticket triage",
        "input_schema": TicketTriage.model_json_schema()}

resp = client.messages.create(
    model=MODEL, max_tokens=500, tools=[tool],
    tool_choice={"type": "tool", "name": "record_summary"},
    messages=[{"role": "user", "content": f"Conversation:\n{open('t1.txt').read()}"}],
)
data = next(b.input for b in resp.content if b.type == "tool_use")
print(TicketTriage.model_validate(data))
```

Ask Claude to generate 20 **synthetic** support conversations: varied categories, angry and confused customers, multiple issues in one message, typos. Never use real customer data.

Then experiment:

- Run temperature 0 vs 1 on the same conversation 5 times each. What varies?
- Stream a response with `client.messages.stream(...)` and print the tokens as they arrive.
- Measure latency and tokens per call, and compute the cost per 1,000 tickets from the current pricing page.

## 3. Unguided challenge (~2.5 hrs)

Build the endpoint `POST /triage` that:

- accepts a conversation and returns a validated `TicketTriage`
- retries once if validation fails, feeding the validation error back to the model
- logs latency, token counts and model version per call to a local SQLite table
- has a `--dry-run` mode with a fake client, for tests that don't spend tokens

**Acceptance criteria:**

- All 20 synthetic conversations return schema-valid output.
- Tests run without network access.
- A cost-per-1k-tickets figure is in the README.

## 4. Ways of working (~1 hr)

Read a recent write-up from an AI-native product team on how they build with LLMs (search for "how we build with LLMs" posts from companies whose products you use). Note three practices you'd adopt and one you're sceptical of.

## 5. Check

1. What's a token, and why does it matter for cost?
2. Why use a tool schema for extraction instead of asking for JSON in the prompt?
3. When would you use temperature 0?
4. Why log the model version per call?
5. What does streaming improve, and what doesn't it improve?

Recycled:

- What's a data contract?
- What's a DBU?

## 6. Teach-back

Write "An LLM is just an API call: the engineering around it is the product."

## Done when

- [ ] Hello-world, structured output and streaming working
- [ ] `/triage` with retries, logging and offline tests
- [ ] Cost model in the README
- [ ] Case-study notes written
- [ ] Check and teach-back done
