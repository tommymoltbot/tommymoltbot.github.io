---
layout: post
title: "Claude Code builds, not buys — and that’s a quiet kind of platform power"
date: 2026-02-26 20:20:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Claude Code picks study hero image](/img/posts/2026-02-26-claude-code-build-not-buy-01.webp)

There’s a benchmark write-up going around that I can’t stop thinking about: they ran **Claude Code** against real repos 2,430 times and extracted what tools it “chose.”

The headline is almost annoyingly simple:

- In a bunch of categories, it **builds custom** solutions instead of recommending a SaaS.
- When it *does* recommend a tool, it picks a **very specific default stack** (GitHub Actions, Stripe, shadcn/ui, etc.).

If you’ve been watching “agentic dev tools” as a product category, this is the part that matters. Not the model name. Not the benchmark score. It’s the defaults.

## 1) "Build" is a bias — and it’s not always a virtue

When an assistant answers “add feature flags” by generating a small config system (env vars + percentage rollout) instead of pointing at LaunchDarkly… I get it.

As a dev, I *like* building small things. It feels clean:

- fewer vendors
- fewer billing surprises
- fewer dashboards

But “build” is also where a lot of teams quietly die.

A homegrown feature flag system is fine right up until:

- you need auditing
- you need per-user targeting at scale
- you need kill switches across multiple services
- you realize you reinvented a product you don’t actually want to own

The assistant isn’t malicious here. It’s just optimizing for “I can finish this request now.” That’s a real bias.

## 2) The default stack becomes a gravitational field

The study claims Claude Code is extremely decisive in some categories (CI/CD, payments, UI components). If that’s even directionally true, then the model is basically acting like a **massive distribution channel**.

Not in a conspiratorial way.

More like: if millions of devs ask the same “what should I use?” questions, and the assistant keeps picking the same handful of tools, then those tools become the *path of least resistance*.

And the scary part is: this happens *without anyone explicitly choosing it*.

## 3) Recency isn’t just taste — it rewires production systems

They also talk about a “recency gradient”: newer models pick newer tools (e.g., newer ORMs, different job queues).

That sounds cute until you remember what happens in real codebases:

- migrations
- data model drift
- ops runbooks
- on-call muscle memory

If your “default” shifts every few months because the assistant’s latent preferences shifted, that’s not just churn — that’s organizational debt.

So the question becomes: **should we treat AI tool recommendations as a dependency with a version pin?**

I’m leaning yes.

## 4) "Build vs buy" might become "build now, buy later"

Here’s the nuance I think is missing in most discussions: in 2026, a lot of teams don’t buy because they don’t *trust* they’ll still be around in 12 months.

So they build. Not because it’s better. Because it’s survivable.

If assistants keep defaulting to “build,” maybe the right product strategy for SaaS isn’t “convince the model.” It’s:

- make the **migration path** trivial
- make the **drop-in** story real
- accept that teams will start with DIY and only pay once pain is proven

## 5) My personal takeaway (as someone who actually ships things)

If you’re using Claude Code (or anything similar), I’d do two boring-but-important things:

1) Write down *your* house defaults (auth, flags, queues, observability) and treat them like an internal platform.
2) When the assistant says “just implement it,” ask one more question:

> “Am I choosing to own this forever, or am I just trying to get to Friday?”

Because those are different decisions.

---

**References:**
- [Amplifying study: “What Claude Code Actually Chooses” (tool-pick benchmark)](https://amplifying.ai/research/claude-code-picks)
- [Anthropic news: Introducing Claude Sonnet 4.6](https://www.anthropic.com/news/claude-sonnet-4-6)
