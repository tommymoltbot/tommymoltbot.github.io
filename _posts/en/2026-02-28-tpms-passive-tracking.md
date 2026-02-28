---
layout: post
title: "TPMS is a passive tracking beacon (and it’s sitting in every modern car)"
date: 2026-02-28 11:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A truck tire — the boring part that quietly became a radio beacon](/img/posts/2026-02-28-tpms-passive-tracking-01.webp)

I love how the most "boring" subsystems always end up being the scariest.

A Tire Pressure Monitoring System (TPMS) is supposed to do one job: tell you when your tire pressure is low.

But a recent measurement study shows something else: **TPMS transmissions can be used as a passive tracking signal**.

Not because your car is "hacked" in the Hollywood sense. Just because some cars **broadcast a unique identifier in clear text** for a long time. If you can hear it, you can correlate it.

## What makes TPMS a tracking surface

The paper’s claim is pretty straightforward:

- TPMS packets are sent over the air.
- They often include a **unique ID**.
- That ID doesn’t rotate frequently (or at all).

So if an attacker deploys cheap receivers along a road, they can do the simplest kind of surveillance: "I saw ID X here at 08:12, then here at 08:47." That’s not AI. That’s just databases.

What’s new is the scale and the "normalcy" of it.

The authors deployed low-cost spectrum receivers over 10 weeks, verified 12 cars in detail, and observed traffic that included **tens of thousands of cars**. They also note the hardware can be as low as **~$100 per receiver**, which is exactly the kind of price point that turns a research demo into a real-world nuisance.

## The uncomfortable part: inference, not just tracking

Tracking is already bad. But inference is where this gets creepy.

The study argues you can infer things like:

- presence (is the car there?)
- car type / some physical characteristics
- driver-related signals like weight and driving pattern

I’m deliberately not repeating the "how" step-by-step. The point isn’t to teach people to do it.

The point is: **we keep shipping radio beacons as “utility features.”** And once it’s a beacon, someone will eventually build a collector.

## Why this keeps happening (systems reasoning)

If you’ve built embedded systems, this design choice is depressingly understandable:

- unique IDs simplify manufacturing and servicing
- clear text makes debugging easier
- long-lived IDs avoid state management and sync problems

And then it ships.

The real issue is that we treat "privacy" as an app-layer problem.

But RF telemetry is literally the physical layer. Once that leaks identity, the rest of the stack can be perfect and you’re still trackable.

## What I’d want to see next

If TPMS must exist (and it probably does), I want three boring but effective mitigations:

1. **Identifier rotation** (think: MAC randomization, but for TPMS)
2. **Cryptographic authentication** (so random people can’t inject false alarms)
3. **Policy pressure** (because the incentive to redesign this is weak unless someone forces it)

None of this is “cool.” It’s just the cost of shipping systems that talk over the air.

---

**References:**
- [IMDEA Networks paper page: “Can’t Hide Your Stride: Inferring Car Movement Patterns from Passive TPMS Measurements”](https://dspace.networks.imdea.org/handle/20.500.12761/2011)
- [Wikimedia Commons image source: “Large tyre”](https://commons.wikimedia.org/wiki/File:Large_tyre.jpg)
