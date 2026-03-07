---
layout: post
title: "Plasma Bigscreen: the Linux TV UI I’ve wanted for years (and why it matters)"
date: 2026-03-07 11:00:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![Plasma Bigscreen homescreen](/img/posts/2026-03-07-plasma-bigscreen.webp)

I’ve had the same annoying thought for years:

Why is “Linux on a TV” either **a hobbyist HTPC** (where you end up living in a regular desktop UI) or **a closed set‑top box** (where you’re basically renting your own living room)?

So when I saw **Plasma Bigscreen** pop up again, I stopped and actually read what they’re trying to build.

This is *not* “a skin for Kodi.” It’s a full TV‑first interface—remote‑friendly settings, a home overlay you can summon from anywhere, and a stack that’s… honestly the part I care about.

## The part that makes me trust it more: the stack is boring (in a good way)

Plasma Bigscreen is explicitly built on the modern Linux desktop stack:

- Wayland
- PipeWire
- KDE Plasma + KDE Frameworks
- Flatpak
- NetworkManager
- D‑Bus

That list is almost too normal. And that’s the point.

If your TV UI is built on a weird custom framework, the moment you hit a driver issue, audio routing bug, or remote input edge case, you’re in “good luck” territory.

If it’s built on the same plumbing people already use on desktops (and increasingly on handhelds), there’s at least a chance that fixes are shared instead of reinvented.

## The real pitch isn’t features. It’s ownership.

Their “Why?” section is blunt: most TV platforms are walled gardens, and the goal here is **privacy and user control**.

That resonates with me more than it should.

TVs have become the dumbest place to have a smart platform:

- you don’t get meaningful patch notes
- you don’t know what telemetry is collected
- you can’t easily audit what’s installed
- and in some ecosystems, you can’t even keep the UI stable over time

On a phone or a laptop, I can at least choose:
- a different browser
- a different launcher
- a different OS

On a TV? Most of the time it’s “take it or leave it.”

## Practical reality check: it’s not widely available yet

This is still in development.

What I found useful is that they’re not pretending it’s ready for everyone today: the project says it’s **not yet widely available**, and they’re planning to join the Plasma release schedule starting with **Plasma 6.7 (June)** so distros can ship it.

That’s a real milestone. “Distros can package it” is when a project stops being a demo and starts becoming infrastructure.

## Would I put this on my living-room TV today?

Not yet.

But I’d absolutely:

- keep an eye on it if you run a home server and already use Jellyfin
- test it on a spare mini PC / NUC
- or follow it if you’re the kind of person who cares about the difference between “a product” and “a platform you own”

And selfishly: I just want a future where “TV UI” doesn’t automatically mean “ad tech.”

---

**References:**
- [Plasma Bigscreen project homepage (overview, screenshots, and goals)](https://plasma-bigscreen.org/)
- [Get Plasma Bigscreen (availability notes and Plasma 6.7 plan)](https://plasma-bigscreen.org/get/)
