---
layout: post
title: "Context Mode: The Other Half of the MCP Context Problem (Tool Output)"
date: 2026-02-25 07:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Context Mode MCP output compression](/img/posts/2026-02-25-context-mode-mcp-01.webp)

I’ve seen a bunch of “bigger context window” takes lately, but the thing that actually kills real agent sessions isn’t *just* the prompt. It’s the **tool outputs**.

If you’re using MCP tools in a coding agent, you’ve probably lived this:
- you run one Playwright snapshot
- you list a bunch of GitHub issues
- you paste logs

…and suddenly your “200K context” feels like a small backpack with a laptop, three bottles of water, and a brick.

Context Mode (a Show HN project) is interesting because it attacks the problem from the opposite direction: **don’t shove raw outputs into the model at all**.

## The idea: keep raw data out of the conversation
The core pitch is simple:

- Put an MCP server *between* the agent and noisy tools
- Run the heavy stuff in a sandbox
- Only return summaries/snippets into the model context
- Keep the full raw output indexed (SQLite FTS5) so you can query it later

They claim examples like “tens of KB becomes a few hundred bytes,” and a session that slows down at ~30 minutes stretching to a few hours.

## Why this matters (in production terms)
### 1) Context isn’t just “memory,” it’s bandwidth
People talk about context windows like it’s RAM. In practice, it’s also **bandwidth**: how many relevant tokens can you move through the model per unit time.

Raw tool output is the worst kind of bandwidth usage because it’s mostly irrelevant *at the moment you paste it*.

### 2) It nudges you into retrieval-first thinking
The nice side effect of “index first, retrieve later” is that it forces a better workflow:

- store everything
- retrieve only what you need for the next decision

That’s basically how you want tool-augmented agents to behave anyway.

### 3) It changes the failure mode (and you should be honest about it)
This isn’t free.

When you summarize tool output, you introduce a new class of bugs:
- summary drops the one line that mattered
- the agent believes the summary too confidently
- debugging becomes “what did the sandbox see vs what did the model see?”

So if you adopt something like this, I’d treat it as an engineering system, not a magic plugin:

```text
raw_output -> index -> query -> snippet -> model
```

…and you want observability around every arrow.

## My take
If you’re doing serious agentic work (tests, logs, browser snapshots, big repos), “just buy a bigger context window” is a lazy answer.

The better answer is: **stop feeding the model junk**.

Context Mode feels like a pragmatic move in that direction. I’m not sure the exact implementation will become the standard, but I’m pretty sure this *pattern* will.

---

**References:**
- [Context Mode GitHub repository (MCP server for compressing tool outputs)](https://github.com/mksglu/claude-context-mode)
- [Show HN post introducing Context Mode and its benchmarks](https://news.ycombinator.com/item?id=47148025)
