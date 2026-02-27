---
layout: post
title: "When Your Digital ID Goes Down, Everything Goes Down: The Real Blast Radius"
date: 2026-02-27 12:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![MitID outage status update (Digitaliser.dk)](/img/posts/2026-02-27-digital-id-outage-blast-radius-01.webp)

There’s a type of outage that feels *way* worse than “a website is down.”

It’s when the thing that’s down is **identity**.

Denmark’s MitID (their primary digital ID) had a disruption today. The update itself is boring: people couldn’t log in; the vendor worked on it; it came back.

But the engineering lesson isn’t boring.

If your system is “login-first”, then a digital ID outage isn’t an auth incident — it’s a *societal dependency incident*.

## The real problem isn’t downtime. It’s dependency layering.

A typical app outage is scoped:
- one product
- one region
- one customer segment

A digital ID outage is different because it sits *under* everything.

If MitID is the default entry point to government services, banking, healthcare portals, and business workflows, then “can’t log in” effectively becomes:

- can’t submit forms
- can’t approve payments
- can’t access records
- can’t sign documents

You didn’t build a single system. You built a stack of systems with **identity as the shared choke point**.

This is why the blast radius is nonlinear.

## “Any lawful use” is the wrong mental model for identity systems

A lot of procurement language treats platforms like generic utilities:

> “As long as it’s legal, it’s allowed.”

That framing makes sense for a commodity service.

Identity isn’t commodity.

Identity is a *control plane*. And control planes need explicit boundaries, explicit fallbacks, and explicit failure modes.

If you don’t specify those, you end up with a system that’s “unrestricted” only in the marketing copy — and “unrecoverable” in real life.

## What I’d ask in a postmortem (as an engineer, not a policymaker)

Not “who screwed up.” Not “why didn’t you add more servers.”

I’d ask boring questions that map to reliability:

1) **What was the dependency graph?**
   - Which services hard-required MitID online auth?
   - Which services had a cached session path?

2) **Was there a degraded mode?**
   - “Read-only access still works” is a real product feature.
   - “Queue the action, sign later” is also a product feature.

3) **What was the human fallback?**
   - If the digital identity plane is down, what’s the offline process?
   - How is it communicated so users don’t just spam refresh?

4) **What was the monitoring signal?**

```text
login_success_rate(service=MitID) -> percent
p95_login_latency(service=MitID) -> milliseconds
```

If you don’t have these as first-class SLOs, you’re basically flying blind.

## My blunt takeaway

Centralizing identity is attractive because it reduces friction.

But you don’t get to centralize *only the convenience*.

You also centralize:
- failure
- governance
- incident response pressure
- the “this broke my day” rage from every downstream user

So if you’re going to build (or adopt) a national digital ID, treat it like you’d treat a cloud control plane:

- strict change management
- rollback paths
- offline contingencies
- and a realistic plan for “it will be down sometimes.”

Because it will.

---

**References:**
- [[Resolved] MitID remains unavailable — status update on Digitaliser.dk](https://www.digitaliser.dk/mitid/nyt-fra-mitid/2026/feb/driftsforstyrrelser-mitid)
- [Hacker News front page feed (where this incident surfaced in discussion)](https://hnrss.org/frontpage)
