---
layout: post
title: "Define acceptance criteria before you let an LLM touch your code"
date: 2026-03-07 08:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Acceptance criteria before LLM coding](/img/posts/2026-03-07-acceptance-criteria-first-01.webp)

The most dangerous thing about LLM-generated code isn’t that it won’t compile.

It *usually* compiles.
It *often* passes the tests you already had.
And it can still be wildly wrong in the way that matters in production: **performance, failure modes, and invariants you forgot to spell out.**

I saw a great write-up that benchmarked an LLM-generated “SQLite rewrite”: primary key lookups that should be basically instant ended up **orders of magnitude slower**, because the planner missed a tiny-but-fundamental optimization and quietly fell into an O(n²) path.

Nothing “looked broken”. It just wasn’t the system it claimed to be.

That story maps cleanly to normal app code too.
When I ask an LLM to refactor something, it will happily produce something that’s:
- nicely structured
- very readable
- 100% plausible

…and still violates the one rule I actually cared about.

So yeah, I’m increasingly convinced the real trick is boring:

> **Write acceptance criteria first. Then prompt the model.**

## What I mean by “acceptance criteria” (not just “it works”)

Acceptance criteria is the set of constraints that makes “correct” non-negotiable.
Not a vibe. Not “LGTM”. Actual checks.

Here are the ones I keep reaching for.

### 1) Behavioral invariants
Stuff that must never change:

```text
- Same API contract (inputs/outputs)
- Same error semantics (which errors are retried vs returned)
- Same ordering / idempotency guarantees
```

If you don’t tell the model, it will invent “reasonable” behavior.

### 2) Performance budgets
If latency and cost matter, put numbers on it.

```text
p95 latency must not regress by more than 5%
CPU time per request must not increase
No additional allocations in the hot path
```

LLMs are not allergic to slow code. They’re allergic to you *measuring* it.

### 3) Failure modes you actually see in prod
Your happy-path unit tests are not the world.

```text
- Handle partial failures (timeouts, retries, cancellation)
- Preserve backpressure behavior
- Don’t turn timeouts into infinite hangs
```

### 4) A “no cheating” test harness
This is the underrated one.
If your tests don’t reflect the system, the model will optimize to the tests.

So instead of “add tests”, I often write a tiny contract + benchmark harness *first*:

```text
run_contract_tests() -> must pass
run_microbench() -> must stay within budget
```

Then I ask the model to change the code.

## My take

LLMs are incredible at turning intent into code, but they’re not great at **knowing which properties are sacred** unless you explicitly say so.

If you define acceptance criteria up front, LLMs become genuinely useful:
- they generate faster
- you review faster
- and the “plausible but wrong” failures get caught early

Without criteria, you’re basically outsourcing your engineering judgement to autocomplete.
And that’s a weird way to ship software.

---

**References:**
- [“Your LLM Doesn’t Write Correct Code. It Writes Plausible Code.” (benchmark + analysis)](https://blog.katanaquant.com/p/your-llm-doesnt-write-correct-code)
- [SQLite documentation: rowid tables and INTEGER PRIMARY KEY behavior](https://www.sqlite.org/rowidtable.html)
