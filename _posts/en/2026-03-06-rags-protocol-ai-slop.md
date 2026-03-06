---
layout: post
title: "RFC 406i (RAGS): a maintainer’s brutally honest way to say ‘stop dumping LLM slop in my repo’"
date: 2026-03-06 04:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![RFC 406i – Reject AI slop](/img/posts/2026-03-06-rags-protocol-ai-slop-01.webp)

I laughed at this, then I felt slightly tired, which is probably the intended emotional arc.

There’s a page making the rounds titled **“RFC 406i: The Rejection of Artificially Generated Slop (RAGS)”**.
It’s written like a standards doc, but it’s really a maintainer’s coping mechanism: a single URL you paste when someone submits a PR/issue/security report that *looks* thorough but clearly hasn’t touched reality.

This isn’t “anti-AI”.
It’s “please stop externalizing your validation cost onto strangers.”

## 1) The real issue is not style. It’s effort asymmetry

A reviewer’s job is already one big filter:
- Is the bug real?
- Is the fix correct?
- Is the change safe?
- Will this break production at 2 a.m.?

Low-effort LLM output adds a *new* layer:
- Is any of this even grounded in the codebase?
- Are these APIs real?
- Did the model quietly invent a threat model?

That’s the asymmetry.
You spent 30 seconds. The maintainer spends 30 minutes *proving you didn’t spend 30 minutes*.

## 2) “It compiles” is the floor, not the ceiling

The RAGS page is mean about it, but the point is valid:
syntax isn’t contribution.

What maintainers need is **local reasoning**:
- Why this change, in this place?
- Why this interface, not another?
- What did you test, and what did you *not* test?

If you can’t answer those in plain language, your PR is basically a fancy spam email that passes CI.

## 3) The smell test is getting reliable (and that’s bad)

The funniest part is the “tells” list: overly polite phrasing, confident nonsense, a surprising amount of boilerplate, and the vibe of someone trying to sound like an engineer instead of being one.

What worries me isn’t that maintainers can detect it.
It’s that they *have to*.
The whole ecosystem is building immune systems against garbage.
That’s not progress; that’s defense spending.

## 4) A protocol is a joke… until it becomes policy

Today it’s satire.
Tomorrow it’s:
- template checkers
- contribution gates
- “show me the reproduction steps or go away” bots
- stricter codes of conduct *for AI usage*

If your community gets flooded, the only scalable response is automation.
And automation is blunt.
The good contributors pay the tax too.

## 5) How to use LLMs without being *that person*

My personal rule: **LLMs can help you write; they can’t replace you being accountable.**

If you’re submitting to a repo you don’t own, do this:

- Reproduce the bug yourself.
- Keep the PR small enough that a human can review it.
- Say what you tested.
- If the LLM suggested an API, verify it exists.
- If you can’t explain the change without the model, don’t submit it.

If you want a “protocol”, here’s a boring one that actually helps:

```text
submit_patch(diff) -> accepted | rejected
```

Acceptance isn’t about how “complete” your text is.
It’s about whether your diff matches reality.

---

**References:**
- [RFC 406i (RAGS) original page: “The Rejection of Artificially Generated Slop”](https://406.fail/)
- [Hacker News discussion: “A standard protocol to handle and discard low-effort, AI-generated pull requests”](https://news.ycombinator.com/item?id=47267947)
