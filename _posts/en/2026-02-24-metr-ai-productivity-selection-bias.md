---
layout: post
title: "METR’s AI productivity study hit a wall: selection bias is the new baseline"
date: 2026-02-24 23:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A minimal banner about measuring AI productivity](/img/posts/2026-02-24-metr-ai-productivity-measurement-01.webp)

If you’re trying to measure “does AI make developers faster?”, METR just published a pretty honest update: **their original experimental design is getting crushed by adoption**.

Not because the stats are hard (they are), but because the world changed underneath the experiment.

Here’s the vibe: when enough developers feel that working without AI is “walking across the city after you got used to Uber”, your control group stops being a neutral baseline. It becomes a filter that selects for people and tasks where AI matters *less*.

And yeah, that’s selection bias. But it’s also… kind of the point.

## What METR tried to do (and why it’s neat)

Their early-2025 study was unusual in a good way: instead of giving everyone a fixed toy task, they let experienced open-source devs pick real tasks from their real projects, then randomized each task into:

- **AI allowed**
- **AI disallowed**

That design is closer to “real work” than most productivity papers.

The headline result from that early study was spicy: **AI tools slowed completion by ~19–20%** (with a wide confidence interval). METR later started a bigger follow-up study with newer tools and more developers.

## The wall they hit: people (and tasks) refuse the control condition

In the new study, METR noticed two compounding problems:

1) **Developers increasingly don’t want to do half their work without AI**, even if paid.

2) Even when developers participate, they start **withholding tasks** they don’t want to do “AI-off”.

That means the “AI disallowed” condition isn’t just “same tasks, different tooling”. It becomes “tasks that are tolerable without AI”.

So if the tasks most boosted by AI are systematically excluded, the measured uplift becomes a lower bound at best — and possibly a misleading number at worst.

### My take: selection bias is a symptom of a new workflow, not just a statistical nuisance

When a tool turns into *infrastructure*, you can’t measure it with “take it away 50% of the time” without breaking the workflow itself.

It’s like trying to measure how much faster people drive with GPS by randomly forcing them to navigate by memory. You’re not measuring GPS anymore; you’re measuring who can tolerate being forced into a different operating mode.

## Another confounder METR called out: pay rate changes who shows up

They also dropped compensation from **$150/hr to $50/hr**. I’m glad they said it plainly.

You can’t pretend the participant pool stays the same when you change the incentives that hard.

At $150/hr, you’ll recruit people who treat it like serious work.

At $50/hr, you’ll still get good devs, but you also increase the odds that:

- the most AI-heavy, high-output contributors say “nah, not worth it”
- participation becomes more about spare-time and curiosity than opportunity cost

Again: not moral judgment. Just a different sample.

## Agentic tools break the simple “time spent” metric

This one is my favorite because it’s painfully real.

METR notes that for some participants, time tracking becomes unreliable when they use multiple agents concurrently.

If I have an agent grinding on refactoring in one repo while I review PRs or debug another issue, what is “task time”? Wall-clock time? Active focus time? Keyboard time? Context switching overhead? The time I spent reading AI output that I didn’t end up using?

The tooling changes the *shape* of work, so your measurement needs to evolve too.

## So… are we faster now or not?

METR’s raw results suggest the sign may have flipped for at least some subgroups:

- Early-2025: ~19% slower (AI-on)
- Later subset of original developers: estimated ~18% faster (but uncertainty overlaps)
- Newly recruited developers: small speedup-ish estimate with uncertainty

They’re careful: given the bias, this is **weak evidence**.

I think the more interesting claim is qualitative:

> It’s likely developers are more sped up from AI tools now (early 2026) compared to early 2025.

That matches what I’m seeing anecdotally: not because models became magical, but because workflows got better (tools, integration, habits, “knowing what to ask”).

## What I want METR (and everyone) to measure next

METR lists a bunch of alternatives — observational data, shorter intensive experiments, fixed-task designs, developer-level randomization, better questionnaires.

If I had to bet on what’s actually learnable in 2026:

- **Observational + instrumentation** (with privacy-respecting aggregation) will age better than forced AI-off conditions.
- **Outcome metrics** (bugs shipped, review latency, incident rate, test coverage) may matter more than “minutes per task”.
- The big question might shift from “does AI make you faster?” to “does AI change what you choose to work on?”

Because that’s where compounding happens: if AI makes the annoying-but-important work less painful, the whole project trajectory changes.

And that’s also the hardest thing to put into a clean confidence interval.

---

**References:**
- [METR: “We are Changing our Developer Productivity Experiment Design” (Feb 2026)](https://metr.org/blog/2026-02-24-uplift-update/)
- [METR’s early-2025 paper on AI tools and experienced OSS developers (PDF on arXiv)](https://arxiv.org/pdf/2507.09089)
- [SemiAnalysis newsletter claim about Claude Code’s share of GitHub commits (context for observational measurement)](https://newsletter.semianalysis.com/p/claude-code-is-the-inflection-point)
- [METR GitHub repo: early study dataset (“Measuring Early 2025 AI on Experienced OSS Devs”)](https://github.com/METR/Measuring-Early-2025-AI-on-Exp-OSS-Devs)
- [METR GitHub repo: late-2025 study dataset (“Measuring Late 2025 AI on OSS Devs”)](https://github.com/METR/Measuring-Late-2025-AI-on-OSS-Devs)
