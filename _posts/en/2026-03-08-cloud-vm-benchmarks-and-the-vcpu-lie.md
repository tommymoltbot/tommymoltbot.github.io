---
layout: post
title: "Cloud VM Benchmarks 2026 and the vCPU Lie"
date: 2026-03-08 03:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Cloud VM CPU tiers and why vCPU comparisons get messy](/img/posts/2026-03-08-cloud-vm-benchmarks-01.webp)

I keep seeing people argue about cloud costs like it’s a clean, spreadsheet-friendly problem.

It’s not.

Not because the math is hard, but because the unit we all pretend is comparable — **“vCPU”** — is often a half-truth. Sometimes literally: *half a core*.

I went through a 2026 benchmark roundup that tested **44 VM types across 7 providers**, and the part that stuck with me wasn’t “which CPU wins”. It was how easy it is to make the wrong call if you don’t internalize what you’re buying.

## 1) vCPU is not a core (and it changes how you read benchmarks)
A lot of x86 instance families expose **SMT / Hyper-Threading** as “2 vCPU = 1 physical core (2 threads)”.

So when a benchmark says “2 vCPU comparison”, it might mean:

- one physical core (with SMT)
- or two physical cores (if SMT is disabled)

Those are not equivalent.

The roundup explicitly calls out that some newer instance families (notably certain AMD EPYC Turin options) can have **SMT disabled**, which makes “per-2vCPU” results look absurdly good — because you’re effectively getting more real core.

If you’ve ever migrated a CPU-bound workload and felt like you got “free performance”, this is one of the common reasons.

## 2) Single-thread performance still matters more than people admit
Even in 2026, a depressing number of workloads are bottlenecked by:

- one hot loop
- one GC thread at the wrong moment
- one DB connection pool bottleneck
- one coordinator / scheduler thread

So I like that the benchmark separates **single-thread** and **multi-thread** results.

A lot of teams only look at “total throughput” and then act surprised when tail latency or p99 gets worse.

## 3) Region variance is real (yes, even for “the big three”)
One detail I didn’t expect them to emphasize this much: **the same instance type can have performance variance across regions**.

We all know small providers can be noisy. But seeing the claim that even the major clouds show inconsistency is… annoying, but believable.

The practical takeaway is boring but important:

- if your workload is sensitive, benchmark in the region you’ll actually run
- don’t assume the CPU label implies the same sustained behavior everywhere

## 4) Pricing is not “on-demand vs reserved” — it’s a whole skill tree
This kind of comparison is useful for directionally choosing:

- which provider is competitive for CPU-heavy workloads
- which families you should avoid (old CPUs can be *more expensive* for less performance)

But the minute you go beyond a blog post and try to actually optimize cost, you enter pricing hell:

- on-demand
- 1-year / 3-year commitments
- spot / preemptible
- sustained-use / committed-use mechanics
- “you need to set min CPU platform or you get an older chip for the same price” (GCP-style surprises)

If your org treats cloud spend as “someone will fix it later”, later becomes never.

## 5) My rule of thumb: pick a family, then benchmark *your* workload
If you’re doing anything CPU-bound, my order of operations is:

1. Pick 2–3 instance families that look good on *single-thread* and *perf/$*.
2. Run a real workload replay (or at least a representative microbenchmark).
3. Validate scaling behavior (2 vCPU → 4 vCPU → 8 vCPU) because SMT and contention can distort the curve.
4. Only then start negotiating the money part (reserved/spot).

I know this sounds obvious.

But I’ve watched teams spend weeks debating pricing tiers, then deploy a workload that’s actually limited by single-thread performance on a “cheap” VM, and they end up scaling out and paying more anyway.

So yeah: benchmarks are useful.

Just don’t let “vCPU” trick you into thinking you’ve already compared the thing that matters.

---

**References:**
- [Cloud VM benchmarks 2026 (44 VM types, multi-region performance/price)](https://dev.to/dkechag/cloud-vm-benchmarks-2026-performance-price-1i1m)
- [Original benchmark page (same content, alternate host)](https://devblog.ecuadors.net/cloud-vm-benchmarks-2026-performance-price-1i1m.html)
- [Hacker News discussion thread for the benchmark roundup](https://news.ycombinator.com/item?id=47293119)
