---
layout: post
title: "When the customer is the Pentagon: don’t bully tech into surveillance"
date: 2026-02-26 10:15:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![An illustration of soldiers and AI surveillance](/img/posts/2026-02-26-surveillance-pressure.webp)

I don’t love writing about defense politics, but this one is too close to the *plumbing* of modern software to ignore.

EFF wrote a blunt post arguing that tech companies shouldn’t be bullied into becoming surveillance vendors — specifically in the context of pressure on Anthropic to loosen its “red lines” around surveillance and autonomous weapons.

If you build systems for a living, the important part isn’t “who’s right on Twitter.” It’s what this kind of pressure does to **product promises** and **trust boundaries**.

Five thoughts.

## Thought #1: “We have policies” is meaningless if the biggest customer can rewrite them

A lot of AI safety talk looks clean on a website:
- here are our usage policies
- here are our red lines
- here is our constitution

But when a government agency can credibly threaten to label you a supply-chain risk (or otherwise freeze you out of contracts), those policies turn into a negotiation.

That’s the part that makes engineers uneasy.

If you’re integrating an AI provider into your stack, you aren’t only choosing accuracy and latency — you’re betting on their ability to say “no” when someone powerful asks them to change the rules.

## Thought #2: The “surveillance” line is not abstract. It’s literally product surface area

People hear “surveillance” and think it’s a moral debate. For engineers, it’s also a roadmap:
- logging retention
- identity linkage
- cross-account correlation
- special access paths
- “compliance mode” features that never get deleted

Once a vendor ships this stuff for one customer, it has a way of sticking around.

And then, quietly, it becomes part of what the platform *is*.

## Thought #3: This creates a new kind of vendor risk: policy volatility

We already price in vendor risk:
- outages
- pricing changes
- model regressions
- deprecations

But “policy volatility” is nastier, because it changes what you’re allowed to build *without changing the API*.

The contract you care about is not just:

```text
request -> response
```

It’s:

```text
request + constraints + governance -> response + guarantees
```

If constraints and governance can flip under pressure, you can end up shipping a product that violates your own user promises.

## Thought #4: Engineers are stakeholders here, whether executives admit it or not

When a company caves on something like surveillance access, it doesn’t just hit PR.

It hits:
- who wants to work there
- what kinds of customers trust them
- what open-source ecosystem forms around them

Engineers have long memories about “this company said X, then did Y.” It affects hiring and retention more than leadership wants to believe.

## Thought #5: If your product touches sensitive data, you should design like policies will drift

Even if you *want* to believe your vendors:
- assume retention will expand
- assume access paths will multiply
- assume the definition of “authorized use” will move

So design accordingly:
- minimize what you send
- split secrets from prompts
- keep an off-switch
- keep an exit path (data + features) that you can execute in weeks, not quarters

None of this is fun. But it’s the same boring “production thinking” as always: plan for drift, not ideals.

---

**References:**
- [EFF: Tech companies shouldn’t be bullied into doing surveillance](https://www.eff.org/deeplinks/2026/02/tech-companies-shouldnt-be-bullied-doing-surveillance)
- [NPR background on the Pentagon ultimatum (as cited by EFF)](https://www.npr.org/2026/02/24/nx-s1-5725327/pentagon-anthropic-hegseth-safety)
- [WIRED report on the Pentagon dispute and “supply chain risk” framing (as cited by EFF)](https://www.wired.com/story/backchannel-anthropic-dispute-with-the-pentagon/)
- [Anthropic: Core views on AI safety](https://www.anthropic.com/news/core-views-on-ai-safety)
