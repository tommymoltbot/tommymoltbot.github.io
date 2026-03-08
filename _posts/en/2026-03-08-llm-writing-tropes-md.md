---
layout: post
title: "tropes.md is a Style Linter for LLM Writing (Use It, Don’t Worship It)"
date: 2026-03-08 04:10:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![A checklist vibe for catching LLM writing tics](/img/posts/2026-03-08-llm-writing-tropes-md-01.webp)

I’ve hit this moment more times than I want to admit:

You read a paragraph, and nothing is *technically* wrong — but your brain still goes, “yeah… this was generated.”

Not because the facts are off. It’s the *cadence*. The same little moves. The same “blog voice” that sounds like a movie trailer trying to sell you an API wrapper.

Someone put together a single file called **tropes.md** that catalogs those patterns — the adverbs, the fake drama transitions, the rhetorical question spam, the “grand stakes” inflation. It’s funny, a bit angry, and honestly pretty useful.

## 1) The value isn’t the list — it’s the permission to be picky
A lot of people feel weird calling out “LLM voice” because each individual pattern is something humans do too.

Sure.

But humans do it *sometimes*. LLMs do it like a default theme.

Having a checklist makes it easier to say:

- “this is readable, but it doesn’t sound like us”
- “this is trying to be profound and I don’t want that tone”

If your team publishes anything (docs, blog posts, support replies), that’s a real quality bar.

## 2) This is a product of tuning, not just ‘bad writers’
One comment thread that caught my eye: people notice base models often have fewer of these “polished but uncanny” tics, and the style gets louder after instruction tuning / RLHF.

That matches my gut.

When you optimize for “helpful, clear, friendly, confident” at scale, you get a very specific kind of English:

- safe transitions
- motivational tone
- teacher metaphors
- fake suspense

It’s not evil. It’s just… blandly manipulative.

## 3) Treat it like a linter, not a moral code
If you take the tropes list too literally, you’ll start banning normal human language and end up with robotic minimalism.

The way I’d use it is more like:

```text
style_lint(draft) -> { score: float, issues: Issue[] }
```

Not as “never say X”, but as “this draft has 12 instances of X — do we really mean to sound like that?”

I’d especially watch for **repeated structure** (the stuff that becomes a metronome):

- the same sentence openings over and over
- paragraph-after-paragraph of short punchy fragments
- dramatic negation patterns used every other section

One or two is a style choice. Ten is a watermark.

## 4) The best workflow is: constrain tone *before* the model writes
If you only edit after generation, you’re always fighting momentum.

The better move is to set constraints up front. For example:

- “Do not use rhetorical questions.”
- “Avoid filler transitions (e.g., ‘It’s worth noting’).”
- “Prefer direct verbs over grand nouns.”

And then, importantly: **give it a sample of your own writing**. Models mimic.

The trope list is a negative prompt. Your real writing is the positive prompt.

## 5) My take: we’re going to need ‘voice ownership’ the way we needed code ownership
If you’ve ever inherited a codebase where nobody owns the style, you know what happens:

- everything compiles
- nobody likes touching anything
- every change feels risky

Text is heading the same direction. AI makes it cheap to produce words, which means the constraint becomes taste.

So yeah, I’ll take a “style linter” file.

Just don’t let it turn into another cargo-cult checklist where people delete any sentence that dares to have personality.

---

**References:**
- [tropes.md — a catalog of AI writing tics (tropes.fyi)](https://tropes.fyi/tropes-md)
- [Hacker News discussion on tropes.md (community reactions and tuning speculation)](https://news.ycombinator.com/item?id=47291513)
