---
layout: post
title: "Chaos Testing for Data Pipelines: The Failure Modes I Pay For Up Front"
date: 2026-01-31 01:30:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Chaos Testing for Pipelines](/img/posts/engineering-chaos-pipeline.webp)

I used to think “data pipeline reliability” was mainly about uptime.

Then I got burned by the real failure mode: the pipeline ran, dashboards updated, and everyone felt good—while the data was quietly wrong.

That’s when I started treating pipelines like distributed systems that deserve the same discipline we give to production services:

- explicit contracts
- chaos testing
- blast radius control
- evidence-based debugging

This is the half-pessimistic practitioner view: assume it will fail in boring ways, then make those failures cheap.

## Why pipelines fail differently than services

A service failing is loud:

- 500s spike
- latency blows up
- alerts fire

A pipeline failing is often polite:

- it completes
- it emits outputs
- it just *lies*

The “lie” can come from:

- partial backfills
- silent truncation
- schema drift
- timezone bugs
- duplicated rows
- missing partitions
- late-arriving events

If you only monitor success/failure, you’re monitoring the wrong thing.

## My core rule: validate invariants, not jobs

I don’t care that the job succeeded. I care that the output matches invariants:

- row counts within expected bounds
- null rates stable
- key uniqueness preserved
- referential integrity
- freshness (event time vs processing time)

When invariants fail, the pipeline is down—even if the scheduler says green.

## The chaos tests I actually run

Chaos testing isn’t only “kill the node.” For pipelines, it’s more specific.

### 1) Drop a partition

Simulate a missing day/hour partition and confirm:

- downstream jobs fail fast
- retries don’t loop forever
- alerts tell you *which partition* is missing

### 2) Duplicate ingestion

Send the same batch twice and confirm:

- idempotency holds
- dedupe keys work
- aggregates don’t double

### 3) Schema drift

Rename a field, change a type, or add a nested object.

Your system should:

- reject incompatible writes
- version schemas
- keep old readers working intentionally

### 4) Late events

Inject late-arriving events and confirm:

- windows recompute correctly
- backfill logic doesn’t corrupt history
- “freshness” metrics expose the lag

### 5) Partial failure in a fan-out

If one downstream sink fails (warehouse, lake, search index), confirm:

- you don’t mark the run as successful
- you have a compensating action
- you can replay only the failed sink

## The operational patterns that saved me the most pain

### Make backfills a product feature

Backfills are where pipelines go to die.

I want backfills to be:

- scripted
- reviewable
- rate-limited
- observable

If a backfill is a one-off notebook, it’s not a backfill. It’s an incident waiting to happen.

### Keep a ledger of side effects

If you write to multiple sinks, track per-sink commits.

When something fails, I want to answer:

- what wrote successfully?
- what is safe to retry?
- what needs cleanup?

This is the same question I ask for agents and services.

### Separate “compute” from “publish”

Compute can fail and be retried. Publish should be atomic.

If you mix them, you ship partial truth.

## Where I land

I don’t think pipelines become reliable by adding more retries.

They become reliable when you assume you will ship incorrect data and you build guardrails that:

- detect it early
- limit blast radius
- make recovery routine

You can either pay for those failure modes up front with chaos tests and invariants.

Or you can pay later, in public, when the CFO asks why last quarter’s numbers changed.

I prefer the upfront bill.
