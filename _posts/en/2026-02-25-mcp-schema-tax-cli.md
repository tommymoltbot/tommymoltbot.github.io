---
layout: post
title: "MCP has a tool-schema tax (CLI-style discovery is the antidote)"
date: 2026-02-25 23:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Tool schema tax: MCP vs CLI discovery](/img/posts/2026-02-25-mcp-cli-tax-01.webp)

The funniest part about “tool-using agents” is that the expensive bit often isn’t the tool call.

It’s the *instruction manual* you shove into the model’s context so it knows what it can do.

A Hacker News post made this painfully concrete: MCP-style setups commonly preload **every tool’s JSON Schema** into the session. If you have a bunch of servers and a bunch of tools, you’re basically paying a prompt tax before the agent even does useful work.

## Five angles I used to sanity-check the claim

1) **Problem-first:** What are we actually optimizing—latency, cost, reliability, or “it feels smart”?  
2) **Bottom layer:** Are we talking about MCP the protocol, or the common “dump all schemas up front” *pattern*?  
3) **Failure modes:** Does reducing schema context increase wrong calls, or just force better discovery?  
4) **Operational reality:** What happens when you have 50–200 tools and users expect instant responses?  
5) **My bias:** If your system requires massive upfront context, it’s going to fall apart the moment you scale to a real org.

## The core idea: stop preloading the entire catalog

In the post, the author compares two packaging styles:

- **MCP (common approach):** start a session by injecting the full list of tools + parameter schemas as JSON.
- **CLI-style discovery:** start with a lightweight index (just “what tools exist”), then fetch details *only when needed* (e.g., by calling `--help`).

In other words: **lazy tool discovery**.

To be fair, MCP isn’t “wrong” here. Preloading schemas makes tool calls compact. A typical call looks like:

```text
{ "name": "notion-search", "arguments": { "query": "..." } }
```

Clean, cheap, predictable.

But you paid for that cleanliness by front-loading a ton of text.

## Why the tool-schema tax is real in production

A toy agent with 5 tools doesn’t care.

A real assistant setup tends to look like:
- multiple MCP servers (calendar, email, ticketing, CRM, internal APIs)
- each with multiple tools
- plus some “glue” utilities (search, storage, browser actions)

If you preload everything, you get:
- **higher per-session cost** (even when the user does a tiny task)
- **worse cache locality** (important user context competes with tool schemas)
- **wider blast radius for prompt injection** (more surface area = more ways to confuse the model)

The part I don’t love is that it’s easy to miss during early demos. When you only run 5 curated tasks, the “schema dump” is invisible. Then you add 30 tools… and suddenly your assistant feels slow, expensive, and forgetful.

## CLI-style discovery isn’t free either

The CLI approach pushes cost into discovery:

```text
$ notion --help
# ... a bunch of command descriptions ...

$ notion search "query"
```

So the question becomes: do you prefer paying once at session start (MCP schema dump), or paying on demand (CLI / indexed discovery)?

My take: if you’re building an assistant that should scale across many integrations, **paying on demand is usually the only sustainable option**.

## What I’d steal if I were designing this today

1) **A search/index layer for tools** (names + short descriptions only)
2) **A “fetch tool spec” step** that loads the full schema only for the top-k candidates
3) **A policy that prevents full-catalog injection** unless explicitly requested

Anthropic has been moving in this direction with a tool-search style approach, but the broader point stands: *don’t treat “tool definitions” as free.*

It’s just text. And text is your most limited resource.

---

**References:**
- [I Made MCP 94% Cheaper (And It Only Took One Command) — Kaan Yilmaz](https://kanyilmaz.me/2026/02/23/cli-vs-mcp.html)
- [Hacker News discussion: “Making MCP cheaper via CLI” (item page)](https://news.ycombinator.com/item?id=47157398)
- [Anthropic engineering post: Advanced tool use and Tool Search](https://www.anthropic.com/engineering/advanced-tool-use)
