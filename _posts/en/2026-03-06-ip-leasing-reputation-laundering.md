---
layout: post
title: "IP leasing is turning ‘IP reputation’ into a subscription service"
date: 2026-03-06 23:05:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A simple diagram of the IP leasing marketplace: address owners, leasing portals, and buyers](/img/posts/2026-03-06-ip-leasing.webp)

I used to treat an IP address like a slightly boring truth.
Not *identity*, but at least a semi-stable signal.

Lately that assumption feels increasingly fake.

I fell into a piece about the IPv4 leasing market and it basically puts words to the uncomfortable thing security teams have been feeling for years:
**a lot of “IP reputation” and “IP geolocation” is now… negotiable.**
Not because the math changed.
Because the incentives did.

## The five angles I care about

### 1) “IPv4 exhaustion” is not a physics problem. It’s a landlord problem.
Yes, the free pools are depleted.
But the address space didn’t evaporate.
It consolidated.

What that creates is a market where IPv4 blocks behave like real estate:
- held by parties with legacy allocations,
- rented out through brokers,
- and moved around to whoever can pay.

If you’re building systems that assume “an IP belongs to a relatively stable operator,” you’re assuming a world that’s already gone.

### 2) Reputation laundering turns your blocklists into vibes
I’m not even mad at blocklists.
They’re doing their best with the signals they have.

But once “get me delisted” becomes a product feature, you get a weird outcome:
- abusive actors can rotate into “clean” ranges,
- legitimate operators inherit the stink of past tenants,
- and defenders end up burning time chasing ghosts.

So your anti-abuse stack drifts toward overfitting (false positives),
or you relax it (false negatives).
Pick your poison.

### 3) Geolocation is a model, and leasing lets attackers feed the model
A lot of people talk about “IP geo” like it’s authoritative.
It isn’t.
It’s an aggregation of hints (routing, latency, rDNS patterns, registry data, user feedback, etc.).

What made me pause is how **self-published geofeeds** fit into this.
There’s an RFC for a format where a network operator can publish prefix → location mappings.
Useful idea.
Also a new lever.

If you control (or lease) the prefix, you can publish a feed.
If consumers trust it, your “location” becomes… whatever story you told.

### 4) Accountability breaks when the chain of custody gets blurry
The Internet’s routing/accountability scaffolding (WHOIS/registry records, IRR objects, routing policy, origin validation where deployed) was never perfect.
But it at least tried to answer:

> who is responsible for this address space?

Leasing and white-labeling push in the opposite direction:
- “someone else owns it on paper,”
- “someone else announces it,”
- “someone else handles abuse mail,”
- “and you don’t get a stable operator identity you can reason about.”

If your threat model relies on quickly attributing an IP to an org and escalating abuse, this is how it gets slower and noisier.

### 5) What I’d change in a security design (starting tomorrow)
If IP reputation + geo is getting weaker, the fix isn’t “throw it away.”
It’s “stop letting it be the deciding vote.”

Practical shifts that tend to survive this trend:
- Treat geo as a *hint*, not a gate. Use it for UI defaults and anomaly scoring, not hard allow/deny.
- Prefer stronger proofs for “where are you” and “who are you”: device attestation, step-up auth, verified payment rails, or enterprise identity.
- Track **ASN / prefix behavior** over time, not just single IPs (rotation is cheap; patterns are not).
- When you *must* allowlist, allowlist something you can audit: mTLS client certs, signed requests, workload identity, or VPN identities you control.
- Assume “residential-looking traffic” can be bought. Rate-limit + challenge flows accordingly.

None of this is glamorous.
But it’s boring in the good way: it fails less.

---

**References:**
- [Acid.vegas blog post explaining the IPv4 leasing ecosystem and why it undermines trust signals](https://acid.vegas/blog/the-shady-world-of-ip-leasing/)
- [RFC 8805: a standardized format for self-published IP geolocation feeds (“geofeeds”)](https://datatracker.ietf.org/doc/html/rfc8805)
