---
layout: post
title: "Roundcube’s SVG feImage Bug: When ‘Block Remote Images’ Still Loads Remote Images"
date: 2026-02-09 09:05:00 +0000
categories: Engineering
tags: Engineering
author: Tommy
excerpt: "Roundcube’s sanitizer treated <feImage href> like a normal link, not an image source. Result: remote image blocking could be bypassed for tracking. It’s a small bug with a very ‘security is in the boring details’ lesson."
image: /img/posts/2026-02-09-roundcube-svg-feimage.webp
---

Email clients have this setting that sounds comforting:

“Block remote images.”

The promise is simple: if you open a sketchy email, it shouldn’t be able to ping some server and say *yep, Jimmy opened it at 09:12 from this IP address*.

Roundcube Webmail recently had a bug that breaks that promise in a very specific way: an attacker could embed an SVG that uses the `feImage` element, and Roundcube’s HTML sanitizer would accidentally let the remote URL through.

Not XSS. Not RCE. Just tracking.

Which, honestly, is exactly the kind of thing that happens in the real world.

## The bug in one sentence

Roundcube’s sanitizer handled remote image sources differently from regular links:

- image-ish attributes should go through a path that blocks external URLs
- normal links can go through a path that allows `http/https`

`<feImage href="https://...">` got classified as “a normal link”, so it was allowed—even when remote images were supposedly blocked.

This was fixed in Roundcube **1.5.13** and **1.6.13**.

## Why this is a classic allowlist failure

I’ve learned to treat HTML sanitizers as “a bunch of special-cases glued together.”

They start reasonable:

- allow these tags
- allow these attributes
- for *some* attributes, do extra validation

Then the internet shows up with SVG.

SVG isn’t “one tag.” It’s a whole separate universe of elements and attributes. And the moment you try to maintain an allowlist by hand, you’re basically betting you won’t miss a weird corner like `feImage`.

That’s what happened here: `href` was only treated as an image source on a couple of SVG elements (like `image` and `use`). `feImage` slipped through.

## The practical impact (why I care)

This is the kind of bug that doesn’t make headlines, but it matters:

- attackers can confirm you opened the email
- they can log your IP (and roughly where you are)
- they can fingerprint user agents and behaviors depending on how the request is made

And if you’re in a company environment, “someone opened an email” is sometimes all an attacker needs to start escalating.

Not because it’s magical—because humans are consistent. If you open one thing, you might open the next.

## The engineering lesson: incentives vs guarantees

When a UI says “Block remote images,” users read that as a *guarantee*.

But under the hood, it’s just code. And code is a pile of branching logic, regexes, and exceptions.

Security often fails like this:

- not with an obviously dangerous feature
- but with a classification mistake
- where one path has strict rules and another path is permissive

If you’re building anything that sanitizes untrusted input, you should assume:

- attackers will find the weird tag you didn’t test
- “remote resource” isn’t just `<img src>`
- SVG is where your neat mental model goes to die

## What to do if you run Roundcube

If you’re on a vulnerable version, the answer is boring:

- update to **1.5.13** or **1.6.13**

If you can’t update immediately, you can mitigate by being more aggressive in sanitization (at the cost of breaking legitimate HTML email), but long-term you want the upstream fix.

Because the real problem isn’t this one tag.

It’s that *any* missed tag can become the next “but I thought remote images were blocked” bug.

---

### References

- [NULL CATHEDRAL write-up with technical details and proof of concept](https://nullcathedral.com/posts/2026-02-08-roundcube-svg-feimage-remote-image-bypass/)
- [Roundcube commit that fixes the sanitizer classification for feImage](https://github.com/roundcube/roundcubemail/commit/26d7677471b68ff2d02ebe697cb606790b0cf52f)
- [Roundcube security updates announcement that triggered the investigation (context)](https://roundcube.net/news/2025/12/13/security-updates-1.6.12-and-1.5.12)
