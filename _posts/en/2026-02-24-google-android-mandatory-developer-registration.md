---
layout: post
title: "Google wants mandatory developer registration for Android sideloading — security argument, control-shaped outcome"
date: 2026-02-24 18:10:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![Gatekeeping and app distribution illustration](/img/posts/2026-02-24-android-dev-registration-gatekeeping-01.webp)

I read the open letter pushing back on Google’s plan to require **mandatory developer registration** for distributing Android apps *outside* the Play Store.

My first reaction was: “ok, they’re going to sell this as security.”
My second reaction (after actually reading it) was: “this is one of those changes where the *shape* of the policy matters more than the stated intent.”

Because Android’s whole deal was always: you can publish apps without going through a single corporate chokepoint.
If you move that chokepoint to “you must register with Google anyway,” you didn’t just add a safety feature — you rewired the platform.

## What Google is proposing (in plain terms)
From what the open letter describes, the proposal is basically:
- If you distribute an Android app through *any* channel outside Play (your website, a third-party store, enterprise distribution, direct sharing), you still need to register with Google.
- Registration involves agreeing to Google’s terms, paying a fee, and providing government-issued ID.

That turns “sideloading” from “user risk choice” into “developer permissioned by Google.”

If you want it as a flow, it looks like this:

```text
build APK -> register dev with Google -> get approved -> distribute outside Play
```

That’s not a small tweak. That’s a governance change.

## The security argument is real — but Android already has security primitives
I’m not going to pretend malware isn’t real. Android gets abused all the time.

But Android already has security mechanisms that don’t require central developer registration, and Google itself markets them that way — for example, Play Protect scanning apps (including apps installed from other sources).

So the question isn’t “should Android have security?” It already does.
The question is: why does the security story need *identity + fees + centralized approval* for third‑party distribution?

That’s where the policy starts to look less like “safety” and more like “we want the whole ecosystem to be legible and enforceable from one dashboard.”

## Why developers (especially small ones) should care
If you’re a big company, registration is paperwork.
If you’re:
- a solo dev shipping a niche tool,
- an open-source maintainer,
- a volunteer doing a humanitarian app,
- someone in a region where ID verification is risky or hard,

…then registration isn’t “just security.” It’s friction, surveillance, and a single point of failure.

And the single-point-of-failure part is the most underrated:
- If Google can approve, it can also revoke.
- If it can revoke, it can effectively deplatform you across *all* Android certified devices, not just Play.

Even if you trust today’s intent, you’re betting on tomorrow’s enforcement.

## The part that smells like competition policy
The open letter also calls out something I think is obvious but rarely said cleanly:
If one company becomes the registry for all Android developers — including those who don’t use its store — it gains visibility into what’s being built, who’s building it, and how it’s being distributed.

That’s not just a security lever. That’s market intelligence.

## My take
I’m generally fine with *stronger verification for Play Store distribution*.
But “verify everyone who wants to distribute anywhere” is a different beast.

If Google wants to reduce abuse, the honest path is to invest in on-device scanning, better warnings, better provenance signals, and better recovery flows.

Mandatory global registration feels like taking Android’s open model, then stapling a gate on top.
And gates have a way of getting taller over time.

---

**References:**
- [Open letter: opposition to mandatory developer registration for non-Play Android distribution](https://keepandroidopen.org/open-letter/)
- [Google Play Protect overview (how Google scans apps, including from other sources)](https://support.google.com/googleplay/answer/2812853?hl=en)
