---
layout: post
title: "Brendan Gregg joined OpenAI: the most interesting part is the problem he chose"
date: 2026-02-07 04:02:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Brendan Gregg joined OpenAI](/img/posts/2026-02-07-brendan-gregg-joined-openai-01.webp)

I’ve read a lot of “I joined X” posts over the years.
Most of them are either: *career narrative*, *PR*, or *a polite farewell tour*.

Brendan Gregg’s post about joining OpenAI doesn’t read like that.
It reads like someone looked at a single, brutally hard constraint and said:

> “That one. I want to work on **that**.”

The constraint is simple to describe, annoying to solve, and expensive if you get it wrong:
**the cost of AI datacenters is exploding**, and performance engineering is suddenly not just “nice” — it’s *a lever on physics, money, and power bills*.

## 1) Performance is now a product feature *and* an ethics decision

If you’ve ever fought a latency regression, you know the dynamic:
- People celebrate new features.
- Nobody celebrates the engineer who made it 20% cheaper to run.

AI flips that. At this scale, “20% cheaper” is:
- more users you can serve,
- more runway for a product team,
- and, honestly, less electricity wasted on dumb inefficiencies.

So when he says the goal is cost reduction at extreme scale, I read it as:

```text
perf win -> (lower cost, lower latency) -> higher adoption without burning the planet faster
```

That’s not virtue signaling. That’s just the math finally becoming visible.

## 2) The hairdresser anecdote is the real market signal

He describes talking to a hairdresser who casually says she uses ChatGPT “all the time”, and then lists a bunch of *human* use cases:
- feeling connected to a friend traveling,
- planning things asynchronously,
- using memory like it’s talking to someone local.

As a technical person, I usually dismiss anecdotes.
But this one matters because it answers the boring question engineers often underestimate:

**Is anyone actually using it — like, outside our bubble?**

Apparently yes.
And not for “write a function”, but for “help me feel less alone about a thing I’m worried about”.
That’s sticky.

## 3) The most telling line: “do anything, do it at scale, do it today”

This is the part that made me a little jealous.
In mature infra orgs, you’ll hear:
- “that’s too risky”,
- “we can’t change that component”,
- “it’s owned by another team”.

He’s describing the opposite: a place where the constraint is so urgent that *the org grants permission to move*.

That is rare.
And it’s why performance people can look like magicians in the right environment.

## 4) What I hope this means (as an engineer who likes boring reliability)

If OpenAI keeps scaling, performance work can’t just be hero debugging.
It has to become:
- measurement that everyone trusts,
- regression prevention (not regression heroics),
- and “cost visibility” that product teams actually feel.

In other words: *the boring stuff that makes the exciting stuff sustainable.*

I’m not reading this as “OpenAI hired a famous person.”
I’m reading it as: **the industry is finally taking performance seriously again, because it has to.**

---

**References:**
- [Brendan Gregg: Why I joined OpenAI (datacenter performance at extreme scale)](https://www.brendangregg.com/blog/2026-02-07/why-i-joined-openai.html)
