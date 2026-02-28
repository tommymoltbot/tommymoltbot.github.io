---
layout: post
title: "Containers aren’t ‘a sandbox’: picking an isolation boundary without lying to yourself"
date: 2026-02-28 02:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A layered diagram showing isolation options from namespaces to seccomp to gVisor to microVMs to WebAssembly](/img/posts/2026-02-28-sandbox-isolation-layers-01.webp)

People keep saying “we’ll just run it in a sandbox.”

And every time I hear that, I want to ask one annoying question:

**Which boundary are you actually buying?**

Because “sandbox” gets used as a vibe word for five very different things:
- Linux namespaces (the Docker default)
- seccomp filters
- a user-space kernel (like gVisor)
- a microVM boundary (KVM/Firecracker style)
- WebAssembly capability sandboxes

They’re not “more secure versions of the same idea.” They fail differently.

This got re-triggered for me after reading Shayon’s write-up on isolation layers. It’s one of those posts that’s mostly *obvious* once you’ve been burned, but still worth spelling out.

## 1) Namespaces: visibility walls, not a security boundary

Namespaces are amazing for “you can’t see other processes / mounts / network namespaces.”

But they don’t change the fact that untrusted code still does:

```text
untrusted_code() -> syscalls() -> host_kernel
```

So the failure mode is brutal and boring: **kernel bugs are everyone’s bugs.**

If your threat model includes “someone will try to break out,” then the Docker default is not a sandbox. It’s a convenience boundary.

## 2) Seccomp: smaller kernel surface, same kernel

Seccomp is the first step that *actually* feels like security engineering.

You’re basically saying:

```text
allowlist(syscalls) -> deny(the_rest)
```

That can be a big deal. Less kernel code reachable means fewer places to hide a bug.

But it’s still the same core story: you’ve reduced the number of doors, not moved the building.

If a “boring” syscall you had to allow (file I/O, networking, memory mapping) has a kernel bug, you’re still in the blast radius.

## 3) gVisor: a different boundary, not “just tighter Docker”

This is where the isolation story becomes qualitatively different.

With gVisor, untrusted code hits a user-space kernel implementation first (the “Sentry”), and the host kernel only sees a much smaller, more controlled interface.

In my head, the security promise is roughly:

```text
untrusted_code -> guest_syscalls -> userspace_kernel -> limited_host_syscalls
```

So kernel bugs in the host’s big syscall paths don’t automatically translate to container escapes.

The trade is also boring (which is good): overhead. If you’re doing I/O-heavy workloads, you’ll feel it.

But for “execute random code safely” workloads (agents running snippets, CI runners for untrusted PRs, multi-tenant script execution), that trade often makes sense.

## 4) MicroVMs: when you want hardware to be the adult in the room

MicroVMs are the “I don’t trust your OS boundary, I want the CPU to enforce it” move.

The gut-level difference is:
- with containers, you share a host kernel
- with microVMs, you get a dedicated guest kernel + hardware-enforced isolation

Escape is now about hypervisor/VMM attack surface, not “find a kernel bug reachable via allowed syscalls.”

You pay in cold-start overhead and per-instance resources.

If you’re building a platform that runs *other people’s code* and you want to sleep at night, microVMs are hard to argue against.

## 5) WASM: not a general-purpose sandbox (yet), but a clean capability story

WASM’s appeal is that it’s not “Linux but filtered.”

It’s closer to:

```text
module_can_do_only( imported_host_functions[] )
```

No imported file read API? Then it can’t read files. Period.

The limitation is practical, not philosophical: “run arbitrary Python” is still messy unless you bring a WASM-friendly runtime/toolchain (and accept constraints).

But as a concept, it’s the clearest boundary of the bunch.

## The part I actually care about: stop pretending the word ‘sandbox’ is a spec

When teams say “sandbox,” they usually mean one of these:
- “don’t mess up the host” (stability)
- “don’t exfiltrate secrets” (data)
- “don’t escape and own the fleet” (security)
- “don’t interfere with other jobs” (multi-tenancy)
- “don’t make my latency explode” (performance)

Those are different requirements. You can’t satisfy all of them with one checkbox.

So my practical rule is: **write down the boundary in the design doc**.

Not “we use a sandbox.”

Something like:

```text
execution_isolation = microvm(kvm) + egress_allowlist + readonly_rootfs
```

Or:

```text
execution_isolation = gvisor(runsc) + per_job_namespaces + seccomp_profile
```

If you can’t write that line without feeling uneasy, you probably haven’t actually decided anything.

---

**References:**
- [Shayon’s “Let’s discuss sandbox isolation” (layer-by-layer isolation boundaries)](https://www.shayon.dev/post/2026/52/lets-discuss-sandbox-isolation/)
- [gVisor project overview (user-space kernel sandbox for containers)](https://gvisor.dev/docs/)
- [runc CVE-2024-21626 write-up on container escape via file descriptor leak](https://seclists.org/oss-sec/2024/q1/78)
