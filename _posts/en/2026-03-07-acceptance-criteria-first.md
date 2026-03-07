---
layout: post
title: "LLMs Write Plausible Code — So Start with Acceptance Criteria"
date: 2026-03-07 13:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A benchmark chart about plausible vs correct](/img/posts/acceptance-criteria-first.webp)

Most “AI coding debates” are stuck on a boring question: *can an LLM code?*

It can. It can also confidently generate a whole system that compiles, passes a few tests, **and is still completely wrong in the only way that matters**: it doesn’t meet the real-world constraints.

The framing I’ve found most useful lately is this:

- LLMs optimize for **plausibility**.
- Engineers ship **acceptance criteria**.

If you don’t define the latter early, you’re basically asking the model to do improv.

## The failure mode isn’t syntax — it’s “looks right”

The case that snapped this into focus for me was a write-up benchmarking an LLM-generated Rust “SQLite reimplementation.” The codebase is huge, it has all the familiar module names, it compiles, it reads SQLite files, and it even has tests.

Then someone ran a very basic benchmark (primary-key lookups), and the rewrite was not “a bit slower.” It was **orders of magnitude** slower, because it missed a foundational planner behavior (turning an `INTEGER PRIMARY KEY` into a rowid fast path).

That’s the part that makes me uneasy: the code is *plausible enough that a non-expert will trust it.*

## “Acceptance criteria first” is the only sane workflow

I don’t mean “write a giant spec doc.” I mean: before you let the model generate *anything*, you pin down what “good” means in a way that you can verify.

Here’s the shape I keep coming back to:

```text
acceptance_criteria(feature) -> {tests, invariants, budgets, edge_cases}
```

If you can’t write that, the model can’t magically guess it.

### 1) Tests (correctness)

Not just unit tests that mirror the implementation. I want tests that encode intent:

- property tests (invariants)
- golden tests (known inputs/outputs)
- regression tests (the bug you just hit)

If you’re building something with a file format / protocol, you should have a **corpus**.

### 2) Budgets (performance / cost / latency)

This is the one people keep skipping.

If you don’t specify budgets, the model will happily “play it safe” (clone data, allocate, fsync too often, add layers) and you’ll wake up with a system that is correct in small tests and unusable in production.

Examples of budgets that are actually useful:

- p95 latency < X ms for a defined scenario
- memory < X MB under load
- allocations per request < N
- IO sync calls per transaction <= 1

### 3) Constraints (what you refuse to do)

This is underrated. A lot of “vibe coding” fails because the model is allowed to do everything.

I often add explicit “no” rules:

- no new dependencies
- no new background daemons
- no custom DSL
- no “rewrite it all” unless benchmark proves it’s needed

## A practical template I use with LLMs

When I want help implementing something, I now start with a short preface that looks like this:

```text
Task: <one sentence>
Acceptance criteria:
- Correctness: <tests / invariants>
- Performance: <budgets>
- Operational: <deployment / observability expectations>
- Constraints: <hard no's>
Deliverable:
- patch + brief design notes + how to verify
```

This single block does two things:

1) It gives the model a target that isn’t “sound smart.”
2) It gives *me* a checklist so I don’t get hypnotized by plausible code.

## My take

LLMs are great at expanding your option space. They’re bad at deciding what matters.

So I’ve stopped asking them to “write correct code.” I ask them to **help me satisfy criteria I already chose**.

It’s less magical. It’s also how software actually gets shipped.

---

**References:**
- [KatanaQuant: why LLM-generated code can be plausible but wrong](https://blog.katanaquant.com/p/your-llm-doesnt-write-correct-code)
- [Hacker News discussion on defining acceptance criteria for LLM output](https://news.ycombinator.com/item?id=47283337)
