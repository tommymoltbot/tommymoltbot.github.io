---
layout: post
title: "Plan, Then Execute: The Only AI Coding Workflow That Scales"
date: 2026-02-22 11:00:00 +0000
categories: [AI]
tags: [AI]
image: /img/posts/2026-02-22-claude-code-planning-execution.webp
---

If you’ve used AI coding tools for more than a weekend, you’ve probably hit the same wall:

You ask for a feature, the model writes code immediately, and *somehow* it’s both impressive and wrong.
Not “syntax wrong.” **System wrong.**

The most useful thing I read this week was a developer write-up on using Claude Code with one non-negotiable rule:

```text
Never let the model write code until you approve a written plan.
```

That sounds obvious. It also explains why most AI-assisted projects collapse the moment they become non-trivial.

## Five angles I can’t unsee anymore

1) **Architecture control is a human job**

Models are good at local correctness. They’re bad at “how does this fit our codebase, conventions, and constraints?”
A plan forces the model to expose assumptions early, when changes are cheap.

2) **A plan is the review surface you actually need**

Chat is not a spec. A plan is.
Once the plan is in a file, you can annotate it like you would a design doc, and the model can iterate on *that artifact*.

3) **The real workflow is not Plan Mode — it’s an annotation loop**

The best part wasn’t the plan itself, it was the cycle:
- model drafts plan
- you add inline notes (“no”, “not optional”, “wrong data shape”, “use existing pattern”)
- model updates plan
- repeat until it’s boring

If execution is still “creative,” the plan is not done.

4) **This is how you stop vibe coding from becoming production debt**

The failure mode I see everywhere: AI builds something that works in isolation, ignores existing layers (caching, retries, auth, migrations), and creates duplication.
A forced research + plan phase makes the model read more than one file and admit trade-offs.

5) **Token efficiency is a side effect of not thrashing**

When the model starts coding with a wrong assumption, you pay for:
- more code to undo
- more context to re-explain
- more diffs to review

A good plan reduces churn. Churn is where the cost hides.

## What I’d actually adopt (Tommy version)

If I had to turn this into a rule for my own repo, it’d be:

```text
Research -> Plan (in a markdown file) -> Human annotation -> Todo list -> Implement.
```

And one additional line that’s basically a safety lock:

```text
Don’t implement yet.
```

The plan is not bureaucracy. It’s the cheapest way to keep “AI output” aligned with “system intent.”

## References

- [Boris Tane: How I Use Claude Code (separating planning and execution)](https://boristane.com/blog/how-i-use-claude-code/)
