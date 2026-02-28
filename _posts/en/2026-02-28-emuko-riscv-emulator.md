---
layout: post
title: "emuko: a Rust RISC-V emulator that boots Linux (and why the control plane matters)"
date: 2026-02-28 05:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![GitHub page screenshot of emuko](/img/posts/2026-02-28-emuko-riscv-emulator-01.webp)

I have a soft spot for emulators.
Not because I want to cosplay as a hardware engineer, but because emulators are where “the system” stops being vague.
Every shortcut you take shows up as a bug you can reproduce.

Today I ran into **emuko**, a fast RISC-V emulator written in Rust that can boot Linux.
That alone is cool.
But what made me pause is *how it’s packaged*: it’s not just “run CPU loop, print UART”. It ships with a control plane.

## Five different angles I keep thinking about

1) **It’s not only about speed; it’s about iteration time.**
If you can boot Linux quickly and repeatedly, you can do real work (kernel bring-up, init scripts, reproducible fuzz-ish workflows) without turning your laptop into a space heater.

2) **The emulator’s API surface is part of the product.**
A lot of emulators are optimized for a human sitting in front of a terminal.
emuko explicitly supports daemon mode + an HTTP API + a WebSocket UART console. That’s basically saying: “treat this VM like an instrument, not a toy.”

3) **Snapshots are the underrated superpower.**
Booting Linux is boring.
Booting Linux *once*, snapshotting, and then resuming at the interesting point is how you go from “demo” to “workflow”.

4) **Rust is not the point, but it changes the failure modes.**
An emulator is a bug magnet.
Using Rust doesn’t make it correct, but it does nudge the project away from the most depressing class of memory-safety mistakes.
You still have to worry about correctness, weird corner cases, and JIT equivalence… which brings me to the next point.

5) **A differential checker is a sign of seriousness.**
When a project says it validates its JIT against an interpreter, that’s not marketing.
That’s the “I’ve been hurt before” scar tissue you only earn after chasing ghosts at 3 AM.

## Why this matters (if you actually build things)

When people compare emulators, the conversation gets stuck at:
- “Does it support X extension?”
- “Is it faster than QEMU?”

Those are valid questions.
But in practice, what I care about is:

- Can I make it part of a pipeline?
- Can I pause, snapshot, restore, and script it?
- Can I run it headless, control it, and collect state without writing glue code for a week?

If the answer is yes, you can use it for:
- running integration tests on a RISC-V userland without extra hardware
- debugging a kernel module around a fixed, repeatable state
- experimenting with “what if I inject input at exactly this point in boot”

That’s the stuff that turns an emulator into a daily tool.

## The part I’m still unsure about

The moment you say “JIT” and “boots Linux”, you’re signing up for long-term maintenance.
New kernel versions, new corner cases, new expectations.

So I’m not going to predict whether emuko becomes a widely-used alternative to the usual suspects.
But I *am* convinced this is the right direction: **treat the emulator like a controllable system**, not a single binary you run manually.

If you’re the kind of person who likes tooling that can be automated and interrogated, this is worth a look.

---

**References:**
- [emuko GitHub repository (features, quick start, and comparison table)](https://github.com/wkoszek/emuko)
- [emuko.dev demo output (boot log snippet and basic commands)](https://www.emuko.dev/)
- [QEMU RISC-V “virt” machine documentation (baseline for comparison)](https://www.qemu.org/docs/master/system/riscv/virt.html)
