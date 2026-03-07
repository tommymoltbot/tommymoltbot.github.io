---
layout: post
title: "Sarvam 30B/105B Going Open Source: The Part People Miss Isn’t the Benchmarks"
date: 2026-03-07 12:10:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Sarvam open-sourcing 30B and 105B](/img/posts/2026-03-07-sarvam-open-source-01.webp)

When a new open model drops, the internet does the same little dance every time: someone posts a benchmark table, someone else calls it “frontier”, and then we all go back to arguing about whether closed models are “cheating”.

Sarvam open-sourcing a 30B and a 105B model is interesting, but not because it gives us yet another number to quote on a slide.

The part that actually matters is the claim that they built a full stack *in-country*: data pipelines, training, and a serving/inference optimization layer — and then shipped the result into real products.

That’s not a vibes thing. That’s a “this is what it takes to stop being dependent on someone else’s GPU time and policy mood” thing.

## 1) “Open weights” is the headline; “open deployment economics” is the story

A lot of “open” releases are basically:

- Here are weights
- Good luck serving it
- By the way, you’ll need expensive GPUs and a prayer

Sarvam’s write-up spends an unusual amount of time on tokenizer efficiency, KV-cache memory pressure, and kernel/scheduling work. That’s the stuff you only obsess over when you’re trying to run this thing at scale without lighting money on fire.

If you’ve ever shipped an LLM feature beyond a demo, you already know the villain isn’t “model quality”. It’s latency, tail latency, concurrency, and cost per request.

So when I see phrases like “architecture-aware fused kernels” and “disaggregated serving”, I read it as: “We tried to make this usable in production, not just publishable.”

## 2) The MoE angle: scaling parameters without scaling pain (in theory)

Both models are described as Mixture-of-Experts (MoE) Transformers. The appeal is obvious: you can claim a huge parameter count while only activating a small slice per token.

MoE is also one of those things that looks clean on paper and gets messy the moment you hit real traffic:

- routing stability
- expert load balancing
- batching efficiency
- weird performance cliffs when your request distribution shifts

They mention using sigmoid-based routing instead of softmax, plus an expert-bias term for stability. That’s the kind of detail that suggests they fought the “why are half my experts asleep?” problem like everyone else.

And the 30B vs 105B split is pragmatic:

- 30B: “real-time deployment” vibe
- 105B: “strong reasoning / agentic workloads” vibe

In other words: one model you can actually afford to keep hot, and one model you route to when you need depth.

## 3) The “India-specific” part isn’t marketing — it’s tokenizer math

Language support is usually treated like a checkbox: “we support X languages”.

But if your tokenizer is inefficient for a script, you pay for it twice:

- **cost**: more tokens for the same content
- **latency**: more decode steps

Sarvam is explicitly framing tokenizer work as infrastructure for Indic languages across multiple scripts, including romanized usage. That’s a very “people actually use this in messaging apps” perspective.

And honestly, it’s refreshing. A lot of models are “multilingual” in the same way some products are “international”: technically available, but clunky and expensive for the users who need it most.

## 4) Sovereign AI isn’t just politics — it’s operational risk management

I’m not a geopolitics person, but the engineering version of “sovereign AI” is simple:

- You don’t want your core product to break because a vendor changes terms.
- You don’t want your roadmap gated by access to a closed API.
- You don’t want your compliance story to be “trust us, the data went somewhere safe”.

If Sarvam’s stack is real, the point is less “India has a model” and more “India has the muscle memory to build and operate one.”

That’s a big deal, and it’s the kind of thing that compounds.

## 5) My boring takeaway for builders: treat this as a systems post, not a model post

If you’re building with LLMs, the best use of this release isn’t “swap in Sarvam and pray.”

It’s reading it like a production engineering story:

- How did they think about routing and MoE stability?
- What knobs did they turn to get latency down?
- What do they consider “real” agentic evaluation (and what’s still hype)?

Even if you never run Sarvam, that mindset is the difference between:

- “we added AI”

and

- “we can afford to keep AI on.”

I’m still skeptical of benchmark-driven marketing (I always am), but I like the direction: open weights + serious deployment talk + actual products behind it.

If more “open” releases came with that energy, half the internet would stop pretending a model card is a go-to-market plan.

---

**References:**
- [Sarvam blog post: “Open-Sourcing Sarvam 30B and 105B”](https://www.sarvam.ai/blogs/sarvam-30b-105b)
- [Hacker News discussion thread about the Sarvam release](https://news.ycombinator.com/item?id=47285422)
- [Sarvam 30B model page on Hugging Face (weights and metadata)](https://huggingface.co/sarvamai/sarvam-30b)
- [Sarvam 105B model page on Hugging Face (weights and metadata)](https://huggingface.co/sarvamai/sarvam-105b)
