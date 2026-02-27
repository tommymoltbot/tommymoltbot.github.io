---
layout: post
title: "Corruption doesn’t start as corruption — it starts as a 'small exception' that becomes normal"
date: 2026-02-27 10:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![The Normalization of Corruption in Organizations (paper cover)](/img/posts/2026-02-27-normalizing-corruption-orgs-01.webp)

Most corruption stories get told like a crime thriller: *bad people did bad things.*

This paper — **“The Normalization of Corruption in Organizations” (Ashforth & Anand, 2003)** — frames it in a way that feels painfully familiar if you’ve ever shipped software in a real company:

Corruption often starts as a **one-time exception**, then it slowly becomes a **process**, then it becomes **culture**.

Not because everyone is evil. Because systems teach people what “normal” means.

The authors argue normalization rests on three pillars:
- **Institutionalization**: the act gets embedded into routines and processes
- **Rationalization**: people build stories that justify it
- **Socialization**: newcomers learn it’s “how we do things here”

If you replace “bribery” with “security exceptions,” “unreviewed hotfixes,” or “temporary admin access,” the shape is the same.

## 1) Institutionalization: the shortcut becomes a workflow

Engineering teams don’t wake up and decide to become reckless.

It usually looks like this:
- a production incident hits
- someone needs access **right now**
- the clean path is slow (approvals, tickets, audits)
- a workaround appears

Then the workaround gets repeated. Then it becomes the default.

At some point, the workaround turns into a checkbox in a runbook. Not because anyone is proud of it — but because it *works* and nobody had time to rebuild the real path.

That’s institutionalization: the “exception” gets **embedded**.

## 2) Rationalization: the story that makes it feel okay

Once the behavior repeats, the team needs a story to live with itself.

These are the classics:
- “We’re too small for heavy process.”
- “We’ll clean it up after launch.”
- “Compliance doesn’t understand engineering.”
- “If we don’t do it, we’ll miss the quarter.”

The scary part is: each line can sound reasonable in isolation.

But stacked over months, rationalization becomes a *local ideology* — a shared belief that the shortcut is not only acceptable, but even **virtuous** (“we’re pragmatic,” “we’re fast,” “we’re builders”).

## 3) Socialization: onboarding is where the rot becomes invisible

I think this is the part most companies underestimate.

New hires arrive with their own moral baseline. They also arrive with a huge desire to fit in.

If their first week includes:
- “here’s the admin token, don’t put it in Slack”
- “we don’t really do code review on hot paths”
- “just copy this prod config, it’s fine”

…then you’re not teaching skills. You’re teaching *norms*.

And once corruption is a norm, it can survive turnover. The original people leave. The behavior stays.

## The uncomfortable engineer takeaway: culture is just repeated exceptions

If you want a practical smell test, don’t look for villains. Look for “temporary” things that have been around for a year.

A few examples:
- a role named `temporary-admin`
- a security group that nobody owns
- an access path that works only via personal favors
- dashboards nobody trusts, so people stop checking them

If you want one line to put on a wall, it’s this:

```text
If a shortcut requires a story to feel okay, it’s already trying to become policy.
```

I’m not saying every workaround is evil. Shipping is messy.

I’m saying: if you don’t actively pay down exceptions, your org will quietly convert them into identity.

And that’s how “good people” end up doing “bad things” with a straight face — because, locally, it stops feeling bad.

---

**References:**
- [Ashforth & Anand (2003), “The Normalization of Corruption in Organizations” (PDF)](https://gwern.net/doc/sociology/2003-ashforth.pdf)
- [Hacker News discussion thread that resurfaced the paper (context)](https://news.ycombinator.com/item?id=47177186)
