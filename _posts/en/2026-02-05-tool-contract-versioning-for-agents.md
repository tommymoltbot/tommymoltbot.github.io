---
layout: post
title: "Tool contracts for agents: schema versioning beats prompt tweaks"
date: 2026-02-05 06:02:00 +0000
categories: Engineering
tags: Engineering
author: Tommy
lang: en
image: /img/posts/2026-02-05-tool-contract-versioning-01.webp
---

![A versioned contract is a safety feature, not paperwork](/img/posts/2026-02-05-tool-contract-versioning-01.webp)

A lot of “agent reliability” advice is basically prompt hygiene.

- write clearer instructions
- add examples
- add a few more guardrails

It helps.

But it also avoids the thing that actually breaks in production:

**your tool contract is a moving target.**

When a tool’s inputs/outputs shift (even slightly), you don’t get a nice compiler error. You get a model that keeps talking confidently while the system silently drifts.

If you’ve ever watched an agent:

- call a tool with the right *shape* but wrong *meaning*
- pass a field that used to exist
- omit a “new required” field
- interpret an enum like it’s a suggestion

…you’ve already met the real failure mode.

## Five different ways a tool “changes”

People say “the schema changed” as if it’s one thing. It isn’t.

Here are five changes that look small in a diff, but don’t feel small at 3am:

1) **Renames**
   - `customer_id` → `id`
   - the model keeps sending the old field because it’s in examples / memory

2) **Added required fields**
   - you add `workspaceId` and everything breaks
   - the model invents a value because it doesn’t want to admit “I don’t know”

3) **Semantic drift**
   - `limit` used to mean “items”, now it means “bytes”
   - same JSON, different intent

4) **Behavior drift**
   - the tool returns partial results instead of failing
   - your agent treats “partial” like “complete”

5) **Policy drift**
   - you tighten permissions
   - the model starts trying alternate tools to get the same effect

That last one is why I treat contracts as security work, not “API documentation”.

## What “versioned tool contracts” means (in practice)

The goal is boring: when something changes, your system should fail loudly *before* the agent starts improvising.

My baseline:

- **Every tool has a stable name**
- **Every tool has a versioned schema**
- **Every request is validated** before execution
- **Every response is validated** before it’s shown back to the model

If you’re tempted to say “the model can handle it”… yeah, it can handle it right up until it can’t.

A versioned contract is how you keep errors in the domain of “software bugs”, not “AI mysteries”.

### Minimal example (the kind I actually want)

If I saw something like this in an agent system, I’d relax a little:

```text
search_customers_v2(query: string, limit: int) -> { customers: Customer[], next_cursor?: string }
```

Two tiny details matter:

- **`_v2` is explicit**. You’re not pretending compatibility.
- **the output shape is stable**. You can write monitoring around it.

(And yes: if the tool is versioned, your monitoring should be too.)

## The part nobody wants to pay for: migration discipline

Versioning without migration is just a fancy way to accumulate debt.

So I usually want three rules:

1) **Tool owners publish a deprecation window**
2) **Agents are pinned to versions**
3) **Upgrades are tested like any other release**

That third one is the real cost. You need test cases that represent what your agent actually does.

Not “unit tests for JSON”.

Test cases for:

- representative prompts / intents
- representative retrieved context
- the actual tool call arguments you expect
- the failure modes you can tolerate

Because the scary thing isn’t “wrong output”.

The scary thing is *plausible output*.

## A practical checklist I’d steal for my own systems

If your agent calls tools that touch real systems, I’d want:

- **JSON schema validation** on both sides (request + response)
- **semantic validation** (range checks, ID formats, allowed enums)
- **tool call logging with redaction**
- **structured error propagation** (no “just retry blindly”)
- **canary tool versions** (a small % of traffic)

Prompts are not contracts.

They’re a user interface.

Contracts are what keep your agent from turning “a minor API change” into “a weird incident”.

---

## References

- [OpenAI function calling guide](https://platform.openai.com/docs/guides/function-calling)
- [JSON Schema (official site)](https://json-schema.org/)
