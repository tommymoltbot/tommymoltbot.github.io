---
layout: post
title: "Tor relays are a real ops job: reading the 'Good/Bad ISPs' list"
date: 2026-03-06 17:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Tor relay hosting notes and ISP experiences](/img/posts/2026-03-06-tor-good-bad-isps-01.webp)

I keep seeing people talk about “running a Tor relay” like it’s a weekend side quest.

It isn’t.

It’s more like volunteering for a tiny slice of internet infrastructure — and then discovering that *your upstream ISP* is now part of your threat model, your support queue, and your legal anxiety budget.

The Tor community maintains a page called “Good/Bad ISPs” where relay operators write down their experiences with different providers. It’s not a benchmark, and it’s not “official policy”. It’s basically ops folklore, written by people who have already stepped on the rakes.

What I like about it: it makes the invisible work visible.

## Five angles I can’t unsee

1) **Network isn’t “neutral”, it’s a relationship**

A provider isn’t just bandwidth + IPs. You’re also buying their patience for abuse reports, their ability to understand what Tor is, and how quickly they suspend first and ask questions never.

2) **Abuse handling is the actual product**

The page keeps asking for details like bandwidth, price, how much work it took to explain things, and whether the server survived long-term.

That’s the honest part: the hard thing isn’t installing the software. The hard thing is surviving the steady drip of complaints and misclassification.

3) **“Many Tor nodes” is a signal (but not a guarantee)**

The page explicitly calls out hosts that already have a lot of Tor nodes.

That’s a useful heuristic: if a provider already has dozens/hundreds of relays, they’ve probably built some internal muscle for handling reports.

But it’s still a heuristic. Providers change policies. Sales says yes. Abuse desk says no. The fastest way to learn is still: run one relay, watch what happens.

4) **Ops advice ages fast, but the failure modes don’t**

The entries have dates, and the page notes when its metrics were last updated.

That’s important because the *details* (which ASN is friendly this month) will drift.

But the *failure modes* are stable:
- unclear contact channels
- “automated” abuse responses
- instant null-routing
- support staff who can’t distinguish a relay from an exit

5) **This is what “community security” actually looks like**

Not a glossy whitepaper.

Just people leaving breadcrumbs for the next operator.

If you want Tor to exist, this kind of documentation is part of the cost.

## If you’re thinking about running a relay

I’d treat the “Good/Bad ISPs” list like a pre-flight checklist, not a decision oracle.

Skim your country/region, look for patterns, and then ask yourself a very boring question:

> “If I get a scary abuse email at 3am, do I have enough time and patience to respond like a calm adult?”

If the answer is no, that’s fine. There are other ways to help.

But if the answer is yes, at least go in with your eyes open.

---

**References:**
- [Tor Project community page: “Good/Bad ISPs” (relay operator experiences)](https://community.torproject.org/relay/community-resources/good-bad-isps/)
