---
layout: post
title: "When ‘safely’ disappears, it becomes law"
date: 2026-02-15 16:05:00 +0000
categories: [AI]
tags: [AI]
author: Tommy
lang: en
---

![A redacted legal document with one word crossed out: safely](/img/posts/2026-02-15-safely-disappears-01.webp)

I’ve noticed a pattern in how engineers talk about AI safety.

If it sounds like product marketing, we roll our eyes.
If it sounds like policy, we stop listening.

But there’s a third place safety shows up — and it’s the one that actually matters when incentives get messy:
**paperwork.**

Simon Willison did a small-but-deadly piece of archaeology: he pulled the mission statement line from OpenAI’s IRS filings over time.
Not the homepage. Not a keynote.
The sentence that gets printed on a tax form.

The part that stuck with people is simple:

- In 2022, the mission statement used the word **“safely.”**
- In 2024, it didn’t.

A lot of takes immediately jumped to “they stopped caring about safety.”

I don’t think you can conclude that from one deleted word.

But I *do* think you can conclude something more useful:

**When safety language moves around in legal-ish documents, it stops being an engineering promise and becomes a governance posture.**

And governance posture is the thing that shows up later as:

- what gets defended in court
- what gets framed as “reasonable” risk
- what the org thinks it can get away with
- what gets traded off quietly when revenue pressure hits

## 1) Safety isn’t a feature — it’s a claim you might have to cash

In engineering, a “promise” is a contract.
Not in the legal sense — in the API sense.

You don’t write an API like:

```text
process_payment(amount) -> result  # probably safe
```

You write something you can be held to.
Idempotency rules. Retry semantics. Failure modes.

Safety is similar.
If you put “safely” in a mission statement on a tax filing, it’s not vibes.
It’s a statement that someone, somewhere, might cite back at you later.

Deleting that word doesn’t prove you became reckless.
But it does reduce one surface area where you can be evaluated.

And that’s the thing engineers should pay attention to:
**not morality, but incentives and accountability.**

## 2) “Benefits humanity” is a weaker constraint than it looks

This is the subtle trick of mission statements.

“Benefits humanity” is infinitely interpretable.
Almost any capability story can be framed as a future benefit.

“Safely benefits humanity” is still vague — but it smuggles in one extra requirement:

```text
benefit + constraints -> acceptable
```

That word forces you to at least pretend you have constraints.
It invites questions about evaluation, oversight, and harm.

When the word disappears, the default pressure of the world takes over:

```text
capability() -> launch
safety() -> later
```

## 3) The practical takeaway: watch what becomes *auditable*

I don’t think the main story here is OpenAI.
The story is the meta:

**the parts of “safety” that survive are the parts that are auditable.**

If you’re building AI systems in production, you’ll recognize the same dynamic inside companies:

- If it’s measured, it stays.
- If it’s only “principles,” it gets negotiated away.

So the question I’d ask any AI team (including mine) is not “do you care about safety?”

It’s:

- what do you log?
- what can you roll back?
- what is the blast radius?
- what is the *default* when a model is uncertain?
- who is on the hook when it goes wrong?

That’s safety — the kind that survives budget meetings.

## 4) My slightly cynical rule

When a company changes one word in a public mission, I assume they did it for one of two reasons:

1) they want flexibility later, or
2) they don’t want to be pinned down.

Those reasons aren’t evil.
They’re just… real.

And if you’re an engineer building on top of these platforms, “real” is the level you should operate at.

Not outrage.
Not hero worship.

Just: **where do incentives point when nobody’s watching?**

## References

- [The evolution of OpenAI’s mission statement (Simon Willison)](https://simonwillison.net/2026/Feb/13/openai-mission-statement/)
- [OpenAI’s filings on ProPublica Nonprofit Explorer](https://projects.propublica.org/nonprofits/organizations/810861541)
