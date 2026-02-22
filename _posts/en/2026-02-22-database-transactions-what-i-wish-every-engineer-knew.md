---
layout: post
title: "Database transactions: what I wish every engineer internalized (before the first incident)"
date: 2026-02-22 14:04:08
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Database transactions](/img/posts/database-transactions-pscale.webp)

I’ve lost count of how many production bugs were *actually* “transaction bugs” wearing a different costume.

Not “we don’t know SQL.”

More like: we shipped code with an implicit mental model of the database, and the database had a different one.

So when I saw PlanetScale publish a long, visual explainer on transactions, I had the same reaction I get when someone finally documents a sharp edge properly:

> “Thank you. This should be required reading.”

This post isn’t a summary of every detail. It’s the stuff I wish more engineers internalized *early*, because it keeps you from making confident, wrong assumptions at 2AM.

## A transaction is a promise (and **commit** is the moment you sign it)
A transaction is just: “I want these reads/writes to behave like one atomic unit.”

You start it. You do a bunch of queries. Then you either:

- `commit;` → make the whole thing real to everyone else
- `rollback;` → pretend it never happened

The part people *feel* in production is not the syntax.

It’s that the database will protect you from half-finished states **only if you actually hold your changes inside a transaction**.

And yes, that implies a slightly uncomfortable truth:

If you’re doing “read → compute → write” across multiple statements without an explicit transaction, you’re often building a race condition generator.

## “Consistent reads” is the feature you’re *already* relying on
A lot of application code assumes this:

- “I read a thing, I read it again, it should still be the same thing.”

That’s a **consistent read** expectation.

The world where you don’t get consistent reads is the world where you debug ghosts:

- Your logs say you read `status = pending`
- Then you make a decision based on it
- Then you read again and it’s `status = paid`
- And you’re not sure if *you* did it, or someone else did

The article does a great job showing how MySQL and Postgres both *offer* consistent reads (e.g. with `REPEATABLE READ` and stricter modes), but they get there with different machinery.

## Postgres vs MySQL: the implementation difference matters (even if your app is “DB-agnostic”)
In the clean, ideal world, you write SQL and the database is interchangeable.

In the real world, the “same” isolation level can be implemented differently, and that changes what surprises you get.

The PlanetScale post illustrates this nicely:

- **Postgres** leans on multi-versioning (MVCC): updates create new row versions, older ones hang around until the system can safely clean them up
- **MySQL** (InnoDB) leans on an undo log: rows get overwritten, but it keeps enough history to reconstruct what you’re allowed to see

If you’ve ever wondered why Postgres has a whole “vacuum” story, or why long-running transactions can feel weird, this is a big part of the answer.

## Isolation levels: pick a policy, then pay the bill
Isolation levels are basically a trade:

- more safety → more coordination / bookkeeping
- more concurrency → more weird edge cases you must handle

The one thing I want people to stop doing is treating isolation like trivia.

It’s not.

It’s a policy decision.

When you choose a weaker mode because “performance,” you’re also choosing which anomalies you’re willing to accept.

And when you choose the strongest mode (`SERIALIZABLE`), you’re choosing a different kind of pain:

- you may get aborted transactions
- you need retry logic
- your app must be built to accept “the database said no, try again” as a normal outcome

If your codebase doesn’t have a consistent retry strategy, “serializable everywhere” is just a future outage with better intentions.

## Concurrent writes: locks vs optimistic conflict detection (and why you still lose sometimes)
Two transactions try to update the same row at the same time.

Someone loses.

The interesting part is *how* the database decides who loses.

The post compares:

- **MySQL**: row-level locking is the core intuition most people already have
- **Postgres**: Serializable Snapshot Isolation uses predicate locks and optimistic conflict detection—less “everyone waits,” more “we detect a conflict and abort one side”

Which leads to my very engineer-y takeaway:

You don’t eliminate concurrency problems. You choose **where** they surface:

- waiting (lock contention)
- or retries (aborts)

Either way, if you don’t plan for it, production will plan for you.

## What I’d do on Monday if this topic scares you
If transactions still feel “academic,” here’s a practical checklist:

1. **Audit your “read → then write” flows** and ensure they’re in an explicit transaction when correctness matters.
2. **Decide on isolation per workflow**, not per database. Payments ≠ analytics dashboards.
3. **Add retries where the database can legitimately abort you** (especially for serializable / deadlock scenarios).
4. **Measure lock time / aborted transaction rates** like you measure latency. It’s part of the product now.

That’s it.

Not sexy. But it’s the difference between a system you can reason about and a system that “usually works.”

---

**References:**
- [PlanetScale’s visual guide to database transactions (with MySQL vs Postgres internals)](https://planetscale.com/blog/database-transactions)
