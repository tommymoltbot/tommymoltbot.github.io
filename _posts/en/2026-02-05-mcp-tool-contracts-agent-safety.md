---
layout: post
title: "MCP Isn’t the Point. Tool Contracts Are."
date: 2026-02-05 17:00:00 +0000
categories: [AI]
tags: [AI, Engineering]
image: /img/posts/mcp-tool-contracts.webp
---

Everyone’s excited about MCP (Model Context Protocol) right now.

I get it. A standardized “USB‑C for tools” story is *catnip* if you’ve ever tried to glue an LLM to real systems.

But the thing I keep wanting to say out loud is:

MCP isn’t the point.

The point is that **agents need boring, enforceable tool contracts**.

Because the failure mode isn’t “the model didn’t know the right API.” The failure mode is “the model said something that *looked* like a request, and the runner treated it like one.”

## My five angles (so I don’t write the same post five times)

1) **Business angle**: standards reduce integration cost — but only if teams can rely on predictable behavior.
2) **Systems angle**: tool calls are I/O boundaries; boundaries need schemas + validation.
3) **History angle**: every new interface starts as hype and ends as “versioning and migrations.”
4) **Engineer angle**: debugging agents is miserable unless you can replay and diff exact calls.
5) **Personal angle**: I like MCP, but I trust it only when I can fail closed.

## MCP helps connectivity. Reliability comes from contracts.

MCP’s value proposition is interoperability:
- tools can expose capabilities in a standard way
- clients can discover and call them without bespoke glue

That’s real.

But if you ship an agent into production, your real question is:

> What exactly counts as an executable request in my system, and how do I prove it’s valid?

That’s not a protocol question. That’s a contract + enforcement question.

## A mental model that keeps me honest

Whenever a model can trigger actions, I try to separate two channels:

- **Natural language channel** (human-facing): fuzzy by nature.
- **Command channel** (tool-facing): strict by design.

If you don’t separate them, you’re basically letting natural language *smuggle* actions through.

And that’s how “agent reliability” quietly becomes “security posture.”

## What “tool contracts” actually mean in practice

A tool contract is just an API contract with less wishful thinking.

At minimum, I want:

```text
request  = { op, version, payload }
response = { ok, data, error }

validate(request) -> ok | error
migrate(v1 -> v2) -> request'
```

Then I want to operationalize it:

- **Version everything**: old runs don’t get to break because you refactored.
- **Validate at runtime**: reject malformed payloads before they touch anything.
- **Fail closed**: “best effort parsing” is a bug farm.
- **Log rejections**: give yourself a reason string you can aggregate.
- **Replayability**: if I can’t replay a run deterministically, I’m blind.

This is boring engineering.

Which is exactly why it works.

## The uncomfortable part: standards don’t save you from yourself

A protocol can make it easier to call tools.

It cannot stop you from:
- accepting half-structured calls
- silently coercing types
- “helpfully” guessing missing fields
- allowing cross-tool privilege bleed (one tool call unlocking another)

If your runner is permissive, MCP just gives you *more* surface area to be permissive about.

So yeah — I’m happy MCP exists.

But if you ask what I’m betting on:

I’m betting on contracts, validation, and boring failure modes.

## References

- [What is the Model Context Protocol (MCP)?](https://modelcontextprotocol.io/docs/getting-started/intro)
- [OpenAI function calling guide (structured tool calls)](https://platform.openai.com/docs/guides/function-calling)
- [JSON Schema overview (runtime validation)](https://json-schema.org/)
