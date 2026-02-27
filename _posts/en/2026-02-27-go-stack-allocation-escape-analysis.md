---
layout: post
title: "Go’s New Stack Allocations Are a GC Feature, Not a Micro-Optimization"
date: 2026-02-27 19:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![The Go gopher logo](/img/posts/2026-02-27-go-stack-allocation-escape-analysis-01.webp)

Heap allocations are one of those things that people *say* they care about… until the profiler shows **half your latency is “just allocating stuff”** and then everyone suddenly becomes a memory nerd.

Go’s latest compiler work on *stack allocating slice backing arrays* is interesting because it’s not framed as “hey, here’s a clever trick.” It’s closer to:

- heap allocs are expensive
- GC overhead is real (even with modern improvements)
- we can make a big class of programs cheaper *without asking developers to micro-optimize everything*

That’s the kind of language/runtime investment I’ll happily take.

## 1) The boring truth: small slices are disproportionately expensive

The classic pattern:

```text
var xs []T
for item := range ch {
  xs = append(xs, item)
}
```

If `xs` grows from 0 → 1 → 2 → 4 → 8…, you pay a bunch of allocator + copying overhead in the “startup” phase.

And here’s the part people forget: **a lot of real programs live in the small range.** The slice never becomes “big enough” to amortize the growth strategy. So your code spends time:

- allocating tiny backing arrays
- copying tiny backing arrays
- turning those arrays into GC work

Not a glamorous bottleneck. Just an annoying one.

## 2) Escape analysis is the actual boss fight

The reason “preallocate capacity” sometimes gives you *zero* heap allocations is: the compiler can put the backing array on the stack **if it doesn’t escape**.

This line is the whole game:

```text
make([]T, 0, N)
```

If `N` is a constant and the slice doesn’t leak outside of the function (or into something that forces escape), the compiler can often do stack allocation.

But the moment you do this:

```text
make([]T, 0, lengthGuess)
```

…historically you were back on the heap, because the compiler can’t build a dynamically-sized stack frame.

So yes, it’s “just a slice.” But operationally it’s a question of **lifetime and visibility**, not syntax.

## 3) Go 1.25: speculative stack buffers for variable-size makes

The Go 1.25 idea is basically: for certain patterns, allocate a *small* buffer on the stack (currently described as ~32 bytes) and use it when the requested size is small enough.

That’s a pragmatic compromise:

- if your guess is small and correct → you get zero heap allocations
- if your guess is large → it falls back to heap as usual

What I like is the direction: we’re no longer forcing the developer to write the ugly “if guess <= 10 then cap=10 else cap=guess” branching just to coax the compiler.

## 4) Go 1.26: `append` gets smarter (and escaping slices get a clean “move to heap”)

Go 1.26 extends the same idea to `append` growth itself.

Meaning: even if you didn’t preallocate, the first growth can start with a small stack buffer, avoiding the 1/2/4 heap churn.

And the more subtle bit: even when the slice escapes (like you return it), the compiler can still use stack buffers for intermediate growth and then do a single final move.

Conceptually it becomes:

```text
tasks = runtime.move2heap(tasks)
```

If it’s already on heap, it’s a no-op. If it’s on stack, it allocates the final backing store on heap, copies once, returns safely.

That’s not “clever.” That’s just good engineering: keep the fast path fast, keep the semantics correct.

## 5) What this changes for me (practically)

- I’m still going to preallocate when I have a good estimate. It’s readable, and it often helps.
- But I’m less worried about the “tiny slice growth tax” in hot loops — *if* we’re on modern Go.
- The real lesson is still escape analysis. If you’re writing performance-sensitive code and you don’t understand why something escapes, you’re basically debugging blind.

If you want to validate what’s happening, you can still inspect and experiment with compiler flags:

```text
-gcflags=all=-d=variablemakehash=n
```

(I wouldn’t ship with random flags, but it’s useful for isolating whether a compiler optimization is the thing you’re seeing.)

This is one of those cases where “upgrade your toolchain” is actually a meaningful performance strategy, not marketing.

---

**References:**
- [Go blog post: stack-allocating slice backing arrays and reducing heap allocations](https://go.dev/blog/allocation-optimizations)
- [Go GC guide: escape analysis and why values end up on the heap](https://go.dev/doc/gc-guide#Escape_analysis)
- [Go blog post: Green Tea GC improvements (context on why allocations still matter)](https://go.dev/blog/greenteagc)
