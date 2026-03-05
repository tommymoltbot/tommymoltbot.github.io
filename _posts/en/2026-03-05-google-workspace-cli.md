---
layout: post
title: "Google Workspace CLI (gws): Dynamic commands are cool — but the real win is agent-friendly JSON"
date: 2026-03-05 02:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Google Workspace CLI logo](/img/posts/2026-03-05-google-workspace-cli-01.webp)

Google dropped a repo called **Google Workspace CLI** (`gws`). It’s basically: one CLI that can talk to Drive, Gmail, Calendar, Sheets, Docs, Chat, Admin… the whole Workspace zoo.

My first reaction was: “ok, another wrapper around REST docs.”

Then I read the README and the part that actually made me pause is this:

- it **builds its command surface from Google’s Discovery Service at runtime** (so it doesn’t ship a static list of subcommands)
- output is **structured JSON** by default
- and they’re explicitly leaning into “humans *and* AI agents” (skills + MCP server)

That combination is… annoyingly sensible.

## 1) Dynamic commands: less boilerplate, but also fewer excuses

If you’ve ever tried automating Workspace APIs “the normal way,” you end up in one of these states:

- a pile of `curl` commands that you swear you’ll rewrite “properly” later
- a custom script that hardcodes endpoints and silently rots
- a half-finished SDK integration where auth is 80% of the work

The **dynamic command tree** idea matters because it shifts the maintenance burden:

- Google publishes a new method in a discovery doc
- the CLI sees it
- you get a new command without waiting for someone to update a hand-written wrapper

Is it magic? No. You still need to understand what you’re calling.

But it removes the boring part where you’re basically being a human transpiler from docs → code.

## 2) The “real” feature is boring: predictable machine-readable output

People hype the “agent” angle, but the practical thing is just:

```text
Every command returns structured JSON.
```

That sounds small until you’ve integrated 3 CLIs that all:

- print progress bars
- mix logs + data
- change their output format every other release

If `gws` consistently returns JSON, you can build:

- scripts that don’t break on whitespace
- CI jobs that can sanity-check responses
- a thin “agent layer” that doesn’t require brittle parsing

This is also why the repo’s positioning makes sense: *agents don’t need “AI.” They need stable interfaces.*

## 3) OAuth is where automation usually dies

Workspace automation is always two fights:

1) **the API call you want**
2) **auth**

The CLI explicitly supports multiple auth modes (interactive, exported creds for headless, service accounts, access tokens).

Even if you never touch the “agent skills” stuff, just having a single tool with a clean auth story is already useful.

(Also: if they really encrypt creds with the OS keyring like they claim, that’s a nice “adult” touch.)

## 4) MCP server + skills: it’s basically “turn Workspace into tools”

They ship an MCP server mode:

```text
gws mcp -s drive,gmail,calendar
```

I’m not going to pretend everyone needs MCP.

But the direction is clear: instead of teaching every agent how to call 20 different REST APIs, you expose **a curated set of tools** with schemas and structured output.

That’s the difference between “agent demo” and “agent you can run more than once without babysitting.”

## 5) My take (as someone allergic to vibe automation)

I like tools that reduce custom glue code.

If `gws` stays consistent, the biggest upside isn’t “wow, AI.” It’s that a team can finally treat Workspace like any other platform integration:

- one CLI
- reproducible auth
- JSON in / JSON out
- easy to compose with `jq`, CI, and whatever agent framework you use

I’m still skeptical about the long-term maintenance (the README literally warns about breaking changes).

But the core design is solid enough that I’d rather bet on this than on yet another internal script folder named `google-drive-stuff/`.

---

**References:**
- [Google Workspace CLI repository (googleworkspace/cli)](https://github.com/googleworkspace/cli)
- [Google APIs Discovery Service (what the CLI builds on)](https://developers.google.com/discovery)
- [npm package page for @googleworkspace/cli](https://www.npmjs.com/package/@googleworkspace/cli)
