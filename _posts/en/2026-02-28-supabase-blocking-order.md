---
layout: post
title: "When your BaaS gets blocked: the Supabase incident is a reliability problem, not a drama"
date: 2026-02-28 07:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Supabase blocking banner](/img/posts/2026-02-28-supabase-blocking-order-01.webp)

I saw a report that **Supabase was partially blocked in India**, and developers there got *patchy access* depending on their ISP.
Not “the marketing site is slow.”
More like: **your project’s database console / API surface is randomly unreachable**, and you don’t get a helpful error message—just a wall.

If you’ve never shipped something to a market where network policy can change overnight, it’s easy to shrug and call it “politics.”
But from an engineering angle, this is a brutally simple lesson:

> If a core dependency can disappear at the network layer, you don’t have an uptime problem.
> You have a *design assumption* problem.

## Five angles I keep coming back to

### 1) “Open source” doesn’t save you if you don’t operate it
Supabase being open source is great… in the same way **a parachute being open source** is great.
If you’re still using the hosted service, your blast radius is the hosted service.

Yes, you *can* self-host.
But most teams choose BaaS because they don’t want to run Postgres, auth, storage, realtime, and edge functions.
So in practice:
- “Open source” mainly means **you have an exit**.
- It doesn’t mean **you already took it**.

### 2) The scary part is the uncertainty, not the downtime
The report mentioned the block order didn’t come with a clear public reason.
That’s the part that makes planning hard.

Downtime with a root cause is painful but actionable.
Downtime that looks like:
- *some ISPs work*
- *some cities work*
- *VPN fixes it*
- *DNS changes sometimes help*

…is the kind that burns hours of debugging before you even realize it’s not your code.

### 3) “Just use a VPN” is not a production strategy
When vendors suggest VPN / DNS workarounds, I get why—they want to unblock users fast.
But for actual products:
- your end users won’t install VPNs
- your enterprise customers may forbid it
- your compliance story gets weird

If your core app experience depends on “tell customers to change DNS,” you’re already in incident mode.

### 4) Hosted developer infra is now a supply chain
We used to talk about supply chain as:
- package registries
- build pipelines
- CI providers

But 2026 reality is:
- your DB is a product
- your auth is a product
- your storage is a product
- your rate limiting is a product

So blocking one domain can behave like **revoking your production runtime**.
And if a country is ~9% of your traffic (as the report cited), this isn’t an edge case.
It’s a business continuity scenario.

### 5) The only real mitigation is architectural, not PR
If I were building on a hosted BaaS today, I’d explicitly write down:

- **What breaks if the control plane is unreachable?**
  - Can the app keep serving reads?
  - Can it queue writes?

- **How fast can we fail over to an alternate backend?**
  - “We can migrate in two weeks” is not a failover plan.

- **Can we run a minimal self-hosted fallback?**
  - Even a stripped-down Postgres + auth that keeps critical paths alive.

- **Do we have a ‘dependency budget’?**
  - Every external managed service you add should buy you enough value to justify its *policy risk*.

This sounds heavy, but it’s the same maturity shift as “multi-region” used to be.
Once you’ve been burned, you stop treating it like paranoia.

## My take
I don’t think the takeaway is “never use managed services.”
That’s not realistic, and honestly it’s not even desirable.

The takeaway is: **when you outsource infrastructure, you also outsource failure modes.**
Some of those failure modes aren’t technical.
But you still have to design for them—because your users don’t care *why* it’s broken.
They just know it’s broken.

---

**References:**
- [TechCrunch report on Supabase access disruptions in India](https://techcrunch.com/2026/02/27/india-disrupts-access-to-popular-developer-platform-supabase-with-blocking-order/)
- [Supabase status update thread about India connectivity issues (X post)](https://twitter.com/supabase/status/2027444736479420571)
- [TechCrunch (2014) on India briefly restricting access to GitHub and other platforms](https://techcrunch.com/2014/12/31/indian-government-censorsht/)
- [Times of India report on some ISPs blocking a GitHub content domain (2023)](https://timesofindia.indiatimes.com/gadgets-news/github-content-domain-blocked-for-these-indian-users-reports/articleshow/96687992.cms)
