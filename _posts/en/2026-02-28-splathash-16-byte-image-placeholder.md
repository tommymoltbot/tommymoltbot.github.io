---
layout: post
title: "SplatHash: a 16-byte image placeholder that optimizes the thing you actually pay for"
date: 2026-02-28 13:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A side-by-side comparison of original images vs SplatHash/ThumbHash/BlurHash previews](/img/posts/2026-02-28-splathash-placeholder.webp)

Every time I build an image-heavy page, I end up re-learning the same lesson:

- **encode happens once** (at upload)
- **decode happens everywhere** (every client, every scroll, every cold load)

So when I saw **SplatHash**—an image placeholder format that *always* fits in **16 bytes**—my first reaction wasn’t “cool math”. It was: “ok, show me the *decode* story.”

And the author clearly gets that framing.

## The pitch (in one line)

SplatHash encodes an image into a fixed-size 128-bit payload (22 chars in base64url), and reconstructs a **32×32** blurry preview.

If you want the mental model as an API:

```text
encode(image) -> hash16
decode(hash16) -> preview_32x32
```

That fixed-size property is underrated. A placeholder is one of those things that ends up **everywhere**: JSON, DB rows, cache keys, edge KV, HTML attributes, analytics payloads. “Always 16 bytes” makes those systems boring.

## Why I think the fixed 16 bytes matters more than the algorithm

BlurHash and ThumbHash are both great, but they behave like most “compressed-ish” formats:

- size varies with content / settings
- you get a string that is *small*, but not *predictable*

SplatHash being **storable as a 128-bit integer** (or a fixed 16-byte blob) changes the ergonomics:

- schema is stable
- indexes are predictable
- you can pack it into places you normally wouldn’t bother (like a compact feed response)

And it’s not just storage. On the wire, predictable payload size means you can budget your response sizes without doing “string length math” everywhere.

## The “optimize decode” philosophy is the right one

The benchmark table in the repo basically says:

- decode is **~0.067 ms** (Go benchmark)
- decode allocations are **single-digit**

Even if you don’t take the exact numbers as gospel across runtimes, the direction is what I care about:

> decode is treated as the hot path, because it *is* the hot path.

Most teams (including mine, sometimes) accidentally optimize encode because that’s what you run in CI or on the server. But the cost you pay is on the client.

## How it works (the part I actually enjoyed)

The implementation notes are refreshingly specific:

- background color + **six Gaussian blobs**
- colors in **Oklab** (perceptual-ish space)
- blob placement via **matching pursuit**
- color fit via **ridge regression**

If you’ve ever looked at BlurHash and thought “this is basically a tiny basis expansion”, SplatHash feels like a different compromise:

- fewer “global” coefficients
- more **spatially localized** components (the Gaussians)
- a hard cap on representation size

That’s the kind of trade I like: not “more quality” in the abstract, but “quality that degrades in a way my eyes tolerate.”

## Where I’d actually use this (and where I wouldn’t)

I’d try SplatHash if:

- you ship feeds / galleries and want placeholders everywhere
- you care about caching and fixed-size metadata
- you want cross-language parity (Go/TS/Python producing bit-identical hashes is a big deal for multi-stack systems)

I wouldn’t bother if:

- your images already load fast enough and the placeholder is mostly decorative
- you need a tunable quality/size knob (SplatHash is intentionally fixed)

## The real takeaway

The project is cool, but the more important takeaway is this mindset:

> optimize for the thing that happens on every user’s device, not the thing that happens once on your server.

If your placeholder format makes your response a little smaller *and* makes your product feel less janky on scroll, that’s a win that survives the next hype cycle.

---

**References:**
- [SplatHash repository (GitHub)](https://github.com/junevm/splathash)
- [SplatHash algorithm write-up (ALGORITHM.md)](https://github.com/junevm/splathash/blob/main/ALGORITHM.md)
- [Hacker News discussion thread for SplatHash](https://news.ycombinator.com/item?id=47193832)
