---
layout: post
title: "When AI access requires KYC: the uncomfortable shape of OpenAI × Persona-style screening"
date: 2026-02-24 19:05:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![OpenAI and identity screening case study page](/img/posts/2026-02-24-openai-persona-screening-01.webp)

I keep running into the same pattern lately: **AI is getting more powerful, and the “who gets to use it” layer is getting more physical**.

Not “what prompt did you type,” but “show ID,” “prove you’re a real org,” “get screened,” “get reviewed.”

Today I read two things back-to-back:
- A public case study page about OpenAI using Persona to screen users “with zero friction.”
- A separate security-research-style blog post that *alleges* the screening stack looks a lot more like watchlists + ongoing re-screening than most users would assume.

I’m not here to litigate every claim in that research post (it’s long, spicy, and the strongest parts deserve careful verification). What I *am* pretty confident about is the structural takeaway:

> Once AI access becomes gated by identity infrastructure, the product stops being “a model” and becomes **a compliance pipeline**.

And pipelines have a way of expanding.

## Five angles I can’t stop thinking about

### 1) “Frictionless” for who?
If your product goal is “screen millions of users each month with zero friction,” you’ve basically declared the UX winner is the party doing the screening — not the person being screened.

From the user’s perspective, KYC is never frictionless. It’s just **outsourced friction**: you pay it in privacy, data retention, false positives, and appeal processes that may or may not exist.

### 2) Security arguments are real — but they also create permanent choke points
Yes, there are legit reasons to keep certain capabilities away from bad actors.

But the moment you tie access to *identity verification*, you’ve created a durable lever:

```text
want access -> verify identity -> pass screening -> keep passing screening
```

That last part matters. Even if the initial check is reasonable, ongoing re-checks are the kind of thing that quietly becomes “standard.”

### 3) False positives are not an edge case. They’re the tax.
Any large-scale screening system has false positives. That’s just how statistics behaves.

So the question isn’t “will mistakes happen?” It’s:
- How fast can normal users recover?
- Can you appeal without hiring a lawyer?
- Does “the model said no” become the end of the conversation?

This is where “trust & safety” starts looking like customer support debt — except with a legal vibe.

### 4) If the ID layer becomes a vendor market, it’ll standardize… and then ossify
Once you have an identity vendor ecosystem, you don’t just buy software. You buy:
- data sharing norms
- compliance checklists
- retention policies
- “industry best practices” (which often means “whatever regulators already like”)

That’s great if you’re a platform trying to scale risk management.

But if you’re a builder, it means the path from “I built something cool” to “users can access it” now runs through *someone else’s* definitions of legitimacy.

### 5) The long-term risk isn’t one company. It’s the default.
Even if you trust a specific company today, the more important question is: **what becomes normal**?

When the default interaction with “advanced AI” is “present identity documents,” you normalize a world where:
- experimentation gets permissioned
- anonymous research becomes harder
- access is shaped by geopolitics and compliance, not capability

I don’t think that future is guaranteed. But the shape is visible.

## My personal bottom line
I’m not anti-KYC in an abstract sense. I’m anti “KYC as the *default substrate* for knowledge tools.”

If the only way to ship safe AI is to wrap it in identity screening, then we should be honest: we didn’t just build a model. We built an institution.

And institutions need constraints.

---

**References:**
- [Persona case study page: OpenAI screens millions monthly with Persona](https://withpersona.com/customers/openai)
- [Security research blog post alleging a watchlist-style screening stack (vmfunc.re)](https://vmfunc.re/blog/persona/)
