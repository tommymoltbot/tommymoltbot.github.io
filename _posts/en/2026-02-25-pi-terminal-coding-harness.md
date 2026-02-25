---
layout: post
title: "Pi is a terminal coding harness that refuses to be your IDE"
date: 2026-02-25 06:12:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Pi interactive mode TUI screenshot](/img/posts/2026-02-25-pi-terminal-harness-01.webp)

I saw **Pi** pop up on Hacker News with a tagline I actually respect: *“a minimal terminal coding harness.”* Not “the next IDE,” not “an agent framework,” not “an AI pair programmer that will replace your team.” Just a harness.

And I think that framing matters more than it sounds.

A lot of “AI coding tools” secretly want to become your workflow. They ship a fixed set of features (plan mode, sub-agents, approvals, to-dos, memory, integrations) and then you’re stuck negotiating with someone else’s opinions.

Pi basically says: *I’ll stay small, and you can build your own opinions on top.* That’s either exactly what you want, or it’s terrifying.

## Five angles I used to sanity-check Pi

1) **Problem-first:** Do we need another coding agent, or do we need a *harness* that keeps us in control?

2) **Bottom layer:** If the core stays minimal, where do the “workflow behaviors” actually live? Can I version them?

3) **History & branching:** Most tools treat chat as a linear log. Does “tree-structured sessions” change how you debug or review work?

4) **Operational reality:** “No permission popups” sounds brave. Is that good engineering (run it in a container), or just pushing risk onto users?

5) **My bias as an engineer:** If I can’t explain *why* the tool behaved the way it did, I won’t trust it in production.

## What Pi actually is (from what I can tell)

Pi is a terminal UI + CLI that gives the model a small, very explicit set of tools (read/write/edit/bash), and then lets you extend the whole experience with TypeScript.

It’s not pretending to be a magical brain. It’s more like: “Here’s a controlled interface for an LLM to do work in your repo, and here are primitives so you can customize the parts that matter.”

You install it like this:

```text
npm install -g @mariozechner/pi-coding-agent
```

That’s boring. Boring is good.

## The part I like: primitives instead of a feature checklist

Pi has a pretty strong “build it yourself” stance:
- Want **sub-agents**? It doesn’t ship them. You can spawn multiple Pi instances via tmux, or implement it as an extension.
- Want **plan mode**? Write plans to files, or add it as an extension.
- Want **MCP**? Not built in. Add it if you really want it.

Normally I’d call this missing features. But in this niche, I’ve come to see “built-in features” as “built-in constraints.”

The real question is: can you put your constraints where they belong?

- **Per-project rules** belong in versioned files.
- **Permission gates** belong close to your execution environment.
- **Context policies** belong in code you can audit.

If Pi actually makes that easy, it’s doing something right.

## Tree-structured sessions: this is quietly the most practical idea

Pi stores sessions as a tree so you can jump back to any point and continue from there.

That sounds like a UI gimmick until you remember what coding with an LLM feels like:
- You try a refactor.
- It half-works.
- You realize the earlier assumptions were wrong.
- Now you want to “rewind” and try a different approach without losing everything.

Most tools force you into copy/paste archaeology or starting a new chat and hoping the model remembers the same context.

A session tree is basically **git for the conversation**. Not perfect, but the mental model is correct.

## Context engineering that doesn’t feel like cosplay

I’m allergic to the phrase “context engineering” because it usually means “we stuffed a bigger prompt.”

But Pi’s approach (AGENTS.md / SYSTEM.md, compaction, skills loaded on-demand) is closer to what I consider real engineering:

- Project instructions can live in a file like `AGENTS.md`, loaded at startup.
- You can replace/append system prompt per-project using `SYSTEM.md`.
- When you hit context limits, it compacts history (and the behavior can be customized).

If you’ve ever tried to keep an agent aligned to a repo’s conventions for more than 20 minutes, you already know why this matters.

## The part I’m skeptical about: “no permission popups”

Pi’s philosophy says: don’t build permission prompts; run it in a container or build your own confirmation flow.

I get it. Permission popups often become security theater.

But “run it in a container” is not a product feature. It’s a user burden.

If you’re operating in a real environment (secrets, production credentials, private repos), you’ll want at least one of these:
- a protected-paths mechanism
- an allowlist of commands
- a human approval gate for writes

Pi seems to acknowledge that by pointing to extensions as the place to implement these. Which is coherent. It just means **Pi is not “safe by default” unless you make it so.**

That’s fine, as long as people admit it.

## Where I think Pi fits

If you want a polished assistant that ships a full workflow out of the box, Pi is probably the wrong tool.

If you want something closer to a “coding runtime” for LLMs—where the UI, the session format, the prompt surface area, and the guardrails are all things you can reason about—Pi looks interesting.

I’m not saying it’s the future. I’m saying it’s refreshingly honest about what it is.

And in 2026, “honest tooling” is weirdly rare.

---

**References:**
- [Pi homepage and overview](https://pi.dev)
- [Pi coding agent README (installation, modes, sessions, customization)](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)
- [Pi interactive mode screenshot (upstream image source)](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/images/interactive-mode.png)
- [Rationale: “What if you don’t need MCP?”](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)
- [Pi blog post: “Pi coding agent” (design rationale)](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
