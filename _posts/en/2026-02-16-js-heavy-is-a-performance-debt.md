---
layout: post
title: "JS-heavy isn’t a stack. It’s performance debt you refinance forever."
date: 2026-02-16 07:00:00 +0000
categories: [Engineering, Tech]
tags: [Engineering, Tech]
author: Tommy
excerpt: "Shipping lots of client-side JavaScript isn’t just a one-time cost. It’s a compounding maintenance and performance liability: dependency bloat, fragile discipline, hard-to-debug regressions, and users paying CPU tax for your architecture. A server-centric baseline is boring — and that’s why it works."
image: /img/posts/2026-02-16-server-centric-web-performance.webp
lang: en
---

I keep seeing the same pattern across teams:

They adopt a **JS-heavy** approach because it feels fast at the beginning.

And then, two quarters later, performance becomes this weird “ongoing initiative” that never ends.

Not because everyone is incompetent.

Because **the architecture creates compounding interest**.

This post is my attempt to say the quiet part out loud:

**JS-heavy isn’t a stack. It’s performance debt you refinance forever.**

(Yes, you can make it work. No, it doesn’t stay easy.)

## Five angles I use to evaluate a JS-heavy product decision

1) **Business angle:** are we paying real money (conversion, retention, support load) for a UX that could’ve been “fast enough” with a boring baseline?

2) **Engineering angle:** how much glue code are we signing up for (hydration edge cases, state syncing, routing, caches, invalidation)?

3) **Risk angle:** who owns performance? A dashboard? A heroic staff engineer? Or “everyone should be careful” (which means no one owns it)?

4) **Performance angle:** are users paying CPU + memory tax in the critical path, or is most work happening on the server where it’s predictable?

5) **Future-me angle:** if the team doubles, does the system get safer… or does it get easier to accidentally ship a 400KB regression?

## The compounding costs nobody puts in the pitch deck

### 1) Dependency bloat is not a bug. It’s the default.

In JS-heavy apps, shipping dependencies to the browser is normal.

That sounds fine until you remember two things:

- npm packages grow over time
- upgrades are forced (security patches, transitive deps, “framework major” cycles)

The worst part is: regressions don’t show up as a clean “you just added 120KB”.

They show up as:

- a slightly worse LCP on mid-range Android
- sporadic input lag on a heavy page
- “the app feels sluggish lately” tickets

It’s death by a thousand paper cuts.

### 2) It’s fragile: one innocent import can nuke months of discipline

A lot of performance work in JS-heavy codebases is basically “team discipline as a system design”.

You can do everything right:

- lazy-load
- route-split
- memoize
- avoid top-level imports

…and then one well-meaning PR adds a static import to a shared entry point and suddenly:

- parsing time spikes
- hydration slows down
- the baseline is worse for every user

That’s not “bad developer behavior”.

That’s a fragile system.

### 3) Debugging gets harder because you add layers between you and the platform

Browser devtools are genuinely great.

But JS-heavy stacks often add their own abstraction layers and tooling that don’t compose well with the underlying platform.

Now you’re correlating:

- browser profiles
- framework profiles
- bundler output
- runtime behavior

…and the “why is this slow” answer becomes a scavenger hunt.

### 4) Users pay the bill in the worst place: the critical path

When you move more work to the client, you move it to:

- variable CPU
- variable memory
- variable network
- variable thermal throttling

On the server, you can at least buy predictability.

On the client, your performance strategy becomes “hope the user’s phone is okay today”.

## The boring alternative that keeps winning: server-centric baseline

I’m not saying “never use JavaScript”.

I’m saying: **start from a baseline where the product is usable without a heroic amount of client runtime**.

A server-centric approach tends to:

- stream HTML early
- cache aggressively
- ship less JS by default
- degrade gracefully

And the big underrated win:

**it reduces the surface area where regressions can hide**.

## A practical rule of thumb I like

If you can make the core experience work as:

```text
request -> server renders -> HTML ships -> user can do the primary action
```

…then JavaScript becomes an enhancement layer.

Not the oxygen supply.

That’s the difference.

## My bottom line

JS-heavy isn’t evil.

It’s just not “free”, and it’s not a one-time cost.

If you choose it, be honest about what you’re buying:

- a faster start
- for a higher probability of long-term performance firefighting

Sometimes that trade is worth it.

But if your product wants **predictable performance over years**, boring architecture is underrated.

---

## References

- [“JS-heavy approaches are not compatible with long-term performance goals” (opinionated but grounded)](https://sgom.es/posts/2026-02-13-js-heavy-approaches-are-not-compatible-with-long-term-performance-goals/)
- [Hacker News discussion thread (useful for counterarguments and war stories)](https://news.ycombinator.com/item?id=47029339)
