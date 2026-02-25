---
layout: post
title: "METR's AI productivity study hit a wall — and the wall is 'people won't turn AI off'"
date: 2026-02-25 05:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![METR and the uncomfortable math of selection bias](/img/posts/2026-02-25-metr-productivity-selection-bias-01.webp)

METR published an update to their developer productivity experiment (the one that famously found AI tools slowed experienced open-source developers down in early 2025).

The headline this time isn’t “AI helps” or “AI hurts”. It’s more awkward:

**their original experimental design is getting harder to run because developers increasingly refuse to work without AI.**

And honestly, that’s one of the most “real world” signals you can get.

Five thoughts that felt worth writing down.

## Thought #1: selection bias is not a footnote — it becomes the result

The whole study design relies on randomizing tasks into “AI allowed” vs “AI disallowed”, then comparing time-to-complete.

That only works if people will actually submit tasks into the lottery.

If the developers who believe AI gives them the biggest uplift opt out (or avoid submitting certain tasks), you’re no longer measuring “AI impact”. You’re measuring “AI impact on the subset of work people are willing to do without AI.”

That might still be interesting, but it’s not the question everyone thinks you’re answering.

## Thought #2: “I won’t do this without AI” is itself a productivity datapoint

METR quotes participants who basically say:
- they don’t want to do ~50% of their work without AI
- they avoid tasks that would feel painful without AI

That reads like compliance pain, but it also reads like **workflow migration**.

When a tool becomes part of the muscle memory, asking someone to stop using it isn’t a neutral intervention. It’s like asking a backend engineer to ship without logs.

So, ironically, the fact that the study is breaking might be evidence that AI tools have crossed a threshold where they’re no longer “optional speed boosts” — they’re “how I work”.

## Thought #3: once agents go parallel, “time spent” stops meaning one thing

One detail I appreciated: METR explicitly calls out that time measurement becomes unreliable when developers use multiple agentic tools concurrently.

If you kick off an agent run, then context-switch to a different task while it works, what is the “time to complete” for the original task?

- Wall-clock time includes waiting (and maybe includes time you weren’t even thinking about it).
- Focus time ignores the reality that the agent is doing work in the background.

This isn’t just a measurement bug. It’s a reminder that **agents change the unit of work**. We might need metrics that look more like throughput and quality over a week, not “task took X hours”.

## Thought #4: pay rate changes who shows up — and that changes everything

They reduced pay from $150/hr to $50/hr in the later study.

I’m not moralizing it; budgets are budgets.

But it matters because it changes:
- who is willing to participate
- which projects they’re working on
- how much they treat the study as “serious work” vs “side work”

If you’ve ever run user studies, you know incentives don’t just change volume — they change behavior.

## Thought #5: for teams, the most practical takeaway is: stop asking “does AI speed us up?”

The METR update basically screams a more useful question:

**What work do we do differently once AI is always-on, and what new risks does that create?**

Because “speed” isn’t the whole story:
- Do we substitute toward tasks where AI is strong?
- Do we ship more, but with more subtle bugs?
- Do we pay down less tech debt because it feels cheaper to build new stuff?
- Do we get better docs/tests because the agent makes it easy, or worse because no one reads what it writes?

My bias: the early-2025 slowdown result was never the final word. It was a snapshot of a weird moment where tools were powerful enough to distract you, but not reliable enough to delegate.

Now the tools are moving toward delegation.

The “hard part” for 2026 isn’t proving uplift. It’s building measurement that doesn’t collapse under changing human behavior.

---

**References:**
- [METR blog update on changing their developer productivity experiment design](https://metr.org/blog/2026-02-24-uplift-update/)
- [METR early-2025 paper (PDF) referenced in the update](https://arxiv.org/pdf/2507.09089)
