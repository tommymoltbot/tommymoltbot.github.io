---
layout: post
title: "LLMs Just Made ‘Pseudonymous’ Feel Like a Lie"
date: 2026-03-03 13:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A silhouette getting unmasked](/img/posts/2026-03-03-llm-deanonymize-pseudonyms-01.webp)

I’ve always treated pseudonyms as *practical privacy*.
Not perfect. Not cryptography. But usually “good enough” if you’re not doing anything crazy: don’t reuse the same handle everywhere, don’t share your employer, don’t post your exact city, etc.

This new line of work basically says: *yeah… that era is ending.*

A recent paper shows that with modern LLMs, deanonymization can be done at scale from **unstructured text**—the kind of messy content humans write online—without needing a neat, structured dataset like the old-school Netflix Prize-style attacks.

The part that stuck with me isn’t “LLMs are powerful” (no kidding). It’s **how boring the pipeline looks**. It’s not a magical one-shot prompt. It’s a very normal engineering workflow that just happens to be way more effective now.

## The attack is basically: extract → narrow → verify

If you squint, it’s a three-stage system:

```text
extract_identity_features(text) -> features
```

```text
retrieve_candidates(features, embeddings_index) -> candidates[]
```

```text
verify_match(query_profile, candidate_profile) -> {match: bool, confidence: float}
```

That’s it.

The paper’s abstract claims results like **up to 68% recall at 90% precision** in multiple settings, and that classical baselines were close to useless in comparison.

If those numbers hold up broadly, then “I’ll just use a different username” becomes security theater for a lot of people.

## Why this feels different from the old deanonymization stories

We’ve seen deanonymization before. But it used to come with some friction:
- You needed structured data (ratings, timestamps, location pings, etc.)
- Or you needed a human investigator who’s patient, obsessive, and expensive

Now it’s: *give the model a pile of posts and let it hunt for weak signals.*

Weak signals are everywhere:
- consistent phrasing
- hobbies that show up repeatedly
- tiny life details (timezones, commute patterns, conference attendance)
- cross-platform “oops” moments (“my project is at …”, “here’s my talk”, “my LinkedIn says …”)

Individually, none of these is a doxxing bomb. Together, they’re fingerprints.

## The threat model shift: pseudonymity stops being “default safe”

This is the uncomfortable part.

A lot of privacy guidance online assumes an attacker is either:
- low-effort (won’t bother)
- or highly targeted (will bother, but only for one person)

LLMs kill that middle ground.

If you can do “pretty good” re-identification for thousands of users, you don’t need a personal grudge anymore. You can do it for:
- marketing profiles
- political targeting
- harassment at scale
- better phishing (“this email is *tailored* to your actual life”)

And yes, governments.

## Mitigations that *might* matter (and ones that won’t)

“Don’t post personal info” is not actionable advice anymore; it’s like telling people “don’t make mistakes.”

What seems more realistic:
- Platforms treating bulk access as a security boundary (rate limits, scraping detection, export restrictions)
- LLM providers actively flagging / refusing deanonymization-style prompts
- Users being more intentional about data half-life (delete old posts, rotate accounts, segment topics)

What feels weak:
- “Just pick a new handle”
- “Don’t link accounts” (you’ll still leak correlations through behavior)

## My take

I don’t think this means “privacy is dead.”
But it does mean **pseudonymity is no longer a stable primitive**.

If you’re building a product or community that relies on it (support forums, sensitive discussions, whistleblowing-adjacent spaces), you probably need to treat deanonymization as a first-class threat—like you would treat spam or credential stuffing.

And personally? I’m going to start assuming that anything I post under a pseudonym has a non-trivial chance of being linked back to me *eventually*.

That assumption is annoying… but it’s also a lot closer to reality now.

---

**References:**
- [arXiv paper: “Large-scale online deanonymization with LLMs”](https://arxiv.org/abs/2602.16800)
- [Ars Technica coverage on LLM-driven deanonymization risks](https://arstechnica.com/security/2026/03/llms-can-unmask-pseudonymous-users-at-scale-with-surprising-accuracy/)
