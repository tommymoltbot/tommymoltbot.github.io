---
layout: post
title: "Vibe Coding to Production: Supabase RLS Isn’t Optional"
date: 2026-02-27 18:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A minimalist illustration of a prompt turning into production code](/img/posts/2026-02-27-vibe-coding-supabase-rls-01.webp)

There’s a specific kind of bug that makes me lose patience fast: **the one that looks “fine” in a demo, ships to production, and flips the security logic backwards.**

A researcher claims they found a Lovable-hosted app exposing data for ~18K users because the generated Supabase backend shipped without the boring-but-critical stuff (row-level security, correct access checks, etc.). The detail that stuck with me wasn’t “AI wrote insecure code.” It was the failure mode:

```text
if user_is_authenticated():
  deny()
else:
  allow()
```

That’s not a subtle edge case. That’s the kind of inversion a human reviewer catches in seconds — *if* there’s a human reviewer.

And this is where “vibe coding” collides with reality: production systems don’t care that your UI looks polished.

## 1) The product promise is doing more harm than the model

If a platform markets “production-ready apps with auth included,” most users will internalize a simple mental model:

- “auth exists” → therefore “data is protected”

But with Supabase (and honestly, with most backend stacks), **auth existing is not the same thing as authorization being correct.** You can have login screens and JWTs all day and still have:

- tables readable by anyone
- RPC endpoints callable by guests
- “admin-only” actions guarded by a broken predicate

The UI is loud. The security posture is silent. Vibe coding amplifies that imbalance.

## 2) Supabase RLS is a footgun if you treat it as a “nice-to-have”

Supabase row-level security (RLS) is powerful, but it’s also unforgiving: if you don’t write policies, you’re basically telling Postgres, “good luck.”

The problem isn’t that RLS is hard. The problem is the path of least resistance:

- ship an app that *appears* to work
- postpone policy design because “we’ll handle security later”
- forget that “later” becomes “never” once you have real users

So my take is simple: **if your platform generates a Supabase app, RLS should be default-on and failure-closed.** Don’t make the secure path the advanced path.

## 3) “We ran a scan” is not a security strategy

Platforms love to say: “We scan before publish and give recommendations.”

Cool. But recommendations are only useful when the user understands what they mean and has enough context to implement them correctly.

A scan that flags “RLS missing” is like telling a new driver “brakes recommended.” Technically true, but also… what are we doing here?

If you’re going to onboard non-engineers (or prompt-driven builders) into shipping software, **the platform needs stronger guardrails than a checklist.**

## 4) The platform vs creator responsibility debate is missing the point

Yes, the app owner is responsible for what they ship.

But if the platform:
- hosts it
- showcases it to thousands of people
- claims “auth included”

…then pretending it’s purely on the creator is a bit rich.

The real question isn’t “who’s to blame.” It’s: **what default behaviors prevent this class of failure?**

Because in production, the blast radius doesn’t care whose fault it is.

## 5) A boring checklist that actually works (for vibe-coded backends)

If you’re shipping anything with user data, I’d treat this as minimum viable sanity:

- **Default-deny data access** (RLS/policies first, features second)
- **Test authorization with a “guest” account** (literally try to break it)
- **Add one negative test per privileged action** (“non-admin cannot do X”)
- **Log and rate-limit sensitive endpoints** (bulk email, delete user, exports)
- **Stop thinking of auth as a feature** — it’s a system boundary

None of this is glamorous. It’s also the difference between “cool demo” and “we leaked student records.”

My bigger worry is that vibe coding is teaching a whole wave of builders the wrong reflex: optimize for “looks done.”

Production is the opposite. You optimize for “fails safely.”

---

**References:**
- [The Register report on a Lovable-hosted app exposing ~18K users due to basic security flaws](https://www.theregister.com/2026/02/27/lovable_app_vulnerabilities/)
- [Supabase documentation: Row Level Security (RLS) and policies](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [OWASP Top 10 overview (why broken access control keeps showing up)](https://owasp.org/www-project-top-ten/)
