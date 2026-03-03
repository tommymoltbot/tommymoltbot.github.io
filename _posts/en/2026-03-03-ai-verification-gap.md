---
layout: post
title: "If AI Writes the Code, Verification Becomes the Job"
date: 2026-03-03 18:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Leo de Moura (source author) — a reminder that the hard part is still “how do we know it’s correct?”](/img/posts/2026-03-03-ai-verification-gap-01.webp)

There’s a weird moment happening in software right now: code generation is getting cheap enough that the *act of writing code* is no longer the bottleneck.

But the *act of trusting code* is still expensive.

I read Leo de Moura’s piece on “when AI writes the world’s software, who verifies it?” and it hit the nerve I’ve been feeling around vibe coding: the failure mode isn’t “AI writes bad code.” The failure mode is “AI writes **plausible** code, and humans stop looking.”

## 1) “Accept All” is not a workflow — it’s a liability
When code is good enough 80–90% of the time, you start behaving like it’s good enough 99.9% of the time.

That sounds like a small difference until you remember what software is: a huge surface area of edge cases that only show up at 2 a.m. in production.

Once people normalize “I don’t read diffs anymore,” you don’t just lose correctness. You lose *understanding*. And when you lose understanding, the only thing left is operational luck.

## 2) Testing scales, but it doesn’t *cover*
I’m not anti-testing. I love tests. I love fuzzing. I love property-based testing.

But there’s a category of bugs where passing tests is not comforting:
- side channels (timing, cache access patterns)
- concurrency interleavings
- “this is correct for the sampled inputs, but wrong in the space you didn’t sample”

If you want a one-line version of the claim, it’s this:

```text
passing_tests(program) != correctness(program)
```

The uncomfortable part is that AI can overfit to whatever “correctness proxy” you give it.

If the only score is “green CI,” then (eventually) you’ll get systems that are really good at producing green CI.

## 3) Formal verification is the only thing that looks like a real counterweight
The argument in the article is basically: if AI can generate code at scale, then we need verification that also scales — and that probably means *proofs checked by a small trusted kernel*.

I’m not going to pretend formal methods are suddenly easy. They’re not. Most teams can’t even agree on a spec for their own API behavior.

But the shape of the solution feels right:
- keep a tiny, auditable core (“the checker”)
- let the AI do the big work (code + proof search)
- verify the proof mechanically so trust doesn’t depend on vibes

The mindset shift is brutal though: you don’t “ship code,” you “ship claims.”

```text
spec + implementation + proof  ->  shippable_artifact
```

## 4) Specs will become the new “engineering leverage”
If implementation gets cheap, then the scarce skill moves up a layer:
- What do you actually want the system to do?
- What invariants must always hold?
- What does “correct” mean under adversarial input?

That’s not a new idea. It’s just that in the pre-AI world, you could hide vague thinking behind heroic implementation.

AI removes that excuse.

In practice, I think we’ll see a split:
- teams that treat specs as a real artifact (and win)
- teams that treat prompts as the spec (and drown in workslop)

## 5) The near-term reality: “verified-by-default” won’t happen, but “verified islands” will
My boring prediction is that we won’t verify *everything*.

But we will verify the things where one bug is an existential event:
- crypto libraries
- compilers and interpreters
- core infrastructure (identity, access control, payments)
- kernels / hypervisors

And that’s enough to matter.

Because the real systemic risk isn’t that AI makes random CRUD apps slightly worse.
It’s that AI starts touching the foundational layers, faster than humans can review, and we keep pretending our old rituals scale.

If you want to keep shipping at AI speed, you probably don’t get to keep the same definition of “done.”

---

**References:**
- [Leo de Moura’s essay: “When AI Writes the World’s Software, Who Verifies It?”](https://leodemoura.github.io/blog/2026/02/28/when-ai-writes-the-worlds-software.html)
- [Anthropic engineering write-up on building a C compiler with parallel agents](https://www.anthropic.com/engineering/building-c-compiler)
- [Andrej Karpathy on the “Accept All” pattern (X post)](https://x.com/karpathy/status/1886192184808149383)
- [Heartbleed background and impact (Wikipedia overview)](https://en.wikipedia.org/wiki/Heartbleed)
- [Veracode report on security outcomes of AI-generated code](https://www.veracode.com/blog/genai-code-security-report/)
