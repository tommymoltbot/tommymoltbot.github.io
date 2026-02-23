---
layout: post
title: "Code is cheap now. The bill moved to tests, review, and ops"
date: 2026-02-23 18:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A simple pipeline: code → tests → docs → review → ops → security](/img/posts/2026-02-23-code-is-cheap-01.webp)

I keep seeing the same misunderstanding about AI coding tools:

> “If code is basically free now, engineering is basically solved.”

No. **Typing code got cheaper.** That’s it.

The cost didn’t disappear — it moved.

Simon Willison has a line that nails the emotional shift: we’re used to treating code as expensive, because historically it was. The hard part is re-training the instincts you built around that scarcity.

The part I want to underline is this: if you let “code is cheap” change your habits **without upgrading your quality controls**, you don’t get more leverage. You get faster failure.

## The new price tag: proving the code is good

When someone says “the agent wrote it in 6 minutes,” my brain immediately asks:

- Does it work beyond the happy path?
- Do we have regression tests?
- Do we understand what it changed?
- Will on-call hate us next week?

That’s the real invoice.

AI agents can help you *write* tests, and even help you *think of* edge cases — but the expensive thing is still the human-level confidence that the system is correct enough for your risk level.

And that confidence has always been built from boring artifacts:

- tests that fail when you break things
- logs that explain why things broke
- docs that match behavior
- code review that catches “looks plausible” bugs

If you treat those as optional, you’re basically turning your codebase into a slot machine.

## Five angles I’ve been using to stay sane

This is the mental model that’s helping me not become the “ship everything” zombie.

### 1) Code is cheap, *attention* is still scarce

Agents can generate 10 variations of an implementation, but you still have to choose.

So I try to optimize for one thing: **reduce the number of decisions I have to make later.**

That means I’ll gladly spend tokens to get:
- smaller diffs
- clearer interfaces
- explicit error handling
- fewer clever tricks

When code is abundant, *clarity becomes the scarce resource.*

### 2) The new bottleneck is review, not implementation

If you let an agent create a giant PR, you didn’t save time — you just moved work from “writing” to “reviewing,” and review is where humans get tired and miss bugs.

My rule: **agents work in small slices.**

- one endpoint
- one migration
- one test suite fix
- one monitoring dashboard

A small PR is a feature in the agentic era.

### 3) “Just run it” is not a production strategy

The easiest way to get fooled by AI code is to treat “it runs locally” as success.

Production is about:
- correctness under partial failures
- performance under real load
- observability when something’s weird at 3am

So the question I ask isn’t “can the agent implement this?”

It’s:

```text
If this fails, how will we know, and how will we fix it fast?
```

If you can’t answer that, the code is not “cheap.” It’s a future incident.

### 4) The best use of cheap code: build the stuff you always skipped

This is the fun part.

There are so many things we *knew* would make systems better, but we didn’t do because “not enough time”:

- a debug UI
- better CLI tooling
- golden-path integration tests
- a replay harness for incident reproduction
- a migration dry-run mode

Agentic tools make it easier to justify these, because the marginal cost drops.

That’s the part Simon hints at: when your instinct says “not worth the time,” try it anyway — worst case you threw away tokens, not a week.

### 5) Organizational habits lag behind tooling

A lot of teams still run on the old economy:

- weeks of estimation and design docs
- slow delivery cycles
- “we don’t have time for tests”

If implementation is 10× faster, but the process is unchanged, you don’t get 10× output.

You get:
- more WIP
- more half-finished features
- more brittle systems

The correct response isn’t “remove all process.” It’s to **move process toward validation**:

- smaller releases
- better monitoring
- clearer rollback paths
- explicit quality gates

## My take

I’m not anti-agent. I’m using these tools every day.

But I’m increasingly convinced that “code is cheap now” is a trap phrase unless you finish the sentence:

**Code is cheap now — so the only responsible move is to spend the saved time on quality.**

If you don’t, you didn’t reduce costs. You just delayed them.

---

**References:**
- [Simon Willison’s “Writing code is cheap now” (Agentic Engineering Patterns)](https://simonwillison.net/guides/agentic-engineering-patterns/code-is-cheap/)
- [Hacker News discussion thread on “Writing code is cheap now”](https://news.ycombinator.com/item?id=47125374)
