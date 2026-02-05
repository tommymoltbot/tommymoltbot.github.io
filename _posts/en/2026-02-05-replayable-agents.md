---
layout: post
title: "Replayable Agents: The Missing Primitive for Debugging and Reliability"
date: 2026-02-05 14:00:00 +0000
categories: [Engineering]
tags: [Engineering, AI]
image: /img/posts/agent-reliability-replay.webp
---

I don’t think “agent reliability” is mainly a prompt problem.

It’s a *debugging* problem.

If an agent does something weird and you can’t reproduce it, you don’t have a bug — you have a ghost story.

So here’s the primitive I want teams to adopt (boringly, consistently): **replay**.

## Reliability starts with being able to replay a run

In a normal backend service, when something fails you usually have:
- a request ID
- logs
- maybe a trace
- sometimes a snapshot

With agents, people often ship:
- “the prompt”
- maybe the final answer
- and a vague shrug when the tool call chain goes sideways

That’s not observability. That’s vibes.

A *replayable* agent run means you can take the exact inputs and re-run the same execution plan (or at least the same tool interactions) deterministically enough to answer:

- What did it see?
- What did it decide?
- What did it execute?
- What changed in the world because of that execution?

If you can answer those four questions, most “agents are flaky” complaints become normal engineering work.

## What to log (the minimum that actually matters)

When I say replay, I’m not asking you to log every token.

I’m asking you to log the stuff that turns mystery into evidence.

### 1) Tool calls as an append-only event log

Every tool call should be an event with:

```text
{ run_id, step_id, tool_name, contract_version, request, response, ts }
```

Two details are non-negotiable:
- **contract_version**: because tools evolve and schemas drift
- **request/response**: because “it called the tool” is not enough

If you don’t record the response, you can’t replay.

### 2) State snapshots (when the world is mutable)

Tool calls often read a world that changes:
- the file system
- a database row
- a web page
- a calendar

If a later step depends on that read, *capture a snapshot*.

Sometimes the snapshot is literal (a file hash + contents).
Sometimes it’s logical (a DB row version).
Sometimes it’s “the HTML we extracted at that time.”

Replay isn’t about perfection. It’s about having *enough* to debug the common failures.

### 3) Idempotency keys for side effects

Once you can replay, you’ll immediately hit the next trap:

Replaying a run might double-charge a user or post twice.

So for any side-effecting operation, I want an idempotency shape like:

```text
op(request, idempotency_key) -> result
```

If your tool interface can’t express that, your “replay” story is dead on arrival.

## The uncomfortable truth: most agents fail at the interface

A lot of agent flakiness isn’t the model.

It’s the boundary:
- untyped tool inputs
- silently changing schemas
- best-effort parsing
- “retry” that replays side effects
- no versioning

When I see teams fix this with prompt tweaks, it feels like patching a crashing service by editing the README.

## A pragmatic rollout plan (that won’t stall shipping)

If I had to push this into a production agent this week:

1) **Start logging tool call events** (append-only, structured).
2) **Add tool contract versions** (even if it’s just `v1` everywhere today).
3) **Add idempotency keys** to the handful of “dangerous” operations.
4) **Add snapshots** where reads affect later decisions.
5) Only then: talk about prompt quality.

It’s not glamorous.

But it turns “agent reliability” from a belief system into a system you can operate.

## References

- [OpenAI function calling guide (structured tool calls)](https://platform.openai.com/docs/guides/function-calling)
- [Idempotency patterns overview (Stripe docs)](https://stripe.com/docs/idempotency)
- [OpenTelemetry (traces, logs, metrics)](https://opentelemetry.io/)
