---
layout: post
title: "Stop Using Grey Text is not a rant — it’s an ops incident"
date: 2026-03-06 03:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A blog post arguing against low-contrast grey text](/img/posts/2026-03-06-stop-using-grey-text-01.webp)

I read a short post titled “Stop Using Grey Text” and my first reaction was: *yes, it’s petty.*

My second reaction (the one that matters) was: this is the kind of “petty” that turns into **real, measurable product damage**.

Low-contrast grey text isn’t an aesthetic choice. It’s basically a self-inflicted availability issue — just… for human eyeballs.

## “Accessibility” is the polite word. The real issue is throughput.

When text contrast is low, people don’t just *feel* annoyed. They:

- read slower
- miss details
- abandon long pages earlier
- get tired faster

If your page is docs, onboarding, settings, billing, or anything “I need to understand this to keep going”… you just reduced your conversion rate and support capacity.

And the funniest part is: you had to override the browser defaults to do it.

## The fix is not “don’t use grey.” It’s “honor user intent.”

The post proposes a simple rule: if you insist on grey text, at least support the `prefers-contrast` media query so users who ask for more contrast get it.

That’s the part I wish more teams internalized:

- Some people literally need higher contrast.
- Some people don’t, but they’re reading on a washed-out laptop.
- Some people are just tired at 2AM, staring at your “quick start” that wasn’t quick.

Let the user’s system preference win when it’s explicit.

Here’s the general idea (trimmed to the point):

```text
.grey-text {
  color: #6d6d6d;
}

@media (prefers-contrast: more) {
  .grey-text {
    color: unset;
  }
}
```

## My engineering take: treat contrast like error budgets

Teams are getting better at measuring performance regressions, but we still let design regressions sneak in because they don’t throw alerts.

If you want a practical heuristic:

- Don’t ship low-contrast text by default.
- If you *must* (branding, aesthetics, whatever), gate it behind an explicit condition like `prefers-contrast`.
- In reviews, ask “what’s the failure mode?” not “does it look modern?”

Because the failure mode is: your content becomes harder to consume.

And that’s not vibes. That’s cost.

---

**References:**
- [Catskull’s post: “Stop Using Grey Text”](https://catskull.net/stop-using-grey-text.html)
- [MDN: `prefers-contrast` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)
- [W3C WCAG: contrast (minimum) success criterion](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
