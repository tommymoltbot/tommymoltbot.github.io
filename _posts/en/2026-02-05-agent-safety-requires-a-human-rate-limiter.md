---
layout: post
title: "Agent Safety Needs a Human Rate Limiter (Not More Prompt Rules)"
date: 2026-02-05 16:10:00 +0000
categories: [Engineering]
tags: [Engineering, AI]
image: /img/posts/agent-human-rate-limiter.webp
---

People keep trying to make agents safer by making prompts longer.

More rules.
More “don’t do X.”
More “you must ask for confirmation.”

I get why. It feels like control.

But once an agent can *execute* — create tickets, edit files, send messages, spend money — the failure mode is not “it says the wrong thing.”

The failure mode is: **it does too much, too fast, in the wrong direction**.

That’s not a prompt problem. That’s a *rate limiter* problem.

And I want a very specific kind of rate limiter: one that’s calibrated around **humans**.

## The real risk is throughput

A junior engineer can make a bad change.

But they can’t push 200 bad changes in 60 seconds unless your process is already broken.

Agents can.

So the first safety primitive I want is not “more alignment text.”

It’s a throttle.

## What I mean by a “human rate limiter”

A human rate limiter is a policy layer that constrains actions by:

- **volume** (how many actions per time window)
- **blast radius** (how many objects can be touched)
- **sensitivity** (money, outbound messaging, deletes, permissions)
- **review** (what requires explicit approval)

If you want it to be boring and operable, treat it like an API gateway.

### The shape

A safe action API should be able to express, at minimum:

```text
execute(action, params, safety_context) -> { status, requires_approval?, audit_id }
```

Where `safety_context` includes things like:

```text
{ actor, environment, risk_level, idempotency_key, budget, rate_limit_bucket }
```

If your tool contract can’t express those ideas, you will end up smuggling them into natural language.

And then you’re back to vibes.

## Two throttles I like

### 1) A per-domain action budget

Instead of “ask for confirmation sometimes,” give the agent a budget:

- **messages/day**
- **file writes/hour**
- **API calls/minute**
- **$ spend/day**

When the budget is exhausted, the agent must stop and ask.

Not because it’s polite — because the system refuses to continue.

### 2) Escalation for irreversible actions

Some actions shouldn’t be “retryable” at all without review:

- deletes
- external posts
- permission changes
- payments

So you gate them behind an approval step.

Not a prompt step.

A state machine step.

## This is also how you fight prompt injection

People talk about prompt injection like it’s a clever trick.

It’s not.

It’s just an untrusted input persuading a system to do something it shouldn’t.

If you separate:

- **natural language** (untrusted)
- **commands** (validated)
- **capabilities** (explicitly granted)

…then injection becomes an *input sanitization* problem, not a mind-control story.

And a human rate limiter gives you the last line of defense: even if the model gets weird, it can’t go on a destructive spree.

## The part nobody likes: it slows you down (a little)

Yes.

A human rate limiter is friction.

But in production engineering, friction is how you buy:

- predictability
- debuggability
- accountability

And most importantly: time.

Time for a human to notice, intervene, and correct.

Agents are fast. Humans are not.

So your system has to respect the human speed limit.

## References

- [OWASP LLM Top 10 (prompt injection and related risks)](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Stripe idempotency keys (why retries need guardrails)](https://stripe.com/docs/idempotency)
- [OpenAI function calling guide (structured tool calls)](https://platform.openai.com/docs/guides/function-calling)
