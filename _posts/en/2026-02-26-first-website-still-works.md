---
layout: post
title: "The First Website Still Works (and That’s Kind of the Point)"
date: 2026-02-26 08:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A screenshot of CERN’s restored first website homepage](/img/posts/2026-02-26-first-website-still-works-01.webp)

I clicked a link to the *first website* today, expecting a museum piece.
Instead I got something that still… works.

No cookie banner. No “accept all”. No JS bundle that’s larger than the content. Just text and links.

And yeah, it’s almost comically plain. But it also made me think: maybe the web didn’t get “better” as much as it got *heavier*.

## The part that annoys me (in a useful way)

When people romanticize the early web, the vibe is usually “it was simpler back then”.
That’s true, but it’s also not the interesting part.

The interesting part is that **a page built for 1991 is still readable in 2026**.

That means:
- the URL still resolves
- the markup assumptions still hold
- the browser still knows how to render it

This is what “backward compatibility” looks like when it’s accidental but real.

And it’s kind of wild when you compare it to modern web apps where:
- changing a build tool breaks your deployment
- “minor” dependency updates break your UI
- the site loads fine on your laptop but stutters on a mid-range phone

We’re spending *so much engineering budget* on complexity that doesn’t obviously buy users anything.

## What the first website optimized for

If you read about why the web was invented at CERN, it wasn’t “to monetize attention”.
It was “scientists can’t share information cleanly across institutions, and that’s a problem.”

So the original optimization target was basically:
- **interoperability** (any machine, any lab)
- **durability** (links should keep working)
- **decentralization** (no central gatekeeper)

Not “engagement”. Not “conversion”. Not “retention”.

That choice doesn’t make the first site pretty.
It makes it *survive*.

## My uncomfortable takeaway as an engineer

I’m not saying we should go back to plain HTML for everything.
Modern web apps exist for a reason.

But I do think we’ve normalized a bunch of failure modes that should feel embarrassing:
- shipping 5MB to show 2KB of text
- turning “read an article” into “run an app”
- breaking accessibility because a component library updated

The first website isn’t inspiring because it looks cool.
It’s inspiring because it sets an extreme baseline:

> The content is the product, and the delivery mechanism should be boring.

If you’re building something that’s supposed to last—docs, knowledge bases, public info—boring is a feature.

Anyway. If you want to feel both nostalgic and mildly irritated, go click it. It’s still there.

---

**References:**
- [CERN’s restored “first website” entry point (info.cern.ch)](https://info.cern.ch/)
- [CERN explainer: how and why the Web was born](https://home.cern/science/computing/birth-web)
- [Wikipedia overview: World Wide Web history and key dates](https://en.wikipedia.org/wiki/World_Wide_Web)
