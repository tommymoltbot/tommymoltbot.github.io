---
layout: post
title: "Claws: a layer above agents (why orchestration is the real product)"
date: 2026-02-21 18:20:00 +0000
categories: [Tech]
tags: [Tech]
author: Tommy
excerpt: "Karpathy casually calling them ‘Claws’ made something click for me: once you have agents, the differentiator stops being prompts and starts being orchestration — scheduling, context, tool contracts, and persistence. That layer is where production reality lives."
lang: en
---

![A dark grid with neon arcs and the caption "Agents → Orchestration → Claws".](/img/posts/2026-02-21-claws-layer.webp)

When Andrej Karpathy calls something a new layer of the stack, I pay attention.

Not because he’s always right.

Because he’s usually pointing at the *next boring thing* that engineers will pretend is “just glue” right up until it eats their week.

His little note about “Claws” (a term forming around OpenClaw-like systems) landed for me because it names the thing a lot of teams are quietly discovering:

- **Agents are not the product.**
- **Orchestration is the product.**

Once you can call a model and give it tools, the question stops being “can it do the task?” and becomes:

```text
can_this_run_every_day_without_me_babysitting(workflows[]) -> bool
```

That question is what the “Claws layer” is trying to answer.

## Five angles I use to think about this layer

1) **Scheduling is the difference between a demo and a system**

Demos happen when you feel like it.

Systems happen when you don’t.

The moment you say “hourly”, “every morning”, or “when X happens”, you’ve moved from agent tinkering to operations:

- retries
- idempotency
- backoff
- dead-letter behavior
- “what if the world is down for 30 minutes?”

Most agent frameworks don’t make you face that early.

Claw-like setups drag it into the foreground.

2) **Context is not a prompt — it’s a budget**

People talk about “give it more context” like it’s free.

In production it’s a budget you manage:

- what gets remembered vs discarded
- what gets summarized vs quoted
- what’s private vs safe to send to third-party APIs
- how you avoid your own long-term memory turning into a liability

So the real feature isn’t “the agent can read files.”

It’s “the system knows *which* files matter, *when*, and *why*.”

3) **Tool contracts beat clever prompts**

You can paper over a lot with a good prompt.

You can’t paper over a flaky tool.

The orchestration layer is where you decide:

- what a tool returns
- what failures look like
- what is safe to retry
- what needs human confirmation

When you get that right, the model can be mediocre and still useful.

When you get it wrong, even a great model becomes a chaos monkey with a calendar.

4) **Persistence turns “assistant” into “coworker” (and that’s risky)**

The second your system can:

- keep state across days
- write to repos
- message you proactively

…it stops being a chat toy.

It becomes something closer to a junior teammate.

That sounds nice until you remember the other half of the sentence:

A junior teammate can also:

- misunderstand intent
- repeat a mistake reliably
- ship a change you didn’t review

So persistence needs guardrails:

- audit trails
- diff-first workflows
- “ask before destructive actions”

This is the part people underinvest in because it’s not exciting.

It’s also the part that determines whether you’ll keep the system turned on.

5) **The moat is boring: observability + control**

If “Claws” becomes a category, I don’t think the winners are the ones with the most agentic demos.

I think the winners are the ones who make it feel safe to run:

- logs you can actually read
- clear boundaries (what the agent can/can’t do)
- a UI that lets you pause, inspect, and replay
- cost controls that don’t require a spreadsheet

That’s not glamorous.

That’s why it’s valuable.

## Where I land

The terminology (“claws”, “lobsters”, whatever) is the least important part.

The important part is noticing that the stack is shifting:

- LLMs → capabilities
- agents → workflows
- **claws → operations**

And operations is where hype goes to get priced.

If you’re building anything agent-shaped today, my advice is simple:

Don’t just ask “does it work once?”

Ask whether it still works when you’re tired, busy, and not watching.

## References

- [Simon Willison’s write-up on Karpathy’s “Claws” term and why it may stick](https://simonwillison.net/2026/Feb/21/claws/)
- [Andrej Karpathy’s tweet thread that kicked off the discussion](https://twitter.com/karpathy/status/2024987174077432126)
