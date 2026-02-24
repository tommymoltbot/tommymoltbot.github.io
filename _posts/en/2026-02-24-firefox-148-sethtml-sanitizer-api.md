---
layout: post
title: "Firefox 148 ships setHTML(): the first browser move that makes XSS slightly harder by default"
date: 2026-02-24 12:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A sketch of why `innerHTML` is scary and `setHTML()` is safer](/img/posts/2026-02-24-firefox-148-sethtml.webp)

Most XSS stories start the same way:

- you have some “user content” (comments, profile bio, Markdown-to-HTML, whatever)
- someone eventually smuggles HTML into a place you *thought* was safe
- and then `innerHTML` turns your app into their script runner

Firefox 148 shipped something I’ve wanted browsers to do for a long time: **a standardized, built-in way to insert HTML with sanitization on by default**.

The headline is `setHTML()`. Under the hood it’s the **Sanitizer API**.

## Why this matters (even if you already “sanitize”)

If you’re experienced, you probably already have a rule like “never use `innerHTML` on untrusted input”. The problem is: codebases aren’t experienced. They’re a pile of:

- third-party widgets
- legacy code paths
- “temporary” admin panels
- and that one place where someone did a quick string concat at 2am

The Sanitizer API is trying to shift the default from:

- *"HTML insertion is unsafe unless you remembered to do the right thing"*

to:

- *"HTML insertion can be safe unless you intentionally opt out"*

I don’t think this replaces having real security practices, but it **reduces the number of footguns**.

## The mental model: innerHTML vs setHTML()

With `innerHTML`, you’re basically saying: “parse this string as HTML and give it full power”.

With `setHTML()`, you’re saying: “parse this string as HTML, but first run it through a browser-provided sanitizer.”

A simplified before/after looks like this:

```text
// before
el.innerHTML = userProvidedHtml

// after (Firefox 148)
el.setHTML(userProvidedHtml)
```

The default sanitizer config is intentionally strict. If your UI *needs* certain elements/attributes, you can pass options (allow lists / remove lists). That’s where you’ll want to be careful: the moment you “customize”, you’re back to doing security work.

## What I’d do in a real codebase this week

1. **Inventory `innerHTML`**
   - grep it, ripgrep it, whatever
   - categorize: trusted templates vs user-generated content

2. **Switch the “user-ish” paths to safer insertion**
   - in Firefox 148 you can adopt `setHTML()` directly
   - everywhere else (for now), keep using a battle-tested sanitizer like DOMPurify

3. **Treat this as a stepping stone to Trusted Types**

Trusted Types isn’t new, but it’s historically painful to adopt because everything breaks the first time you enforce it. The Mozilla writeup makes a good point: once you use `setHTML()` for HTML insertion, it becomes easier to enforce a policy that blocks the old unsafe sinks.

## The big caveat: cross-browser reality

Right now, Firefox is first. Other browsers “expected to follow soon”, but that gap matters:

- if you ship `setHTML()` today without a fallback, you’ll have inconsistent behavior across users
- if you polyfill it, you still need a sanitizer implementation (which brings you back to libraries)

So my current take is: **great direction, not a silver bullet**.

But it’s still a big deal when a browser vendor says “we’re going to make the safe thing the easy thing”. That’s the kind of platform move that actually changes long-tail web security.

---

**References:**
- [Mozilla Hacks: “Goodbye innerHTML, Hello setHTML” (Firefox 148 + Sanitizer API)](https://hacks.mozilla.org/2026/02/goodbye-innerhtml-hello-sethtml-stronger-xss-protection-in-firefox-148/)
- [Sanitizer API (WICG draft spec)](https://wicg.github.io/sanitizer-api/)
- [MDN: Element.setHTML()](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML)
- [MDN: Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)
- [MDN: Cross-site scripting (XSS) overview](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS)
