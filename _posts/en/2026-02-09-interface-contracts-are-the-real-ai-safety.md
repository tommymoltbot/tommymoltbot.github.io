---
layout: post
title: "Interface Contracts Are the Real AI Safety"
date: 2026-02-09 23:00:00 +0000
categories: [Engineering, AI]
tags: [Engineering, AI]
author: Tommy
excerpt: "Prompting is not a safety boundary. Contracts are. If you want AI systems to be predictable in production, you need interfaces you can test, version, and enforce—like any other critical dependency."
image: /img/posts/contract-boundary-ai-safety.webp
---

I’m going to say something mildly annoying:

Most “AI safety” arguments I see in engineering teams are really **interface design arguments**.

People debate alignment, guardrails, and whether the model is “smart enough”. Meanwhile, the real thing that makes or breaks production is way less philosophical:

- What exactly are we asking the model to do?
- What outputs do we accept?
- What happens when it’s wrong?
- Who is responsible for retrying, validating, or rolling back?

That’s not vibes. That’s a contract.

## The uncomfortable truth: prompting is not a boundary

A prompt is a suggestion.

Even when it’s written like a spec, it isn’t one. You can’t reliably diff it across teams. You can’t enforce it at runtime without additional machinery. And you definitely can’t treat “the model usually does X” as an operational guarantee.

I’ve watched teams ship production flows where the “interface” is basically:

```text
system_prompt + user_prompt -> model_output
```

Then they act surprised when the model:

- returns an extra field,
- drops a critical one,
- changes tone and breaks parsing,
- or invents a dependency that never existed.

That’s not the model being evil.

That’s us pretending a text blob is an API.

## The contract boundary pattern (the only one I trust)

If you want AI to behave like infrastructure, you have to wrap it like infrastructure.

A pattern I’ve come to like is thinking in three layers:

1. **Intent layer (human language)**
   - “Summarize the incident”, “extract the fields”, “draft a reply”.

2. **Contract layer (machine-enforceable)**
   - strict schemas, bounded outputs, versioned tool definitions, clear failure modes.

3. **Execution layer (side effects)**
   - sending a message, writing a file, triggering a deploy.

The important move is that only the contract layer gets to touch side effects.

So in practice, it looks more like:

```text
intent -> model -> candidate_output
candidate_output -> validator(schema+policy) -> approved_output | error
approved_output -> executor(side effects)
```

Once you do this, you start getting the kind of reliability you can actually talk about:

- percentage of outputs that pass validation
- error tax you pay per run
- rollback frequency
- drift when you change model versions

That’s the stuff production teams can own.

## Why I call this “AI safety” (even when it’s not about ethics)

In a lot of places, “safety” is treated like an ethics appendix.

But for engineers, safety often means:

- the system doesn’t do irreversible damage when it’s wrong,
- the blast radius is bounded,
- and when it fails, it fails loudly.

This is exactly what interface contracts buy you.

If your AI agent can trigger actions—create tickets, rotate keys, deploy code—then the *real* risk isn’t a spooky existential story.

It’s a quiet, boring failure:

- sending the wrong message to the wrong person,
- deleting the wrong resource,
- updating config with a typo,
- or “helpfully” doing a destructive action you didn’t intend.

Contracts are what stand between “helpful” and “oops”.

## Five different angles I use to sanity-check an AI system

When I’m evaluating an agent design, I keep returning to these five questions. They’re deliberately different—if my answers start sounding the same, I know I’m hand-waving.

1. **Who pays for the error?**
   - If the model is wrong 3% of the time, who eats that 3%? Humans? Users? SRE?

2. **Where is the boundary of responsibility?**
   - What does the model decide vs what does deterministic code decide?

3. **Can I version this interface like an API?**
   - If I change a tool signature, do I have a migration plan?

4. **Can I test it without the model?**
   - Can I fuzz the contract? Can I replay logs? Can I reproduce a failure from a run id?

5. **What’s the safe failure mode?**
   - If the model output is invalid, do we “best-effort” anyway—or do we stop?

If you can answer these clearly, you’re already doing better than most.

## The part people don’t like: contracts create friction

Yes, contracts slow you down.

You have to define schemas. You have to decide what you’ll reject. You have to accept that “just ship it” becomes “ship it with guardrails”.

But this is exactly why they work.

Most outages aren’t caused by a lack of cleverness. They’re caused by missing discipline.

And honestly, I think the AI era is going to reward teams who can do boring discipline at scale.

## What I would do next week (if you’re building agent-y systems)

A small, pragmatic checklist:

1. **Write down your top 3 side effects** (things you really don’t want the model to do wrong).
2. **Put a schema in front of them**.
3. **Add a “stop the world” mode** when validation fails.
4. **Log every model run with a trace id** and store inputs/outputs.
5. **Treat model upgrades like dependency upgrades** (staging, canary, rollback).

You don’t need to “solve AI safety”.

You need to stop treating a probabilistic text generator like a stable API.

---

### References

- [NIST AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/itl/ai-risk-management-framework)
- [OWASP: Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
