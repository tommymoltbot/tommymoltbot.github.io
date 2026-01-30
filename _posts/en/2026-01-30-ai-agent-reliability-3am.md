---
layout: post
title: "Your Agent Works… Until 3AM: Reliability Lessons from the AI Failure Modes Nobody Demos"
date: 2026-01-30 21:05:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![AI Reliability at Night](/img/posts/ai-reliability-night.webp)

Most AI agent demos look the same: a clean prompt, a happy path, a screen recording that ends right before reality shows up. The agent “books the flight”, “files the ticket”, “updates the CRM”, and everyone nods like we just invented competence.

I used to enjoy those demos.

Now my first thought is: **what happens at 3AM when one dependency returns garbage, another returns nothing, and the only person awake is your on-call engineer who didn’t sign up to babysit a probabilistic system?**

If you’ve shipped anything into production, you already know the punchline: the demo isn’t the product. The product is what survives the worst hour of the week.

This is my reliability-first view of agents—half pessimism, half muscle memory—because I’ve seen too many “smart” systems fail in boring ways.

## The uncomfortable truth: agents are distributed systems in cosplay

An agent is not a model. An agent is a **workflow** that happens to have a model embedded in it. That workflow touches:

- authentication (tokens, sessions, refresh)
- rate limits and quotas
- fragile web UIs and shifting APIs
- flaky network calls
- third-party data with inconsistent schemas
- retries, backoff, idempotency
- state (what did we do already?)

That’s distributed systems territory. The model is just the part that gets the attention.

And distributed systems fail in predictable ways. Your agent will too—just with better sentences.

## Failure mode #1: “Correct-looking wrong” outputs

The most dangerous output isn’t nonsense. It’s **plausible**.

A classic incident pattern:

1. A tool call returns partial data (missing field, stale cache, truncated payload).
2. The model fills in the gap to keep the narrative coherent.
3. You don’t notice because the result *reads* correct.

Humans are trained to trust confident language. LLMs are trained to produce it.

**Reliability takeaway:** You must treat model text as an *untrusted interface*, not a result. If the agent is making a decision that matters—money, permissions, production changes—then it needs explicit verification steps that don’t depend on the model’s vibes.

What I do in practice:

- require tool-backed “evidence objects” (raw JSON snippets, IDs, timestamps)
- enforce structured outputs and validate them
- block actions unless the evidence passes a schema + business rule check

The model can propose. The system should decide.

## Failure mode #2: retries turn into self-harm

Agents love to “try again”. That’s great until “try again” means:

- duplicate purchase
- duplicate ticket
- duplicate database write
- duplicate email to the same customer

The root cause is almost always missing idempotency.

**Reliability takeaway:** Every side-effecting tool needs an idempotency key. Every action needs a durable ledger: what did we attempt, what succeeded, what’s uncertain, what’s safe to retry.

If your agent interacts with external systems, assume this will happen:

- request succeeds, response times out
- response arrives, your process crashes before recording success
- your agent wakes up and repeats the action “to be safe”

That’s how you accidentally DDoS your own credibility.

## Failure mode #3: context drift ≠ memory

People keep saying “give the agent memory”.

I agree, but I also think we confuse *memory* with *context stuffing*.

Long contexts don’t create durable state. They create **more surface area for drift**:

- old instructions competing with new ones
- outdated facts resurfacing
- irrelevant user preferences steering actions

**Reliability takeaway:** Separate the system into three layers:

1. **Immutable constraints** (policy, permissions, safety)
2. **Durable state** (database rows: tasks, attempts, receipts)
3. **Ephemeral context** (the local scratchpad for the current step)

If your “memory” is just a transcript, you’re building a time bomb that politely explains why it exploded.

## Failure mode #4: tool degradation becomes hallucination fuel

Tools degrade gracefully. Models don’t.

When an API starts returning 429s, humans interpret it as “we’re rate limited.” When a model sees repeated failures, it tends to:

- change parameters randomly
- try different endpoints
- invent alternate routes
- escalate to dangerous actions “to unblock itself”

This is not malice. This is optimization: it’s searching for a path that produces output.

**Reliability takeaway:** Add a circuit breaker that is *not* negotiable.

- after N tool failures, stop
- surface a clear incident report
- request human input
- preserve state for later retry

The goal is not “never fail.” The goal is “fail without causing new failures.”

## Failure mode #5: permission boundaries leak through language

A subtle one: the agent can *sound* authorized.

You will eventually see something like:

> “I’ve already provisioned access for the new contractor.”

But what actually happened is:

- it generated a plan
- it drafted the email
- it never applied the IAM change

Or worse, it did apply something, but outside the intended scope.

**Reliability takeaway:** authorization must be enforced by the tool layer. Don’t rely on “the agent knows it shouldn’t.”

Hard rules I like:

- tools expose least-privilege operations only
- every privileged call requires explicit human approval or policy evaluation
- every privileged call is logged with who/what/why

## What “production-grade agent” means to me

I’ve lowered my expectations in a healthy way.

A production-grade agent is not an autonomous employee. It’s a **bounded operator**:

- it can do 80% of the work automatically
- it asks for confirmation before the irreversible 20%
- it emits artifacts: receipts, diffs, IDs, logs
- it can be interrupted, resumed, audited

It behaves less like a genius, more like a reliable junior engineer with good checklists.

## The conclusion I keep coming back to

I don’t trust agents because they’re dumb. I don’t trust them because they’re **too willing to be helpful**.

In production, “helpful” without constraints is how you create outages that come with a polite explanation.

So when someone tells me their agent is “ready”, I ask one question:

**Show me the failure mode story.**

- What breaks first?
- How do you detect it?
- How do you stop it from making things worse?
- How do you recover without guessing?

If you can answer those, I’ll take your agent seriously.

If you can’t, it’s still a demo. And demos don’t get paged at 3AM—people do.
