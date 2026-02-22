---
layout: post
title: "BinaryAudit: AI Can Spot Backdoors in Binaries (Sometimes). The Real Problem Is False Positives"
date: 2026-02-22 18:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![BinaryAudit benchmark overview](/img/posts/binaryaudit.webp)

If you’ve ever had to incident-response a “vendor binary” with no source, you know the vibe: you’re suddenly a reverse engineer, except you didn’t plan to be one today.

So when I saw **BinaryAudit** — a benchmark where people literally *inject backdoors into ~40MB binaries* and ask AI agents (with Ghidra + binutils) to find them — my first reaction was: *ok, this is finally a real test*. Not “write me a todo app”, but “tell me whether this executable is lying to me”.

The headline result is both impressive and annoying: **models can sometimes find backdoors, but the hit-rate is far from reliable and false positives are a huge tax**. That’s the part that matters in production.

## Five thoughts that hit me while reading it

### 1) Detection rate is not the real KPI if false positives are high
In a benchmark, a false positive is a score penalty.

In a security team, a false positive is:
- a human losing half a day,
- a customer escalation,
- and sometimes a broken release process.

So when a tool says “this binary looks backdoored” and it’s wrong *often*, it doesn’t just mean “imperfect”. It means you stop believing it.

### 2) The tools matter as much as the model
What I liked here is they didn’t pretend the model is magic. They gave the agent the actual toolbox reverse engineers use:

```text
objdump
nm
strings
Ghidra
Radare2
```

That’s closer to the real workflow: you don’t “understand” a binary, you *triage it*.

### 3) This is exactly the kind of work where “planning vs execution” matters
Binary analysis is a search problem:
- start with cheap signals (strings, imports, suspicious syscalls),
- then progressively pay for deeper analysis (decompile, follow call chains, cross-reference).

If an agent burns budget on the wrong path early, it doesn’t fail gracefully — it just runs out of time and comes back with vibes.

### 4) “49% on obvious backdoors” is a loud number
The post says even their best model only found relatively obvious backdoors in small/mid-size binaries about half the time.

That’s not a dunk on the model. That’s a reality check for anyone trying to sell “AI malware detection” as plug-and-play.

If you need reliability, you either:
- treat it as a suggestion engine, or
- combine it with strong heuristics and human review.

### 5) The supply-chain angle is the real value
A lot of modern incidents aren’t “your code got hacked”. It’s:
- dependency,
- installer,
- firmware,
- or a binary you didn’t build.

Benchmarks like this push the ecosystem toward a more honest question:

```text
Do we have a scalable way to distrust binaries by default?
```

Right now the answer is still “mostly no”. But at least now we can measure progress instead of arguing on Twitter.

## Where I’d actually use this (today)
If you put a gun to my head and asked how I’d use an agent like this right now:

- **Triage**: “show me the weird functions and why they look weird.”
- **Diffing**: “compare two vendor builds and highlight suspicious deltas.”
- **Lead generation**: “give me 5 places to start looking; I’ll verify.”

Not: “declare it clean and ship it.”

That’s the gap between demos and production.

---

**References:**
- [BinaryAudit: introducing the benchmark and results](https://quesma.com/blog/introducing-binaryaudit/)
- [BinaryAudit benchmark results page](https://quesma.com/benchmarks/binaryaudit/)
- [BinaryAudit open-source tasks and methodology on GitHub](https://github.com/quesmaOrg/BinaryAudit)
