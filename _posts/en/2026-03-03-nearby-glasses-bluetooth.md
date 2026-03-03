---
layout: post
title: "Bluetooth vs. Smart Glasses: The Privacy Arms Race Is Getting Stupid"
date: 2026-03-03 08:15:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![A screenshot of the Nearby Glasses Android app sending an alert](/img/posts/2026-03-03-nearby-glasses-bluetooth-01.webp)

Someone built an Android app called **Nearby Glasses** that alerts you when a nearby device looks like smart glasses.

It’s a clever hack: scan for Bluetooth beacons, match the manufacturer identifier, and notify the user.

It’s also… kind of depressing.

Because the fact this is useful tells you where we’re headed: **wearable cameras are normalizing faster than consent is**. So we’re building counter-tech to at least *know* when the recording might be happening.

## The idea is simple, and that’s why it works

Nearby Glasses leans on a boring truth: a lot of “smart” wearables can’t shut up.

Bluetooth devices broadcast things that make pairing and discovery possible. Those broadcasts can include a manufacturer identifier — which means you can do a rough classification without needing any special permission from Meta or Snap.

This isn’t magic. It’s basically:

- keep scanning
- detect a signal that looks like “this vendor’s hardware”
- alert the user

The TechCrunch piece even mentions a fun little demo: add Apple’s identifier and your phone starts screaming immediately, because your city is basically an Apple mesh network now.

## My first reaction: this is a technical solution to a social failure

If you’re in a public space and the default expectation is “you’re probably being recorded,” something broke.

The industry keeps pitching smart glasses as convenience:

- hands-free photos
- quick clips
- “AI that sees what you see”

But for everyone else around you, it’s not convenience. It’s ambiguity.

Regular glasses and camera-glasses look the same. The whole problem is *plausible deniability*.

And the countermeasure we end up with is… an app that sniffs radio traffic like we’re all doing adversarial security work just to exist in public.

## The false-positive problem is real (and still worth it)

The app can’t perfectly identify “smart glasses” as a product category.

If a company makes both smart glasses and other Bluetooth devices, you can get alerts for things that aren’t glasses (like a VR headset). That’s a limitation of using manufacturer identifiers.

But honestly, false positives aren’t the part that scares me.

The part that scares me is the *direction*:

- today: detect vendor identifiers
- tomorrow: vendors randomize identifiers (like MAC randomization)
- next: detection becomes harder, so we build more invasive scanners

It’s an arms race where the prize is “basic social legibility.”

## What I actually want (and I don’t think the market will volunteer it)

If smart glasses are going to be everywhere, I want two boring constraints to be non-negotiable:

1) **A hardware recording indicator that cannot be disabled**
2) **A social norm that it’s rude to record by default**

Right now, companies have strong incentives to make recording frictionless and subtle. That’s literally the product.

So we get “luxury surveillance” — and then we pretend the fix is more apps.

Apps are fine. I’ll take them.

But I’d rather not need them.

---

**References:**
- [TechCrunch report on the Nearby Glasses Android app (background and how it works)](https://techcrunch.com/2026/03/02/nearby-glasses-new-app-alerts-you-wearing-smart-glasses-surveillance-meta-snap-bluetooth/)
- [Nearby Glasses on Google Play (app listing)](https://play.google.com/store/apps/details?id=ch.pocketpc.nearbyglasses)
- [Nearby Glasses source code and project notes on GitHub](https://github.com/yjeanrenaud/yj_nearbyglasses)
- [Bluetooth SIG “Assigned Numbers” reference (manufacturer identifiers)](https://www.bluetooth.com/specifications/assigned-numbers/)
- [404 Media coverage that inspired the app (wearable surveillance reporting)](https://www.404media.co/this-app-warns-you-if-someone-is-wearing-smart-glasses-nearby/)
