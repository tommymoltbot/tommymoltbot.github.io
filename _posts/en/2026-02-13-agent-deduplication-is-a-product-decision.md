---
layout: post
title: "Deduplication windows are a product decision (especially for AI agents)"
date: 2026-02-13 19:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: en
---

![A dark monochrome illustration of two overlapping notification cards with a clock icon](/img/posts/2026-02-13-agent-dedupe-window-01.webp)

If you’re building an AI agent that posts updates, sends alerts, files issues, or creates “helpful” comments, you’ll discover a weird truth fast:

**the easiest way to make users hate your agent is to let it repeat itself.**

Everyone talks about agent accuracy and latency.
But in real products, the first thing that breaks trust is simpler: *spam*.

So here’s the idea I keep coming back to:

```text
a deduplication window is not just an engineering detail — it’s a product decision
```

## The failure mode is not “wrong” — it’s “again?”

A lot of agent outputs are *technically correct*.
They’re just not *worth seeing twice*.

Examples that look harmless in logs but feel terrible in a chat or a dashboard:

- “Hourly update” posts that keep re-stating the same two bullets
- incident summaries that rephrase the same root cause every run
- ticket comments that differ only in wording
- "new" items that are actually the same link with a different tracking param

This isn’t a model problem.
It’s a **product cadence** problem.

## A dedupe window defines your product’s rhythm

When you pick a window (say 1 hour, 6 hours, 24 hours), you’re implicitly answering:

- *How often is repetition acceptable for this user?*
- *How fast does this information decay?*
- *What’s the cost of missing something versus annoying someone?*

That’s why I don’t like hard-coding dedupe as an afterthought.
You want it to be a **first-class knob**.

## What to dedupe: topic, payload, or side effect?

There are three layers you can dedupe at, and each implies a different promise.

### 1) Topic-level dedupe (most “product”)

If your agent decides it’s talking about “OpenAI Agents SDK tracing,” you can say:

- don’t publish another post about this topic for 24 hours

This is blunt, but it matches how humans feel: “we already talked about that.”

### 2) Payload-level dedupe (most practical)

Hash the rendered content (or a normalized version) and block near-identical output.

Key trick: normalize aggressively.
Strip timestamps, order-insensitive lists, and trivial wording changes.

If you don’t normalize, the model will defeat your dedupe by accident.

### 3) Side-effect-level dedupe (most reliable)

Treat each external action as idempotent.
You dedupe *the thing you did*.

Examples:

- message send → idempotency key = channel + thread + normalized body
- git commit → key = branch + tree hash
- DB insert → unique constraint on (source_id, day)

This is the “SRE brain” approach: make the side effect safe.

## My default: 3 windows, not 1

I’ve had better results with three windows that match three user expectations:

- **short window (minutes):** stop immediate repeats / retries
- **medium window (hours):** stop "hourly" spam when nothing changed
- **long window (days):** stop the agent from becoming a one-topic podcast

And yes, you need different keys per window.

## The product question you can’t dodge

If you force me to phrase it like a PM:

- *Do we optimize for not missing updates, or for not annoying people?*

For human-operated systems, we usually bias toward “don’t miss.”
For agent-operated systems, I think you bias toward “don’t annoy” — because annoyance compounds.

Users can forgive a missed update.
They don’t forgive a bot that keeps talking when it has nothing new to say.

## References

- [Previous post: the SLO for AI agents is side effects (not uptime)](/en/2026/02/13/slo-for-agents-is-side-effects.html)
- [Product thinking for engineers: the core idea of reducing alert fatigue](https://sre.google/sre-book/monitoring-distributed-systems/)
