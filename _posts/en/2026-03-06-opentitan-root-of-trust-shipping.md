---
layout: post
title: "OpenTitan shipping in real Chromebooks: the most boring kind of security win"
date: 2026-03-06 09:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![OpenTitan shipping announcement image (Google Open Source Blog)](/img/posts/2026-03-06-opentitan-shipping-01.webp)

Open source hardware is one of those topics that’s easy to like *in theory*.
In practice? It usually dies somewhere between “cool repo” and “someone has to bet their product on this.”

So this update hit me harder than most: **OpenTitan is now shipping in commercially available Chromebooks.**
Not a demo board. Not a prototype. Actual devices.

That’s… kind of a big deal.
And also the most boring kind of security win — the kind you only notice when it’s missing.

## The five angles I care about

### 1) Shipping beats ideology
I’ve seen a lot of “open” projects where the pitch is basically moral.

But a silicon Root of Trust isn’t a vibes product.
If it’s in your boot chain, it’s in your blast radius.

So my bar is simple:
- does it ship?
- does it get maintained?
- can multiple suppliers build it?

OpenTitan crossing the “in real devices” line is when the conversation changes from *belief* to *operations*.

### 2) “Root of Trust” is not a feature — it’s your security foundation
Most people only hear about RoT when something goes wrong.
But the idea is straightforward: you want a minimal, hardened anchor in silicon so you can trust:
- secure boot
- firmware integrity
- attestation

If that layer is closed, you’re taking a lot on faith.
If it’s open, you at least get a shot at independent review.
(You still need good processes, but transparency is a real lever.)

### 3) Open silicon only matters if the *process* is industrial-grade
The part that made me nod wasn’t the marketing.
It was the boring line items:
- 40k+ tests running nightly
- >90% functional and code coverage for blocks and top-level design

This is the gap most open hardware projects fall into.
They’re “open,” but they’re not *ship-ready.*

If OpenTitan’s community and partners actually keep those gates up over time, that becomes reusable infrastructure — not just one chip.

### 4) Post-quantum secure boot is a signal: they’re designing for the next decade
They explicitly call out PQC secure boot (SLH-DSA) today, and lattice-based algorithms (ML-DSA / ML-KEM) on the roadmap.

I’m not saying “quantum is coming tomorrow.”
I’m saying: if your RoT is supposed to live for years in devices, planning crypto migrations early is sane engineering.

### 5) The supply-chain angle is the real story
A lot of security “innovation” is really just moving trust around.

OpenTitan’s pitch is interesting because it’s not only:
- open design,

…it’s also:
- commoditized RoT,
- multiple sourcing paths (buy vs manufacture),
- and explicit mechanisms like ownership transfer to reduce co-signing.

That’s less about winning benchmarks and more about shrinking the number of places you can get quietly owned.

I’m still not naïve: open source doesn’t automatically mean secure.
But shipping open security silicon in a mainstream product is the kind of step that makes “open” feel less like a philosophy and more like an option teams can actually choose.

---

**References:**
- [Google Open Source Blog announcement: OpenTitan shipping in production](https://opensource.googleblog.com/2026/03/opentitan-shipping-in-production.html)
- [OpenTitan project homepage (overview and docs)](https://opentitan.org/)
- [OpenTitan documentation: ownership transfer](https://opentitan.org/book/doc/security/specs/ownership_transfer/)
- [OpenTitan source repository on GitHub (lowRISC)](https://github.com/lowRISC/opentitan)
