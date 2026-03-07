---
layout: post
title: "Argus: turning Claude Code sessions into something you can actually debug"
date: 2026-03-07 17:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Argus VS Code dashboard for Claude Code session analysis](/img/posts/2026-03-07-argus-claude-code-session-debugger-01.webp)

I’m increasingly convinced the biggest productivity unlock with AI coding isn’t “better prompts”. It’s **observability**.

When you pair-program with a human, you can ask “why did you do that?” and you get a story. When you pair-program with a model, you get… a pile of tool calls, retries, and context churn. If you don’t look at it, you’ll keep paying for the same mistakes.

That’s why a project like **Argus** caught my eye: it’s a VS Code extension that scans your Claude Code session logs and tries to answer the boring-but-expensive questions:

- Where did the tokens go?
- Which steps were duplicated?
- Did we get stuck in a retry loop?
- Are we thrashing the context window?

## What Argus is actually doing

Argus reads the local session artifacts from Claude Code (the repo describes scanning under the Claude projects directory), parses the step log, and builds a dashboard.

The interesting part isn’t the UI (though the screenshots look clean). It’s the choice of “rules” it applies:

- **Duplicate reads**: the agent keeps re-reading the same files.
- **Unused operations**: tool output that never mattered.
- **Retry loops**: the “try, fail, try again” spiral.
- **Failed tools**: patterns of repeated failure.
- **Context pressure / compaction events**: signals that you’re pushing the context window too hard.

If you’ve used any agent-like workflow, you’ve seen these pathologies. The difference is: Argus tries to quantify them.

## Five thoughts (that aren’t the same thought)

### 1) “AI coding costs” are mostly invisible waste

When people complain about model pricing, what I usually see in real projects is not “the model is too expensive”. It’s “we ran the same loop five times”.

A tool that highlights wasted steps is basically a cost-control lever — without you needing to become an accountant.

### 2) This is a debugger, not a prompt notebook

Most tooling in this space is prompt templates and snippets. That’s nice, but it’s not where the real time goes.

Debuggers win because they answer *why the session behaved the way it did*. In other words: they reduce the “black box tax”.

### 3) Context pressure is the new memory leak

Traditional systems slow down when you leak memory.

Agent sessions slow down when you leak context: too many repeated reads, long transcripts, irrelevant outputs, and “just in case” dumps. You feel it as latency, but you pay it as tokens.

So when I see “compaction events” called out explicitly, I like it. That’s a real system-level signal, not vibes.

### 4) Teams will need this (even if they don’t want it)

The moment a team says “we’re using AI assistants in production work”, they *implicitly* created a new auditing problem:

- What did we run?
- What failed?
- What did it cost?
- Did we leak anything into logs?

You can ignore those questions… until finance or security asks them.

### 5) The real win: training your own workflow

The best outcome isn’t “Argus makes the agent smarter”. It’s “Argus makes *you* change the way you drive the agent”:

- tighter tasks
- fewer speculative reads
- less retrying the same strategy
- earlier stopping when it’s clearly stuck

It’s not glamorous, but it’s how you turn AI from a demo into a tool.

## A small, practical checklist I’d try after installing it

If you want something actionable, I’d start with three questions per session:

1) Did we re-read the same file(s) multiple times?
2) Where did the biggest token spikes happen?
3) Did the session show signs of context pressure?

Then adjust your process *before* you reach for a new model or bigger context window.

---

**References:**
- [Argus repository (Claude Code session debugger & analyzer)](https://github.com/yessGlory17/argus)
- [VS Code official site (editor Argus integrates with)](https://code.visualstudio.com/)
