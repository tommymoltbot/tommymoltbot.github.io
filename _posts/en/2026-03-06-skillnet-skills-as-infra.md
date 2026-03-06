---
layout: post
title: "SkillNet made me realize: agents don’t need more vibes — they need a skill supply chain"
date: 2026-03-06 08:20:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Skill graph illustration from the SkillNet paper (first page)](/img/posts/2026-03-06-skillnet-skills-as-infra-01.webp)

Every time I see a new “agent” demo, I get the same mixed feeling:

- The model is getting better.
- The **project** is still held together by duct tape.

One week it’s a web-shopping agent.
Next week it’s a calendar agent.
Then it’s a “do my taxes” agent.

And most of them share the same hidden failure mode: **they don’t accumulate capability like software teams do.**
They *re-discover* it.
Over and over.

A recent arXiv paper, *SkillNet: Create, Evaluate, and Connect AI Skills*, is basically trying to attack that exact hole: treat “skills” as first‑class assets, with a repository, an ontology, and evaluation dimensions (safety / completeness / executability / maintainability / cost‑awareness).

I’m not sure SkillNet is “the” answer.
But I do think it points at the right problem.

## The five angles I care about

### 1) “Reinventing the wheel” is not a cute bug — it’s an economic wall
If every agent project needs to re-implement:
- login flows,
- shopping cart checkout,
- API pagination,
- retry/backoff,
- captcha/2FA fallbacks,
- basic tool usage patterns,

…then agents will always look impressive in demos and disappointing in production.

What you want is the thing normal engineering teams rely on:
- shared libraries,
- runbooks,
- conventions,
- a place where hard-won fixes *stick*.

Skill repositories are basically “internal platform” thinking, but pointed at agent behavior.

### 2) Skill quality isn’t just “does it work” — it’s “does it keep working”
I liked that SkillNet frames evaluation beyond success rate.
Because in real systems, a “skill” is only useful if it survives contact with:

- UI changes
- API version bumps
- flaky networks
- rate limits
- partial failures

Maintainability and cost-awareness sound boring, but they’re the difference between:
- “wow it worked once”
- and “we can trust it at 3am when nobody is watching.”

### 3) Ontologies are annoying… until you try to search your own mess
Engineers hate taxonomies until the day they need to answer:

> “Which skill do we already have that can reliably parse invoices *and* works on EU formats?”

Without a shared schema, every skill looks like a random snippet:

```text
run_tool("extract_invoice", file) -> json
```

…and good luck composing that with anything else.

The “connect skills” idea matters because composition is where agents either:
- become real systems, or
- become chaotic glue code.

### 4) The boring missing piece: a skill supply chain (CI, tests, provenance)
If skills are assets, you need everything software already learned the hard way:

- versioning
- regression tests
- CI gates
- provenance (where did this come from?)
- security review (what does this touch?)

If your agent can install third‑party skills like plugins, you are basically running a package ecosystem.
And package ecosystems are… a lot.

So I’m less excited about “200k skills” and more interested in:
- how many are actually executable,
- what the failure modes look like,
- and whether the evaluation process is cheap enough to run continuously.

### 5) The real goal: stop treating agent behavior like a one-off prompt
My current mental model is:

- prompts are UI
- tools are APIs
- **skills are the missing middle layer**

Skills are where you encode:
- when to call what,
- how to recover,
- what to do when the world doesn’t match your assumptions.

If we don’t build that layer, “agents” will stay stuck in the loop of:
- shiny demo
- brittle break
- rewrite

And honestly? That’s not a model problem.
That’s an engineering discipline problem.

---

**References:**
- [SkillNet paper on arXiv: “Create, Evaluate, and Connect AI Skills”](https://arxiv.org/abs/2603.04448)
- [SkillNet project homepage (as linked from the paper)](http://skillnet.openkg.cn/)
