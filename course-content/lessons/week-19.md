---
week: 19
title: Voice Pipelines and AI System Design
phase: "6. AI engineering"
hours: "8–10"
topics: [speech-to-text, text-to-speech, latency budgets, turn-taking, barge-in, realtime APIs, model routing, LLM caching, bias, human-in-the-loop, kill switches]
threads: ["F. LLM cost & latency budgets", "G. Bias, HITL, failure modes"]
system_design: "AI system design — latency, cost, fallbacks, eval gates"
mock_review: "AI feature launch review (ML/AI engineer)"
ways_of_working: "Case study: voice AI in production"
deliverable: "A local voice-agent prototype with a measured latency budget and a launch-review pack"
---

# Week 19 — Voice Pipelines and AI System Design

**Phase 6 · Threads F and G · System design #8 · Mock review #5**

## 1. Concept brief

A voice agent is a pipeline: **speech-to-text (STT) → LLM → text-to-speech (TTS)**, plus turn-taking. Users notice delays above roughly 800 ms, so every stage has a latency budget. Production systems also need fallbacks, a human handoff and a kill switch.

**Vocabulary**

- **STT / ASR:** speech-to-text. Streaming STT gives partial transcripts as the person speaks.
- **TTS:** text-to-speech. What matters is time-to-first-audio.
- **VAD:** voice activity detection — has the person stopped talking?
- **Barge-in:** the user interrupts while the agent is speaking. The agent must stop.
- **Realtime / speech-to-speech models:** a single model handling audio in and audio out, which cuts latency.
- **Latency budget:** the time allowed per stage, for example STT 200 ms + LLM first token 400 ms + TTS first audio 200 ms.
- **Model routing:** a cheap, fast model for easy turns and a strong model for hard ones.
- **Human-in-the-loop (HITL):** escalating to a person on low confidence or sensitive cases.

## 2. Guided lab (~3.5 hrs) — local, no audio API keys needed

```bash
brew install whisper-cpp sox
mkdir -p ~/dev/voice-agent/models && cd ~/dev/voice-agent && uv init
curl -L -o models/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

# Record 5 seconds, transcribe, speak a reply
rec -r 16000 -c 1 in.wav trim 0 5
time whisper-cli -m models/ggml-base.en.bin -f in.wav -nt
time say -v Samantha "Thanks, I've reset your password and sent a confirmation email."
```

Build `agent.py`, a loop that:

1. records until silence (`sox` silence detection, or a fixed window)
2. transcribes with whisper-cli
3. calls the LLM, playing a first-line voice support agent with access to your week 18 tools, with **streaming**
4. speaks each sentence as soon as it completes, rather than waiting for the whole reply

Instrument the timestamps for end-of-speech, transcript ready, LLM first token, first sentence complete and first audio. Print a latency table for 10 turns.

Then compare a hosted streaming STT/TTS or realtime speech API, using any provider's free tier. Read its latency docs and note the trade-offs: cost, data residency, data-processing terms (DPA, and a BAA if you handle health data), and voice quality.

## 3. Unguided challenge (~2.5 hrs)

- Hit a budget of **p50 under 1.5 s** from end of speech to first audio locally. Document what you changed.
- Add **routing**: a small, fast model by default and a stronger model when the intent is ambiguous. Measure the cost and latency difference.
- Add **escalation**: on low confidence, a detected request for a human, or a sensitive topic, the agent says it will transfer and logs a handoff event.
- Add a **kill switch**: an environment flag that routes every call to a human queue.

**Acceptance criteria:**

- A latency table at p50 and p95.
- The routing comparison.
- Escalation and kill switch demonstrated.

## 4. Thread G — bias and failure modes (~45 min)

- Run your week 18 evals on audio with different accents and speech patterns. You can generate audio with `say -v` using different voices, then transcribe it. Does accuracy differ?
- List the agent's failure modes (mishearing, looping, false confidence, being cut off) and the mitigation for each.

## 5. System design #8 — AI system design (~1 hr)

Design a production **voice support agent with human fallback**. Cover:

- architecture (telephony, STT, LLM, TTS, state store, queue)
- latency budget per hop
- per-minute cost
- eval gates before rollout
- monitoring (containment rate, escalation rate, call outcome)
- sensitive-data handling (PII, and regulated data in your domain)
- failure behaviour when the LLM provider is down

Write an ADR and an exec summary.

## 6. Mock review #5 — AI launch review (~1 hr)

Claude plays an ML engineer running a launch review. Bring:

- eval results with confidence intervals
- the red-team report
- the cost model
- the latency table
- the escalation design

Expect: *"What's your rollback plan? What's the worst thing this can say to a caller? How will you know in production that quality has dropped?"*

## 7. Check

1. Which stage usually dominates voice latency?
2. Why speak sentence by sentence?
3. What is barge-in, and why is it hard?
4. When should the agent hand off to a human?
5. What does a kill switch protect against?

Recycled:

- Why run evals 3 times?
- What's prompt injection?

## 8. Teach-back

Write "The 800 ms problem: building a voice agent."

## Done when

- [ ] Local voice loop with instrumentation
- [ ] p50 under 1.5 s documented
- [ ] Routing, escalation and kill switch working
- [ ] Bias check done
- [ ] Voice-agent ADR defended
- [ ] Launch review passed
- [ ] Check and teach-back done
