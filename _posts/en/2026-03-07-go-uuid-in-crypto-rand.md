---
layout: post
title: "Go’s stdlib UUID proposal: generation-only (UUIDv4/UUIDv7) in crypto/rand is the most Go-ish outcome"
date: 2026-03-07 10:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Go UUID proposal discussion on GitHub](/img/posts/2026-03-07-go-uuidv7-crypto-rand-01.webp)

Go has been having the same UUID conversation for years: “Why do I still have to import a third-party UUID package?”

This week I stumbled back into it via a proposal that tried to add a full `crypto/uuid` package (generation + parsing), then got redirected into a narrower idea: **add UUID generation helpers to `crypto/rand`**.

And honestly… if Go ever adds UUID support to the standard library, **this is the only shape that won’t turn into a forever-API debate**.

## The important nuance: “stdlib support” doesn’t mean “a full UUID type”

The scoped proposal is basically:

```text
crypto/rand.UUIDv4() -> string
crypto/rand.UUIDv7() -> string
```

That’s it.

No `UUID` struct, no parse, no marshaling story, no “is this big-endian or little-endian in the binary fields”, no “should we support v1/v3/v5/v6 too”.

Just a standard way to get a **predictable-length unique string** with a well-known format.

If you need anything more than that, you can keep using a battle-tested library like [google/uuid (the de-facto Go UUID package on pkg.go.dev)](https://pkg.go.dev/github.com/google/uuid).

## Why “generation-only” actually matches the RFC advice

The newer UUID RFC (RFC 9562) leans pretty hard on this idea:

- treat UUIDs as **opaque identifiers**
- avoid parsing unless you *really* need to

This is a subtle but important shift.

A lot of teams adopt UUIDv7 and then immediately start relying on “the timestamp is in there, so I can sort / shard / debug by it”. That’s when you get accidental coupling: the moment you depend on introspection, you’ve turned an identifier into a semi-API.

So the Go proposal’s stance (“we only generate, we don’t promise introspection”) is basically saying:

> You want stable UUID strings, not a new taxonomy to bikeshed for the next decade.

Very Go.

## UUIDv4 vs UUIDv7: if you’re touching code anyway, why not v7?

One of the most interesting parts of the thread wasn’t “should Go have UUIDs”, it was:

- UUIDv4 is everywhere (pure random)
- UUIDv7 is increasingly the default for systems that care about **index locality** and **sorting by creation time**

If you’re migrating call sites from a third-party package to stdlib helpers, you’re already editing code. At that point, adopting UUIDv7 is tempting.

But I get why the proposal included both:

- v4 is the safe “no behavior expectations” choice
- v7 introduces time clustering, and then people start expecting monotonicity (which is a trap)

Go maintainers being conservative here is predictable.

## The part I actually like: it avoids promising a UUID “ecosystem”

The Go standard library has an aggressive compatibility promise. Once you ship a `uuid.UUID` type, you’re signing up for:

- string formatting decisions
- binary representation decisions
- JSON/text marshaling decisions
- parse strictness / permissiveness
- and yes, “why not include v1/v3/v5” forever

By returning a string from `crypto/rand`, the proposal dodges most of that.

It’s not glamorous, but it’s the kind of boring API that tends to survive.

## My take (as a working engineer)

If this ever lands, I’ll use it.

Not because I’m allergic to `github.com/google/uuid` (it’s fine), but because **UUIDs are like timestamps**: when the language gives you a default, you stop arguing about it in every repo.

The one thing I hope they keep repeating in docs is the “opaque” idea. UUIDv7 is useful, but the second we normalize “just parse the timestamp out”, we’re back to everyone inventing their own half-standard.

---

**References:**
- [Go issue: proposal to add UUIDv4/UUIDv7 helpers in crypto/rand (GitHub)](https://github.com/golang/go/issues/76319)
- [Earlier proposal: add crypto/uuid package for generating/parsing UUIDs (GitHub)](https://github.com/golang/go/issues/62026)
- [RFC 9562: UUIDs and the “opacity” recommendation](https://www.rfc-editor.org/rfc/rfc9562.html)
