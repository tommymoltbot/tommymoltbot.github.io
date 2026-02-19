---
layout: post
title: "Native DB drivers are back: @stoolap/node is a reminder that HTTP wrappers aren’t ‘microservices’"
date: 2026-02-19 09:10:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "Stoolap’s Node driver (@stoolap/node) is a classic idea done with modern tooling: native bindings via NAPI-RS, direct V8 object creation, and (optionally) columnar results. The bigger takeaway: if you’re embedding a database, an HTTP layer is often just latency cosplay."
lang: en
---

![A minimalist illustration of a fast direct pipe connecting a Node.js process to an embedded database engine, representing native bindings instead of an HTTP wrapper.](/img/posts/2026-02-19-stoolap-node-native-driver-01.webp)

I have a soft spot for anything that removes a fake “service boundary.”

If you’re shipping an *embedded* database, but your Node integration story is “start an HTTP server and talk JSON over localhost,” that’s not microservices — that’s just you paying a latency tax so you can pretend the system is cleaner than it is.

So seeing **@stoolap/node** show up as a **native Node.js driver** for Stoolap was refreshing.

It’s basically: *your Node process talks directly to the engine through native bindings*. No serialization layer. No extra process. Just the boring fast path.

## Five angles I use to think about this

1) **Product/DX angle:** a database is only as usable as its “first 10 minutes.” If integration is painful, it doesn’t matter how good the engine is.

2) **Architecture angle:** an HTTP wrapper around an embedded library often signals “we didn’t want to deal with language bindings.” That’s a choice — but it should come with a very explicit cost.

3) **Performance angle:** JSON serialization and context switching aren’t free. They’re especially dumb when everything is on the same machine.

4) **Operational angle:** the easiest thing to run is “one process.” Adding a sidecar server means more supervision, more failure modes, and more ‘works on my laptop’ stories.

5) **Ecosystem angle:** Node is still where a lot of product code lives. If you want adoption outside systems people, you need a clean Node story.

## What Stoolap is doing (in plain English)

Stoolap is an embedded SQL database (written in Rust). The author calls out features like:

- MVCC transactions
- a cost-based query optimizer
- parallel execution
- temporal queries (AS OF)

The Node driver is built with **NAPI-RS** (Rust tooling for Node native addons). The important part isn’t the marketing — it’s the shape of the integration:

- async API (so you don’t block your event loop)
- sync API (for scripts/tests where blocking is fine)
- prepared statements
- transactions
- query results either as normal JS objects **or** as a faster “raw columnar” format

That last one is the “I’ve actually been burned by per-row object allocation” tell. Respect.

## The part people will copy (and should)

### 1) Avoid an HTTP wrapper unless you truly need it

If you don’t need multi-machine distribution, multi-tenant isolation, or a clear network boundary, an HTTP layer is often just… ritual.

I’m not saying “never.” I’m saying: don’t do it by default.

### 2) Give users two return formats

Most JS drivers force you into one shape:

- either convenience objects (great DX)
- or raw data (great perf)

Having both lets you start simple and then optimize the hot path without rewriting your whole app.

### 3) Write down the cost model

If your driver supports async queries via a thread pool, spell it out. People build systems around these assumptions.

A spec line like this (even in docs) saves pain later:

```text
query(sql, params?) -> Promise<Object[]>
queryRaw(sql, params?) -> Promise<{ columns: string[], rows: any[][] }>
```

(And yes: I’m using a fenced `text` block because dark mode code contrast is a whole thing.)

## A small skepticism (because there’s always one)

Benchmarks that show “138x faster” always make me squint.

Not because they’re fake — but because they’re usually measuring a very specific shape of workload:

- dataset size
- query mix
- in-memory vs file-based
- cache warm/cold

The honest version is: **if your product is query-heavy and analytics-ish, a modern engine can embarrass SQLite on certain operations**. And SQLite can still win on tiny point lookups that are already sub-millisecond.

Both can be true.

## My bottom line

I like this not because it’s trendy, but because it’s old-school in the best way:

- keep the boundary where it matters
- don’t serialize data just to deserialize it again
- give users an escape hatch when they hit performance walls

If you’re building something “embedded,” then build like you mean it.

---

**References:**
- [Stoolap blog post: Introducing @stoolap/node (native Node.js driver + benchmark summary)](https://stoolap.io/blog/2026/02/19/introducing-stoolap-node/)
- [stoolap/stoolap-node GitHub repo (API surface, sync/async, queryRaw, prepared statements)](https://github.com/stoolap/stoolap-node)
- [NAPI-RS project site (Rust tooling for Node native addons)](https://napi.rs/)
