---
layout: post
title: "You can’t ‘relicense’ a community codebase by asking an LLM to rewrite it"
date: 2026-03-05 13:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![LLM rewrite isn’t relicensing](/img/posts/2026-03-05-relicensing-ai-rewrite.webp)

I saw a spicy little thread around **chardet 7.0.0**.
The maintainers shipped a “ground-up, MIT-licensed rewrite”, and the original author showed up with the vibe of: *no, you don’t get to do that*.

If you maintain open-source libraries, this is one of those incidents where you should stop scrolling and ask yourself:

> If I asked an LLM to rewrite my LGPL/GPL project “from scratch”… do I magically own a clean MIT codebase?

No. And the reason isn’t “LLMs are evil.” It’s more boring than that: **copyright and provenance are boring, and they still apply even when your diff looks fresh.**

(Obvious disclaimer: I’m not your lawyer. I’m just the engineer who’s cleaned up enough licensing messes to get annoyed early.)

## What actually happened (in one paragraph)

In the chardet release notes, the pitch is basically:
- same package name
- same public API
- but internally rewritten
- and now it’s MIT

Then Mark Pilgrim (original author) replied in an issue saying: the maintainers have **no right to relicense** the project, and “complete rewrite” doesn’t matter if the team wasn’t doing a clean-room implementation.

That’s the entire plot.

## The part people keep getting wrong: “rewrite” vs “derivative work”

Engineers talk like code is binary:
- either you copied it
- or you didn’t

Copyright law is more annoying.
It cares about “derivative works” and “substantial similarity”, and it does *not* give you a simple checksum-based answer.

If you’ve been reading and modifying an LGPL codebase for years, and then you “rewrite it” while keeping:
- the same public API
- the same behavior
- the same detection heuristics (just reorganized)

…you’re in a danger zone. Not because you’re guilty by default, but because **it’s hard to prove it’s independent**.

And if you also bring an LLM into it, you add one more uncomfortable question:

> Was the model guided (even unintentionally) by copyrighted structure that you fed it via prompts, patches, or review comments?

That’s not a question you can hand-wave away with “but it’s new code.”

## “But we rewrote everything, so we can pick MIT now”… can you?

Here’s the practical open-source rule that matters:

- If a project has **multiple copyright holders** (which is most community projects), you generally can’t just flip the license unilaterally.
- You need either **permission from all contributors**, or you need to only ship code that you (and your contributors under an agreement) can relicense.

This is why serious projects do CLAs, copyright assignments, or very careful inbound licensing policies.
Not because they love paperwork. Because the alternative is exactly this kind of conflict.

The GNU FAQ also states the basic idea (for GPL-land): if you distribute a modified version, you must distribute it under the GPL too.
Same spirit applies to LGPL projects.

## The “clean room” bar is higher than people think

People say “clean room” like it’s a vibe. It’s not. It’s a process.

A real clean-room rewrite usually means:
- an implementation team that **did not read** the original code
- a spec written by a separate team
- disciplined separation of responsibilities, artifacts, and review

If you’re the maintainers of the old codebase, you basically fail the “I never saw the original” test on day zero.

Which is why “we rewrote it” is *not* automatically “we can relicense it.”

## My maintainer checklist (if you’re even thinking about relicensing)

If you want to move a library from copyleft to permissive (LGPL → MIT, GPL → Apache, etc.), you need to be honest about what game you’re playing:

1) **Do you control the copyrights?**
   - If not, you need contributor permission (and yes, tracking that is painful).

2) **Do you have a CLA / copyright assignment?**
   - If you don’t, start there *before* you announce anything.

3) **If you claim “ground-up rewrite”, can you back it with process?**
   - “Different variable names” isn’t a process.

4) **If you used LLMs, what’s your provenance story?**
   - What inputs were used?
   - Who reviewed outputs?
   - How do you respond if a contributor alleges non-independent derivation?

I hate that this stuff matters, but it matters.
It’s the price of being able to collaborate at scale without everyone having to trust each other personally.

---

**References:**
- [chardet 7.0.0 release notes (MIT rewrite claim, feature list)](https://github.com/chardet/chardet/releases/tag/7.0.0)
- [Mark Pilgrim’s issue: “No right to relicense this project” (original author response)](https://github.com/chardet/chardet/issues/327)
- [GNU GPL FAQ (on how modified versions must remain under the GPL when distributed)](https://www.gnu.org/licenses/gpl-faq.en.html)
- [GNU LGPL v2.1 license text (terms and definitions)](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.en.html)
