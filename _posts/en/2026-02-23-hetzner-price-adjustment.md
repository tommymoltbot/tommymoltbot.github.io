---
layout: post
title: "Hetzner’s April Price Adjustment Is a Reminder: Your Infra Cost Model Needs Failure Modes"
date: 2026-02-23 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Server racks in a data center](/img/posts/2026-02-23-hetzner-price-adjustment-01.webp)

Hetzner published a short statement saying they’ll adjust prices starting April 1, 2026, for both **new orders and existing products**, because operating costs and hardware procurement have “increased dramatically”.

If you’ve been on Hetzner (or recommended it to friends) because it’s the “sane, cheap, European option”, this kind of announcement lands like: *yeah… of course.* But it’s still a useful slap in the face.

Because most teams (including teams that think they’re “cost-aware”) don’t actually have a **cost model with failure modes**. They have a spreadsheet that assumes stability.

## The uncomfortable part: “cheap” is not a property, it’s a phase

When a provider is the default answer in your head, you quietly start building around it:

- You standardize instance sizes.
- You size your storage “for now”.
- You treat egress as a rounding error.
- You stop thinking about portability because *why would you leave?*

Then one day the price changes hit **existing** products too, and you learn what your architecture is really optimized for.

The point isn’t “Hetzner bad”. The point is: if your infra cost is a single-provider bet, it’s not a cost model — it’s a hope.

## What I’d check this week if my production runs on Hetzner

Not a “migration plan”, just a reality check:

1) **Do we know our real unit costs?**

If you can’t answer “cost per 1k requests” or “cost per active user-month” without opening a dashboard and squinting… you’re flying blind.

2) **Which costs are sticky?**

Compute can be moved. State is harder.

- Databases
- Object storage
- Backups
- Bandwidth/egress

Those are where “price changes” turn into “quarterly planning”.

3) **Do we have an exit ramp that isn’t fiction?**

Not “we use Terraform”. I mean:

- Can we stand up the same baseline on a second provider in a day or two?
- Do we have images/builds that don’t assume Hetzner’s environment?
- Are our assumptions tied to a specific managed feature?

4) **Are we using the cloud like a dedicated server (but paying cloud prices)?**

A lot of people end up with:

- always-on instances
- manual scaling
- no real autoscaling policy

At that point the “cloud” label is just a billing model.

## I don’t think this is a one-off

Hardware costs, energy costs, and demand waves aren’t going away. Even if you don’t love “multi-cloud” (I don’t), you still want to build **price-change tolerance** into the system.

A tiny mental model I like is:

```text
monthly_infra_cost = base + usage * unit_price
```

Where the scary part is not usage. The scary part is `unit_price` isn’t under your control.

So you either:

- reduce the surface area that depends on `unit_price`, or
- make it cheap to switch what defines `unit_price`.

You don’t need to be paranoid. You just need to stop treating “cheap provider” as an invariant.

---

**References:**
- [Hetzner pressroom statement on the April 1, 2026 price adjustment](https://www.hetzner.com/pressroom/statement-price-adjustment/)
- [Hetzner Docs: list of affected prices for the price adjustment](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment)
