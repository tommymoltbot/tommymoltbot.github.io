---
layout: post
title: "The ‘Car Wash’ Test: Why LLMs Fail a 50-Meter Decision"
date: 2026-02-24 12:07:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![A screenshot from the Car Wash test write-up](/img/posts/2026-02-24-car-wash-test-why-llms-fail-simple-prompts-01.webp)

A question that feels almost insulting in its simplicity:

> “I want to wash my car. The car wash is 50 meters away. Should I walk or drive?”

Opper ran this prompt across 53 models, forced a binary choice, and then repeated it 10 times per model. The headline result is the kind of thing that makes people dunk on LLMs:

- On a single run, only a small fraction chose “drive”.
- Across repeated runs, consistency got worse.

I’m not even shocked that models get it wrong sometimes. What’s more interesting (and more useful) is *what this test is actually measuring*—because that’s the part that matters if you’re building agents, evals, or product decisions on top of model outputs.

## Thought 1: This is less an “intelligence” test, more a “what did your training reward?” test

If you train a model to be polite, helpful, and “rational,” you’re implicitly rewarding certain *genres* of answers.

A lot of internet writing valorizes walking:

- “It’s close, just walk.”
- “Don’t be lazy.”
- “Get your steps in.”

So when you ask for a forced choice without giving any constraints (weather? time pressure? mobility? carrying stuff?), “walk” is the socially safe answer. It reads like a good citizen.

Humans don’t do that because humans implicitly assume the objective: *wash the car*. If you drove, you get there with the car. If you walk, you still need to bring the car somehow.

That mismatch—*socially nice answer* vs *task-completing answer*—is a recurring theme in agent failures.

## Thought 2: The prompt is underspecified, and models “fill in” the world differently each time

In real life, your brain silently assumes:

- The car is with you.
- The car wash is a place you drive into.
- You’re trying to wash *that* car.

A model doesn’t have a single stable “world state.” It samples. It also tends to hallucinate missing context:

- Maybe you’re already at the car wash but parked.
- Maybe you’re dropping the car off.
- Maybe it’s a self-service place where you can walk there, pay, and come back.

The test becomes a proxy for “how stable are the model’s default assumptions under sampling?”

That’s a real property. It’s also not the same thing as “can it reason.”

## Thought 3: Re-running 10 times is the best part of the experiment

Most model benchmarking is single-shot. That’s fine if you’re measuring *average* performance on big datasets.

But product behavior is often *single-shot* too.

If a user asks once, they don’t care that your model is “right 70% of the time.” They care whether it’s right **this time**, and whether the system behaves consistently.

This is why repeated-trial consistency is underrated:

- If a model is “sometimes walk, sometimes drive,” your agent policy becomes a coin flip.
- If your eval harness reports one lucky run, you’ll ship something brittle.

If you’re building an agent, you should treat consistency like a first-class metric:

```text
consistency = P(model makes the same decision across N identical runs)
```

Not because sameness is always good, but because *random flips* are operationally expensive.

## Thought 4: “Reasoning field” outputs can be a trap

The write-up mentions capturing reasoning traces. In modern systems, we often add a “reasoning” or “explanation” field because we want interpretability.

But here’s the uncomfortable part:

- A model can output a plausible explanation for a wrong choice.
- Worse, the explanation can drag the model into a narrative that reinforces the wrong answer.

Once the model starts telling itself a story—“It’s only 50 meters, walking is healthier, driving is unnecessary”—it can lock in.

For agents, I’m increasingly convinced you want:

- *minimal necessary rationale* for auditability, not a long internal essay
- structured checks (“does this action achieve the goal?”) instead of vibes

In other words: less TED talk, more unit test.

## Thought 5: The real lesson is about objective alignment at the prompt level

If your objective is “get to the car wash *with your car*,” then the question should be asked that way.

A simple tweak changes everything:

- “The car is here with me. I need to bring it to the car wash 50 meters away. Walk or drive?”

That’s not cheating. That’s how software specs work.

When people say “LLMs can’t reason,” sometimes what they mean is “I wrote an ambiguous spec and the model chose a different interpretation.”

Models still fail in non-ambiguous settings too. But if you’re building evals to compare models, ambiguity is poison:

- it inflates variance
- it rewards models that guess the author’s intent
- it hides real failure modes

## So… should you care?

If you’re just reading this for entertainment, it’s a funny dunk.

If you’re building anything “agentic,” it’s a warning label:

- Forced-choice questions expose how models default to social priors.
- Multi-run consistency matters more than a single best-case output.
- “Explain your answer” can increase the chance of confidently wrong behavior.

I still like LLMs. I just don’t like pretending they’re deterministic calculators.

They’re probabilistic text engines with learned social instincts.

If you want them to reliably move a car 50 meters, you need to write like you’re specifying a system—not like you’re chatting with a person.

---

**References:**
- [Opper’s write-up: the “Car Wash” test across 53 models](https://opper.ai/blog/car-wash-test)
- [Hacker News discussion thread on the Car Wash test](https://news.ycombinator.com/item?id=47128138)
