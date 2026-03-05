---
layout: post
title: "Faster C Without Shipping Two Binaries: Dynamic Feature Detection (AVX2, IFUNC, target_clones)"
date: 2026-03-05 01:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A simple diagram showing CPU feature detection dispatching to a fast AVX2 path or a portable fallback](/img/posts/2026-03-05-dynamic-feature-detection-01.webp)

I’ve lost count of how many times I’ve seen the same argument in performance-sensitive C codebases:

- “We can make this **really** fast with AVX2 / BMI2 / whatever.”
- “Yeah but we need to run on older CPUs too.”

Most teams react by doing one of two things:

1) Compile for the lowest common denominator and live with it.
2) Ship multiple builds and make ops / users pick the right one.

Both options work, but they’re kind of unsatisfying. Option (2) especially feels like admitting your build pipeline is now part of your performance story.

There’s a third option: **ship one binary, and decide at runtime which implementation to use**.

This is the idea behind *dynamic feature detection* and dispatch.

## The real problem: portability vs. “use the silicon you paid for”

On x86-64, there’s a wide gap between “it runs” and “it screams.” A portable build can’t assume optional instruction set extensions, so the compiler keeps its hands tied.

If you’re allowed to target a known fleet, sure, build for a newer baseline (like x86-64-v3) and move on. But if your software is distributed to unknown machines, you need a fallback.

So the question becomes:

> Can I keep a portable baseline **and** still take the fast path on modern CPUs, without asking the user to do anything?

Yes.

## Approach A: Let the compiler do it (target_clones)

If you’re on GCC/Clang with glibc, the “clean” version is to let the compiler produce multiple function variants and have the loader pick one at startup.

In practice, it looks like this:

```text
[[gnu::target_clones("avx2,default")]]
void *my_func(void *data) {
  ...
}
```

What you’re saying is basically:

- build one `my_func()` that assumes AVX2
- build one that’s the default baseline
- generate the dispatch / resolver glue for me

This is appealing because your call sites remain normal. No function pointers leaking everywhere, no manual branching sprinkled across the code.

The catch is: **your platform and libc matter**. You’re leaning on tooling support (and on ELF dynamic linking behaviors) that you don’t automatically get everywhere.

## Approach B: Manual “fast path vs portable” (intrinsics + runtime checks)

Sometimes you need more control.

Maybe you want different algorithms per ISA. Maybe autovectorization won’t trigger. Maybe your “fast path” uses intrinsics and you need strict compilation flags.

The typical pattern is:

- write a portable implementation
- write one or more optimized implementations
- detect CPU features at runtime
- dispatch

On GCC/Clang, you can ask the compiler to compile one function with extra ISA flags:

```text
[[gnu::target("avx2")]]
void *my_func_avx2(void *data) {
  ...
}

void *my_func_portable(void *data) {
  ...
}
```

Then dispatch like this:

```text
void *my_func(void *data) {
  return __builtin_cpu_supports("avx2")
    ? my_func_avx2(data)
    : my_func_portable(data);
}
```

This is more verbose, but I like it because it’s honest. It makes the trade-off visible:

- you have multiple implementations to maintain
- you get predictable speedups when the feature exists
- you still run correctly when it doesn’t

If you really want to avoid the branch on every call, you can do a one-time selection and store a function pointer, or go full IFUNC (below).

## IFUNC: “pick the implementation at load time” (fast, but sharp edges)

IFUNC (indirect functions) lets the dynamic linker resolve a symbol to the best implementation when the program starts.

Conceptually:

```text
static void *(*resolve_my_func(void))(void *) {
  __builtin_cpu_init();
  return __builtin_cpu_supports("avx2") ? my_func_avx2 : my_func_portable;
}

void *my_func(void *data) __attribute__((ifunc("resolve_my_func")));
```

This is *very* cool when it works, because call sites become “free.” You don’t pay a runtime branch per call.

But it’s also the kind of trick where your portability story becomes complicated:

- your libc might not support IFUNC (musl famously doesn’t, at least last I checked)
- debugging can get weird
- tooling / sanitizers can behave differently

So I treat IFUNC like a power tool: great when you know exactly why you need it.

## My take: this is the kind of "boring" performance work that still matters

Dynamic dispatch isn’t trendy. It’s not a new framework. It’s not even new.

But it’s exactly the kind of engineering that lets you:

- respect portability
- still reward people running your code on modern hardware
- keep your deployment story sane

And it’s a reminder that “performance” isn’t just algorithms. Sometimes it’s also:

```text
How do we ship the right machine code to the right CPU?
```

If you’re building C libraries that are latency-sensitive (compression, crypto, parsing, numeric kernels), this is worth having in your toolbox.

---

**References:**
- [Faster C software with Dynamic Feature Detection (original gist)](https://gist.github.com/jjl/d998164191af59a594500687a679b98d)
- [x86-64 microarchitecture levels overview (Wikipedia)](https://en.wikipedia.org/wiki/X86-64#Microarchitecture_levels)
- [GCC documentation: Function Multiversioning / target_clones](https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html)
