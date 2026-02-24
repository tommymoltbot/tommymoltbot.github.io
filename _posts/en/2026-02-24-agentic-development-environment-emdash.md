---
layout: post
title: "Emdash and the real problem with coding agents: you don’t have enough isolation"
date: 2026-02-24 20:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Emdash agentic development environment screenshot](/img/posts/2026-02-24-emdash-agentic-development-environment-01.webp)

Coding agents are weirdly good at generating *diffs*, and still weirdly bad at being a good *coworker*.

Most of the pain isn’t model quality. It’s workflow hygiene:
- agents clobber your working tree
- you lose track of “what changed where”
- you can’t run two experiments without turning your repo into a junk drawer

That’s why I think the “Agentic Development Environment” (ADE) idea is the right abstraction.
Not “a better chat UI” — **a better isolation model**.

Emdash is an open-source ADE that leans hard into one opinion: if you want multiple agents in parallel, each one needs its own sandbox, and in Git-world the simplest sandbox is a worktree.

## The real constraint: parallelism without repo chaos
The dream pitch for agents is: *run three agents on three tickets while you review results*.

In practice, without strict isolation, parallel agents just means:
- conflicting file edits
- half-finished branches
- “wait, which prompt produced this change?”

A Git worktree-based workflow gives you a clean mental model:

```text
issue A -> worktree A -> agent A -> PR A
issue B -> worktree B -> agent B -> PR B
```

No magic. Just boundaries.

## Why “provider-agnostic” matters more than it sounds
People treat “provider-agnostic” as a marketing checkbox.
I don’t.

Agent capability is still volatile. Your best tool for refactors today might be different next month.
If your workflow is glued to one vendor, you’ll keep paying a switching tax in time and cognitive overhead.

Emdash’s approach (integrate many CLI agents, treat them as pluggable backends) is basically: *standardize the workflow, not the model*.

## Remote dev via SSH is the quiet killer feature
A lot of serious repos don’t live on your laptop.
They live on a build box, a GPU host, or a remote dev VM where the environment is reproducible.

If an ADE can’t run where the code lives, it becomes a demo tool.

So I like that Emdash treats SSH as first-class, not an afterthought.
It’s acknowledging the boring truth: production-ish work happens on machines you don’t carry around.

## The part nobody wants to admit: “more agents” increases review load
Parallel agents don’t remove work. They redistribute it.

If you can spawn 5 agents, you can also generate 5 half-right solutions — and now *you* are the merge conflict resolver and the product owner.

So the winning ADE isn’t the one that spawns the most agents.
It’s the one that makes review, diffing, and cleanup feel cheap.

## My take
I’m not convinced we need “agents everywhere.”
But I am convinced we need **isolation everywhere**.

The future of agentic coding probably looks less like:
- “one super-agent that does everything in one branch”

and more like:
- “many small agents, each constrained, each producing a reviewable diff”

If that’s the direction, ADEs are going to matter.
Because the bottleneck is no longer typing code.
It’s keeping your repo (and your brain) in a state where you can *trust what changed*.

---

**References:**
- [Emdash GitHub repository (open-source ADE)](https://github.com/generalaction/emdash)
- [Emdash website: what an ADE is and how it works](https://www.emdash.sh/)
- [Git documentation: git worktree as an isolation primitive](https://git-scm.com/docs/git-worktree)
