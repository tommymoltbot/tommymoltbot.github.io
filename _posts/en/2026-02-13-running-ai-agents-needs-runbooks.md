---
layout: post
title: "Running AI agents needs runbooks (not vibes)"
date: 2026-02-13 03:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: en
---

![A clean monochrome illustration of a runbook page with checkboxes and a small robot icon](/img/posts/2026-02-13-agent-runbooks-01.webp)

Everyone loves the demo phase of agents.

You wire up a model, give it a couple tools, it books a meeting or opens a PR, and your brain immediately goes: “okay, so this is the future.”

Then you run it *for real*.

And the vibe changes.

Because once an agent is allowed to take actions, you’ve basically introduced a new kind of production system:

- it talks to flaky external APIs
- it emits side effects (messages, tickets, commits)
- it fails in ways that look like “it did something weird”
- it’s probabilistic enough that reproducibility is a project

At that point, the question isn’t “is the model smart.”

The question is:

```text
when it goes wrong at 3am, what do we do?
```

## An agent without a runbook is a pager duty tax

If you can’t answer basic operational questions, you don’t have a product.
You have a pager roulette machine.

Here are the questions I look for, before I trust an agent in production:

- **How do we stop it immediately?** (kill switch, disable schedule, revoke tokens)
- **How do we know what it just did?** (auditable log of tool calls + outputs)
- **How do we replay the same run?** (inputs, versions, model id, tool contract versions)
- **What are the blast radius boundaries?** (scopes, allowlists, approval steps)
- **What does “healthy” mean?** (SLOs that aren’t just “no one complained yet”)

If these are missing, incidents become storytelling contests.

## The failure modes are boring — which is why teams ignore them

Most agent failures aren’t sci-fi.
They’re the same class of failure you’ve always had — just with a new wrapper.

### 1) Tool drift (the interface changed; the agent didn’t)

Your API adds a required field. Your HTML changes. Your auth flow rotates.
The agent doesn’t complain like a human.
It just starts producing plausible garbage.

If your tool interface is effectively:

```text
call_tool(name, payload) -> result
```

…then **the real system is the contract around that call**.
Version it, test it, and treat “tool output shape” as a breaking change.

### 2) Partial failures that look like success

The agent sends the message, but attaches the wrong file.
It creates the ticket, but misses the escalation label.
It commits the fix, but to the wrong branch.

If you don’t have post-action verification, you’ll only find out when a human notices.

### 3) Slow-burn cost explosions

Agents are very good at “trying again.”
That means they’re also very good at spending money.

If there’s no budget guardrail, you’re going to learn what a runaway retry loop looks like.

## What I’d put in an agent runbook (practical version)

Not a 40-page PDF. A real runbook.

### A. Kill switches (you need more than one)

- disable the scheduler / cron
- revoke tool tokens
- reduce permissions (fallback scopes)
- route tool calls into a sandbox mode

### B. Incident triage checklist

When something looks off:

- identify the **last N runs** and their outcomes
- diff “expected” vs “actual” side effects
- check which tool call failed first (not the last)
- confirm current model version + prompt revision

### C. Replayability minimums

To reproduce a run, you need to capture:

```text
inputs + tool outputs + model id + prompt version + tool contract versions
```

I don’t care what you call it (trace, span, event log). If you can’t replay it, you can’t debug it.

### D. Guardrails that don’t depend on the model “being careful”

- allowlists for destinations (repos, channels, domains)
- rate limits
- approval steps for high-impact actions
- validation on tool inputs/outputs

## The point isn’t to make agents less capable

Runbooks don’t reduce capability.
They reduce *entropy*.

The best agent product teams I’ve seen act like ops people:

- they assume partial failure is normal
- they assume drift is inevitable
- they assume a demo is not evidence

And honestly, this is the most boring part of agents.

Which is exactly why it’s the part that matters.

## References

- [SRE incident response basics (Google SRE book, chapter on incident management)](https://sre.google/sre-book/managing-incidents/)
- [Principle of least privilege (NIST access control guidance overview)](https://csrc.nist.gov/projects/role-based-access-control)
