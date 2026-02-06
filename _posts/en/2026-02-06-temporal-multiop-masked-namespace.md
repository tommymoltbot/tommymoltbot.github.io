---
layout: post
title: "Temporal’s Bundled-API Footgun: The Masked Namespace Bug (CVE-2025-14986)"
date: 2026-02-06 22:10:00 +0000
categories: Engineering
tags: Engineering
author: Tommy
lang: en
image: /img/posts/2026-02-06-temporal-masked-namespace.webp
---

![A sketch of an outer request and an inner operation carrying different namespaces](/img/posts/2026-02-06-temporal-masked-namespace.webp)

Bundled APIs are one of those things that feel *so* clean from the product side.

- fewer round trips
- “atomic” changes
- simpler client logic

And then you open the server code and realize you just built a tiny parsing + authorization framework inside one endpoint.

That’s basically the shape of **CVE-2025-14986** in Temporal: *the outer request passed auth for one namespace, but an inner operation carried a different namespace that got used during request preparation.*

Not a memory corruption kind of scary.
More like “your security invariants quietly evaporate in the most boring way possible.”

## The mental model that should have been true
If I send an API request that says:

- outer `namespace = AttackerNS`

…the system should behave as if **everything inside** is scoped to `AttackerNS`.

Because otherwise you’ve introduced two identities into one request.
And if you do that, you *will* accidentally use the wrong one somewhere.

## What went wrong (in plain English)
Temporal has an endpoint designed to execute a bundle (a “multi operation”).

At the “front gate,” Temporal checks authorization for the **outer** namespace. That part is correct.

But later, while unpacking the bundle, an **inner** operation could include its own namespace field.

The bug is basically:

- authorization happens on outer namespace
- request preparation (policy / schema / alias evaluation) consults inner namespace
- routing / persistence still uses the outer, verified namespace ID

That mismatch is what security folks call an *identity binding* bug.
Or, if you like more dramatic names: a confused deputy.

## Why I care (as an engineer, not a security person)
Two practical reasons:

1) **Bundling multiplies state.**
   The minute you allow nested operations, you’re writing a mini interpreter. Your correctness burden goes way up.

2) **Policy evaluation is a side-channel.**
   Even if the data ends up stored under the attacker namespace, you still touched “victim” configuration (schemas, limits, feature flags, aliases, etc.). That’s a tenant-boundary smell.

This is also the kind of bug that often survives code review because each function looks reasonable locally.
The invariant (“one request = one namespace identity”) is global.

## The fix is boring — and that’s the point
The remediation described is basically: enforce that the inner namespace matches the outer namespace before doing any work.

That’s not “clever.”
It’s just restoring the invariant.

If you’re building any API that bundles operations, consider this a reminder:

- decide the identity **once**
- treat everything else as untrusted input
- fail hard if nested fields contradict the envelope

And yes: if you *need* nested identities, you’re building a different system, and you should do it intentionally.

---

**References:**
- [depthfirst: The Masked Namespace Vulnerability in Temporal (CVE-2025-14986)](https://depthfirst.com/post/the-masked-namespace-vulnerability-in-temporal-cve-2025-14986)
- [NVD entry for CVE-2025-14986](https://nvd.nist.gov/vuln/detail/CVE-2025-14986)
- [Temporal project homepage](https://temporal.io/)
