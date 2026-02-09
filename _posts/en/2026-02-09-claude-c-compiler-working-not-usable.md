---
layout: post
title: "Claude's C Compiler: Working, but Not Usable"
date: 2026-02-09 12:00:00 +0000
categories: [AI, Engineering]
tags: [AI, Engineering]
author: Tommy
lang: en
image: /img/posts/claude-c-compiler-working-not-usable.webp
---

Anthropic dropped something interesting this week: a C compiler built entirely by Claude Opus 4.6. They called it CCC (Claude's C Compiler), claimed it could compile the Linux kernel, and published a blog post about how 100% of the code was AI-generated. A human only guided the process by writing test cases.

Then someone actually benchmarked it against GCC.

[Harsha's deep-dive analysis](https://harshanu.space/en/tech/ccc-vs-gcc/) is one of those rare posts where you can see exactly how far AI has come—and where it still falls apart. The short version: CCC compiles code correctly, but the output is so slow it's basically unusable. SQLite compiled with CCC runs 737x to 158,000x slower than GCC-compiled SQLite. Not 2x. Not 10x. **Thousands of times slower.**

Let me walk through why this matters, what it says about AI-generated software, and why this is the perfect case study for the "it works vs. it's usable" divide.

---

## What CCC Actually Did

First, the impressive part: CCC is a **fully functional C compiler** written entirely in Rust by Claude. It has:
- A preprocessor, parser, and type checker
- An SSA-based intermediate representation (IR)
- 15 optimization passes
- Code generators for x86-64, i686, AArch64, and RISC-V 64
- An assembler, linker, and DWARF debug info generator

It successfully compiled **2,844 C files** from the Linux 6.9 kernel with **zero compiler errors**. That is genuinely impressive. Most compilers written by humans take years to get to this level of compatibility.

But here's the catch: the build **failed at the linker stage** with 40,784 undefined reference errors. CCC generated incorrect relocation entries for kernel data structures like `__jump_table` and `__ksymtab`, which the kernel's linker script couldn't resolve.

So when Anthropic said "CCC can compile the Linux kernel," they weren't lying. But they also weren't telling the whole story. CCC completed the **compilation phase** (`.c` to `.o`), but the **linking phase** exploded. The final binary never got produced.

---

## SQLite: Correct but Catastrophically Slow

The real test was SQLite. It's a single-file amalgamation of well-written, standard C code—ideal for compiler testing. CCC compiled it successfully, and the resulting binary **produced correct results**. All queries returned the expected data. Zero crashes. Zero segfaults.

But the performance was a disaster.

Here's the benchmark summary:

| Metric | GCC -O0 | GCC -O2 | CCC |
|--------|---------|---------|-----|
| **Compile time** | 64.6s | 7m23s | 1m27s |
| **Binary size** | 1.55 MB | 1.40 MB | 4.27 MB |
| **Runtime (42 SQL queries)** | 10.3s | 6.1s | **2h 06m** |
| **Slowdown vs GCC -O0** | 1x | 0.6x | **737x** |
| **Slowdown vs GCC -O2** | 1.6x | 1x | **1,242x** |

CCC-compiled SQLite took **2 hours** to finish a benchmark that GCC-compiled SQLite finished in **10 seconds**.

The worst query—a `NOT IN` subquery—was **158,129x slower**. Seven thousand seconds for a query that GCC finished in 0.047 seconds.

---

## Why Is CCC So Slow? Register Spilling Hell

The root cause is **register spilling**. Modern CPUs have a small set of fast storage locations called registers. A good compiler tries to keep frequently used variables in these registers. When there are more variables than registers, the compiler "spills" them to the stack (RAM), which is much slower.

CCC's register allocation is terrible. It uses a single register (`%rax`) as a shuttle to move values between stack locations. Every operation becomes:

```text
movq -0x1580(%rbp), %rax   ; load from stack offset
movq %rax, -0x2ae8(%rbp)   ; store to another stack offset
movq -0x1588(%rbp), %rax   ; load next value
movq %rax, -0x2af0(%rbp)   ; store to next offset
```

Compare this to GCC:

```text
movl -8(%rbp), %eax        ; load loop counter
cmpl -36(%rbp), %eax       ; compare against n
jl .L6                     ; branch
movl (%rax), %edx          ; load a[i] directly
cmpl %eax, %edx            ; compare in registers
```

GCC uses registers efficiently. CCC shuffles everything through memory. For a function with 32 local variables, CCC generates **4.2x more instructions** than GCC -O0. For SQLite's `sqlite3VdbeExec` function (100+ variables, 200+ switch cases), this ratio compounds to **100x+ slowdown**.

The subquery benchmark amplifies this. The `NOT IN (subquery)` pattern forces SQLite to execute a nested loop: for each of 100,000 outer rows, it scans 10,000 inner rows. That's roughly **1 billion iterations** through the execution function. Each iteration is 4x slower due to register spilling, plus extra cache misses from the 2.78x larger binary. The slowdown compounds: **158,000x total**.

---

## The -O2 Flag Does Nothing

Here's the kicker: CCC's **optimization flags are decorative**. Passing `-O0`, `-O2`, or `-O3` produces **byte-identical binaries**. CCC has 15 SSA optimization passes, but they all run at every optimization level. There is no tiered optimization.

When Anthropic's blog post said CCC was "5x faster" than GCC, they were comparing CCC (no optimization) to GCC -O2 (7 minutes of optimization work). The fair comparison is CCC vs GCC -O0, where CCC is actually **25% slower**.

This is not a compiler that optimizes. It's a compiler that translates C to assembly and stops there.

---

## The "Hello World" That Couldn't

Within hours of the CCC release, [GitHub issue #1](https://github.com/anthropics/claudes-c-compiler/issues/1) appeared: "Hello world does not compile." The example straight from the README didn't work on a fresh Fedora or Ubuntu install:

```text
$ ./target/release/ccc -o hello hello.c
/usr/include/stdio.h:34:10: error: stddef.h: No such file or directory
/usr/include/stdio.h:37:10: error: stdarg.h: No such file or directory
ccc: error: 2 preprocessor error(s) in hello.c
```

GCC compiled it fine. The issue: CCC's preprocessor didn't search the right system include paths for `stddef.h` and `stdarg.h` (these come from the compiler, not the C library).

The issue got **288 thumbs-up**, over 200 comments, and turned into one of those legendary GitHub threads where people tag @claude asking it to fix the bug. Someone remarked that the assembly output "reminds me of the quality of an undergraduate's compiler assignment."

The issue is still open.

---

## What This Tells Us About AI and Software Engineering

CCC is a **working compiler**. It parses C correctly, generates valid assembly, and produces functionally correct binaries. That is a remarkable achievement for an AI-generated codebase.

But it's not a **usable compiler**. The output is too slow for real work. The optimization pipeline doesn't exist. The linker can't handle production codebases like the Linux kernel.

This is the classic **"it works" vs. "it's usable"** divide. AI is great at getting to "it works." Building a prototype, passing test cases, demonstrating functionality—Claude nailed all of that.

But going from "it works" to "it's production-ready" requires:
- Performance tuning (register allocation, instruction selection, loop optimization)
- Edge case handling (linker scripts, relocation types, symbol table generation)
- Debugging infrastructure (proper frame pointers, DWARF info, symbol tables)
- Tiered optimization (understanding the tradeoffs between compile speed and runtime speed)

These are the **hard parts of engineering**. And right now, AI-generated code doesn't get there on its own.

---

## The PR Game

Let's be clear: Anthropic didn't lie. CCC **did** compile the Linux kernel. Technically.

But the blog post's framing—"Claude built a C compiler that can compile the Linux kernel"—is optimized for impact, not clarity. The average reader walks away thinking, "Wow, Claude can build production compilers now."

The reality: Claude built a **proof-of-concept compiler** that handles the parsing and code generation phases but fails at linking and produces code that's hundreds to thousands of times slower than GCC.

This is not unique to Anthropic. Every AI company does this. The demo looks amazing. The fine print tells a different story.

I don't blame them—they're selling a product. But as engineers, we need to read past the headline.

---

## Does This Mean AI Can't Build Compilers?

No. It means **AI can build working compilers, but not optimized ones**—yet.

The gap isn't in understanding C syntax or generating assembly. The gap is in the **engineering intuition** needed for performance optimization. Knowing when to inline a function, how to allocate registers, where to place branch predictions, how to minimize cache misses—these are learned through experience, not just pattern matching.

Maybe future models will get there. Maybe they'll learn to balance compile-time cost vs. runtime speed. Maybe they'll figure out register allocation heuristics that rival GCC's decades of tuning.

But right now, CCC shows us where the ceiling is: **functional correctness, yes. Production performance, not yet.**

---

## Should You Care?

If you're writing production software, no—you're not switching to CCC.

But if you're thinking about what AI can and can't do in software engineering, this is a perfect test case. CCC proves that AI can handle the **mechanical parts** of building a compiler. It can translate rules into code, parse syntax, generate assembly.

What it can't do—yet—is the **messy, intuitive work** of making that code fast, debuggable, and production-ready.

And that's where human engineers still matter.

---

## References

- [Anthropic's blog post on CCC](https://www.anthropic.com/engineering/building-c-compiler)
- [Harsha's detailed benchmark analysis](https://harshanu.space/en/tech/ccc-vs-gcc/)
- [CCC source code on GitHub](https://github.com/anthropics/claudes-c-compiler)
- [GitHub issue #1: Hello world does not compile](https://github.com/anthropics/claudes-c-compiler/issues/1)
- [Hacker News discussion](https://news.ycombinator.com/item?id=46941603)
