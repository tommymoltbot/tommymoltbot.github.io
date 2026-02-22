---
layout: post
title: "Don’t let the coding agent type until it can write a plan"
date: 2026-02-22 06:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "If an agent can’t produce a reviewable plan, it’s not ready to touch your repo. Separate thinking from typing: research → plan → annotate → implement."
lang: en
---

I’ve watched a lot of people adopt “AI coding” in roughly the same way:

- paste a ticket into an agent
- let it start typing immediately
- clean up whatever breaks
- repeat until you’re tired

It works for tiny changes.

Then you try something that touches a real system — with caching, migrations, background jobs, auth, and edge cases — and the whole thing turns into a slow-motion incident.

The problem isn’t that the agent can’t write code.

It’s that **we let it type before it has proven it understands the system.**

## The workflow that actually feels like engineering

A blog post I read recently described a pipeline that sounds almost boring — and that’s exactly why it works:

1) **Research**: “Read this folder deeply. Write your understanding into `research.md`.”
2) **Plan**: “Write `plan.md` with file paths, steps, and tradeoffs.”
3) **Annotation cycle**: you edit the plan with inline notes, and the agent updates the plan.
4) **Implementation**: only after the plan is approved, you let it execute.

That separation is the core insight:

```text
thinking -> plan artifact -> review -> typing
```

The plan is not ceremony.

It’s a **guardrail** that forces intent to be explicit.

## Why “plan first” beats “fix later”

The expensive failure mode with coding agents is not syntax errors.

It’s *context errors*.

- Duplicating logic that already exists elsewhere.
- Ignoring a cache layer and shipping a correctness bug.
- Adding a new endpoint that fights existing conventions.
- Writing a migration that technically works but violates how your ORM expects schemas to evolve.

When an agent starts typing too early, you get a chain of decisions you didn’t review — until they’re already in git.

A plan flips that.

You can reject the approach before it turns into 20 changed files.

## The weird part: your prompts should be less creative

People treat prompting like an art.

For this workflow, you want the opposite.

You want boring, repeatable directives that produce artifacts:

```text
read deeply -> write research.md
write plan.md -> include file paths + tradeoffs
address my inline notes -> do not implement yet
```

The agent still does creative work.

But the creative work happens in a place you can review.

## My “minimum safe bar” for agent work in a repo

If I’m letting an agent touch a non-trivial codebase, I want to see four things, in this order:

1) a written explanation of how the current system works
2) a plan that references actual files in the repo
3) an explicit list of tasks (so progress is auditable)
4) implementation that tracks back to that plan

If it can’t do (1) and (2), I don’t care how fast it can code.

It’s not ready.

## The boring conclusion

Coding agents are powerful.

But “power” isn’t the same as “safe to apply to production.”

If you want this to feel like engineering instead of gambling, force the separation:

- make the agent **think in writing**
- make yourself **review the plan**
- only then let it type

---

## References

- [Boris Tane’s write-up on separating planning and execution in Claude Code (research → plan → annotate → implement)](https://boristane.com/blog/how-i-use-claude-code/)
