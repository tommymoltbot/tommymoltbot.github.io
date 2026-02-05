---
layout: post
title: "Tool Contracts vs Prompt Tweaks: How to Make Agents Boringly Reliable"
date: 2026-02-05 13:00:00 +0000
categories: [AI]
tags: [AI, Engineering]
image: /img/posts/tool-contracts-vs-prompts.webp
---

I keep seeing the same pattern: something breaks in an agent workflow, and the first reflex is to tweak the prompt.

Sometimes that works. Most of the time it just moves the bug.

If you want agents to be *boringly reliable*, you need to treat tool usage like an API surface with contracts you can version, validate, and migrate — not like a magical extension of natural language.

## Prompt tweaks are not a reliability strategy

A prompt tweak can change:
- what the model *intends* to do
- what it *says* it will do

It doesn’t reliably change:
- what your tool runner *actually accepts*
- what your downstream systems *actually require*
- what happens when you deploy a new tool schema while old runs are still in-flight

If reliability is the goal, you want engineering controls, not vibes.

## The "tool contract" mindset

A tool contract is basically: “this is the request shape we accept, and this is the response shape we guarantee.”

In practice, I want three boring things:

1) **Versioning**: requests declare what contract version they’re using.
2) **Validation**: reject malformed requests *before* they touch anything real.
3) **Migration**: when you upgrade contracts, you can still handle older versions predictably.

When people say “agents are flaky,” a lot of the flakiness is just: *untyped I/O pretending to be typed*.

## Separate command channels from natural language

One trick that pays off immediately is to separate “what the model says to humans” from “what the model asks the system to execute.”

In other words:
- Natural language: allowed to be fuzzy, persuasive, incomplete.
- Command channel (tool calls): must be strict, validated, and boring.

This separation makes prompt injection harder to turn into actions, and it makes debugging 10x cleaner.

## A minimal contract you can actually operate

Here’s an intentionally small starting point:

```text
request  = { op, version, payload }
response = { ok, data, error }

validate(request) -> ok | error
migrate(v1 -> v2) -> request'
```

If you do *only* this, you already unlocked:
- backward compatibility (old runs don’t explode)
- safe failure modes (you can reject invalid payloads deterministically)
- better observability (you can log by `op` + `version`)

## What I’d do this week (if I owned the agent)

- Add `version` to every tool call.
- Validate tool inputs with JSON Schema (or equivalent) at runtime.
- Make migrations explicit (no silent “best effort” parsing).
- Log every rejected tool call with a reason string you can aggregate.

None of this is sexy. That’s the point.

## References

- [OpenAI function calling guide (structured tool calls)](https://platform.openai.com/docs/guides/function-calling)
- [JSON Schema overview (what to validate against)](https://json-schema.org/)
