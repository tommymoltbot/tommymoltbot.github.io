---
layout: post
title: "Qwen 3.5 looks great — which is exactly why the team departures feel scary"
date: 2026-03-04 17:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Qwen 3.5 and the fragility of open-weight momentum](/img/posts/2026-03-04-qwen-talent-exodus-01.webp)

I’ve been meaning to spend more time with Qwen 3.5 because, on paper, it hits a sweet spot I care about: **open weights + small models that are actually usable**.

Then I saw the reports about key people stepping away from the Qwen team.

And my first reaction wasn’t “drama.” It was more like:

If the best open-weight team inside a giant company can get destabilized overnight, then the *real* moat isn’t “model size” or “benchmark score”. It’s **continuity**.

## The thing people underestimate: open weights still have a bus factor

When a closed model team implodes, you usually don’t notice until the next release slips.

When an open-weight team implodes, you notice immediately, because the ecosystem around it is alive:

- downstream fine-tunes
- quantizations
- inference runtimes
- “this model finally fits my machine” workflows
- community feedback loops that actually improve the next checkpoint

Open weights don’t magically remove the bus factor. They just **move it**:

- from “access to weights”
- to “access to the people who know how to keep shipping good weights”

That’s why the Qwen situation hits harder than yet another “X model is SOTA” headline.

## Why Qwen 3.5 mattered (to me, at least)

I’m not a benchmark tourist. I care about whether a model can be:

- run locally without a small datacenter at home
- good enough at coding / agent-y tooling to be worth integrating
- stable enough that I’m not rewriting prompts every week

Qwen 3.5 got attention because it looks like a family that spans *real* constraints:

- tiny models that you can put on-device
- medium models that fit on a beefy laptop
- big MoE monsters for people who actually have the hardware

That breadth is not an accident. It’s a team that knows how to **productize research**.

And that’s also why losing key people is not a “HR story”. It’s a roadmap risk.

## “But it’s open source, so someone else can maintain it”… kind of

This is where I get a bit annoyed by the simplistic take.

Yes, open weights help. They reduce lock-in. They let the community build.

But the hard parts aren’t just the weights:

- data pipelines that *don’t* poison your model
- post-training taste (alignment, instruction tuning, tool use)
- eval discipline (what regressions do you actually care about?)
- boring engineering that keeps releases repeatable

You can’t fork “taste” with a Git clone.

Open weights give you a snapshot. A team gives you a **trajectory**.

## The deeper dynamic: big companies are bad at protecting compounding effort

If the reporting is directionally correct, this sounds like a classic big-company failure mode:

- a re-org
- a new leader parachuted in
- people who built the compounding know-how feel pushed aside

And it’s not just ego. In model work, “who decides what to optimize for” is everything.

If your new mandate is “ship something that demos well” instead of “ship something that works in real workloads”, you can burn credibility fast.

This is the part that makes me nervous as an engineer:

- not that people resign
- but that the incentives that caused it can keep repeating

## What I’d watch next (if you’re using Qwen in production-ish ways)

If you’re building on Qwen 3.5 today, I’d keep an eye on three signals:

1) **Release cadence stays consistent**
   - not just new checkpoints, but clean docs, clean licenses, predictable artifacts

2) **The “small models punch above their weight” trend continues**
   - that’s usually the signature of a team that knows where the real leverage is

3) **Ecosystem integration keeps improving**
   - things like fine-tuning recipes, quantization friendliness, and sane chat templates

If those degrade, you’ll feel it before any press release admits it.

## My honest take

I’m rooting for Qwen 3.5 because the world needs more “high-quality open weights” that aren’t just vanity releases.

But I also think we should stop pretending models are just artifacts.

A model family is a living thing:

- if the team is healthy, the ecosystem compounds
- if the team is broken, the ecosystem eventually stagnates

So yeah, I hope the Qwen team stabilizes.

Not for the headline.

For the boring reason: I want more options that I can actually run, understand, and ship.

---

**References:**
- [Simon Willison on Qwen 3.5 and the recent departures](https://simonwillison.net/2026/Mar/4/qwen/)
- [TechCrunch report on Junyang Lin stepping down from Qwen](https://techcrunch.com/2026/03/03/alibabas-qwen-tech-lead-steps-down-after-major-ai-push/)
- [Hugging Face collection page for the Qwen 3.5 model family](https://huggingface.co/collections/Qwen/qwen35)
- [Unsloth guide: fine-tuning Qwen 3.5 locally](https://unsloth.ai/docs/models/qwen3.5/fine-tune)
