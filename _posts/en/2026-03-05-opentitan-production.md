---
layout: post
title: "OpenTitan shipping in Chromebooks: the kind of security milestone that looks boring (and that’s the point)"
date: 2026-03-05 22:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![OpenTitan shipping in production](/img/posts/2026-03-05-opentitan-production-01.webp)

I have a soft spot for security work that doesn’t *feel* like a product launch.

No shiny “AI demo”. No new chat UI. Just a sentence like: **“OpenTitan is now shipping in commercially available Chromebooks.”**

If you’re not in the weeds, you read that and move on.
If you *are* in the weeds, you pause—because an open-source **silicon root of trust** making it into production hardware is… rare.

## A root of trust is basically “the first domino”

Every modern device security story eventually bottoms out at the same question:

> When the system boots, what is the *first* thing we trust?

If that first thing is compromised, everything above it becomes theater.

That’s why rooting trust in silicon (not just firmware) matters. It’s harder to tamper with. And it gives you a clean anchor for:
- secure boot
- key storage
- attestation
- “this update is really from us” guarantees

This is the stuff you only appreciate after you’ve lived through a supply-chain scare, or a “we can’t be sure what’s running on that fleet” incident.

## “Open source security silicon” sounds like an oxymoron (but it shouldn’t)

Most security chips are black boxes.
Sometimes that’s justified (“don’t give attackers hints”), but a lot of it is just how the industry works: NDAs, proprietary IP, vendor lock-in, and a *lot* of trust-by-contract.

OpenTitan is trying to flip that:
- you can review the design
- you can test it
- you can buy it from a partner *or* manufacture it yourself

That last part is the underrated one.
If you’ve ever been dependent on a single supplier for a foundational security component, you know how quickly “security” becomes “availability risk”.

## The real flex: shipping quality, not just ideals

What I like about Google’s post is that it isn’t just “open source is good”.
They’re bragging about the unsexy things that make hardware trustworthy:
- design verification discipline
- high functional/code coverage
- huge regression suites
- documentation that’s actually usable

In software, you can ship a shaky v0 and iterate.
In silicon, you *really* don’t get to do that.

So seeing claims like “90%+ coverage” and “40k+ tests nightly” is basically them saying:

> We didn’t just publish a repo. We treated it like a product that can survive reality.

I’m not going to take every metric at face value (it’s still a blog post), but the direction is right.

## Post-quantum secure boot is a funny kind of “future-proofing”

They also mention OpenTitan being the first commercially available open-source root of trust to support **post-quantum secure boot** (via SLH-DSA).

I have mixed feelings here:
- On one hand, PQC in *shipping devices* is legit.
- On the other hand, most orgs can’t even get classic key management right.

But maybe that’s exactly why it belongs in a root of trust.
If you’re going to build a hard-to-change foundation, it’s not crazy to bake in the “we’ll thank ourselves in 5–10 years” crypto.

## The part that matters to engineers: you can build systems that assume less trust

The practical outcome isn’t “Chromebooks are safer” (true, but generic).
The practical outcome is: if a commodity, auditable root of trust exists, more systems can be designed around *verification* instead of vendor promises.

That changes the shape of engineering conversations:
- procurement becomes less political
- multi-sourcing becomes realistic
- audits become less “trust me bro”

It’s the same vibe as reproducible builds in software.
Not a silver bullet—but a huge shift in what’s even possible.

## What I’m watching next

A few things from the announcement that I think are genuinely worth tracking:

1) **Datacenter deployment**

They say bringup for Google’s datacenters is underway. If OpenTitan (or its IP) becomes a standard primitive in server fleets, that’s a bigger deal than Chromebooks.

2) **Second generation with lattice-based PQC**

They mention ML-DSA / ML-KEM on the roadmap. If that lands without turning the chip into a science project, it’ll be a strong signal that “open silicon” can move with the cryptography timeline.

3) **IP reuse (Caliptra)**

I like seeing cross-project reuse called out explicitly. If the ecosystem can reuse *verified* blocks instead of re-inventing security IP from scratch, that’s how you get compounding quality.

At the risk of sounding sentimental: this is the kind of progress I trust more than most “security platform” marketing.
It’s slow. It’s boring. It ships.

---

**References:**
- [Google Open Source Blog: “OpenTitan shipping in production”](https://opensource.googleblog.com/2026/03/opentitan-shipping-in-production.html)
- [OpenTitan project documentation (overview and specs)](https://opentitan.org/documentation/index.html)
- [OpenTitan GitHub repository (lowRISC/opentitan)](https://github.com/lowRISC/opentitan)
- [Hacker News discussion: OpenTitan shipping in production](https://news.ycombinator.com/item?id=47265619)
