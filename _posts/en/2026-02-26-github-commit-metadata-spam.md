---
layout: post
title: "Your GitHub email is someone else’s lead list"
date: 2026-02-26 12:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A Hacker News thread about startups scraping GitHub activity to send cold emails](/img/posts/2026-02-26-github-commit-spam-01.webp)

I saw a Hacker News thread where someone complained that startups (including a YC one) scraped GitHub activity and started sending “hey, I saw your commits…” emails.

My first reaction wasn’t “wow, that’s evil.” It was more like: **yeah, that’s what happens when you turn identity metadata into a default export.**

If you’ve ever committed with a real email address, you’ve basically shipped a tiny, public CRM row for yourself.

## The uncomfortable part: it’s not even hard
People keep thinking there must be some sophisticated scraping setup.

But commit history is already a structured dataset:

```text
{ name, email, timestamp, repo, file paths, topics, velocity }
```

Even if the email is hidden on your profile, it might still leak via commit metadata.

So “I noticed you contributed to X” isn’t a magic insight. It’s an SQL query.

## This isn’t a YC problem, it’s an incentives problem
If you’re a startup, lead gen is oxygen.

If you can find engineers who:
- work on relevant repos
- are active recently
- have a reachable email

…then someone will try it. Not because they’re uniquely bad people, but because **the conversion funnel is sitting there begging to be abused.**

I’m not defending it. I’m saying: if the data is cheap, someone will be cheap.

## “But my email is public so it’s fair game” is lazy logic
Yes, Git is built around author identity. And yes, plenty of people put contact info in public.

But there’s a difference between:
- “here’s my email if you want to collaborate”
- “here’s my email because a tool defaulted to it in 2016 and I never thought about it again”

Most spam is powered by that second category.

## Practical fixes (the boring kind that actually works)
If you don’t want your real email to become part of your public graph, the boring checklist is:

1) Use GitHub’s no-reply email for commits.

```text
Your GitHub account settings → Emails → “Keep my email addresses private”
```

2) Update your local Git identity.

```text
git config --global user.email "<your-id>@users.noreply.github.com"
```

3) For old commits… yeah, it’s painful.
Rewriting history is doable but disruptive. You’ll only do it if you *really* care.

## The meta lesson: we keep exporting people by accident
We’re in this weird era where everyone talks about privacy, but our dev tooling still assumes:

- identity is stable
- contact info is part of identity
- exporting identity is fine

That was a decent assumption when Git was “collaborate on code.”

In 2026, GitHub is also a reputation layer, a hiring signal, and apparently a marketing database.
So the defaults start to matter a lot.

---

**References:**
- [Hacker News discussion: startups scraping GitHub activity to send cold emails](https://news.ycombinator.com/item?id=47163885)
- [GitHub Docs: keeping your email address private](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address)
