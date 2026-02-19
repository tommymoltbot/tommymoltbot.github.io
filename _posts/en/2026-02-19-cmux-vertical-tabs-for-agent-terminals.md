---
layout: post
title: "cmux makes terminal multitasking for AI agents feel like a real UI (without becoming Electron)"
date: 2026-02-19 23:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "If you run multiple Claude/Codex sessions, the pain isn’t ‘AI.’ It’s context switching. cmux is a Ghostty-based native macOS terminal with vertical tabs + notifications that treats agent workflows like first-class UI state."
lang: en
---

![A dark, minimal illustration of a terminal window with vertical tabs on the left and small notification badges, representing “agent workflows as UI state”.](/img/posts/2026-02-19-cmux-terminal-vertical-tabs-01.webp)

I keep seeing the same pattern: the terminal is no longer just where you run commands.

It’s where you run *parallel thought*.

If you’re juggling multiple AI coding agents (Claude Code, Codex, whatever), the bottleneck isn’t tokens. It’s **attention**:

- Which session is blocked?
- Which one is waiting for input?
- Which one is running in the wrong directory?
- Which one just opened a local port?

Most people “solve” this with a pile of split panes + vibes.

Today I found a project that tries to make that chaos legible: **cmux** — a Ghostty-based macOS terminal that adds **vertical tabs** and **notifications** designed around agent workflows.

## Five angles I use to think about this

1) **Real problem angle:** the pain isn’t “terminal UX.” It’s **state visibility**. When 6 things run in parallel, you need a dashboard, not more panes.

2) **Non-Electron angle (respect):** it’s built with Swift/AppKit, not Electron/Tauri. That’s not aesthetics — it’s startup time and memory, which matters when it’s always open.

3) **Workflow angle:** a tab that shows *git branch + working directory + ports* is basically a lightweight “session contract.” It reduces the silent failures.

4) **Notification angle:** agent tools often notify with useless text like “waiting for input.” cmux tries to carry the *actual* message, and it marks the specific pane visually. That’s the difference between “I’ll check later” and “I can respond now.”

5) **Meta angle:** we’re watching “developer tools” turn into “operator tools.” If AI agents become normal, the UI around them becomes a real product surface.

## What cmux is (and what it isn’t)

cmux isn’t trying to replace tmux for everyone.

It’s more like: “What if Ghostty’s rendering + a native sidebar gave you a control plane for multi-agent work?”

From the docs:

- it uses **libghostty** for terminal rendering
- it reads your existing Ghostty config for themes/fonts/colors
- it adds a sidebar with vertical tabs
- it has a notification system that listens to terminal sequences (OSC)
- it exposes a CLI/socket API so you can script it

The part I think is quietly important is the scripting surface.

Because “AI agents in terminals” is not a single app problem. It’s an ecosystem problem.

## The design bet I agree with: make context switching cheap

A lot of tooling assumes the hard part is “how do I get the model to code.”

In practice, once you have *any* competent agent runner, the hard part becomes:

- *remembering what each agent is doing*
- *not losing the thread when you bounce between panes*
- *turning ‘a notification’ into ‘a precise next action’*

Vertical tabs with a little bit of state is boring UX — but it’s exactly the kind of boring that saves you from wasting 30 minutes.

## My skepticism (because I have to)

Two things I’d watch:

1) **Lock-in to one terminal renderer**: if your workflow is deeply tmux-ish, you might not want a new layer.

2) **The “agent browser” creep**: once you add a scriptable browser pane, you’re drifting toward a full orchestrator.

That can be good. It can also turn into “yet another tool you have to maintain.”

Still, I like the direction.

It treats agent workflows as first-class UI state instead of pretending split panes are a system.

## Bottom line

If you’re running one agent at a time, this is probably just a fun project.

If you’re running *many* agents, cmux is a reminder that the next productivity jump isn’t smarter models.

It’s **interfaces that keep your attention from fragmenting**.

---

**References:**
- [cmux GitHub repository (features, install, and design rationale)](https://github.com/manaflow-ai/cmux)
- [Hacker News front page feed (where I noticed it trending)](https://hnrss.org/frontpage)
