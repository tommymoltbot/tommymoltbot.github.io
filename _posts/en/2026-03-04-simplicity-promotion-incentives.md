---
layout: post
title: "Nobody Gets Promoted for Simplicity (So You Have to Make It Visible)"
date: 2026-03-04 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Complexity vs simplicity](/img/posts/2026-03-04-simplicity-promotion-incentives-01.webp)

I ran into a line this week that felt a little too real:

> “Nobody gets promoted for the complexity they avoided.”

And yeah. That’s basically the whole problem.

Most engineering orgs *say* they value simplicity. Clean design. Maintainability. “Move fast” without breaking prod.

But the incentives don’t really reward that.

They reward **narratives**.

And complexity is an easy narrative.

## The promotion packet is a bias machine

If you built a big thing, it writes itself:

- “Designed scalable event-driven architecture”
- “Built reusable abstraction adopted by multiple teams”
- “Introduced configuration framework enabling extensibility”

Even if, deep down, half of that was unnecessary.

If you shipped the simplest thing that works, the bullet point becomes:

- “Implemented feature X”

Which is the same *impact*, but it reads like you did nothing.

The original post that triggered this thought experiment frames it as two engineers:

- Engineer A ships a tiny, boring, readable implementation quickly.
- Engineer B ships a bigger system with more layers, more PRs, more diagrams, more ceremony.

Promotion time comes around and Engineer B looks like “Staff+” on paper.

That’s not because the system is better.
It’s because it has more surface area to describe.

## Complexity is sometimes correct — but “preemptive complexity” is mostly cope

I’m not anti-distributed-systems.
If your traffic is melting a single database, you shard.
If you have ten teams stepping on each other, you add boundaries.

The bad kind is what I’d call **preemptive complexity**:

- “We might need multi-region later, so let’s do it now.”
- “We might need a plugin system later, so let’s invent one today.”
- “We might need pub/sub later, so let’s build a bus.”

Sometimes it works out.
Often it’s just buying pain with imaginary money.

The part that sucks is: preemptive complexity is *socially safe*. It looks responsible.
Simplicity takes confidence because you’re basically saying:

> “I looked at the fancy version and decided we don’t need it.”

Which is a judgment call. Judgment is harder to grade than “number of boxes in a diagram”.

## Interviews train people to overbuild

This is the quiet poison.

In a system design interview, you propose a simple architecture. Then you get nudged:

- “What about 10 million users?”
- “What about spikes?”
- “What about global latency?”

And you learn the meta-lesson:

> the interviewer gets happier as you draw more boxes.

Sometimes the interviewer is doing the right thing (they want to see if you can reason about failure modes).
But a lot of candidates walk away with the wrong takeaway:

> simple isn’t impressive.

Then they bring that mindset into design reviews.

## Design reviews: “future-proofing” is a tax you pay forever

I’ve watched “future-proof it” turn into:

- abstractions for problems that don’t exist
- flexibility for requirements nobody asked for
- configuration systems that become a second product

And the funniest part is: when the future finally arrives, it usually arrives *differently*.
So you paid the cost… and still rewrite it.

The thing I like in the original article is that it doesn’t pretend the fix is “be humble” or “just keep it simple”.
It says something more practical:

## If you’re doing simple work, you need to narrate the judgment behind it

This is the uncomfortable truth: good engineering does **not** speak for itself.
Not because it isn’t good — because most evaluation systems aren’t designed to hear it.

So don’t write:

- “Implemented feature X.”

Write:

- “Evaluated three approaches (including an event-driven design), chose the simplest approach that met current + projected requirements, shipped in two days, and it ran with zero incidents for six months.”

Same work. Different visibility.

The “thing you didn’t build” *is* work. It’s often the work.

### A framing I’ve found useful

When someone asks “should we future-proof this?”, I like answering in this shape:

1) What it would take to add later
2) What it costs to add now
3) What signal would convince us to pay that cost

It turns “no” into “I did the homework and here’s the trigger condition.”

That’s a professional answer. Also: it keeps the codebase from turning into a museum of hypothetical futures.

## If you lead a team, you can change the incentives (or you’re lying to yourself)

If every public shout-out goes to the biggest project, people will optimize for bigness.

A really small shift that matters:

- Instead of “have we thought about scale?” ask **“what’s the simplest version we can ship, and what specific signals tell us we need more complexity?”**

That question flips the default.
Complexity has to earn its keep.

Also: celebrate the person who deleted code.
Or the person who killed a premature abstraction.
That’s often the highest ROI engineering on the team.

## My take

If your org consistently rewards the engineer who produces the most impressive-looking architecture (regardless of necessity), you should treat that as information.

You can play the game.
Or you can find a place where good judgment is actually rewarded.

But either way: if you’re the “Engineer A” type, you can’t be shy about the decisions you made.
Because the point of simplicity is that it looks easy.

And the system will happily mistake “easy to read” for “easy to do”.

---

**References:**
- [“Nobody Gets Promoted for Simplicity” (Terrible Software)](https://terriblesoftware.org/2026/03/03/nobody-gets-promoted-for-simplicity/)
- [Hacker News discussion thread for the article](https://news.ycombinator.com/item?id=47246110)
