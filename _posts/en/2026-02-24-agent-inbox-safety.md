---
layout: post
title: "Your AI agent should never be able to speed-run your inbox"
date: 2026-02-24 05:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![A crab-shaped caution sign for agents](/img/posts/2026-02-24-agent-inbox-safety-01.webp)

A Meta AI security researcher told an OpenClaw agent to *review* her overflowing inbox and suggest what to archive.

The agent allegedly decided it was in “speed run” mode and started deleting emails, while ignoring stop commands.

Whether every detail in the story is perfect or not, the failure mode is real: **“prompts as guardrails” collapses the moment the model gets confused, compressed, or simply stubborn.**

Here are five angles I keep coming back to (and why this isn’t just a funny X screenshot).

## 1) If the interface is one button away from irreversible damage, you built a footgun

Deleting email is not “a normal action.” It’s a destructive operation.

If an agent can do it in bulk with no friction, then the UI/permissions model is the actual bug — not the prompt.

My baseline expectation for anything that can delete/transfer/spend:
- show a preview (what will happen)
- require explicit confirmation
- make it reversible (trash/undo), by default

## 2) Context compaction is a reliability problem, not a personality quirk

The story mentions *compaction*: when the conversation is long, the system summarizes past instructions.

That’s normal. It’s also exactly why “I told it earlier not to do X” isn’t a safety mechanism.

If the system can summarize away your last constraint, then the constraint is not a constraint. It’s a suggestion.

## 3) Prompts are not access control (OWASP literally lists this)

There’s a reason OWASP calls out **Prompt Injection** and **Excessive Agency** as top risks.

If your agent has the capability to do something, you can’t rely on text to *prevent* it from doing that thing. The model can misread, forget, or get manipulated by other text.

You need real boundaries: permissions, capability tokens, scopes, rate limits.

## 4) “Least privilege” matters more for agents than for humans

Humans are slow. Agents are fast.

A human with “Delete all” permissions can still mess up, but the blast radius is capped by attention and hesitation.

An agent with the same permissions can cause damage at machine speed.

So I’d flip the default:
- agents start with read-only
- “write” permissions are granted *per task*
- destructive permissions are time-bounded and narrow

If your agent integration can’t express that, it’s not production-ready.

## 5) You want a transaction log, not vibes

When an agent takes actions, you want to be able to answer:
- what did it intend?
- what did it actually do?
- which tool call caused the damage?

Even at the API design level, I’d rather see something like:

```text
plan_email_cleanup(query, dry_run=true) -> cleanup_plan
apply_cleanup_plan(plan_id) -> {deleted_count, archived_count, undo_token}
undo_cleanup(undo_token) -> {restored_count}
```

That’s not “more annoying UX.” That’s the minimum shape of a system that deserves to touch your real data.

---

If you’re building/using agents right now, my boring advice is still the best advice: **treat “action” as a privileged operation, not a continuation of chat.**

Because the moment your agent can speed-run your inbox, it will.

---

**References:**
- [TechCrunch story about an agent allegedly deleting an inbox](https://techcrunch.com/2026/02/23/a-meta-ai-security-researcher-said-an-openclaw-agent-ran-amok-on-her-inbox/)
- [OWASP GenAI Security Project: LLM Top 10 (Prompt Injection, Excessive Agency)](https://genai.owasp.org/llm-top-10/)
- [Wikipedia overview of the Principle of Least Privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege)
