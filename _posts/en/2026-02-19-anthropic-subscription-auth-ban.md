---
layout: post
title: "Legal text just got weaponized: Anthropic bans “subscription auth” routing (and tool builders should care)"
date: 2026-02-19 04:03:00 +0000
categories: [AI]
tags: [AI]
author: Tommy
excerpt: "Anthropic now explicitly forbids routing Claude Free/Pro/Max OAuth tokens through third-party products. It looks like legal boilerplate, but it’s really a platform boundary: consumer auth is not an API." 
lang: en
---

![Anthropic logo mark on a flat background, used here to illustrate a policy boundary between consumer subscriptions and developer API usage.](/img/posts/2026-02-19-anthropic-subscription-auth-ban-01.webp)

I saw a small line in Anthropic’s Claude Code docs that’s going to matter a lot more than it looks.

Anthropic now explicitly says you **can’t use OAuth tokens from Claude Free/Pro/Max (“subscription auth”) inside other products or services**. If you’re building a third‑party tool, you’re supposed to use **API keys** (or cloud-provider auth) — not “log into Claude.ai and proxy the token.”

This sounds like boring legal compliance. It isn’t.

It’s a **platform boundary**. And it’s about to shape a whole ecosystem of “AI wrappers” and “agent products.”

## Five angles I use to think about this

1) **Business angle:** this is about distribution control. Subscription plans are priced for *individual usage*, not for being an auth backend for your startup.

2) **Engineering angle:** OAuth tokens are extremely easy to misuse. If your product can see a user’s token, your product can leak it.

3) **Security angle:** token routing is basically “credential stuffing, but as a feature.” Even if you mean well, it’s a nightmare to audit.

4) **Platform angle:** this is Anthropic drawing a clean line: consumer auth is for *their* apps; developer auth is for *your* apps.

5) **Ecosystem angle:** expect enforcement. Not because Anthropic hates builders — because this is the only way to prevent a grey market of subscription arbitrage.

## What changed (in plain English)

The doc distinguishes:

- OAuth authentication: used with Claude Free/Pro/Max plans, intended only for Claude Code and Claude.ai
- API key authentication: intended for developers building products and services

And then it says (in plain terms): using OAuth tokens obtained through consumer plans in any other product, tool, or service is not permitted.

If you’re building:

- a browser extension that “logs into Claude for you”
- an agent app that proxies Claude Code traffic
- a team tool that asks everyone to paste a Claude.ai token

…you should assume this is now explicitly out of bounds.

## The boring fix (that most people will resist)

Use API keys.

But the real reason people avoid API keys is not technical. It’s economic:

- API calls have clear metering
- margins are visible
- you can’t hide behind “the user already pays for Pro”

So you’ll see a split:

- **Serious products** will move to API billing (and build real cost controls).
- **Hobby / grey-market wrappers** will either die or try to play cat-and-mouse.

## If you’re building an AI product: what I’d do this week

### 1) Audit your auth flow

If you touch a consumer OAuth token at any point, treat it as a risk and a future outage.

### 2) Build a real cost model

Don’t just say “we’ll charge $X/month.” Model:

```text
cost_per_user = tokens_in * rate_in + tokens_out * rate_out + overhead
```

If that equation scares you, it means your business model wasn’t stable yet.

### 3) Implement guardrails before you scale

- per-user rate limits
- per-workspace spend caps
- a “kill switch” for runaway agents

This is not just compliance — it’s survival.

## My bottom line

This isn’t Anthropic being mean.

It’s them saying: **“subscription plans are not an API.”**

And if you’re building on AI models, you want to internalize that early — because every provider will converge on the same boundary.

---

**References:**
- [Claude Code docs: Legal and compliance (authentication and credential use)](https://code.claude.com/docs/en/legal-and-compliance)
- [Anthropic Consumer Terms of Service (Free/Pro/Max)](https://www.anthropic.com/legal/consumer-terms)
- [Anthropic Commercial Terms (Team/Enterprise/API)](https://www.anthropic.com/legal/commercial-terms)
