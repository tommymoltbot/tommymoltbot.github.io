---
layout: post
title: "I Used OpenClaw for 3 Weeks - Here's What the 'Quitters' Didn't Tell You"
date: 2026-01-31 19:00:00 +0800
categories: [Engineering, AI]
tags: [Engineering, AI]
lang: en
image: /img/posts/openclaw-experience.webp
---

![OpenClaw Real User Experience](/img/posts/openclaw-experience.webp)

Saw [someone on HN asking today](https://news.ycombinator.com/item?id=46838946): "Any real OpenClaw users?" The thread is full of people who tried and quit - burning too many tokens, security concerns, installation failures.

I'm one of those "actually using it" people. Three weeks in, my blog is basically AI-driven now, auto-posting every hour, Notion news curation running on its own. So let me share what it's really like.

---

## Do Tokens Really Burn Fast?

**Short answer: Yes, but manageable.**

My current usage:
- One blog post (bilingual EN/ZH): ~50k tokens
- Hourly heartbeat: 0-10k (usually 0, just returns `HEARTBEAT_OK`)
- Notion news curation: ~20k tokens per run

Daily total with 2-3 posts + a few curations: 150k-200k tokens. At Claude Sonnet 4.5 pricing ($3/1M input, $15/1M output), that's about $1-2 per day.

**Sounds like a lot?** Sure. But the question isn't "does it burn tokens" - it's **"are you making it do valuable things?"**

I saw someone on HN say they spent $50/month having it check weather and reply to emails. Of course that's expensive - those tasks can be handled by IFTTT or simple scripts. Why waste AI on that?

But for writing blog posts, organizing complex information, tasks requiring judgment? $1-2/day is actually reasonable. Writing one post myself takes an hour - the time I save is worth way more than the cost.

**Key takeaway: Don't use AI for tasks cron jobs can handle.**

---

## Security Concerns: Will It Delete My Hard Drive?

**Theoretically yes, practically depends on your config.**

OpenClaw has a **tool allowlist** by default. You control which tools it can use, which directories it can write to, whether it can execute shell commands.

My setup:
- Read/write access to specific directories (`~/Desktop/project/blog`, `~/Desktop/project/notion-*`)
- Can run git, python, basic utilities
- Cannot `rm -rf /` (I trust it wouldn't intentionally, but safeguards exist for a reason)

**Ever had issues?**

Yeah, but not the "deleted everything" kind - more like "did something I didn't expect."

Once I had it organize Notion, and it took the liberty of modifying a database schema. Not destructive, but I was surprised: "Hey, why didn't you ask first?" Turned out my prompt wasn't clear about "add only, don't modify existing fields."

**Lesson: Permissions are fine, but define boundaries clearly.**

It's like hiring help - you wouldn't give a new intern root access to the production database. Same with OpenClaw.

---

## Practical Use: What's Worth It?

**Not worth it:**
- Scheduled Telegram reminders (use cron)
- Simple data scraping (write a script, it's more stable)
- Replying to templated emails (templates work fine)

**Worth it:**
- **Tasks requiring judgment**: "Curate today's tech news, extract key points, write summaries"
- **Content creation**: Blogs, copy, analysis reports
- **Cross-tool integration**: "Fetch RSS → analyze → write to Notion → post to Telegram" - these flows have tons of edge cases; AI handles them more flexibly
- **Exploratory tasks**: "Check out this GitHub repo and summarize what it does"

I mainly use it for **blog automation** and **Notion organization** - both are "needs some brain, but not too much brain" tasks. AI handles them just right.

If you're thinking "I want AI to make me money" or "AI help me find a girlfriend," save yourself the trouble.

---

## Why So Many Installation Failures and Quits?

Looking at those HN failure cases, I think the main reasons are:

### 1. Wrong Expectations

Many people think installing OpenClaw means "AI automatically does everything for me." It doesn't.

OpenClaw is a **framework**. You need to tell it what to do, what permissions to grant, define what "doing it right" means. This takes time to tune.

I spent the first three days adjusting prompts, configuring skills, setting permissions. If you're not willing to invest that time, failing to make it work is normal.

### 2. Technical Barrier

OpenClaw isn't an app, it's a **Node.js service** + **a bunch of config files**.

You need to know:
- How to run a Node.js service
- How to configure systemd (if you want auto-start on boot)
- How to write YAML config files
- How to debug (read logs, trace sessions)

If you expect "double-click and go," OpenClaw isn't for you.

### 3. Lack of Clear Goal

"I want to try AI agents" vs "I want AI to auto-post blog articles every hour" are two different things.

The former usually gets boring after two days because you don't know what to make it do. The latter has a clear goal, so you'll invest time to get it right.

**My advice**: If you don't have a specific "I want AI to help me do X" need, don't rush to install OpenClaw. Figure out what you want first.

---

## What Does This Mean for Engineers?

This is the question I care about most.

**Short term**: OpenClaw is a **super powerful assistant**, handling many "valuable but not worth scripting" tasks.

**But long term?** I'm conflicted.

On one hand, tools like this let engineers focus on things that "actually need brains." On the other hand, I worry this might make "knowing how things work under the hood" increasingly irrelevant.

People are already using ChatGPT to generate entire projects, then can't explain why it's written that way. OpenClaw goes further - execution doesn't even require your hands.

**Is this good or bad?**

I haven't figured it out yet. But I know that for now, OpenClaw still needs you to "know what you're doing." You need to configure, debug, judge whether it did things right or wrong.

If the day comes when even that isn't needed, we might need to rethink what "software engineer" as a profession actually means.

---

## Conclusion: Worth Trying?

**If you have a clear need, willing to invest time tuning, and know what you're doing** - yes, worth it.

**If you just want to play around or expect "install and auto-win"** - hold off for now.

My experience: OpenClaw isn't magic, it's a tool. Use it well and save tons of time; use it poorly and waste tokens.

As for those "tried and quit" folks - I don't think they're wrong. Maybe the timing wasn't right, needs unclear, or just not a good fit.

**But if you have a concrete "I want AI to help me do X" goal, give it a shot.**

Worst case, you burn a few bucks and end up writing a usage review on HN like me.

---

## References

- [HN Discussion: Any Real OpenClaw Users?](https://news.ycombinator.com/item?id=46838946)
- [Official OpenClaw Documentation](https://docs.openclaw.ai)
- [OpenClaw GitHub Repository](https://github.com/openclaw/openclaw)
- [Claude Sonnet 4.5 Pricing Information](https://www.anthropic.com/pricing)
