---
layout: post
title: "Tool contracts for AI agents: you think it's a function call, it's an SLA"
date: 2026-02-10 12:10:00 +0000
categories: [AI, Engineering]
tags: [AI, Engineering]
author: Tommy
excerpt: "The risk isn't just model hallucinations. It's unversioned schemas, drifting permissions, undefined retry semantics, and invisible tool calls turning 'small changes' into outages."
image: /img/posts/2026-02-10-ai-agent-tool-contracts.webp
lang: en
---

The more I build agent systems, the more I feel this mismatch:

people talk about agents like they're just *a model + a couple function calls*.

In production, the **tool interface** stops being a convenience and becomes a **contract**.

You think you're giving the model:

```text
search(query) -> results[]
```

What you're actually giving it is:

```text
search(query) -> results[]  // plus latency, auth, quota, privacy, retries, and blast radius
```

This post is basically a plea: design tools like versioned APIs with explicit semantics. Treat them like SLAs.

## 1) A tool schema isn't documentation — it's a compatibility promise

A common pattern:

- define a JSON-ish input
- return a JSON-ish output
- ship

Then someone "cleans up" naming and turns `customer_id` into `customerId`.

And the agent genuinely starts failing.

Because the model isn't compiled code. It will:

- keep using the old field (prompts/examples/memory still reference it)
- misread partial responses and fill gaps with confident guesses
- interpret errors as transient and retry (now you're rate-limiting yourself)

The practical fix is boring but effective: **version tools**.

```text
tool: search@v1(query: string, limit?: int) -> { items: Item[] }
tool: search@v2(q: string, top_k?: int) -> { results: Result[] }
```

Run v1 and v2 side-by-side for a while. Give yourself a rollback path.

## 2) Define "what you can't do" as much as "what you can do"

Engineers love powerful primitives:

- `run_sql(sql)`
- `call_internal_api(path, method, body)`
- `shell(command)`

In agent land, "power" often means "hard to control".

I prefer narrow tools with built-in boundaries:

- `get_customer_by_email(email)`
- `list_open_invoices(customer_id)`
- `issue_refund(invoice_id, amount, reason)`

Even if you already have general tools, make constraints machine-checkable:

```text
issue_refund(invoice_id, amount)  // amount <= outstanding_amount
```

Don't rely on a README that says "please be careful".

## 3) Latency and retries: stability knobs that can amplify incidents

If a tool gets slower, your intuition is: "the agent will wait".

In practice you often get:

- the agent calls again (thinks it's stuck)
- the orchestrator times out and re-runs steps
- queues look stalled and autoscaling spins up more workers

One slow request becomes a retry storm.

So the contract should include time expectations:

```text
get_invoice(invoice_id) -> invoice  // p95 < 500ms
```

And retry semantics should be explicit, not inferred by the model:

```text
get_invoice(...)  // safe to retry: yes
issue_refund(...) // safe to retry: no (unless idempotency-keyed)
```

Retries + side effects without idempotency keys is basically gambling.

## 4) Permission drift: the worst failures are "it worked yesterday"

Some of the most annoying production issues aren't:

- deterministic bugs
- broken data
- hallucinations

They're **auth drifting underneath you**.

A service account loses a scope, and now the agent sees:

- some customers accessible, others 403
- one API path works, another doesn't
- the model tries to route around the failure (because it wants to finish)

Make auth part of the contract:

```text
list_customers() -> customers[]  // scope: billing.read
issue_refund() -> receipt        // scope: billing.write
```

Don't let the model discover permissions by trial.

## 5) Observability: you must answer "what did it actually do?"

The fastest way to lose trust is when you can't explain agent behavior.

My baseline: **every tool call is traceable**.

At minimum:

- request id
- input
- output (or error)
- latency
- caller identity (agent/session/user)

And if you're in regulated-ish environments, compliance is part of the contract too:

```text
send_message(to, text) -> message_id  // must store audit log for 90 days
```

You don't need to record everything, but you do need an evidence trail when things go wrong.

## How I'd approach it: build tools like products

If you're wiring an agent into internal systems, I'd flip the usual order:

1. design the tool contract (schema + versioning + auth + timing + retry semantics)
2. build stubs/mocks and run in sandbox
3. connect to real systems last

Agent controllability isn't a prompt trick.

It's the result of hard system boundaries.

---

## References

- [OpenAI docs: tool / function calling and JSON schema](https://platform.openai.com/docs/guides/function-calling)
- [AWS Builder’s Library: timeouts, retries, backoff (and why incidents amplify)](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [Google SRE Book: monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)
