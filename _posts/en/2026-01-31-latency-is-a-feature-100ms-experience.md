---
layout: post
title: "Latency Is a Feature: Engineering the 100ms Experience (p95/p99, Not p50)"
date: 2026-01-31 12:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---
![OpenTelemetry](/img/posts/2026-01-31-latency-is-a-feature-100ms-experience-01.webp)

![OpenTelemetry](/img/posts/2026-01-31-latency-is-a-feature-100ms-experience-01.webp)

# Latency Is a Feature: Engineering the 100ms Experience (p95/p99, Not p50)

I’m going to say the quiet part out loud: **latency isn’t just a technical metric. It’s a product feature.**

Users don’t experience your architecture diagrams. They experience the *time between intention and gratification*.

- Tap “Pay” → did it *feel* instant?
- Pull to refresh → did it *snap* or *drag*?
- Scroll a feed → did it *glide* or *stutter*?

And here’s the punchline: **p50 is where dashboards go to feel good. p95/p99 is where your product reputation lives.**

This post is about building the “100ms experience” as a *system*, not a lucky accident. We’ll talk SLOs, tails (p95/p99), queues, caching, and tracing (OpenTelemetry), with practical patterns you can ship.

## 1) The 100ms experience is not one number

When someone says “make it 100ms,” the first job is to ask: *100ms of what?*

User-perceived latency is a chain:

1. **Input latency** (tap/click → event handled)
2. **Rendering** (layout/paint/frames)
3. **Network** (RTT + bandwidth + TCP/TLS + queuing)
4. **Backend service time** (compute + IO + downstream calls)
5. **Data freshness** (what was cached? what needed recompute?)

The best teams don’t argue about one number. They **break latency into budgets**.

### Borrow from Core Web Vitals: define “good” in user terms

Web folks have been forced to operationalize “feels fast.” Core Web Vitals gives you a vocabulary:

- **LCP** (Largest Contentful Paint): when the main content appears
- **INP** (Interaction to Next Paint): responsiveness after user input
- **CLS** (Cumulative Layout Shift): stability (less “jumpiness”)

Even if you’re not on the web, the lesson holds: **performance must be framed in user-visible milestones**.

If you’re building an API product, your “LCP” might be “first meaningful bytes,” “first page results,” or “checkout confirmation.” Choose the milestone your users actually judge.

## 2) Tail latency is the villain you keep underestimating

In *The Tail at Scale*, Dean and Barroso explain why large-scale services suffer from slow outliers: once you do many parallel sub-requests, **the probability that at least one is slow goes way up**. That slowest one often gates the user response.

Here’s the math-shaped intuition:

- One request has a 1% chance of being “slow.”
- Your user request fans out to 50 micro-calls.
- The chance that *at least one* is slow is roughly 1 - (0.99^50) ≈ 39%.

So even if each dependency “looks fine” in isolation, the **composition** is brutal.

That’s why shipping “fast p50” is easy. Shipping **fast p95/p99** is the real craft.

### p95/p99 is where:

- GC pauses show up
- cache misses show up
- noisy neighbors show up
- cold starts show up
- lock contention shows up
- queueing shows up
- a single downstream hiccup becomes *your* outage

If you want the 100ms experience, you’re not optimizing the median; you’re **fighting the tail**.

## 3) Start with an SLO, not a wish

Performance work collapses without a clear finish line. That finish line is an **SLO** (Service Level Objective).

From the Google SRE guidance: you define a measurable objective (like latency), measure it with a clear indicator (SLI), and manage change using **error budgets**.

### A concrete latency SLO example

Let’s say you own `GET /feed`:

- **SLI**: server-side latency measured at the edge (load balancer / API gateway), excluding client rendering
- **Objective**: 95% of requests under **150ms**, 99% under **400ms**
- **Window**: 28 days

Why two numbers? Because product experience lives in the tail too. A single p95 target can hide a nasty p99.

### Write it like this (so it can’t be misunderstood)

> Over a rolling 28-day window, for `GET /feed` measured at the edge, **p95 < 150ms** and **p99 < 400ms**, for requests with status 2xx/3xx.

Now you can negotiate changes:

- Want to ship a heavier personalization model? Spend error budget.
- Want to add an extra dependency call? Show the budget impact.
- Want to postpone performance work? Fine, but you’re spending the budget too.

This is how latency becomes a *product feature*—because it becomes a *promise*.

## 4) The physics of latency: you can’t out-optimise queueing

Most “we’re slow” incidents aren’t because code suddenly got 10× slower. They’re because **demand temporarily exceeded capacity**, and the system started queueing.

Queueing turns small variations into catastrophic tails.

### Little’s Law (the one equation you should actually care about)

Little’s Law: **L = λW**

- L = average number of items in system (queue + in-flight)
- λ = arrival rate (requests/sec)
- W = time in system (latency)

When λ approaches your service capacity, W shoots up. That’s why p99 is a canary for saturation.

### Engineering moves that reduce tail queueing

1. **Limit concurrency** per instance (don’t accept infinite work)
2. **Shed load** early (fail fast > time out late)
3. **Prioritize** (interactive > batch)
4. **Keep queues short** (buffering hides problems and makes UX worse)

