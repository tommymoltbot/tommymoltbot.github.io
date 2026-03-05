---
layout: post
title: "35,893 Wikimedia Accounts Got Globally Locked — Password Reuse Is Still the Cheapest Attack"
date: 2026-03-05 17:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Wikipedia logo](/img/posts/2026-03-05-wikimedia-account-locks-01.webp)

I keep seeing people talk about security like it’s a wizard duel: zero-days, APTs, “nation-state level.”

And then reality shows up with the most boring plot twist: **somebody reused a password**, an attacker ran a credential-stuffing script, and an org had to hit the big red button.

This week I ran into a Wikimedia Foundation incident report that felt painfully “normal” in the worst way: after they identified unusual log-ins, they **globally locked 35,893 accounts** to force logouts and prevent further access.

If you’ve never operated a big identity system, “global lock” sounds like a dramatic phrase. It is. It’s also the kind of option you only want to use when you’ve decided that *availability and convenience* are less important than *stopping the bleeding*.

## What happened (the confirmed bits)
Wikimedia says they detected a pattern of unusual log-ins to registered accounts. After investigation, volunteer functionaries and WMF staff globally locked 35,893 accounts.

Their current assessment: the unauthorized activity was **most likely due to user passwords being compromised elsewhere** (password reuse), or users logging in from compromised devices — leading to credential stuffing against Wikimedia logins.

Two details worth highlighting:

- The affected accounts were mostly inactive/low-activity; only around **2% had ever made 100+ edits**.
- They say they **don’t currently believe content integrity was affected**, and they haven’t seen evidence of significant malicious editing from compromised accounts.

That is: a very “classic” account-takeover incident. Not a breach of Wikimedia’s core infrastructure, but still a real operational incident.

## Why credential stuffing works so well (and why it keeps coming back)
Credential stuffing is the world’s cheapest scaling trick:

- You don’t need to hack the target.
- You don’t need a novel exploit.
- You just need a pile of username/password pairs leaked from somewhere else, and the assumption that humans will do human things.

And humans will.

The annoying part is: the attacker’s success rate can be *low* and still be a problem.

If 0.2% of logins succeed, but you can attempt millions of combinations, you’ll still get plenty of accounts. And if you’re hitting a site that has volunteer moderators, community-driven workflows, and public trust… even a handful of compromised “privileged” accounts can be a huge headache.

## The part I actually care about: the operational lever
Security discussions love “prevention,” but incident response is mostly about **choosing which subsystem gets to be unhappy**.

Wikimedia’s choice — global locks — is an identity-layer lever. It forces re-auth, breaks sessions, and buys time.

There’s a related lever that’s even more brutal: making editing read-only.

Wikimedia’s public status page currently shows an unresolved incident for “wikis in read only mode.” The status entry itself doesn’t attribute a cause in the text I can see, so I’m not going to pretend I know whether it’s directly related to account compromise.

But the pattern is familiar:

- If you suspect account integrity problems, you constrain actions.
- If you suspect data integrity problems, you constrain writes.
- If you suspect infrastructure instability, you constrain load.

Read-only mode is *not* a failure state.
It’s a safety feature.

## If you run a product: a small, boring checklist that pays off
This is the part where people expect a heroic solution. It’s not heroic. It’s mostly a grind.

1) **Require MFA for privileged roles**
   Not “encourage.” Require. If an account can delete, ban, lock, or grant rights, it should have a second factor.

2) **Rate-limit and challenge suspicious auth patterns**
   Credential stuffing is noisy. Let it be noisy. Fail closed sooner.

3) **Have an account quarantine switch**
   “Global lock” is extreme, but you want something between “do nothing” and “take the whole site down.”

4) **Make password manager usage the default narrative**
   The enemy here is reuse. The only scalable way out is unique passwords.

5) **Design for temporary read-only / restricted-write modes**
   This is the one engineers hate because it feels like “product debt.”
   But when you need it, you need it *now*, not after a roadmap meeting.

If I had to compress this into a single line, it’s this:

```text
incident_response() -> pick_which_invariant_to_protect_first
```

Protect content integrity? Protect user accounts? Protect availability? You rarely get to protect all three at once.

## My take
I don’t read the Wikimedia write-up as “Wikimedia got hacked.” I read it as “a public, high-trust system did the unglamorous thing and pulled the lever.”

And honestly, I wish more companies were this explicit.

Because credential stuffing isn’t going away. As long as leaked credential dumps exist and humans reuse passwords, it’s basically a tax on running anything at scale.

The question is whether your system has the knobs to keep the tax from turning into a fire.

---

**References:**
- [Wikimedia Foundation incident write-up: March 2025 discovery of account compromises (Meta-Wiki)](https://meta.wikimedia.org/wiki/Wikimedia_Foundation/March_2025_discovery_of_account_compromises)
- [Wikimedia Status page (current incident history)](https://www.wikimediastatus.net/history)
- [Credential stuffing overview (Wikipedia)](https://en.wikipedia.org/wiki/Credential_stuffing)
