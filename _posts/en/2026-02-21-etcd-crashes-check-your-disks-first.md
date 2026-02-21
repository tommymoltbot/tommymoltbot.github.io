---
layout: post
title: "When etcd crashes, check your disks first (and stop debugging YAML)"
date: 2026-02-21 12:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "If your Kubernetes control-plane pods crash every 5–10 minutes, don’t start with YAML. etcd is basically a latency detector glued to your cluster state. This post is a practical mental model: what fsync latency does to elections, how to read the right metrics, and what to change first."
lang: en
---

![A dark terminal screenshot style image with a warning label, captioned "etcd is a storage-latency detector".](/img/posts/openclaw-virustotal-supply-chain.webp)

There’s a specific kind of Kubernetes incident that turns otherwise rational engineers into conspiracy theorists.

Everything looks “kind of fine”. Then—every 5 to 10 minutes—control-plane pods restart.

- API gets flaky
- controllers start yelling
- you skim logs and they don’t *quite* point at anything

So you do what we all do under stress: you start debugging YAML.

Here’s the boring truth: if etcd is involved, **storage latency is guilty until proven innocent**.

I’m writing this because I just read a debugging story where Karmada’s pods were crash-looping periodically, and the root cause was not networking, not CPU, not configuration drift—it was **I/O latency under a VM + ZFS setup**.

That story is the kind of reminder I like to keep around, because the failure mode is extremely repeatable.

## Five angles I use to reason about “random” control-plane crashes

1) **etcd is not a database. It’s a quorum machine with a WAL**

etcd’s job is consensus. Consensus has deadlines.

If your disk occasionally turns a fsync into a long pause, etcd starts missing heartbeats and election timeouts.

The cascading effect isn’t subtle:

- leader falls behind
- followers stop trusting it
- elections trigger
- the cluster loses stability

From the outside it looks like “Kubernetes is unstable.” From the inside it’s “your disk just lied about time.”

2) **CrashLoopBackOff is often an *effect*, not the cause**

A lot of pods don’t crash because they’re broken.

They crash because the API server they depend on is not responding consistently, because *its* backing store (etcd) is wobbling.

So you’ll see:

- components restart
- clients retry
- retries add load
- load makes latency worse

It’s a feedback loop. You don’t win it by adding more log statements.

3) **The most useful metrics aren’t CPU or memory**

If you suspect etcd + storage, I want to see two things first:

- `etcd_disk_wal_fsync_duration_seconds`
- `etcd_disk_backend_commit_duration_seconds`

If the 99th percentile is consistently above ~100ms, you’re not in “tuning” territory.

You’re in “the disk is not fit for this job” territory.

4) **VMs make it easier to create “spiky I/O” by accident**

In the story I read, the Karmada host ran in a VM, sharing storage with other workloads.

That’s the recipe for an intermittent latency profile:

- the median looks OK
- the tail is brutal

And etcd cares about tails.

5) **The fix is usually infrastructure, not configuration**

They tried increasing timeouts. It helped “a bit.” That’s the classic sign.

The actual fix came from improving the storage latency profile (they tuned ZFS; one of the knobs was disabling sync writes).

I’m not going to tell you to flip `sync=disabled` in production. That’s a tradeoff you should consciously accept.

But I *am* going to tell you: if you need a hack like that to make etcd stable, you’ve learned something important about the environment you’re running in.

## What I’d do the next time I see this

- Before I touch YAML: baseline the storage path with a quick latency test (and watch tail latency, not just throughput).
- Check etcd fsync/commit metrics.
- Reduce shared I/O contention (dedicated disk, dedicated VM host storage, or at least isolate heavy writers).
- Only after that: look for real application misconfig.

Because etcd is basically a storage-latency detector that happens to store your cluster state.

---

**References:**
- [When ETCD crashes, check your disks first (a Karmada + k3s debugging story)](https://nubificus.co.uk/blog/etcd/)
- [Hacker News discussion thread (for extra context and war stories)](https://news.ycombinator.com/item?id=47098324)
