---
layout: post
title: "A simple web we own: the boring way to stop being the product"
date: 2026-02-23 20:20:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![A wireless mesh diagram — a reminder that networks don’t have to be centralized](/img/posts/2026-02-23-a-web-we-own-01.webp)

Most “free” platforms have the same deal hidden in the fine print:

You can publish, sure. But you’re also **a tenant**.

And tenants don’t get to complain when the landlord changes the rules.

I read Robert Doiel’s essay about building *“a simple web we own”* and it hit a nerve. Not because it’s some grand revolution plan — it’s the opposite. It’s basically saying:

- the web is already decentralized
- what got centralized is the *publishing experience*
- and we keep accepting complexity as if it’s physics, not product choices

I’m not pretending everyone should become a sysadmin. But I do think there’s a middle path between “run your own Kubernetes” and “live inside Substack forever.”

## The core problem isn’t tech — it’s default settings

The internet didn’t *force* us into a world where:

- publishing means signing up for a platform
- discovery means begging an algorithm
- ownership means “export your data (maybe)”

We just drifted into it because it was convenient, and because convenience got packaged as the only option.

The part that’s quietly depressing is: even when people try to exit Big Platform, they often rebuild the same centralized product… but distributed. Which is cool, but it still assumes you need the same “everything app” experience.

Doiel’s take is simpler: **make the authoring path boring again.**

Write Markdown. Generate HTML. Ship.

That’s it.

## Why Markdown + static sites are still underrated in 2026

I know, I know. Static site generators are not new. This is not news.

But what’s new (or at least newly relevant) is the *reason* to care.

A “simple web” stack gives you three things platforms don’t want you to have:

1. **Exit is cheap**
2. **Your identity is portable** (domain + RSS)
3. **You can keep things small on purpose**

And that last one matters. When systems get big, they become political. They accumulate incentives. Then you wake up one day and realize your “publishing tool” is actually an ad network.

That’s the origin story of a lot of enshittification.

## A practical definition of “owning” your web presence

When I say “own,” I don’t mean “host everything yourself on a Raspberry Pi in a cave.”

I mean:

- you control the **domain**
- your content is stored in a format you can move (plain text + images)
- publishing does not depend on a single company’s mood

If your stack meets those constraints, you’re already playing a different game.

## My boring checklist (for engineers who don’t want a second job)

If you want the “simple web we own” vibe without turning it into a lifestyle project, I’d start here:

- **Buy a domain you actually like** (it’s your username on the open web)
- **Write in Markdown** (any editor, any OS)
- **Use a static generator you’ll still tolerate in 3 years**
  - if you like “it just works,” something like Jekyll or Hugo is fine
  - if you like maximum control, plain Markdown → HTML via something like Pandoc also works
- **Host it somewhere boring**
  - GitHub Pages is a decent default because it’s low-maintenance and the output is just files
- **Make sure you have RSS**
  - the moment you have RSS, you’ve stopped being 100% dependent on platform distribution

The key is not which tool wins the benchmark. The key is whether the *output* is simple enough that you can leave.

## The uncomfortable part: platforms optimized for creators still don’t optimize for ownership

A lot of platforms honestly do help creators. They reduce friction.

But they also bake in subtle dependencies:

- you can’t bring your audience with you cleanly
- URLs are not truly yours
- moderation / policy changes can nuke years of work
- business incentives always creep in

So for me, this isn’t about “platform bad.” It’s about **having a small, boring escape hatch**.

Because once you have an escape hatch, you can use platforms *as distribution*, not as your home.

That flips the power dynamic.

---

**References:**
- [Robert Doiel’s essay: “A simple web we own”](https://rsdoiel.github.io/blog/2026/02/21/a_simple_web_we_own.html)
- [Pandoc — document conversion tool](https://pandoc.org/)
- [Cory Doctorow on “enshittification” (Wikipedia summary)](https://en.wikipedia.org/wiki/Enshittification)
