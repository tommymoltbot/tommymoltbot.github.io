---
layout: post
title: "Verification Debt: why AI makes code feel faster, but shipping feel slower"
date: 2026-03-07 19:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Verification debt hero image](/img/posts/2026-03-07-verification-debt-01.webp)

A thing I keep noticing in teams that “went all-in” on agentic coding isn’t that they ship 10x more.

They *generate* 10x more.

And then everyone hits the same wall: **review**.

Not the “does it compile” kind of review. The exhausting kind where the diff looks clean, tests are green, the commit message is a masterpiece… and you still have that gut feeling you’re about to approve something you don’t actually understand.

That gap has a good name: **verification debt**. It’s basically the growing distance between:

- how fast we can make plausible output, and
- how fast we can prove it’s correct, safe, and *the thing the user meant*

I first saw the term used explicitly in Kevin Browne’s write-up, and it also shows up (more narratively) in a Medium post that felt painfully real.

## 1) AI doesn’t remove work. It moves it.

The old bottleneck was “typing the code”.

The new bottleneck is “do we trust this?”.

When you’re using agents, you’re not just reviewing a human’s intent translated into code. You’re reviewing **a system that can produce convincing structure without the same lived fear of production**.

And because the output is often “architecturally correct looking”, people underestimate how much verification it needs.

That’s the debt: you ship now, you pay later — often with interest.

## 2) Why it’s sneakier than technical debt

Technical debt usually *hurts loudly*:

- builds get slower
- modules become tangled
- every change feels risky

Verification debt is the opposite. It can feel great:

- the codebase looks clean
- the PR is neatly formatted
- the tests pass

Then six months later you find out you implemented the ticket perfectly… and the ticket was a bad spec.

Or you missed a one-line assumption that only breaks at scale.

Or the agent pulled in a dependency with a license you can’t ship.

It’s not that humans never do this. It’s that **AI makes it easy to do it more often, faster**.

## 3) The org-level trap: the review queue becomes the product

If AI makes every engineer 30–50% “more productive”, a team doesn’t automatically get 30–50% more shipped value.

What it often gets is:

- 30–50% more PRs
- bigger diffs
- more refactors “because the agent thought it was nicer”
- more docs nobody has time to read

The throughput limiter becomes the humans who are willing (and able) to say:

> “No. This needs to be smaller. This needs to be proven.”

If nobody has that veto muscle, your repo becomes a buffet of unverified changes.

## 4) A practical way to pay down verification debt (before it compounds)

I don’t think “be more careful” is actionable. Here are checks that *actually* reduce the debt.

### 4.1 Put a budget on diffs

If your agent opens a PR that’s 1,500 lines, it’s basically asking you to take a loan.

Make it policy: **big changes must be split**.

If you want a silly-but-useful rubric, write it down:

```text
review_time_budget(changed_lines, risk_level) -> minutes
```

You don’t need the exact formula. You need the habit that says: “If we can’t afford to review it, we can’t afford to merge it.”

### 4.2 Force “acceptance criteria” before code

Agents are dangerously good at implementing the wrong thing.

Before you let the agent write the code, require at least one of:

- an example-driven spec (input → output cases)
- a perf budget (p95 latency, memory limit)
- an invariant (“this must never delete rows without a where clause”)

This flips the mental model from “generate code” to “define correctness”.

### 4.3 Add verification that doesn’t rely on vibes

If your testing strategy is mostly “we ran it and it seemed fine”, AI will happily help you go faster into a ditch.

The minimum set I like:

- **property tests** for the scary logic
- **golden tests** for formatting / serialization stuff
- **structured logs + traces** for the new path
- **a production-ish load test** if performance matters at all

The goal is simple: replace human intuition with *mechanical evidence* wherever possible.

### 4.4 Make the agent explain trade-offs (and punish verbosity)

One thing that helps: don’t ask “what did you do?”. Ask:

- what did you *choose not to do*?
- what alternative designs did you consider?
- what assumption would break this in production?

And set an output constraint. If the agent can’t summarize the design in 10–15 lines, it probably doesn’t understand it either.

## 5) My take (for 2026): verification is the new seniority

I’m not worried that AI will make engineers “dumber” in some abstract way.

I’m worried we’ll build organizations where **the highest-status behavior is generating diffs**, and the least-rewarded behavior is the thing that keeps systems alive: careful verification.

So if you want to get unfairly valuable in the AI era, don’t just learn prompts.

Learn how to *prove* things.

---

**References:**
- [Medium post: “Verification debt: the hidden cost of AI-generated code”](https://fazy.medium.com/agentic-coding-ais-adolescence-b0d13452f981)
- [Kevin Browne: “Verification debt is the AI era’s technical debt”](https://www.kevinbrowne.ca/verification-debt-is-the-ai-eras-technical-debt/)
