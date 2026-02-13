---
layout: post
title: "Sandboxing agents is a product boundary (not a permissions checklist)"
date: 2026-02-13 21:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: en
---

![A monochrome diagram of an agent sandbox boundary between the agent and the world](/img/posts/2026-02-13-agent-sandboxing-01.webp)

The quickest way to tell if an “agent product” is real is simple:
**does it have a sandbox, or does it have hope?**

A lot of teams treat sandboxing like a permissions checklist:

- can it call tool X?
- can it access database Y?
- can it run in environment Z?

That’s not sandboxing. That’s just *declaring intent*.

Sandboxing is a **product boundary**: a deliberately designed surface that limits what can happen when the agent is wrong, confused, or “successfully” doing the wrong thing.

And yes — it’s boring. Which is exactly why it tends to get skipped.

## The uncomfortable truth: agents fail like production systems, not like demos

When an agent is allowed to take actions, you’ve built a system that:

- interacts with flaky, rate-limited external APIs
- produces side effects you can’t un-send (messages, tickets, merges)
- has failure modes that look like “it did something weird”

So the question isn’t “how smart is the model.”

It’s:

```text
when it misbehaves, what is it physically capable of doing?
```

That question is product design.

## A sandbox is a set of hard constraints, not a vibe

Here’s what I actually mean by “sandbox,” in plain terms.

### 1) Constrain the *where* (scope)

- separate credentials per environment (prod vs staging)
- least-privileged tokens (not a shared god key)
- allowlists for which repos, channels, and projects it can touch

If your agent can “do anything,” your sandbox is imaginary.

### 2) Constrain the *what* (capabilities)

Tools are interfaces. Interfaces are contracts.

If your only tool contract is basically:

```text
call_tool(name, payload) -> result
```

…you don’t have a safe system. You have a roulette wheel with JSON.

Make tools narrow and typed. Prefer “create_draft_pr” over “git_push_anything.”

### 3) Constrain the *when* (rate + sequencing)

This is the part people forget.

A model can be correct and still cause damage by being **fast**.

- rate limits per tool
- caps per run (e.g. max 3 messages / max 1 PR)
- per-step confirmations for high-blast actions

Speed turns small mistakes into big incidents.

### 4) Constrain the *proof* (verification)

The agent shouldn’t get to declare victory.

If it sends a message, verify it was delivered to the intended target.
If it creates a ticket, check labels and routing.
If it edits a file, diff it.

The product should demand evidence.

## The best sandbox is the one your future self doesn’t notice

A good sandbox feels like friction during the demo.

Then two months later, during the first “why did it do that?” incident, it turns into the thing that makes the incident boring.

And boring incidents are the whole point.

## References

- [Google SRE book: "Release Engineering" (on controlling blast radius)](https://sre.google/sre-book/release-engineering/)
- [OWASP principle of least privilege (why narrow permissions matter)](https://owasp.org/www-community/Principle_of_Least_Privilege)
- [NIST: least privilege overview (a boring idea that saves you)](https://csrc.nist.gov/glossary/term/least_privilege)
