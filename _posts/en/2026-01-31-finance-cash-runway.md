---
layout: post
title: "Cash Runway Is a Reliability Problem: I Manage Liquidity Like an SRE"
date: 2026-01-31 01:20:00
categories: Finance
tags: Finance
author: Tommy
lang: en
---

![Cash Runway and Liquidity](/img/posts/finance-cash-runway.webp)

I’ve seen teams with great products die because they ran out of cash *while everything still looked fine on paper*.

So I’ve started thinking about liquidity the way I think about reliability: not as an abstract metric, but as **the ability to survive ugly reality without doing something desperate**.

If you’re a founder, a manager, or honestly just a person with a salary, liquidity is your uptime.

And the failure modes are painfully predictable.

## Liquidity vs solvency: the outage you don’t get to rollback

People love to argue about solvency. “Are we profitable?” “Is the balance sheet healthy?”

In practice, you usually die from liquidity.

- Solvency is *eventual*.
- Liquidity is *now*.

You can be solvent and still miss payroll.

That’s why I treat cash like an error budget: you don’t notice you’re spending it until suddenly you’re out.

## The hidden coupling: fixed costs are your tightest dependency

In systems, the tightest dependency is the one with:

- zero slack
- long recovery time
- cascading effects

In finance, that’s your fixed costs:

- rent
- salaries
- debt service
- vendor minimums

Variable costs can be trimmed. Fixed costs are what force panic decisions.

**My rule:** If your fixed cost base is heavy, you don’t have a strategy. You have a timer.

## Failure mode #1: “we’ll raise later”

This is the liquidity version of “we’ll add monitoring later.”

It feels fine until:

- the market turns
- the term sheet stalls
- due diligence drags
- your runway hits the cliff

Then you do the worst thing: you raise money when you *need* it.

In reliability, we call that incident response. It’s expensive and humiliating.

## Failure mode #2: revenue that is real… but late

I’ve watched teams with “booked revenue” collapse because cash collection lagged.

If your customers pay net-60 and you pay salaries net-0, you’ve built a liquidity gap.

That gap is a failure domain.

**Reliability framing:** receivables are a queue. If the queue grows and you can’t drain it fast enough, you will OOM.

## Failure mode #3: optimistically linear forecasting

The spreadsheet assumes growth is smooth.

Reality is bursty:

- sales cycles slip
- churn spikes
- one enterprise customer pauses
- regulators change the rules

I’m not saying forecasts are useless. I’m saying if your plan only works under linear assumptions, it’s not a plan. It’s a story.

## What I do instead: engineer runway with constraints

### 1) Define a “cash SLO”

I want a minimum runway target that is not negotiable. Example:

- 12 months runway at current burn
- 18 months runway if revenue drops 20%

If you can’t survive those scenarios, you’re running hot without admitting it.

### 2) Add circuit breakers

In systems, circuit breakers stop the bleeding.

In finance, I pre-define triggers:

- if cash < X → freeze hiring
- if revenue < Y for 2 months → cut discretionary spend
- if AR days > Z → switch to upfront / shorter terms

The point is to avoid debates during the incident.

### 3) De-risk one dependency at a time

A business has dependencies too:

- one big customer
- one distribution channel
- one cloud vendor
- one marketing platform

If you’re coupled to one of these, your liquidity is fragile.

I prefer boring redundancy: two revenue channels, more customers, multiple acquisition paths.

### 4) Treat “optional” costs like optional features

If a cost is truly optional, you should be able to stop it without breaking the company.

If you can’t, it wasn’t optional. It was a hidden fixed cost.

## Where I land

I’m not a doomer about finance. I just don’t romanticize it.

Liquidity is a reliability property. Runway is your error budget. Fixed costs are tight dependencies. Collection delay is queueing theory.

When I design a system, I ask: “what happens under partial failure?”

When I design a budget, I ask the same thing.

Because the only thing worse than being wrong is being wrong *without enough cash to stay alive long enough to correct yourself*.
