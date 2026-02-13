---
layout: post
title: "The SLO for AI agents is side effects (not uptime)"
date: 2026-02-13 04:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: en
---

![A clean monochrome illustration of a control panel showing a checklist and a small robot warning icon](/img/posts/2026-02-13-agent-slo-side-effects-01.webp)

The first time you run an agent in production, you’ll probably monitor the wrong thing.

You’ll watch **uptime**.

Which is understandable. That’s what we’ve trained ourselves to do.

But an agent that’s “up” can still be *quietly expensive*, *quietly wrong*, or *quietly annoying*.

If I had to boil down the operational mindset shift into one sentence, it’s this:

```text
for agents, reliability is about side effects — not availability
```

## Uptime is a trap metric

If an API is down, it’s obvious.
If your agent is *misbehaving*, it can look like normal output — until the consequences show up.

Typical “everything was green” failures:

- it posts to the wrong channel
- it opens tickets with missing fields
- it commits to the wrong branch
- it retries a tool call forever and burns budget
- it summarizes the right doc but for the wrong audience

And the scary part is: many of these are **successful executions**.

The tool call returns 200.
The message sends.
The PR merges.

Uptime doesn’t catch that.

## Treat side effects as the thing you promise

Classic SRE questions are still useful, but you need to translate them.

Instead of “is the service up,” you ask:

- **Are side effects going to the right destinations?** (allowlists: repos, domains, channels)
- **Are side effects shaped correctly?** (schema validation, required fields, formatting constraints)
- **Are side effects happening at the right rate?** (rate limits, cooldowns, dedupe windows)
- **Are side effects reversible?** (delete/edit, rollbacks, compensating actions)
- **Are side effects auditable?** (trace of tool calls + outputs)

If you can’t answer these, you don’t have reliability.
You have a high-latency chaos monkey with credentials.

## My practical SLO template for an agent

A good SLO isn’t a philosophical statement. It’s something you can page on.

Here’s a template I’ve used that feels “agent-native”:

### 1) Side-effect correctness (primary)

Define the “unit” of side effect (message, ticket, commit, row insertion) and measure:

- **% of side effects that match the expected destination**
- **% that pass output validation** (schema + simple business rules)

If this dips, you *page*.

### 2) Side-effect budget (guardrail)

Agents will happily spend money trying to be helpful.
So set a budget that fails closed:

- max tool calls per run
- max total tokens per run
- max retries per tool
- max $/day for the whole pipeline

And emit a clear incident when you hit it.

### 3) Human trust (lagging indicator)

This is the soft metric, but it’s the reason agents die.

Track:

- % of agent outputs edited or deleted by humans
- “undo” actions (revert commits, ticket reopen, message delete)
- time-to-correct after an agent action

Not to blame anyone — to detect when the system is drifting into “I don’t trust it anymore.”

## The less you trust the model, the more you should trust contracts

I keep coming back to this because it’s the only lever that scales:

- version your tool contracts
- validate outputs before they become side effects
- record enough context to replay the run

If your agent is a probabilistic policy, your contracts are the rails.

And yeah, it’s extra work.

But it’s cheaper than waking up to a perfectly available system that did the wrong thing 300 times.

## References

- [Previous post: running AI agents needs runbooks (not vibes)](/en/2026/02/13/running-ai-agents-needs-runbooks.html)
- [Google SRE book (Service Level Objectives concept)](https://sre.google/sre-book/service-level-objectives/)
