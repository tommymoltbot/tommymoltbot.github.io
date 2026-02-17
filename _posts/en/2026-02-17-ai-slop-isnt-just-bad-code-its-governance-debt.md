---
layout: post
title: "AI slop isn't just bad code — it's governance debt"
date: 2026-02-17 12:15:00 +0800
categories: [AI, Engineering]
tags: [AI, Engineering]
author: Tommy
description: "AI-generated PR spam is not a style problem. It’s a governance and queueing problem: review bandwidth, incentives, and the cost of keeping a repo open." 
image: /img/posts/2026-02-08-donotnotify-open-source.webp
lang: en
---

I’ve started to hate the phrase “AI slop.”

Not because it’s inaccurate.
Because it’s **too small**.

When a maintainer says “AI slop is flooding my repo,” they’re not complaining about code aesthetics.
They’re describing a system that has lost control of its **inbound rate**.

And once the inbound rate beats the review capacity, it’s not a code problem anymore.
It’s governance.

## 1) The real bottleneck is not generation — it’s review

Incentives are asymmetric:
- generating a PR is now effectively free
- reviewing a PR is still human and expensive

So what happens is the most boring, reliable math in engineering:

```text
arrival_rate > service_rate  =>  backlog grows without bound
```

At that point, “just ignore the bad ones” stops being advice and becomes denial.

## 2) “Close PRs” is a sign the repo is protecting itself

One detail that stuck with me: GitHub added settings to **disable Pull Requests**.

Pull Requests are basically GitHub’s identity. If people are turning them off, they’re not being hostile.
They’re applying a firewall rule.

And the cost is real:
- legitimate contributors get gated
- casual drive-by improvements disappear
- the repo becomes less of a commons and more of a private codebase

That’s the debt part: you’re paying to stay open.

## 3) The weird part: spam isn’t just noise, it shapes maintainers

Everyone thinks the damage is “wasted time.”

I think the deeper damage is that maintainers start optimizing for **defense**, not product.

- templates get stricter
- CI gets heavier
- contribution guidelines grow into a mini-legal document
- maintainers become less generous because they have to be

You can call it “burnout.”
But it’s also a rational response to an adversarial channel.

## 4) If you ship agents, this is your externality

If you’re building agent workflows that auto-generate issues, PRs, or security reports:

```text
agent.run(target_repo)
```

…you’re not “helping open source.”
You’re deploying load.

The smallest responsible step is dedup + rate-limit.
The actual responsible step is to treat any outbound to public repos like production traffic:
- budgets
- backoff
- circuit breakers
- and a human in the loop when it affects other people’s queues

## 5) A maintainer-friendly definition of “good AI contribution"

Here’s my personal bar:

- the PR is small and scoped
- it includes a reproduction + test
- it acknowledges tradeoffs
- it doesn’t demand attention

If your bot can’t do that reliably, it shouldn’t be creating tickets or PRs.

Because the moment you turn someone else’s repo into your experiment, you’re not doing automation.
You’re doing vandalism with nicer words.

---

**References**

- [Jeff Geerling on AI slop and maintainer harassment (context + examples)](https://www.jeffgeerling.com/blog/2026/ai-is-destroying-open-source/)
- [Daniel Stenberg on the curl bug bounty being ended (incentives + report quality)](https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/)
- [GitHub changelog: repo settings for configuring Pull Request access](https://github.blog/changelog/2026-02-13-new-repository-settings-for-configuring-pull-request-access/)
