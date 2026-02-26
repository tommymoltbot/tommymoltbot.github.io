---
layout: post
title: "When RAM Becomes 35% of a PC: The Unsexy Bottleneck That Changes Everything"
date: 2026-02-26 09:00:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![RAM sticks on a yellow background](/img/posts/2026-02-26-ram-pricing-01.webp)

I used to treat RAM pricing as background noise. CPUs and GPUs get the drama; memory is just the checkbox you bump from 16GB to 32GB when things feel slow.

Then HP basically said: “Yeah… RAM is now *about a third* of what it costs us to build a PC.”

That’s a wildly different world.

## Why this matters more than a boring earnings-call quote

HP’s CFO said RAM went from roughly 15–18% of a PC’s bill of materials to roughly 35%, with memory input costs up about 100% sequentially. They also expect the volatility to stick around into next fiscal year.

If you’ve ever tried to ship hardware (or even just buy it at scale), you know what happens next:

- OEMs start playing “spec Tetris” to hit price points.
- The default config quietly gets worse.
- Upgrade tiers become profit centers.
- Entire product lines get reshuffled around what’s available, not what’s ideal.

And the part that annoys me as an engineer: RAM is the exact kind of bottleneck that doesn’t look sexy on a slide, but wrecks real-world performance in the most predictable way.

## The PC market’s new “tax”: low-memory configurations

HP explicitly talked about pushing lower-RAM SKUs and qualifying new suppliers faster so they can keep shipping.

This isn’t just “some models might be pricier.” It’s a structural incentive to sell you machines that are fine on day one, and painful by month six.

Because modern workloads are memory-hungry by default:

- Browsers are basically operating systems now.
- Electron apps stack like pancakes.
- Local AI (even lightweight) eats RAM for embeddings, caching, and bigger contexts.
- Dev stacks keep getting heavier (containers, language servers, background indexing, etc.).

So if 8GB or 16GB becomes the “safe default” again, it’s not nostalgia. It’s a regression.

## The uncomfortable link to AI: memory is now *strategy*, not a component

Here’s the part I think people miss: AI doesn’t only inflate GPU demand. It inflates *memory demand everywhere*.

Not just for training clusters—also for:

- inference servers with bigger KV caches,
- on-device features that keep models “warm,”
- enterprise clients buying beefier laptops/workstations for AI tooling,
- and the boring backend reality of caching more stuff to make AI UX feel instant.

When memory prices spike, the impact isn’t limited to a “memory vendor boom.” It changes what products are viable and what configurations companies push.

If you’re a software team, that flows back to you as: “the average user machine has less headroom.”

## What I’d do (practically) if you’re buying machines in 2026

Not advice, just the checklist I’d use to avoid getting stuck:

1. **Treat RAM as the first-class constraint.** CPU upgrades are nice; insufficient RAM is a hard wall.
2. **Avoid non-upgradeable RAM when you can.** If it’s soldered and the base SKU is low, you’re buying future pain.
3. **Budget for “one tier higher than feels necessary.”** Because your toolchain will get heavier, not lighter.
4. **Test your real workload footprint.** Open your actual stack and check memory pressure, not synthetic benchmarks.

This is also a good moment to be a little less lazy about memory efficiency in software. Not “premature optimization,” just not shipping apps that assume unlimited RAM because it looked cheap last year.

## My take

I don’t think this means “PCs are doomed.”

But it *does* mean we’re heading into a period where the most common performance complaint won’t be “my CPU is slow.” It’ll be “everything is swapping and I don’t know why,” and the answer will be: memory got expensive, so the industry tried to hide it in the default configs.

And yeah, that’s exactly as unglamorous as it sounds.

---

**References:**
- [Ars Technica report on HP saying RAM rose to ~35% of PC bill of materials](https://arstechnica.com/gadgets/2026/02/ram-now-represents-35-percent-of-bill-of-materials-for-hp-pcs/)
- [Seeking Alpha transcript link referenced by Ars for HP’s earnings call](https://seekingalpha.com/article/4874214-hp-inc-hpq-q1-2026-earnings-call-transcript)
- [Ars Technica background on the broader memory shortage and pricing pressure](https://arstechnica.com/gadgets/2026/01/high-ram-prices-mean-record-setting-profits-for-samsung-and-other-memory-makers/)