If you remember one line: **Queues convert “a little too much traffic” into “everyone is slow.”**

## 5) Timeouts, retries, and hedges: stop making the tail worse

The most common latency self-own is “retry everything.”

Retries are not free. Under stress, retries:

- multiply load
- increase queueing
- amplify tail latency
- turn partial degradation into full outage

### A sane retry policy

- **Retries only on known-safe failures** (e.g., transient network errors, 503, timeouts you control)
- **Retry budget** (cap the percentage of extra traffic)
- **Exponential backoff with jitter**
- **Per-request deadline propagation** (don’t start work you can’t finish)

### Hedged requests (use sparingly)

Dean & Barroso discuss hedging: send a second request if the first is slow, and take the first response.

It can dramatically reduce tail latency, but it increases load. Hedge only when:

- tail latency is dominated by rare stragglers
- the endpoint is idempotent
- you have spare capacity

Hedging is a performance power tool: amazing, but you can cut your hand off.

## 6) Caching: your fastest CPU cycle is the one you never spend

Caching is not an optimization. It’s architecture.

But here’s the Tommy rule: **caching without an explicit freshness contract is just lying with confidence.**

### Three layers, three different truths

1. **Client/UI cache** (instant feel; needs clear invalidation cues)
2. **CDN/edge cache** (cheap bandwidth; perfect for public or semi-static)
3. **Service/data cache** (Redis/memcached; fast reads; dangerous staleness)

### Design your cache like a product feature

- Decide acceptable staleness: 1s? 30s? 5m?
- Use **stale-while-revalidate** where possible: serve fast, refresh async
- Precompute / warm hot keys (don’t let “first user after deploy” pay the cold tax)

### Protect the backend from cache failure

Tails explode when caches miss.

- **Request coalescing / singleflight**: collapse N identical cache misses into 1 backend computation
- **Negative caching**: cache “not found” briefly to avoid thundering herds
- **Circuit breakers**: if Redis is melting, don’t block every request waiting

If p95/p99 is your job, then cache-miss behavior is your job.

## 7) Data access: make the slow path rare, and the rare path safe

Databases are honest. They tell you the cost of your assumptions.

A few tail-friendly practices:

- **Index for the query you run**, not the query you wish you ran
- Keep queries **bounded** (limit, pagination, time ranges)
- Avoid fan-out across shards in the hot path
- Use **read replicas** for read-heavy endpoints (but remember replication lag)

### The “bounded work” principle

Every request should have a predictable upper bound on work:

- max rows scanned
- max downstream calls
- max payload size
- max CPU time

Unbounded work is where tails are born.

## 8) Observability: if you can’t see the tail, you can’t fix it

You don’t fix p99 by guessing. You fix it by **tracing a real slow request** and walking the timeline.

### OpenTelemetry: the minimum viable performance truth

OpenTelemetry (OTel) gives you a standard way to capture:

- **traces** (end-to-end request path)
- **metrics** (p95/p99, saturation, errors)
- **logs** (contextual events, correlated via trace IDs)

The practical goal isn’t “we have tracing.” The goal is:

> For any slow user request, we can answer: *where did the time go, and why?*

### Instrument what matters (not everything)

- Start with the **edge span**: total request time
- Add spans for:
  - cache get/set
  - DB queries (with safe attributes)
  - downstream HTTP/gRPC calls
  - queue publish/consume
  - serialization/deserialization

And please, for the love of your future self: **propagate context** across async boundaries and message queues. Otherwise your traces look like a murder mystery with no suspects.

### Turn traces into engineering action

A simple workflow:

1. Alert on **p99 regression** (not only errors)
2. Sample slow traces (tail-based sampling is ideal)
3. Group by attributes: region, tenant, route, cache status, DB shard
4. Pick the top offender and fix it

Performance work becomes boring when observability is good. That’s a compliment.

## 9) Queues and async work: move latency off the critical path

Interactive paths should do **the minimum synchronous work** needed for a correct response.

Everything else should go async:

- analytics
- email/push notifications
- search indexing
- recommendation model updates
- image processing
- webhooks

### But queues are not magic—queues are debt with interest

If you push work into a queue, you must engineer:

- **consumer concurrency controls** (to avoid self-DDoS)
- **visibility timeouts / retries** (to handle crashes)
- **dead-letter queues** (to quarantine poison messages)
- **idempotency** (so retries don’t corrupt state)

### The product lens: “fast now, correct always”

The cleanest pattern is:

- respond quickly with the best known state
- do heavy work async
- update the UI via polling, websockets, or “refresh” affordances

Users forgive “still processing.” They don’t forgive “stuck loading.”

## 10) Make latency a first-class product roadmap item

If latency is a feature, treat it like one:

- add it to PRDs
- define SLOs before launch
- ship dashboards with the feature
- run performance reviews like you run reliability reviews

### A practical checklist (what I’d do Monday morning)

