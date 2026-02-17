---
layout: post
title: "Sonnet 4.6’s 1M context isn’t the point — tool contracts are"
date: 2026-02-17 18:10:00 +0000
categories: [AI]
tags: [AI]
image: /img/posts/tool-contracts-vs-prompts.webp
---

I get why “**1 million tokens**” makes people’s eyes light up. The mental picture is simple: *stuff the whole repo into the prompt, press Enter, receive truth.*

But after you’ve shipped a couple real systems with agents, you realize the bottleneck isn’t “can the model read everything.” It’s “can we make the model behave safely and predictably when it **can** read everything.” Those are different problems.

## The first trap: context size turns into context entitlement

Give an agent a huge window and suddenly every task becomes:

- “Just paste the entire codebase.”
- “Just paste the entire contract.”
- “Just paste the entire incident timeline.”

That *feels* like progress, but it quietly changes your engineering posture. Instead of designing systems that are **composable**, we start relying on a single request that’s **omniscient**.

When it works, it looks magical.

When it fails, you don’t get a clean error — you get a confident blob that *sounds* consistent with the larger context you gave it.

Bigger context increases the surface area for:

- irrelevant details hijacking the plan
- hidden contradictions the model “averages out”
- subtle policy / security constraints getting lost in the noise

## The real bottleneck: tool contracts, not prompts

If you want agents to be useful in production, you need something closer to APIs than vibes.

A **tool contract** is basically: “what’s allowed, what’s required, and how errors look.” It’s the difference between:

- “go fix the bug”

and

```text
create_patch(files: path[], intent: string) -> {diff: unified_diff, tests_run: string[], risks: string[]}
```

Even if the model has the entire codebase in context, it still needs:

- a constrained way to make changes
- an audit trail you can review quickly
- predictable failure modes

Otherwise you’ve just upgraded the *size* of the hallucination.

## The second trap: “computer use” demos hide the operational costs

Models getting better at “computer use” is real, and it’s genuinely useful. But the demo version always skips the unsexy parts:

- retries
- timeouts
- flaky UIs
- rate limits
- partial state (you clicked something, but did it save?)

When an agent has a massive context window, people assume it will also have massive reliability. It won’t.

Reliability comes from **systems design**, not from context.

## My take

A big context window is a *nice ceiling lift*. It lets you do things that were previously annoying (multi-file refactors, long policy docs, big incident logs).

But if you’re building something real, the win is still:

- tighten tool contracts
- reduce degrees of freedom
- make the review surface small
- treat agents like junior teammates with too much confidence

The future isn’t “the model sees everything.”

It’s “the model can only do a few things — and those few things are easy to verify.”

## References

- [TechCrunch coverage on Anthropic releasing Sonnet 4.6](https://techcrunch.com/2026/02/17/anthropic-releases-sonnet-4-6/)
