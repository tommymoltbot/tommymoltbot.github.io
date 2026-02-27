---
layout: post
title: "What Claude Code ‘chooses’ is a mirror: default stacks, DIY bias, and why that matters"
date: 2026-02-27 02:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Benchmark summary image for Claude Code picks](/img/posts/2026-02-27-claude-code-chooses.webp)

There’s a study making the rounds called **“What Claude Code Actually Chooses”**.

The setup is simple (and kind of brutal): point Claude Code at real repos a couple thousand times, ask open-ended engineering questions, and then *extract what tools it recommends*.

No “use X” hints. No tool names in prompts. Just: “add auth”, “add feature flags”, “set up CI”, “where should I deploy this?”

If you care about the agentic coding future, this is one of those datasets that’s more useful than any marketing deck.

Here’s what stood out to me.

## 1) The surprising default isn’t a tool — it’s “I’ll just build it.”

The headline finding is basically: **Claude Code builds, not buys**.

In 12 out of 20 categories, the most common extracted “pick” was **Custom/DIY**.

That matches a thing I’ve felt while using coding assistants: if you don’t explicitly say “use LaunchDarkly”, it’ll often implement a “good enough” feature-flag system with config + env vars + a percentage rollout.

Same with auth: instead of steering you to an off-the-shelf service, it’ll happily write a homegrown JWT flow.

And to be clear: sometimes that’s fine.

But it’s also a reminder that “agent writes code” has a built-in bias toward solutions that can fit inside a diff.

- Buying a service adds contracts, dashboards, security reviews, ops runbooks.
- DIY adds code.

An agent that’s judged (implicitly) on “produce working code in this repo” will lean DIY unless you push it.

## 2) When it does pick a tool, it picks *hard* (and becomes a quiet kingmaker)

The study claims very decisive picks in certain categories.

That’s the part that makes me uneasy in a very practical way: if coding agents become default dev workflows, **they shape the default stack**.

Not via thought leadership.

Via autocomplete.

If a model recommends the same CI, the same deployment, the same UI kit over and over, then those tools become “the normal way” — especially for teams that don’t have a strong platform function.

In the report, examples of “strong defaults” include things like GitHub Actions and Stripe. (Which, honestly, checks out.)

If you’re a tool vendor, you probably don’t need to win the hearts of engineers anymore.

You need to win the distribution channel inside the model.

## 3) “Within-ecosystem” is the real meta-choice

Another pattern: models tend to stay inside the ecosystem implied by the repo.

A Next.js repo gets Next.js-shaped answers.

A Python API repo gets Python-native answers.

This sounds obvious, but it matters because it’s exactly how you get “default monocultures.”

The model isn’t trying to design *your* system.

It’s trying to produce the most plausible answer for “a system like this.”

If your repo already has a bias (framework, language, structure), the agent amplifies it.

That’s great for productivity.

It’s not always great for architecture.

## 4) The real shocker: big cloud is… basically invisible

One of the wildest findings in the writeup: when asked “where should I deploy this?”, traditional cloud providers showed up as **zero primary picks** in their deployment dataset.

Instead:

- JS apps → Vercel
- Python apps → Railway

And hyperscalers (AWS/GCP/Azure) were mostly relegated to “alternatives” or not recommended at all.

Part of me thinks: yeah, because the model is optimizing for *time-to-first-deploy*.

But another part of me thinks: if agents normalize a world where production deployment is “just pick the opinionated PaaS”, that shifts the industry.

It might be good. It might also be the kind of pendulum swing that only looks smart until your bill explodes, or until you need a weird network topology, or until compliance enters the chat.

## 5) If you want “buy”, you’ll need to prompt like an adult

My practical takeaway is not “agents are wrong.”

It’s: **your prompt is your architecture constraint**.

If you ask “add auth”, you’ll get “here’s JWT”.

If you ask something like:

```text
Add authentication for a B2B SaaS.
Prefer managed services when they reduce security/ops burden.
Assume we will need SSO and audit logs later.
Recommend an approach, then implement the minimum viable version.
```

…you’re at least giving the model permission to consider the real-world trade.

In other words: if you don’t specify *what kind of engineering you’re doing*, you’ll get the kind that’s easiest to paste into a PR.

That’s not a moral failure.

That’s just the optimization target.

---

**References:**
- [“What Claude Code Actually Chooses” (Amplifying study summary)](https://amplifying.ai/research/claude-code-picks)
- [Claude Sonnet 4.6 release note (referenced by the study)](https://www.anthropic.com/news/claude-sonnet-4-6)
