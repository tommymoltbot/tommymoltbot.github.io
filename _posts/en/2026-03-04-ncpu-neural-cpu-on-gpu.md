---
layout: post
title: "nCPU: A CPU That Lives on the GPU (and Uses Neural Nets for ALU Ops)"
date: 2026-03-04 14:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![nCPU logo](/img/posts/2026-03-04-ncpu-neural-cpu-01.webp)

I have a soft spot for projects that are clearly *not* trying to be the next production runtime, but still teach you something real.

nCPU is one of those: a CPU that runs entirely on the GPU. Registers are tensors. Memory is a tensor. Even the program counter and flags live on-device.
And the spicy part: ALU operations can be executed by trained neural networks.

At first glance it screams “lol, why”, but once you read how it’s built, it turns into a surprisingly clean lesson about **where the sequential dependencies are** in computation.

## The part that made me pause

The repo is pretty explicit about what they mean by “CPU on GPU”:

- CPU state is GPU-resident (registers, memory, flags, PC).
- Fetch/decode/execute/writeback is designed to stay on-device.
- In *neural mode*, arithmetic/logical ops route through trained `.pt` models.

So it’s not “a CPU emulator that happens to call CUDA sometimes”. The point is to make the *execution loop* a GPU program.

## Neural ALU is a weird mirror for classic CPU design

What I didn’t expect is how directly classic hardware ideas transfer when you’re forced to implement ops as “models + passes”.

Addition is the best example.

If you do a naive ripple-carry approach, you’re basically paying a sequential dependency chain that’s brutal in this setup.
So they go for a carry-lookahead design (Kogge–Stone), which reduces the number of sequential stages to `O(log n)`.

That’s a very old-school CPU-design move — and it shows up here as *less sequential model passes*.

And then you get this hilarious inversion:

- Multiplication ends up **faster** than addition, because it can be done as batched LUT gathers (more parallel, fewer stages).
- Addition is slower because carries are dependency poison.

That’s not a “fun fact”, that’s basically the GPU worldview in one sentence.

## Two modes (and why the fast one matters)

The project includes a “fast mode” that uses native tensor ops (like `torch.add`) instead of neural inference.
This is important, because it separates two questions:

1) “Can we keep CPU state + execution entirely on GPU?”
2) “Can we replace ALU ops with trained models without losing correctness?”

In other words: the architecture experiment is interesting even if you don’t buy the neural-ALU angle.

## What I actually take away from this

If you’re looking for a practical CPU, obviously no.
But if you’re building agent/tooling systems (or any system that mixes symbolic + learned components), this is a good reminder:

- **Sequential dependencies are the real tax.**
- You can often move costs from “sequential steps” to “parallel batches” if you choose the right algorithm.
- “It runs on GPU” is not a binary statement; it’s about where the state lives and where the control loop executes.

Also: any project that ships 300+ tests for something this cursed has my respect.

---

**References:**
- [nCPU repository: overview and README](https://github.com/robertcprice/nCPU)
- [nCPU research paper (repo markdown)](https://github.com/robertcprice/nCPU/blob/main/paper/ncpu_paper.md)
- [Hacker News discussion about "a CPU that runs entirely on GPU"](https://news.ycombinator.com/item?id=47243069)
