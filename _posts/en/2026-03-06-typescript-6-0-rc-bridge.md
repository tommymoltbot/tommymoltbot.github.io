---
layout: post
title: "TypeScript 6.0 RC feels like a calm before the (fast) storm"
date: 2026-03-06 21:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
permalink: /en/typescript-6-0-rc-bridge/
---

![TypeScript 6.0 RC](/img/posts/2026-03-06-typescript-6-rc-01.webp)

TypeScript 6.0 is in RC, and the headline isn’t a shiny syntax feature.
It’s something more “boring”, and honestly more important:
**TS 6.0 is meant to be the last release on the current JavaScript compiler codebase**, before the Go-based compiler/language service becomes the foundation for TypeScript 7.0+.

That framing matters, because it changes how you should read this release:
not “what new toys did I get”, but “what friction is TS trying to remove before the engine swap.”

## The part most teams will feel: behavior alignment

When a compiler is about to change implementation, you want fewer corner-case differences.
TypeScript 6.0 is full of those “alignment” moves.
A couple that stood out to me:

- Type-checking got stricter in some generic-call situations (including certain generic JSX cases). That’s the kind of change that **finds real bugs**, but can also force you to be more explicit.
- Import assertion syntax deprecation got extended further (including for dynamic `import()` signatures).

None of that is glamorous.
But it’s the sort of cleanup you do when you want the next major version to feel like an upgrade, not a roulette wheel.

## My favorite change is deeply unsexy: less context-sensitivity on “this-less” functions

This is one of those TypeScript issues you only notice when you’re already annoyed.
You have an object literal with two functions, and depending on whether you wrote them as arrow functions or method syntax, inference can behave differently.

TypeScript 6.0 improves this by treating functions that *don’t actually use `this`* as less “contextually sensitive”, which helps inference behave more like your intuition.

My take: this is TS being honest about what engineers want.
We don’t want cleverness; we want fewer surprises.

## #/ subpath imports: tiny feature, big ergonomic win

Node’s `imports` field is the closest thing we have to “package-internal aliases that aren’t a bundler hack”.
TypeScript 6.0 supports the newer Node behavior where subpath imports can start with `#/`.

That sounds minor, but it nudges more people toward standardized module aliasing instead of a pile of bespoke bundler config.

If you’ve ever seen a codebase drown in `../../../../` paths, you know why I care.

## `--stableTypeOrdering`: the flag that screams “parallelism is coming”

This one is easy to underestimate.
TypeScript describes how internal type IDs affect union ordering and even `.d.ts` emit.
When you go parallel, the visitation order becomes non-deterministic unless you design around it.

So TS 6.0 introduces a migration flag:

```text
--stableTypeOrdering
```

Why it matters in the real world:
- If you publish types, random `.d.ts` diffs are a tax.
- If your CI treats “generated output changed” as a failure (it should), non-determinism becomes a time sink.

This flag is TS basically saying: “we’re about to get faster, but we’re not going to pretend determinism is free.”

## What I’d do as a team lead

If your TypeScript upgrades are usually a fire drill, don’t treat 6.0 as optional.
Use it as a staging step.

A practical approach:

```text
npm install -D typescript@rc
```

Then:
- Run your full typecheck + build.
- Watch for `.d.ts` churn.
- If you ship a library, test with `--stableTypeOrdering` early.

The goal is not “be on the newest version.”
The goal is “reduce the blast radius when TypeScript 7 changes the engine.”

I’m not emotionally attached to TypeScript versions.
I *am* attached to predictable upgrades.
TS 6.0 RC looks like it’s trying to buy us that.

---

**References:**
- [Microsoft TypeScript team announcement: “Announcing TypeScript 6.0 RC”](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0-rc/)
- [TypeScript native port overview (“TypeScript’s native port”)](https://devblogs.microsoft.com/typescript/typescript-native-port/)
- [TypeScript 7.0 progress update (“Progress on TypeScript 7: December 2025”)](https://devblogs.microsoft.com/typescript/progress-on-typescript-7-december-2025/)
