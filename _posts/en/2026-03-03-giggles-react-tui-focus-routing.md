---
layout: post
title: "Giggles (React TUI): the real feature isn’t the widgets — it’s focus and input routing you can stop thinking about"
date: 2026-03-03 14:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Giggles docs: a batteries-included React framework for TUIs](/img/posts/2026-03-03-giggles-react-tui-01.webp)

Terminal UIs are one of those things that look easy until you actually ship one.

You start with “it’s just a list and a text input”, and then the moment you add a modal, a command palette, and a scrollable viewport, you’re suddenly writing a tiny OS: focus management, keybinding conflicts, input bubbling, scroll locks, and that one cursed bug where `Esc` closes the wrong thing.

So when I saw **Giggles**, a React framework for building TUIs (built on top of Ink), the most interesting claim wasn’t “15 components” or “React 19 compatible”. It was this:

- focus is *hierarchical*
- each component “owns its keys”
- unhandled keypresses bubble to the right parent automatically

That’s the part that decides whether your TUI stays fun at 500 lines, or becomes a maintenance tax at 5k.

## The actual hard part of TUIs: who gets the keys?

Most TUI libraries give you primitives:
- draw text
- read keypresses
- manage a bit of state

What they don’t give you (or they give you as a DIY exercise) is a reliable answer to:

> When the user presses a key, *which* component should handle it?

In a real app, “the currently focused thing” isn’t always obvious. Your tree looks like:

- screen
  - panel
    - list
      - list item
        - inline input
  - modal
  - toast

Now add:
- modal steals focus when visible
- list wants `j/k` navigation
- text input wants `j/k` as literal characters (sometimes)
- command palette wants `/` to open
- `Esc` should back out one layer, not nuke the whole app

This is why focus routing becomes the core architecture decision — not the rendering.

## Why “focus scopes” feel like the right abstraction

Giggles’ docs talk about defining focus regions with a hook like `useFocusScope` and composing them freely, so nested components “just work”.

That maps pretty well to how UI frameworks solved it in the GUI world:
- not one global `onKeyDown`
- not a brittle “if modal open then … else if input focused then …” chain
- but a **tree** where events flow with rules you can reason about

If that works as advertised, it’s not just convenience — it’s what makes larger TUIs possible without a rewrite.

## The hidden productivity win: keybinding ownership

My personal pain point with many TUIs is “global shortcuts” turning into a coordination problem.

You add one feature that needs `Ctrl+K`, and suddenly every other component has to know about it to not break.

A system where components own their keybindings, and keys bubble upward only if unhandled, is basically:

```text
handle_keypress(event) -> handled: boolean
```

It’s boring in the best way. Boring means scalable.

## The part I’m watching: process control + handoff

Giggles also mentions being able to spawn processes and stream output into the UI, and even hand off control to `vim` / `less` and reclaim it cleanly.

That’s a big deal because “TUI apps that wrap real tools” is where things get messy:
- raw mode vs cooked mode
- terminal state restoration
- SIGINT / SIGTSTP edge cases

If they nailed that, it pushes Giggles from “UI toolkit” into “app framework”.

## Where this fits (for me)

If you’re building:
- a local developer dashboard
- an agent runner / orchestrator
- an internal ops tool you don’t want to deploy as a web app

…then a React-ish way to build TUIs with sane focus routing is actually compelling.

Not because React is magical — but because **state + composition** is a good match for UIs, and TUIs are still UIs.

And yeah, I’m still slightly annoyed that we’re recreating 1990s UI problems in 2026.
But at least we’re doing it with better abstractions this time.

---

**References:**
- [Giggles documentation site (Getting Started)](https://giggles.zzzzion.com/)
- [Giggles source repository on GitHub](https://github.com/zion-off/giggles)
- [Hacker News discussion: “Giggles – A batteries-included React framework for TUIs”](https://news.ycombinator.com/item?id=47227171)
