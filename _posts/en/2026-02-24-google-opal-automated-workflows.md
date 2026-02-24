---
layout: post
title: "Google Opal is turning vibe coding into workflow orchestration — and that’s when it gets real"
date: 2026-02-24 21:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Google Opal automated workflow agent banner](/img/posts/2026-02-24-google-opal-automated-workflows-01.webp)

I’m a little allergic to the term “vibe coding.”
Not because it’s useless — it’s because it’s *seductive*.
It makes building software feel like ordering food.

But Google’s Opal update is interesting precisely because it’s no longer just “make a tiny app with prompts.”
It’s edging toward **workflow orchestration**: an agent that plans steps, chooses tools, and keeps state.
That’s the shape of something that eventually wanders into real work.

According to TechCrunch, Opal’s new agent uses Gemini 3 Flash, can pick tools automatically, and can even use Google Sheets as a memory store across sessions (think: a shopping list that persists). It’s also “natively interactive,” meaning it asks follow-up questions when it gets stuck.

If you’ve built anything production-ish, you probably feel the same knee-jerk reaction I did:
*okay, where are the boundaries?*

## Five different thoughts I had (and they’re not the same thought)

### 1) The business wedge is obvious: apps that are really just “automations with UI”
A lot of internal tools aren’t “software products.” They’re:
- a form
- a few validation rules
- some data lookups
- and a bunch of “then do X, then do Y”

Opal is trying to turn that into a single surface.
Not a dev environment — a **business workflow builder** that happens to speak natural language.

### 2) Technically, “agent + state + tools” is the whole game
The moment you add:
- a planner (decide next step)
- tool calls (act in the world)
- and memory (don’t reset every run)

you’ve crossed into the category that actually matters.

At that point, the implicit API is basically:

```text
run_workflow(prompt, tools, memory_store) -> outcome
```

And once that exists, the real questions aren’t about the prompt.
They’re about *tool permissions* and *data flow*.

### 3) This is Zapier/IFTTT’s world, but with fuzzier edges
We’ve had workflow tools for ages.
The difference is that old-school automations force you to be explicit:
- pick the trigger
- pick the action
- map the fields

Agentic workflow tools try to do the mapping for you.
That removes friction — and also removes the moment where a human normally notices:
“wait, why does this step need access to that data?”

### 4) The production problem: observability beats cleverness
If Opal wants to be more than demos, it needs boring stuff:
- audit logs (“what ran, with what inputs, when?”)
- deterministic-ish replays (“can I reproduce this failure?”)
- permission boundaries (“this workflow can read Sheets but not email”) 
- budget constraints (rate limits, timeouts, spend caps)

Agentic systems fail in messy ways.
If the platform can’t show you *where* it went off the rails, teams won’t trust it.

### 5) My personal take: I’ll use it for prototypes, but I won’t call it software yet
I’m not anti-agent.
I’m anti **unbounded agent**.

The biggest risk with “vibe coding → workflow orchestration” is that the UI makes it feel safe.
But the actual system you’re deploying is a little automation robot with:
- access
- persistence
- and the ability to take steps you didn’t enumerate

So yeah, this is a real step forward for Opal.
It’s also the moment where I start asking for guardrails, not features.

---

**References:**
- [TechCrunch report: Opal adds an agent for automated workflows](https://techcrunch.com/2026/02/24/google-adds-a-way-to-create-automated-workflows-to-opal/)
- [TechCrunch background: Google’s early Opal vibe-coding test](https://techcrunch.com/2025/07/25/google-is-testing-a-vibe-coding-app-called-opal/)
- [TechCrunch update: Opal comes to the Gemini web app](https://techcrunch.com/2025/12/17/googles-vibe-coding-tool-opal-comes-to-gemini/)
