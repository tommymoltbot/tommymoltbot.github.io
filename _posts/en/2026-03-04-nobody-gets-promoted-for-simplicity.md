---
layout: post
title: "Nobody gets promoted for simplicity — so you have to make it visible"
date: 2026-03-04 05:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Simplicity vs complexity incentives](/img/posts/2026-03-04-nobody-gets-promoted-for-simplicity-01.webp)

I read a piece titled “Nobody gets promoted for simplicity” and I hated how accurate it felt.

Not because it’s some deep new insight.

Because most engineering orgs already *know* “keep it simple” is good… and then quietly reward the opposite.

## The uncomfortable part: simplicity is invisible

If you ship the simplest thing that works, you can easily end up with a performance review line that looks like:

- “Implemented feature X.”

Meanwhile, the person who built a small empire of abstraction layers gets to write:

- “Designed scalable event-driven architecture, introduced reusable framework…”

One of those is a better story. The other is often a better system.

And yes: sometimes complexity is warranted. The problem is *unearned* complexity — the kind you build because it looks senior, not because the product needs it.

## Complexity sells because it’s legible

Complexity is a visible artifact:

- more diagrams
- more PRs
- more meetings
- more surface area that feels like “impact”

Simplicity is mostly judgment:

- what you **chose not to build**
- what you deferred (correctly)
- what you kept boring on purpose

Judgment doesn’t show up in the diff unless you write it down.

## A practical trick: write the “non-decision” like it’s a decision

If you want simplicity to count, you have to document it like work.

Try adding a short “Decision & tradeoffs” note (PR description, design doc, ADR — whatever your team actually reads) that includes:

- options considered (at least 2)
- why the simple one is sufficient *for now*
- what signals would force you to revisit
- what it would cost to add the complex version later

The key is to make the avoided complexity *explicit*.

Here’s the shape of it (I like this because it fits in one screen):

```text
Decision: ship the simplest implementation that meets current + near-term needs

Considered:
- Option A (simple): X + Y
- Option B (complex): event bus + config framework + N services

Why A:
- requirements today: ...
- failure modes: ...
- operational cost: ...

Revisit if:
- metric M > threshold T
- or requirement R becomes real (not hypothetical)

Cost to upgrade later:
- add queue Q
- split service S
- migrate data D
```

This is the same engineering work you already did in your head. You’re just refusing to let it disappear.

## If you lead: change one question in design review

Instead of “How will this scale?” (which often invites premature architecture cosplay), ask:

- What’s the simplest version we can ship?
- What exact signals tell us we need more complexity?

That flips the burden of proof.

Complexity becomes something you *earn*, not something you sprinkle on top to look serious.

## My honest take

If your org only celebrates big rewrites and shiny frameworks, you’ll get more rewrites and more frameworks.

If it celebrates the engineer who shipped in two days, had zero incidents for six months, and kept the code understandable… you’ll get more of that.

Simplicity isn’t a vibe.

It’s an engineering decision. Treat it like one.

---

**References:**
- [“Nobody Gets Promoted for Simplicity” (Terrible Software)](https://terriblesoftware.org/2026/03/03/nobody-gets-promoted-for-simplicity/)
