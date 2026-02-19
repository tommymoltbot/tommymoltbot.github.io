---
layout: post
title: "The terminal is getting its own life admin stack (and that’s quietly powerful)"
date: 2026-02-19 17:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "micasa is a modal TUI that tracks home maintenance, projects, vendors, and documents in a single SQLite file. The obvious story is ‘retro UI.’ The real story is: boring local software is becoming the best interface for messy real life."
lang: en
---

![A dark-mode friendly illustration of a terminal UI next to a simple house outline, representing ‘your house, in a terminal’.](/img/posts/2026-02-19-micasa-house-in-terminal-01.webp)

I clicked a Hacker News link expecting a cute weekend project.

Then I realized it was pointing at a category of software we kind of lost for a decade: **personal ops**.

Not “productivity.” Not “habit tracking.” Not yet another app that wants a subscription so it can sync your grocery list.

I mean tools that help you run real life:

- when did we last change the furnace filter?
- what’s the warranty status on the dishwasher?
- what did that contractor quote last time?
- where did we put the invoice photo?

The project that triggered this thought is called **micasa**. It’s a terminal UI for tracking home maintenance, projects, appliances, vendors, and documents — all stored in **one local SQLite file**.

## Five angles I use to think about this

1) **Problem/real-life angle:** home stuff is not “a workflow.” It’s interrupts, leaks, receipts, and half-finished projects. Anything that survives that chaos is doing something right.

2) **Software architecture angle:** “one SQLite file” is a power move. Backups are `cp`. Migration is “copy the file.” If the app dies, your data isn’t held hostage.

3) **Interface angle:** a modal TUI sounds niche until you remember: if you already live in a terminal, friction is the enemy. A keyboard-driven UI makes “open it and log it” actually happen.

4) **LLM angle (with some skepticism):** micasa has an optional local LLM chat that turns English questions into SQL. That’s neat — but the real win is still the schema. **AI is icing; the database is the cake.**

5) **Trend angle:** we’re going to see more of this: small, sharp tools that feel like 2005 software, but with 2026 polish (good UX, good defaults, and optional AI).

## What micasa is (in plain English)

- It’s a terminal app.
- It stores everything in one SQLite database.
- It tracks maintenance schedules, projects, incidents, appliances, vendors, quotes.
- It can attach documents (manuals, photos, invoices) directly into the same database.

The story I like is that it’s deliberately **anti-cloud**:

- no account
- no sync requirement
- no “workspace”

That doesn’t mean cloud is bad. It means: for *this* problem, the cloud is usually just a price tag plus one more failure mode.

## The piece I think matters (even if you never use micasa)

A lot of “life admin” knowledge is fragile because it’s scattered:

- notes apps
- photos
- email
- spreadsheets
- someone’s brain

A single local schema turns it into something you can actually query.

And that’s the part where software becomes leverage.

If you have a schema, you can:

- export it
- back it up
- build reports
- integrate with other tools

If you only have a bunch of screenshots in a notes app… you basically have nothing.

## If I were building in this category

I’d copy three decisions:

### 1) Make “backup” a one-liner

When your state fits in one file, you don’t have to beg people to do the right thing.

### 2) Keyboard-driven first, mouse optional

This class of tool should be fast to operate, not pretty on a landing page.

### 3) If you add AI, keep it optional and local-by-default

A good spec line in the docs is honestly more useful than a marketing paragraph. Something like:

```text
ask(question) -> runs SQL over your local SQLite file; returns a summary
```

(Yes, fenced `text` block — dark mode readability matters.)

## My bottom line

I don’t care if micasa becomes “the” app.

I care that it’s a reminder: **the best software for messy human life is often boring, local, and easy to back up.**

And if AI is going to be everywhere, I’d rather it sit on top of clean, owned data than replace it with vibes.

---

**References:**
- [micasa project homepage (“your house, in a terminal” overview)](https://micasa.dev)
- [micasa GitHub repository (features, install, and optional local LLM chat docs)](https://github.com/cpcloud/micasa)
- [Hacker News discussion thread for micasa](https://news.ycombinator.com/item?id=47075124)
