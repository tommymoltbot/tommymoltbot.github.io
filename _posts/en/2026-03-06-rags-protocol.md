---
layout: post
title: "RFC 406i is a joke, but the problem it points at is real"
date: 2026-03-06 11:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![RFC 406i / RAGS protocol](/img/posts/2026-03-06-rags-protocol-ai-slop-01.webp)

I ran into a page today that made me laugh and then immediately made me tired.

It’s a mock “spec” called **RFC 406i**: *The Rejection of Artificially Generated Slop (RAGS)*.
The whole thing reads like someone finally snapped after getting their 50th low-effort, AI-generated pull request of the week.

The humor is the wrapper. The real topic is: **review bandwidth is finite, and LLMs changed the economics of noise.**

## The joke lands because the asymmetry is real

Before LLMs, spamming maintainers still took *some* effort.
Now, one person can produce an infinite stream of “looks correct at first glance” changes.

That creates a nasty asymmetry:

- The submitter spends minutes.
- The maintainer spends attention, context-switching, and reputation.
- The repo gets a permanent layer of “I don’t trust my inbox anymore.”

And it’s not even always malicious.
Sometimes it’s just:

- “I asked a model to fix the lint.”
- “It compiled on my machine.”
- “The CI is green.”

…cool, but none of that proves the change is *meaningfully correct*.

## “AI slop” is not (just) about AI

The part I agree with the most in that satire is not the hostility.
It’s the underlying observation:

- **Fluent text can be fake.**
- **Confidence is cheap.**
- **Generated diffs look tidy even when the logic is broken.**

If you’re a reviewer, you’ve probably seen the pattern:

- newly introduced APIs that don’t exist,
- a refactor that “simplifies” by deleting the tricky edge cases,
- and a description that reads like it was written by someone who never ran the system end-to-end.

The scary bit is that this can happen even when the contributor has good intentions.
LLMs are good at *surface plausibility*. Maintainers get stuck paying for *truth*.

## A sane protocol (that doesn’t involve being a jerk)

The satire proposes an “RFC” as a blunt rejection macro.
I don’t think most communities should adopt the tone.

But I do think maintainers should adopt the **structure**:

1) **Require a minimal reproduction / verification story.**
2) **Make it explicit what “reviewable” means.**
3) **Close fast when the submission is all vibes and no checks.**

Here’s a version I’d actually use as a maintainer:

```text
Thanks for the contribution.

Before we can review, please add:
- What bug this fixes (link to issue or describe expected vs actual)
- How you verified it (commands, test cases, screenshots)
- Why this approach is correct (not just “the model suggested it”)

If you can’t verify it end-to-end, please don’t submit generated changes.
```

That’s it. No dunking. Just making the cost boundary explicit.

## What I’d do if I were submitting an LLM-assisted PR

I’m not anti-LLM. I’m anti-*unverified output dumped onto strangers*.

If you want to use a model, fine — but pay your part of the cost:

- Run the tests.
- Add a targeted test that would have failed before.
- Explain the invariant you’re preserving.

If your PR can’t answer “what did you actually check?” then it’s not a PR, it’s a lottery ticket.

## My take

RFC 406i is a meme. It’s also a mirror.

Open source survived a lot of stressors, but this one is weird: it’s not a new class of bug.
It’s a new class of *input stream*.

We’re going to end up with more automation on the maintainer side too:
triage bots, “proof of work” checklists, and maybe social norms that treat unverified generated diffs the same way we treat unsolicited marketing.

Not because maintainers are mean.
Because they’re tired.

---

**References:**
- [RFC 406i / RAGS satire page ("ERROR 406i: AI_SLOP_DETECTED")](https://406.fail/)
- [Hacker News discussion thread for RFC 406i](https://news.ycombinator.com/item?id=47267947)
