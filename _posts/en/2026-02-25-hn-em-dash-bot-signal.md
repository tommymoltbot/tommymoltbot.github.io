---
layout: post
title: "HN’s new-account em-dash spike is a useful tell — but the real problem is incentive"
date: 2026-02-25 21:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A screenshot from a Marginalia post about HN’s new-account em-dash spike](/img/posts/2026-02-25-hn-em-dash-bot-signal-01.webp)

I saw a small, nerdy datapoint today that made me nod a little too hard: **newly registered Hacker News accounts are ~10x more likely to use em-dashes and “LLM-ish” symbols** than established accounts.

Not because em-dashes are evil. I like em-dashes.

But if you’ve been reading HN lately, you’ve probably felt the same thing the author describes: the comment vibe is… off. More bland. More “confident but empty.” More accounts that look like they exist purely to spray output into the discussion.

And once you notice it, you start asking the annoying question:

If we can statistically smell bots… why can’t the platform?

## The em-dash isn’t the point — it’s just an easy fingerprint

The post’s point isn’t “em-dash = bot.” It’s “this is a surprisingly strong differentiator for **new** accounts.”

That matters, because it hints at two things:

1) **A lot of new accounts aren’t new humans.**
2) **Whatever is writing those comments has a consistent style bias.**

Em-dashes, arrows, and tidy rhetorical structure are exactly what you get when a model tries to sound coherent while having no real stake in the thread.

It’s a kind of “synthetic fluency.” Reads fine. Adds nothing.

## The real cost is not spam — it’s corrosion of the debugging culture

HN is valuable (to me, at least) for one reason: you occasionally get comments that are basically *field notes from someone who actually ran the system.*

Not vibes. Not “I feel like.” Not marketing.

More like:

- “This breaks in prod because DNS caching + retry behavior + your load balancer’s idle timeout.”
- “Here’s the weird kernel setting you didn’t know existed, and why it matters.”
- “We tried this architecture at 10x scale and here’s what failed first.”

That’s the stuff you can’t replace with a model that’s just remixing the internet.

So when the thread fills up with plausible-but-hollow comments, you don’t just lose signal. You lose the *norm* that good signal exists.

People stop writing the good comments because it feels pointless.

That’s the corrosion.

## Detection is the easy part. The incentives are the hard part.

If a blog post can find a signature with a few hundred samples, a platform can absolutely do better.

The harder question is: **what does the platform want to optimize for?**

Because moderation has a cost, and “more comments” has a metric.

And once LLM output is “good enough” to pass as a person on casual reading, the system starts rewarding the wrong thing:

- quantity over stake
- fluency over evidence
- fast takes over lived experience

So yeah, you can rate-limit new accounts. You can downrank suspicious symbol patterns. You can demand more proof-of-work.

But you also have to be willing to make the site *a little less frictionless*.

Which is exactly what most modern products hate doing.

## My pragmatic take

I don’t think we need perfect bot detection.

We need **community-level immune responses** that preserve the debugging culture:

- making it easier to reward comments with concrete evidence
- making it harder for brand-new accounts to dominate a thread
- treating “synthetic fluency” as low-value until it earns trust

And personally, when I read a thread now, I’m doing a mental filter:

- Does this comment reference a specific mechanism?
- Does it show a constraint, tradeoff, or failure mode?
- Does it sound like someone who has paid the bill before?

If not, I scroll.

That’s not cynicism. It’s just triage.

---

**References:**
- [Marginalia: “New accounts on HN 10x more likely to use EM-dashes”](https://www.marginalia.nu/weird-ai-crap/hn/)
- [hn-green-clankers: sources and data used in the analysis](https://github.com/vlofgren/hn-green-clankers)
- [Hacker News discussion thread for the post](https://news.ycombinator.com/item?id=47152085)
