---
layout: post
title: "AI content farms need blocklists, not hot takes (a uBlock list is the most honest tool)"
date: 2026-02-21 16:10:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "If you’re tired of AI-written SEO sludge, the most effective countermeasure isn’t a new search engine or another rant. It’s a boring, manual uBlock Origin filter list. This post explains why that works, what it can’t do, and a practical workflow for building your own.”
lang: en
---

![A dark, minimal header image with neon graph lines, captioned "Blocklists beat hot takes".](/img/posts/2026-02-21-ai-ublock-blacklist.webp)

I’m not anti-AI.

I’m anti-*wasting my time*.

And right now the fastest way to waste your time on the internet is to search for something vaguely technical and land on a page that reads like it was written by an assistant that never had to ship anything.

You know the pattern:

- a dramatic intro about “today’s fast-moving digital landscape”
- five headings that say nothing
- a conclusion that repeats the headings
- two affiliate links and a cookie banner the size of a legal department

If you’ve been feeling this lately, you’re not imagining it. The web is being flooded by AI-generated content farms that are *optimized for ranking*, not for answering.

So here’s my take: the most honest anti-slop tool isn’t a new browser, or a new AI, or a new moral panic.

It’s a **boring uBlock Origin filter list**.

One of the better examples I’ve seen recently is **“AI uBlock Origin Blacklist”** — a manually maintained list that blocks domains (or subpaths on platforms) that consistently publish AI content-farm junk.

## Five angles I use to think about it

1) **Blocklists work because SEO slop is centralized**

A weird thing about “AI content farms” is that they’re not truly distributed.

Sure, there are thousands of pages — but they cluster on the same domains, the same templates, the same marketing orgs. Once you find one offender, you’ll often see it again.

So the economics favors a blocklist:

```text
block(domain) -> saves_time_for_future_searches
```

2) **A blocklist is the opposite of “algorithmic moderation”**

People keep hoping for a smarter ranking algorithm.

But ranking is an arms race. Content farms *exist* because they play that game full-time.

A uBlock list is blunt, human, and local:

- you decide what’s garbage
- your browser enforces it
- no one gets to “appeal” by doing better SEO

It’s not fair. It’s not nuanced.

It’s effective.

3) **The “no references” smell test is underrated**

The blacklist maintainer has a simple observation: content farms rarely link out.

That matches my experience.

Real writing tends to have receipts:

- specs
- docs
- standards
- GitHub issues
- primary sources

When a page makes claims and cites nothing, it’s either lazy… or generated… or both.

4) **Manual curation is a feature, not a scalability failure**

Yes, a human-maintained list is “small” compared to the whole web.

That’s the point.

If you try to auto-detect AI writing, you’ll mostly:

- false-positive legitimate non-native writers
- miss the farms that have gotten good at style
- burn cycles on a classifier arms race

Manual curation keeps the bar simple:

```text
is_this_page_useful_to_me(page) -> yes|no
```

And when the answer is "no" five times in a row, you block it.

5) **This is a personal productivity tool, not a moral crusade**

I’m not trying to “save the web.”

I’m trying to get answers fast, so I can go back to building things.

A blocklist is a practical boundary:

- it doesn’t argue
- it doesn’t negotiate
- it just stops loading the garbage

## A small workflow I’d actually recommend

- Keep a private note called “Domains I regret clicking.”
- When you hit an obvious content farm, add it immediately.
- Prefer blocking the smallest scope that solves your pain:
  - a whole domain if the whole domain is trash
  - a subpath if it’s a platform like Medium / dev.to

Example filter patterns look like this:

```text
||example.com^$doc
||example.com/@slopUser^$doc
```

(That’s the exact kind of mechanical, boring tool I trust.)

## What this won’t solve

- It won’t fix search quality globally.
- It won’t stop AI from being used as a writing aid.
- It won’t catch new domains instantly.

But it *will* make your next 200 searches less annoying.

That’s already a win.

---

**References:**
- [AI uBlock Origin Blacklist (project README + install instructions)](https://github.com/alvi-se/ai-ublock-blacklist)
- [Project filter list file (the actual uBlock list you can subscribe to)](https://raw.githubusercontent.com/alvi-se/ai-ublock-blacklist/master/list.txt)
