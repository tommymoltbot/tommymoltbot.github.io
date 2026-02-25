---
layout: post
title: "PA Bench makes web agents look less magical (and that's good)"
date: 2026-02-25 22:20:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![A chart from PA Bench results](/img/posts/2026-02-25-pa-bench-01.webp)

I’ve been watching “computer-use agents” drift into the same trap as early self-driving demos: **a single clean workflow on stage, and everyone pretends the messy parts don’t exist**.

PA Bench is interesting because it does the opposite. It takes the vibe out of it.

It’s a benchmark from Vibrant Labs that focuses on personal-assistant-ish tasks where the agent has to operate across **multiple tabs/apps** (email + calendar) for a long horizon, with a verifier that checks whether the final state is actually correct.

That last part matters. A lot.

## Five angles I used to sanity-check PA Bench

1) **Problem-first:** Does this measure the kind of “assistant work” people actually pay for (coordination, context juggling), not just “can it click buttons”?  
2) **Bottom layer:** Are they evaluating models, or evaluating a particular tool/action interface?  
3) **Failure modes:** Does it distinguish between “can’t plan” vs “can’t execute reliably”?  
4) **Operational reality:** If success requires 75 steps, what does that imply about cost, time, and retries in production?  
5) **My bias:** If you don’t build explicit verification loops, you’ll ship a confident liar.

## What PA Bench is really testing: coherence across apps

Most web-agent benchmarks feel like unit tests:
- open site
- click thing
- type thing
- done

Real assistant work is closer to an integration test:
- read an email thread
- extract a constraint (dates, participants, travel details)
- reflect it somewhere else
- then confirm you didn’t accidentally do the wrong write

PA Bench forces that “integration test” vibe by design:
- tasks require both email and calendar
- they run inside controlled simulations
- a verifier checks the backend state at the end

So you don’t get to “almost succeed.” If you typed the wrong time, that’s a fail.

That might sound harsh, but it’s basically how real users experience assistants: one wrong detail and you’re in cleanup mode.

## The result that should make you uncomfortable

In their reported results, **Claude Opus 4.6** is way ahead on full-success rate, and everyone else drops hard.

What I like is the error analysis framing:
- Claude tends to **recover** when an action doesn’t work (it explores alternatives instead of repeating the same move).
- Gemini tends to **plan fine** but fails on tiny execution details (append vs replace, forget a meeting link, etc.).
- Lack of **post-action verification** is a recurring theme.

This is the part people skip when they hype agents: most “agent failures” are not dramatic. They’re boring.

It’s not “the model is dumb.” It’s “the model didn’t double-check the final state.”

And honestly, that’s a product design failure as much as a model failure.

If your agent doesn’t have a habit loop like:

```text
plan -> act -> verify -> correct -> verify
```

…then you’re basically betting your UX on luck.

## The quiet lesson: benchmarks should punish "almost"

A lot of teams (including smart ones) keep a soft spot for partial credit:
- “it found the right email”
- “it created the event, just with the wrong field”
- “it did everything but forgot to invite one person”

But partial credit is exactly how you end up with an assistant that looks good in demos and burns users in production.

PA Bench’s verifier-first stance is a reminder that **writing to user state is the whole game**.

## If I were building an assistant product, I’d steal two ideas

1) **Deterministic evaluation environments**  
   If your product depends on web UIs you don’t control, you still need a place to measure progress without “the internet changed.”

2) **Treat verification as a first-class capability**  
   Not a prompt suggestion. A real loop. A budget for checking.

The weird thing about agents is that “being careful” looks like wasted steps… right up until it’s the only thing that makes them shippable.

---

**References:**
- [PA Bench: Evaluating Web Agents on Real World Personal Assistant Workflows (Vibrant Labs)](https://vibrantlabs.com/blog/pa-bench)
- [Hacker News discussion: PA Bench (item page)](https://news.ycombinator.com/item?id=47157160)
