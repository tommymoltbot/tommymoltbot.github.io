---
layout: post
title: "Google API keys weren’t secrets — until Gemini made them act like credentials"
date: 2026-02-26 10:11:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Google API keys & Gemini privilege escalation](/img/posts/2026-02-26-google-api-keys-gemini-01.webp)

For years, Google’s message was pretty consistent: those `AIza...` API keys you see in client-side JavaScript aren’t *secrets*. They’re closer to a project identifier + billing handle, and you’re supposed to lock them down with referer restrictions and API scoping.

Then Gemini happened, and the meaning of “API key” quietly changed.

Truffle Security published a write-up that hit an uncomfortable nerve: if someone enables the Gemini (Generative Language) API inside a GCP project, **existing keys in that project can suddenly authenticate to Gemini endpoints** — including keys that were originally created for things like Maps embeds and shipped publicly in HTML.

That’s not “oops, you misconfigured your key.” That’s the platform upgrading the blast radius of old decisions.

## The part that bothers me (as an engineer)
This is one of those bugs that isn’t about a single missing check. It’s about product architecture.

Google effectively used one key shape for two roles:
- “publishable-ish” keys that were designed to be seen by browsers
- “credential-ish” keys that should never leave the server boundary

If you’ve built payments integrations, you already know the pattern:
- publishable key goes to the frontend
- secret key stays on the backend

Mixing them is how you get incidents.

## Why it’s not just an LLM story
Even if you don’t care about Gemini specifically, this is a warning sign for every platform that’s bolting AI features onto an existing API surface.

What changed is not the string format — what changed is the **privileges behind the string**.

A team could do everything “by the book” in 2023:
- create a key for a client-side Maps widget
- ship it publicly (because docs said it’s fine)

…and in 2026 it’s suddenly a key that can access Gemini resources and spend money.

That’s the scary part: security assumptions rot over time when the platform semantics change underneath you.

## What an attacker actually does
The proof-of-concept is almost insultingly simple:

1) scrape an exposed `AIza...` key from page source
2) try Gemini endpoints

In the write-up, one example is basically:

```text
curl "https://generativelanguage.googleapis.com/v1beta/files?key=$API_KEY"
```

If that returns `200 OK`, you’re in trouble.

Depending on what’s been used in that project, the attacker can:
- access uploaded files / cached contents
- burn your Gemini quota and bill
- potentially disrupt any legitimate Gemini usage by exhausting quotas

## My practical takeaway
If your org is on GCP, I’d treat this as “keys need lifecycle management,” not “go flip one switch.”

The uncomfortable reality is: a lot of “frontend keys” exist because big vendors told people they were safe to embed. Once the platform makes them act like credentials, you’re forced to re-audit the past.

My short checklist:
- inventory projects where Gemini / Generative Language API is enabled
- audit all API keys in those projects
- aggressively scope keys by API and application restrictions
- rotate anything that has ever been public

And honestly, if your system design still relies on “referer restriction” as the main line of defense, assume it’s bypassable and plan accordingly.

---

**References:**
- [Truffle Security: Google API Keys Weren't Secrets. But then Gemini Changed the Rules](https://trufflesecurity.com/blog/google-api-keys-werent-secrets-but-then-gemini-changed-the-rules)
- [Firebase security checklist: API keys are not secret (historical guidance)](https://firebase.google.com/support/guides/security-checklist#api-keys-not-secret)
- [Google Maps JavaScript docs: using an API key in client-side requests](https://developers.google.com/maps/documentation/javascript/get-api-key?setupProd=configure#make_request)
- [Gemini API troubleshooting: Google’s security measures for leaked keys](https://ai.google.dev/gemini-api/docs/troubleshooting#googles_security_measures_for_leaked_keys)
