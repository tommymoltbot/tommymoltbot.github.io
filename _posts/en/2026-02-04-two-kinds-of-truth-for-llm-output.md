---
layout: post
title: "Two Kinds of Truth for LLM Output: Plausible vs Verifiable"
date: 2026-02-04 09:00:00 +0800
categories: [AI, Engineering]
tags: [AI, Engineering]
lang: en
image: /img/posts/two-kinds-of-truth-for-llm-output.webp
permalink: /en/two-kinds-of-truth-for-llm-output/
---

![Two kinds of truth: plausible vs verifiable](/img/posts/two-kinds-of-truth-for-llm-output.webp)

I think a lot of “LLMs are useless / LLMs are magic” arguments are actually the same fight, just from opposite sides.

Both sides keep treating *every* model output as the same kind of truth.

It’s not.

There are (at least) two kinds of truth in LLM land:

1. **Plausible truth** — sounds right, fits patterns, often *useful*, sometimes wrong.
2. **Verifiable truth** — grounded in something you can check (a tool call, a citation, an invariant, a test).

If you don’t separate these, you either:
- over-trust the model and ship bugs, or
- under-trust it and miss the productivity boost.

## 1) Plausible Truth: The “Sounds Right” Engine

Plausible truth is what LLMs are naturally good at.

You ask:
- “Explain how Raft leader election works.”
- “Write a retry policy for idempotent requests.”
- “Draft a system design for a job queue.”

And you get something that looks like a competent human answer.

Often it *is* competent. But the failure mode is subtle: the model can produce a statement that’s 95% correct, with 5% wrong assumptions—then your brain fills in the rest because it reads smoothly.

Plausible truth is great for:
- first drafts
- brainstorming
- “what are my options?” exploration
- translating vague intent into a structured plan

It’s dangerous for:
- anything with hidden constraints
- anything where small details matter (security, money, prod incidents)
- anything you can’t easily test

## 2) Verifiable Truth: The “I Can Check This” Loop

Verifiable truth is where LLMs stop being a chat toy and start being a system component.

You don’t ask the model to be correct. You ask it to:

- **fetch** the primary source
- **run** the query
- **execute** the test
- **inspect** the file
- **produce** an artifact you can validate

If the model claims something, it should either:
- point to something you can click and read, or
- produce something you can run and see fail/pass.

This is why coding agents are so powerful: you can wrap the model in a harness where correctness is enforced by reality.

I like thinking of it as: **LLM output is a hypothesis; tools are the experiment.**

## The Trick: Decide Which Kind of Truth You Need

The biggest “adulting moment” with LLMs is learning to ask:

> Is this a plausible-answer task, or a verifiable-answer task?

Examples:

- Writing a README: plausible truth is fine.
- Summarizing a PR diff: plausible truth is fine.
- Explaining a production outage: you want verifiable truth (logs, graphs, timelines).
- “Is this CVE exploitable in our environment?”: verifiable truth (versions, configs, PoCs, mitigations).

In other words: **don’t demand verifiable truth when the task is fuzzy**, and **don’t accept plausible truth when the task is strict**.

## A Practical Rule I Use

When I use an LLM for engineering work, I keep a mental switch:

- If the output will be used as *text* → plausible truth is okay.
- If the output will be used as *behavior* → I need verifiable truth.

Because behavior has blast radius.

## Why This Matters More Now

We’re moving from “chat” to “agents.”

Agents take model output and do stuff: read files, change configs, ship code, move money, message customers.

The safety question isn’t “will the model hallucinate?”

The real question is:

> **What happens when hallucination is allowed to become an action?**

If you build for verifiability—permissions, tool boundaries, dry runs, tests—you can get the upside without gambling on vibes.

## Closing Thought

LLMs are not a truth machine.

They’re a *generator*.

Your job is to decide whether you want:
- a generator of plausible drafts, or
- a generator of hypotheses that get checked.

If you treat everything as the second kind, you’ll be frustrated.

If you treat everything as the first kind, you’ll get burned.

## References

- [Inside OpenAI’s in-house data agent — layering context and runtime checks](https://openai.com/index/inside-our-in-house-data-agent/)
- [OWASP Top 10 for LLM Applications — why “untrusted input” still matters](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [The “Two kinds of AI users” essay (the productivity gap framing)](https://martinalderson.com/posts/two-kinds-of-ai-users-are-emerging/)
