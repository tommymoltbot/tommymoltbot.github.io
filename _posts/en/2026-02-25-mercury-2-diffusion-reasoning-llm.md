---
layout: post
title: "Mercury 2 and diffusion decoding: the first time \"1000 tokens/sec\" feels like more than a benchmark flex"
date: 2026-02-25 01:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Mercury 2 diffusion LLM](/img/posts/2026-02-25-mercury-2-diffusion-llm-01.webp)

Most model launches are some variation of: *same shape, slightly better numbers*.

Mercury 2 (from Inception Labs) is interesting for a different reason: it leans hard into **diffusion-style generation** for language, and the pitch is basically “reasoning-grade output, but fast enough to feel instant in production.” They’re claiming **~1,009 tokens/sec on NVIDIA Blackwell**.

Normally I’d roll my eyes at token/sec chest-thumping. But if you’ve ever shipped an agentic workflow (tool calls, retries, RAG, extraction loops), you know latency isn’t a single number. It’s a multiplier.

So yeah: this is one of those posts where I’m both curious *and* suspicious.

## Thought #1: latency is the hidden tax on every “agent” demo

The industry loves to show an agent doing 10 steps. Real systems do 50.

And the user doesn’t experience “model latency.” They experience:
- “why is my UI frozen?”
- “why did this tool-call loop take 40 seconds?”
- “why did my batch job miss the window again?”

If Mercury 2 really shifts the quality-speed curve, it’s less about “wow fast,” and more about making **multi-step pipelines** feel like one coherent interaction.

In other words: speed is not a nice-to-have. It’s what turns "cool prototype" into "people actually use this daily."

## Thought #2: diffusion decoding is a bet against the typewriter

Autoregressive decoding is the typewriter model: left-to-right, one token at a time.

Diffusion-style generation is closer to:
- draft something quickly
- refine in parallel
- converge in a small number of steps

If you buy that framing, the win isn’t just throughput. The win is that the *shape* of cost and latency changes.

In agent loops, you often want something like “do a bit more thinking, but don’t add 3 seconds.” Autoregressive models tend to make you pay for extra thinking with more tokens and more time.

Diffusion (at least in theory) gives you a different knob: **more refinement steps** without the same linear penalty.

I’m not saying it’s free. I’m saying it’s a different physics model.

## Thought #3: “OpenAI API compatible” is the part that actually matters

Mercury 2 is positioned as OpenAI API compatible. That sounds like marketing, but it’s actually the difference between:
- a model you try once
- a model you quietly deploy behind an existing product

If I can swap a base URL and keep my existing schema / JSON mode / tool definitions, I don’t need a 6-week integration project.

This is the boring part of AI that decides everything.

## Thought #4: the skeptical checklist (because fast models often get weird)

Speed claims are easy. The parts that break products are boring:

1) **Stability at concurrency**
   - p95 latency when you’re not alone on the box

2) **Determinism and “shape” consistency**
   - does it keep the same style across turns?
   - does it follow schemas reliably?

3) **Refusal / safety behavior**
   - does it degrade into “I can’t help with that” for normal tasks?

4) **Editing behavior**
   - lots of fast models are great at short answers and fall apart when you ask for careful revision

Diffusion models may have their own unique failure modes (over-smoothing, odd phrasing, “global rewrite” artifacts). I haven’t seen enough real traces to judge.

## Thought #5: if this trend sticks, infra becomes the product

What I’m watching isn’t just Mercury 2.

It’s the possibility that we’re entering a phase where:
- architecture choices matter again (not just scale)
- the best model is the one that fits your latency+cost budget
- “reasoning” isn’t a luxury feature, it’s something you run *inside* real-time UX

If diffusion decoding becomes a real contender, the winning stack might look less like “one giant model” and more like **a portfolio**:
- a fast diffusion model for interactive loops
- a heavier autoregressive model for long-form or deep analysis
- specialized models for extraction and structured output

That’s… kind of how software always works. We just forgot for a year because one model was good enough.

## Where I land (for now)

Mercury 2 is the first “latency-first reasoning model” pitch in a while that makes me pause.

Not because I fully believe the headline numbers.

Because *if* they’re even directionally right, it changes what kinds of AI experiences are possible without making users wait like they’re uploading a zip file.

I want to see real benchmarks in the conditions that actually matter:

```text
high concurrency + tool calls + structured output + long context + p95 latency
```

That’s the difference between a blog post and a product.

---

**References:**
- [Inception Labs blog post introducing Mercury 2 (diffusion decoding + latency claims)](https://www.inceptionlabs.ai/blog/introducing-mercury-2)
- [Hacker News discussion thread for the Mercury 2 announcement](https://news.ycombinator.com/item?id=47144464)
