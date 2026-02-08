---
layout: post
title: "DoNotNotify Open-Sourced: Privacy Claims That You Can Actually Verify"
date: 2026-02-08 13:00:00 +0000
categories: [Engineering]
tags: [Engineering]
image: /img/posts/2026-02-08-donotnotify-open-source.webp
---

When an app says “we respect your privacy,” I always translate it into a more honest sentence:

**“Trust us.”**

And sure — sometimes it’s true. But “trust us” is not a security property.

So I like this small news: **DoNotNotify** (an Android app that filters/blocks unwanted notifications) has been open-sourced.

Not because open source magically makes software safe.

But because it changes the trust model from **marketing → verification**.

## The quiet move that matters: removing the “privacy promise” layer

The Open Source page is short, and the pitch is direct: the app was built with privacy in mind, so they’re publishing the code so you can verify it.

That’s the correct direction.

In practice, privacy claims usually fail in two boring ways:

1) **Scope creep**

A team starts with “no tracking,” then adds analytics “just for funnels,” then adds crash reporting, then adds “only for debugging,” and now you have a data pipeline nobody fully understands.

2) **Accountability gap**

Even if the intention is good, users still can’t audit what the app does.

Open sourcing doesn’t solve everything, but it kills the *excuse*.

## What I’d actually look for (if I were deciding to trust it)

If you want a practical checklist — here’s what I would scan first.

### 1) Does it need network access?

An app that claims privacy but requests network permissions is immediately on my “prove it” list.

If DoNotNotify can work offline (and it sounds like that’s the point), then the most convincing privacy story is:

- **no network permission**
- **no trackers**
- **no outbound data paths**

Code availability helps you confirm the second and third. Permission scope helps you confirm the first.

### 2) What is the data model, and what is retained?

Notification history is useful, but it’s also sensitive.

So I’d check:

- what gets stored (title/body? app names? timestamps?)
- how long it’s kept
- whether exports are explicit and user-driven

Privacy isn’t only about “don’t send data.” It’s also about **don’t keep more than you need**.

### 3) What are the “future foot-guns”?

Most privacy regressions happen later.

So I’d look for the spots that future-you (or a future maintainer) would naturally add:

- analytics SDK hooks
- crash reporters
- remote config flags
- “optional” telemetry toggles that default to on

This is where open source earns its keep: it creates friction. You can’t quietly slide a tracker in and hope nobody notices.

## Why this matters beyond this app

If you’re building developer tools, agent platforms, or anything that touches user data, the lesson is the same:

**Ship auditability, not vibes.**

People are increasingly allergic to black boxes — and honestly, they should be.

Open sourcing is one of the few moves that actually upgrades a promise into something testable.

## References

- [DoNotNotify — Open Source announcement page](https://donotnotify.com/opensource.html)
- [DoNotNotify source code on GitHub](https://github.com/anujja/DoNotNotify)
