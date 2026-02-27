---
layout: post
title: "JavaScript Streams Are Powerful, but the API Feels Like a Trap (Cloudflare Wants a Reset)"
date: 2026-02-27 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A minimal stream pipeline with arrows and buffer blocks](/img/posts/2026-02-27-better-streams-api.webp)

I have a love–hate relationship with Web Streams.

I love them because **streaming is the only honest way** to handle modern workloads: large responses, incremental parsing, backpressure, and “don’t blow up memory” as an actual design requirement.

I hate them because the *API surface* feels like something you can use correctly… right up until the day you can’t.

Cloudflare just published a long post arguing the same thing: the Web Streams API isn’t merely “a bit verbose.” It’s carrying design scars from an era *before* JavaScript had async iteration, and those scars show up as real ergonomics + performance problems.

## The thing that annoys me isn’t complexity — it’s *ceremony*

Most of the time, developers just want to read a stream to completion. Historically the “official” shape looked like:

```text
stream.getReader() -> reader
reader.read()      -> Promise<{ value, done }>
reader.releaseLock() -> void
```

The first time you see it, it’s fine. The 50th time, it starts to feel like you’re doing manual transmission in traffic.

Yes, you can use `for await...of` these days. But it’s a retrofit on top of a model that still fundamentally thinks in terms of locks, readers, controllers, and a bunch of state machines.

When it works, you don’t notice.

When it doesn’t, you’re suddenly debugging:

- “why is this stream locked?”
- “who locked it?”
- “why did piping make it unusable here?”
- “why did this cancellation not propagate the way I expected?”

The error message is usually correct and still unhelpful.

## Locks are reasonable. Manual locks are not.

The *idea* of locks is sensible: you don’t want two consumers racing each other on reads.

But the current model makes it way too easy to do something that looks harmless and ends up breaking everything. The classic footgun Cloudflare points out is: acquire a reader, read a chunk, forget to release the lock, and now the rest of your pipeline is dead.

That’s the kind of bug that survives code review because it’s not “wrong code.” It’s just missing one line in one path.

If you’ve ever shipped a production system, you know what happens next: a tiny edge case triggers it, and now you’re paging someone at 3am over a locked stream.

## BYOB is a perfect example of “we built the hard thing, and nobody uses it”

Web Streams has this whole BYOB (“bring your own buffer”) concept to reduce allocations.

On paper? Great.

In practice?

- the API is complicated
- buffer detachment semantics are confusing
- it doesn’t fit nicely with the “just iterate” mental model
- most userland streams won’t correctly implement both default + BYOB paths

So it becomes the worst kind of feature: it makes the platform heavier, makes custom implementations harder, and still doesn’t become mainstream usage.

Cloudflare’s take (which matches my experience) is basically: **we paid for the complexity, but we didn’t get the payoff.**

## The uncomfortable part: Streams are now “foundational,” so the mistakes matter

This would be a niche bikeshed if streams were only an advanced library.

But streams are now sitting under:

- `fetch()` bodies
- runtime APIs across browsers and servers
- platform primitives like `TransformStream`

When a foundational primitive is weird, it doesn’t stay contained. It leaks into every ecosystem tool that wraps it.

And then you get the modern JS situation where:

- the easy path is okay
- the medium path is confusing
- the hard path is so gnarly people re-invent their own abstractions

That’s how fragmentation happens.

## What Cloudflare is really proposing: make async iterables the center of gravity

The part I liked most in the Cloudflare article is the framing:

> The Web Streams spec was designed before async iteration existed.

If you accept that, a lot of the API suddenly feels “historically contingent.” Not inevitable.

Async iterables are already the idiomatic JS way to represent “a sequence over time.” So the argument is:

- stop forcing users to care about locks/readers as a primary interface
- use language primitives that already express the idea cleanly
- then build the implementation details underneath in a way that’s actually fast

They claim pretty wild benchmark numbers (2× to 120× faster depending on runtime + scenario). I’m always suspicious of benchmark marketing, but the more credible part is *why* they think it happens:

- fewer layers of abstraction
- less bookkeeping
- less “spec compliance machinery” exposed to userland

Even if the real number is “only” 1.5× in the cases I care about, that’s still meaningful at scale.

## My take: this is less about streams and more about how JavaScript evolves

This is what I find interesting:

- specs get written around the language we have
- then the language grows new primitives
- then we’re stuck with the old spec that can’t fully benefit from the new primitives

Streams are just a very visible instance of that pattern.

It also raises a pragmatic question: how do we migrate foundational APIs without breaking the world?

A clean-room redesign is nice in theory. In practice, the web platform moves like a glacier — unless there’s a compelling story like “this is dramatically simpler *and* faster, and we can interop with existing streams.”

If Cloudflare can demonstrate an approach that:

```text
ReadableStream <-> AsyncIterable   (interop that doesn’t feel cursed)
```

…then I can see the ecosystem slowly shifting.

Because at the end of the day, developers don’t wake up wanting a new standard.

They wake up wanting the same thing we always want:

- fewer footguns
- better error behavior
- APIs that match how we actually write JS in 2026

If “better streams” means I stop thinking about locks and start thinking about data flow again, I’m listening.

---

**References:**
- [Cloudflare’s argument for a redesigned Web Streams API](https://blog.cloudflare.com/a-better-web-streams-api/)
- [The WHATWG Streams Standard (specification)](https://streams.spec.whatwg.org/)
- [MDN: for await...of (async iteration syntax)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
