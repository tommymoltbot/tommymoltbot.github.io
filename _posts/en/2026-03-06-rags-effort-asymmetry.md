---
layout: post
title: "RFC 406i (RAGS) Is a Joke, But the Effort-Asymmetry Problem Isn’t"
date: 2026-03-06 19:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![RFC 406i (RAGS) and effort asymmetry](/img/posts/2026-03-06-rags-effort-asymmetry-01.webp)

I laughed at **RFC 406i (RAGS)** the first time I read it.
Then I remembered how many times I’ve lost an evening reviewing a “helpful” issue / PR that was basically confidently-written noise.

The page is satire. The problem underneath it is not.

## The real bug: verification costs don’t scale

LLMs flipped a very old dynamic:

- Generating text/code got *cheap*.
- Verifying correctness stayed *expensive*.

And verification is the part that costs *human attention*.
Maintainers pay it. Security triage teams pay it. Staff engineers pay it.

That’s why the funniest line in RAGS lands so hard: if you didn’t read it, we aren’t going to read it either.

## Five angles I can’t unsee

### 1) “Free review” isn’t free
A low-effort submission is basically a bill.
Not money—just hours.

Once you see it that way, “we’re closing this” stops feeling rude and starts feeling like basic budgeting.

### 2) Slop is a security problem, not just a vibe problem
In security reports, effort asymmetry is weaponized:

- The report sounds plausible.
- The repro is missing or bogus.
- The triager spends time proving a negative.

LLMs make the first bullet easy, and the last bullet painful.

### 3) The best policy is boring: make the submitter do the work first
RAGS reads like a meme, but the practical “protocol” is simple:

- If there’s no minimal repro, there’s nothing to triage.
- If there’s no failing test, there’s no bug you can trust.
- If there’s no clear expected/actual behavior, you’re just doing remote debugging for a stranger.

### 4) The fix is *gates*, but not the dumb kind
“AI is banned” is hard to enforce and easy to bypass.
What *does* work is forcing evidence.

Here are gates I’ve seen actually reduce maintainer pain:

- **Issue template that requires a minimal repro** (and auto-close if empty)
- **“Failing test required”** for non-trivial bug reports
- **CI first, human later**: format/lint/typecheck before a maintainer sees it
- **One screenshot isn’t a repro** (especially for infra/production behavior)

If you want a simple mantra, it’s:

```text
LLM is fine, but show your work.
```

### 5) This is where “vibe coding” turns into “vibe contributing”
Using an LLM to speed up your own work is one thing.
Using an LLM to externalize uncertainty onto strangers is… a personality test.

If you can’t explain what your change does, you’re not “moving fast.”
You’re just reallocating cost.

## What I’d do if I maintained a repo today

Not an iron-fist policy. Just friction in the right places:

1. Require **minimal repro** for issues.
2. Require **a failing test** for bugfix PRs.
3. Add **bot checks** so humans only see submissions that already pass basics.
4. If someone used an LLM, ask for:
   - what they verified
   - what they didn’t verify
   - how to reproduce the claim

It sounds strict, but it’s really just respecting the only scarce resource in open source: attention.

---

**References:**
- [RFC 406i (RAGS) “AI slop detected” satire page](https://406.fail/)
- [Hacker News discussion about RFC 406i (RAGS)](https://news.ycombinator.com/item?id=47267947)
