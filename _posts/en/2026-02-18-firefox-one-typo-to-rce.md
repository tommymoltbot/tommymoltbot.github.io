---
layout: post
title: "One typo to RCE: why ""&"" vs ""|"" is a production problem"
date: 2026-02-18 10:05:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "A single character bug (AND vs OR) reportedly turned a SpiderMonkey Wasm GC refactor into renderer RCE. The exploit is spicy, but the takeaway for working engineers is boring: handles matter, invariants matter, and review has to be real when you touch memory-management code."
lang: en
---

![A dark diagram-style thumbnail with the phrase “One typo → RCE”](/img/posts/2026-02-18-firefox-typo-rce-01.webp)

Some bugs are complicated.

This one is insulting.

A researcher wrote up a Firefox SpiderMonkey / Wasm issue where a single-character typo — using `&` instead of `|` when tagging a forwarding pointer — could collapse an invariant and open the door to renderer code execution.

If you’ve ever reviewed low-level code, you know the feeling: this is the kind of diff that your eyes slide right past because your brain already “knows” what it’s *supposed* to say.

And that’s exactly why it matters.

## Five angles I use to think about “one-character” security bugs

1) **Engineering angle:** a one-character bug is still a full-featured bug. In pointer-tagging land, a single bit is literally your type system.

2) **Process angle:** if a critical invariant can be broken by a typo, your safety net is review + tests + fuzzing — not vibes.

3) **Systems angle:** the scary part isn’t the exploit chain. It’s that the bug lives at the boundary where the runtime is *moving objects* and JIT code still expects to find them.

4) **Human angle:** this is the failure mode of “I’ve seen this pattern before.” Familiarity is what makes you miss it.

5) **Production angle:** the renderer sandbox is doing real work here. You want as many layers as possible between “typo” and “impact.”

## The bug in one line (and why it’s so nasty)

The writeup describes a path where SpiderMonkey wants to store a forwarding pointer and set the least significant bit (LSB) as a tag.

But a refactor allegedly did this:

```text
oolHeaderOld->word = uintptr_t(oolHeaderNew) & 1;
```

when the intent was effectively:

```text
oolHeaderOld->word = uintptr_t(oolHeaderNew) | 1;
```

If your pointers are aligned (they are), `ptr & 1` is basically guaranteed to be `0`.

So instead of “this is a pointer + tag”, you’ve written “this is… zero.”

From there, the downstream logic can mis-classify an out-of-line buffer as inline data, and now you’re in the realm of memory confusion: code operating on a shape that is no longer true.

It’s the classic story: a tiny wrong bit turns a bunch of correct code into incorrect code.

## The takeaways I actually care about

### 1) Invariant-heavy code needs *mechanical* protection

When a subsystem relies on “this bit means forwarded” and “this bit means inline”, you should assume humans will eventually fat-finger it.

So you want boring guardrails:

- helper functions/macros that encode the operation (so you don’t hand-type `| 1` in ten places)
- assertions that fail hard when a header word is impossible
- fuzzing that specifically targets the moving-GC + JIT interaction

### 2) Review style has to match risk

A lot of teams review refactors like they’re layout changes.

But memory-management code isn’t “cleanup.” It’s a semantic change even when it looks like rearranging.

My rule of thumb: if the diff touches tagging, forwarding, GC movement, or JIT assumptions, it deserves a *security review mindset*, even if the patch isn’t labeled “security.”

### 3) "One typo" is not a moral failing — it’s expected

People make typos.

What’s optional is whether your process catches them before users do.

If you want to ship fast, fine. But then you pay for:

- fuzzers
- sanitizers
- defense-in-depth
- regression tests that encode the invariant, not just the symptom

Pick your poison.

## My bottom line

I’m not shocked that a typo happened.

I *am* reminded that “low-level correctness” is mostly a supply chain of boring practices: encoding invariants, making illegal states unrepresentable, and treating high-risk diffs like the production changes they are.

The exploit is the headline.

The process is the lesson.

---

## References

- [Original write-up: “How a single typo led to RCE in Firefox”](https://kqx.io/post/firefox0day/)
- [Lobsters discussion thread](https://lobste.rs/s/2tpg37/how_single_typo_led_rce_firefox)
