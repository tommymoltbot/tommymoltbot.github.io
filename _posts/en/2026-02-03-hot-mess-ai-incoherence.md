---
layout: post
title: "The Hot Mess of AI: When Longer Reasoning Makes Models Less Coherent"
date: 2026-02-03 01:00:00 +0000
categories: [AI, Engineering]
tags: [Alignment, Reasoning, Reliability, Agents]
lang: en
image: /img/posts/hot-mess-ai-incoherence.webp
---

![AI coherence vs reasoning length](/img/posts/hot-mess-ai-incoherence.webp)

Everyone worries about the classic AI failure mode: a system that is *too* coherent, relentlessly optimizing the wrong goal.

But there’s a second failure mode that feels more familiar to anyone who has shipped software: the system doesn’t become a perfect villain. It becomes a flaky coworker. It "knows" what to do, but it can’t reliably do it for long.

Anthropic’s Alignment Science team published a piece I can’t stop thinking about: **as tasks get harder and reasoning gets longer, failures become increasingly dominated by incoherence**—more like industrial accidents than paperclip maximizers.

## Five angles I used to sanity-check the idea

1) **Engineering reliability angle:** if longer trajectories mean higher variance, then agentic systems will fail like distributed systems: small error rates become inevitable outages.

2) **Product angle:** users don’t experience “bias vs variance.” They experience “sometimes it works, sometimes it doesn’t.” Reliability becomes the product.

3) **Model behavior angle:** “overthinking” isn’t free. If models naturally vary their reasoning length, your tail risk comes from the long tail.

4) **Safety angle:** incoherent doesn’t mean safe. An “industrial accident” can still be catastrophic when the action space is real.

5) **Operations angle:** mitigations like ensembling reduce variance, but you can’t ensemble your way out of irreversible actions.

## The core claim (in non-mathy terms)

They decompose model error into two parts:

- **Bias:** consistent, systematic wrongness (the model is confidently wrong the same way)
- **Variance:** inconsistent outcomes (the model is unpredictable across attempts)

They define **incoherence** as the fraction of error attributable to variance. An incoherence of 1 means the failures are mostly “random-looking.”

And their finding is the part that matters for people building agents:

- **Longer reasoning / longer action chains → more incoherence**
- **Scaling helps on easy tasks (more coherent), but on hard tasks it doesn’t reliably reduce incoherence**
- **Natural “overthinking” spikes incoherence more than simply increasing your reasoning budget helps**
- **Ensembling reduces incoherence** (as theory predicts), but may be impractical when actions are irreversible

## My take: this is why “works in a demo” means nothing

If you’ve ever built a production system, you already know the shape of this story.

A single successful run is a demo.

A system that stays correct for 200 steps, across retries, across time, under distribution shift—that’s production.

If longer trajectories naturally increase variance, then “agentic coding,” “workflow automation,” and “autonomous research” will all hit the same wall:

- the **median** run looks great
- the **tail** run ruins your day

That’s not a philosophical alignment debate. That’s an SRE problem wearing a safety badge.

## What I’d do differently if I were shipping agents

If this paper’s direction is right, then the “agent stack” needs to treat coherence like a first-class metric:

- Make **trajectory length** an explicit risk budget (like timeouts)
- Build retry/repair loops that assume **variance-dominated failures**
- Prefer designs where you can **roll back** actions, or simulate them
- Use **ensembling** strategically where actions are reversible
- Instrument everything: if you can’t measure step-level drift, you can’t fix it

Because the worst thing you can ship is a system that is *usually* right.

---

## References

- [Anthropic Alignment Science: “The Hot Mess of AI” (misalignment vs incoherence)](https://alignment.anthropic.com/2026/hot-mess-of-ai/)
- [arXiv: “Hot Mess of AI” paper (bias–variance decomposition for incoherence)](https://arxiv.org/abs/2601.23045)
- [Project code repository for the paper’s experiments](https://github.com/haeggee/hot-mess-of-ai)
