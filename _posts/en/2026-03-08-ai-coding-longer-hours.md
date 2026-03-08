---
layout: post
title: "AI coding tools don’t give you time back — they change what you spend your time on"
date: 2026-03-08 00:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Late-night coding stress](/img/posts/2026-03-08-ai-coding-longer-hours-01.webp)

My favorite lie in modern engineering is the one we tell ourselves when we adopt new tooling:

> “This will save us time.”

Sometimes it does.

But the more honest version is: **it saves time in one place and bills you somewhere else**.

A recent Scientific American piece summarized what a bunch of teams are quietly noticing: lots of developers report higher productivity with AI coding tools, and yet… *hours go up*, not down.

At first that sounds like a contradiction. Then you look at what “productive” means now, and it stops being surprising.

## 1) The bottleneck moved: from writing to verifying

If you’ve been using AI-assisted coding for real work (not demos), you already know the shape of it:

- Getting code is cheap.
- Knowing whether it’s the *right* code is expensive.

The DORA survey (nearly 5,000 tech professionals) reports that most people use AI at work, and most people *feel* more productive.
But it also shows “software delivery instability” going up with more AI usage — more rollbacks, more patches.

That’s the trade:

- you generate more changes,
- you merge more changes,
- and you also clean up more “why did this happen in prod?”

So yes, you’re “shipping” more.
You’re also *babysitting* more.

## 2) Productivity is not a personal metric anymore (it’s an expectation)

The other part is organizational, not technical.

In a world of layoffs + efficiency mandates, AI often lands as:

> “Cool, now do more.”

Scientific American points to a Harvard Business Review write-up about employees at a tech company taking on more tasks and working more hours after adopting AI — even without the company forcing it.

That part hit me because it’s very plausible:

- You prompt during lunch.
- You prompt during meetings.
- You stop having “dead time”, because now dead time can be turned into output.

The tool isn’t the manager, but it makes it easy for *you* to manage yourself harder.

## 3) More PRs, more after-hours commits: the “silent” signal

The Multitudes report (500+ developers) is a nice example of a measurement that doesn’t rely on vibes:

- merged pull requests went up
- *out-of-hours commits* went up

I don’t even need to moralize that. It’s just a smell.

If “out-of-hours commits” rise, it usually means one of two things:

1) The work expanded.
2) The boundary collapsed.

Both are compatible with “AI made me faster”.

## 4) The hidden tax: debugging becomes the skill gap

Here’s the part I’m actually worried about.

Anthropic ran an experiment where engineers working with a new library got (roughly) no meaningful speed boost with AI — and then scored worse on a quiz about the library afterward.
The biggest gap was around debugging.

That makes sense:

- AI is great at generating plausible structure.
- Debugging is where you pay for every assumption.

If your default workflow becomes:

```text
prompt -> code -> merge
```

…then your “learning loop” gets shorter and shallower.
You still get output, but you don’t get the internal model that makes you calm when production is on fire.

And in a team, someone will still need to be that calm person.

## 5) So why do hours go up?

Put those pieces together and the pattern is pretty boring:

- AI makes it easy to create more work.
- Work expands to fill the new capacity.
- Verification and coordination don’t scale as easily as code generation.
- The leftover work leaks into nights and weekends.

It’s not “AI is bad”.
It’s “we didn’t change the system around the tool.”

## A practical (non-heroic) way to stop the creep

If I had to give one boring piece of advice:

Treat AI output as **untrusted input**.

Not because it’s evil — because it’s *cheap*.
When something is cheap, you over-consume it.

Concrete practices that help without turning you into a process zombie:

- **Make diffs smaller**. If the agent wants to refactor three modules “for cleanliness”, say no.
- **Pay for tests early**. If the code was generated in 5 minutes, spend 30 minutes writing the tests that make it safe.
- **Track instability deliberately** (rollbacks, hotfix rate). If those go up, you’re not “more productive” — you just shifted cost.
- **Protect downtime**. If lunch becomes prompt-time, you didn’t gain productivity; you bought it with recovery.

I’m not anti-AI. I’m anti-fantasy.

AI can absolutely help.
But the promise isn’t “you’ll work less”.

The promise is: *you’ll spend less time typing and more time being responsible*.

---

**References:**
- [Scientific American: AI was supposed to save coders time. It may be doing the opposite](https://www.scientificamerican.com/article/why-developers-using-ai-are-working-longer-hours/)
- [Google Cloud DORA report on AI-assisted software development (survey + delivery stability)](https://cloud.google.com/resources/content/2025-dora-ai-assisted-software-development-report)
- [Harvard Business Review: AI doesn’t reduce work — it intensifies it](https://hbr.org/2026/02/ai-doesnt-reduce-work-it-intensifies-it)
- [Anthropic research: AI assistance and coding skills (debugging + learning effects)](https://www.anthropic.com/research/AI-assistance-coding-skills)
- [Multitudes whitepaper on what matters for AI rollouts (pull requests + out-of-hours commits)](https://cdn.prod.website-files.com/610c8a14b4df1ae46b1a13a3/6941b0b2e9129ebfdfa71d4f_864f3a86793178cb6d8dcc1b464038be_What%20matters%20most%20for%20AI%20rollouts%20How%20you%20lead%20-%20Multitudes%20Whitepaper.pdf)
