---
layout: post
title: "An Open Source Endowment Isn’t Magic (But It’s the Right Shape of Boring)"
date: 2026-02-26 16:12:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Open Source Endowment](/img/posts/2026-02-26-open-source-endowment-01.webp)

Open source funding discussions usually go like this:

- someone ships something the whole internet depends on,
- maintainers burn out,
- a security incident happens,
- a few big companies write a one-time check,
- everyone goes back to pretending the problem is solved.

So when I saw the [Open Source Endowment announcement and backer list](https://endowment.dev/), my first reaction was: *finally, someone is proposing a funding mechanism that’s supposed to outlive the hype cycle.*

Not “another sponsor program.” Not “please donate $5/month.” An endowment.

## What they’re proposing (in plain terms)

The pitch is simple and almost aggressively unsexy:

- raise a big pool of money (the principal)
- invest it conservatively
- spend only the investment returns (they mention targeting ~5%)
- use that to fund critical open source projects over the long run

This is basically the university endowment model, but pointed at the open source supply chain.

TechCrunch says the nonprofit already has 501(c)(3) status, has raised **$750K+** in commitments, and the founder’s goal is **$100M** in assets within seven years.

If you’re allergic to grand targets: same. But the *shape* of the plan is still worth discussing.

## Why an endowment is the right kind of “boring”

### 1) It breaks the dependency on corporate mood swings

Corporate sponsorship is not “bad,” it’s just… not stable.
Budgets change, leadership changes, priorities change.

An endowment is at least attempting to build a funding source that isn’t directly coupled to a single company’s quarterly narrative.

### 2) It changes the default question from “who pays?” to “what’s critical?”

The most important open source projects are often:

- unglamorous
- invisible until they break
- hard to monetize without becoming a different product

Funding models that depend on hype, logos, and marketing benefits naturally underfund that category.
A data-driven grant model (they explicitly talk about usage / dependency metrics) is *closer* to what we actually need.

### 3) It acknowledges the uncomfortable part: governance

Money is the easy part. Influence is the hard part.

Direct sponsorship can easily turn into “we pay, so we decide.” Even when nobody says it out loud.
An endowment doesn’t magically fix that, but it gives you a fighting chance to design governance that favors maintainers and the broader ecosystem over any single donor.

### 4) It’s a realistic reaction to “open source is 50% of your stack” stats

TechCrunch cites research suggesting open source can be **up to 55%** of organizational tech stacks.
I don’t care about the exact number; the point is that OSS is not a nice-to-have.

If it’s infrastructure, treating maintainer work like volunteerism is basically an ops anti-pattern.

### 5) The time horizon matches the problem

Security bugs like Heartbleed and supply chain drama like XZ didn’t happen because nobody cared.
They happened because “caring” wasn’t translated into sustained, boring maintenance work.

Endowments are literally a commitment to boring.
That’s why they work (when they do).

## The part I’m still skeptical about

If you target a ~5% spend rate, then:

```text
annual_grants ≈ endowment_assets * 0.05
```

So a $100M endowment would imply ~$5M/year to distribute.
That’s meaningful, but it also isn’t infinite money.
If you try to cover “everything important,” you’ll just recreate scarcity politics.

The only way this works is if they pick a narrow slice of truly critical, underfunded projects and stay disciplined about it.

Also: *selection criteria* matters. “Number of users” is a start, but it’s easy to game and it can reward popularity over fragility.
I’d love to see them lean into dependency depth (how many projects transitively rely on you) and risk signals (bus factor, security surface area, maintainer load).

## My take

This won’t “solve open source funding” the same way nobody “solves public infrastructure.”

But an endowment is one of the few funding shapes that matches the reality:
open source is long-lived, boring, and foundational.

If the Open Source Endowment can stay transparent, resist donor capture, and fund the projects that are too critical to fail and too boring to fundraise… it’s worth taking seriously.

---

**References:**
- [TechCrunch report on the Open Source Endowment launch](https://techcrunch.com/2026/02/26/a-vc-and-some-big-name-programmers-are-trying-to-solve-open-sources-funding-problem-permanently/)
- [Open Source Endowment homepage and mission](https://endowment.dev/)
- [Linux Foundation research on the “World of Open Source 2025” (stack share statistic)](https://www.linuxfoundation.org/research/world-of-open-source-global-2025)
