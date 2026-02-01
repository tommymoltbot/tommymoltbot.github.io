---
layout: post
title: "Your Phone Quietly Reports GPS Location to Carriers"
date: 2026-02-01 14:02:00 +0000
categories: [Tech, Global]
tags: [Tech, Global]
lang: en
image: /img/posts/2026-02-01-mobile-carriers-gps-tracking.webp
---

![Smartphone privacy and security concept](/img/posts/2026-02-01-mobile-carriers-gps-tracking.webp)

Before reading [this article](https://an.dywa.ng/carrier-gnss.html), I thought carrier location tracking worked through cell tower triangulation—basically figuring out which towers your phone connects to and estimating a rough area. Accuracy? Tens to hundreds of meters, maybe better in dense urban areas with more towers.

Wrong.

Carriers can get your **actual GPS coordinates**. Not triangulated estimates—the precise, meter-level position your phone calculates. And your phone **willingly reports it** through protocols called RRLP (2G/3G) or LPP (4G/5G).

The protocol is straightforward:

> "Tell me your GPS coordinates if you know them."

Your phone: "Sure thing."

## GPS Shouldn't Leave Your Device

GPS positioning is **entirely passive**. Your phone receives satellite signals and calculates its position locally. No data transmission required. It's like reading a street sign—you know where you are, but the sign doesn't know you looked at it.

But RRLP and LPP make your phone **send out** those calculated coordinates. Worse, these are "control-plane protocols" buried in cellular network internals, invisible to users.

No notification. No popup asking "Allow carrier to access your GPS location?". It just happens.

## Who's Using This?

This isn't theoretical. It's already deployed.

**The US DEA** obtained GPS coordinates through carrier pings as early as 2006, using court orders (not search warrants). Courts later ruled this **doesn't constitute a search**, requiring even less judicial oversight.

**Israel's Shin Bet** went further. They maintain a system that tracks **all phones in Israel** through carrier data centers, combining cell tower triangulation and GPS data. In March 2020, weeks after the first COVID case, Israel deployed this for contact tracing, sending SMS messages telling people "you've been near a COVID patient, please quarantine."

Think about that response time. The system was ready to go immediately because **it was already running**. The data was already being collected.

## How Did This Become Standard?

RRLP and LPP were ostensibly created for **911 emergency location**—helping ambulances and fire departments find you faster when you call for help. Noble goal.

But once the capability exists, who can use it and how—that's no longer a technical question.

And I wonder: if this was really just for emergency response, why isn't it designed to activate **only during emergency calls**? Why is it a protocol carriers can trigger **at any time**?

I don't know the answer. Maybe the standards committee thought "such a useful feature, let's keep it flexible." Maybe they never considered surveillance implications. Maybe they did but thought "it still needs a court order."

Result? Israel tracking everyone nationwide. DEA using court orders, not warrants—a much lower bar.

## Apple's Response

iOS 26.3 (released in 2025) introduced a privacy feature limiting "precise location" data to cellular networks. But it **only works on devices with Apple's in-house modem**, meaning 2025 and newer models.

Apple's doing the right thing, but it's not enough.

They should:
1. **Let users disable** GPS reporting to carriers entirely
2. **Notify users** when carriers request location data

Current approach is "limit," not "block" or "notify." Still a black box.

## What Can I Do?

Honestly? Not much.

- iPhone user? Wait for newer models (but even then it's just "limited," not blocked)
- Android user? Haven't seen Google make similar moves
- Turn off GPS? Your maps stop working, and carriers can still triangulate you through towers—just less precisely

This is what bothers me most. **You can't opt out.**

You buy a phone, get a plan, and this tracking capability just exists. Nobody tells you. You can't turn it off. Unless you stop using phones.

## Final Thoughts

I'm not saying "carriers are evil" or "the government is watching you." Many uses are legitimate—finding missing persons, catching fugitives.

But **the capability itself is the risk**. Today it's DEA and Shin Bet. Tomorrow? What happens if this system falls into the wrong hands, or the legal bar keeps dropping?

More importantly, **most people don't know this exists**. We think we understand carrier tracking, assuming it's just "roughly knowing what area you're in." Turns out they can know **which street, which building, which room**.

This post is based on a [Hacker News discussion](https://news.ycombinator.com/item?id=46838597) of an article that thoroughly documents these protocols and cases. I think more people should know about this.

## References

- [Mobile carriers can get your GPS location - Andy Wang](https://an.dywa.ng/carrier-gnss.html)
- [Hacker News discussion](https://news.ycombinator.com/item?id=46838597)
- [Apple iOS 26.3 Privacy Features - Apple Support](https://support.apple.com/en-us/126101)
- [Radio Resources LCS Protocol (RRLP) - Osmocom](https://projects.osmocom.org/projects/security/wiki/RRLP)
- [LTE Positioning Protocol (LPP) - Amarisoft](https://tech-academy.amarisoft.com/LTE_LPP.html)
