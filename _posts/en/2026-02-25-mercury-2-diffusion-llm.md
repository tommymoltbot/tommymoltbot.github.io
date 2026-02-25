---
layout: post
title: "Mercury 2 and the real point of diffusion LLMs: buying latency budget for reasoning"
date: 2026-02-25 10:15:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Mercury 2 speed](/img/posts/mercury-2-speed.webp)

If you’ve ever tried to ship an “agent” to production, you learn something pretty fast: the product isn’t the model. The product is the **loop**.

One task becomes 10–50 model calls (plan → retrieve → rank → extract → verify → retry). And then one user becomes 1,000 concurrent users. That’s why I take any “fastest LLM” claim with a healthy amount of side-eye… but I also think Inception’s **Mercury 2** announcement is pointing at something genuinely important: **diffusion changes what latency means**.

Not “a bit quicker autocomplete.” More like: *you get to spend your time budget differently.*

## Five thoughts I can’t stop circling around

### 1) Speed isn’t a vanity metric once you have loops

A single chat reply being 800ms vs 3s is “UX.”

But a pipeline doing 25 sequential calls? That’s the difference between “this feature feels instant” and “this feature is obviously faking it.” The blog post frames this correctly: latency compounds.

If Mercury 2 really sustains the kind of throughput they claim (they cite **1,009 tokens/sec on NVIDIA Blackwell GPUs**), it’s not just about bragging rights. It’s about **p95 behavior under load** — the thing that actually ruins your day in production.

### 2) Diffusion is basically “generate a draft, then revise it”

Autoregressive decoding is a typewriter: left-to-right, one token at a time.

Diffusion-style generation is closer to an editor that starts with noise and iteratively refines the whole sequence. In theory, that gives you more parallelism and a different speed curve.

I like that framing because it matches how we *wish* model outputs worked in tooling: produce something coherent quickly, then spend extra steps improving local mistakes — instead of “oops, we committed to a bad early token and now we’re stuck.”

### 3) The real win is buying back “reasoning budget”

Here’s the uncomfortable truth of 2025–2026 AI apps: a lot of “reasoning” is really just **test-time compute**.

You can pay for:
- longer chains
- more samples
- more retries
- self-checking passes

But all of that burns latency and cost. Diffusion approaches are interesting because they can (in principle) keep reasoning-grade quality while staying inside a real-time budget.

Will Mercury 2 actually do that across messy real workloads? I don’t know yet. But the direction is correct: the next wave of “better” models might look like **better quality-per-millisecond**, not better benchmark scores.

### 4) “OpenAI API compatible” is a product decision, not a technical detail

They say Mercury 2 is OpenAI API compatible. That matters because it reduces adoption friction to basically configuration.

If you can swap providers by changing a base URL and a model name, it’s suddenly realistic to run A/B latency tests in a day.

And yes, the devil is in the edge cases (tool calling, JSON mode, streaming behavior, error semantics). “Compatible” isn’t binary.

If I were integrating it, I’d start by validating the boring parts:

```text
POST /v1/chat/completions
```

Then I’d test:
- streaming chunk cadence (does it feel snappy or bursty?)
- tool-call determinism (does it oscillate under retries?)
- schema-aligned JSON under pressure (does it break when the prompt is long?)

### 5) I’m still wary of “tokens/sec” marketing… for a specific reason

Tokens/sec can be a great proxy *inside a lab*.

In production, I care more about:
- tail latency (p95/p99)
- concurrency collapse behavior
- time-to-first-token vs time-to-last-token
- consistency across turns (jitter kills “feel”)

So I’m filing Mercury 2 under: **promising if the serving story holds up**.

But even if this specific model doesn’t become the default, diffusion-style decoding feels like one of the few architectural directions that could change the economics of agentic systems without just throwing more GPUs at the same sequential bottleneck.

---

**References:**
- [Inception Labs blog post introducing Mercury 2](https://www.inceptionlabs.ai/blog/introducing-mercury-2)
- [arXiv paper: Diffusion-LM (diffusion-based non-autoregressive language modeling)](https://arxiv.org/abs/2205.14217)
