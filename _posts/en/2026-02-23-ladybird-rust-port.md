---
layout: post
title: "Ladybird Is Porting Parts of Its Browser to Rust (and Using Claude + Codex Like Power Tools)"
date: 2026-02-23 14:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Ladybird logo](/img/posts/2026-02-23-ladybird-rust-01.webp)

A browser engine deciding to bring Rust into a C++ codebase isn’t news anymore.
What *is* still interesting is **how** they do it without turning the repo into a permanent migration war.

Ladybird (the independent browser project led by Andreas Kling) just published a post about adopting Rust, and the part that made me pause wasn’t “memory safety” — it was the constraint:

- They ported large chunks of their JavaScript engine (LibJS) to Rust.
- **The Rust pipeline must produce byte-for-byte identical output** compared to the existing C++ pipeline.
- They leaned on Claude Code and OpenAI Codex heavily — but in a *human-directed* way.

That combination tells you they’re not doing the usual “rewrite for cleanliness” fantasy. They’re doing the annoying, production-shaped version.

## The part I like: compatibility first, taste later

If you’ve ever touched a mature system, you know the real problem isn’t writing new code. It’s keeping behavior stable while you replace internals.

Ladybird basically chose the most boring (and therefore safest) porting strategy:

- Start with a subsystem that’s relatively self-contained.
- Make tests the boss.
- Keep the old implementation around and verify equivalence.

Porting **lexer/parser/AST/bytecode generation** is still a big bite, but it’s a bite with a clear oracle: tests like test262, plus their own regression suite.

And their Rust code “has a strong translated-from-C++ vibe” on purpose. That’s a detail people love to mock… until they’re the ones trying to ship.

If your goal is *correctness*, you don’t start by being “idiomatic.”
You start by being identical.

## Rust as a *policy*, not a religion

They originally rejected Rust in 2024 because the web platform object model is very OOP-heavy — inheritance, GC-like lifetime assumptions, the whole 1990s vibe.
Rust doesn’t naturally fit that model.

But their 2026 position is basically:

> it’s time to make the pragmatic choice.

That’s the part that feels honest. Rust adoption here isn’t about winning a language war.
It’s about enforcing a long-term constraint: **new code should be harder to make unsafe by accident.**

Also: the ecosystem matters. Swift interop didn’t get them where they needed.
Rust has better cross-platform reality, and contributors already know it.

You can’t ignore contributor economics.

## “AI helped” is not the headline. The workflow is.

I’m allergic to the usual “we used AI to rewrite X in two weeks” posts.
This one is better because it admits the shape of the work:

- Hundreds of small prompts.
- Human decides *what* to port and *how it should look*.
- Multiple rounds of adversarial review using different models.

That’s not “AI wrote the code.”
That’s **AI as a force multiplier for a reviewer/translator who already knows what correct looks like.**

And the requirement for byte-for-byte identical output is basically a cheat code for using LLMs safely:

- You can let it translate aggressively.
- You can keep the human on *architecture + invariants*.
- You let tests and equivalence checks kill the hallucinations.

It’s the difference between:
- “make me a new thing” (dangerous)
- “make this same thing in a different syntax, and prove it” (actually workable)

## A subtle trade: translated Rust can become technical debt

The post is upfront: the Rust code isn’t idiomatic yet, and they’ll simplify after they retire the C++ pipeline.

That’s fine, but it comes with a real risk:

- If the cleanup never happens, you end up with Rust that *behaves like C++* and feels like C++ to maintain — except now you also have FFI boundaries and two toolchains.

This is where projects die slowly: not from one wrong decision, but from a decision that stays half-finished.

My guess is Ladybird knows that, and that’s why they’re being deliberate about what gets ported and in what order, with the core team coordinating.

## My takeaway

If you’re building serious software in 2026, the most valuable pattern in this story isn’t “Rust vs C++” or “Claude vs Codex.”
It’s this:

- Pick a subsystem with strong test oracles.
- Translate with brutal equivalence requirements.
- Use AI where it’s strongest (translation + mechanical work + review).
- Keep humans responsible for invariants and boundaries.

That’s not hype. That’s an engineering playbook.

And yeah, I do think this is where “AI coding” becomes real: when it’s welded to a verification pipeline and doesn’t get to freestyle.

---

**References:**
- [Ladybird’s announcement: adopting Rust with help from AI](https://ladybird.org/posts/adopting-rust/)
- [LibJS Rust port pull request (so you can judge the diff yourself)](https://github.com/LadybirdBrowser/ladybird/pull/8104)
- [test262, the JavaScript conformance test suite Ladybird relies on](https://github.com/tc39/test262)
- [Anthropic documentation for Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [OpenAI Codex product page (the tool mentioned in the post)](https://openai.com/codex/)
