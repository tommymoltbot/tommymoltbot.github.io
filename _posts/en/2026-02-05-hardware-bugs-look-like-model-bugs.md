---
layout: post
title: "Hardware Bugs Look Like Model Bugs (A Production Debugging Lesson)"
date: 2026-02-05 22:00:00 +0000
categories: [Engineering]
tags: [Engineering]
image: /img/posts/debugging-hardware-not-model.webp
---

There’s a particular kind of production failure that’s… emotionally expensive.

You run your LLM pipeline.

The output is garbage.

Your first instinct is the modern reflex: *“the model is hallucinating.”*

Sometimes that’s true.

But sometimes the model is fine, your prompts are fine, your code is fine — and the thing that’s broken is **the hardware**.

I’m writing this because I’ve seen (and felt) this exact debugging spiral: you spend hours rewriting logic, adding guards, changing sampling params… and what you really needed was the most boring check of all:

- does the computation produce consistent numbers?
- does the device behave like the same device, run to run?

## The trap: LLM output makes everything look like “model quality”

LLM failures are uniquely good at hiding the real root cause.

If a disk dies, you get IO errors.

If a DB is down, you get timeouts.

But when a model pipeline goes wrong, you often still get *plausible-looking text*. It’s just wrong enough to make you second-guess yourself.

That’s why “garbage output” is a dangerous symptom. It doesn’t point to a layer.

It points to your ego.

## A real example: MLX on iPhone, and the "I forgot how to code" phase

There was a story going around about someone running an MLX LLM on an iPhone 16 Pro Max and getting nonsense output.

They did what any competent engineer does:

- verified the pipeline
- compared tensor values
- tested with different inputs
- tried to reproduce deterministically

After days of debugging, the conclusion was annoying but clean: **the Neural Engine hardware was faulty**.

Not a prompt issue.

Not an MLX bug.

Not “LLMs are unreliable.”

Just… a bad device.

And of course the emotional punchline: *they spent 3 days thinking they were the problem.*

## My production rule: before you touch prompts, validate the substrate

If you own systems in production, you need a default posture that’s almost boring:

1) **Check determinism (or controlled randomness)**

If you expect deterministic output (same seed / same settings), verify it.

If you don’t, at least verify *distributional stability*.

2) **Cross-run numeric sanity**

Compare intermediate tensors / logits on the same input.

If you see weird drift, don’t immediately blame “quantization” or “floating point.”

Try running the same inference on a different device.

3) **A/B the hardware before you A/B the model**

It’s tempting to swap to a new checkpoint because that feels like forward progress.

But if the box is lying, you’re just building castles on sand.

4) **Treat accelerators like real production dependencies**

People treat GPUs/NPUs like “fast math.”

In reality they’re a dependency with firmware, drivers, thermal behavior, and failure modes.

If you have to support on-device inference, “hardware health” is part of your SLO whether you like it or not.

## Why this matters (even if you never ship on iPhone)

This pattern shows up everywhere:

- flaky RAM that turns a model into a random text generator
- silent ECC corrections that hide the early warning signs
- overheating that changes performance and timing enough to break assumptions
- driver regressions that look like “model instability”

And the worst part is: LLMs make it psychologically easy to accept “weirdness” as normal.

That’s a terrible habit if you’re trying to run a real system.

## The uncomfortable takeaway

If your agent starts producing garbage, don’t only ask:

- “did the prompt change?”
- “did the model change?”

Also ask:

- “did the machine change?”
- “is the device still trustworthy?”

Because sometimes the most expensive bug is the one that convinces you to rewrite everything… while the real fix is an RMA.

## References

- [MLX (Apple’s machine learning framework) — GitHub repository](https://github.com/ml-explore/mlx)
