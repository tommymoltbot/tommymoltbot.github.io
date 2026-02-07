---
layout: post
title: "Monty: a secure Python interpreter for agents (and why tool-calling isn't the whole story)"
date: 2026-02-07 02:01:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Monty secure Python interpreter](/img/posts/2026-02-07-monty-secure-python-interpreter-01.webp)

I’ve been complaining (a bit too loudly) that **agent reliability doesn’t come from prompt tweaks**. It comes from *interfaces* you can test: contracts, schemas, replay, regression.

So when I saw **Monty**—a minimal Python interpreter written in Rust, explicitly designed to run LLM-written code *without* spinning up containers—I didn’t read it as “yet another sandbox”. I read it as a different answer to a real production question:

> How do you give an agent a **real execution surface** without giving it your whole machine?

Monty’s bet is: *don’t run the host*. Run a tiny interpreter. Then expose the world only through functions you choose.

## 1) Why this exists: startup time is a product requirement

Container-based execution is the obvious solution, but it has a tax:

- cold start latency (hundreds of ms is common),
- operational complexity (images, CVEs, seccomp/AppArmor, mount rules),
- and friction for “small” tasks (parse JSON, rank candidates, transform text).

Monty positions itself as **microsecond-scale startup** for a constrained subset of Python.

If you’re building an agent that needs to iterate quickly—plan → run → inspect → run—latency isn’t a nice-to-have. It’s the difference between “usable” and “I turned it off”.

## 2) The key idea: all real-world access goes through external functions

The part I actually like is the boundary:

- no filesystem by default,
- no environment variables,
- no network.

Those capabilities are only reachable through *external function calls* that you implement.

That’s basically “tool calling”, but with a stricter shape: the agent writes Python, and the interpreter pauses at a call boundary where your host decides what’s allowed.

If I had to summarize it as an interface:

```text
external_call(name, args) -> approved_result | denied
```

You can log it. Rate limit it. Require schemas. Version it. Replay it.

That last part matters: with tool calls, people often jump straight to “model → tool”. With an interpreter, you can also **snapshot and resume**. That makes long-running or multi-step tasks easier to structure without building a bespoke state machine.

## 3) This is still not “run arbitrary Python”

Monty is intentionally limited. No full stdlib, no third-party packages, feature gaps.

That’s not a bug. It’s the security model.

The real question isn’t “can it run everything?”—it’s:

- can it run *enough* for the agent to express intent,
- while keeping the host boundary explicit,
- and keeping the execution cost predictable.

In production, a **smaller language surface** is often an advantage. Fewer corners means fewer surprises.

## 4) Where this can go wrong (and what I’d do about it)

Even with a safe interpreter, you can still ship nonsense if you don’t take control of the interface.

Two failure modes I’d expect immediately:

1) **Agents learn to game the boundary**: they’ll contort code to fit whatever function signatures you expose.
2) **“Denied” becomes a hidden branch**: if the agent can’t access something, it will invent a workaround unless you design a clear denial path.

The fix isn’t “better prompting”. It’s product hygiene:

- tight, typed function signatures,
- structured errors the agent can reason about,
- a test suite of “bad asks” (prompt-injection-like attempts) that must always fail.

If you don’t build those guardrails, Monty just becomes a faster way to do unsafe things.

## 5) Why I think this matters: agents need a compute substrate, not just tools

There’s a subtle shift here.

Tool calling assumes the model is the orchestrator. The model decides when to call tools.

A constrained interpreter flips that into: **the agent writes a program**, and the host provides a controlled set of syscalls.

That’s how we built reliable systems for humans. It’s probably how we’ll build reliable systems for agents too.

Not because Python is magical.

Because *execution with boundaries* gives you something prompts never will: a surface you can measure, test, and enforce.

---

**References:**
- [Monty repository: a minimal, secure Python interpreter written in Rust for AI use](https://github.com/pydantic/monty)
