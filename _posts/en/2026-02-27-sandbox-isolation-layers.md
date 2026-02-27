---
layout: post
title: "Sandbox isolation is layers, not a checkbox"
date: 2026-02-27 20:08:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Sandbox isolation layers: namespaces, seccomp, gVisor, microVM, WASM](/img/posts/2026-02-27-sandbox-isolation-layers-01.webp)

If you build anything that runs **untrusted code** (customer scripts, CI, plugin systems, or the new favorite: “AI agent wrote it, now run it”), you’ll hear the same line over and over:

> “Don’t worry, it’s sandboxed.”

My problem is that *sandboxed* is used like it’s a boolean. It isn’t.

What matters is **where the boundary is** and **what attack surface you’re still sharing**.

Here’s the boring but important baseline: on Linux, “running code” mostly means “making syscalls into the host kernel”. The kernel is huge, and every allowed syscall is an entry point.

```text
Untrusted code  --(syscalls)-->  Host kernel  --(hardware API)-->  hardware
```

So every isolation approach is basically answering one question:

> How much of the host kernel’s complexity do I still expose to code I don’t trust?

I’m writing this because I keep seeing teams reach for containers as the default answer — and then act surprised when the threat model doesn’t match what they *thought* they bought.

## Layer 1: Namespaces — visibility walls
Namespaces (PID, mount, network, user, etc.) are what make containers feel separated. They’re great for *organization* and *“what can this process see?”*

But they’re not a real security boundary by themselves.

The key detail: your process is still talking to the **same host kernel**. If there’s a bug in a kernel subsystem reachable via an allowed syscall, a namespace won’t magically save you.

My mental model:
- Namespaces mostly change *the view*.
- They don’t fundamentally change *what code you’re trusting*.

## Layer 2: Seccomp — reduce the syscall menu (but it’s still the same kitchen)
Seccomp-BPF lets you deny syscalls. This is actually meaningful: fewer syscalls → fewer kernel code paths.

But it’s still the same host kernel.

If you allow a syscall and that code path has a vulnerability, your process is still inside the blast radius.

Also, one practical footgun: people enable `--privileged` to “make the sandbox work” and accidentally remove half the protections they thought they had.

## Layer 3: gVisor — this is where the boundary changes
Once you interpose something like **gVisor**, the isolation story changes qualitatively.

Instead of the untrusted program calling the host kernel directly, syscalls are mostly handled by a **user-space kernel (Sentry)**. The host kernel sees a much smaller set of syscalls, made by gVisor itself.

This changes failure modes:
- A Linux kernel bug in some syscall path might hit containers directly.
- In gVisor, that syscall is often implemented in the Sentry first, so the host kernel is less exposed.

Trade-off: overhead and compatibility gaps. You pay for interception.

If you’re running short-lived untrusted workloads (agent code execution, CI jobs, “run this test”), that overhead is often worth it.

## Layer 4: MicroVMs — hardware boundary, dedicated guest kernel
MicroVMs (think Firecracker / Cloud Hypervisor) are the “stop sharing the kernel” option.

Now the untrusted code talks to a **guest kernel**, and the separation is enforced by hardware virtualization (KVM). Escapes target the hypervisor / device model instead of your general-purpose Linux kernel surface.

This is typically stronger isolation than containers, at the cost of:
- more operational complexity
- higher per-sandbox overhead
- slower startup unless you invest in snapshots / warm pools

For “I really can’t let this touch the host” workloads, microVMs are a sane default.

## Layer 5: WASM — no syscalls (capabilities only)
WebAssembly is the weird one. It’s not “Linux sandboxing”; it’s “don’t give the code a kernel interface at all.”

Your module can only do what you explicitly import.

That’s powerful (capability-based security), but it comes with real constraints:
- not everything compiles cleanly to WASM
- your host APIs become the security perimeter

Still, for plugin systems and highly restricted compute, it’s one of the cleanest models.

## The thing I actually care about (AI agents edition)
A lot of teams are about to learn this the hard way:

If an AI agent can generate and run code, then your platform isn’t “an app” anymore — it’s a **code execution environment**.

And once you’re a code execution environment, you don’t get to hand-wave isolation.

If you take nothing else from this:
- **Containers without additional hardening are not a security boundary.** They’re packaging + visibility separation.
- **Seccomp is good hygiene** but it doesn’t change the kernel-sharing reality.
- **gVisor / microVM / WASM** are different *classes* of boundary, not “a bit stronger containers.”

## A practical selection heuristic
If you want a rough “what should I start with?” ladder:

- *Internal tools, trusted code* → containers + sane defaults
- *Mostly trusted, but you want guardrails* → containers + strict seccomp + no `--privileged` + minimal capabilities
- *Untrusted scripts / agent-run code / multi-tenant CI* → gVisor or microVMs
- *Plugin system with tight capability control* → WASM

And yes, you can (and usually should) layer them. Defense-in-depth beats purity.

---

**References:**
- [“Let’s discuss sandbox isolation” (the original write-up that triggered this post)](https://www.shayon.dev/post/2026/52/lets-discuss-sandbox-isolation/)
- [gVisor documentation (user-space kernel approach and design)](https://gvisor.dev/docs/)
- [Firecracker microVM project (a minimal VMM focused on isolation + fast boot)](https://firecracker-microvm.github.io/)
- [WebAssembly overview (what WASM is and why the capability model matters)](https://webassembly.org/)
