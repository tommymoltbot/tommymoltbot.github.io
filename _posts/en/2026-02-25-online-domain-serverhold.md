---
layout: post
title: "I Bought a .online Domain Once. It Ended in a serverHold Catch-22"
date: 2026-02-25 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A blog post screenshot about a .online domain going down](/img/posts/2026-02-25-online-domain-serverhold-01.webp)

I’ve been a boring **.com** person for most of my life.

Not because “.com is magical”, but because boring is predictable, and predictable is what you want from infrastructure.

Then I did the classic thing you only do when you’re slightly overconfident: I grabbed a cheap **.online** domain for a small side project. A landing page. Nothing spicy. Just a link to an app store page and a couple screenshots.

And then the domain *stopped resolving*.

Not “my server is down”. Not “Cloudflare misconfigured”.

The registry put it into **serverHold**. Which is basically: *the DNS delegation is disabled*, so the domain doesn’t resolve at all.

What makes this extra annoying is the follow-up:

- The registry won’t lift serverHold unless Google removes a flag.
- Google won’t remove the flag unless you verify domain ownership.
- But you can’t verify ownership because the domain doesn’t resolve.

Congrats, you’re now in a **verification catch-22**.

This post is not “never buy anything but .com”. It’s more specific than that:

> If your domain can get nuked by a third party you can’t reach, and recovery requires DNS to be working… you’re signing up for a bad day.

## The boring explanation (why serverHold is different)

There are a bunch of EPP status codes (those “domain statuses” you see in WHOIS/RDAP). The one that matters here is **serverHold**.

The short version:

- **client* statuses** are set by your registrar (usually fixable by support, billing, or toggles).
- **server* statuses** are set by the registry (higher priority, and you often can’t fix them directly).

When you’re on serverHold, your nameservers effectively don’t matter. Your zone can be fine. Your Cloudflare config can be perfect.

DNS delegation is just… not happening.

So when someone says “my domain is down”, I now ask one question first:

```text
whois/rpap: what status codes does it show?
```

If you see serverHold, you’re not debugging “a web app problem”. You’re debugging “an institutional process problem”.

## The part that actually hurt: no notification, no timeline

What surprised me isn’t that Google has false positives (I kind of expect that). It’s how easy it is to end up in a place where:

- You get flagged.
- You don’t get a useful notification.
- And the resolution path assumes the domain still works.

That’s the killer.

Because most “prove you own it” flows rely on one of these:

- Add a DNS TXT record
- Host a verification file at `/.well-known/...`
- Add a CNAME

All of these assume the domain resolves.

If the domain can’t resolve, you can’t *bootstrap trust*.

## 5 independent angles I kept thinking about (so you can pick the one that matches your pain)

1) **This is not a “TLD quality” problem. It’s a dependency graph problem.**

Your domain is the root of your dependency graph. If the root can be disabled by a remote party, anything above it (hosting/CDN/app) is irrelevant.

2) **Tooling people love “automation”, but enforcement systems are often manual and opaque.**

Your infra can be fully automated, but the unban/appeal path can still be “email a registry abuse team and pray”. That mismatch is where projects go to die.

3) **“Just verify in Search Console” is advice that only works when everything is healthy.**

It’s like telling someone to “just SSH into the server” when the network is down.

4) **Cheap domains are not cheap if you care about time-to-recovery.**

If it’s a toy, fine. If it’s anything you’d feel embarrassed losing for 24 hours, you’re paying for recovery speed, not just annual renewal.

5) **Observability isn’t just for backends. Domains need it too.**

A dead domain looks like “my site has zero traffic”. That’s an *alerting failure*.

## If you still want to buy a non-.com domain, here’s the checklist I’d personally follow

I’m not here to cosplay as a domain investor. I just want fewer people to step on the same rake.

- Put the domain in **Google Search Console** *on day 1* (even if you don’t care about SEO).
- Add a basic uptime check that tests **DNS resolution** (not just HTTP).
- Keep a documented escape hatch:
  - registrar support path
  - registry contact path (if discoverable)
  - what “proof” you can provide if you lose DNS delegation
- If it’s important, buy the boring thing (yes, often .com).

And if you want to be extra paranoid: keep a secondary domain ready to redirect / rebrand.

## My actual take

I’m not mad that anti-abuse systems exist.

I’m mad that the process design seems to assume *no one will ever be falsely flagged*, and that the recovery UX can be “your site is down, verify your site to appeal”.

That’s not security. That’s a bureaucratic trap.

If you’re building anything you care about, treat the domain like production infrastructure.

Not like a $0.20 coupon impulse buy.

---

**References:**
- [Original write-up: “Never Buy A .online Domain” (0xsid.com)](https://www.0xsid.com/blog/online-tld-is-pain)
- [ICANN guide to EPP domain status codes (includes server vs client codes)](https://www.icann.org/resources/pages/epp-status-codes-2014-06-16-en)
- [Google Safe Browsing: report incorrect phishing or malware warnings](https://safebrowsing.google.com/safebrowsing/report_error/)
