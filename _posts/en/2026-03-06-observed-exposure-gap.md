---
layout: post
title: "AI Can Do More Than It Does: The \"Observed Exposure\" Gap in Anthropic’s Labor Study"
date: 2026-03-06 12:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Observed exposure vs theoretical capability](/img/posts/2026-03-06-anthropic-observed-exposure.webp)

Everyone keeps arguing about whether AI will “take jobs”. I’m more interested in a quieter question:

If LLMs *can* theoretically do a ton of work, why aren’t we seeing that show up as real usage yet?

Anthropic dropped a labor-market paper that tries to quantify that gap with a metric they call **observed exposure**: not “what models could do in principle”, but “what people are actually doing with Claude in work contexts”, with extra weight for more automated usage patterns.

That framing is… annoyingly useful.

## The part most people skip: capability ≠ adoption

A lot of job-impact takes implicitly assume:

- new capability appears
- companies instantly deploy it
- workers instantly change what they do
- the labor market instantly reacts

In reality, there’s a big chunk in the middle where things are *possible* but not yet *happening*.

Anthropic basically splits the world into two layers:

- **Theoretical capability** (task-level “could an LLM speed this up?”)
- **Observed exposure** (task-level “are we seeing work-related, automated-ish usage for this?”)

Their headline is that **AI is still far from its theoretical ceiling**. Even in categories where LLMs look broadly capable, actual work usage covers a much smaller slice of tasks.

I don’t find that surprising. I find it clarifying.

Because “AI will replace X% of jobs” is a useless statement if you don’t also say *how quickly the red area grows into the blue area*.

## Why the gap exists (and why it’s not just “people are slow”)

When I map this to how software teams actually behave, the gap isn’t one problem. It’s a stack:

1) **Tooling friction**
   - The model can do the task, but the workflow sucks.
   - You need data access, permissions, internal context, exports, reviews.

2) **Liability and compliance**
   - “The model can draft it” is not the same as “we can ship it”.
   - Anything touching regulated data gets slowed down by default.

3) **Verification tax**
   - The more the output matters, the more you pay to verify it.
   - The verification cost often eats the speedup.

4) **Integration depth**
   - Real displacement tends to require automation.
   - Copy/paste into a chat box is augmentation; wiring it into systems is where headcount changes get real.

If you’ve ever watched a company try to automate “simple” back-office work, you know the vibe: the task is conceptually easy, but the boundary conditions are endless.

## What this means for engineers (and for managers trying to be clever)

This paper indirectly rewards a very specific kind of engineering:

- turning “prompting” into **reliable pipelines**
- turning “LLM output” into **auditable artifacts**
- turning “AI can do it” into **AI does it, every time, with guardrails**

If you’re a manager hunting for the biggest ROI, the point isn’t “which job is exposed”. It’s:

- which workflow can you make **boring** enough to automate?
- where can you reduce the verification tax?
- what data access can you legitimately unlock?

If you’re an engineer, this is basically a job description:

- evals
- monitoring
- rollback
- data contracts
- model routing
- permissions

The “agentic era” isn’t magic. It’s ops.

## The early evidence is almost disappointingly calm

Anthropic reports two things that feel contradictory but aren’t:

- Highly exposed occupations are projected (by BLS) to grow a bit less through 2034.
- But since late 2022, they don’t see a systematic jump in unemployment for highly exposed workers (yet).

That’s consistent with the gap story.

If adoption is still “fraction of what’s feasible”, you shouldn’t expect a clean unemployment signal to pop out of the noise immediately. The labor market is a messy dataset.

Also, even if AI nukes a set of tasks, jobs don’t disappear one-to-one. Sometimes the job just gets reshaped, or the throughput expands, or the work moves upstream.

## My takeaway: track the *bridge*, not the *hype*

If you want a metric worth watching, **observed exposure** is closer to the thing that matters than raw capability.

Capability answers: “Can the model do it?”

Observed exposure forces the more annoying question: “Are we *actually deploying* it into work?”

And if we’re being honest, most orgs are still in the stage where the hard part isn’t the model.

It’s the messy human systems around it.

---

**References:**
- [Anthropic research: “Labor market impacts of AI: A new measure and early evidence”](https://www.anthropic.com/research/labor-market-impacts)
- [Appendix PDF with methodology details (Anthropic CDN)](https://cdn.sanity.io/files/4zrzovbb/website/e5f77fc0e77c0185110b5e4b909602791ae76eae.pdf)
- [Anthropic Economic Index (usage-based context for their exposure measure)](https://www.anthropic.com/economic-index)
- [O*NET occupational database (task-level structure used in many exposure studies)](https://www.onetcenter.org/database.html)
- [BLS occupational employment projections data portal](https://data.bls.gov/projections/occupationProj)
