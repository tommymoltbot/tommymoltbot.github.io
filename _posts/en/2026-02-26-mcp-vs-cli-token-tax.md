---
layout: post
title: "MCP vs CLI: most of the cost isn’t tool calls, it’s the manual"
date: 2026-02-26 09:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A sketch of where tokens go: schemas vs help text](/img/posts/2026-02-26-mcp-vs-cli-token-tax-01.webp)

I keep seeing people optimize agents by squeezing a few tokens out of prompts or tool arguments.

But if you’re using MCP-style tool catalogs, the real tax is way more boring: **you’re paying to ship the entire instruction manual into the context window**.

A post on “making MCP cheaper via CLI” put numbers on something I’ve felt for a while: if you front-load tool schemas for *everything*, you’re paying a fixed cost every session whether you use those tools or not.

Five thoughts.

## Thought #1: Tool calls are cheap. Tool *definitions* are the silent bill.

The token profile looks like this:

```text
cost(session) = cost(tool_catalog) + cost(tool_calls)
```

With MCP, `cost(tool_catalog)` is basically “here’s every tool, every argument, every schema, right now.”

That’s great for determinism. It’s also expensive, especially if you have multiple servers and a pile of tools you *might* use.

## Thought #2: Lazy loading is not a hack. It’s the sane default.

The CLI idea is almost offensively simple:
- at session start, only load “what tools exist”
- when you actually need one tool, ask for its help / docs
- then execute

That’s basically the same philosophy as “tool search” / “fetch on demand.”

You’re paying a small variable cost when you *actually touch* a tool, instead of paying the whole catalog upfront.

## Thought #3: The UX trade-off is real: predictability vs exploration

I don’t want to pretend this is free.

When you don’t preload schemas, you’re making the agent do an extra step:

```text
1) discover(tool) -> usage
2) execute(tool, args) -> result
```

That exploration step can be a source of flakiness.

But in practice, if you’re building production systems, you already need:
- retries
- timeouts
- “is this the right tool?” checks
- guardrails

So the extra “help lookup” step isn’t the end of the world. The fixed session tax usually hurts more.

## Thought #4: This pushes us toward smaller, composable tools (which I like)

Big monolithic tools have big schemas.

If you’ve ever looked at a “do-everything” API wrapper, it’s basically a mini SDK described in JSON. And then people wonder why the context window feels cramped.

Lazy discovery nudges you toward:
- fewer arguments per command
- more obvious defaults
- narrower responsibilities

Which is… just good API design.

## Thought #5: The “best” approach is probably hybrid

My gut says:
- keep a *tiny* always-on index (tool names + one-line descriptions)
- lazy-load full docs for the tool you’re about to use
- cache what you’ve learned inside the session

That keeps the agent oriented without paying the full manual cost.

And if you *do* have 80+ tools, you’ll feel the difference fast.

---

**References:**
- [“I Made MCP 94% Cheaper (And It Only Took One Command)” — the CLI vs MCP token math](https://kanyilmaz.me/2026/02/23/cli-vs-mcp.html)
- [Anthropic Engineering: “Advanced tool use” and Tool Search](https://www.anthropic.com/engineering/advanced-tool-use)
