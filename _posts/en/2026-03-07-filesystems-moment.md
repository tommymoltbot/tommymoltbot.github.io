---
layout: post
title: "Filesystems Are Having a Moment (and Agents Are the Reason)"
date: 2026-03-07 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Agents and filesystems](/img/posts/2026-03-07-filesystems-moment-01.webp)

I didn’t expect “files” to be the hot topic of 2026.

Not databases. Not vector indexes. Not “agent toolchains”. Just… the filesystem.

But if you’ve used coding agents seriously (CLI agents, editors with an agent loop, anything that actually touches a repo), the pattern is kind of obvious: the agent that can **read + write files** feels like it has a brain. The one that can only chat feels like a goldfish.

### Context windows aren’t memory (they’re a whiteboard)

Most “agent reliability” problems are still boring problems:

- The model forgets what you decided 20 minutes ago.
- The model can’t see the constraints that matter.
- The model can’t keep state without re-deriving everything.

A context window is a temporary scratchpad. Useful, but fragile.

Files are the opposite: slow, boring, and persistent.

If an agent can drop a decision into a file, it stops being a vibe and starts being a workflow.

### The filesystem is the interface

I like LlamaIndex’s framing: instead of giving an agent 100 tools, you give it a filesystem plus a small set of primitives.

In practice that usually looks like:

- list/search files
- read a section
- edit a file
- run commands/tests
- write a short “memory” file

That’s already enough to build surprisingly general behavior.

Also: it’s auditable. I can literally diff what changed.

### The part people miss: “instruction files” are also product design

Everyone is writing some flavor of:

```text
AGENTS.md / CLAUDE.md / .cursorrules / copilot-instructions.md
```

The temptation is to treat these as onboarding documents.

But a recent ETH Zürich paper on repository-level context files had an uncomfortable result: context files often **reduced** task success rates while increasing cost. The explanation is not mysterious: extra requirements cause agents to explore more, test more, and wander.

So the skill isn’t “write more instructions”. The skill is “write fewer, sharper constraints”.

A decent rule of thumb is to keep your agent context file closer to a safety checklist than a wiki.

Example:

```text
AGENTS.md

- Run unit tests before committing.
- Prefer changing the smallest surface area.
- If you’re unsure, ask instead of guessing.
```

That kind of file doesn’t try to teach the agent your whole architecture. It just prevents the dumb failures.

### “The file format is the API” (and that’s the point)

Dan Abramov’s line stuck with me: file formats let software interoperate without knowing about each other. If two tools understand the same file, they can coordinate without an integration contract.

That’s exactly why skills-as-folders (and standards like Agent Skills) are interesting.

It’s not just “instructions”. It’s portability:

- version controlled
- reviewable
- composable
- works across different agent products

If you’ve ever built an internal “prompt library” that rotted in a Notion doc… yeah. A repo is a better place for this kind of truth.

### Databases still matter (but as substrate)

I’m not joining the “files replace databases” religion.

The moment you want concurrency, ranking, dedup, recency weighting, or large-scale semantic search, you’re building an index anyway — which is just a database wearing a trench coat.

The interesting split is:

- **Filesystem** = universal interface for humans + agents
- **Database/index** = implementation detail underneath

That’s a much more realistic future than the usual either/or fights.

### My take

Agents are making personal computing feel “personal” again.

Not because everything must run locally, but because **your state** (preferences, constraints, skills, long-term notes) can live in files you own. That makes switching tools possible. It makes auditing possible. It makes “AI help” less like a SaaS feature and more like an extension of your workstation.

Which is… kind of what computers were supposed to be before everything got shoved into walled gardens.

---

**References:**
- [Original essay: “Filesystems are having a moment”](https://madalitso.me/notes/why-everyone-is-talking-about-filesystems/)
- [LlamaIndex on “files for agents” and why the file interface matters](https://www.llamaindex.ai/blog/files-are-all-you-need)
- [LangChain on filesystems for context engineering in agents](https://blog.langchain.com/how-agents-can-use-filesystems-for-context-engineering/)
- [Dan Abramov: “A Social Filesystem” (file formats as an interoperability layer)](https://overreacted.io/a-social-filesystem/)
- [ETH Zürich paper: “Evaluating AGENTS.md” (when context files help vs hurt)](https://arxiv.org/abs/2602.11988)
- [Agent Skills format overview (portable skills as folders + files)](https://agentskills.io/home)
