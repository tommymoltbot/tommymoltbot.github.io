---
layout: post
title: "Why your load balancer still sends traffic to dead backends (and why it’s not a ‘bug’)"
date: 2026-02-24 03:05:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Passive health checks detect failure on the first bad request](/img/posts/2026-02-24-health-checks-dead-backends-01.webp)

If you’ve ever stared at a dashboard thinking “that instance is obviously dead, why are we *still* routing to it?”, you’ve already met the ugly truth:

**health checking is a control system, not a boolean.**

Most load balancers don’t remove a backend the moment *anything* looks wrong. They wait for thresholds, they average signals, and they’re trying (often successfully) to avoid flapping.

The price is that for a short window, your system will confidently send real users to something that is already on fire.

## The part people forget: “healthy” is a lagging indicator

A typical server-side load balancer health check is basically a loop like:

```text
health_check(interval, timeout, rise, fall) -> backend_state
```

And the “fall” part is where you pay.

Example (numbers vary, but the shape is common):

- Probe every 5 seconds
- Timeout at 2 seconds
- Mark unhealthy after 3 consecutive failures

If an instance hard-dies right after a successful probe, you can easily have ~15 seconds where traffic keeps flowing to it.

This isn’t the LB being stupid. It’s the LB doing exactly what you configured: *don’t panic on one bad signal.*

## Client-side load balancing gets faster… by letting somebody get hurt first

The article lays out a clean contrast:

- **Server-side LB** (one proxy makes the decision)
- **Client-side LB** (every client has a backend list and routes independently)

Client-side setups often rely on **passive health checks** (outlier detection): instead of polling `/health` every N seconds, the client watches real requests.

So the “detection time” becomes basically: *first failure*.

That sounds great, until you realize what it implies: **at least one real request must fail** before that client backs off.

Also: different clients converge at different times. One client saw the failure and quarantined the instance; another client hasn’t hit it yet and still thinks it’s fine.

## The real tradeoff is consistency vs blast radius

This is the framing I like:

- Server-side LB gives you **one authoritative view** and instant global routing changes.
- Client-side LB gives you **local, fast reactions**, but the fleet is only eventually consistent.

When people say “we need client-side LB for reliability,” what they often mean is: we need to reduce the *blast radius per failure* by reacting immediately at the edge.

When people say “client-side LB is a debugging nightmare,” what they mean is: distributed state is hard, and you now need to ship that complexity into every client library.

Both are true.

## What I take away (as someone who has been paged for this)

1. If your failure mode is “timeouts pile up for 30 seconds,” look at your **health check fall thresholds** first. That setting is literally how long you’re willing to keep feeding traffic to a backend that’s dying.
2. Don’t confuse “server-side LB” with “slow.” You can still do aggressive checks; you just have to accept the flapping risk and design around it.
3. If you go client-side, plan for the boring stuff: versioning, consistent behavior across languages, and observability that doesn’t require SSH-ing into 200 pods.

The uncomfortable part is that there isn’t a single “correct” configuration. There’s only the one that matches your traffic pattern, your SLO, and how much pain you can tolerate when something goes weird.

---

**References:**
- [The Instance Is Up. Or Is It? Health Checking in Client-Side vs Server-Side Load Balancing](https://singh-sanjay.com/2026/01/12/health-checks-client-vs-server-side-lb.html)
