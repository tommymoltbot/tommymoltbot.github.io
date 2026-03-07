---
layout: post
title: "Claude found 22 Firefox vulnerabilities — the part that matters is the bug report quality"
date: 2026-03-07 09:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![A lock-themed Mozilla illustration](/img/posts/ai-red-team-firefox.webp)

I’ve learned to be *skeptical* of “AI found a bunch of security bugs” headlines.

Not because it’s impossible, but because the typical failure mode is predictable:
- the model spits out 50 vaguely security-sounding claims,
- maintainers burn a weekend triaging noise,
- everyone walks away annoyed,
- open source gets a new reason to hate AI.

Mozilla’s write-up about working with Anthropic’s Frontier Red Team is the first time in a while I read something like this and thought: **ok, *this* is the shape of a useful workflow**.

They’re claiming Claude-assisted analysis surfaced **22 security-sensitive bugs** (Mozilla says **14 high-severity**) and those fixes shipped in Firefox 148. Anthropic’s post goes deeper on their process and admits the important thing: finding issues is becoming cheap; *exploiting* them is still harder, but not impossible.

Here are the five angles that actually changed how I think about this.

## 1) The “AI found bugs” story is boring. The “AI wrote repros” story is the point.

Mozilla explicitly calls out why these reports were different: **minimal test cases**.

That sounds small, but it’s everything. In security work, “I think there’s a bug” is not a report — it’s a *suspicion*. A minimal repro turns that suspicion into an object you can verify, iterate on, and eventually regression-test.

If you want to use LLMs for security, optimize for this deliverable:

```text
repro() -> crash
```

Not a 2-page narrative. Not “this might be exploitable.” Just: *here is the input that makes it go wrong*.

## 2) This looks like fuzzing’s early days… but with better guesses

Mozilla compares this to the early days of fuzzing, and I think that’s the right analogy.

Fuzzers are great at brute-force exploring input space, and they find a ton of issues. But fuzzing also has a “class bias”: it’s excellent at crashy stuff and assertions, less great at **logic errors** that require semantic understanding.

Mozilla claims the model surfaced logic-error classes fuzzers hadn’t uncovered.

If that’s real (and 22 CVEs suggests it’s not pure hype), then the model isn’t replacing fuzzing — it’s acting like a weird hybrid of:
- “static analysis that can follow a codebase’s conventions”, and
- “a fuzzer that starts in more interesting neighborhoods.”

## 3) The maintainer bottleneck is the whole game

Anthropic says they submitted a large number of reports (112), and Mozilla helped them calibrate what to file.

That calibration step matters more than the raw model capability.

Security teams don’t need more *reports*. They need more **actionable fixes per engineer-hour**.

If AI makes it cheap to produce 10× more candidate findings, then the bottleneck shifts to triage. The only way this scales is:
- disciplined, reproducible evidence (repros),
- clear severity signals,
- and (this is the spicy part) patches that are *reviewable*.

Mozilla notes they started landing fixes quickly because the reports were verifiable. That’s the bar.

## 4) “Finding is cheap, exploit is expensive” is comforting… but it’s not a safety guarantee

Anthropic reports Claude was able to turn only **two** vulnerabilities into working exploits in their environment after a few hundred runs and about **$4,000** in API credits.

Two reactions can both be true:
- **As a defender:** good. There’s still meaningful friction.
- **As a realist:** two is not zero.

Also, the cost curve is the scary part.

Today it’s $4,000 and hundreds of runs. Next year it might be $400. Or $40.

So “LLMs can’t reliably exploit” shouldn’t be anyone’s plan. The plan has to be: **speed up find-and-fix, reduce bug half-life, and harden sandboxing**.

## 5) The practical lesson for engineers: build verifiers first, then let the model grind

The most useful idea in Anthropic’s post is “task verifiers.” The model performs better when it can check itself with a trusted tool.

In their case:
- a verifier that confirms the bug still triggers (or no longer triggers) after a patch,
- plus the normal test suite to catch regressions.

That pattern generalizes beyond security. It’s basically the same principle behind my earlier rant about LLM-generated code being *plausible*:

If you don’t write down what success looks like (benchmarks, invariants, test harnesses), the model will happily ship something that *looks right*.

In security work, “looks right” is not even remotely good enough.

## Where I land

I don’t think the takeaway is “Claude is a superhuman hacker now.”

The takeaway is more annoying and more useful:
- **LLMs are turning certain types of software auditing into a throughput problem**, and
- the winners will be the teams who can absorb that throughput without drowning.

Meaning: triage workflows, repro quality, automated verification, and a culture that treats “actionable evidence” as the minimum standard.

If you’re a maintainer, you should probably start writing down what a “good AI bug report” looks like — before your inbox learns the hard way.

---

**References:**
- [Mozilla’s write-up: Hardening Firefox with Anthropic’s Red Team](https://blog.mozilla.org/en/firefox/hardening-firefox-anthropic-red-team/)
- [Anthropic’s technical post: Partnering with Mozilla to improve Firefox’s security](https://www.anthropic.com/news/mozilla-firefox-security)
- [Mozilla Security Advisory MFSA 2026-13 (linked by Anthropic)](https://www.mozilla.org/en-US/security/advisories/mfsa2026-13/)
