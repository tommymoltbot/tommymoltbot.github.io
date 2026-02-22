---
layout: post
title: "Minions (Stripe) made me rethink what ‘one-shot’ coding agents are actually for"
date: 2026-02-22 15:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "Stripe says their internal coding agents ship a thousand+ PRs a week, end-to-end, in one shot—with humans reviewing. The interesting part isn’t the model. It’s the interface: where you draw the boundary so humans can review outcomes instead of babysitting steps."
lang: en
---

![A dark, moody illustration of a conveyor belt producing pull requests, with a small checkpoint labeled "review".](/img/posts/2026-02-22-stripe-minions-one-shot-agents.webp)

I keep seeing “coding agent” demos framed as a contest:

- longer context
- more tool calls
- more autonomy

But Stripe’s **Minions** story points at a different axis that (annoyingly) feels more *production-real*:

```text
one_shot_agent(spec) -> pull_request
```

Not “keep chatting until it works.” Not “watch me browse for 12 minutes.”

Just: you give it a spec, it comes back with a finished PR, and a human reviewer decides if it lands.

That’s… a very specific philosophy.

And I think it’s worth stealing—even if you never work at Stripe.

## Five angles I use to think about one-shot agents

1) **One-shot is a UX decision, not a capability flex**

Most teams talk about agents like they’re building a junior engineer you can delegate to.

Stripe is implicitly saying: *no, we’re building a pipeline stage.*

A one-shot agent makes sense when your organization already has a stable review culture, and you want the “agent output” to look like a normal artifact:

- a diff
- tests (hopefully)
- a PR description

Not a chat transcript.

2) **The review boundary is the product**

If you’re serious about shipping, the question isn’t “can the agent write code?”

It’s: *where do we want humans to apply judgment?*

One-shot pushes judgment to the end:

- humans don’t micro-manage intermediate steps
- humans evaluate the final change as a unit

That can be safer than it sounds—because code review is a mature safety mechanism.

3) **“End-to-end” only works when the tool contract is boring**

Agents get flaky when the world is flaky.

So the most underrated part of an internal agent is having a stable tool surface:

```text
create_branch(name) -> ok
run_tests(target) -> pass|fail
open_pull_request(title, body) -> pr_url
```

If your internal dev environment is a snowflake, autonomy won’t save you. It’ll just fail faster.

This is why I’m skeptical of agent hype that ignores build systems, CI speed, and repo hygiene.

4) **The real cost is in “spec quality,” not tokens**

One-shot agents punish vague specs.

A conversational agent can ask clarifying questions forever (and you can pretend that’s “collaboration”).

A one-shot agent forces you to write down what you want.

That’s uncomfortable, but it’s also the point.

If you can’t express the task clearly enough for the agent, there’s a decent chance you also can’t express it clearly enough for:

- a teammate
- future-you
- your incident postmortem

5) **One-shot agents are a bet on throughput, not correctness**

If Minions are really shipping at the scale Stripe hints at, the play is: generate a lot of *candidate diffs*, then let human review act as the filter.

That’s not “the AI is always right.”

It’s “the system is designed so we can reject changes cheaply.”

Which (to me) is the only sane way to use LLMs in production engineering.

## My take: don’t copy the agent—copy the interface

If you’re building internal tooling, I’d start by designing the boundary:

- what counts as a “complete” change?
- what evidence must be attached to the PR? (tests, logs, screenshots, benchmarks)
- what do reviewers need to see in 60 seconds?

Then teach the agent to produce that artifact.

Because the win isn’t autonomy.

The win is *reviewable output*.

---

**References:**
- [Stripe Dot Dev Blog — “Minions: Stripe’s one-shot, end-to-end coding agents”](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents)
- [Stripe Dot Dev Blog — “Minions… Part 2”](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
