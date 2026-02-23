---
layout: post
title: "AI Reverse Engineering Isn’t a Coding Problem. It’s a Spec Problem"
date: 2026-02-23 22:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![AI reverse engineering as a spec problem](/img/posts/2026-02-23-ai-reverse-engineering-is-a-spec-problem-01.webp)

When people say “AI will write kernel drivers soon,” I always have the same annoying reaction:

Cool. **Where’s the spec?**

Because the hardest part of low-level work is rarely “typing C.” It’s answering questions like:
- What *exactly* is the system supposed to do?
- What’s the ground truth when the docs are wrong?
- How do you test correctness without bricking your machine?

This week I saw a perfect example: a developer tried to get Wi‑Fi working on an old MacBook running FreeBSD. The Broadcom chip (BCM4350) doesn’t have native support, and the usual workaround is a Linux VM (“wifibox”) doing PCI passthrough.

Instead, they went for the “2026 move”: **ask an AI coding agent to port the Linux driver**.

It compiled. Then it panicked the kernel. Then it “worked” but did nothing. Then more wrappers. More shims. More hope. Still nothing.

And then they did the thing that actually sounds like engineering:

They stopped asking the model to “port code,” and asked it to **write a clean-room, bit-level specification of how the driver works**, then used that spec to build a new FreeBSD driver step by step—keeping decisions and progress documented.

That shift—**code → spec → code**—is the part I think people are underestimating.

## The trap: “just port it” is an attractive lie

If you’ve ever tried to port a driver (or any moderately hairy subsystem), you know the vibe. The codebase looks “self-contained” until you touch it:
- the bus layer expects certain OS primitives
- the timing assumptions are implicit
- half the behavior is “because firmware”
- the debug surface is basically: “your machine rebooted”

So when an AI agent says “sure, I can port that,” it’s not being evil. It’s just doing what it always does: pattern match your request to a known shape.

But in kernel-land, the shape that matters isn’t the syntax. It’s the contract.

If your contract is fuzzy, what you get back is fuzzy too—except now your fuzziness is running at ring 0.

## A pattern that works better: treat the model like a spec factory

The FreeBSD Wi‑Fi story is worth reading just for the workflow.

The author’s first attempt was straightforward: copy the relevant Linux driver subtree and ask Claude to make it compile on FreeBSD (initially via LinuxKPI). It produced a huge diff, lots of conditional wrappers, and a driver that never really got close to “correct.”

The second attempt was different: narrow the goal to a single chip + single bus + single mode, and then ask for a spec that a human (or another agent) could implement in a clean-room environment.

Once you have a spec, you can do two really important things:

1) **Proofread it against the source code** (where “source code is ground truth”).

2) **Use it as a stable interface** between “thinking” and “coding,” so your agent doesn’t get lost in 70k lines of driver entropy.

When you put it in those terms, AI isn’t “writing your driver.” It’s helping you build and maintain a document that answers:

```text
system_state + firmware_interface + invariants -> expected_driver_behavior
```

And that’s a different kind of leverage.

## Reverse engineering Rosetta 2: same story, bigger stakes

Around the same time, I also saw an AI-assisted reverse engineering project focused on Apple’s Rosetta 2 translation tech.

Even if you don’t care about Rosetta specifically, the point is familiar: reverse engineering is *not* just decompiling. It’s naming things, discovering invariants, building mental models, and turning “mystery meat” into something you can reason about.

In the Rosetta project, the author talks about identifying functions, mapping semantics, and documenting translation behavior. That’s not glamorous. It’s the slow work.

But it’s also the work where AI helps the most—**if** you use it to structure and cross-check knowledge instead of hallucinating “what the code probably does.”

## My take: “AI can code” is table stakes; “AI can help you own the contract” is the real win

If you’re a working engineer, you don’t lose sleep over whether AI can emit C.

You lose sleep over:
- integration boundaries
- testability
- debugging at 3am
- long-term maintainability

A model that can draft code is nice.

A model that can help you:
- produce a spec
- keep decision logs
- generate test matrices
- summarize crashes
- maintain a changelog across long-running work

…that’s the thing that actually compounds.

And there’s a slightly uncomfortable truth hiding here:

**the more “agentic” AI coding gets, the more your job becomes “spec and verification.”**

Not because AI is taking your job, but because *someone* has to own the meaning.

## A practical checklist (if you want to try this workflow)

If you’re doing anything low-level (drivers, RE, compilers, weird legacy ports), here’s what I’d do with an AI agent:

1) **Constrain the problem**
   - one device
   - one bus
   - one mode
   - one success criterion

2) **Make the agent write a spec first**
   - data structures
   - state machine
   - firmware messages / syscalls
   - expected errors

3) **Force a ground-truth pass**
   - “Show me where in the source this behavior comes from.”
   - “List places where the spec might be wrong.”

4) **Treat the spec as an API**
   - the implementation is allowed to change
   - the contract isn’t (unless you update it explicitly)

5) **Make the agent log decisions and crashes**
   - if you don’t write it down, you didn’t learn it

None of this is new. It’s just that AI makes the documentation loop *cheap enough* that people will actually do it.

And if that becomes normal, the “AI coding” conversation gets way less magical—and way more useful.

---

**References:**
- [Varankin’s write-up on using AI agents to build a FreeBSD Broadcom Wi‑Fi driver](https://vladimir.varank.in/notes/2026/02/freebsd-brcmfmac/)
- [freebsd-brcmfmac repository (resulting FreeBSD driver project)](https://github.com/narqo/freebsd-brcmfmac)
- [Attesor: Rosetta 2 reverse engineering repository and documentation](https://github.com/Inokinoki/attesor)
- [Apple’s overview of Rosetta translation environment (background on what Rosetta is)](https://developer.apple.com/documentation/apple_silicon/about_the_rosetta_translation_environment)
