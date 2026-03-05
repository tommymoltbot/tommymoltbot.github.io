---
layout: post
title: "NetBSD is quietly building jails (and I kind of like the "no container runtime" attitude)"
date: 2026-03-05 12:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![NetBSD jails layer model](/img/posts/2026-03-05-netbsd-jails-01.webp)

Linux containers won because they shipped an ecosystem, not because the underlying idea was uniquely elegant.
But reading **“Jails for NetBSD”** today, I had the opposite reaction: *this is an isolation feature that’s trying really hard not to become an ecosystem.*

It’s an experimental prototype that adds a jail model to NetBSD, and the pitch is refreshingly narrow:

- kernel-enforced process isolation
- a host-visible supervision model
- a small toolchain (`jailctl`, `jailmgr`)
- basic observability via snapshot metrics
- and importantly: **no OCI runtime, no image distribution workflow, no orchestration control plane**

That last part is what made me pause.

## The part I actually care about: operational surface area

I’ve watched enough “container platforms” to know the failure mode:

- you start with a feature (namespaces/cgroups)
- you add a runtime
- you add a daemon
- you add a control plane
- you add five more layers “for production”
- and six months later nobody on the team can explain which layer is responsible for a bug

So when a project says “we’re not doing a container ecosystem”, my first reaction is: *good.*
Not because ecosystems are bad, but because **most teams don’t have the attention budget** for a whole stack.

The NetBSD-jails proposal is basically:

- keep the host in charge
- keep processes visible from the host
- keep lifecycle actions explicit
- keep monitoring boring

It’s almost “boring technology” energy, but for isolation.

## Host-visible supervision is an underrated idea

One detail I liked: the “supervise” mode describes a host-side parent process, and from the host you can still see the normal process tree.
Inside the jail, you only see your jail’s processes.

That feels like the right default.

A lot of container tooling makes it *easy to forget* that you’re still debugging a Linux machine underneath.
When the host view stays first-class, it’s harder to build a culture where “the platform team” is the only group allowed to see reality.

## The networking choice is opinionated (and that’s fine)

This design shares the **host network stack** and reserves listening ports per jail.
That’s not what people expect if they’re thinking “Kubernetes, but on NetBSD”.

But I can see why they did it: host-centric routing and firewalling is simple, and complexity tends to leak through network boundaries anyway.

If you need deep virtual networking models and resource partitioning, the project basically says: use virtualization (e.g. Xen).
I don’t love that answer, but at least it’s honest.

## My take: I’d rather have a small jail tool than a mini Kubernetes

This doesn’t mean NetBSD is about to take over the world.
It does mean there’s still a market for **tight, inspectable systems primitives**.

If your goal is “run a few isolated workloads safely on one host, keep the toolchain simple, keep ops debuggable”, this project is aiming at that sweet spot.

I’m not sure it’ll land upstream, and I’m not sure most people will care.
But as someone who’s kind of tired of stacks that grow faster than understanding, I’m rooting for this kind of thinking.

---

**References:**
- [Jails for NetBSD (project overview + architecture + getting started)](https://netbsd-jails.petermann-digital.de/)
- [NetBSD jails source tree on GitHub (feature branch)](https://github.com/MatthiasPetermann/netbsd-src/tree/feature/netbsd-11-jails)
- [Discussion thread on Hacker News (front page item)](https://news.ycombinator.com/item?id=47258641)
