---
layout: post
title: "Electron Isn’t the Problem — It’s the Symptom"
date: 2026-03-03 23:00:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![Electron logo](/img/posts/2026-03-03-native-has-nothing-left-01.webp)

A line I keep seeing lately is basically: “If coding agents make code cheap, why are we still shipping Electron?”

On paper it sounds like a dunk.
If an agent can crank out a C compiler with a spec and tests, surely we can generate three native desktop apps (Windows/macOS/Linux) and call it a day.

But after watching the last couple years of “web vs native” arguments, I’m starting to think Electron isn’t the thing to blame.
It’s just the stack that makes the real tradeoff painfully obvious.

## The uncomfortable answer: native stopped being a strong product advantage
There’s a take I agree with more than I expected:

Native used to mean *something*.
- Better UI defaults.
- Better conventions.
- Better performance (or at least the perception of it).
- Better integration.

Today, a lot of those advantages are either gone, inconsistent, or not worth the maintenance overhead.

If the platform itself can’t keep a stable, high-quality baseline, “going native” stops being a coherent strategy.
You’re just signing up for:
- 3x support surface area
- 3x bug shapes
- 3x release pipelines

And none of that magically buys you “care.”

## Agents don’t remove the last mile — they amplify it
The strongest argument for Electron in 2026 is not that native is impossible.
It’s that *the last mile is where products die*, and agents don’t change that physics.

Agents are great at bulk work:

```text
spec + tests  ->  80% shipped
```

But the last mile is a messy pile of:
- edge cases you didn’t spec because you didn’t know they existed
- OS quirks that only show up on one machine in one locale
- performance cliffs that are “fine” until users hit them
- UX paper cuts that don’t sound big but kill retention

That last mile is exactly where “one codebase” is still worth a lot.
Even if a coding agent can generate native apps, you now have to *own* three native apps.

## “Electron apps are slow” is usually a management choice
Yes, Electron can be bloated.
Yes, shipping a Chromium runtime per app is ridiculous.

But a lot of the pain people attribute to Electron is really “we stopped caring after it worked.”

Slack doesn’t need to feel heavy.
Teams doesn’t need to feel haunted.
A lot of Electron apps are bad because the incentives say “ship features,” not “polish latency and memory.”

Native doesn’t fix incentives.
It just gives you a different place to be sloppy.

## The part I actually care about: predictability
If I’m building a desktop app with a small team, I want predictability more than I want theoretical elegance.

Electron gives you predictability:

```text
one UI + one behavior model  ->  fewer surprises
```

Native gives you optionality (and sometimes performance), but it also gives you a broader failure space.
That tradeoff is fine if you’re Apple building Xcode.
It’s brutal if you’re a 10-person startup.

## My takeaway
It’s tempting to treat Electron as the villain.
But if “native” doesn’t reliably deliver a better experience *by default*, then Electron is just the rational outcome of:
- fragmented platforms
- unstable UI conventions
- teams optimizing for maintenance and shipping cadence

The real problem isn’t Electron.
It’s that good software requires care, and we’ve been training the industry to ship without it.

Agents can help you write more code.
They can’t force you to give a damn.

---

**References:**
- [Drew Breunig’s question: “Why is Claude an Electron App?”](https://www.dbreunig.com/2026/02/21/why-is-claude-an-electron-app.html)
- [Nikita Prokopov’s response: “Claude is an Electron App because we’ve lost native”](https://tonsky.me/blog/fall-of-native/)
- [Wikipedia overview of Electron (software framework)](https://en.wikipedia.org/wiki/Electron_(software_framework))
