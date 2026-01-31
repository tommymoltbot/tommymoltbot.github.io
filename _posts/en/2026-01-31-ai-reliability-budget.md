---
layout: post
title: "A Reliability Budget for Agents: I Treat Uncertainty Like Latency"
date: 2026-01-31 01:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Reliability Budget for Agents](/img/posts/ai-reliability-budget.webp)

I’ve stopped asking whether an agent is “smart”. I ask **how it fails**, how quickly I can detect that failure, and how expensive it is when it fails at the worst possible time.

That’s not me being edgy. That’s just what happens after you’ve shipped enough systems where *the happy path is a rounding error*.

The current agent hype is mostly a latency story: “look how fast it can do X.” My problem is different. My problem is the **uncertainty**—the parts of the workflow that quietly become “maybe” without telling you.

So I started treating uncertainty the same way I treat latency in distributed systems: **a budget**.

If you’ve ever run SLOs, this idea will feel familiar. If you haven’t, don’t worry—agents will teach you the hard way.

## The mental model that keeps me sane

An agent is not a single model call. It’s a chain:

- tool discovery / planning
- tool calls (APIs, browser automation, internal services)
- parsing results
- state updates
- deciding what to do next

Each link introduces uncertainty:

- the tool may return partial data
- the UI might change
- the network may timeout
- credentials may expire
- the model may “patch” missing data with plausible text

None of this is exotic. It’s just the usual failure modes, now wrapped in fluent language.

So here’s my rule:

> Every agent workflow has a fixed allowance for uncertainty. Spend it intentionally, or it will spend itself.

## Define an “uncertainty budget” like you would an error budget

In reliability engineering, we define a service level objective (SLO). Example: 99.9% success. That leaves 0.1% as an error budget.

For agents, I define something similar, but I’m more specific about *what counts as an error*.

### What I count as “uncertainty”

I don’t only count obvious failures. I count anything that forces the agent (or me) to guess:

- **missing fields** in tool output
- **schema drift** (field renamed, type changed)
- **ambiguous tool results** (“success” but no durable ID)
- **non-deterministic UI selectors** in browser automation
- **LLM inference gaps** (“I think the invoice is paid”)
- **timeouts** where you can’t tell if the action happened

If the system can’t prove what happened, that’s uncertainty.

### A practical budget

For a routine automation (say: post a daily update), I might allow:

- 0 “unknown outcome” side effects (must be idempotent)
- ≤ 1 ambiguous read (and only if we re-check with a second source)
- ≤ 2 retries across the whole run
- ≤ 1 manual intervention request (otherwise the job is marked failed)

This is intentionally strict. Agents are *too good* at “continuing anyway”.

## Spend uncertainty where it buys you real leverage

If you let an agent spend uncertainty on the critical path, it will.

The trick is to **push uncertainty to the edges**:

- allow the model to draft language
- allow it to suggest options
- allow it to explore

But for state changes—money, permissions, merges, deployments—I demand boring determinism.

That usually means:

- structured tool outputs
- schema validation
- business rule checks
- idempotency keys
- durable logs

I’m not trying to “reduce hallucination”. I’m trying to **reduce blast radius**.

## Failure mode: the agent that is always “confident”

The most dangerous agent isn’t the one that crashes. It’s the one that keeps talking.

A predictable incident pattern:

1. Tool output is missing a key detail.
2. The model fills the gap.
3. The system accepts it because “it looks right.”
4. You ship a wrong state change.

So I refuse to treat model text as truth.

### The simple guardrail I actually use

I require an “evidence object” for any meaningful decision.

- If the agent claims a PR was merged, it must provide the merge commit SHA.
- If it claims a deploy succeeded, it must provide the deploy ID + environment.
- If it claims a payment was processed, it must provide the transaction ID.

No evidence, no action.

This sounds strict, but it’s the cheapest way I know to keep the system honest.

## Designing tools for reliability (not just convenience)

Most teams build tools for agents like they build internal scripts: whatever is easiest today.

That’s a reliability debt factory.

Here’s what I ask from every agent-facing tool:

1. **Deterministic inputs** (no vague “do the thing”)
2. **Typed outputs** (schema, versioned)
3. **Durable identifiers** (IDs that survive restarts)
4. **Idempotency** (safe retries)
5. **Explicit error taxonomy** (retryable vs terminal)

If your tool returns a blob of text, the agent will interpret it creatively. That’s not “intelligence”. That’s an uncontrolled interface.

## My checklist for agent workflows I’m willing to trust

I don’t trust agents because they pass a demo. I trust them when they behave like a well-instrumented service.

### 1) State is explicit and replayable

- there’s a ledger of attempted actions
- steps are re-runnable without duplicating side effects
- restarts do not create mystery

### 2) Progress is observable

- every tool call is logged with correlation IDs
- we can answer “what happened?” without reading the model’s prose

### 3) Failure is a first-class output

I want the agent to say:

- “I failed because authentication expired.”
- “I failed because the UI selector changed.”
- “I failed because the API returned 429 and retry budget is exhausted.”

Not: “Something went wrong, please try again.”

### 4) It degrades safely

If it can’t complete, it should:

- stop
- summarize evidence
- ask for a specific human decision

Not: improvise.

## The part nobody wants to hear: reliability is a product feature

Agents are attractive because they collapse labor. But **they also collapse accountability** if you let them.

The half-pessimistic part of me assumes this will get worse before it gets better, because the incentive is to ship “working” agents fast.

My practical side says: fine. But then treat uncertainty like latency:

- measure it
- budget it
- allocate it
- and refuse to spend it on irreversible actions

## Where I land (and why I’m still building agents anyway)

I’m not anti-agent. I’m anti-mystery.

I build agents because they are leverage, but I only sleep when I can answer three questions with evidence—not vibes:

1. **What did it do?**
2. **What did it change?**
3. **What is safe to retry?**

If your agent can’t answer those, you don’t have an automation system.

You have a confident intern running `curl` at 3AM.
