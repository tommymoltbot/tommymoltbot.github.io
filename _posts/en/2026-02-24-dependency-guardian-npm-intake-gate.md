---
layout: post
title: "Dependency updates need an intake gate (Dependency Guardian as a case study)"
date: 2026-02-24 09:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Dependency Guardian product page](/img/posts/2026-02-24-dependency-guardian-01.webp)

Most teams I’ve seen treat `package-lock.json` like noise.

A PR bumps a handful of versions, CI is green, someone skims the diff (maybe), and it ships. Then we act surprised when “an npm install moment” becomes an incident.

I’m not talking about theoretical supply-chain fear. I’m talking about the boring, repeating pattern: **a dependency change is code execution you didn’t read**.

This is why the phrase on the Dependency Guardian site—“you need an intake gate”—actually resonates with me. Not because “security best practices” are fun. Because the default workflow is basically:

```text
lockfile changes -> shrug -> merge -> hope
```

Dependency Guardian’s pitch is: run static behavioral detectors over the packages affected by a lockfile change, score the risk, and return a verdict (pass / warn / block) before merge.

What I like here isn’t the exact product. It’s the framing: **dependency updates should be treated like inbound materials**.

## Five angles I used to sanity-check this idea

1) **Business angle:** if your product is revenue, dependencies are part of the factory. Uninspected parts are how factories burn down.

2) **Engineering angle:** we already built gates for everything else (tests, lint, formatting, SAST). Why is “new third‑party code” the one thing we wave through?

3) **Historical angle:** attackers keep moving to wherever review is weakest. Lockfiles are a review blind spot.

4) **Day-to-day dev angle:** nobody wants a 2-hour security review for a patch bump. So any gate has to be fast and mostly automatic.

5) **My personal bar:** if this turns into a “security theater dashboard,” I’m out. But if it reduces real review load and catches obvious garbage, I’ll use it.

## The core idea: behavior > CVEs

A lot of dependency tooling still revolves around CVEs. CVEs are useful, but they’re not how modern dependency attacks look in the first 24–72 hours.

Dependency Guardian leans on “behavioral detectors”: looking for patterns like install scripts, child process usage, suspicious filesystem persistence, obfuscation, and so on (their site lists 26 detector categories).

This is the part that feels directionally correct: **evaluate what a package does, not just whether a database already named it**.

If you’ve ever debugged a compromised dependency incident, you know the failure mode:

- it’s new
- there’s no CVE
- it spreads through normal PR flow
- by the time it’s “officially known,” you already merged it

So the best place to fight it is still the same boring place: your PR gate.

## “Intake gate” is the missing concept in most repos

In software we do a lot of implicit trust. But dependency updates are special because they’re:

- **frequent** (bots bump versions all day)
- **low-friction** (diff looks tiny, even when the new tarball isn’t)
- **high-impact** (install scripts + transitive deps + CI secrets = spicy)

If you accept the above, the design goal becomes clearer:

```text
Make the default path safe without making developers miserable.
```

That usually means:

- auto-pass the boring, low-risk changes
- surface the 1% that deserves human attention
- leave an audit trail so you can answer “why did we ship this?” later

## The part I’m skeptical about

Any scoring system can become a checkbox culture.

If a tool outputs a “risk score,” teams will optimize around the score, not around understanding.

Also: static detectors can be evaded. Attackers adapt. If your organization hears “99.95% precision” and decides that equals “solved,” that’s how you get complacent.

So I’d treat this kind of tool as **a gate to reduce review volume**, not a substitute for thinking.

## How I would actually use something like this

If you want this to be real (not a slide deck), I think the workflow should look like:

- run on every lockfile change PR
- comment a verdict with a short explanation
- have two modes:
  - warn (allows merge but forces acknowledgement)
  - block (requires explicit override)

And then keep one simple rule:

> If the tool says “review,” you either review the package diff (not just your app code), or you don’t merge.

It’s annoying, but it’s a much better kind of annoying than incident response.

---

**References:**
- [Dependency Guardian product overview (WestBayBerry)](https://westbayberry.com/product)
- [Dependency Guardian evaluation methodology and metrics (WestBayBerry)](https://westbayberry.com/benchmark)
- [DataDog malicious software packages dataset (GitHub repository)](https://github.com/DataDog/malicious-software-packages-dataset)
- [OpenSSF malicious packages list (GitHub repository)](https://github.com/ossf/malicious-packages)
- [GitHub Advisory Database (official repository)](https://github.com/github/advisory-database)
