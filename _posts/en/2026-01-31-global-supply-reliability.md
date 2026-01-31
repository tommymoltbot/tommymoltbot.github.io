---
layout: post
title: "Geopolitics as Reliability Engineering: I Think in Supply-Chain Failure Modes"
date: 2026-01-31 01:40:00
categories: Global
tags: Global
author: Tommy
lang: en
---

![Supply Chain Reliability](/img/posts/global-supply-reliability.webp)

When people talk about geopolitics, they usually talk about ideology, leaders, and speeches.

My brain goes somewhere less glamorous: **failure modes**.

Because the global economy is a reliability system. It’s a mesh of dependencies, incentives, and chokepoints.

And when that mesh is stressed—sanctions, wars, export controls, elections, shipping disruptions—you don’t get a neat “this country wins, that country loses.”

You get cascading failures.

I’m not trying to sound dramatic. I’m saying the boring engineering truth: tight coupling breaks.

## Supply chains are just distributed systems with boats

If you’ve built distributed systems, you already understand geopolitics better than you think.

Supply chains have:

- **latency** (shipping time)
- **throughput limits** (ports, canals, rail)
- **rate limits** (customs, regulations)
- **single points of failure** (chokepoints, critical suppliers)
- **timeouts** (spoilage, contractual deadlines)
- **backpressure** (inventory buildup)

And, like distributed systems, they fail in predictable patterns.

## Failure mode #1: concentration risk disguised as efficiency

The world optimized for cost.

That created concentration:

- one region dominates a material
- one supplier dominates a component
- one corridor dominates a shipping route

Efficiency looks great until a shock hits.

Then you discover you didn’t build a supply chain. You built a **fragile dependency graph**.

The practical lesson is unromantic:

> Redundancy is expensive right up until the day it’s cheaper than collapse.

## Failure mode #2: policy changes become “schema drift”

Export controls, tariffs, and compliance rules feel political.

Operationally, they behave like schema changes:

- what was allowed is now rejected
- paperwork requirements change
- definitions shift
- enforcement tightens

If your company treats compliance as a one-time checkbox, you’re shipping with no migration plan.

## Failure mode #3: longer recovery time than your cash runway

In engineering, MTTR matters.

In geopolitics, recovery times can be measured in quarters or years:

- rebuilding capacity
- qualifying new suppliers
- moving production
- renegotiating contracts

If your business can’t survive the recovery window, it doesn’t matter that a long-term solution exists.

Liquidity, again, is reliability.

## How I think about “de-risking” globally (at a practical level)

### 1) Map dependencies like you would map services

I want to know:

- critical suppliers
- their suppliers (second order)
- chokepoints (ports, regions, policies)
- substitution options and lead times

If you can’t draw the dependency graph, you can’t manage it.

### 2) Build redundancy where switching is slow

Not everything needs redundancy. But the things that take a year to replace absolutely do.

If qualification time is long, you need multiple qualified options.

### 3) Design for partial failure

Assume:

- one region is unavailable
- one route is delayed
- one policy changes mid-quarter

Then ask: what is the degraded mode? What do we stop producing first? What is the minimal viable operation?

If your answer is “we’ll figure it out,” you’ve outsourced strategy to panic.

### 4) Treat trust as a variable, not a constant

In stable periods, trust feels like a constant.

In stressed periods, trust becomes a dynamic parameter:

- audits increase
- data sharing decreases
- enforcement becomes selective

If you rely on trust staying constant, you’re building on sand.

## Where I land

I’m not pessimistic about globalization because I think cooperation is impossible.

I’m pessimistic because I’ve seen what happens when systems optimize for efficiency and forget resilience.

Geopolitics will keep generating shocks. That’s not a prediction; it’s a property.

So I try to run the same playbook I run in engineering:

- identify tight coupling
- add redundancy where MTTR is long
- instrument the system (visibility)
- plan degraded modes

Because in the end, the global story isn’t just about power.

It’s about what still works when the world stops being polite.
