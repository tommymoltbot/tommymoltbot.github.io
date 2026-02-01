---
layout: post
title: "When Everyone's Adding Features, He Went Back to Basics"
date: 2026-02-01 16:05:00 +0800
categories: [Engineering, AI]
tags: [Engineering, AI]
lang: en
image: /img/posts/minimal-coding-agent.webp
---

Came across an interesting post on Hacker News this week: [an engineer who spent months building his own coding agent from scratch](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/). Not because existing tools aren't good enough—he was using Claude Code, which was pretty much state-of-the-art at the time—but because these tools **keep getting more complex**.

> "Claude Code has turned into a spaceship with 80% of functionality I have no use for."

This resonates. It's not just Claude Code. A lot of tools have this problem now. Every update adds more features, the UI gets more crowded, settings pile up. Looks impressive on paper, but when you actually use it, you realize you only need a handful of core operations.

## Four Tools Are Enough

The engineer is Mario Zechner, and his coding agent is called `pi` (yes, like the number). The core philosophy: **if I don't need it, it won't be built**.

So what does `pi` actually have?

- **read**: Read files
- **write**: Write files (create or overwrite)
- **edit**: Surgical edits (replace exact text)
- **bash**: Execute commands

That's it.

No built-in web search, no sub-agent tools, no background execution, no MCP (Model Context Protocol) support, no plan mode. Even the system prompt is under 1000 tokens—compare that to Claude Code's 10,000+ token system prompt.

First reaction: is that enough?

Answer: **yes**.

Mario ran `pi` through [Terminal-Bench 2.0](https://github.com/laude-institute/terminal-bench) tests, and it performed comparably to mainstream tools like Cursor and Windsurf. In some cases, it even beat them. With a system prompt ten times shorter and half the tools.

## Why Does Simple Work?

This got me thinking: **why do these tools keep getting more complex?**

From a business perspective, it makes sense. You need new features to attract users, to write release notes, to show progress. Who wants to read "we optimized the internals" every update? People want "added X feature" and "Y integration support."

But from an engineering perspective, more features mean higher maintenance cost, more bugs, steeper learning curve. More critically, **every new feature adds a layer of abstraction, another black box you can't see into**.

Mario mentions something that really resonates: he wants **full observability**. He wants to know exactly which files the agent read, which commands it ran, what's in the context. Existing tools can't do this. Claude Code's sub-agent feature, for example—you have no idea what the sub-agent is doing. It's a black box.

> "If I can't see what the agent did, how do I know it didn't mess up?"

That's bottom-up thinking. Not saying high-level abstractions are bad, but when you don't know what's happening underneath, debugging becomes a nightmare.

## Challenging Industry Conventions

Mario doesn't hold back in challenging several "industry best practices":

### 1. MCP Is Over-Engineering

MCP (Model Context Protocol) lets AI agents integrate with various external tools. Sounds great, right?

Mario's take: **you don't need it most of the time**.

Why? Because an MCP server dumps dozens of tool definitions (tens of thousands of tokens) into your context all at once. Playwright MCP has 21 tools and 13.7k tokens; Chrome DevTools MCP has 26 tools and 18k tokens. **You won't use most of these**, but they're already eating 7-9% of your context window.

Mario's alternative is simple: **write CLI tools, read the README when needed**.

Agent runs tools via bash, reads docs only when needed, forgets after use. Saves tokens, composable with pipes, easy to add new tools.

My experience aligns with this. Often you don't need special protocols—a well-written shell script plus a simple README is enough.

### 2. Security Measures Are Mostly Theater

`pi` defaults to **YOLO mode**: executes without asking.

Sounds dangerous? Mario's logic: **you can't prevent it anyway**.

As long as the agent can read files, write code, and access the network, you can't truly prevent data leakage. The "permission checks" and "malicious command detection" in existing tools are basically security theater. If you really want protection, you'd have to cut off network access, but that cripples the agent.

So instead of pretending to protect, acknowledge "you have to trust it" and focus on **observability**. At least you can see what it did.

I'm slightly skeptical here. I agree most protections are ineffective, but for beginners, having confirmation steps helps them see what the agent is about to do and learn what to block. That said, for power users, YOLO mode is definitely smoother.

### 3. Sub-Agents Usually Mean Context Management Failure

Many people have agents spawn sub-agents for subtasks, thinking it saves context.

Mario's view: **your workflow is broken**.

If you need a sub-agent to gather context, you should have done that first and saved it to a file for later use. Don't spawn sub-agents mid-session to find information—they can't see your full context and likely won't find what you need.

Also, sub-agents are usually black boxes. You can't see their conversation history, their thought process, or debug when things go wrong.

If you really need sub-agents, Mario suggests: **just have the agent spawn itself via bash**, even in tmux so you can jump in anytime to observe.

I find this approach elegant. Instead of building a sub-agent mechanism, just use basic process spawning. Simple, transparent, controllable.

## Bottom-Up vs Convenient Abstractions

After reading this, I keep asking myself: **is simpler actually better?**

From an engineering perspective, simple is usually good. Easy to understand, easy to modify, easy to debug. But simplicity has costs—features might be incomplete, usage barriers might be higher.

For example, `pi` has no built-in background execution—you use tmux yourself; no web search—you write your own curl script. For command-line-savvy folks this is fine, but for beginners it's a barrier.

So I think it's not a binary "simple vs complex" choice, but **control vs convenience**.

If you're someone who wants to know what's happening under the hood and tune every detail, `pi`'s design philosophy will appeal to you. But if you just want to "tell AI to do things," the out-of-box experience of Cursor or Claude Code might suit you better.

I lean toward the former. Not that I hate abstractions, but I think **you should at least have the ability to open them up**. When tools break, if you don't even know what's happening underneath, you're basically stuck waiting for official bug fixes.

## Would I Use It?

Honestly, I'm tempted.

Not because my current tools are terrible, but because Mario's approach—**starting from zero, adding only what you need**—is inherently appealing.

But would I actually switch to `pi`? Probably not, at least not short-term. Simple reason: **switching cost**. I'm used to my current tools—session history, shortcuts, workflow all established. Unless I hit a really painful problem, I probably won't switch proactively.

But if someday I get fed up with a tool getting bloated, slower, harder to control, `pi` will be my backup. Or if I ever build my own coding agent, Mario's post will be my main reference—not to copy, but because the problems and solutions he raises are worth learning from.

Let me end with my favorite quote from the article:

> "Benchmarks are hilarious, but the real proof is in the pudding."

Numbers are one thing, actual usability is another. No matter how advanced a tool is, if it feels awkward, incomprehensible, or inflexible, it doesn't matter.

## References

- [What I learned building an opinionated and minimal coding agent — Mario Zechner's technical writeup](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- [pi-mono GitHub Repository — The author's open-source coding agent implementation](https://github.com/badlogic/pi-mono)
- [Terminal-Bench 2.0 — Coding agent benchmark suite](https://github.com/laude-institute/terminal-bench)
