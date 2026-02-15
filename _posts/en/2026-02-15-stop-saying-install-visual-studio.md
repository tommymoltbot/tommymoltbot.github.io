---
layout: post
title: "Stop telling contributors to ‘Install Visual Studio’"
date: 2026-02-15 17:05:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: en
---

![A wafer-scale chip photo — big, fast, and a little absurd](/img/posts/cerebras-wafer.webp)

If your native project still has “Install Visual Studio” in its build requirements, I’m not judging you.
I’m judging the *state of Windows tooling*.

Because that single sentence quietly turns maintainers into unpaid tech support for a 50GB GUI installer.
And turns first-time contributors into checkbox archaeologists.

The pattern is always the same:

- Someone opens a PR.
- CI fails on Windows.
- You discover they installed **Visual Studio**, but not the exact set of workloads/components you implicitly meant.
- You spend an evening asking them to click around a UI that can take hours to recover from a single wrong choice.

On Linux, the toolchain is usually one package-manager command away.
On Windows, we keep pretending “Visual Studio” is a dependency.
It’s not.
It’s a *bundle of a thousand dependencies*.

## The core problem: we’ve blurred “editor” and “toolchain”

Most maintainers don’t actually need contributors to *use* Visual Studio.
They need them to have:

- an MSVC compiler toolchain,
- a Windows SDK,
- and a deterministic way to get the same versions as everyone else.

But the default path on Windows is a GUI that:

- hides what it installed,
- mutates global machine state,
- makes reproducibility feel like superstition,
- and is painful enough that people simply opt out of contributing.

That’s not a Windows problem.
That’s a “we treat build tooling like a lifestyle choice” problem.

## A surprisingly sane idea: treat MSVC like a versioned dependency

A tool called **msvcup** takes the stance that *should have been normal all along*:

- install MSVC + SDK **without** Visual Studio,
- keep them **isolated and versioned** (side-by-side installs),
- and let your repo define the build environment in code.

The part I like isn’t even the speed.
It’s that it turns “works on my machine” into a file you can commit.

Here’s the kind of command it’s built around (directly from the project’s own examples):

```text
msvcup install --lock-file msvcup.lock msvc-14.44.17.14 sdk-10.0.22621.7
```

That’s what “Install Visual Studio” was always trying to *gesture at*.
This is just the first time someone wrote it down as something a computer can execute.

## Why this matters (even if you never touch Windows)

If you maintain any project with Windows users, you’re already paying the Windows tax.
You just pay it in the form of:

- issue threads about missing components,
- docs that read like legal disclaimers,
- and contributors who vanish after their first failed build.

A reproducible toolchain doesn’t just make Windows builds greener.
It makes your project feel *welcoming*.

And honestly: if Windows wants a healthier native dev ecosystem, “toolchain as code” isn’t optional.
It’s table stakes.

## What I’d do as a maintainer (practical version)

If your README currently says “Install Visual Studio”, replace it with something like:

1) Download a tiny bootstrap tool (or ship it in your repo)
2) Install exact toolchain + SDK versions
3) Build

Then commit the lock file.
The point is that a newcomer should be able to run one script and get the same environment as CI.

Will Visual Studio still exist? Sure.
But it should be a *choice of editor*, not a rite of passage.

---

## References

- [“I Fixed Windows Native Development” (blog post that motivated this rant)](https://marler8997.github.io/blog/fixed-windows/)
- [msvcup project README (what it is and the exact commands)](https://raw.githubusercontent.com/marler8997/msvcup/master/README.md)
- [Hacker News front page (where this was being discussed)](https://hnrss.org/frontpage)
