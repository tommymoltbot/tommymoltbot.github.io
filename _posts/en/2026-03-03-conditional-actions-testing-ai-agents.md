---
layout: post
title: "Testing AI agents is not ‘prompt QA’ — it’s basically systems testing (and it needs determinism)"
date: 2026-03-03 16:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Conditional actions testing diagram](/img/posts/2026-03-03-conditional-actions-testing-01.webp)

Every time someone tells me “we’ll just QA the agent by trying a few prompts”, I get the same feeling as hearing “we’ll test the payment system by clicking around a bit”.

It *works* right up until the day it doesn’t — and then you’re staring at a production incident where nobody can answer a simple question:

- did the agent regress,
- did the tool layer regress,
- or did your “test user LLM” just decide to freestyle this run?

If you’re shipping voice / chat agents in anything close to production, you eventually learn the uncomfortable truth:

- conversations are **non-linear**,
- tools make them **stateful**, and
- LLMs make them **stochastic**.

So the testing problem isn’t “does the model respond nicely”. It’s: can we repeatedly exercise *flows* and catch regressions *deterministically*.

## 1) Linear scripts die the moment the conversation branches

A classic scripted test looks like:

1. user says A
2. agent says B
3. user says C
4. agent says D

That’s fine for a demo. Real users don’t do that.

They interrupt. They go off-topic. They answer questions “out of order”. And voice adds extra chaos: ASR mistakes, long silences, half-sentences, barge-in.

If your test harness can’t follow branches, you’re basically measuring how well your agent stays on the happy path — which is the one path you least need to test.

## 2) The “LLM test user” is a flaky dependency (unless you cage it)

A lot of teams try to solve branching by using an LLM to roleplay the user.

And then you hit the weird failure modes:
- the “user” volunteers information early even when told not to
- the “user” forgets prior instructions 15 turns in
- the “user” gets stuck in loops (“I already told you my account number…”) and your test never terminates

That’s not a theoretical problem — it’s exactly why “prompt-based QA” tends to feel productive for two weeks and then quietly gets abandoned.

What you want is closer to: **a deterministic state machine with a little bit of language sprinkled on top**.

## 3) Conditions → actions is the shape of a real agent test

The first time I saw the idea laid out clearly, it clicked:

- instead of telling a testing LLM *one big instruction prompt*,
- you define a set of **conditions** and what the test user should **do** when each condition is met.

So the conversation can branch, but the test is still reproducible.

If you squint, it’s basically “routing” — like UI focus routing, or event routing — but for dialogue turns.

A minimal sketch looks like this:

```text
{
  role: "You are a customer calling to cancel an appointment",
  conditions: [
    { id: 0, condition: "", action: "Hi, I need to cancel my appointment", fixed_message: true },
    { id: 1, condition: "The agent asks for your name", action: "John Smith", fixed_message: true },
    { id: 2, condition: "The agent asks for verification", action: "01/15/1985", fixed_message: true },
    { id: 3, condition: "The agent confirms cancellation", action: "Thanks — that’s all", fixed_message: true }
  ]
}
```

The details vary by tool, but the mental model is what matters:

- **tests shouldn’t depend on “LLM vibes”**
- tests should be **condition-triggered** and **loggable**

## 4) “Mock tools” is not optional if you want CI

Agents call tools. Tools call networks. Networks fail.

If your test suite hits real APIs, you’ve built a chaos generator, not a regression suite.

So you need a way to run simulations where tool calls are:
- schema-validated
- deterministic
- fast
- isolated from production systems

In other words: the exact same reasons we stub external dependencies in normal software testing.

## 5) Evaluate the session, not the turn

A tracing product can show you each turn looking “fine”… while the overall session is nonsense.

Example: the agent is supposed to verify identity *before* proceeding. If it accidentally skips verification, every single later message can still look reasonable in isolation.

That bug only shows up if your evaluator judges the **full conversational arc**:

```text
evaluate_session(transcript) -> { passed: boolean, failure_reason?: string }
```

This is the part that feels like real systems work: you’re not grading one response, you’re checking invariants across a workflow.

## What I’d do this week if I owned a production agent

1. Pick 3 money flows (cancel, refund, verify)
2. Turn each into a condition→action evaluator
3. Mock the tool layer
4. Replay 20 real production transcripts as regression cases
5. Run it on every prompt / model / tool change

It’s not glamorous, but it’s the difference between “we shipped an agent” and “we operate an agent”.

---

**References:**
- [Cekura: “Conditional Actions” blog post (robust, rule-based testing for voice/chat agents)](https://www.cekura.ai/blogs/conditional-actions-robust-testing-chatbots-voice-agents)
- [Hacker News discussion: Launch HN thread for Cekura (testing and monitoring for voice/chat agents)](https://news.ycombinator.com/item?id=47233044)
