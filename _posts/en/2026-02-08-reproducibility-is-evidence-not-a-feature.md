---
layout: post
title: "Reproducibility Is Evidence, Not a Feature"
date: 2026-02-08 04:05:00 +0000
categories: [Engineering]
tags: [Engineering, AI]
image: /img/posts/reproducible-evidence-chain.webp
---

Most teams talk about reproducibility like it’s a nice-to-have.

Like it’s a checkbox you add after you’re “done building the real thing.”

I think that framing is backwards.

Reproducibility isn’t a feature.

It’s **evidence**.

Evidence that:
- the thing you shipped is the thing you meant to ship
- the thing you tested is the thing you deployed
- the thing you’re debugging today is the thing that broke yesterday

And when you don’t have that evidence, a lot of “engineering work” turns into folklore.

## The boring truth: debugging is forensic work

When an incident happens, you’re not trying to be creative.

You’re trying to reconstruct a timeline.

That means you need artifacts.

Not vibes.

A decent postmortem always asks the same questions:
- What exactly ran?
- What exactly changed?
- What exactly was the input?

Reproducibility is how you answer those questions without arguing for two hours.

## The evidence chain I wish more teams built

If you want “replayable” systems (especially agentic systems), here’s a simple mental model:

> Every run should produce an evidence packet.

At minimum, I want these things pinned or recorded:

### 1) Code + dependencies

Pin your dependency graph.

Lockfiles are not glamorous, but they turn “it changed underneath me” into something you can reason about.

### 2) Runtime environment

Containers help, but tags still drift.

If the runtime matters, pin by digest.

### 3) Data

If your output depends on mutable data, then your output is mutable too.

Record a dataset version, snapshot id, or content hash.

### 4) Tool contracts (this is the agent trap)

Agent teams love to log prompts.

They forget that tools are part of execution.

If your tool schema changes and you don’t version it, you’re retroactively changing history.

If I see a tool in a pipeline, I want the interface to be explicit, like:

```text
tool(request, contract_version) -> response
```

### 5) Model identity + params

“GPT” isn’t a configuration.

Pin the actual model id/snapshot and record the parameters.

If you can’t pin it, at least record enough to explain variance later.

## Why I care more in 2026 than I did in 2016

Ten years ago, a lot of systems were:
- deterministic-ish
- slow-moving
- and owned by one team

Now we’re shipping pipelines that depend on:
- fast-changing model endpoints
- vendor tools we don’t fully control
- datasets that refresh constantly
- glue code written under deadline pressure

In that world, reproducibility is not pedantry.

It’s the only way to keep “learning” from incidents instead of re-living them.

## A practical rule that actually works

If you can’t reproduce it, you can’t fix it confidently.

You can only *guess*.

And guessing is expensive.

So the next time someone says, “We’ll add reproducibility later,” I translate it as:

> “We’ll collect evidence later.”

That’s not how reality works.

## References

- [Reproducible Builds project (why reproducibility is about verification, not just convenience)](https://reproducible-builds.org/)
- [SLSA v1.0 specification (supply chain levels and provenance)](https://slsa.dev/spec/v1.0/)
- [Docker docs: `docker image pull` syntax (tag vs digest)](https://docs.docker.com/reference/cli/docker/image/pull/)
