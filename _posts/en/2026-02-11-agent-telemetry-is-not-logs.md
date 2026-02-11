---
layout: post
title: "Agent telemetry isn’t logs. It’s RPC-level observability."
date: 2026-02-11 17:00:00 +0000
categories: [Engineering, Tech]
tags: [Engineering, Tech]
author: Tommy
excerpt: "If your agent can call tools, it’s running a distributed system. Treat tool calls like RPC: traces, budgets, and contracts — not a pile of logs you grep later."
image: /img/posts/agent-telemetry-waterfall.svg
lang: en
---

I keep seeing the same failure mode with “agents”:

- it works in the demo
- it breaks in production
- the postmortem turns into **log archaeology**

And the whole time people talk like the solution is “more logs”.

No.

If an agent can call tools, it’s already a distributed system. Which means what you need isn’t more logs — it’s **telemetry**.

The difference is not philosophical. It’s operational.

## Five different angles I use to sanity-check this

1) **Business angle:** if the agent is allowed to spend money (tokens, API calls), you need to explain *where the money went*.

2) **System angle:** tool calls are RPC. If you can’t trace them end-to-end, you’re flying blind.

3) **History angle:** we solved this for microservices a decade ago. The fact that the caller is “an LLM” doesn’t change the math.

4) **Engineer angle:** if debugging requires reproducing a conversation, you’ve built a haunted system.

5) **My personal bar:** if I can’t answer “what happened?” in 60 seconds, it’s not production-ready.

## Logs tell you what printed. Telemetry tells you what happened.

Logs are strings.

Telemetry is structured, correlated signals that let you reconstruct a request.

When an agent runs one user request, you want a single umbrella view:

- request id
- which model was called
- which tools were called, in what order
- how long each step took
- what it cost
- what failed and what got retried

In other words: a trace.

If you’re only logging, you end up with this kind of question:

```text
"Was the tool call slow, or did the model think too long?"
```

…and you don’t have a reliable answer.

## Treat tool calls like RPC: spans + attributes + budgets

The simplest mental model:

```text
user request
  -> agent span
     -> llm.call span
     -> tool spans (http.fetch / db.query / browser.act / exec)
     -> write spans (cache / queue / storage)
```

For each span, record a small set of fields that you can aggregate:

- `trace_id` / `span_id` / `parent_span_id`
- `name` (tool name, model name)
- `duration_ms`
- `status` (ok/error/timeout)
- `attempt` (retries)
- `cost` (tokens, $)
- **digests** of inputs/outputs (hashes, sizes), not raw secrets

And then add budgets:

- max tool calls per request
- max dollars / tokens per request
- max wall-clock time
- circuit breakers per tool

Without budgets, “autonomous” just means “unbounded”.

## The secret leak trap: stop storing raw prompts everywhere

A lot of teams try to get “observability” by dumping the full prompt + full tool inputs into logs.

That’s not observability. That’s a data incident waiting for a calendar invite.

The safer pattern is:

- store structured metadata by default
- store payloads only behind a separate gate (sampling, redaction, short retention)
- store **digests** so you can correlate and dedupe without leaking content

If you can answer “which tool input caused the incident?” without collecting everyone’s sensitive data, you win twice.

## One more thing: contracts matter more than prompts

Agents fail in boring ways:

- tool schema changed
- tool returned a slightly different shape
- a “best effort” endpoint got rate-limited
- a browser automation step started timing out

If you don’t treat tools as contracts, you end up blaming “the model” for what is basically integration drift.

So in production, I care about:

- tool versioning
- stable schemas
- explicit error taxonomy
- idempotency keys

That’s how you stop chasing ghosts.

## My rule of thumb

If you can’t answer these three questions quickly, you don’t have telemetry yet:

1) What did the agent do?
2) Where did time go?
3) Where did money go?

Once you can answer them, you can finally have the fun conversations: model choice, prompt style, tool quality, and product UX.

Before that, you’re just guessing.

---

## References

- [OpenTelemetry: traces (concepts and terminology)](https://opentelemetry.io/docs/concepts/signals/traces/)
- [OpenTelemetry specification (canonical data model and semantics)](https://opentelemetry.io/docs/specs/)
