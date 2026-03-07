---
layout: post
title: "Ki Editor and the bet on structural editing: treat code like a tree, not a string"
date: 2026-03-07 21:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Ki Editor homepage](/img/posts/2026-03-07-ki-editor-structural-editing-01.webp)

There’s a certain kind of “editor idea” that shows up every few years, gets a cult following, and then quietly disappears.

**Structural editing** is one of those.

The pitch is simple: code is an AST (a tree), so stop pretending it’s just a string. Let me move, select, and transform *syntax nodes* as a first‑class operation, instead of playing regex/selection Tetris.

Ki Editor is the newest project I’ve seen that treats this idea seriously—*and* adds a twist that makes me pause: **multi‑cursor + structural operations**.

## Why structural editing never fully “won”
If you’ve ever used paredit in Lisp, or played with tree-sitter aware motions, you already know the dopamine hit:

- You can delete a function argument without breaking parentheses.
- You can select “the next syntactic thing” without counting commas.
- Refactors feel like you’re manipulating meaning, not characters.

And yet… most of us still live in plain-text editors.

My guess (as someone who still enjoys Vim motions but also debugs production systems for a living): structural editing fails when it demands **a new mental model** for every tiny action.

It’s not enough to be “more correct.” It has to be **faster with my existing muscle memory**, or I’ll bounce.

## The part that actually matters: selection is the API
Ki Editor’s tagline is basically telling you what it cares about: *multi-cursor combinatoric modal editor*.

Under that marketing-y phrase is a real idea:

- modal editing isn’t just “normal mode vs insert mode”
- it’s a **consistent selection system**

If selection is consistent across words/lines/nodes, a lot of editor operations stop being special cases.

So instead of learning 40 bespoke refactor commands, you learn a smaller set of operations that compose.

This is the “language” I think structural editors need to speak.

## Multi-cursor + AST operations is a dangerous combo (in a good way)
Multi-cursor editing is already powerful, but it’s also famously easy to misuse.

When multi-cursor operates on *characters*, you can accidentally do perfect synchronized nonsense.

When multi-cursor operates on *syntax nodes*, two things get interesting:

1) You can apply the same transformation across many places while preserving structure.

2) You can make refactors feel like **batch operations on semantics**.

That’s not just "nice". It’s the difference between:

- “I hope I didn’t miss a comma”
- and “I changed every call site’s second argument expression”

If Ki Editor can make that reliable, it’s a meaningful step forward.

## My skeptical question: what’s the escape hatch?
Every strict system needs a pragmatic exit.

Sometimes you *do* want to edit the raw string.
Sometimes you’re in a file format the parser doesn’t understand.
Sometimes your code is half-written and the AST is invalid because… you’re mid-thought.

The editor that wins isn’t the one that says “never touch text.”
It’s the one that says:

- **when the tree is valid, I’ll give you power**
- **when it isn’t, I won’t punish you**

That “don’t punish the user” part is where most ambitious editors die.

## Why I care right now (yes, because of AI)
LLMs are pushing us toward higher-level manipulation:

- generating code
- refactoring chunks
- moving logic between modules

In that world, a text editor that only understands characters feels… increasingly low-level.

Structural editing isn’t about making humans type faster.
It’s about making humans **review and reshape** code faster.

And if you’ve shipped anything non-trivial, you already know: *review* is the real bottleneck.

---

**References:**
- [Ki Editor documentation and introduction](https://ki-editor.org/)
- [Ki Editor source code repository on GitHub](https://github.com/ki-editor/ki-editor)
