---
layout: post
title: "Filesystems Are Having a Moment (and It’s Not Just Nostalgia)"
date: 2026-03-07 22:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A filesystem as the boring, universal interface](/img/posts/2026-03-07-filesystems-are-having-a-moment-01.webp)

I keep seeing the same idea popping up across the “agent” ecosystem: **stop inventing more plugins/tools, just give the agent a filesystem**.

My first reaction was honestly a bit cynical. Filesystems? In 2026? Are we doing this because we’ve collectively accepted that half of “agent memory” is just… `README.md` with a new haircut?

But after reading a recent piece on why filesystems are suddenly trendy again, I think there’s something real here — and it’s not “databases are dead.” It’s more like:

> **In the agent era, the filesystem is becoming the lowest-friction API for persistence.**

## 1) Context windows aren’t memory. They’re a whiteboard.

If you’ve used a coding agent in a real repo, you know the feeling: everything is going fine, then you hit the “context is getting compacted” cliff.

That’s not a “bigger context window” problem. That’s a **memory architecture** problem.

- Context windows are ephemeral.
- They don’t have selective recall.
- They don’t have a durable place to store decisions.

So people do what humans have always done when they don’t trust their short-term memory:

- write it down
- keep it close to the work
- reread it later

And the most universal place to do that is… files.

## 2) Files win as an interface (even if you still need a database underneath)

A filesystem is boring in the best way:

- every tool can read it
- every OS has it
- every LLM “understands” it
- it composes with everything (git, diff, grep)

So it’s not surprising that the most successful “serious” agents right now tend to be the ones that can read and write project files locally.

But I don’t buy the extreme take that files replace databases.

I think the clean mental model is:

- **files as the interface** (what the agent touches)
- **databases as the substrate** (indexes, concurrency, search, dedupe, recency)

If you’ve ever implemented “quick semantic search over a folder,” you know how the story ends: you reinvent a mini database, then you pretend you didn’t.

## 3) A sharp warning: bad context files can be worse than none

One detail I didn’t expect: there’s research suggesting repo-level context files can *reduce* task success rates while increasing cost.

That matches a vibe I’ve seen in practice:

- give an agent a long rules document
- it becomes overly obedient
- it explores everything
- it does “all the right steps”… and misses the actual fix

So the move isn’t “write more onboarding docs for the model.”

The move is:

> **keep the persistent context minimal, concrete, and testable.**

If a rule doesn’t change what the agent should do *this week*, it probably doesn’t belong in the agent’s hot path.

## 4) The file format is the API (and that’s the part I actually care about)

The interesting angle isn’t the filesystem itself. It’s what happens when **instructions, skills, and memory become plain files**.

Because once things are files:

- they’re portable
- they’re auditable
- they survive tool churn

That feels like a small but meaningful push back against the “everything is trapped inside a SaaS chat history” direction.

I’m not idealistic enough to think fragmentation disappears (we already have multiple competing “agent instruction” filenames). But I do think the trend is pointing at a future where:

- your project constraints live next to the code
- your preferences live in a file you own
- your agent’s capabilities are composable markdown, not a plugin marketplace

And that’s… oddly healthy.

---

**References:**
- ["Filesystems are having a moment" (original essay)](https://madalitso.me/notes/why-everyone-is-talking-about-filesystems/)
- [LlamaIndex: "Files Are All You Need" (filesystem-first agent memory)](https://www.llamaindex.ai/blog/files-are-all-you-need)
- [LangChain: how agents use filesystems for context engineering](https://blog.langchain.com/how-agents-can-use-filesystems-for-context-engineering/)
- [ETH Zürich paper on repository-level context files and agent performance](https://arxiv.org/abs/2602.11988)
- [Dan Abramov: a social filesystem (files as interoperable personal data)](https://overreacted.io/a-social-filesystem/)
