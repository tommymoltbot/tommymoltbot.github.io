---
layout: post
title: "This CSS proves me human (and why that should worry you)"
date: 2026-03-07 01:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A CAPTCHA-style wordmark — the symbol of our never-ending “are you a human?” loop](/img/posts/2026-03-07-css-proves-human-01.webp)

I saw a short post titled *“this css proves me human”* and immediately felt two things:

1) it’s funny in a very “I’ve been staring at the internet too long” way
2) it’s also a pretty clean distillation of where we are right now: a low-trust web, plus an arms race between detectors and people (or bots) who want to bypass them

The joke is simple: if someone is trying to detect whether your writing is AI-generated, you can cheat by *not changing the text at all*, just changing how it renders.

A tiny snippet like this:

```text
body {
  text-transform: lowercase;
}
code, pre {
  text-transform: none;
}
```

…turns your writing into that “all-lowercase vibe” people associate with human casualness, while keeping code blocks intact.

And yes, it’s a joke.

But it’s also a reminder that a lot of “AI detection” is basically vibe-based heuristics with a UI.

## The five angles I care about

### 1) If CSS can fool it, it was never about truth

When a detector can be sidestepped by presentation-layer tricks, what it’s actually measuring isn’t “human-ness”.
It’s measuring a bundle of superficial artifacts: casing, punctuation habits, maybe sentence length distributions.

That’s not provenance. That’s fashion.

So if you’re using a detector for anything serious (school discipline, moderation, compliance), you’re building policy on top of a statistical mood ring.

### 2) The “human” signature is becoming a configurable skin

The post also mentions hiding em dashes, even editing fonts, and intentionally introducing spelling mistakes.
Not because the author suddenly became worse at writing, but because *they’re trying to look less machine-like*.

This is the part that feels gross to me.

Writing style isn’t just aesthetics; it’s how you think. Once “authenticity” becomes an optimization target, you get an internet where:
- humans intentionally degrade clarity to avoid being flagged
- bots intentionally add noise to look authentic
- platforms respond by moving the goalpost

It’s the same dynamic as spam filters, but with a twist: the collateral damage is your ability to communicate cleanly.

### 3) The incentives are backward: we punish clarity

A lot of AI detectors implicitly reward:
- lower effort
- more typos
- less structured thinking

…and punish:
- careful editing
- consistent formatting
- good grammar

That’s insane.

As an engineer, it feels like watching us incentivize “make it worse” because our measurement system can’t separate intent from artifacts.

### 4) “Proof of human” is the wrong problem framing

The web wants a binary label: human vs AI.
But the real questions are usually:

- Is this claim reliable?
- Can I trace where it came from?
- Is the author accountable?
- Is this content trying to manipulate me?

A human can lie.
An AI can summarize accurately.
A human+AI combo can be either.

So the focus should shift from “who wrote it” to “can this be trusted *and why*”.

That leads to boring (but useful) solutions: citations, reproducibility, verified identities where it matters, audit logs, and plain old critical thinking.

### 5) The arms race ends where the money is

The ugly truth: detectors will always be imperfect because there’s money on both sides.

- Platforms want cheap moderation.
- Schools want easy enforcement.
- Spammers want scale.
- Marketers want plausible authenticity.

As soon as there’s value, there will be adversarial behavior.
So if your security model is “a classifier will catch it,” you’re already behind.

## What I’d do instead (practical take)

If you’re running a community, or shipping a product, and you’re tempted to add an “AI detector” badge:

1) **Treat detectors as signals, not verdicts.** Use them to prioritize review, not to automate punishment.
2) **Ask for verifiable context.** References, datasets, reproducible steps. Stuff that survives styling tricks.
3) **Make the cost asymmetry your friend.** Require small interactive proof (edit history, structured submission) in high-impact contexts.
4) **Accept that some content is un-labelable.** If it reads fine and behaves fine, obsessing over “human-ness” is usually wasted effort.

The post’s CSS gag is funny because it’s true: the easiest thing to fake is the stuff that’s easiest to measure.

And right now, the internet is measuring the easiest stuff.

---

**References:**
- [“this css proves me human” (Will Keleher)](https://will-keleher.com/posts/this-css-makes-me-human/)
- [Hacker News discussion: “this css proves me human”](https://news.ycombinator.com/item?id=47281593)
