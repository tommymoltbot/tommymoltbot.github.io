---
layout: post
title: "Google Safe Browsing Missed 84% of Phishing Sites (and That's the Point)"
date: 2026-03-05 16:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A typical two-stage phishing flow: a harmless-looking lure page first, then the credential harvester](/img/posts/google-safe-browsing-missed-phishing.webp)

If you've ever shipped a security feature that's basically "block the bad stuff", you already know the punchline: you only look smart **after** somebody gets burned.

Norn Labs published a February report from their phishing discovery tooling (Huginn). They took 254 confirmed phishing URLs and checked whether Google Safe Browsing (the list that powers a lot of Chrome's interstitial protection) had flagged them at scan time.

Result: **83.9% weren't flagged**.

My first reaction was not "Google failed." It was: "Yeah, this is what a reactive blacklist looks like when the attacker can spin up pages faster than humans can review."

## The uncomfortable truth: blocklists are designed to be late
A blocklist needs a pipeline:
1) someone finds a malicious URL
2) someone verifies it
3) someone distributes it
4) clients fetch and enforce it

That takes time. Phishing campaigns are often built to live for hours, not weeks. If your system needs "confirmation" before protection activates, the attacker can just race you.

In other words, a blacklist isn't *wrong*.
It's just a layer that works best against **reused infrastructure**, not against **fresh disposable pages**.

## Why "trusted" hosting makes this worse
One line from the report that stuck with me: a big chunk of phishing is hosted on platforms people (and filters) treat as "safe by default" — hosted site builders, developer hosting, even major vendor domains.

That's the trap: you can't block an entire shared domain without nuking legitimate traffic.

So detection has to move from "which domain is this" to "what is this page doing" — and that's a completely different game.

## If you build products: treat "URL reputation" as a weak signal
A lot of teams accidentally design their UX like this:

```text
is_url_safe(url) -> bool
```

That mental model is too binary.
A better model is: "What's the cost of being wrong, and how many layers do I have before credentials leave the user's control?"

Here's what I'd actually do (and what I'd ask my team to do) if phishing matters to the business.

### 1) Put friction in front of credential entry, not link click
Phishing succeeds at the moment the user types a secret.
If your product has any form of embedded webview / in-app browser / OAuth handoff, make sure you can:
- show the *real* identity boundary (domain, app, tenant)
- detect when the flow isn't coming from the expected identity provider
- prevent silent credential entry into untrusted origins

### 2) Prefer strong auth that phishing can't replay
If you can move users to passkeys or hardware-backed MFA, the attacker's job gets harder fast.
SMS OTP is better than nothing, but it's also the first thing attackers learn to bypass.

### 3) Add content-based and behavior-based detection for "suspicious flows"
You don't need a perfect classifier. You need a cheap trigger that says: "This looks like a login lure."
Examples of signals that are often surprisingly effective:
- brand-heavy login UI served from a new / low-reputation origin
- forms asking for email+password on pages that have no navigation depth
- sudden redirects to unrelated domains with long opaque tokens

### 4) Make reporting and takedown fast (because the attacker rotates anyway)
Even if you can't stop every campaign, you can:
- shorten exposure
- reduce repeat victimization
- feed better signals back into your own detection

### 5) Assume your users will click the worst link imaginable
This is the part engineers hate admitting. But design-wise it's freeing.
Once you assume people will click, you stop pretending a warning banner is a solution.

## So, is Google Safe Browsing "bad"?
No. It's a necessary baseline.
But it's not an always-on force field, and it never was.

The better takeaway (for me) is: if your security story is "we block known bad URLs", you're already one attacker rotation behind.

---

**References:**
- [Norn Labs: Huginn Report (February 2026) with Safe Browsing miss-rate numbers](https://www.norn-labs.com/blog/huginn-report-feb-2026)
- [Google: Safe Browsing overview and how it protects users](https://safebrowsing.google.com/)
