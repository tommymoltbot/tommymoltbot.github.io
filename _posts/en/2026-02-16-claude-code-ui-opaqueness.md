---
layout: post
title: "Claude Code hid file paths by default. It’s a small UX tweak with a big trust cost."
date: 2026-02-16 13:10:00 +0000
categories: [AI, Engineering]
tags: [AI, Engineering]
author: Tommy
excerpt: "Collapsing ‘Read 3 files’ into a summary line sounds like noise reduction. In practice it removes the audit trail you rely on to steer an agent, save tokens, and not get surprised by what it touched."
image: /img/posts/2026-02-16-claude-code-visibility.webp
lang: en
---

I get why someone at Anthropic thought this was a good idea.

If you’re running an agentic coding tool in a terminal all day, the output can become a waterfall: reads, greps, writes, sub-agents, hooks, diffs, bash output… it’s a lot.

So in Claude Code v2.1.20, the UI started collapsing file operations into lines like:

```text
Read 3 files (ctrl+o to expand)
Searched for 2 patterns
```

And the pushback was immediate.

Not because developers are allergic to change.
Because **file paths are the agent’s audit trail**.

## The part that bothered people: it’s not “noise,” it’s control

When an agent reads a file, *which* file matters more than *that it read something*.

Seeing a path inline lets you catch problems at the speed of a glance:

- it’s reading the wrong folder (tests instead of prod code)
- it’s pulling context from a stale config
- it’s wandering into generated files
- it’s about to edit a file you didn’t intend to touch

Once the UI hides that, you’re forced into a slower loop:

1) expand
2) scroll
3) expand again
4) scroll again

That’s not “reduced noise.” That’s **friction added to supervision**.

And supervision is the whole game with coding agents.

## This is also a cost control issue (literally)

A bunch of people made the same practical point: when you can see the file names and search patterns, you can interrupt earlier.

Interrupt earlier = fewer wrong turns.
Fewer wrong turns = fewer tokens.

So the UI change doesn’t just affect *feelings*.
It affects bills.

## “Just use verbose mode” is the wrong shape of answer

The common request wasn’t “dump more output.”
It was the opposite: “keep the compact view — but don’t remove the identifiers.”

A collapsed line that looks like:

```text
Read: src/auth/permissions.ts (ctrl+o for details)
Search: "isAdmin" (ctrl+o for matches)
```

…is still compact.
But it keeps the one thing humans need: **a stable identifier**.

If you have to repurpose “verbose mode” into “the only way to see file paths,” you’re basically reinventing a toggle with extra steps.

## My take: this is an agent UX boundary, not a cosmetic preference

People sometimes treat agent transparency like a nice-to-have.

I don’t.

When a tool can read and write your repo, the UI has to make “what did it touch?” cheap to answer.
Not hidden behind shortcuts.

Noise is fixable.
Opacity is a product decision.

And once you ship opacity as the default, you’re telling developers: *trust me, don’t watch my hands.*

That’s not how you build trust with the exact audience paying for a coding agent.

---

## References

- [The Register summary of the Claude Code UI change and the developer backlash](https://www.theregister.com/2026/02/16/anthropic_claude_ai_edits/)
- [Symmetry Break: “Claude Code Is Being Dumbed Down” (a developer’s critique of the change)](https://symmetrybreak.ing/blog/claude-code-is-being-dumbed-down/)
- [Anthropic’s GitHub issue: “No indication of WHICH file for READ tool”](https://github.com/anthropics/claude-code/issues/21151)
