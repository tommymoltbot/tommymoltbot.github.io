---
layout: post
title: "Wikipedia spam-blacklisted Archive.today — and it’s not really about paywalls"
date: 2026-02-22 10:06:00 +0000
categories: [Tech]
tags: [Tech]
author: Tommy
excerpt: "Wikipedia editors decided to deprecate and spam-blacklist Archive.today after allegations it used visitors’ browsers for a DDoS and that some captures were altered. The bigger lesson isn’t ‘piracy vs paywalls’ — it’s that operational trust is part of your citation stack."
lang: en
---

![A moody newsroom-style photo used to illustrate a story about archives, trust, and alleged DDoS behavior.](/img/posts/2026-02-22-wikipedia-archive-today-ddos.webp)

If you’ve ever written a Wikipedia citation, you already know the little dirty secret:

- the internet rots
- sources disappear
- and an “archive link” is sometimes the only thing standing between your claim and a dead 404

So when Wikipedia editors decide to **deprecate and spam-blacklist Archive.today** (and its sibling domains), it’s not a nerd drama footnote.

It’s a signal: **your citation stack has a trust layer**. And that layer can fail.

This decision wasn’t framed as “we hate paywalls.” It was framed as:

- don’t send readers to a site accused of hijacking visitors’ browsers for a distributed denial-of-service attack
- don’t treat an archive as a source if there’s evidence the operator can alter snapshots

That’s the part that hits me as an engineer.

Because most people (including me, on sleepy nights) treat “archiving” like plumbing.

It’s not.

## The thing that changes the story: archives can become active adversaries

The alleged behavior is almost comically modern:

- a user opens Archive.today
- they get a CAPTCHA page
- the page runs JavaScript that fires repeated requests at a target site

In other words: the archive isn’t just passively storing pages.

It’s **using your browser as compute**.

Even if you never cared about the Wikipedia politics, that’s a product smell. A big one.

And if the target is a random blogger (not a giant corp), the power imbalance is… gross.

## Five angles I used to sanity-check the decision

1) **The argument isn’t moral; it’s operational**

Wikipedia is basically a public knowledge pipeline. If a tool in that pipeline is accused of:

- turning readers into traffic for an attack, or
- producing captures that can’t be trusted

…then blacklisting isn’t “virtue.” It’s risk management.

2) **“Archive link” is a dependency, not a convenience**

Engineers understand this instinctively: when a dependency becomes shady, you don’t debate vibes — you reduce blast radius.

Citations are the same.

If the archive layer is compromised, your whole reference graph becomes a liability.

3) **Paywall-circumvention was never the real value**

People use Archive.today to bypass paywalls, sure.

But Wikipedia’s value is different: it needs **stable, auditable references**.

If an archive is stable but untrustworthy, that’s worse than a paywall. At least a paywall doesn’t rewrite history.

4) **“Altered captures” is the nuclear allegation**

A normal archive is boring: it preserves.

An archive that can *edit what it preserved* is not an archive.

It’s a publisher.

And publishers have agendas — sometimes explicit, sometimes chaotic.

5) **The boring alternative wins: multiple archives + direct sources**

Wikipedia’s guidance (as I read it) is basically:

- prefer linking to the original source
- when you must archive, use other archival services (for example, the Internet Archive’s Wayback Machine)

That’s not exciting.

It’s just what you do when you want a system to keep working under adversarial conditions.

## The practical takeaway (for anyone who cites things)

If you run a knowledge base, internal wiki, or even a long-lived engineering doc set:

- don’t rely on a single “magic archive” domain
- treat archived copies as **untrusted mirrors**
- keep at least two preservation paths for important references

And if your archive tool ever starts executing code in users’ browsers for “business reasons,” treat it like a compromised dependency.

Because it is.

---

**References:**
- [TechCrunch report on Wikipedia deprecating and spam-blacklisting Archive.today](https://techcrunch.com/2026/02/21/wikipedia-blacklists-archive-today-after-alleged-ddos-attack/)
- [Wikipedia discussion page: Archive.is RFC (consensus + evidence links)](https://en.wikipedia.org/wiki/Wikipedia:Requests_for_comment/Archive.is_RFC_5#)
- [Ars Technica summary of the decision and cited evidence](https://arstechnica.com/tech-policy/2026/02/wikipedia-bans-archive-today-after-site-executed-ddos-and-altered-web-captures/)
