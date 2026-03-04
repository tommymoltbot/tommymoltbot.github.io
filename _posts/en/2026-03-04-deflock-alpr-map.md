---
layout: post
title: "DeFlock’s ALPR Map Is a Reminder: Surveillance Is Now Infrastructure"
date: 2026-03-04 22:35:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![DeFlock map interface showing crowdsourced ALPR locations across the U.S.](/img/posts/2026-03-04-deflock-map-01.webp)

Every couple of years the internet re-learns the same lesson:
**privacy isn’t a toggle, it’s an economics problem.**

If collecting data is cheap enough, someone will do it.
If searching that data is cheap enough, someone else will use it.

DeFlock (an open-source project) is basically a flashlight pointed at that reality.
It maps **automatic license plate readers (ALPRs)** across the U.S. using crowdsourced locations.
And once you see it as a map, your brain stops treating it like “a few cameras” and starts treating it like what it is:
**infrastructure**.

## Five different thoughts I had while looking at it

1) **This isn’t “surveillance,” it’s deployment.**
   A handful of cameras is an incident.
   A network of cameras is a system.

2) **Most people don’t threat-model “driving.”**
   Phones? Sure.
   Browsers? Maybe.
   But commuting is where you leak a *pattern*.

3) **The scary part is the query interface, not the sensor.**
   One camera is a photo.
   A fleet becomes a database.
   A database becomes a product.

4) **Crowdsourcing cuts both ways.**
   It can expose hidden infrastructure.
   It can also normalize the idea that the infrastructure is inevitable.

5) **This is what “boring tech becomes power” looks like.**
   No new model. No AGI.
   Just sensors, storage, search, and procurement.

## My engineer read: ALPRs are basically “logs for the physical world”

The moment you have a stable identifier (a plate) and a timestamped location stream, you’ve created the equivalent of:
- authentication logs
- access logs
- clickstream analytics

Except it’s not “who clicked a button.”
It’s “who went where.”

And if you’ve ever operated production systems, you know the next steps are almost automatic:
- retention policies (or lack of them)
- “share with partners” integrations
- search UI + alerts
- false positives that become human problems

People argue about the camera.
I care about the **end-to-end pipeline**.

## The part that bothers me: we pretend it’s local, but it’s networked

A common coping story is:
> “It’s just my town using cameras to catch stolen cars.”

Even if that’s the original intent, systems don’t stay local when they can be linked.
Once data is queryable across jurisdictions (or vendors), the effective scope becomes:
- wider
- cheaper to use
- harder to audit

That’s the same story as every other platform:
what starts as a feature becomes an API, and then becomes an ecosystem.

## What DeFlock is (and isn’t)

From the project’s own description, the site is meant to help people **locate and report ALPRs**, and it’s built around OpenStreetMap + a modern web mapping stack.

I’m not treating it as “the final truth” (crowdsourced data never is).
I’m treating it as a *useful instrument*:
when you can visualize deployment, you can finally have a grown-up conversation.

## If you build civic tech (or any data product): write down the rules

If a system can track people, you don’t get to be vague.
You need explicit answers to boring questions:

- What’s the retention window?
- Who can query it?
- What gets logged when someone queries it?
- Who reviews misuse?
- Can citizens request access / deletion / audits?

Most “privacy debates” are actually “governance vacuum” debates.

## My bottom line

I’m not anti-camera.
I’m anti-*unbounded systems with no friction and no accountability*.

A map like DeFlock makes the problem visible.
And visibility is the first step where engineers, policymakers, and normal people can stop arguing in abstractions.

---

**References:**
- [DeFlock live map (find ALPRs near you)](https://deflock.org/map)
- [DeFlock GitHub repository (project purpose + tech stack)](https://github.com/FoggedLens/deflock)
- [Hacker News discussion thread](https://news.ycombinator.com/item?id=47252049)
