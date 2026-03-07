---
layout: post
title: "Plasma Bigscreen is the TV UI Linux should have had years ago"
date: 2026-03-07 05:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Plasma Bigscreen homescreen](/img/posts/2026-03-07-plasma-bigscreen-01.webp)

I don’t think Linux “needs” to win the living room.

But I *do* think the living room is where the modern software trust problem is the most visible: TVs and set-top boxes that ship with a UI you can’t audit, can’t really disable, and will happily phone home forever.

So seeing **Plasma Bigscreen** show up again on my radar was one of those “oh right, we could just… build a real desktop environment for TVs” moments.

## The part people underestimate: input is the product
On a laptop, input is solved. Keyboard, trackpad, maybe a mouse.

On a TV, input is the whole game.

Plasma Bigscreen is explicitly built around “whatever input makes sense on a couch”:
- TV remote (including HDMI-CEC style setups)
- Game controller
- Keyboard and mouse
- Phone-as-remote via KDE Connect

The moment a TV UI assumes a pointer, it loses.
The moment it assumes *only* a remote, it becomes a toy.

The interesting design constraint here is: can you support multiple input modes without becoming a pile of special cases?

## It’s not a “launcher”—it’s a real desktop environment
A lot of TV projects stop at “a big launcher with tiles.” That’s fine until you need settings, networking, audio routing, display quirks, Bluetooth, etc.

Plasma Bigscreen is positioning itself as a full interface for Linux on big screens, including a settings experience designed for distance viewing.

That sounds boring until you’ve tried to do basic system management from 3 meters away and realized most desktop settings UIs were never meant to be read from a couch.

## I like the stack choice (Wayland + PipeWire) even if it’s painful
The site calls out a modern Linux desktop stack: Wayland and PipeWire in particular.

This is the correct direction, and also the place where “HTPC reality” tends to be messy:
- GPU drivers
- HDR/VRR support
- audio devices that appear/disappear
- weird EDID behavior

If you can make a clean TV UX on top of *that*, you’re not building a demo. You’re building something that might actually survive in people’s homes.

## The privacy pitch is real, but the maintenance burden is the tax
The “Why?” section basically says: TV platforms are walled gardens, so let’s build something open that respects users.

I’m sympathetic, but I also know what comes next:
- app ecosystems want DRM and certification
- hardware vendors want preloads and telemetry
- users want it to “just work”

Open source can deliver trust, but someone still has to do the unsexy work of integration and QA.

If Plasma Bigscreen becomes *boringly reliable*, that’s when it gets dangerous (in a good way).

## Where I personally see it fitting
If you’re already the kind of person running Jellyfin, Kodi, Steam on Linux, or experimenting with Flatpak apps from Flathub, this feels like a missing piece.

I’m not convinced it’s for the “normal smart TV buyer.” But for HTPC people, privacy nerds, and anyone who hates the idea of a TV OS that outlives its security updates, this is exactly the kind of project I want to exist.

I’m going to keep an eye on it. Not because it’s trendy—because it’s one of the few places where software freedom is immediately visible in day-to-day life.

---

**References:**
- [Plasma Bigscreen official site (overview and screenshots)](https://plasma-bigscreen.org/)
- [Plasma Bigscreen source code on KDE Invent](https://invent.kde.org/plasma/plasma-bigscreen)
- [Hacker News discussion on Plasma Bigscreen returning](https://news.ycombinator.com/item?id=47282736)
