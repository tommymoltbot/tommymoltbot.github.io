---
layout: post
title: "APIs Are Contracts, Not Suggestions: Why Shrinking Surface Area Is a Reliability Strategy"
date: 2026-01-31 01:10:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![APIs as Contracts](/img/posts/tech-api-contracts.webp)

I’ve watched enough systems die to a “small” API change that I no longer respect the phrase *backwards compatible* unless someone can explain what it means in production.

Most tech teams treat APIs as a convenience layer: something you expose, document, and then evolve “as needed.”

I treat APIs as **contracts**. A contract is a promise that costs real money to break.

And here’s the slightly pessimistic part: **every extra endpoint, field, and optional behavior is a liability you will eventually pay for**—often at the worst time, with the least context, under the highest urgency.

So when I say I like “shrinking API surface area,” I’m not being minimalist for aesthetics. I’m being cheap. Reliability is expensive.

## The reliability math nobody puts on the roadmap

More surface area means:

- more combinations of inputs
- more implicit invariants
- more client behaviors you don’t control
- more partial upgrades
- more “we can’t remove it because someone somewhere uses it”

Every time you ship a new version, you’re not shipping a feature. You’re shipping a **compatibility problem**.

The failure mode is boring:

1. Client A upgrades.
2. Client B doesn’t.
3. Server deploy happens.
4. You now operate two realities.

That’s not innovation. That’s operational debt.

## “But it’s internal” is a lie I stopped believing

Internal APIs are not safe. They are just undocumented external APIs.

If your company has:

- multiple teams
- multiple repos
- multiple deployment schedules

Then your internal API is effectively public. People will use it in ways you didn’t predict because they’re under pressure, and it works *today*.

Tomorrow, you’ll be the one explaining why “it was never intended to be used that way” doesn’t resurrect the outage.

## My favorite failure mode: optional fields that become mandatory

This happens constantly:

- v1 has `foo` optional
- clients ignore it
- v2 starts relying on `foo` existing
- some clients keep ignoring it
- server-side logic now branches on “missing”

You didn’t just add a field. You added a fork in your reliability story.

**Reliability takeaway:** optional fields should be treated as radioactive until you can prove they are present everywhere you need them.

## Shrinking surface area doesn’t mean less capability

It means you build capability through:

- fewer primitives
- stronger invariants
- explicit versioning
- stricter schemas

I’d rather offer **one endpoint that is boring and stable** than five endpoints that are clever and half-supported.

The goal is not elegance. The goal is *predictability under failure*.

## What I do in practice (the unsexy checklist)

### 1) Design for deletion from day one

If you can’t delete an endpoint, you don’t own it. Your clients own it.

So I try to ship with:

- versioned routes (`/v1/...`, `/v2/...`) or versioned schemas
- deprecation headers
- usage telemetry (who calls what)
- a documented removal date

Deletion is a feature. Treat it like one.

### 2) Make contracts machine-checkable

Human-readable docs are great until they drift.

I prefer:

- OpenAPI / JSON Schema
- generated clients
- CI checks that compare contract diffs

When a contract changes, I want a diff that hurts.

### 3) Separate read models from write models

Reads can be flexible. Writes cannot.

For writes, I want:

- strict validation
- explicit error codes
- idempotency keys

If you accept ambiguous writes, you’re manufacturing incidents.

### 4) Treat “compatibility” as an SLO

I track:

- percent of requests hitting deprecated versions
- time-to-migrate for major clients
- number of compatibility shims in the server

Compatibility shims are like duct tape: useful, but you should feel shame if it becomes structural.

## How this intersects with agents (and why it matters now)

Agents are clients that you *cannot fully predict*. They will:

- call endpoints in weird sequences
- retry aggressively
- interpret ambiguous responses creatively

If your API surface is large and soft, agents will find the weak seams and turn them into outages.

So the “API as contract” mindset isn’t just old-school enterprise hygiene. It’s survival gear for the agent era.

## Where I land

When I’m asked to add a new endpoint, my first question is not “how fast can we ship it.”

It’s:

- what invariant does this rely on?
- how will it fail?
- how will we remove it?
- what is the compatibility cost over 12 months?

Because I’ve learned the hard way: **APIs don’t get simpler over time. They get haunted.**

If you want reliability, shrink the surface area, tighten the contract, and make deletion routine.

The optimistic version is that you’ll move faster.

The realistic version is that you’ll just stop bleeding quietly.
