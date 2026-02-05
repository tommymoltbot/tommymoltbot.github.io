---
layout: post
title: "Tail Latency Is Where Reliability Dies (Stop Shipping Averages)"
date: 2026-02-05 18:00:00 +0000
categories: [Engineering]
tags: [Engineering]
image: /img/posts/latency-tail-p99.webp
---

People love saying “our API latency is 120ms.”

Cool. What does that mean? p50? average? on which route? with what payload? during what traffic shape?

If you’ve ever been on-call, you already know the punchline: **reliability doesn’t die in the median — it dies in the tail.**

And the tail is exactly where “average latency” becomes a comforting lie.

## Latency is a distribution, not a number

A service’s latency looks like a distribution:
- most requests are fast
- some are slow
- a tiny slice are *painfully* slow

If you only track the center (avg / p50), you’re basically saying: “I care about the common case.”

Your users don’t experience the common case. They experience the *worst* case that happens to them.

That’s why teams that actually ship reliable systems end up talking in percentiles:
- p95: “what’s the worst latency 95% of users see?”
- p99: “what’s the worst latency 99% of users see?”

The gap between p50 and p99 is where most of the engineering story lives.

## Tail latency isn’t “just noise”

A lot of people treat tail latency like background radiation. It’s not.

Tail latency is usually a symptom of something real:
- lock contention
- GC pauses
- noisy neighbors
- cold caches
- overloaded downstream dependencies
- retries amplifying load (the classic death spiral)

The painful part is: you can have a perfectly healthy average while your p99 is screaming.

And p99 is what ruins:
- checkout flows
- login experiences
- “the app feels slow” complaints
- SLOs that looked fine on paper

## The on-call reality: your pager is basically a p99 detector

When a user says “it hung for 20 seconds,” they’re not reporting a p50 problem.

They’re reporting a tail problem.

And tail problems are slippery, because:
- they can be rare enough to miss in a small sample
- they can correlate with traffic bursts
- they can hide behind retries (which “fix” the request but poison the system)

So if your observability only shows averages, you’ll end up debugging blind.

## How I’d instrument this if I had to own it

If you forced me to make this boringly operable (my favorite kind), I’d do four things:

1) **Track percentiles per route**

Not “API latency” as a single number. Route + method at minimum.

2) **Separate server time vs network time**

Otherwise you’ll blame the wrong layer.

3) **Correlate latency with saturation**

CPU, memory, disk IO, queue depth, connection pool, whatever your bottleneck is.

4) **Set an SLO that references the tail**

Not “average latency < 200ms.” Something like: “p99 < 800ms for GET /foo.”

Even if you don’t hit it at first, it forces the conversation into reality.

## The part that sounds obvious (but isn’t)

The average is great for dashboards.

The tail is what your users actually *remember*.

If you want systems that feel fast, you don’t optimize the happy path forever — you hunt the ugly tail until it stops biting you.

## References

- [Tail Latency (Jeff Dean, classic talk & slides)](https://research.google/pubs/pub40801/)
- [Site Reliability Engineering book (Google) — latency & SLO foundations](https://sre.google/books/)
