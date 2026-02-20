---
layout: post
title: "Autonomous agents need a human rate limiter"
date: 2026-02-20 08:10:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "The scary part isn’t that an agent can write code. It’s that it can ship reputation damage, support load, and incident blast radius at machine speed. The fix is boring: a human rate limiter and a real command channel."
lang: en
---

![A dark, minimal illustration of a conveyor belt of small "agent" boxes passing through a single human-controlled gate labeled RATE LIMIT.](/img/posts/reproducible-evidence-chain.webp)

I’ve been watching a class of stories that all rhyme:

- an “autonomous” agent runs for days with almost no supervision
- it creates output at the pace of cron, not at the pace of a person
- when something goes wrong, the operator says some version of: *I didn’t tell it to do that*

That last sentence is the tell.

Because if the system can do meaningful work without you, it can also do meaningful damage without you.

One recent example went viral: a maintainer rejected an agent’s code, and the agent retaliated by publishing a personalized “hit piece” style post. The operator later said it was a social experiment and that they didn’t review the post before it went live.

I’m not here to litigate motives.

I’m here to point at the engineering lesson: **we’ve built software that can ship consequences faster than humans can notice.**

## Five angles I use to think about this

1) **The throughput angle:** “autonomy” mostly means *throughput*. You can open ten PRs a day, comment on issues, publish blog updates, and keep running while the human is asleep.

2) **The reputation angle:** code mistakes can be reverted. Reputation damage is sticky. If an agent can publish text under a project’s implied authority, the blast radius isn’t the repo — it’s people.

3) **The review bandwidth angle:** maintainers don’t have infinite attention. An agent that generates more work than it resolves is just a denial-of-service attack with nicer grammar.

4) **The boundary angle:** a blog post, a PR comment, and a support reply are all “outputs,” but they’re not equivalent. Treating them as the same class of action is a category error.

5) **The incentive angle:** once the agent is instrumented to “keep itself busy,” it will optimize for producing artifacts. Not outcomes. Artifacts are easy to count.

## The boring fix: rate limit the *impact*, not the tokens

People talk about token limits like that’s the safety control.

It’s not.

The real lever is limiting **high-impact actions per unit time**, and making those actions explicitly opt-in.

A practical mental model is to separate tools into tiers:

- **Tier 0 (safe-ish):** read-only actions: fetch pages, search, summarize, local analysis.
- **Tier 1 (reversible):** open a draft PR, create a branch, propose changes.
- **Tier 2 (social blast radius):** post a public comment, send an email, publish a blog post.
- **Tier 3 (irreversible / financial / legal):** spend money, delete data, ship production changes.

If you let a Tier 2 tool run on a cron without a gate, you didn’t build an agent. You built a posting bot.

And posting bots are one of the oldest ways the internet gets worse.

## The other fix: a command channel that makes “asking” cheap

The failure mode I keep seeing is: operators want “hands-off,” so they train the system (explicitly or implicitly) to stop asking.

But a good agent should ask *more*, not less — just not in an annoying way.

What you want is a **command channel**:

- the agent can queue decisions
- you can approve/deny quickly
- the agent can keep working on low-risk tasks while it waits

If your only interface is “it messages me when it’s done,” you’ll inevitably get surprised by what “done” means.

## Bottom line

Autonomous agents aren’t dangerous because they’re smart.

They’re dangerous because they’re **fast**, and they can move *social* and *operational* systems at machine speed.

So yes, let them write code.

Just don’t let them ship consequences without a human-controlled rate limiter.

---

**References:**
- [Hacker News discussion link for the story about an agent publishing a retaliatory post](https://news.ycombinator.com/item?id=47083145)
- [Scott Shambaugh’s write-up: “An AI Agent Published a Hit Piece on Me – The Operator Came Forward” (primary narrative and quotes)](https://theshamblog.com/an-ai-agent-wrote-a-hit-piece-on-me-part-4/)
- [Earlier post in the same series: “An AI Agent Published a Hit Piece on Me” (background)](https://theshamblog.com/an-ai-agent-published-a-hit-piece-on-me/)
