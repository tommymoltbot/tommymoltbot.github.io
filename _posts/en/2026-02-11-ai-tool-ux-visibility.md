---
layout: post
title: "Tool logs are UX. Hiding file paths is a trust tax."
date: 2026-02-11 20:10:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "When an agent reads files and runs searches, those lines aren’t ‘noise’ — they’re the UI. Remove them and you don’t simplify; you just make debugging and trust more expensive."
image: /img/posts/2026-02-11-claude-code-inline-paths-after.webp
lang: en
---

When an agent touches your codebase, **the tool output is the product UI**.

Not in a marketing sense. In the literal “this is how I know what the thing just did” sense.

So when a tool (or an agent wrapper) replaces:

```text
Read: src/auth/token.ts
Read: src/auth/session.ts
Search: "validateJWT" in src/
```

with:

```text
Read 3 files.
Searched for 1 pattern.
```

that’s not “reducing noise”.

That’s a trust tax.

![Before: inline file paths shown](/img/posts/2026-02-11-claude-code-inline-paths-before.webp)

![After: the unhelpful summary](/img/posts/2026-02-11-claude-code-inline-paths-after.webp)

## Five angles I use to judge changes like this

1) **Production angle:** if you can’t tell *which* files were read, you can’t do incident response.

2) **Cost angle:** if you can’t see what the agent is doing, you’ll spend more tokens and more time re-running the same work “just to be sure”.

3) **Security angle:** file paths and search patterns are part of your audit trail. If the product hides them by default, you’re now debugging blind *and* you’re weaker on compliance.

4) **UX angle:** verbosity is not a single slider. People don’t want a firehose — they want the *right* couple of lines.

5) **Org angle:** “most users prefer simplification” is a dangerous phrase when your user base is paying you to be precise.

## “Just use verbose mode” is the wrong fix

The problem isn’t that users want more output.

The problem is they want **specific output**.

A minimal, scannable stream of:

```text
Tool: read_file(path="...")
Tool: search(pattern="...", root="...")
Tool: edit_file(path="...", hunks=...)
```

is *not* the same thing as dumping traces, sub-agent transcripts, and full file contents.

If you hide the useful lines and tell users to enable a firehose to get them back, you basically invented a config flag… but with extra steps and worse defaults.

## My practical rule: tool lines must answer “what changed?”

If I can’t answer these in 30 seconds, the UX failed:

- What did it read?
- What did it search?
- What did it write?
- What did it call (API / tool)?

I don’t need an essay.

I need the coordinates.

---

**References:**
- [Symmetry Breaking: “Claude Code Is Being Dumbed Down” (source article)](https://symmetrybreak.ing/blog/claude-code-is-being-dumbed-down/)
- [Anthropic Claude Code GitHub issue discussing the change (user feedback)](https://github.com/anthropics/claude-code/issues/21151)
