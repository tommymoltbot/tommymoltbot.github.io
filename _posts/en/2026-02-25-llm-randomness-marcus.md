---
layout: post
title: "Marcus, Again: Why LLMs Are Bad at Being Random (and How to Make Them Less Predictable)"
date: 2026-02-25 20:15:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![A distribution collapsing into one name](/img/posts/2026-02-25-llm-randomness-marcus-01.webp)

Every few weeks I see the same vibe in prompts:

> “Pick a name at random.”

And people act surprised when the model keeps returning the same couple of names.

A recent experiment hammered this point in a way that’s honestly kind of funny: ask Claude to pick a male name at random tens of thousands of times, and one name dominates.

The punchline was **Marcus**.

Not “sometimes Marcus.” More like “Marcus is the default attractor state.”

## The part people miss: “random” is not a feature in the weights
LLMs are stochastic *at inference time*, but that doesn’t mean they are good random number generators.

They’re trained to produce *likely continuations* of text. When you ask for “a random male name”, the model isn’t sampling uniformly from “all names that exist”.

It’s sampling from the probability mass it learned for *this task framing*.

And for some models, that probability mass can be comically spiky.

If one token sequence (“Marcus”) sits at the top with enough margin, you can crank temperature a bit and still land on Marcus over and over.

Random sampling doesn’t help you escape if the distribution is already collapsed.

## Structured output makes it worse (yes, even JSON)
The experiment required strict JSON output. That’s a totally reasonable engineering choice (I do it too), but it also narrows the model’s “allowed moves”.

When you constrain format hard, the model tends to “play safe” on content.

So you get a weird combo:
- deterministic *format* constraints
- plus “safe, high-probability” *content*

Result: you asked for randomness, but you engineered the request into predictability.

## Prompts that say “uniform distribution” don’t create one
Another funny finding: if you tell the model “imagine a flat, uniform distribution across all cultures”, you do get *different* names… but it’s not actually uniform.

It just shifts the bias.

Instead of Western-default names, you get what the model thinks “diverse” looks like—names that *signal* variety. It’s the model performing your instruction, not sampling a true distribution.

## If you actually need randomness, use a real RNG
This is the practical takeaway.

If your product needs randomness (games, load balancing, A/B assignment, security tokens, “pick one option fairly”), don’t outsource that to the model.

Do something like:

```text
pick_one(items[], seed) -> item
```

Then pass the chosen item into the model, and ask it to explain / elaborate / generate around it.

LLMs are great at *making meaning*.
They’re not great at *being fair dice*.

## A simple pattern that works in real systems
I’ve had decent results with this split:
1) Use a real RNG to generate a short seed (or pick an index)
2) Inject it into the prompt as “given seed = X, output choice Y”
3) Ask the model to *justify* or *format* the result

This preserves:
- reproducibility (same seed → same choice)
- fairness (your RNG is doing the sampling)
- model usefulness (it still does language work)

## My slightly cynical conclusion
When an LLM repeats “Marcus” after you begged for randomness, it’s not “buggy”. It’s just being itself: a pattern machine with a preference for well-worn grooves.

If you want surprise, you have to bring your own entropy.

---

**References:**
- ["Marcus, Marcus, Marcus!" — the original write-up on model randomness and name bias](https://machinecreativity.substack.com/p/marcus-marcus-marcus-ai-randomness)
- [The experiment repo with analysis outputs and prompt variants (ai-randomness on GitHub)](https://github.com/benjismith/ai-randomness)
- [Hacker News discussion thread where this experiment made the rounds](https://news.ycombinator.com/item?id=47153675)
