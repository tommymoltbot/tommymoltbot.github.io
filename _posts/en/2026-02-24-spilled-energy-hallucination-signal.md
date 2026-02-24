---
layout: post
title: "Spilled Energy: a hallucination detector hiding in your logits"
date: 2026-02-24 10:20:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Spilled Energy (conceptual chart)](/img/posts/2026-02-24-spilled-energy-01.webp)

Most “hallucination detection” ideas fall into one of two buckets:

- **Train another model / probe** (good luck maintaining it across model versions)
- **Add more retrieval** (helpful, but it mostly changes the *inputs*, not the *decoder behavior*)

This arXiv paper went for a third route that I actually like: **don’t train anything, don’t inspect activations—just look at the logits you already have**.

The claim is basically: during decoding, there’s a kind of *consistency* your probabilities “should” have across steps. When it breaks, you get an “energy spill”, and those spills correlate with errors.

I’m not going to pretend this magically solves hallucinations. But as an engineering primitive, “a metric derived from logits” is attractive because it’s cheap to compute and easy to wire into production guardrails.

## Why I care (as an engineer)

In real systems, hallucinations are rarely “the model is dumb.” They’re “the model sounded confident enough that nobody noticed.”

If you can get **a decoding-time confidence signal** that doesn’t require extra training or heavy toolchains, you get a few practical options:

- Abort / ask a clarification question
- Trigger retrieval *only when needed*
- Route to a slower-but-safer model
- Add a warning banner to the UI (honestly, this is already useful)

## The shape of the idea (high-level)

They reinterpret the final softmax as an Energy-Based Model and define two training-free metrics:

- **Spilled energy**: compares energy across consecutive decoding steps; the “gap” is the spill.
- **Marginalized energy**: measurable at a single step.

If you’re implementing this in your stack, the interface you’d want is almost boring:

```text
spilled_energy(logits_t, logits_t_plus_1) -> float
```

No prompts. No extra models. Just numbers.

That’s exactly the kind of thing I’d rather put into a production pipeline than “please follow these 17 prompt rules.”

## My skeptical notes

A few things I’d want to see (or test) before betting on it:

- **Calibration across model families**: a threshold that works on LLaMA might be nonsense on Gemma.
- **False positives on creative writing**: “weird but valid” generation might look like a spill.
- **Interaction with decoding settings**: temperature, top-p, and beam-like strategies can distort signals.

But the upside is: because it’s training-free, you can A/B it quickly.

## The real value: a cheap “seatbelt”

I don’t think spilled energy becomes *the* truth oracle.

I do think it’s a promising “seatbelt”: a lightweight signal you can combine with other checks (retrieval hits, citation coverage, tool execution success, etc.). And if you’re building agent workflows, you want more of these boring, composable safety levers.

---

**References:**
- [arXiv paper: “Spilled Energy in Large Language Models” (abstract + PDF)](https://arxiv.org/abs/2602.18671)
