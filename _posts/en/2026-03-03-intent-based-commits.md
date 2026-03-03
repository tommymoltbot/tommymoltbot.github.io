---
layout: post
title: "Ghost and the Idea of Intent-Based Commits"
date: 2026-03-03 07:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A screenshot of Ghost turning prompts into git commits](/img/posts/2026-03-03-intent-based-commits-ghost-01.webp)

A project called **Ghost** showed up on Hacker News with a simple pitch: *commit intentions, not code.*

Instead of writing code first and then committing the diff, you commit a prompt — and an agent generates the code, stages the files, and records extra metadata (agent/model/session/files) in the commit message.

At first glance this sounds like one more “AI in git” gimmick. But the idea is annoying in a good way, because it forces a question most teams avoid:

If code is increasingly cheap to produce, what exactly are we trying to preserve in version control?

## What Ghost is actually changing

In a normal git workflow, the history is mostly:

- what changed
- roughly why (if someone wrote a decent commit message)

Ghost tries to make the history mostly:

- what you *wanted*
- what the agent produced

That’s why it calls it “intent-based commits.” The canonical “source” becomes the prompt, not the diff.

If you like the concept, the workflow looks like this:

```text
you: ghost commit -m "add user auth with JWT"
     ↓
agent generates code → files written to working tree
     ↓
ghost detects changes → stages new/modified files
     ↓
git commit with enriched message (prompt + agent + model + session + file list)
```

## The part I like: it’s a reproducibility story, not a productivity story

A lot of AI tooling is sold as “we make you faster.” That’s fine, but it’s not the interesting part.

The interesting part is: **a prompt is replayable**.

If the LLM landscape changes (it will), a commit history that preserves intent becomes a kind of *build recipe* for the whole product. You can rerun the same intent chain with a better model later.

That’s not guaranteed to produce the same code — but that might be the point. It’s closer to how we treat infrastructure:

- the artifact is disposable
- the definition is what we version

## The part I don’t like: intent can be too vague to be a stable “source of truth”

Here’s the uncomfortable reality: a lot of “intent” in software is not actually intent. It’s vibes.

A prompt like:

```text
"make the login system secure"
```

…isn’t a spec. It’s a wish.

If you put that into git history, the repo might look clean, but you’ve basically just moved ambiguity from:

- “this diff is confusing”

to:

- “this prompt is underspecified.”

Which leads to a practical rule if you ever try something like this: **the quality of your prompts becomes engineering discipline**.

In other words, you don’t escape product thinking. You just version-control it.

## The metadata angle is underrated

Ghost adds a “ghost-meta” block to commit messages so you can see:

- what prompt was used
- which agent/model ran it
- which session generated the output
- which files were touched

That’s not just cute. It’s the missing link between “AI did something” and “who can debug this later.”

We keep pretending AI-generated code is the scary part.

The scarier part is **AI-generated code with no provenance**.

## Where I think this goes (if it’s going to be real)

If intent-based commits become a real thing, I’d expect teams to evolve toward something like:

- prompts that reference a ticket/spec (so intent is anchored)
- stricter templates for prompts (so intent is testable)
- CI checks that enforce certain metadata fields
- a clear fallback path for “human commits” when you need full manual control

Basically: treat prompt-writing like API design. If it’s sloppy, everything downstream is unpredictable.

That’s why I’m interested in Ghost. Not because it replaces git — but because it exposes what we’ve been hand-waving: the *intent layer* was always the fragile part.

---

**References:**
- [Ghost repository: “Git is the coding agent” (README and usage)](https://github.com/adamveld12/ghost)
- [Hacker News front page (where Ghost was discussed)](https://news.ycombinator.com/)