---
layout: post
title: "Your Phone Has Been Telling Carriers Your Exact GPS Location (And You Didn't Know)"
date: 2026-02-01 11:00:00 +0800
categories: Tech
lang: en
---

I came across [a post on Hacker News](https://news.ycombinator.com/item?id=46838597) this morning that made me do a double-take. It's about how mobile carriers can get your **exact GPS location**—not the rough "which cell tower you're connected to" kind of location, but single-digit meter precision.

And apparently, this has been happening for years. We just didn't talk about it.

## Wait, I Thought Cell Tower Triangulation Was Imprecise?

Yeah, that's what I thought too.

Everyone knows carriers can roughly locate you based on which cell towers your phone connects to. That's the stuff you see in crime shows—"the suspect was within 200 meters of this tower." It's imprecise because cell towers are sparse, especially before 5G rolled out.

But here's the thing: **that's not the whole story.**

Buried in the cellular standards (2G, 3G, 4G, 5G) are protocols that make your phone **silently send GPS coordinates to the carrier**. In 2G and 3G, it's called [Radio Resources LCS Protocol (RRLP)](https://projects.osmocom.org/projects/security/wiki/RRLP). In 4G and 5G, it's [LTE Positioning Protocol (LPP)](https://tech-academy.amarisoft.com/LTE_LPP.html).

The way it works is simple: the network asks "hey, do you know your GPS coordinates?" and your phone just... tells them.

No notification. No consent prompt. Just a quiet handshake in the background.

## Why Would They Design It This Way?

The official reason is **emergency services**. When you call 911, responders need to know where you are. If you're indoors or in an area with poor cell coverage, GPS gives a much more accurate location than cell tower triangulation.

That makes sense. I get it.

But here's where I start feeling uneasy: **GNSS (GPS, GLONASS, Galileo, BeiDou) was never meant to be a two-way system.** It's entirely passive. Your phone reads satellite signals to figure out where it is—like reading a road sign. You don't have to tell anyone you read the sign. Nobody knows which road sign you read.

By adding RRLP and LPP, the cellular standard turned GNSS into an **active reporting system**. Your phone now broadcasts its location to the carrier whenever asked.

And who gets to ask? Turns out, a lot of people.

## Who's Actually Using This?

The post mentions a few cases:

- **DEA in the US (2006)**: Obtained GPS coordinates from a courier's phone via a "ping" sent by the phone company. They needed a court order—but **not a search warrant**.
- **Shin Bet in Israel**: Runs a centralized tracking system that collects location data from **all phones** in Israel, all the time. During COVID-19, they used it for contact tracing and sent SMS messages telling people to quarantine if they'd been near a positive case.

The Israeli case is particularly revealing. Contact tracing started in March 2020, just weeks after the first Israeli COVID case. That means the infrastructure was already there, ready to go. They didn't build it for COVID—they'd been using it for years.

## The Part That Bothers Me

I'm not naive. I know governments have surveillance capabilities. I know intelligence agencies do what they do.

But the part that bothers me is how **quietly** this has been operating. RRLP and LPP aren't secrets—they're in the [public specifications](https://tech-academy.amarisoft.com/LTE_LPP.html). But somehow, they've slid under the radar. Most people I talk to don't know this is happening.

And the legal framework hasn't caught up. In the US, getting GPS data from a carrier only requires a court order, not a warrant. That's a lower bar than physically installing a GPS tracker on a car.

The other unknown: **can foreign carriers exploit this remotely?** Saudi Arabia has used [SS7 vulnerabilities to spy on people in the US](https://www.theguardian.com/world/2020/mar/29/revealed-saudis-suspected-of-phone-spying-campaign-in-us). Given the telecom industry's track record on security, I wouldn't be shocked if a state actor could get anyone's GPS coordinates using just a phone number or IMEI.

## What About Apple's iOS 26.3 Update?

Apple recently introduced a feature in iOS 26.3 that limits "precise location" data sent to cellular networks. It's only available on devices with Apple's in-house modem (introduced in 2025).

[Apple's announcement](https://support.apple.com/en-us/126101) says:

> Cellular networks can determine your location based on which cell towers your device connects to.

Notice how they didn't mention RRLP or LPP. Just "cell towers." Classic Apple—vague enough to be technically correct, but not the whole truth.

Still, limiting precise location sharing is a good first step. The fact that it requires Apple's own modem shows they needed full control of the silicon to pull this off. That's a rare advantage of vertical integration.

But here's what I think they should do next:

1. **Let users disable GNSS responses entirely.** Not just "limit precision," but actually turn it off.
2. **Notify users when a carrier tries to request location.** Like how iOS asks permission for camera or microphone access.

If carriers need location for emergency services, fine—make it opt-in for those cases. But there's no reason my phone should be silently broadcasting my GPS coordinates just because the network asked.

## My Takeaway

This isn't a conspiracy. It's not even a secret—it's right there in the standards. But the fact that so few people know about it says something about how disconnected most of us are from how our devices actually work.

I'm not telling you to throw away your phone or move to a cabin in the woods. But I do think we should have more control over what data our phones send, especially when it's something as precise as GPS coordinates.

Apple made a good move with iOS 26.3. Let's hope more companies follow.

And maybe next time someone tells you "we're protecting your privacy," you should ask: "from what, exactly?"

---

## References

- [Mobile carriers can get your GPS location](https://an.dywa.ng/carrier-gnss.html) — Andy Wang's deep dive into RRLP and LPP
- [RRLP Protocol Overview](https://projects.osmocom.org/projects/security/wiki/RRLP) — Osmocom security documentation
- [LTE Positioning Protocol (LPP)](https://tech-academy.amarisoft.com/LTE_LPP.html) — Amarisoft technical guide
- [Apple iOS 26.3 Privacy Feature](https://support.apple.com/en-us/126101) — Official Apple support document
- [Harvard Law Review on GPS Tracking](https://harvardlawreview.org/print/vol-126/sixth-circuit-holds-that-pinging-a-targets-cell-phone-to-obtain-gps-data-is-not-a-search-subject-to-warrant-requirement-ae-united-states-v-skinner-690-f-3d-772-6th-cir-2012-rehae/) — Legal analysis of U.S. v. Skinner
- [Guardian: Saudi Phone Spying in US](https://www.theguardian.com/world/2020/mar/29/revealed-saudis-suspected-of-phone-spying-campaign-in-us) — SS7 vulnerability exploitation
