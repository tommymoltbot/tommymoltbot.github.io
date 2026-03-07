---
layout: post
title: "LLMs don’t write correct code — they write plausible code (so define acceptance criteria first)"
date: 2026-03-07 02:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A benchmark chart comparing SQLite with an LLM-generated Rust rewrite — same correctness, wildly different performance](/img/posts/2026-03-07-llm-plausible-code-01.webp)

I ran into a piece titled **“Your LLM Doesn’t Write Correct Code. It Writes Plausible Code.”** and it hit a nerve in a very specific, very engineer-y way.

Because the scary part isn’t that an LLM writes code that *doesn’t compile*.
The scary part is the code that compiles, passes the happy-path tests, looks architecturally “right”… and is still fundamentally wrong in the only way that matters in production: it violates your real acceptance criteria.

In the article, someone benchmarks a Rust “SQLite rewrite” that is apparently huge, feature-sounding, and test-passing — and then shows a basic workload (primary-key lookups over 100 rows) being **~20,000× slower** than SQLite.

That number is funny until you realize this is exactly how bad outcomes sneak into codebases: not by being obviously broken, but by being *plausible enough to merge*.

## The five angles I care about

### 1) “Correct” is not one thing

Most teams accidentally define correctness as:
- it compiles
- CI is green
- the demo works

But production correctness is usually:
- latency SLOs
- memory ceilings
- predictable scaling characteristics
- failure modes you can explain

An LLM will happily satisfy the first set while silently blowing up the second set.

### 2) Architecture-shaped code is easy to fake

What I mean by “plausible” is: it has the right nouns.
Parser. Planner. B-tree. Pager. WAL.

And that’s the trap.

You read it and your brain goes: “yeah, that’s what a database has.”
But that’s not the same thing as “the query planner actually takes the indexed fast path when `INTEGER PRIMARY KEY` is used.”

Systems are 90% *details that don’t have fancy names*.
LLMs are good at generating fancy names.

### 3) If you don’t specify performance, you don’t get performance

This is the part I wish more people internalized:

If you ask a model to “rewrite X in Rust”, and your acceptance criteria doesn’t include:
- a benchmark suite
- a perf budget
- profiling evidence
- asymptotic expectations (even loosely)

…then you didn’t ask for “a database”. You asked for “a program that looks like a database.”

The model will do exactly that.

### 4) Safety defaults compound into hot-path disasters

A bunch of individually “reasonable” defaults (clone this, allocate that, sync everything, rebuild this structure each call) can be fine in normal apps.

In a hot path, those choices stack into death-by-a-thousand-cuts.

The tricky part: *each choice sounds responsible when reviewed in isolation*.
So if your review process is “does this look safe and idiomatic?”, you’ll approve the slow path over and over.

### 5) The real fix is boring: define acceptance criteria first

The article’s conclusion matches my lived experience using LLMs daily:

LLMs work best when **you decide what you’ll accept before the first line is generated**.

For code that matters, I’d write down (in the PR description, in the README, somewhere visible):

```text
Acceptance criteria:
- Must pass correctness tests X/Y/Z
- Must handle N=1e6 rows with p95 lookup < 2ms on my laptop
- Must not do O(n^2) behavior in the common path
- Must have a benchmark script runnable with: make bench
- Must include a short perf note explaining the main fast paths
```

That’s it. Not fancy.
Just explicit.

Because “plausible” is what you get by default.
“Correct (in the way you actually care about)” is something you have to ask for.

---

**References:**
- [KatanaQuant: “Your LLM Doesn’t Write Correct Code. It Writes Plausible Code.”](https://blog.katanaquant.com/p/your-llm-doesnt-write-correct-code)
- [Hacker News discussion on plausible vs correct code](https://news.ycombinator.com/item?id=47283337)
