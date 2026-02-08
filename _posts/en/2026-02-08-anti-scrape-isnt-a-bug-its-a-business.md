---
layout: post
title: "Anti-Scraping Isn’t a Bug — It’s a Business (So Build a Feed Layer)"
date: 2026-02-08 09:00:00 +0000
categories: [Engineering]
tags: [Engineering, Tech]
image: /img/posts/feed-layer-pipeline.webp
---

I keep seeing the same complaint loop:

- “This site blocked my scraper.”
- “Cloudflare is ruining the web.”
- “Why can’t we just fetch the HTML like the old days?”

I get it.

But at this point, treating anti-scraping as a *bug* is just you arguing with incentives.

For a lot of publishers, the page isn’t the product.

The **audience capture** is the product.

And the bot wall is how they keep the product scarce.

So if you’re building anything that depends on public web content—news digests, price trackers, research agents—here’s the mindset shift that actually holds up:

> Stop thinking “scraper.” Start thinking **feed layer**.

## Five different angles I keep coming back to

1) **Business reality:** anti-bot isn’t personal; it’s retention + ad inventory protection.

2) **Reliability:** if your pipeline depends on HTML, you’ve already accepted a weekly incident.

3) **Engineering:** you want contracts (feeds), not vibes (DOM trees).

4) **Ethics/ops:** robots, rate limits, and attribution aren’t just “nice”—they reduce your legal and reputational blast radius.

5) **Strategy:** if content is critical, negotiate access; don’t “innovate” around the paywall at 3AM.

## The part nobody wants to admit: HTML is an unstable API

If your ingestion step is:

```text
GET /some-page -> parse DOM -> hope selectors still match
```

…you don’t have an interface.

You have a coincidence.

Publishers change layouts for:
- A/B tests
- ad slot rearrangements
- localization
- anti-bot tweaks
- new consent flows

Your parser breaking is not an exceptional event.

It’s the default.

## A feed layer is just “contracts all the way down”

When I say feed layer, I mean a thin system that gives you:

- **stable inputs** (RSS/Atom, JSON APIs, exports, newsletters, vendor feeds)
- **normalization** (one schema you own)
- **dedupe** (canonical URLs, content hashes)
- **caching** (don’t re-fetch the world)
- **backfill + replay** (you can rebuild state)
- **attribution** baked in (source, author, published time)

The implementation can be boring.

That’s the point.

Here’s the shape I like:

```text
sources -> fetchers -> normalize -> store -> downstream (summarize / alert / search)
```

### Fetchers: pick the least fragile option first

Order of preference (for sanity):

1) **Official RSS/Atom** (still underrated)
2) **Documented APIs** (even if paid)
3) **Email newsletters** (a surprisingly stable “API”)
4) **Sitemaps / structured data** (when available)
5) **HTML scraping** (last resort)

If you must scrape, design it like a failure-prone dependency:

```text
fetch_html(url, user_agent, timeout_ms) -> {status, html, fetched_at}
```

…and assume you’ll need fallback routes.

## The real win: you stop debugging the internet

Most teams think the value is “we can fetch the content.”

The actual value is:

- your downstream features stop flaking
- your summaries stop randomly shrinking
- your alerting stops spamming duplicates
- your system becomes explainable

Which is another way of saying: you bought back time.

## A practical policy I’d put in writing

If web content matters to a product decision, treat access like any other dependency:

- define an ingestion contract
- record provenance
- build caching + backfill
- have an escalation path (paid plan / partnership)

If you don’t, you’ll end up paying anyway—just in pager fatigue.

## References

- [RSS 2.0 specification (Harvard Law)](https://cyber.harvard.edu/rss/rss.html)
- [Atom Syndication Format (IETF RFC 4287)](https://www.rfc-editor.org/rfc/rfc4287)
- [Robots Exclusion Protocol (IETF RFC 9309)](https://www.rfc-editor.org/rfc/rfc9309)
