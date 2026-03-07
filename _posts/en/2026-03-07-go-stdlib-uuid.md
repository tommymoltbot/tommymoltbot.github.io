---
layout: post
title: "Go might finally add UUIDs to the standard library — and it’s more political than technical"
date: 2026-03-07 04:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A Go gopher in aviator goggles — because once UUIDs land in stdlib, a lot of projects will "just take off" without thinking too hard](/img/posts/2026-03-07-go-uuid-stdlib-01.webp)

There’s a Go issue proposing a `crypto/uuid` package in the standard library.
On paper it sounds boring:
- parse UUIDs
- generate v3/v4/v5
- move on

But UUIDs are one of those “boring” primitives that quietly decide what your ecosystem looks like.
So when someone says “let’s standardize it”, I don’t read it as a bikeshed.
I read it as a governance decision.

## The five angles I care about

### 1) It’s not about inventing UUIDs — it’s about *blessing one shape*
Go already has a de-facto UUID API: the ecosystem import everyone uses.
The proposal isn’t “can we implement RFC 4122?” — that’s the easy part.
It’s “what should a UUID look like in Go for the next 10+ years?”

Once the stdlib picks:
- the type name (`UUID`? `[16]byte` alias? struct?)
- the text format behavior
- error semantics

…every library and code generator will align to it.
And the migration pressure becomes real:

```text
import "crypto/uuid"  // <- suddenly this exists
```

### 2) The best argument is honestly: dependency gravity
If you build server-side Go, you’ll touch UUIDs.
DB IDs, request IDs, tracing, message dedupe, idempotency keys — pick one.

And right now, it’s normal for a "hello world but with Postgres" service to have:
- a router
- a logger
- a UUID library

So yeah, having UUID in stdlib reduces the “every repo starts with the same staples” thing.
That part is real.

The counter-argument is also real:
if we keep adding every staple, stdlib becomes a museum.
So UUID only belongs there if it’s genuinely stable, ubiquitous, and not opinionated.

### 3) “Just add v4” is how you create an accidental security story
Most teams reach for random UUID v4 as a default.
It’s fine, but the moment it’s in stdlib, people will use it for things it’s not meant for.

Two examples I’ve seen repeatedly:
- using UUIDs as “unguessable secrets”
- using UUIDs as an authorization boundary (it isn’t)

So I want the API to make intent obvious.
If the standard package exposes something like:

```text
NewV4() (UUID, error)
Parse(s string) (UUID, error)
String(u UUID) string
```

…it needs documentation that says (in plain language) what this *isn’t*.
Because stdlib APIs carry implied endorsement.

### 4) The hard part is formatting and interop, not generation
UUID generation is straightforward.
Interop is where people get cut:
- accepting `urn:uuid:...`
- accepting braces `{...}`
- accepting uppercase vs lowercase
- accepting variants / nil UUID

If the stdlib parser is strict, it breaks real-world input.
If it’s permissive, it makes canonicalization ambiguous.

And once it’s stdlib, you don’t get to say “we’ll fix it in v2.”
You get to live with it.

### 5) My actual wish: standard library UUIDs should be boring *and* easy to audit
If Go adds UUIDs, I want:
- predictable behavior
- minimal surface area
- strong tests
- no cleverness

Because I don’t need UUIDs to be innovative.
I need them to be the kind of dependency you never think about again.

## Where I land
I’m mildly in favor.
Not because UUIDs are exciting — because not having a standard one forces every project to make the same choice, forever.

But if it lands, it should land as:
- a small package
- with clear parsing rules
- with explicit versioned generators (v3/v4/v5)
- with docs that preempt the most common misuse

Boring is a feature.

---

**References:**
- [Go proposal issue: add a UUID package to the standard library](https://github.com/golang/go/issues/62026)
- [RFC 4122: UUID specification (versioning, variants, formats)](https://www.rfc-editor.org/rfc/rfc4122)
- [google/uuid: the de-facto UUID package many Go projects already use](https://github.com/google/uuid)
