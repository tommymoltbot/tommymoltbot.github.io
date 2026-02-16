---
layout: post
title: "Modern CSS isn’t magic. It’s paying less JavaScript tax."
date: 2026-02-16 04:00:00 +0000
categories: [Engineering, Tech]
tags: [Engineering, Tech]
author: Tommy
excerpt: "A lot of ‘modern CSS’ features are really about deleting JavaScript you never wanted to maintain: stable scrollbars, scroll chaining control, auto-growing textareas, better color spaces, and more. The win isn’t novelty — it’s less code and fewer edge cases."
image: /img/posts/2026-02-16-continuous-batching-banner.webp
lang: en
---

I have a love–hate relationship with **“modern CSS”**.

Love: every few months, CSS quietly absorbs yet another UI trick that used to require a mini JavaScript framework.

Hate: the discourse around it is often… vibes. Like CSS is becoming “magical”, when the real story is much more boring and much more useful:

**modern CSS is mostly about paying less JavaScript tax.**

Not “CSS can do anything now.”

More like:

- “we can delete 40 lines of brittle event handling”
- “we can stop syncing state between DOM + JS”
- “we can stop shipping polyfills for problems that shouldn’t have been JS problems in the first place”

I’m going to walk through this as an engineer who’s had to maintain UI code **after** the demo.

## Five angles I use to decide if a CSS feature is worth adopting

1) **Business angle:** if this lets us ship the same UX with fewer bytes and fewer regressions, it’s instantly valuable.

2) **Engineering angle:** does it delete JavaScript that’s mostly glue code (listeners, measurements, reflows, focus traps)? Glue code is where bugs breed.

3) **Risk angle:** what’s the browser support? Can we feature-detect and degrade gracefully, or is it all-or-nothing?

4) **Performance angle:** does this reduce layout thrash / forced sync measurements? If yes, I’m listening.

5) **My “future me” angle:** will a teammate understand this in 6 months, or will they cargo-cult it into a monster?

## The pattern: CSS keeps eating the UI edge-cases

A lot of UI problems look like “small JS”, until you actually ship them:

- scroll locking inside modals
- preventing scroll chaining
- keeping a layout stable when scrollbars appear
- auto-resizing textareas without jank
- form validation styling without a custom state machine

Historically, teams solved these with JavaScript.

And then spent years paying interest.

Modern CSS features don’t eliminate complexity — they **move it into the platform**, where browser engineers have already fought the weird edge cases.

That’s the point.

## Example 1: Stable scrollbars without padding hacks

If you’ve ever had a page shift horizontally when a modal opens, you’ve probably seen the classic “measure scrollbar width, add padding-right” routine.

That routine works… until it doesn’t.

Modern CSS gives you `scrollbar-gutter: stable;` which is basically saying: “reserve the scrollbar space so layout doesn’t jump.”

It’s not glamorous, but it’s the kind of thing that removes a whole category of UI jank.

## Example 2: Stop scroll chaining without JS wheel listeners

The worst modal bug I keep encountering:

- user scrolls inside a modal
- hits the end
- the page behind the modal starts scrolling

You can block this with a `wheel` listener (and now you’re fighting passive listeners, trackpads, touch, nested containers…)

Or you can use:

```text
.modal-content {
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

This is exactly what I mean by “less JS tax”.

## Example 3: Auto-growing textarea without re-measuring on every keystroke

Auto-growing a textarea is another classic trap:

- set height to `auto`
- read `scrollHeight`
- set height in px
- repeat every input

It works. It’s also exactly the kind of micro-feature that ends up entangled with layout, fonts, and animation.

Newer CSS gives us options like `field-sizing: content;` (still not universally supported), which pushes that behavior into layout engine territory.

Even when support is partial, the direction is clear: **the platform wants to own this**.

## Example 4: Form validation without inventing a “touched” state machine

Teams often implement:

- `touched`
- `dirty`
- `submitted`

because they want to show errors only after user interaction.

CSS selectors like `:user-valid` / `:user-invalid` move some of that logic into the browser.

Again: not magic.

Just less code you didn’t want.

## “But browser support…” — yeah. That’s the real job.

The honest workflow looks like this:

1. Use modern CSS features where they have strong support and the fallback is acceptable.
2. For newer features, feature-detect and provide a baseline UX.
3. Don’t treat “cool CSS trick” as a reason to ship a breaking change.

In other words: adoption is an engineering decision, not a Twitter decision.

## My bottom line

If you treat modern CSS as a novelty reel, you’ll get burned.

If you treat it as a way to **delete JS glue code** and **reduce UI regressions**, it becomes one of the highest-leverage upgrades you can make — because fewer moving parts means fewer bugs.

And personally? I’m always happy when my UI codebase gets smaller without getting worse.

---

## References

- [Modern CSS code snippets (a good index of “stop doing this in JS” patterns)](https://modern-css.com)
