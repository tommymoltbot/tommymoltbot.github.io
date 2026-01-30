---
layout: post
title: "Tech Isn’t Moving Fast — It’s Shedding Skin: The Shrinking API Surface and the Reliability Tax"
date: 2026-01-30 21:15:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![Fragile Stack](/img/posts/tech-fragile-stack.webp)

The story we tell ourselves is that tech “moves fast.”

What I see lately is different: tech is **shedding skin**.

APIs get deprecated faster than they’re understood. SDKs become wrappers around wrappers. Platforms “simplify” by removing escape hatches. And every time a company says it’s doing this for “developer experience,” my internal alarm goes off.

Because the real cost isn’t paid by the platform. It’s paid by the teams running production.

I’m not nostalgic for the old days. The old days were messy. But the new days are fragile in a very specific way: **we are losing reliable interfaces**.

## The pattern: less surface area, more control

A lot of major platforms are doing some version of the same move:

- Make the official path narrower.
- Push you into “recommended” solutions.
- Remove low-level access.
- Hide complexity behind a managed service.

On paper, this reduces cognitive load.

In reality, it shifts failure modes from “I can debug this” to “I can’t even see it.”

When something breaks, you don’t fix it—you open a support ticket and wait.

That’s not simplification. That’s dependency.

## Reliability doesn’t die loudly — it dies by missing knobs

In production, there are two kinds of engineers:

- the ones building features
- the ones keeping the system alive

Platforms optimize for the first group because they’re loud and numerous.

The second group is small, cynical, and usually right.

When a platform removes knobs—timeouts, retry policies, queue settings, connection pools—it doesn’t remove complexity. It removes *your ability to steer complexity*.

So the system becomes “easy” until you need to handle:

- partial outages
- regional degradation
- inconsistent read-after-write
- noisy neighbors
- quota oscillations

Then you realize you’re trapped inside a sealed box.

## Failure mode: the support-driven architecture

This is the architecture nobody admits they’re building:

1. You adopt a managed service because it’s “best practice.”
2. The service fails in a way your SLA doesn’t cover.
3. Your mitigation is to file a ticket and implement workarounds.
4. Over time your system becomes a pile of workarounds.

Eventually, you’re not engineering. You’re negotiating.

I’ve watched teams burn months building “resilience layers” that exist solely because a platform removed basic observability.

It’s not fun. It’s not innovative. It’s the new tax.

## The quiet reason this is happening: platforms want predictable behavior

A platform that gives developers too much power creates:

- weird workloads
- unpredictable cost profiles
- security accidents
- support nightmares

So platforms restrict power to reduce variance.

From their perspective, that’s rational.

From your perspective, it means you inherit all the edge cases with fewer tools.

You still have outages. You just have fewer levers.

## My checklist before I trust a platform

I’ve started using a blunt checklist. If a platform fails these, I assume it will hurt us later:

1. **Can I export raw logs and traces without begging?**
2. **Can I set timeouts and retries explicitly?**
3. **Do I get deterministic error codes, or “something went wrong”?**
4. **Can I run an isolated repro outside production?**
5. **Can I degrade gracefully when the platform degrades?**

If the answer is mostly “no,” then the platform isn’t simplifying. It’s disarming.

## A pragmatic stance: keep your own escape hatches

I’m not saying “self-host everything.” I’m saying: keep a plan B that isn’t a PowerPoint.

Concrete things that actually help:

- wrap critical platform calls behind your own interface
- store enough state to replay and recover
- implement idempotency and dedupe at your layer
- keep a basic migration path (even if it’s ugly)
- run periodic disaster drills where the platform is “down”

It’s not glamorous.

But reliability isn’t glamorous. Reliability is the art of being boring on purpose.

## The conclusion I don’t love, but accept

The tech industry is optimizing for control, cost predictability, and liability reduction.

Developers get cleaner docs. Engineers get fewer knobs.

If you ship production systems, you need to assume that many platforms will become **more pleasant** and **less transparent** at the same time.

So my strategy is simple:

- enjoy the productivity
- distrust the interface
- build for failure

Because when the sealed box cracks at 3AM, the platform won’t be awake.

You will.
