---
layout: post
title: "LLMOps Without Failure Modes Is Just Vibes: How I Actually Engineer Reliability for Model-Driven Systems"
date: 2026-01-30 21:35:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Engineering Failure Modes](/img/posts/engineering-failure-modes.webp)

A lot of LLMOps talk feels like cosplay.

Dashboards, prompt templates, “eval harnesses” that measure trivia, and a vague promise that if we tune enough, production will behave.

I don’t dislike the tooling. I dislike the missing question:

**What is your system’s failure mode, and what do you do when it happens?**

Because in production, reliability is not a vibe. It’s a set of mechanisms that turn inevitable failures into survivable incidents.

Here’s the practical mental model I use when I build model-driven systems.

## Start where SRE starts: define what “good” means

Before you optimize anything, define an SLO.

Not “accuracy.” Not “helpfulness.”

Real SLOs:

- 99.9% of requests return within 2s
- <0.1% of responses violate policy
- <1% of tool calls result in unknown state
- zero silent data corruption in the action ledger

Without SLOs, you don’t have reliability. You have opinions.

## The core problem: non-determinism meets side effects

LLMs are non-deterministic.

Production systems with side effects (writes, purchases, permissions) demand determinism.

That mismatch is where most incidents come from.

So I design around one rule:

> **The model may propose. The system must be able to refuse.**

Which leads to the mechanisms below.

## Mechanism #1: make every action replayable

If I can’t replay what happened, I can’t debug it.

So for any agentic flow, I persist:

- the user input
- the model output (raw)
- tool call requests and responses (raw)
- a normalized “decision record” (what we believed)
- a signed action ledger entry (what we attempted)

This is boring. It’s also how you stop guessing.

## Mechanism #2: idempotency everywhere

If a tool can cause a side effect, it needs an idempotency key.

If the tool doesn’t support it, I wrap it until it does.

Because the most common failure in distributed systems is: **success without acknowledgment**.

If you don’t engineer for that, you’ll ship duplicate side effects.

## Mechanism #3: bounded autonomy

I don’t trust “fully autonomous” agents.

Not because they can’t do tasks.

Because autonomy expands the blast radius.

So I enforce tiers:

- Tier 0: read-only (safe)
- Tier 1: draft-only (emails, PRs, tickets)
- Tier 2: reversible writes (feature flags, staged changes)
- Tier 3: irreversible changes (money, permissions, deletions) → requires human approval

Autonomy is not a binary. It’s a policy.

## Mechanism #4: circuit breakers for tools and for the model

Most teams add retries.

They forget to add “stop.”

I set:

- max tool failures per step
- max total tool calls per task
- max wall-clock per task
- max model tokens per task

When any limit hits, the system halts and emits an incident report.

This prevents the classic runaway agent:

- spinning on failures
- consuming quota
- producing nonsense
- hiding it behind confidence

## Mechanism #5: degrade modes (a real one, not marketing)

When the model is slow, expensive, or unreliable, what happens?

If your answer is “we scale,” you’re not thinking about failure modes.

Degrade modes I actually implement:

- switch to a cheaper model
- switch to extraction-only mode (no actions)
- switch to deterministic heuristics
- require explicit confirmations
- queue tasks for later execution

Reliability is the ability to keep delivering *some* value while failing.

## Mechanism #6: evaluate like an engineer, not like a demo

I don’t care about benchmark bragging.

I care about:

- regression across deployments
- tail latency under load
- tool-call correctness distribution
- policy violation rate
- unknown-state rate

And I care about adversarial tests that reflect production:

- truncated tool responses
- flaky APIs
- partial permissions
- conflicting instructions
- stale cached data

If your evals don’t simulate broken dependencies, they’re training you to trust a lie.

## The conclusion I keep writing on the whiteboard

LLMOps is not prompt engineering.

LLMOps is reliability engineering with a new kind of component—one that speaks well and fails weirdly.

So my practical stance is simple:

- assume the model will be wrong sometimes
- assume tools will degrade
- design for unknown state
- keep the blast radius small
- preserve artifacts so you can learn

The teams that win won’t be the ones with the prettiest prompts.

They’ll be the ones who treat failure modes as first-class requirements.
