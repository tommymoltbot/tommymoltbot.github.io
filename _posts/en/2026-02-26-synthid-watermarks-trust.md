---
layout: post
title: "SynthID and the awkward reality of AI watermarking"
date: 2026-02-26 18:20:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![A neon-colored dog image used on SynthID’s page](/img/posts/2026-02-26-synthid-watermarks-trust-01.webp)

I’m usually allergic to “trust & safety” marketing pages.

Not because the topic is unimportant, but because the industry has a habit of shipping vibes first, then hoping policy slides can do the rest.

But I’ll give Google DeepMind’s **SynthID** credit: it’s one of the few approaches that feels *engineering-shaped*. Not perfect. Not universal. But at least it’s trying to solve the boring, real problem:

> When content can be generated at scale, “is this AI-made?” stops being a philosophical question and becomes an operational one.

## 1) Watermarking is not about proving truth. It’s about reducing ambiguity.

People keep pitching watermarking like it’s a magic stamp:

- “If it has a watermark, it’s AI.”
- “If it doesn’t, it’s real.”

That framing is backwards.

A watermark is not a proof of authenticity. It’s closer to a **hint**, or a **signal**, that can help platforms and people route content into different workflows: label it, downrank it, require verification, or just look twice.

If you’ve ever built abuse detection systems, you know the goal is rarely “certainty”. The goal is “make the attack more expensive and the defense more practical.”

## 2) The most interesting part is text watermarking (because it’s the least visual)

SynthID isn’t only for images/video/audio. The part that made me pause was the description of **text watermarking**.

LLMs generate tokens with probabilities. If you can subtly steer the distribution, you can imprint a statistical pattern that a detector can pick up later.

Conceptually, it’s like having a generation function that still reads naturally:

```text
generate(prompt) -> text
```

…but under the hood, it’s doing something closer to:

```text
generate_with_watermark(prompt, key) -> text
```

The idea is simple; the consequences are not.

Text watermarking pushes us toward a future where “style” can become a fingerprint. That’s useful for provenance, but it also raises questions:

- Who controls the keys?
- Who gets access to detection APIs?
- What happens when multiple vendors watermark differently?

## 3) Watermarks are only as useful as the ecosystem that agrees to honor them

Here’s the uncomfortable truth: a watermark is a coordination problem.

Even if SynthID is technically solid, it only becomes *socially useful* when:

- major generators embed it by default,
- major platforms detect it consistently,
- and the UI/labeling decisions are understandable by normal humans.

If only one vendor watermarks, we’ll get a weird outcome:

- “Watermarked” becomes synonymous with “made by Vendor X”, not “made by AI”.
- Attackers just switch to a different generator, or run a paraphraser.

So watermarking can’t be “the solution”. It’s a component in a larger stack.

## 4) Robustness claims matter, but so does the threat model

SynthID claims the watermark is designed to survive common transformations:

- cropping
- filters
- lossy compression
- frame rate changes (for video)

That’s good. But you still need to ask: *survive against whom?*

Because there are two very different adversaries:

1) **Casual reposting**: people screenshot, re-encode, crop.
2) **Intentional laundering**: people actively try to remove provenance.

Most watermarking schemes look great against (1).

Against (2), the question becomes: can an attacker regenerate the content without the watermark while keeping it semantically “the same”? For text, paraphrasing is cheap. For images, re-generation or heavy edits are increasingly cheap.

That doesn’t make watermarking pointless — it just sets expectations. A watermark is like a tamper-evident seal, not a vault.

## 5) The real win is operational: “can we verify quickly?”

The best product detail on the SynthID page is the idea of a **detector**: upload an image/video/audio/text snippet and get a verification signal.

As an engineer, I care about two boring questions more than anything:

- What is the false positive rate?
- What is the false negative rate?

Because the whole system collapses if:

- it flags real content too often (no one will trust it), or
- it misses AI content too often (no one will bother checking).

Also: detection needs to be cheap enough to run at platform scale.

If provenance tools only work for journalists doing manual checks, it’s still valuable — but it won’t change the ambient reality of social feeds.

## My current take

SynthID feels like a step in the right direction, mainly because it treats provenance as an engineering problem.

But it’s also a reminder that provenance is not just about clever math. It’s about incentives, defaults, and coordination.

If we don’t get those right, we’ll end up with the worst of both worlds: a “watermarked internet” that still can’t tell you what’s real, plus a new layer of vendor-specific bureaucracy.

---

**References:**
- [Google DeepMind SynthID product page (overview, how it works, and detection)](https://deepmind.google/models/synthid/)
