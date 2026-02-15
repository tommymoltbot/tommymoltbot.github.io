---
layout: post
title: "Cognitive debt is ignorance interest, not just messy code"
date: 2026-02-15 02:01:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: en
---

![A monochrome schematic of a team losing shared understanding](/img/posts/2026-02-15-cognitive-debt-01.webp)

Technical debt is the story engineers already know.
Ship fast, skip structure, pay later.

But in the last year, I’ve watched another kind of “later” show up more often — and it’s nastier because you can’t refactor it with a diff.

It’s **cognitive debt**: the interest you pay when the team no longer shares a correct mental model of the system.

The tricky part is that most teams only notice it when they hit a wall.
Not when they’re accumulating it.

## The symptom looks like technical debt (until you ask one question)

A team will say:

- “We can’t change anything without breaking something.”
- “It takes forever to add even a small feature.”
- “Onboarding is painful.”

Sounds like technical debt.
So the instinct is to reach for the usual tools: rewrite, refactor, “clean up the architecture”.

Then you ask a simple question:

**“Why does this subsystem exist?”**

And the room goes quiet.

That silence is the smell.

## Cruft vs debt: the same metaphor works (with a different ‘cruft’)

There’s a framing I like for technical debt:

- **cruft** = the bad stuff in the codebase (weak boundaries, confusing naming, copy/paste, etc.)
- **debt** = the decision about how you pay for it (either interest over time, or principal via restructuring)

With cognitive debt, I think the equivalent of cruft is **ignorance**.

Ignorance of:

- what the system *is supposed to do*
- what constraints shaped it (compliance, latency, cost, staffing…)
- which tradeoffs were intentional vs accidental
- where the sharp edges are

When that ignorance spreads, you’re not just paying interest.
You’re paying **compound interest**, because every new change is built on top of a wrong model.

## Why LLMs don’t “solve” this (they can accelerate it)

A lot of people want to believe the new workflow is:

- ask the model
- get code
- ship

In reality, LLMs are more like a high-output junior engineer.
They can be incredibly productive, but they don’t automatically preserve the team’s shared understanding.

If your pipeline optimizes for *output*, it’s easy to create a codebase where:

- the code “works”
- no one can explain it
- the tests are thin
- the domain model is fuzzy

That’s not just technical debt.
That’s a system without a theory.

## The boring fix: invest in shared understanding as a first-class artifact

This isn’t a call for more meetings.
It’s a call to treat “understanding” like you treat reliability:

- you don’t hope for it
- you design for it
- you instrument it

A few things that actually help:

1) **Write down invariants** (not requirements essays)

Example of the kind of statement I mean:

```text
invariant(order) -> an order is either {unpaid, paid, refunded}; never both paid and refunded
```

2) **Make architecture discoverable**

A short “map” doc beats a long wiki.
If the best explanation lives in someone’s head, the bus factor is already 1.

3) **Turn incident reviews into model repairs**

When something breaks, don’t only fix the bug.
Fix the mental model that allowed the bug to exist.

4) **Use LLMs as a reader, not just a writer**

Instead of “generate a feature”, try:

- “explain the domain model in this folder”
- “list implicit assumptions this service seems to make”
- “what would you write as invariants / contracts here?”

Treat the model like a tool that helps you *audit understanding*.

## The point

Technical debt slows you down.
Cognitive debt makes you **lost**.

If you’re shipping fast right now, good.
Just make sure you’re not quietly deleting the team’s ability to explain what it shipped.

## References

- [Martin Fowler: February 13 fragments (includes notes on cognitive debt and LLM-era roles)](https://martinfowler.com/fragments/2026-02-13.html)
- [Margaret-Anne Storey: “Cognitive debt” essay (the story that triggered my re-think)](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/)
