---
layout: post
title: "iPhone 16 Pro Max Produces Garbage When Running MLX LLMs: Neural Engine Hardware Defect"
date: 2026-02-02 09:10:00 +0000
categories: [Engineering, AI]
tags: [Apple, MLX, Hardware, Debugging]
lang: en
image: /img/posts/iphone-16-mlx-neural-engine-bug.webp
---

Someone spent three days debugging, thinking they couldn't code. Turned out their $1,400 iPhone 16 Pro Max had a hardware defect.

## The Problem: MLX Outputs Gibberish

Rafael Costa recently wanted to run on-device LLMs on his iPhone using Apple's MLX framework. Every model—Gemma, Qwen, you name it—produced complete garbage:

```
"What is 2+2?" → "Applied.....*_dAK[...]"
```

And the model never generated a stop token, so it kept running indefinitely with CPU pegged at 100%.

His first reaction? "Am I incompetent? Can't even get a ready-made framework to work?" Spent three days checking code, tweaking parameters, re-reading docs. Nothing worked.

## The Breakthrough: Testing on Different Devices

One morning he had an idea: "What if it's the device?"

Grabbed his old iPhone 15 Pro, ran the same code. Result: perfect. Gemma, Qwen, everything worked flawlessly.

"Maybe it's an iOS version thing?" Updated iPhone 15 Pro to iOS 26 as well. Result: still perfect.

At this point it was clear: the iPhone 16 Pro Max itself was broken.

## Finding the Smoking Gun: Comparing Tensor Outputs

He decided to dig into MLX's Gemma implementation and print out MLXArray/tensor values at each layer iteration. Same model, same prompt (`"What is 2+2?"`), temperature set to 0.0 to eliminate randomness.

The results:

**iPhone 15 Pro (working)**:
```
[[[[53.875, 62.5625, -187.75, ..., 42.625, 6.25, -21.5625]]]]
```

**iPhone 16 Pro Max (broken)**:
```
[[[[191.5, 23.625, 173.75, ..., 1298, -147.25, -162.5]]]]
```

Values were off by **more than an order of magnitude**. What's even crazier: both phones started with identical input tensors:

```
array([[[0.162842, -0.162842, -0.48877, ..., -0.176636, 0.0001297, 0.088501],
 [-0.348633, -2.78906, 0, ..., 0.84668, 0, -1.69336],
 ...]], dtype=float16)
```

Same input, but somewhere in the middle layers the output went completely sideways.

Ran it on a MacBook Pro: output matched iPhone 15 Pro **exactly**.

Confirmed: iPhone 16 Pro Max's Neural Engine or related hardware was faulty.

## My Take

This debugging process was solid. Instead of giving up, he used the most fundamental approach—comparing tensor outputs across devices—to pinpoint the issue.

But what's more concerning: **this iPhone 16 Pro Max was an Apple Care replacement unit**. Quality control issue?

Also, Rafael mentioned his Apple Intelligence download kept getting stuck. If both issues are related to the Neural Engine, are [those 12 pages of complaining users](https://discussions.apple.com/thread/255822364?answerId=261482678022&sortBy=rank&page=12#261482678022) hitting similar hardware problems?

MLX offloads tensor operations to the Neural Engine via Metal. If the Neural Engine itself is defective, both Apple Intelligence and MLX would fail.

## The Ending

Eventually Rafael got an iPhone 17 Pro Max (probably meant a new replacement unit) and everything worked. So it was definitely that specific device.

But he spent three days doubting himself. I've been there too: spending hours debugging, only to find out it was broken hardware or some environmental config gone wrong. That "oh it wasn't my fault" feeling... feels good, but also kinda empty.

This is a reminder: **when debugging, don't just stare at the software layer**. Sometimes the problem is at the physical layer.

---

## References

- [Original: My thousand dollar iPhone can't do math by Rafael Costa](https://journal.rafaelcosta.me/my-thousand-dollar-iphone-cant-do-math/)
- [Hacker News Discussion Thread](https://news.ycombinator.com/item?id=46849258)
- [Apple Discussions: Apple Intelligence Download Issues](https://discussions.apple.com/thread/255822364?answerId=261482678022&sortBy=rank&page=12#261482678022)
