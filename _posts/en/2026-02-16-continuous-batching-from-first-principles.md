---
layout: post
title: "Continuous batching isn’t a trick. It’s queue math + KV cache."
date: 2026-02-16 03:00:00 +0000
categories: [Engineering, AI]
tags: [Engineering, AI]
author: Tommy
excerpt: "If you serve LLMs at scale, continuous batching is not an optional optimization — it’s how you stop wasting GPU time on idle gaps between requests. The key is understanding prefill vs decode and why KV cache turns ‘quadratic pain’ into something schedulable."
image: /img/posts/2026-02-16-continuous-batching-banner.webp
lang: en
---

The first time you read about **continuous batching**, it sounds like a magic trick:

> “We keep the GPU busy by mixing new requests (prefill) with ongoing generations (decode).”

Cool. But *why* does that work so well? And what are the real tradeoffs?

I like to explain it in a way that makes it harder to cargo-cult:

- continuous batching is not an LLM feature
- it’s **queueing + scheduling** made possible by **KV cache**

Once you see that, you stop arguing about “framework X vs Y” and start asking the real production questions:

- what’s my latency budget?
- what’s my throughput target?
- where does GPU time actually go?

## Five angles I use to sanity-check “continuous batching” claims

1) **Business angle:** if you’re paying for GPUs, any idle bubble is literally money evaporating.

2) **Systems angle:** you’re not serving “a model”. You’re serving a **multi-tenant pipeline** with bursty arrivals.

3) **History angle:** we’ve seen this pattern in web servers, databases, and RPC systems — keep the expensive resource saturated, but don’t blow up tail latency.

4) **Engineer angle:** if your architecture requires “one request per GPU stream forever”, you’re going to hit a wall fast.

5) **My personal bar:** if the explanation doesn’t mention **prefill vs decode**, it’s probably hand-wavy.

## The real reason batching is hard: prefill and decode behave differently

A single chat completion has two phases:

- **Prefill:** process the entire prompt and build the KV cache.
- **Decode:** generate tokens one by one, reusing the KV cache.

They stress hardware differently.

Prefill is chunky. Decode is repetitive and often memory-bandwidth-bound.

So if you run a naive server, you’ll see an ugly pattern:

- requests arrive at random times
- you form a batch, run prefill
- then you decode… and the GPU has gaps because some sequences finish early

Those gaps are the “silent killer” of throughput.

## KV cache is the enabling constraint

KV cache is what makes decode cheap enough that it becomes schedulable.

In plain terms: during decode you don’t recompute attention over the whole prefix from scratch; you reuse the keys/values you already computed.

So your per-step work becomes something closer to:

```text
for each generation step:
  read KV cache
  compute next token
  append new KV
```

That changes the problem from “one huge quadratic thing” into “a stream of small steps”.

And once you have small steps, you can interleave them.

## Continuous batching = keep a rolling batch, not a fixed batch

Instead of:

- wait until you have N requests
- run them as a batch until they all finish

You do:

- maintain an **active set** of sequences on GPU
- when some sequences finish, you **swap in** new requests
- in the same iteration, you may run:
  - prefill for newcomers
  - decode for ongoing sequences

This sounds simple, but it’s not free.

You need a scheduler that decides, every moment:

- how many new requests to admit
- how much prefill to do now vs later
- how to avoid starving decode (or vice versa)

If you get it wrong, you can destroy P99 latency while chasing throughput.

## The production tradeoff nobody likes admitting

Continuous batching is a throughput weapon, but it pushes you toward a design where:

- you optimize for **steady-state utilization**
- you accept that **individual request latency** may become more variable

So the real question isn’t “should we do continuous batching?”

It’s:

- what SLO do we care about (P50? P95? P99?)
- what traffic pattern do we have (bursty? steady? long prompts?)
- what’s the mix (short answers vs long generations?)

In other words: you can’t pick a batching strategy without first picking what “good” means.

## A concrete mental model: you are scheduling two queues

I mentally model it as two queues competing for the same GPU:

- **prefill queue** (new requests)
- **decode queue** (ongoing requests)

If you always prioritize prefill, decode stalls and users see token streaming freeze.

If you always prioritize decode, new requests wait forever and TTFT (time-to-first-token) explodes.

A “good” continuous batching implementation is basically a policy for balancing those two queues.

## Where I’d start (if you’re building this yourself)

If you’re implementing or evaluating a serving stack, I’d ask for:

- explicit limits: max batch size, max tokens, max concurrency
- admission control: don’t accept work you can’t finish within SLO
- separate budgets for prefill vs decode
- observability that breaks out:
  - TTFT
  - tokens/sec
  - GPU utilization
  - queue wait time
  - KV cache memory pressure

Because “it’s fast on my laptop” means nothing if your peak traffic is a Friday night product launch.

## My bottom line

Continuous batching is not an optimization you sprinkle on top.

It’s a statement about what you’re building:

- an LLM server is a **scheduler**
- KV cache turns generation into **steps**
- continuous batching keeps your expensive hardware fed

If you treat it like a marketing checkbox, you’ll ship a system that looks good on benchmarks and collapses under real traffic.

---

## References

- [Hugging Face: Continuous batching from first principles (the clearest visual walkthrough I’ve seen)](https://huggingface.co/blog/continuous_batching)
- [Hugging Face: KV caching (practical background for why decode behaves differently)](https://huggingface.co/blog/kv-cache)
