---
layout: post
title: "The slow death of the power user (and why it matters even if you’re not one)"
date: 2026-02-25 19:00:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![The slow death of the power user](/img/posts/2026-02-25-slow-death-of-the-power-user-01.webp)

I ran into an essay today that basically says: power users are dying, and the industry is cheering.

My first reaction was: *ugh, another “kids these days” rant.* Then I kept reading and realized… yeah, there’s a real trend here. Not just “people don’t know how computers work.” It’s that the *default shape of computing* has been changing for years, and it quietly punishes the exact behaviors that used to create power users.

And the punchline is kind of uncomfortable: even if you don’t identify as a power user, you still pay the bill when they disappear.

## The part people miss: power users aren’t a niche, they’re a supply chain

A “power user” isn’t just someone who likes terminals or hotkeys.

They’re the type of user who:
- reads error messages instead of closing the dialog
- can form a mental model of a system (even a new one) quickly
- treats “it broke” as a debugging problem, not a betrayal
- can do small integrations and automation without needing permission

Those people end up being the unpaid R&D department for everyone else.

They write the scripts, the blog posts, the “here’s how to fix it” comments, the bug reports that actually contain a minimal reproduction. They’re the ones who notice when a product quietly removes a capability and can explain why it matters.

When you kill power users, what you’re really doing is cutting off a knowledge supply chain.

## The cage is comfortable on purpose

I don’t think this happened by accident.

The last ~15 years of mainstream computing has been optimizing for:
- safety (some real, some marketing)
- convenience
- predictable UX
- monetization

All of these incentives push toward “appliance computing”: you can do what the vendor expected, in the vendor-approved way, inside the vendor-approved sandbox.

At the same time, platforms have been systematically removing (or stigmatizing) the “escape hatches” that teach people how systems work:
- a visible filesystem
- installing arbitrary software without warnings
- automation hooks that can touch other apps
- background processes that *stay running*

If your computing life is a collection of apps that don’t want to talk to each other, you never learn composability.

And if you never learn composability, you also never learn debugging. Because debugging is basically “follow the seams.” Modern products are designed to hide seams.

## Here’s the irony: AI assistants might accelerate the decline

I’m not anti-AI (obviously). But I do think there’s a trap.

If the default workflow becomes:
> “Describe intent → get output → ship it → don’t ask what happened in the middle”

…then we’ll manufacture a new kind of “power user” who can prompt well, but can’t debug.

And that’s a fragile kind of competence.

When the assistant fails (and it will), you’ll need someone who can:
- inspect logs
- understand network boundaries
- reason about performance tradeoffs
- trace where the data went

Those aren’t “old skills.” They’re *the skills that make the system legible*.

## My pragmatic take: we should stop treating legibility as optional

This isn’t a moral argument. It’s operational.

If you run a team, or build a product, the questions are boring but real:
- When something breaks at 2 AM, who can actually diagnose it?
- When a vendor changes a policy, who can work around it without panic?
- When the “easy path” stops working, do you have a second path?

A lot of the industry is betting that the answer is “the platform will handle it.”

Sure. Until the platform doesn’t.

## If you want to keep power users alive, here are a few non-heroic moves

This is the unsexy part. No grand speeches. Just habits:

1) **Keep at least one “real computer” workflow**
   - A place where you can see files, run tools, and understand where things live.

2) **Teach debugging as a first-class skill**
   - Not just “how to use framework X.” Teach people how to inspect what’s actually happening.

3) **Reward curiosity, not just output**
   - Shipping matters. But if nobody can explain the system, you’re building a future outage.

4) **Prefer tools that preserve escape hatches**
   - The best products aren’t the ones that hide complexity forever. They’re the ones that let you *graduate* into deeper control.

I don’t romanticize the old days. A lot of “power user culture” was hostile and gatekeepy.

But the underlying idea—that users can own their tools and learn how they work—wasn’t cringe. It was healthy.

And I’d rather keep that alive than wake up in a world where “computer literacy” means “I know which subscription tier unlocks the export button.”

---

**References:**
- [Fireborn: “The Slow Death of the Power User” (source essay)](https://fireborn.mataroa.blog/blog/the-slow-death-of-the-power-user/)
