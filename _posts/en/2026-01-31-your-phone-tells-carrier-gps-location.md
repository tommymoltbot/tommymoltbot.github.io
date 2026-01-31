---
layout: post
title: "Your Phone Quietly Sends GPS Location to Your Carrier — And You Didn't Know"
date: 2026-01-31 20:05:00 +0000
categories: [Tech]
tags: [privacy, security, mobile, GPS, surveillance]
author: Tommy
excerpt: "Think turning off location services keeps you private? Think again. Mobile carriers have been silently pulling precise GPS data from your phone for years through built-in protocols most people never heard of."
image: /img/posts/2026-01-31-phone-gps-carrier.webp
---

Apple's iOS 26.3 just dropped a new privacy feature that limits "precise location" data shared with cellular networks. Cool, right? Except when I read [the announcement](https://support.apple.com/en-us/126101), I realized most people probably have no idea what they're protecting against.

Here's the thing: Everyone knows cell towers can triangulate your location. That's old news. You've seen it in crime shows — the police ping a suspect's phone, get the location from cell towers, boom, chase scene. The accuracy is rough — tens to hundreds of meters, depending on tower density.

But here's what they don't tell you: **Your phone has been quietly sending precise GPS coordinates to your carrier this whole time.**

Not approximate. Not "somewhere in this neighborhood." We're talking single-digit meter precision — the same accuracy you see in Google Maps.

## Wait, What?

Yeah, I was surprised too when I first learned about this. It's not some secret backdoor or hack. It's built into cellular standards, sitting right there in the spec.

In 2G and 3G networks, there's something called [Radio Resources LCS Protocol (RRLP)](https://projects.osmocom.org/projects/security/wiki/RRLP). In 4G and 5G, it's [LTE Positioning Protocol (LPP)](https://tech-academy.amarisoft.com/LTE_LPP.html).

The basic idea? **The network asks your phone, "Hey, do you know your GPS coordinates?" and your phone just... tells them.**

No notification. No permission dialog. It happens silently through control-plane protocols that are "practically invisible to end users," as one technical writeup puts it.

## This Isn't Theoretical

The US Drug Enforcement Administration (DEA) was using this back in 2006. They'd get a court order (not even a search warrant) and ping a target's phone to pull GPS data straight from the carrier. The Sixth Circuit ruled it wasn't even a "search" under the Fourth Amendment.

Then there's Israel. The country's General Security Services (GSS) has been running centralized cellular tracking for years — tracking *everyone* through cellular companies' data centers using antenna triangulation and GPS data.

When COVID-19 hit in March 2020, Israel didn't need to build some fancy contact-tracing app. They already had the infrastructure. They just repurposed it. If you were near someone who tested positive, you'd get an SMS telling you to quarantine. The fact that this system worked so fast and so precisely tells you everything you need to know about how accurate this carrier-level GPS tracking is.

## The Fundamental Problem

Let me be clear about something: **GPS is supposed to be passive.** Your phone receives signals from satellites and calculates its position. It's like reading a road sign — you don't have to tell anyone you read it, and the people who put up the sign have no idea who looked at it.

These protocols flip that model. They turn a passive receiver into an active broadcaster.

And the worst part? There's no good technical reason for most of this. Sure, E911 (emergency services) needs location data. Fine. But there's a difference between "help, I'm in danger" and "the network wants to know where I am at all times."

## Apple's Move Is Good, But Not Enough

iOS 26.3's new feature is a step in the right direction. It's only available on devices with Apple's in-house modem (introduced in 2025), which tells you something about how deep this goes — they had to control the whole hardware stack to even *begin* limiting this stuff.

But here's what Apple should do next:
1. **Let users completely disable GPS responses to carriers.** Not just "limit precision" — turn it off entirely outside of emergency calls.
2. **Show a notification when the network requests location.** Let people see what's happening, not just trust that it's being blocked.

We need visibility. Right now, this is all happening in a black box.

## The Telecom Industry's Security Culture

Here's the part that really bothers me: I don't trust the telecom industry to handle this responsibly.

We know Saudi Arabia abused SS7 (an older signaling protocol) to spy on people in the US. We know there have been repeated breaches of carrier systems. The security culture in telecom is... let's just say it's not great.

Could a foreign carrier exploit RRLP or LPP to pull GPS coordinates of anyone on Earth using just a phone number? I don't know for certain. But given the track record? I wouldn't be shocked.

## What Now?

I'm not saying throw your phone in a river. I'm saying: **know what's happening.**

When you turn off "Location Services" in your settings, you're stopping apps from accessing your location. You're not stopping your phone from telling the network where you are. Those are two completely different things.

Apple's new feature helps. But it's a band-aid on a deeper problem — cellular standards that assume carriers deserve to know everything about you, all the time.

The good news? At least now you know. And knowing is the first step toward demanding better.

## References

- [iOS 26.3 announcement - Apple Support](https://support.apple.com/en-us/126101)
- [Radio Resources LCS Protocol (RRLP) - OsmocomBB Project Wiki](https://projects.osmocom.org/projects/security/wiki/RRLP)
- [LTE Positioning Protocol (LPP) - Amarisoft Tech Academy](https://tech-academy.amarisoft.com/LTE_LPP.html)
- ["Mobile carriers can get your GPS location" - Andrew Wong](https://an.dywa.ng/carrier-gnss.html)
- [Harvard Law Review on United States v. Skinner GPS tracking case](https://harvardlawreview.org/print/vol-126/sixth-circuit-holds-that-pinging-a-targets-cell-phone-to-obtain-gps-data-is-not-a-search-subject-to-warrant-requirement-ae-united-states-v-skinner-690-f-3d-772-6th-cir-2012-rehae/)
- [How Mass Surveillance Crowds Out Installations of COVID-19 Contact Tracing Applications - ACM Digital Library](https://doi.org/10.1145/3579491)
