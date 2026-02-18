---
layout: post
title: "pg_background is the kind of async you can actually operate"
date: 2026-02-18 00:10:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "If your app is using ‘async’ as an excuse to leak complexity into the fleet, you’re paying a tax. pg_background is interesting because it keeps the async boundary inside Postgres — with explicit handles, cancellation semantics, and operator knobs."
lang: en
---

![A minimal black-and-white illustration: a database cylinder with a small side door labeled “background worker”, and a clipboard with checkboxes](/img/posts/2026-02-18-pg-background-async-01.webp)

There are two kinds of “async” in real systems:

- the kind that makes your latency graphs look better
- the kind that makes your on-call life worse

Most teams reach for async because a request is too slow, a backfill is too heavy, or a maintenance job is too annoying to run in-band.

But the usual path is to introduce **another moving part**:

- a queue
- a worker fleet
- a retry policy
- a dead-letter story
- a “why is it stuck?” dashboard

Sometimes you need that.

A lot of the time, you don’t.

pg_background caught my attention because it’s a very specific promise:

> “Let Postgres run SQL in background worker processes, so the client session can move on — while the work runs in its own transaction.”

It’s not trying to be a scheduler. It’s not pretending to be a job system.

It’s a sharp tool with sharp semantics.

## Five angles I use to decide whether a ‘Postgres-native async’ feature is worth touching

1) **Business angle:** fewer components is cheaper — until it isn’t. A Postgres-native tool has to earn its keep by being operable.

2) **Systems angle:** moving work off the request path is only a win if the new execution lane has *predictable* failure modes.

3) **History angle:** “autonomous transaction” patterns have existed forever in databases, and they always come with footguns if the handle model is sloppy.

4) **Engineer angle:** you don’t get to say “it’s async” and then hand-wave capacity. Background workers still consume real resources.

5) **My personal bar:** if I can’t explain cancel vs detach vs wait to an on-call engineer in 60 seconds, I won’t ship it.

pg_background mostly passes that bar.

## What pg_background is (and what it isn’t)

At a high level, pg_background lets you kick off SQL that runs in a server-side background worker.

That matters because the unit of isolation is clear:

- it runs *in Postgres*
- it has its own transaction scope
- your client connection doesn’t have to sit there holding the door open

It’s **not**:

- a cron scheduler
- a durable queue
- a replacement for application-level job workflows

It’s closer to: “run this SQL over there, and give me a handle so I can decide how to interact with it.”

## The real production reason to care: the handle model got hardened

The most interesting thing I saw in the recent writeup is the push toward a v2-style API that uses a `(pid, cookie)` handle.

That’s not marketing fluff — it’s basically an admission of a classic operational hazard:

```text
PIDs get reused.
```

If you’re running a long-lived system, relying on a bare PID as identity is how you end up canceling the wrong thing at 3am.

So the cookie is doing a very boring, very important job: making “this worker” mean *this worker*, not “whatever got this PID later.”

## Detach is not cancel (and I’m glad someone wrote it down)

Async tooling tends to collapse different intents into one muddy operation.

pg_background makes you name the intent:

- **wait**: I care about the result, I’m going to block for it
- **cancel**: I want it to stop
- **detach**: I’m letting it run, I’m just not tracking it from *this* session anymore

This matters because detach has a perfectly legitimate use case: “start a backfill, let it run, I’ll check later.”

But if your team confuses detach with cancel, you’ve built a silent runaway job generator.

So if you ship this, teach that semantic difference like you teach transaction isolation levels.

## The one operational rule you can’t ignore: background workers are capacity

Postgres background workers aren’t free.

They consume worker slots and compete with everything else that needs that execution budget.

So the responsible posture is:

- treat background worker capacity as a **budget**
- add **guardrails** for maximum concurrency
- add **timeouts** so “it’ll finish eventually” doesn’t become “it’s still running next week”

If the extension is offering per-session limits and default timeouts, that’s exactly the direction you want.

## Where I would use pg_background (and where I wouldn’t)

I’d consider it for:

- heavy-but-contained maintenance SQL (VACUUM / ANALYZE / REINDEX patterns)
- data repair/backfill jobs that are naturally expressed as SQL
- “autonomous transaction” side effects that you *explicitly* want isolated

I would not use it as:

- a general workflow engine
- an excuse to avoid designing idempotency
- a substitute for a durable queue when you truly need durability

## My bottom line

If you’re allergic to adding yet another worker fleet, pg_background is a refreshing kind of async:

- the execution lane is inside Postgres
- the semantics are explicit
- the handle model is getting more production-safe
- capacity is a first-class concern (as it should be)

It won’t fix architecture for you.

But it *can* reduce the amount of distributed systems you accidentally invent.

---

## References

- [The original write-up: pg_background and why Postgres-native async can be saner than another job system](https://vibhorkumar.wordpress.com/2026/02/16/pg_background-make-postgres-do-the-long-work-while-your-session-stays-light/)
