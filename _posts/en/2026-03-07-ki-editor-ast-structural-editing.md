---
layout: post
title: "Ki Editor: When Your Editor Treats the AST as the UI"
date: 2026-03-07 14:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Ki Editor homepage](/img/posts/2026-03-07-ki-editor-ast-editing-01.webp)

Every once in a while I see a tool that makes me go: “oh… *this* is what we’ve been trying to do with keybindings for 20 years.”

Ki Editor is a structural editor that leans hard into one premise: **the AST is the thing you should be selecting, moving, and editing** — not just characters.

That sounds like a niche editor-nerd idea. But if you’ve ever burned five minutes trying to delete an argument *and not leave a trailing comma*, you already understand the pitch.

## The problem it’s aiming at (and why I care)

Most editors still make you do this translation step:

- what you *mean*: “remove this argument”
- what you *do*: select some text, hope you didn’t miss whitespace/punctuation, then clean up fallout

Structural editing tries to collapse that gap. Ki’s docs call it “first-class syntax node interaction,” which is fancy wording for: “select the expression, not the letters.”

## What feels different: selection as a real mode, not a plugin vibe

From Ki’s own introduction, the core loop is basically:

- select the largest syntax node under cursor
- expand/shrink to parent/child
- jump between siblings
- delete/duplicate/swap nodes and let the editor handle commas and other glue

If I had to describe the mental model in one line, it’d be:

```text
edit(intent) -> {select_ast_node, apply_operation, keep_syntax_valid}
```

That last part (“keep syntax valid”) is the part that makes this interesting. A lot of “smart editing” features still leave you with a broken buffer you have to fix manually.

## Multi-cursor + AST operations is the killer combo

Multi-cursor alone is already a cheat code for refactors.

But multi-cursor *on syntax nodes* is where it starts to feel unfair:

- delete multiple unused imports and have delimiters cleaned up
- duplicate a node and have separators inserted correctly
- swap siblings without turning the file into a punctuation crime scene

It’s the same reason people love `go fmt` or `rustfmt`: you don’t want to spend willpower on trivia.

## The big dependency: Tree-sitter is both the magic and the tax

Ki’s bet is also its constraint: it works “as long as your language is blessed by the Tree-sitter grammarians.”

That’s honest.

Structural editors live and die by parsing quality. If your grammar is flaky, or your language is “mostly parseable,” you’ll get weird selections at the exact moment you’re trying to move fast.

So the real question for me isn’t “is AST editing cool?” (it is) — it’s:

- does it feel reliable in the languages I use daily?
- how does it behave in half-typed code (the real world)?
- how painful is configuration when you leave the happy path?

## Where I land on it

I’m not switching editors this minute. Modal muscle memory is real.

But I *am* stealing the idea as a benchmark for everything else: if my editor can’t let me say “this argument / this statement / this expression” as a first-class unit, then I’m doing extra work for no reason.

And that’s the kind of friction that adds up — not in a dramatic way, but in the slow, daily way that makes you tired.

---

**References:**
- [Ki Editor homepage](https://ki-editor.org/)
- [Ki Editor: “Why Ki?” (structural editing concepts and key operations)](https://ki-editor.org/docs/introduction/)
- [Ki Editor source code on GitHub](https://github.com/ki-editor/ki-editor)
- [Tree-sitter parsing framework (why grammars matter)](https://tree-sitter.github.io/tree-sitter/)