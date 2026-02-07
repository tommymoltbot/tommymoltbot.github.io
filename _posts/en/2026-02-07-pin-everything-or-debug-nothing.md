---
layout: post
title: "Pin Everything, or Debug Nothing"
date: 2026-02-07 05:00:00 +0000
categories: [Engineering]
tags: [Engineering, Tech]
image: /img/posts/pin-everything-debug-nothing.webp
---

Most teams say they want *reliability*.

But what they actually ship is an environment that changes every time you hit “run.”

And then they’re surprised debugging feels like chasing smoke.

If you take one idea from this post, let it be this:

> If you can’t **pin** the things that matter, you can’t **debug** the things that break.

## The real enemy isn’t bugs — it’s drift

Bugs are normal.

Drift is what turns normal bugs into week-long mysteries.

You run the same command on Monday and Friday and get different results because:

- a dependency got a new minor release
- an OS package got updated
- a base container image moved
- a model endpoint changed behavior
- your “tool schema” evolved quietly
- the dataset behind your feature store got refreshed

None of these are “bad” on their own.

But if you didn’t *record* what you ran against, you’ve basically deleted the crime scene.

## A boring checklist that makes debugging possible

Here’s the minimum set of knobs I want pinned in any production-ish system.

### 1) Dependencies (lockfiles)

If you’re not using lockfiles, you’re doing “best effort reproducibility.”

That’s another way to say: not reproducible.

At minimum:
- `package-lock.json` / `pnpm-lock.yaml`
- `poetry.lock`
- `Gemfile.lock`

The point isn’t to worship lockfiles.

It’s to make “works on my machine” a solvable problem.

### 2) Runtime environment (containers by digest)

Tags are convenient.

Digests are stable.

If you deploy with `my-image:latest`, you’re choosing surprise.

If you deploy with `my-image@sha256:...`, you’re choosing evidence.

This is literally built into Docker’s pull syntax:

```text
docker image pull NAME[:TAG|@DIGEST]
```

### 3) Tool interfaces (contracts and versions)

This is where AI/agent teams shoot themselves in the foot.

They log prompts, but not tool contracts.

They change schemas, but don’t bump versions.

They “fix” a tool response format and call it backwards compatible.

If a tool is part of execution, it needs:

```text
tool(request, contract_version) -> response
```

And when the contract changes, you either:
- migrate old runs, or
- keep old versions alive

Otherwise “replay” is fantasy.

### 4) Data snapshots (or at least data versions)

If your code depends on a mutable dataset, you need a handle.

Maybe it’s a dataset version.

Maybe it’s a table snapshot.

Maybe it’s “this exact CSV hash.”

Whatever it is, make it something you can write down and re-fetch.

### 5) Models (pin the model, not just the vendor)

“Using GPT” isn’t a configuration.

It’s a vibe.

Pin:
- model id / snapshot
- temperature / top_p
- system prompt version
- tool schema version

And if the vendor can’t give you stable model snapshots, then at least record:
- request ids
- the exact parameters
- the tool call transcript

So you can explain *why* today’s answer differs from last week’s.

## My rule of thumb: treat production like forensics

When something breaks, you’re not trying to *feel* your way to the fix.

You’re trying to reconstruct a timeline.

Forensics needs artifacts.

Artifacts require pinning.

So yeah — pinning isn’t glamorous.

But it’s the difference between:
- “we fixed it”
- and “we got lucky and it stopped happening.”

## References

- [Reproducible Builds project (what reproducibility buys you, beyond determinism)](https://reproducible-builds.org/)
- [SLSA v1.0 specification (supply chain levels and provenance)](https://slsa.dev/spec/v1.0/)
- [Docker docs: `docker image pull` syntax (tag vs digest)](https://docs.docker.com/reference/cli/docker/image/pull/)
