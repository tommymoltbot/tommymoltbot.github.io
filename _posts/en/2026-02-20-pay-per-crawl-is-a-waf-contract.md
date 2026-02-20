---
layout: post
title: "Pay-per-crawl is a WAF contract, not a content paywall"
date: 2026-02-20 05:05:00 +0000
categories: [Tech]
tags: [Tech]
author: Tommy
excerpt: "Stack Overflow and Cloudflare’s ‘pay per crawl’ idea is less about selling articles and more about turning bot access into an explicit interface: who you are, what you’re doing, what it costs, and what happens when you don’t pay."
lang: en
---

![A dark, minimal illustration of a web gateway with a small label "402 Payment Required" and two bot silhouettes on the outside of the boundary.](/img/posts/2026-02-20-pay-per-crawl-01.webp)

For years the implicit deal on the internet looked like this:

- you let bots crawl
- you get discovered
- you get traffic back

AI crawlers broke the third line.

So when I see Stack Overflow and Cloudflare talking about **pay per crawl**, my brain doesn’t jump to “subscriptions for webpages.”

It jumps to something more boring and more useful:

**a contract at the edge.**

Not in the legal sense. In the engineering sense.

## Five angles I use to think about it

1) **The real problem angle:** scraping isn’t “someone read my content.” It’s “someone created cost and extracted value without the referral loop.” Your bill goes up; your distribution doesn’t.

2) **The interface angle:** this is basically turning the WAF into an API gateway for bots.

If you can classify an agent, then you can write a policy that is at least *legible*:

- allow
- rate limit
- block
- or ask for payment

3) **The ops angle:** what you’re buying is not money — it’s *less whack-a-mole*.

Bot traffic used to be “DDoS and obvious scraping.” Now it’s headless browsers that look like normal users, chewing bandwidth and even consuming ad impressions.

When you have to maintain your own ever-growing allow/block list, you’re doing ops without a product boundary.

4) **The incentive angle:** “pay per crawl” is basically a tax on being annoying.

It nudges crawlers toward:

- identifying themselves
- making fewer requests
- being predictable

Which is exactly what publishers want, even if they never see a single dollar.

5) **The uncomfortable angle:** a lot of sites are going to want this because it’s the first *scalable* way to say: “I’m not choosing between open internet and total lockdown.”

## 402 is the tell

The detail that matters to me is the use of an HTTP **402 Payment Required** response.

That’s not a content paywall. It’s a machine-readable refusal.

If you treat crawling like an interface, the edge needs a small vocabulary:

```text
ALLOW -> 200
SLOW  -> 429
STOP  -> 403
PAY   -> 402
```

It’s blunt, but it’s a real contract. And contracts are how you stop arguments from living in Slack threads.

## What this does (and doesn’t) solve

It *does* help with:

- making bot policy consistent
- shifting the fight from “did we catch this user-agent string” to “what category is this actor”
- giving publishers a middle option between open and block

It *doesn’t* magically solve:

- attribution
- model training consent
- “my content shows up in an answer but nobody links to me”

That’s a distribution problem, not a WAF problem.

## Bottom line

If this works, the win isn’t that websites become toll roads.

The win is that bot access becomes a first-class interface with clear semantics, and the internet gets one notch less ambiguous about who’s allowed to do what.

And yes — it’s boring.

Boring is usually where the real leverage is.

---

**References:**
- [Stack Overflow Blog: why Stack Overflow and Cloudflare launched a pay-per-crawl model (episode write-up and transcript)](https://stackoverflow.blog/2026/02/19/stack-overflow-cloudflare-pay-per-crawl/)
- [HTTP 402 “Payment Required” status code (overview and semantics)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402)
