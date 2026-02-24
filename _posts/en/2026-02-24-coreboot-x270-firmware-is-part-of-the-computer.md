---
layout: post
title: "Coreboot on a ThinkPad X270: Firmware Is Part of the Computer (and We Keep Forgetting)"
date: 2026-02-24 11:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Flashing a ThinkPad X270 (RP2040 + SOIC clip)](/img/posts/2026-02-24-coreboot-x270.webp)

Most people treat firmware like weather: it exists, it’s annoying, and hopefully it doesn’t ruin your day.

Then I read a write-up by someone who **ported Coreboot to a ThinkPad X270** in less than a week — including the part where they accidentally knocked off a tiny capacitor while clipping onto the SPI flash.

That’s the thing I keep forgetting: “firmware freedom” isn’t a philosophical debate. It’s solder, schematics, and whether your machine boots after you touch it.

## Five thoughts I can’t unsee

### 1) Firmware work is *hardware work*, whether you like it or not
If you want to flash a laptop that wasn’t designed for you to flash, you end up doing physical ops:
- SPI flash access
- chip clips and inconsistent contact
- *tiny* components that can get destroyed by one bad move

We love to pretend everything is software. The motherboard disagrees.

### 2) The “boring” regions in a BIOS dump are the ones that actually make it boot
The post spends real time on practical details like extracting regions (IFD, GbE) and keeping things intact enough that Ethernet and the final image work.

This is also why I roll my eyes when people talk about “just remove Intel ME” like it’s a settings toggle. In practice it’s a tightrope walk between:
- reducing attack surface
- and not breaking PCIe enumeration / NVMe / Wi‑Fi in ways that look like random ghosts

### 3) Debugging firmware is basically systems engineering with fewer tools
In application land, when things break you get logs.

In firmware land, you get:
- a machine that *doesn’t show up in `lspci`*
- devices that disappear after a failed boot attempt
- and a long night of “is this a GPIO mapping issue or did I brick something?”

The punchline in their story is painfully real: a CLKREQ line was off by one, and suddenly NVMe and Wi‑Fi came back.

### 4) Community is the real “platform” here
The most impressive part isn’t that the port happened. It’s that the author got help from Libreboot folks (including Leah Rowe) and iterated through ROMs until the system behaved.

There’s a pattern I trust more than any vendor promise:
- public schematics exist (even if you had to hunt)
- builds are reproducible
- patches get upstreamed
- people can review and argue in the open

That’s what makes firmware less of a private prison.

### 5) This is a weird kind of skill that will matter more in the AI era
I don’t mean “everyone should become a firmware hacker.”

I mean: as more of our stack becomes opaque (cloud, models, devices that phone home), the ability to **own your compute substrate** starts looking less like a hobby and more like resilience.

Not because you’ll do it every day — but because when things go sideways, you want *someone* to still know how the bottom of the stack works.

## What I’d actually do (if I owned a fleet or a serious workstation)

1. **Treat firmware as a lifecycle, not a one-time flash.** Keep dumps, provenance, and a rollback plan.
2. **Budget for hardware mistakes.** Clips slip. Caps fly. This is not a “weekend with zero risk” project.
3. **Prefer platforms with an upstream path.** If the work can’t land in Coreboot/Libreboot, you’re signing up for permanent local maintenance.

I’m not romantic about this. It’s messy and fragile.
But it’s also one of the few places left where “I own my machine” can still mean something.

---

**References:**
- [Original write-up: “I ported Coreboot to the ThinkPad X270!” (dork.dev)](https://dork.dev/posts/2026-02-20-ported-coreboot/)
- [Coreboot project homepage and documentation](https://www.coreboot.org/)
- [Libreboot project site (install guides and philosophy)](https://libreboot.org/)
- [flashprog: a modern SPI flash tool used for reading/writing firmware](https://flashprog.org/)
