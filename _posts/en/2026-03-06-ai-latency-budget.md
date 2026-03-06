---
layout: post
title: "AI latency budgets: if you don’t allocate them, the model will steal them"
date: 2026-03-06 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A latency budget stack for an AI feature](/img/posts/2026-03-06-ai-latency-budget-01.webp)

Most teams *think* they have a latency goal.

In reality they have a vibe:

- “Feels fast enough on my laptop.”
- “We’ll optimize later.”
- “The model is the product, so the model gets… whatever time it wants.”

And then you ship.

Then you add tools. Then you add retrieval. Then you add streaming. Then you add a retry because the tool endpoint is flaky.

Suddenly your *chat* feature has the same performance profile as a distributed system you didn’t mean to build.

## The part people miss: AI latency isn’t one thing

When someone says “the model is slow”, half the time the model isn’t even the bottleneck.

What you actually have is a stack of little tax bills:

- network + TLS + mobile radio weirdness
- auth + rate limits + gateway hops
- prompt building (templating + safety + conversation window)
- retrieval (vector DB + rerank + hydration)
- model inference
- tool calls (often multiple)
- post-processing (JSON repair, validation, UI formatting)

If you don’t **make the budget explicit**, the biggest and most variable block (inference + tools) expands until everything feels mushy.

That’s not a morality play. That’s just physics.

## A practical budgeting rule I like

I like to start with an ugly but useful split:

- **1/3 for “non-AI plumbing”** (everything you *must* do before you can ask the model)
- **1/3 for inference** (the “thinking + tokens” cost)
- **1/3 for tools** (anything that depends on the outside world)

Then I break the last third again:

```text
tool_time = (p95 * number_of_tools) + (retry_penalty)
```

Not because the formula is perfect.

Because it forces you to admit something out loud: **“tool calls are a product decision, not a free add-on.”**

If the product wants 3 tools per answer, then the product is also choosing:

- slower responses
- more partial failures
- more “it worked on staging” incidents

## The engineer move: trace it like a real system

The fastest way to stop arguing is to trace your pipeline end-to-end.

At minimum, I want spans for:

- request received → response flushed
- prompt build
- retrieval
- model call (including tokens in/out)
- each tool call (including retries)
- validation / parsing

Two details that matter a lot in AI systems:

1) **Capture token counts and stop reasons** as structured attributes.
   If your “fast” answers are fast because they stop early, that’s not optimization — that’s a behavior change.

2) **Make tool retries visible**.
   “One retry” is the difference between a crisp 1.2s and a soggy 3.8s.

## What I’d actually ship (if I owned the feature)

If the feature has a 2.5s p95 target, I’d ship these constraints early:

- hard cap on tool count per answer
- hard cap on retrieval candidates
- streaming on by default (perceived latency matters)
- degrade modes (no tools / no rerank / shorter context) instead of “just wait longer”

And I’d put the budget in code, not in a doc.

Because docs don’t page you at 3AM. Code does.

---

**References:**
- [Google SRE Book: Service Level Objectives (how to think about latency goals)](https://sre.google/sre-book/service-level-objectives/)
- [Google SRE Book: Monitoring Distributed Systems (latency, percentiles, and why averages lie)](https://sre.google/sre-book/monitoring-distributed-systems/)
- [OpenTelemetry documentation (distributed tracing concepts and implementation)](https://opentelemetry.io/docs/)
- [W3C Trace Context specification (propagating trace IDs across services)](https://www.w3.org/TR/trace-context/)
