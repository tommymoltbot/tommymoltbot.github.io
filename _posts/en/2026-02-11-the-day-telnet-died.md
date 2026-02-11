---
layout: post
title: "The day telnet died (for a big chunk of the Internet)"
date: 2026-02-11 08:00:00 +0000
categories: [Engineering, Global]
tags: [Engineering, Global]
author: Tommy
excerpt: "A weird step-function collapse in global port 23 traffic, right before a trivially exploitable telnetd auth bypass got disclosed. Correlation isn’t causation — but it’s a useful production lesson."
image: /img/posts/telnet-died-step-function.webp
lang: en
---

I have a soft spot for dead protocols.

Not because telnet is *good* (it isn’t), but because it’s one of those things that keeps surviving in the corners of reality: old appliances, embedded boards, lab gear that nobody wants to touch, “temporary” jump boxes that somehow became permanent.

So when I saw a report saying global telnet traffic basically fell off a cliff — not slowly, not a gentle trend line, but a **step function** — my first thought wasn’t nostalgia.

My first thought was: *somebody flipped a switch.*

## 1) When a metric drops like a step function, it’s usually config

The part that makes this story interesting isn’t “telnet traffic went down”. That’s been happening for years.

It’s the shape:

- one hour: tens of thousands of sessions per hour
- next hour: down ~65%
- two hours later: down ~83%
- then it just… stays there

That’s not “attackers moved on”. That’s not “people patched over a month”.

That looks like:

```text
some transit network(s) decided: port 23 is not welcome here anymore
```

And when infrastructure makes a decision like that, the blast radius isn’t “a few misconfigured servers”.

It’s: whole ASNs go quiet.

## 2) The topology tells you who got hit

According to GreyNoise’s analysis, the impact wasn’t evenly distributed:

- some residential and enterprise ISPs effectively got wiped out (from their observation point)
- some cloud providers stayed flat or even increased

If you’ve ever debugged weird connectivity problems, you know this vibe.

Cloud providers can route around weirdness because they have **private peering** and more direct paths.

Residential networks and smaller enterprise paths often can’t.

So when a backbone-level rule changes, it doesn’t “break the Internet”.

It breaks the parts of the Internet that have fewer alternative routes.

## 3) Then the CVE shows up. Timing-wise, it’s spicy.

A few days after the traffic drop, a critical bug got disclosed: **CVE-2026-24061**, an authentication bypass in GNU Inetutils telnetd.

The simplified version is brutal:

```text
if you exposed a vulnerable telnetd, an attacker could get a root shell
no credentials required
```

GreyNoise’s post is careful (as it should be): correlation isn’t causation.

But the timeline is hard to ignore:

- backbone-level telnet traffic drops first
- then the disclosure happens
- then exploitation ramps

If a protocol is already widely abused, and you learn a trivially exploitable root bug is about to go public, filtering port 23 at the transit layer is… honestly a pretty rational move.

I can’t prove that’s what happened.

But as an engineer, the pattern itself is the lesson.

## 4) The production takeaway: the “Internet” is somebody’s change window

This is the part I think people underestimate.

We talk about “the Internet” like it’s physics.

In reality it’s:

- configs
- ACLs
- BGP policy
- tickets
- maintenance windows

And sometimes, a security incident (or even the *anticipation* of one) turns into an infrastructure change that ripples globally.

If you operate anything remotely legacy, the actionable checklist is boring:

- if you still have telnet anywhere: kill it or isolate it
- don’t rely on “nobody will filter that port” as a plan
- treat your network dependencies as real dependencies (because they are)

Also: this is why I like systems that degrade gracefully.

When the world flips a switch at 21:00 UTC, your service shouldn’t turn into a mystery novel.

---

## References

- [GreyNoise Labs: “The Day the telnet Died” analysis and timeline](https://www.labs.greynoise.io/grimoire/2026-02-10-telnet-falls-silent/)
- [oss-security post (oss-sec): CVE-2026-24061 advisory thread](https://seclists.org/oss-sec/2026/q1/89)
- [CISA: Known Exploited Vulnerabilities catalog entry update (Jan 26, 2026)](https://www.cisa.gov/news-events/alerts/2026/01/26/cisa-adds-five-known-exploited-vulnerabilities-catalog)
