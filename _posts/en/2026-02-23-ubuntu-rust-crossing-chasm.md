---
layout: post
title: "Ubuntu is using Rust. That matters more than most Rust hype"
date: 2026-02-23 19:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Ubuntu adopting Rust as a bridge from early adopters to the early majority](/img/posts/2026-02-23-ubuntu-rust-crossing-chasm-01.webp)

Rust has been “winning” for years now.

But I keep thinking: **winning where, exactly?**

In the cloud infra / performance-obsessed corner of the world, Rust is already normal. In safety-critical land, it’s still proving itself. And in the boring middle — the part where most software actually lives — adoption is weirdly uneven.

Niko Matsakis wrote a post that gave me a cleaner mental model: Ubuntu (Canonical) adopting Rust isn’t just another “big company uses Rust” headline. It’s a *bridge-building* move — the kind that helps Rust cross from “engineers who like new things” to “organizations that hate surprises.”

That’s the chasm.

## The part people miss about “crossing the chasm”

When a language is new, the first adopters are buying a bet. They’re okay with sharp edges because being early is part of the value.

The early majority is the opposite. They want:

- fewer unknowns
- predictable maintenance
- boring compatibility
- proof that “someone like us” shipped this and didn’t regret it

So if you want to change what the average company defaults to, you don’t just need benchmarks. You need **reference customers**.

Ubuntu is a pretty good reference customer for “user-land Linux that has to work for normal humans.”

## Why Ubuntu is a special kind of signal

Canonical isn’t adopting Rust in some isolated microservice. The point (as Niko tells it, via Jon Seager’s talk) is foundational utilities: the stuff that sits underneath everything.

That’s the uncomfortable zone because:

- if it breaks, *everything* breaks
- if it’s incompatible, users notice immediately
- if it’s slower or heavier, you get punished at scale

So if a distro like Ubuntu says “we’re going to sponsor and ship memory-safe rewrites of core utilities,” it’s not vibes. It’s them volunteering to be the adult in the room.

And that’s what the early majority wants to see: someone else paying the initial risk tax.

## The real product isn’t Rust. It’s “drop-in boringness”

The phrase that stuck with me from Niko’s post is the idea of building the bridge with *drop-in utilities*.

The selling point isn’t “Rust is cool.” It’s:

- I can replace a tool without rewriting my workflow.
- It behaves like the thing I already trust.
- If something goes wrong, the blast radius is bounded.

That’s why projects like these matter:

- sudo-rs (sponsor-backed)
- ntpd-rs (time is one of those things you only notice when it’s broken)
- uutils’ coreutils work

It’s basically an adoption strategy that looks like engineering, not marketing.

## Five angles I’m using to think about what happens next

I’m in a pretty “normal engineer” mood about this: mildly optimistic, mildly suspicious, and mostly interested in what breaks first.

### 1) “Reference customers” are not interchangeable

A cloud company using Rust doesn’t automatically convince a Linux distro.

A Linux distro using Rust doesn’t automatically convince an automotive supplier.

Adoption is domain-specific. If Rust wants to cross multiple chasms, it needs multiple bridges — and Ubuntu is one of the important ones for the Linux userland world.

### 2) The ecosystem pressure shifts from “features” to “table stakes”

Early adopters tolerate “just add a crate.”

The early majority asks for:

- stable, boring defaults
- curated stacks
- docs that match reality
- long-term maintenance signals

Niko mentions the old “Rust Platform” proposal (bless a set of crates as an extended stdlib) and how it was a bad fit back then.

I think that’s the pattern: ideas that feel pointless to pioneers start becoming necessary once you’re serving pragmatists.

### 3) Open source empathy is a scaling problem

This part hit me because it’s painfully true: open source communities can get “middle school” fast.

If your adoption strategy depends on *new kinds of users*, you can’t afford a culture where one rude reply nukes someone’s interest.

The early majority doesn’t have time to decode your oral tradition.

If Rust wants Ubuntu-style adoption, the ecosystem needs to get better at:

- meeting people where they are
- treating “dumb questions” as onboarding, not noise
- being explicit about what’s stable vs experimental

### 4) “Investment” often comes before adoption, not after

I liked Niko’s observation: some companies have budget to close gaps *before* they adopt.

That changes the pitch.

Instead of “please donate because we depend on Rust,” it becomes:

- “if you need X to ship Rust in your environment, fund X”
- “if you need boring reliability, pay for boring reliability”

Which is honestly how the world works.

### 5) For working engineers, this is the pragmatic moment

If you’re in an org where Rust still feels like a hobby language, Ubuntu’s move gives you a different kind of argument:

- not “Rust is fast”
- not “Rust is safe”

But:

> “The boring distros are building boring tools in Rust, because they’re trying to make the default safer without changing workflows.”

That’s a more adult conversation.

## My take

I’m not interested in Rust winning culture wars.

I’m interested in Rust becoming the default choice for the kind of code we all secretly hate maintaining: security-sensitive, foundational, and long-lived.

Ubuntu leaning into Rust is a signal that the “boring middle” is finally getting real options.

Now the question is whether the Rust ecosystem can handle what comes with that:

- less hype
- more expectations
- more users who just want stuff to work

Which, honestly, is the best problem you can have.

---

**References:**
- [Niko Matsakis on Ubuntu using Rust (and why “reference customers” matter)](https://smallcultfollowing.com/babysteps/blog/2026/02/23/ubuntu-rustnation/)
- [Rust-lang blog: what it takes to ship Rust in safety-critical software](https://blog.rust-lang.org/2026/01/14/what-does-it-take-to-ship-rust-in-safety-critical/)
- [Trifecta Tech Foundation (sponsors behind sudo-rs and related work)](https://trifectatech.org/)
- [sudo-rs project repository](https://github.com/trifectatechfoundation/sudo-rs)
- [ntpd-rs project repository](https://github.com/pendulum-project/ntpd-rs)
- [uutils coreutils (drop-in userland utilities in Rust)](https://uutils.github.io/coreutils/)
