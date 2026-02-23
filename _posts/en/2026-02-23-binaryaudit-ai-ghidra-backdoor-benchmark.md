---
layout: post
title: "BinaryAudit: Asking AI + Ghidra to Find Backdoors in 40MB Binaries (and Why That’s Not Production-Ready)"
date: 2026-02-23 09:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![BinaryAudit: AI + Ghidra](/img/posts/2026-02-23-binaryaudit-ai-ghidra-backdoor-benchmark.webp)

I like the idea of “AI as a security engineer,” mostly because I’m tired of pretending we all have time to do deep audits.
But binaries are where optimism goes to die.

A project called **BinaryAudit** tried something refreshingly concrete: take real-ish software, inject backdoors, compile into ~40MB stripped executables, then ask AI agents to find the backdoor using reverse‑engineering tools like **Ghidra** and **Radare2**.

What I like about this is that it’s not a vibes benchmark. The output is supposed to be actionable: *“Yes, there’s a backdoor, and it’s in this function (address X)”*.

## Five thoughts I can’t unsee

### 1) “Tool use” is solved. “Judgment” isn’t.
The piece that surprised me: the models can operate the tools.
They can load binaries, run strings, navigate decompiled output, follow xrefs.

But the failure mode is almost human in the worst way: they find something suspicious and then **talk themselves out of it**.

### 2) The most dangerous bug is the one that looks normal
Their example with dnsmasq is painfully relatable.
The model sees something like running:

```text
execl("/bin/sh", "sh", "-c", buf, NULL)
```

…and it rationalizes it as “probably legitimate scripting.”

If you’ve ever reviewed legacy code, you know the trap: you *want* the story to be “this is fine.”
A decent audit mindset is basically the opposite: assume it’s evil until you can prove it’s boring.

### 3) False positives are not an annoyance. They’re a product-killer.
They report false positives roughly a quarter of the time in some setups.
That sounds like “meh,” until you remember the base rate: most binaries are not malicious.

So if your tool cries wolf 1 out of 4 times, it’s not a security tool.
It’s a new source of pager fatigue.

### 4) “Needle in a haystack” beats raw intelligence
A backdoor can be 7 lines.
The binary can have thousands of functions.

What matters is *search strategy*:
- where user input enters
- where network parsing happens
- where command execution primitives exist

Today’s models still waste time in the wrong places, because they don’t have great instincts for “high-risk code paths” in unfamiliar binaries.

### 5) The right mental model: AI is a junior analyst with infinite stamina
Where I land:
- Use AI to **reduce the cost of a first pass**.
- Don’t use AI to make a **go/no-go security decision**.

If you treat it like a tireless junior who can drive tools and surface leads, it’s useful.
If you treat it like an oracle, it will invent confidence you didn’t earn.

## What I’d do with this (if I owned production risk)

1. **Use AI for triage**: find “weird” strings, imports, and code paths.
2. **Force evidence-based conclusions**: every claim needs a trace to input source → sink (e.g., packet → parser → exec).
3. **Make it adversarial**: explicitly ask it to prove the suspicious behavior is reachable and attacker-controlled.

This isn’t glamorous, but it’s how you keep “AI security” from becoming “AI fan fiction.”

---

**References:**
- [BinaryAudit: “We hid backdoors in ~40MB binaries and asked AI + Ghidra to find them” (Quesma blog post)](https://quesma.com/blog/introducing-binaryaudit/)
- [BinaryAudit benchmark results and methodology (Quesma)](https://quesma.com/benchmarks/binaryaudit/)
- [BinaryAudit tasks repository (GitHub: QuesmaOrg/BinaryAudit)](https://github.com/quesmaOrg/BinaryAudit)
