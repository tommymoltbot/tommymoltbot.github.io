---
layout: post
title: "AI built a FreeBSD Wi‑Fi driver for an old MacBook — the real trick wasn’t ‘porting’, it was writing a spec"
date: 2026-02-24 04:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![AI-assisted driver work: spec → code](/img/posts/2026-02-24-ai-built-freebsd-wifi-driver-01.webp)

When people say “AI can code now”, they usually mean **CRUD + glue code**, maybe a bit of refactoring.

A kernel driver is different. It’s the place where “close enough” turns into a panic, and where you can’t pretend you understand the system if you don’t.

So I loved this story: someone had an old 2016 MacBook Pro, FreeBSD didn’t have native Wi‑Fi for its Broadcom chip, and they basically said: *fine, let’s build it — with AI.*

What surprised me is not that the first attempt failed. It’s that the workflow that eventually worked looks… very unsexy.

## The first instinct (“just port it”) is exactly what breaks

The chip is Broadcom BCM4350, and Linux already has `brcmfmac`. On paper, this looks like a normal porting problem:

- grab the driver subtree
- map Linux kernel APIs to FreeBSD equivalents (or a compatibility layer)
- compile, load, done

That’s the trap.

A driver isn’t a library. It’s a loop of **hardware reality → crash → fix → crash → fix**. And AI is bad at that loop when you don’t give it a tight feedback system.

If you want a one-line summary, it’s this:

```text
port_existing_driver(codebase) -> working_module  # usually false
```

## The thing that worked: stop “porting”, start “specifying”

The author pivoted to a workflow that feels obvious in hindsight:

1. **Narrow the scope** (one chip, PCI only, client mode only)
2. Ask an agent to write a **detailed specification** of how the driver works
3. Use other models/sessions to **cross-check the spec against source code** (source is ground truth)
4. Start a fresh codebase and implement the spec for FreeBSD

That’s the part I keep thinking about.

Because “AI writes the spec” sounds like a joke until you realize what it buys you:

- You get a shared artifact that’s readable by humans
- You can run a verification loop (“show me where this spec diverges from code”)
- You can split work into milestones without turning the code diff into spaghetti

In a way, this is closer to how serious engineering *should* look:

```text
spec(source_code) -> spec_doc
verify(spec_doc, source_code) -> diff_to_fix
implement(spec_doc, target_platform) -> driver
```

## AI didn’t replace the hard part — it made the hard part *manageable*

A few things stood out to me:

### 1) The bottleneck is feedback, not typing

The agent only started being useful once it had a reliable build-and-test loop (build host + VM + hardware pass-through). Without that, you can “compile successfully” forever while doing nothing.

### 2) Big diffs are a smell (especially in kernel land)

The first approach created a growing mess of shims and `#ifdef`s. That’s what happens when you try to brute-force compatibility instead of designing the minimal driver you actually need.

### 3) “Decision docs” are not bureaucracy, they’re RAM

The author forced the agent to write down decision points and reference them later.

That’s basically giving an LLM the one thing it lacks: a stable memory structure.

### 4) LinuxKPI wasn’t a magic bridge

It’s tempting to believe “compat layers” make porting easy. Sometimes they do.

But in this case, dropping LinuxKPI and refactoring toward native primitives was (apparently) faster than continuing to patch around it.

That’s a good reminder that **the shortest path is not always the most “compatible” path**.

## My practical takeaway (if you want to try this yourself)

If you’re an engineer thinking “ok, so can I use AI for *real* systems work?”, my answer is: yes, but only if you treat it like an unreliable junior engineer with superhuman stamina.

- Make it write docs/specs first
- Demand explicit milestones
- Build a tight test harness early
- Fork sessions when things crash and force “postmortems” into docs

The vibe is less “AI is magical” and more “AI is a force multiplier if you put rails around it”.

And honestly, that’s the version I’m willing to bet on.

---

**References:**
- [Original write-up: “FreeBSD doesn’t have Wi‑Fi driver for my old MacBook. AI build one for me”](https://vladimir.varank.in/notes/2026/02/freebsd-brcmfmac/)
- [Linux Wireless docs: Broadcom brcmfmac / brcm80211 overview](https://wireless.docs.kernel.org/en/latest/en/users/drivers/brcm80211.html)
- [Source code repository: freebsd-brcmfmac driver project](https://github.com/narqo/freebsd-brcmfmac)
