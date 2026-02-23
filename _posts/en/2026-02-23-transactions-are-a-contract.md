---
layout: post
title: "Database transactions are a contract, not a magic spell"
date: 2026-02-23 12:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Database transactions contract illustration](/img/posts/2026-02-23-database-transactions-01.webp)

People talk about “use a transaction” like it’s a band-aid you slap on messy code and the database will somehow *make it correct*.

I don’t buy that framing.

A transaction is a contract you sign with the database: *I’m going to do a sequence of reads/writes, and I want you to give me specific guarantees while I’m doing it.*
And in return, you accept constraints: contention, retries, locks, and sometimes your “simple update” turning into a multi-day debugging session.

If you haven’t internalized what the contract is, you’ll use transactions the same way people use `robots.txt` as “security”: with vibes.

## The only API you truly get

At the application layer, the transaction API is basically this:

```text
BEGIN;
  -- reads / writes
COMMIT;

-- or
ROLLBACK;
```

That looks boring, but it’s the sharpest tool you have for keeping invariants intact.

The important part isn’t “multiple statements”. It’s **atomic visibility**:
- Before `COMMIT`, nobody should see your half-done world.
- After `COMMIT`, everyone should see *all* of it.
- After `ROLLBACK`, it should be as if you never touched anything.

If your mental model stops here, you’ll be fine… until you hit concurrency.

## Concurrency is where the contract gets expensive

The whole reason transactions exist is not “batching SQL”. It’s letting 50 people click “Buy now” at the same time without your system inventing money.

Now the contract becomes: *what does it mean for two sessions to read and write “at the same time”?*

That’s where **isolation levels** show up. You’re not choosing a “database setting”. You’re choosing which kinds of weirdness you’re willing to tolerate for performance.

PlanetScale’s explainer does a good job showing the classic ladder:
- Serializable
- Repeatable Read
- Read Committed
- Read Uncommitted

Here’s the uncomfortable truth: even “strong” isolation doesn’t mean “no retries”.

If you’re building something real, you need to decide up front:
- What invariants must never be violated?
- Where do you detect conflicts?
- What do you retry, and how many times?

If the answer is “we’ll see”, you’ll see it in production.

## Postgres MVCC vs MySQL undo logs: same promise, different bill

I like how PlanetScale frames the difference:

- **Postgres** leans on MVCC (multiple row versions). Updates create new row versions; visibility is controlled by transaction IDs. This makes “consistent reads” feel natural, but it creates a maintenance bill (vacuuming is not optional forever).
- **MySQL (InnoDB)** overwrites rows and uses an **undo log** to reconstruct older versions for transactions that still need them. That shifts the cost elsewhere: undo pressure, purge lag, lock behavior, and different failure modes.

Both are valid engineering choices.
What I care about as an app engineer is simpler:

> When the database is under load, will my invariants hold *and* will I get predictable latency?

Because “correct but 10× slower” is also a bug.

## The part everyone forgets: write conflicts are a feature

At some point, two transactions will want the same row.

If your isolation level is strict enough, the database will protect the contract by doing one of these:
- blocking (locks / waits)
- aborting one side (serialization failures / deadlocks)

Developers often treat this as “the database being flaky”.
I treat it as: the database is telling you your model is honest. You really *do* have contention.

So your options are boring but real:
- reduce contention (data model, sharding, queues)
- accept retries (and make them safe)
- weaken isolation (and accept a narrower contract)

## My personal rule

If you can’t explain the contract you’re relying on, you’re not “using transactions”. You’re gambling.

And yeah, I still gamble sometimes. But I like to know when I’m doing it.

---

**References:**
- [PlanetScale: Database Transactions (interactive explainer)](https://planetscale.com/blog/database-transactions)
- [PostgreSQL documentation: Concurrency control (MVCC)](https://www.postgresql.org/docs/current/mvcc.html)
- [MySQL documentation: InnoDB transaction model and locking](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-model.html)
