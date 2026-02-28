---
layout: post
title: "Go is getting surprisingly good at avoiding heap allocations (and your perf profile will look different)"
date: 2026-02-28 03:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A simple diagram comparing stack vs heap costs for Go allocations](/img/posts/2026-02-28-go-stack-allocations-01.webp)

I’ve lost count of how many times I’ve seen someone micro-optimize a Go hot path by preallocating slices.

You know the move:

```go
buf := make([]T, 0, 128)
```

It’s not wrong. It often helps.

But what’s changing (quietly) is *why* it helps — and in a bunch of cases, the compiler is now doing the “obvious” part for you. That’s good news… and also a reason to re-check some of your old assumptions when you read allocation profiles.

## The real cost isn’t “allocations”, it’s allocator work + GC noise

Heap allocations have two kinds of tax:

1. The allocator path itself (metadata, size classes, etc.)
2. The garbage you create for the GC to later trace and clean up

Even with Go’s GC improvements, the GC is still not free. If your service is latency-sensitive, “I reduced heap churn” is often the most boring, most reliable performance win.

That’s why the Go team has been pushing more work onto the stack.

## Stack-backed slices: the trick is the *backing array*, not the slice header

A Go slice value is small. The expensive part is the backing array it points at.

Classic problem:

```go
var tasks []task
for t := range c {
    tasks = append(tasks, t)
}
```

On the first few appends, you get the typical growth pattern (1, 2, 4, 8…). That means allocator calls *and* a trail of short-lived garbage.

If you have a good capacity guess and you do:

```go
tasks := make([]task, 0, 10)
```

…the compiler may put that backing array on the stack and your allocation count drops to **zero**.

The catch: that only happens when the backing store doesn’t escape.

## What’s new: “speculative” small stack buffers

This is the part that made me pause: newer Go compilers are getting smarter about allocating a small backing store on the stack even when the final size is not a constant.

The Go blog explains a progression:

- Go 1.24: constant-sized makes can be stack-allocated, but variable-sized makes generally go to the heap
- Go 1.25: the compiler can keep a small backing store on the stack for certain `make([]T, 0, n)` patterns when `n` is small
- Go 1.26: the compiler can apply the same idea to `append` growth itself, reducing the “startup phase” heap churn

If you’ve been carrying around a little mental model like “append starts allocating on the heap immediately”, that model is getting outdated.

## The escaping case: returning slices without paying the worst startup cost

The classic “it must heap allocate” example is returning a slice:

```go
func extract(c chan task) []task {
    var tasks []task
    for t := range c {
        tasks = append(tasks, t)
    }
    return tasks
}
```

Yes: the final result must live beyond the stack frame.

But the Go 1.26 idea is: maybe we can still do the early growth on a small stack buffer, and only move to heap once we know we’re returning.

The blog describes this as a compiler+runtime helper that effectively “moves the slice to heap” if it was stack-backed.

That’s exactly the kind of change that makes profiles look weird in a good way:
- fewer tiny allocations early
- one “right-sized” allocation when you end up escaping

## How I’d use this in real code (without getting cute)

A few pragmatic takeaways:

- Still preallocate when you *actually* know the size. It helps readability too.
- But stop treating “0 allocations” as a moral victory by itself. Check *tail latency* and *GC CPU*.
- Re-run your perf tests after upgrading Go. Some old workarounds become redundant, and some “mystery wins” start showing up.

If you need to bisect whether these new optimizations are affecting you, the blog mentions a compiler flag to disable them:

```text
-gcflags=all=-d=variablemakehash=n
```

(And yeah, that flag name is… very Go.)

I’m mostly happy about this direction. It’s the kind of improvement that makes boring services a little faster without anyone rewriting their whole codebase — which is basically my favorite kind of progress.

---

**References:**
- [Go blog: “Allocating on the Stack” (heap vs stack, slices, and compiler optimizations)](https://go.dev/blog/allocation-optimizations)
- [Go blog: “Green Tea” GC improvements (background on why heap churn matters)](https://go.dev/blog/greenteagc)
- [Go documentation: escape analysis and when values move to the heap](https://go.dev/doc/gc-guide#Escape_analysis)
