---
layout: post
title: "Google Workspace CLI (gws): the boring missing piece between APIs and agents"
date: 2026-03-05 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Google Workspace CLI (gws)](/img/posts/2026-03-05-google-workspace-cli-01.webp)

Google Workspace is one of those platforms everyone depends on, but nobody *enjoys* automating.

Not because the APIs are bad (they’re actually pretty solid), but because the last mile is always the same grind:

- reading REST docs
- writing a one-off OAuth flow
- hand-rolling pagination
- arguing with shell escaping
- then shipping a script that only one person dares to touch

So when I saw **gws**, a Google Workspace CLI that dynamically builds its commands from Google’s Discovery Service, my reaction wasn’t “wow, shiny”.

It was: *finally, someone decided this should be a tool problem, not a per-team rite of passage.*

## What gws actually is (and why the dynamic part matters)

The core idea is simple:

- it doesn’t ship a static CLI surface
- it reads Google’s **Discovery Service** at runtime
- and generates commands for basically every Workspace API

That means when Google adds an endpoint, the CLI can pick it up without waiting for someone to update a wrapper library.

If you’ve maintained internal “thin clients” for third-party APIs, you know the pain curve:

- week 1: it’s nice
- month 3: you have 6 endpoints you forgot to version
- year 1: it’s a museum

Dynamic generation isn’t sexy, but it’s exactly how you prevent the museum.

## The part I care about more than “one CLI”: structured output

CLIs usually fail the moment you try to make them part of a real system.

Humans love pretty tables. Automation needs **boring JSON**.

From the docs, gws leans into structured JSON output and even NDJSON streaming for pagination. That’s the difference between:

- “I can run this once in a terminal”
- “I can wire this into a job and not hate myself later”

Example shape (trimmed down):

```text
# list recent Drive files (example)
gws drive files list --params '{"pageSize": 10}'

# stream paginated pages as NDJSON (then pipe to jq)
gws drive files list --params '{"pageSize": 100}' --page-all
```

I’m intentionally not focusing on the exact flags here. The point is: **it behaves like a tool you can compose**.

## OAuth is the real tax (and gws seems to treat it like a first-class problem)

Most Workspace automation dies on the auth hill.

Not because OAuth is impossible, but because it’s *annoying in 15 different ways*:

- desktop vs CI
- multiple accounts
- scope sprawl
- “testing mode” consent limits
- secrets storage

gws has opinions here: encrypted credentials (keyed by OS keyring), multi-account switching, and export flows for headless environments.

This sounds boring. It is.

But boring is exactly what you want from auth.

## The “agent” angle: MCP server + skills

This is where my skepticism kicked in, because “AI agent ready” is now printed on everything, including things that clearly are not.

But the gws pitch is at least coherent:

- expose Google Workspace operations as tools via an **MCP server**
- keep responses as structured JSON
- ship a pile of “skills” so you don’t start from zero

In other words: instead of “let an LLM click around Gmail”, you do “let the agent call a tool that *is* Gmail’s API”.

That’s the only flavor of agent integration I take seriously.

If you’re evaluating it, the question isn’t “does it have MCP”. The question is:

- does the tool surface explode into 500 tools and become unusable?
- can you scope it down to *just the services you need*?
- do the schemas stay stable enough that your automation doesn’t break weekly?

## The tradeoffs (because there are always tradeoffs)

A few things I’d watch before betting production on it:

1) **Runtime discovery means runtime variability**

If your CLI surface is generated live, you need to think about reproducibility. Pinning versions and documenting assumptions becomes even more important.

2) **Too much power, too many scopes**

Workspace APIs aren’t “one API”. It’s a bunch of products, each with its own permissions reality.

A tool that makes everything easy can also make it easy to over-scope.

3) **“Not an officially supported Google product”**

That line matters for enterprises. Not because the code is wrong, but because procurement and security reviews are political.

## My take: this is the right abstraction for 2026

A lot of agent discussions still pretend the world is mostly web UIs.

But most real work is:

- APIs
- auth
- schemas
- rate limits
- logs

A CLI that’s:

- generated from the vendor’s own API description
- emits structured output by default
- can be exposed as a tool server

…isn’t a gimmick. It’s the boring infrastructure that agents *actually* need.

If you’re already writing “Drive export” scripts or “Calendar sync” jobs, this is one of those projects worth at least a weekend test.

---

**References:**
- [gws GitHub repository (overview, install, and design notes)](https://github.com/googleworkspace/cli)
- [@googleworkspace/cli on npm (installation and versions)](https://www.npmjs.com/package/@googleworkspace/cli)
- [Google Discovery Service documentation (the API description source gws builds from)](https://developers.google.com/discovery)
- [Model Context Protocol (MCP) specification site (tool server concept)](https://modelcontextprotocol.io)
- [Hacker News discussion thread about Google Workspace CLI](https://news.ycombinator.com/item?id=47255881)
