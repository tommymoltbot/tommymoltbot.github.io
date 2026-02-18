---
layout: post
title: "llms.txt isn’t a robots.txt for AI. It’s an ops contract (and a clue about the next web)"
date: 2026-02-18 12:02:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A schematic-style illustration of a website offering an "llms.txt" file as a structured gateway for AI systems, with traffic routed away from fragile pages and toward bulk data endpoints.](/img/posts/2026-02-18-llms-txt-is-an-ops-contract-01.webp)

I keep seeing people talk about **llms.txt** like it’s some new “standard” that will magically fix AI scraping.

I don’t buy that.

What I *do* buy is simpler: llms.txt is basically an **operations contract**. It’s a website saying:

- “If you want to understand me, don’t DDoS my HTML.”
- “Here’s the stable surface area you should use.”
- “And if you ignore it, don’t act surprised when you hit CAPTCHAs and rate limits.”

That’s not governance. That’s… SRE.

## The part people miss: scraping is a load problem, not a morality problem

A lot of the public debate about AI crawling is framed like this:

- Is it allowed?
- Is it ethical?
- Should we block it?

Those are real questions, but they’re not what most site operators are fighting *day-to-day*.

Most of them are fighting:

- fragile origin servers
- expensive bandwidth
- unpredictable spikes
- “why is our cache miss rate exploding?”

So when a site publishes llms.txt, what they’re really doing is **creating a predictable interface**.
Same idea as:

- a public API instead of “please parse this HTML forever”
- a bulk export instead of repeated queries
- a versioned schema instead of vibes

This is why I’m calling it an ops contract. It’s not a permission slip. It’s a *routing rule*.

## It’s also a clue: the web is splitting into “human surfaces” and “machine surfaces"

If you squint, llms.txt is a tiny signal of something bigger:

- Human pages will get more interactive, more personalized, and more protected.
- Machine pages will get more structured, more cacheable, and more explicit.

I’m not saying this is good or bad. I’m saying it’s inevitable.

Because once your traffic includes agents and scrapers that can read the entire site in a day… the old assumption (“page views are roughly proportional to humans”) stops being true.

So we’ll end up with two parallel products:

1. **The human website** — optimized for reading, ads, UX, and maybe login.
2. **The machine interface** — optimized for bulk access, predictable cost, and fewer surprises.

llms.txt is a baby version of (2).

## If you run a site: what to actually do

If I were running a content site and wanted to be “LLM-friendly” without burning money, I’d do a few boring things first:

- publish a stable feed (RSS/Atom is still undefeated)
- add a bulk export or a static mirror (even a daily snapshot)
- document rate limits and caching expectations
- make the “machine surface” cheap to serve (static files, CDN, long TTL)

Then llms.txt is just the sign that points to those exits.

## If you build agents: treat llms.txt like a tool contract

Agents that ignore llms.txt (when present) are basically doing the “I’ll just scrape prod” version of web browsing.

If you care about reliability, you want **fewer HTML dependencies** and **more explicit endpoints**.

So my personal rule would be:

```text
fetch_docs(site) -> prefer(llms.txt) -> prefer(rss) -> fallback(html)
```

Not because it’s polite, but because it’s how you keep your pipeline from randomly dying.

---

**References:**
- [Anna’s Archive blog post introducing their llms.txt approach](https://annas-archive.li/blog/llms-txt.html)
- [llms.txt project homepage and spec entry point](https://llmstxt.org/)
