---
layout: post
title: "robots.txt is not a security boundary (it’s a traffic sign)"
date: 2026-02-23 04:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "If you treat robots.txt like a lock, you will ship accidental data leaks. robots.txt is a convention for well-behaved crawlers, not an access-control mechanism. This post explains what it can and can’t do, why people keep confusing it with security, and a practical checklist for real protection."
lang: en
---

![A dark, minimal illustration of a website gate with a paper sign reading "robots.txt", while real locks (auth, ACLs, network rules) sit behind it.](/img/posts/2026-02-23-robots-txt-security-boundary-01.webp)

People keep talking about **robots.txt** like it’s a security control.

I get why.

It *feels* like a “do not enter” sign, and it lives at the root of your site, and it has rules, and search engines read it.

But if you’re an engineer, you should translate it into a more honest mental model:

```text
robots.txt -> traffic sign for polite crawlers
security   -> locks + identity + enforcement
```

If you treat the sign like a lock, you’re going to have a bad time.

## Five angles I use to keep this straight

1) **The enforcement angle: robots.txt has no power**

The file is publicly accessible by design.

A crawler can always fetch it and then ignore it. Nothing breaks. There’s no “403 because you violated robots.txt.”

So if your plan is “hide it via Disallow,” you’re not hiding it — you’re advertising it.

2) **The threat-model angle: it only works on “good citizens”**

Robots conventions are a coordination tool:

- Search engines generally follow them.
- Research crawlers might follow them.
- Malicious scrapers and opportunistic bots won’t.

Security is about the adversary you *don’t* get to negotiate with.

3) **The data angle: your real risk is not crawling — it’s publication**

Most leaks aren’t “Google disobeyed robots.txt.”

Most leaks are:

- you put a private export under a guessable URL
- a staging build got deployed to prod
- an S3 bucket/object store is public by accident
- a debug endpoint is reachable

robots.txt doesn’t fix any of those. It just changes what well-behaved bots index.

4) **The ops angle: robots.txt *is* useful, just not for security**

Used correctly, it’s boring and powerful:

- prevent crawl storms on fragile endpoints
- keep junk URLs out of search results
- steer bots toward sitemaps

That’s load management and indexing hygiene.

(If you’ve ever watched a bot melt an origin server, you’ll appreciate this.)

5) **The “LLM era” angle: more bots means more confusion**

As soon as you have:

- classic search indexing bots
- SEO scrapers
- “AI training” crawlers
- agents fetching pages on demand

…people start reaching for the one file they vaguely remember.

But the solution space is still the old boring stuff:

- authentication
- authorization
- rate limiting
- network boundaries
- private buckets
- signed URLs

## A practical checklist (what I’d actually do)

If you want content to be *not public*, do one (or more) of these:

- **Put it behind auth** (even basic auth is better than vibes).
- **Return 401/403** for unauthenticated requests.
- **Keep it off the public internet** (VPN, private subnet, IP allowlist).
- **Use object storage correctly** (private by default, least privilege).
- **Don’t deploy secrets to the web root** (sounds obvious; still happens).

If you merely want it *not indexed*, then robots.txt is fine — just be honest about the goal.

## The simple rule

If a URL must be secret, the server must enforce that.

robots.txt can’t.

It’s a sign.
Not a lock.

---

**References:**
- [The robots.txt specification (RFC 9309)](https://www.rfc-editor.org/rfc/rfc9309)
- [Google Search Central: robots.txt and robots meta tags overview](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
