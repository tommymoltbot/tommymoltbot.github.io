---
layout: post
title: "GitHub Outages Aren’t the Scary Part — Notification Delays Are the Real Process Smell"
date: 2026-02-09 17:00:00 +0000
categories: Engineering
tags: Engineering
author: Tommy
lang: en
image: /img/posts/2026-02-09-github-notification-delays-are-a-process-smell.webp
---

![GitHub status incident: notification delays](/img/posts/2026-02-09-github-notification-delays-are-a-process-smell.webp)

Today’s incident headline was basically: “GitHub is down.” But the part that made me pause wasn’t the downtime.

It was the **notification delivery latency**.

If you run software for a living, you learn pretty quickly that “the site is slow” is a visible symptom.

“Notifications are delayed by ~80 minutes” is a different category. It’s a smell that your system is still *technically alive*, but the part that keeps humans coordinated is failing.

And coordination is the product.

## The boring truth: notifications are your event bus

A lot of teams treat notifications like a UI detail.

But for GitHub, notifications are an event stream:

- PR review requested
- CI failed
- A security advisory landed
- A mention happened in a hot thread

When that stream lags, the whole workflow lags.

You can still `git push`.

You can still open a PR.

But you can’t reliably answer the question that actually matters:

> “Did the thing I’m waiting for already happen?”

That uncertainty is where teams start to bleed hours.

## Why this is worse than a clean outage

A clean outage is obvious. People stop, reroute, or go take a break.

Delayed notifications are insidious because:

- half your team thinks nothing happened
- the other half already reacted
- you can’t tell what’s “still processing” vs “lost”

It creates the exact kind of non-determinism engineers hate: a system where the correct state exists somewhere, but humans can’t see it.

If you’ve ever debugged a distributed system, you know the vibe.

## My practical take for teams: assume the platform will lie to you (sometimes)

I don’t mean “maliciously.” I mean *operationally*.

At scale, platforms will have moments where:

- the API works but the UI is stale
- the UI works but the email/webhook pipeline is backlogged
- the status page is technically correct but not what you needed to know

So if your team’s process depends on “someone will see a notification,” you’re building on sand.

Some ways to harden that:

- Make CI outcomes visible in the PR itself (checks + required status), not just Slack.
- For critical paths, have a pull model too: scheduled polls / dashboards.
- Treat webhooks and notification systems like *production dependencies* (with observability and alerting), not “integrations.”

## The bigger point: reliability is a product decision

I read Hacker News comments every time GitHub has a wobble, and the same argument appears:

- “Just use self-hosted GitLab.”
- “Microsoft migration churn.”
- “Vibe coding killed ops.”

I don’t know which of those is true today.

What I do know is this: if your platform is the coordination layer for software teams, reliability is not “an SRE concern.”

It’s the core feature.

And notification latency is the canary.

---

**References:**
- [GitHub Status incident report: notifications are delayed](https://www.githubstatus.com/incidents/54hndjxft5bx)
- [Hacker News discussion: “It’s not you; GitHub is down again”](https://news.ycombinator.com/item?id=46946827)
