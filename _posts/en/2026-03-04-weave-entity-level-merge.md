---
layout: post
title: "Weave: When Git’s line-based merge becomes your bottleneck"
date: 2026-03-04 03:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Weave – entity-level merge](/img/posts/2026-03-04-weave-entity-level-merge-01.webp)

Git’s merge conflicts are one of those things we all accept as “just how it is”… until you put multiple humans (or worse: multiple agents) on the same repo.

Two people add two unrelated functions in the same file, and Git goes: *CONFLICT*. Not because the changes logically collide, but because the line ranges overlap.

I ran into a project called **Weave**, which tries to fix exactly that: do a 3-way merge **at the entity level** (functions/classes/keys) instead of lines.

That idea sounds obvious in hindsight. It also sounds like the kind of thing that will either quietly change your workflow… or explode spectacularly the first time it mis-merges.

This post is me thinking through where it helps, where it scares me, and why it’s suddenly more relevant now than it was five years ago.

## The problem Git is *actually* solving

Git’s merge model is pragmatic:

- It doesn’t understand your code.
- It assumes text files are sequences of lines.
- It tries to produce a result that a human can review.

That last part matters. A “dumb” merge that’s predictable is often better than a “smart” merge that’s occasionally wrong.

But there’s a modern pain point: **false conflicts**.

You know the pattern:

- branch A adds `validateToken()`
- branch B adds `formatDate()`
- both edits land near the same place in a file
- Git thinks this is a conflict because, from a line-diff view, it kind of is

So you spend time resolving a conflict that never existed at the semantic level.

## Why entity-level merge suddenly matters (agents)

If you’re coding solo, false conflicts are annoying.

If you’re coding in a normal team, false conflicts are still annoying, but you can negotiate conventions (smaller files, more modules, etc.).

If you’re running multiple AI agents that:

- touch the same modules,
- generate boilerplate in bulk,
- and don’t coordinate the exact insertion point…

…false conflicts become a *workflow killer*.

It’s not that agents “can’t resolve conflicts”. They can. It’s that the whole promise of parallelization dies if every second PR needs a human merge babysitter.

So yeah: even if Weave is “just a merge driver”, it’s basically infrastructure for agentic dev.

## What Weave claims to do

Weave’s pitch is simple:

1. Parse base/ours/theirs with tree-sitter
2. Extract entities (functions, classes, keys, etc.)
3. Match entities by identity (name/type/scope)
4. Merge entities instead of line ranges
5. Only conflict when the *same entity* is changed in incompatible ways

So, instead of stopping because two line blocks overlap, it asks: “did you both change the same function?”

That’s the right question.

## Where I think it’s genuinely useful

### 1) “Different JSON keys changed” should not be a conflict

Configs are a classic merge-conflict factory. Line-based merge will happily conflict on adjacent edits in a file even if they’re logically unrelated.

Entity-level merge turning “JSON object key” into a merge unit makes a ton of sense.

### 2) The codebase that multiple people *touch but don’t own*

Think:

- `utils.ts`
- `helpers.py`
- “common” modules that everyone adds one more function to

Those are always going to get contested. Weave basically tries to make those modules less fragile under parallel work.

### 3) Agent-generated “bulk edits”

If you’ve ever let an agent generate 10 helpers in one file, you know it tends to clump output in the same regions.

Line-merge gets confused and cries.

Entity-merge might just… merge.

## The part that makes me cautious

There are two kinds of merge tools:

- tools that **reduce conflicts**
- tools that **create bad merges with high confidence**

The second type is terrifying because it fails silently.

So the question is: can Weave be “smart” without becoming “creative”?

From what I’ve read, it tries to be conservative:

- different entities → auto-merge
- same entity changed → conflict (or attempt an intra-entity merge)
- huge files/binaries/unsupported types → fall back to normal Git merge

That’s the right philosophy.

But still: entity identity matching is hard.

If you rename a function, move it, or change its signature… is it “the same entity”? If the tool guesses wrong, it can either:

- incorrectly merge unrelated things, or
- incorrectly conflict (which is safer but defeats the purpose)

Personally, I’d rather it conflict than mis-merge.

## My “production brain” checklist before I’d trust this

If you want to try an entity-level merge driver, I’d treat it like a new build toolchain component, not a cute dev toy.

Here’s the minimum checklist I’d want:

1) **Always run tests after merge**

Yes, you should already do that. But when merges get more automatic, you’ll be tempted to stop thinking.

2) **Limit scope via `.gitattributes`**

Don’t roll it out on everything. Start with safe files:

- JSON/YAML/TOML
- “append-only-ish” modules

3) **Keep the fallback path obvious**

If it ever looks suspicious, you should be able to disable it and do a normal merge without drama.

4) **Make “merge correctness” visible**

If your team is using agents, you want CI that tells you *what got auto-resolved*, not just “green or red”.

Even a small note in the merge output helps people build trust.

## Why I like the idea anyway

This is one of those improvements that doesn’t feel “AI”. It’s just engineering.

But it’s clearly being pulled into existence by AI workflows:

- more parallel edits
- more changes per hour
- more code moved around mechanically

Git’s merge model was designed for humans editing text. We’re now mixing humans + generators + refactors at volume.

Entity-level merge feels like the first honest answer to: “what if the unit of change is a function, not a line?”

Will Weave become a standard tool? No clue.

But the direction is right: if we want parallel code generation to be real, our merge layer can’t keep acting like it’s 2008.

---

**References:**
- [Weave repository and README (entity-level semantic merge driver)](https://github.com/Ataraxy-Labs/weave)
- [tree-sitter (incremental parsing system used for code structure)](https://tree-sitter.github.io/tree-sitter/)
- [Git docs: defining attributes for paths (used to wire merge drivers)](https://git-scm.com/docs/gitattributes)
