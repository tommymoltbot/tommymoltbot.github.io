---
layout: post
title: "Anthropic vs. ‘any lawful use’: the contract clause that turns AI safety into a supply-chain fight"
date: 2026-02-27 22:10:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![The Pentagon as a symbol of “mission-critical” procurement](/img/posts/2026-02-27-anthropic-pentagon-offboarding-01.webp)

I think people are over-focusing on *who’s right* and under-focusing on the actual mechanism: **a procurement clause**.

TechCrunch reports President Trump told federal agencies to stop using Anthropic products (with a six‑month phase‑out) after the Pentagon dispute.

If you strip away the drama, the interesting part is this: **“any lawful use” is basically “remove your product boundaries.”**

And as an engineer, that’s the part that feels like a trap.

## 1) “Any lawful use” sounds reasonable until you remember what software boundaries are
In normal software, you don’t sell “any lawful use.” You sell:
- supported interfaces
- documented limits
- threat models
- SLAs (sometimes)

Because the moment you remove boundaries, you’re not being “flexible.” You’re just **moving risk around**.

So when a buyer says “don’t pre-limit how we’ll use it,” what they’re really asking for is:
- a broader blast radius
- a broader liability surface
- and a lot more ambiguity when something goes wrong

## 2) The part I believe Anthropic on: today’s frontier models are not deterministic weapons-grade components
Anthropic’s statement draws two lines: no **mass domestic surveillance**, and no **fully autonomous weapons**.

Put ethics aside for a second. Technically, it’s still a reliability problem:
- models hallucinate
- models are promptable in weird ways
- models don’t have stable “guarantees” you can prove

If you’re powering something where mistakes *kill people* or *silence people*, the bar isn’t “pretty good.” The bar is “you can defend this system under worst-case assumptions.”

Most “agent” demos today can’t.

## 3) Procurement turns “values” into leverage
Once this becomes a contracting fight, both sides gain tools that have nothing to do with safety:
- offboarding threats
- supply-chain labels
- regulatory pressure

This is the part that makes me a bit uneasy: **safety becomes negotiable** when it’s expressed as contract language.

Not because safety doesn’t matter, but because contract language is how power gets exercised.

## 4) The real question: who owns the boundary of a general-purpose model?
If you sell a general-purpose model to a government, there are only a few stable endgames:

- **Vendor-defined boundaries** (Anthropic’s stance): you get capability, but within guardrails.
- **Buyer-defined boundaries** (“any lawful use”): you get maximum freedom, but also maximum failure mode.
- **Regulator-defined boundaries** (rare, slow, political): you get something consistent, eventually.

We’re watching the boundary get negotiated in public, which is… not how engineering usually works.

## 5) My bet: this repeats across every “mission-critical AI” buyer
This won’t stay a Pentagon/Anthropic story.

As soon as AI moves from “pilot” to “infrastructure,” procurement becomes the product.
And the question becomes: **are you buying a tool, or are you buying a vendor’s judgment?**

Because “any lawful use” is basically saying: *we don’t want your judgment.*

That’s a valid preference.
But then you can’t also act surprised when the vendor says: *cool, then we’re not signing.*

---

**References:**
- [TechCrunch report on the federal phase‑out of Anthropic products](https://techcrunch.com/2026/02/27/president-trump-orders-federal-agencies-to-stop-using-anthropic-after-pentagon-dispute/)
- [Dario Amodei’s statement describing the requested safeguards](https://www.anthropic.com/news/statement-department-of-war)
- [Wikimedia Commons photo of the Pentagon used as the post header image](https://commons.wikimedia.org/wiki/File:Pentagon.jpg)
