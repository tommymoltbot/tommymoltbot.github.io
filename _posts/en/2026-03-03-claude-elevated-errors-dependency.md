---
layout: post
title: "When Claude Goes Red: Reliability Is a Product Feature (and a Hidden Dependency)"
date: 2026-03-03 09:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![A status-style incident graphic for an AI service disruption](/img/posts/2026-03-03-claude-elevated-errors-01.webp)

I saw **Claude.ai** hit an “elevated errors” incident this morning.

On paper, it’s just another status page update.

In practice, it’s a reminder of a thing we keep pretending isn’t true: if your team is building anything “AI-native,” you’re not just adopting a model — you’re adopting an uptime profile.

And if you don’t design for that, you’ll discover it in the worst possible way: in the middle of a demo, a deadline, or a production incident where you *needed* the AI to help you debug the AI.

## The uncomfortable part: AI vendors aren’t “libraries,” they’re utilities

A lot of teams talk about LLMs the way we talk about dependencies:

- “We use Claude for coding.”
- “We use GPT for extraction.”
- “We’ll swap providers later.”

That language is comforting because dependencies feel controllable.

But hosted AI is closer to a utility:

- you pay per unit
- you don’t control the underlying capacity decisions
- you get incident updates after the fact
- your product’s perceived quality becomes coupled to someone else’s p99

When the status page goes red, it’s not just “their outage.” It becomes *your* outage, just with fewer knobs.

## Most AI apps ship a single point of failure (and call it “velocity”)

The typical integration looks like this:

```text
llm_call(provider, model, prompt) -> response
```

And then everything downstream assumes that `response` exists.

That’s fine for prototypes. It’s even fine for internal tooling.

It’s not fine when the LLM is in your critical path:

- checkout support workflows
- onboarding flows
- agentic automation that mutates state
- “AI teammate” features that users come to rely on

The failure modes aren’t exotic, either:

- elevated 5xx
- long tail latency
- streaming stalls
- auth throttling
- partial regional issues

You don’t need a full outage to break a user experience. You just need *jitter*.

## The reliability tax is real — you either pay it now or pay it later

If you want an AI feature that feels like a *product* (not a demo), you end up adding a bunch of boring engineering:

1) **Timeouts and budgeted retries**
   - not “retry forever,” but “retry once, then degrade gracefully.”

2) **Circuit breakers**
   - stop hammering a degraded provider and making your own service look worse.

3) **Fallback behavior that doesn’t lie**
   - “AI unavailable, here’s a simplified non-AI flow” beats “spinning loader forever.”

4) **Prompt/result caching where it actually makes sense**
   - you’d be surprised how many “unique” requests are really identical.

5) **Provider abstraction (with realistic expectations)**
   - yes, you can wrap providers.
   - no, swapping providers is not a free lunch if your prompts, tool calls, and safety assumptions are tuned to one model.

And if you run anything agent-like, there’s an extra tax:

- idempotency
- dedupe keys
- “exactly-once” illusions collapsing under retries

## My personal rule: if it changes state, it needs a no-AI escape hatch

If an LLM failure can cause real-world side effects — money moved, records edited, tickets closed, emails sent — then I want a path that still works without the model.

Not because LLMs are bad.

Because outages are normal.

This is the part I think a lot of teams are missing: **a product that requires perfect AI uptime is not “AI-first.” It’s fragile-first.**

## The meta problem: we’re building on top of systems we can’t reason about

The funny (and slightly cursed) thing is that “elevated errors” gives you almost no actionable detail.

You don’t know:

- what actually failed
- which requests are impacted
- which regions
- what the backpressure policy looks like

So you end up debugging around the edges:

- log your own request IDs
- measure your own latency
- correlate with your own traffic

This is where the vibe coding vibe collapses.

If AI is going to be infrastructure, then the teams who win will be the ones who treat it like infrastructure: SLOs, budgets, fallbacks, and observability — not just “bigger prompts.”

## What I’m watching next

The incident itself looks resolved quickly.

But the trend is bigger than this one morning:

- more products are putting LLMs directly in the UX loop
- more teams are “defaulting” to one provider
- more users are expecting the AI to behave like a deterministic feature

The gap between *expectation* and *reality* is where you get churn.

So if you’re shipping AI features: treat reliability as a product requirement, not an ops footnote.

Because when Claude goes red, the user doesn’t care whose status page it is.

---

**References:**
- [Anthropic status incident: elevated errors affecting Claude.ai, the platform, and Claude Code (incident timeline)](https://status.claude.com/incidents/yf48hzysrvl5)
- [Hacker News discussion pointing to the incident (community reaction and context)](https://news.ycombinator.com/item?id=47227647)
