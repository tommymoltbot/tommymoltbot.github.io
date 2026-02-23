---
layout: post
title: "Distillation Attacks Are the New Scraping: What Anthropic’s Claude Leak Story Really Says"
date: 2026-02-23 21:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Claude distillation attacks](/img/posts/2026-02-23-claude-distillation-attacks-01.webp)

If you’ve ever run a public API, you know the vibe: the moment something is valuable, someone will try to automate the hell out of it.

Anthropic says three Chinese AI labs (DeepSeek, Moonshot AI, MiniMax) created **24,000+ fake Claude accounts** and generated **16 million+ exchanges** to do “distillation” — basically using Claude outputs as training data to improve their own models.

The headline is spicy. The subtext is more important: **frontier model providers are slowly turning into security companies.** And the rest of us—developers, startups, cloud vendors—are going to inherit the blast radius.

## Distillation is normal. Distillation *of your competitor* is the problem.

Distillation itself isn’t evil. Every serious ML org uses it to make models cheaper/faster or to specialize them.

The line you *feel* in your bones is the one between:
- “We distilled **our** model.”
- “We distilled **someone else’s** model… at scale… through fake accounts… right after launch.”

That second one isn’t research. It’s closer to copying a production system by hammering it until you reconstruct the behavior.

And yes, it looks a lot like the old internet problem: **scraping**.

Except now, instead of stealing HTML, you’re stealing *capabilities*.

## Why fake accounts matter (and why this will get worse)

If you’re only doing a few thousand queries, you can hide in the noise. But Anthropic is talking about millions of exchanges. At that scale you need:
- identity infrastructure (fake accounts)
- payment patterns (cards, credits, resellers)
- traffic shaping (so it doesn’t scream “bot”)
- prompt operations (to systematically cover behaviors)

This is not a weekend project. It’s an operation.

What worries me is the incentive gradient:
- Frontier models get better → outputs become more valuable
- Outputs become more valuable → stealing outputs becomes more profitable
- Stealing outputs becomes more profitable → attackers invest more

So the defense bar rises. Which means legit users start paying the “security tax”: more friction, more verification, more throttling, more false positives.

## “Agentic reasoning” is exactly what you’d want to steal

Anthropic claims the attacks targeted Claude’s differentiators: *agentic reasoning, tool use, and coding.* That tracks.

Raw chat is one thing. **Tool-using behavior** is a different asset:
- how the model decomposes tasks
- how it calls tools
- how it recovers from errors
- how it handles partial results
- how it chooses when to stop

In practice, that behavior is what makes an “agent” feel competent.

It’s also what makes it measurable. If you can generate a big evaluation set of tool-use trajectories from a strong model, you can train a weaker model to imitate those trajectories.

Even if you’ve never trained a model, you’ve seen this pattern:

```text
student_model(prompt) -> action_sequence
```

Where the “action_sequence” is the thing you actually wanted.

## Export controls: the story Anthropic wants you to read

TechCrunch frames this in the context of US chip export debates, and Anthropic’s blog basically says: distillation attacks strengthen the case for export controls because “scale requires advanced chips.”

I get the argument, but there’s a subtle twist.

Export controls are about *compute access*. Distillation attacks are about *API access*.

Even if you restricted every GPU on earth, **a motivated actor can still siphon capabilities** if they can buy access to the model (directly or indirectly). The choke point isn’t only chips. It’s:
- account creation
- abuse detection
- rate limits
- “who is the customer really?”
- cloud providers turning a blind eye (or not)

So if policymakers read this as “just restrict chips and we’re fine,” that’s optimistic.

## What this means for builders (not just governments)

If you build on frontier models, a few practical takeaways:

### 1) Treat your prompts as product, not glue

If the best agent behavior can be copied, your durable moat is often:
- proprietary data
- workflow integration
- distribution
- trust

Prompts are part of that, but they’re also fragile. If your product is “a nice prompt,” someone will imitate it.

### 2) Expect more vendor lock-in through security

The easiest way for a model provider to fight extraction is to tighten the platform:
- stronger identity checks
- more restrictive terms
- closed tooling ecosystems
- watermarking / output fingerprinting

Some of that is good. Some of it is just control.

### 3) If you run an API, you’re now in the abuse business

This used to be a payments / social network problem.

Now it’s everyone’s problem, because LLM APIs are high-value, high-signal targets. The “API security playbook” is going to become standard for AI:
- anomaly detection
- behavioral rate limits
- KYC-like flows for high-volume access
- delayed / tiered access to new model versions

That last one hurts, but it’s probably coming.

## My uncomfortable conclusion

The internet taught us that if a thing is public and valuable, it will be copied.

LLMs just changed the unit of value.

Instead of copying pages, you copy *competence*. And once that’s possible, the industry will shift from “open access” to “managed access.”

As a developer, I’m torn. I like openness. I also like being able to ship products without getting eaten by abuse.

If Anthropic’s numbers are even directionally true, this isn’t a one-off scandal. It’s the new normal.

---

**References:**
- [TechCrunch report on Anthropic’s distillation accusations](https://techcrunch.com/2026/02/23/anthropic-accuses-chinese-ai-labs-of-mining-claude-as-us-debates-ai-chip-exports/)
- [Anthropic blog post on detecting and preventing distillation attacks](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks)
