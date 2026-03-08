---
layout: post
title: "AI was supposed to save engineers time. Instead it’s moving the work"
date: 2026-03-08 01:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![AI shifts the bottleneck from typing to verification](/img/posts/2026-03-08-ai-longer-hours.webp)

I keep seeing the same pattern in teams that adopt AI coding tools: the *typing* gets faster, but the day doesn’t get shorter.

What happens is more annoying than that. The work moves.

The Scientific American piece on this captured the vibe well: yes, people feel more productive, but the hours creep upward and the “after we shipped” work gets louder. That matches what the DORA folks have been warning about too: when output goes up, *delivery instability* can go up with it.

Here are five genuinely different angles that explain why.

## 1) The bottleneck isn’t writing code. It’s deciding whether you can trust it
AI makes it cheap to produce *plausible* patches.

But production engineering is mostly about answering questions like:

```text
is_this_change_safe(change) -> confidence
```

Confidence comes from tests, reviews, observability, rollback plans, and “did we understand the system boundary conditions.” None of that is automated just because code generation got cheaper.

So you don’t remove work—you move it from *creation* to *verification*.

## 2) Speed increases the blast radius when your process is still tuned for slower change
If you can ship 2× more changes, you’re also giving yourself 2× more chances to:
- miss an edge case
- violate an implicit contract
- accidentally depend on a behavior that was never guaranteed

DORA’s phrasing (“software delivery instability”) is polite.
Engineers experience it as: more rollbacks, more hotfixes, more “why is this pager going off on a Tuesday night?”

This is one of the more brutal parts of the AI era: a team can *feel* faster while becoming *operationally noisier*.

## 3) Management hears “80% productivity gain” and translates it into “we can cut the buffer”
The article points out the obvious context: layoffs + efficiency mandates. When headcount is already tight, AI adoption often becomes a multiplier on expectations.

So even if AI legitimately saves you time on some tasks, the organization may immediately spend those savings on:
- more features
- more experiments
- more deadlines that used to be “nice to have”

This is why “AI will reduce work hours” always sounded naïve to me.
Tools don’t negotiate your workload.

## 4) AI can reduce *learning*, which creates hidden time debt
The Scientific American piece cites Anthropic’s study: in at least one setup, AI assistance didn’t meaningfully speed engineers up, but it did reduce how well they learned a new library—especially around debugging.

That’s a nasty trade:
- today: you complete the task
- next month: you have to touch the same area again, but you *never built the mental model*

And debugging without a mental model is where time goes to die.

## 5) It changes collaboration patterns in a way that feels good… until integration
One subtle point I liked from the reporting: if AI lets you “do it yourself,” you may interact less with other humans.

Sometimes that’s fine.
But the cost can show up later as:
- less shared context
- less review-as-mentoring
- more mismatched assumptions across services/modules

Integration is where individual speed goes to get taxed.

## My take: treat AI output like an untrusted input stream
If you want AI to *actually* shorten the day, you need to invest in the parts that turn code into reliable change:
- tighter acceptance criteria (define “done” before the model starts typing)
- fast, trustworthy tests (especially contract tests)
- a workflow where “verification” is a first-class step, not an afterthought
- metrics that catch the spillover (rollbacks, hotfixes, out-of-hours commits)

Because in the end, there are only two modes:
- you shift work into verification deliberately
- or the work shifts into nights and weekends by force

---

**References:**
- [Scientific American: AI was supposed to save coders time. It may be doing the opposite](https://www.scientificamerican.com/article/why-developers-using-ai-are-working-longer-hours/)
- [Google Cloud DORA report on AI-assisted software development (2025)](https://cloud.google.com/resources/content/2025-dora-ai-assisted-software-development-report)
- [Harvard Business Review: AI doesn’t reduce work—it intensifies it (Feb 2026)](https://hbr.org/2026/02/ai-doesnt-reduce-work-it-intensifies-it)
- [Multitudes whitepaper on AI rollouts and engineering outcomes (PDF)](https://cdn.prod.website-files.com/610c8a14b4df1ae46b1a13a3/6941b0b2e9129ebfdfa71d4f_864f3a86793178cb6d8dcc1b464038be_What%20matters%20most%20for%20AI%20rollouts%20How%20you%20lead%20-%20Multitudes%20Whitepaper.pdf)
- [Anthropic research: AI assistance and coding skills (learning + debugging effects)](https://www.anthropic.com/research/AI-assistance-coding-skills)
- [Hacker News discussion thread that surfaced the article (community takes)](https://news.ycombinator.com/item?id=47292574)
