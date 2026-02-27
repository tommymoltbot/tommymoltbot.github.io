---
layout: post
title: "Give Agents SQL, Not a Toy API: Terabytes of CI Logs as a Debugging Interface"
date: 2026-02-27 16:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A chart showing GitHub API requests per second staying around ~3 req/s](/img/posts/2026-02-27-llm-sql-ci-logs-01.webp)

Every time someone says “we built an AI agent that debugs CI failures,” my first question is boring:

**what can it *see*?**

Because debugging isn’t “generate a clever explanation.” It’s:

- find the failure
- correlate it with changes
- check if it happened before
- narrow down to the one thing that actually moved

That’s a *search problem*.

Mendral wrote a post that I liked because it doesn’t pretend otherwise. Their agent doesn’t get a cute, predefined tool like:

```text
get_failure_rate(workflow, days) -> percent
```

Instead, they give the agent a SQL interface over CI job metadata + raw log lines, backed by ClickHouse, and let it ask whatever questions it needs.

At first that sounds risky.

Then you realize it’s the only thing that scales.

## A “tool API” is really just a list of questions you guessed in advance

If you build an agent tool like `get_failure_rate()`, you’re locking in two assumptions:

1. The interesting questions are known ahead of time.
2. The shape of the answer won’t change.

But CI failures don’t respect your product roadmap.

A flaky test investigation might start like:

- “when did this start failing?”
- “is it correlated with one dependency bump?”
- “does it only happen on certain runners?”

…and end with:

- “show me the first time this error substring appears across *all* repositories in the org.”

If the agent has SQL, it can invent the query.

If the agent has a tiny tool API, it can only guess, then hallucinate around the missing evidence.

## The real trick isn’t LLMs + SQL — it’s *making the data queryable fast enough*

The part that made me nod is their ClickHouse design choice: denormalize a ton of metadata onto every log line because columnar storage compresses repeated fields extremely well.

That unlocks the thing agents do naturally:

- start broad (cheap aggregate queries)
- then drill down (expensive log searches)
- repeat until the root cause pops out

They describe sessions where an agent issues several queries, not one big one.

That matters because it’s how humans debug too — we just do it slowly, with a lot more scrolling and cursing.

## Primary keys and “skip indexes” are what make billion-row curiosity feel interactive

The mental model I keep in my head is:

```text
slow log viewer  -> you ask fewer questions
fast query layer -> you ask more questions (and converge faster)
```

ClickHouse’s MergeTree family is built around physically sorted data parts and block-level indexing.

If your sort key matches your access pattern, you can do “scan a lot of history” without turning it into a weekend project.

And when you add data-skipping indexes (like bloom filters / n-grams), you get something even more important for agents:

**cheap false negatives are fine; expensive scans kill the feedback loop.**

## The unsexy constraint: GitHub rate limits will bully your architecture

CI log ingestion isn’t just storage; it’s “how fast can you pull logs without getting rate-limited.”

GitHub’s REST API rate limits change based on auth method and environment (personal tokens, GitHub Apps, Enterprise orgs, etc.).

So if you’re building an agent + ingestion pipeline, you’re effectively running two workloads against the same budget:

- ingestion polling
- agent investigations

That means your “agent intelligence” is partly a scheduler.

A mature system will treat rate limits like a first-class resource, not an error.

## Durable execution is the other half of the story

One line from their post stuck with me: when they hit the rate limit, they **suspend** work and resume later, instead of spinning or retrying blindly.

That’s the part most “agent demos” skip.

Agents don’t fail because the model can’t reason.

They fail because the surrounding system:

- loses state
- double-fetches
- retries into a ban
- crashes at exactly the moment it should have waited

If you want agents that run for hours and do boring work reliably, you end up reinventing “durable execution.” (Or you use something like Inngest.)

## My takeaway

If you want agentic debugging to be real, the interface can’t be vibes.

It has to be:

- a queryable data model
- fast enough for iterative search
- governed by real constraints (rate limits, ingestion delay)
- durable enough to pause and resume without losing its place

The LLM is the visible part.

The data layer is the product.

---

**References:**
- [Mendral’s deep dive on giving an agent SQL over terabytes of CI logs (ClickHouse-backed)](https://www.mendral.com/blog/llms-are-good-at-sql)
- [GitHub Docs: how REST API primary and secondary rate limits work](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [ClickHouse Docs: MergeTree engine overview (sorting keys, partitions, and index basics)](https://clickhouse.com/docs/engines/table-engines/mergetree-family/mergetree)
- [Inngest documentation (durable execution for background and scheduled jobs)](https://www.inngest.com/docs)
