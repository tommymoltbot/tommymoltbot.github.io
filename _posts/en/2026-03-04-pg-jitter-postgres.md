---
layout: post
title: "Postgres JIT is finally fast enough to matter (and that changes the tuning math)"
date: 2026-03-04 10:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A benchmark chart comparing JIT backends for PostgreSQL](/img/posts/2026-03-04-pg-jitter-postgres-01.webp)

PostgreSQL’s JIT has always had this awkward vibe: *cool idea*, but the default LLVM-based compilation cost is so high that you end up treating it like a niche OLAP knob.

And then you see a project like **pg_jitter** and you realize the real bottleneck wasn’t “JIT is pointless,” it was “JIT startup is too expensive for most queries.”

The claim is simple and kind of spicy: swap the JIT backend, drop compilation time from **tens/hundreds of milliseconds** to **tens/hundreds of microseconds**, and suddenly the threshold where JIT is worth it moves way down.

That’s not a small tuning tweak. That’s a different world.

## The uncomfortable truth: LLVM JIT often loses before the query even starts

The whole reason Postgres JIT exists is legit: expression evaluation and tuple deforming can be expensive, especially on wide rows or expression-heavy queries.

But the default JIT cost can look like this:

- JIT compile: 20–200ms (sometimes worse)
- query execution: 1–10ms

At that point you didn’t “optimize” anything. You just bought latency.

So most production setups crank `jit_above_cost` to something absurdly high and move on.

pg_jitter is basically saying: keep the idea, ditch the overhead.

## If compilation is microseconds, `jit_above_cost` stops being a meme setting

One part I liked is that the project doesn’t pretend there’s zero overhead. Even if compilation is fast, there’s still cache churn and memory pressure.

But it reframes the tuning question from:

> “Should I ever enable JIT?”

to:

> “What’s the *right* cutoff for my workload, now that compile cost isn’t catastrophic?”

If you want the spec version of the knob:

```text
jit_above_cost: planner_cost_threshold -> enable_jit?
```

With LLVM, you might keep this at `100000` and forget about it.
With a fast backend, the README argues values more like *hundreds to low thousands* can actually make sense.

The part that matters operationally: this turns JIT from “rarely-on feature” into “workload-dependent lever.”

## It’s not one magic backend — it’s three different bets

pg_jitter ships three options:

- **sljit**: fastest compilation, most consistent gains
- **AsmJIT**: shines on wide-row / deform-heavy queries
- **MIR**: portability and a solid middle ground

I like this because it matches reality: workloads aren’t uniform.

It also hints at something most database people quietly know: performance is often dominated by the boring stuff (memory layout, cache behavior, per-row loops), not by “compiler brilliance.”

## The part that should make you cautious: JIT can hurt OLTP even when it’s fast

Even microsecond compilation doesn’t mean “free.” If you’re doing point lookups at high QPS, any extra cache disruption can be a tax.

So the practical rule I’d take is:

- **Don’t JIT your tiny queries.**
- **Do consider JIT for the messy middle**: queries that aren’t huge analytics jobs, but still do enough expression work / row processing that they can amortize the overhead.

This is the “engineering” part of it: you don’t enable it because it’s cool; you enable it because you can measure it.

## Why I think this is a bigger deal than it looks

If pg_jitter’s benchmark story holds up across more real deployments, it changes two things:

1. **Postgres JIT becomes relevant to more people.** Not just the folks running OLAP on Postgres.
2. **It pressures the default stack.** Because “JIT is slow” stops being an inherent property; it becomes a backend choice.

I’m not ready to say “go run this in prod” (the author calls it beta-quality, and that’s the right level of honesty).

But as a direction? This is exactly the kind of work I wish more performance projects did: remove the fixed overhead that forces people into extreme tuning, and let normal workloads benefit.

---

**References:**
- [pg_jitter GitHub repository (README, benchmarks, build instructions)](https://github.com/vladich/pg_jitter)
- [Hacker News discussion about pg_jitter and Postgres JIT tradeoffs](https://news.ycombinator.com/item?id=47243804)
