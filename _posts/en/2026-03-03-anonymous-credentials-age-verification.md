---
layout: post
title: "Anonymous credentials: the only realistic way to do age checks without building a surveillance internet"
date: 2026-03-03 11:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Anonymous credentials diagram](/img/posts/2026-03-03-anonymous-credentials-01.webp)

I’ve had this low-grade dread for a while: the internet is slowly turning into “show ID to do anything”.

Not because every product team suddenly loves bureaucracy, but because of two forces that don’t care about user experience:

1) lawmakers discovering **age verification** as a blunt instrument, and
2) AI bots turning “open-ish platforms” into spam farms.

Those two pressures push platforms toward stronger authentication. The part that worries me isn’t “stronger auth” itself — passkeys and MFA are great. The scary part is **binding everyday browsing to a real-world identity**, because that’s when “security” quietly becomes “surveillance by default”.

That’s why I think *anonymous credentials* are the only idea in this space that’s both technically interesting and socially necessary.

## The basic problem: authorization vs identification

Most websites don’t actually need to know *who you are*. They need to know you’re allowed to do a thing:

- view adult content (age-gated)
- post without being a bot
- access a paid subscription
- rate-limit abuse

Traditional authentication collapses everything into one move: **prove identity → get access**.

Anonymous credentials try to split it:

- **Issuance**: you prove something to an issuer (maybe you show ID, maybe you pay, maybe you pass a real-world check).
- **Showing/Presentation**: later, you prove to a site that you hold a valid credential **without revealing which credential you got**, and ideally even if the issuer and the site collude.

That last part is the whole point.

If we *don’t* break that linkage, then “age checks” become “a perfect browsing transcript tied to your government name”. And once that exists, it won’t be deleted. It’ll be monetized.

## Why “just give everyone the same token” doesn’t work

The naive idea is kind of cute: if every user presents an identical credential, then the site can’t tell users apart.

But digital tokens copy like rabbits.

If one token leaks, it becomes an infinite clone factory for:

- bot armies
- credential resale markets
- underage sharing

And in normal account systems, you can at least detect “this account is logging in from 37 countries in 6 minutes”. Anonymous presentation removes that obvious lever.

So any usable anonymous credential system needs a way to be **unlinkable, but not infinitely shareable**.

That sentence sounds impossible until you remember: cryptography is basically the art of making “sounds impossible” into “it’s just math”.

## The wristband analogy (and why it matters)

The best explanation I’ve seen is the club wristband:

- The door checks your ID once.
- You get a wristband that says “over 21”.
- The bartender doesn’t need your name — the wristband is enough.

Online, we somehow reinvented the club, but insisted the bartender scan your driver’s license every time you order.

Anonymous credentials are the attempt to bring back the wristband model — digitally.

## What changes if platforms adopt this

This is the part that makes me think it’s worth paying attention to, even if you don’t care about cryptography.

### 1) Age verification stops being an automatic privacy disaster

I’m not here to debate every policy detail. But if “age checks” are going to happen, then the best-case outcome is:

- sites learn “this user is old enough”
- sites do **not** learn “this is Jimmy, born on X, living at Y, and he read these 600 pages”

If a system can make that *economically convenient* for sites, it changes the default trajectory.

### 2) It creates a new line of defense against AI-scale abuse

A lot of anti-bot systems are basically “collect data until you can be confident you’re human”. That works… until you realize it also collects data on humans.

Anonymous credentials offer a different direction:

- “prove you’re eligible”
- without forcing permanent, trackable identity

### 3) It forces better threat modeling (instead of vibes)

Any serious proposal has to answer uncomfortable questions:

- What does collusion between issuer and website reveal?
- How do revocation and abuse handling work?
- What’s the UX when a credential is lost?
- What prevents credential resale?

If a vendor can’t explain that clearly, it’s not a product — it’s a privacy-themed marketing page.

## My engineer take: the hard part isn’t the crypto, it’s the incentives

The crypto is hard, yes, but we’ve had decades of research here.

The real fight is incentives:

- Ad platforms *want* identity because identity is money.
- Regulators *want* enforcement because enforcement is politics.
- Sites *want* low-friction because low-friction is retention.

Anonymous credentials only win if they’re:

- cheap to integrate
- fast enough not to ruin page loads
- standardized enough that everyone doesn’t invent their own incompatible variant
- good enough that regulators accept them as “real verification”

That’s why I’ve been paying attention to things like Privacy Pass and anonymous credential standardization efforts. If this becomes a “one weird cryptography trick” that only academics can deploy, it’s dead.

## The uncomfortable conclusion

If the internet keeps drifting toward routine ID checks, we have two paths:

- accept surveillance as the default price of entry, or
- build mechanisms where you can prove what matters (age, eligibility, membership) without turning every click into an identity event

Anonymous credentials aren’t magic. But they’re the first idea in a long time that feels like it actually matches the shape of the problem.

And yeah, I hate that we even need this.

---

**References:**
- [Anonymous credentials: an illustrated primer (Cryptography Engineering blog)](https://blog.cryptographyengineering.com/2026/03/02/anonymous-credentials-an-illustrated-primer/)
- [Explainer on age verification laws and privacy trade-offs (The Verge)](https://www.theverge.com/tech/883855/age-verification-internet-apps-laws-privacy-safety)
- [Cloudflare’s overview of Privacy Pass and the standardization effort](https://blog.cloudflare.com/privacy-pass-standard/)
