---
layout: post
title: "Fast mode isn’t your bottleneck — mistakes are"
date: 2026-02-15 14:20:00 +0000
categories: [AI]
tags: [AI]
author: Tommy
lang: en
---

![A dashboard showing tokens per second rising while error rate rises faster](/img/posts/2026-02-15-fast-mode-01.webp)

Everyone’s racing to ship “fast mode” for their best models.
More tokens per second, lower latency, the whole dopamine package.

I get why.
If you’ve ever watched an agent think slowly while it burns your budget, you *want* speed.

But here’s the part people keep skipping:

**For most real workflows, inference speed isn’t the bottleneck. Reliability is.**

If speed comes by swapping in a smaller or more brittle model, you often lose more time cleaning up mistakes than you gain from streaming faster.

## 1) Throughput is easy to measure. Error rate is not.

Tokens per second is clean.
You can put it on a chart and feel smart.

But the cost you actually pay in production looks more like:

```text
time = waiting_for_model + time_spent_fixing_model_mistakes
```

And the second term is the killer.
Because it’s not linear.
A single wrong tool call can blow up an entire run.

The annoying truth: **most teams don’t instrument “mistake recovery time.”**
So they optimize the part they can see.

## 2) “Fast mode” is two different products pretending to be one

What’s being marketed as one feature is usually one of these:

- **Same model, more aggressive serving** (smaller batch sizes, higher cost)
- **Different model, different tradeoff** (distilled/smaller model tuned for speed)

Both can be useful.
But they solve different problems.

If you’re paying 6x for lower latency, you’re buying *priority access*.
If you’re switching to a smaller model, you’re buying *a different error profile*.

Those aren’t the same knob.

## 3) The reliability cliff shows up exactly where you want agents most

If all you do is chat, a slightly worse model is fine.
You just ask again.

But once you’re in “agent” territory — tool calls, file edits, multi-step plans — the system behaves like a pipeline.

Pipelines hate variance.

A model that is 15% more likely to:

- call the wrong tool
- hallucinate a flag
- skip a precondition
- misunderstand a constraint

…doesn’t feel 15% worse.
It can feel 2x worse, because it forces reruns and human babysitting.

## 4) The right mental model: fast mode is a *tier*, not a default

If I were designing this for a serious team, I’d treat speed like a scoped resource:

- **Use the fast tier for cheap, reversible steps**: parsing, summarizing, drafting, retrieval.
- **Use the slow-but-correct tier for irreversible steps**: migrations, deploys, payments, security changes.

In other words: let fast models do *thinking*, but make slow models do *committing*.

That’s not “AI safety theater.”
That’s just how you design systems with blast radius.

## 5) What I’d actually measure

If you want to know whether “fast mode” helps, track metrics that are brutally practical:

- **Completion rate**: how often a run finishes without manual intervention
- **Retry count**: how many times you re-run the agent per task
- **Human minutes per run**: babysitting time is the real bill
- **Cost per successful outcome**: not cost per token

Speed matters.
But if you ship it without measuring reliability, you’re basically optimizing your dashboard, not your workflow.

## References

- [Two different tricks for fast LLM inference (Sean Goedecke)](https://www.seangoedecke.com/fast-llm-inference/)
- [Anthropic fast mode documentation](https://platform.claude.com/docs/en/build-with-claude/fast-mode)
- [OpenAI announcement: introducing GPT-5.3 Codex Spark](https://openai.com/index/introducing-gpt-5-3-codex-spark/)
- [OpenAI x Cerebras partnership announcement](https://openai.com/index/cerebras-partnership/)
- [Wafer-scale engine memory bandwidth paper (arXiv)](https://arxiv.org/html/2503.11698v1)