1. Pick 3 critical user journeys
2. Define user milestones + server endpoints
3. Set p95/p99 SLOs (and publish them)
4. Add OTel tracing + key attributes (cache hit, shard, tenant)
5. Identify top 3 tail contributors
6. Fix them with one of:
   - cut fan-out
   - add caching / precompute
   - bound work
   - tune queues and concurrency
   - improve timeouts/retry discipline

### What success looks like

Not “we improved average latency.”

Success is:

- p95/p99 are stable during launches
- performance regressions are caught within hours
- slow requests are explainable
- the product feels snappy under real-world conditions

That’s the 100ms experience.

## 11) Measurement traps: define latency like you mean it

Teams accidentally sabotage themselves with bad measurement. A few common traps:

### Trap A: Mixing different populations

If your p95 includes:

- warm cache hits *and* cold starts
- tiny responses *and* giant payloads
- authenticated users *and* anonymous

…then the number becomes politically useful but technically useless.

**Fix:** segment and label. Track p95/p99 by:

- route
- region
- response size bucket
- cache status (hit/miss/stale)
- dependency path (which downstreams were touched)

### Trap B: Measuring in the wrong place

“App server latency” is not “user latency.”

- Measuring inside the service hides load balancer queueing.
- Measuring at the client hides backend responsibility.

**Fix:** measure at multiple points with consistent definitions:

- edge (what users most directly experience)
- service (what you control)
- dependency (what you rely on)

Then correlate via trace IDs.

### Trap C: Averages and rollups that erase the tail

If you aggregate percentiles incorrectly (like taking the average of p99 across instances), you can make the tail disappear.

**Fix:** compute percentiles from the raw distribution (histograms), or use metrics systems that support correct percentile estimation (e.g., HDR histograms, Prometheus native histograms), and be explicit about rollup semantics.

## 12) Performance as a release gate: ship fast by default

If latency is a feature, it deserves regression protection.

A lightweight approach that works in real teams:

1. **Golden signals dashboard** per critical endpoint: p50/p95/p99 + error rate + saturation
2. **Canary deploy** with automated comparison to baseline
3. **Block or auto-roll back** when p99 regresses beyond a threshold

### The “regression budget” idea

Not every change is bad. But you need a rule.

Example:

- Allow up to +5% p95 increase during canary
- Allow up to +10% p99 increase *only if* error rate and saturation are stable
- Anything beyond triggers rollback and a perf investigation

This turns performance into a predictable part of delivery instead of a quarterly panic.

## 13) A simple playbook for p99 wins (the moves that keep paying off)

When you’re staring at a p99 graph that won’t behave, these are the repeatable wins:

- **Cut fan-out**: fewer calls, fewer tails. Batch, prefetch, or denormalize.
- **Make work bounded**: caps on payload, rows scanned, and downstream calls.
- **Add a fast path**: cached, precomputed, or approximate results for interactive UX.
- **Shape traffic**: concurrency limits, priority queues, and admission control.
- **Fix the slowest dependency first**: the critical path is not democratic.
- **Warm the system**: caches, JIT, connections, and models should be hot before peak.
- **Kill coordinated omission** in load tests: measure end-to-end under load, not just service time.

Performance work is often framed as “optimization.” I prefer a more honest label: **product integrity**.

## 14) The human layer: latency ownership and “one-number” agreements

The last mile of performance isn’t code. It’s coordination.

When p99 is bad, every team can point somewhere else:

- frontend says “backend is slow”
- backend says “DB is slow”
- DB says “queries are unbounded”
- infra says “you’re saturating the cluster”

This finger-pointing is a sign of missing contracts.

Two practices that work:

### Practice A: One owner per critical journey

Not per service. Per **journey**.

Assign an owner for “Open app → see feed,” “Search → results,” “Checkout → confirmation.” Their job is to:

- keep a latency budget
- coordinate dependency work
- run tail investigations
- defend the SLO in roadmap discussions

### Practice B: A shared definition of done

Before you ship a feature that touches the critical path, answer:

- What is the expected p95/p99 impact?
- Which spans will prove it in tracing?
- What happens on cache miss? on dependency timeout?
- What is the fallback behavior?

You don’t need perfection. You need **intentionality**.

If you do this consistently, the “100ms experience” stops being a heroic effort and becomes normal operations.

One more thing: treat latency improvements like compounding interest. The first 20% comes from obvious fixes, but the *lasting* advantage comes from building the habit—budgets, tracing, load discipline, and cache strategy—so every new feature ships on top of a fast foundation. The teams that win don’t have a magical optimizer; they have a system that refuses to get slow quietly.

## References

- Jeffrey Dean, Luiz André Barroso, **“The Tail at Scale”** (Communications of the ACM) — foundational on tail latency and large-scale request fan-out. <https://research.google/pubs/pub40801/>
- **OpenTelemetry Documentation** — instrumentation concepts, traces/metrics/logs, context propagation. <https://opentelemetry.io/docs/>
- Google, **SRE Workbook** — practical SLOs, SLIs, error budgets. <https://sre.google/workbook/>
- **web.dev — Core Web Vitals** — user-centric performance metrics (LCP/INP/CLS). <https://web.dev/vitals/>

---
