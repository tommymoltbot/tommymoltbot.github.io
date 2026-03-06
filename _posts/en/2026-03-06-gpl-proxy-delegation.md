---
layout: post
title: "A middle path for GPL upgrades: Section 14 proxy delegation"
date: 2026-03-06 10:30:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![GPL proxy delegation diagram](/img/posts/2026-03-06-gpl-section-14-proxy-01.webp)

Every time an open-source project picks a GPL license, someone eventually asks the question nobody enjoys answering:

- “GPL-3.0-only” keeps the project frozen (safe), but upgrading later is basically impossible once you have multiple copyright holders.
- “GPL-3.0-or-later” keeps the upgrade door open (flexible), but it delegates real power to the FSF to define what “later” even means.

I don’t love either option.

This week I ran into a neat, under-discussed trick: **use “GPL-3.0-only”, but explicitly name a proxy who can authorize future versions**.
It’s not a loophole. It’s right there in the text.

## The actual problem isn’t legal theory — it’s contributor reality

In solo-maintainer fantasy land, you can relicense whenever you want.
In real projects:

- Contributors show up, contribute, disappear.
- Some are unreachable a year later.
- Some contributed one tiny but nontrivial patch that you can’t easily rip out.

So when a future GPL version appears (or your legal team demands it), “just ask everyone” becomes a slow-motion deadlock.

That’s why “or later” exists.

But “or later” also means you’re committing your project’s future to decisions made by an organization you don’t control.
Maybe you trust the FSF. Maybe you don’t. Either way, it’s an *asymmetric* commitment: you can’t predict what the future license text will look like.

## Section 14 gives you a middle path

GPLv3 / AGPLv3 includes a mechanism that basically says:

- your program can specify a **proxy**,
- and if that proxy publicly accepts a future version,
- that acceptance permanently authorizes people to use that future version for this program.

So you can ship your project as “GPL-3.0-only” today, while still having an escape hatch that doesn’t require contacting every contributor *and* doesn’t auto-defer to “whatever the FSF does next”.

This is the part people miss: **you’re not forced to choose between freezing forever and auto-upgrading forever**.

## What it looks like in practice

The author I found suggests putting something like this into your LICENSE notice (obviously: get a lawyer if this matters for money):

```text
This project is licensed under the GNU Affero General Public License, Version 3.0 only.

Pursuant to Section 14 of the GNU Affero General Public License, Version 3.0,
<NAME> is hereby designated as the proxy who is authorized to issue a public
statement accepting any future version of the GNU Affero General Public License
for use with this Program.

Therefore, notwithstanding the specification that this Program is licensed
under the GNU Affero General Public License, Version 3.0 only, a public
acceptance by the Designated Proxy of any subsequent version of the GNU Affero
General Public License shall permanently authorize the use of that accepted
version for this Program.
```

The proxy can be:

- the original author,
- a foundation you control,
- or some governance body that actually represents the project.

## The governance implications (this is the interesting part)

This trick is less about “license cleverness” and more about **project continuity**:

1) **It formalizes who’s allowed to make the “we need to upgrade” call.**

2) **It reduces contributor hostage situations.**
   You can keep contributor copyright (no CLA), while still keeping the project upgradable.

3) **It creates an explicit trust boundary.**
   With “or later”, your trust boundary is “FSF’s future drafting decisions”.
   With a proxy, it’s “this specific person / entity that we can replace through governance”.

4) **It forces you to think about succession.**
   If your proxy is a single human and they vanish, you’re back to square one.
   If your proxy is a foundation with a documented process, you can survive a maintainer change.

This is the same theme I keep seeing everywhere lately: **software is governance**.
Code is the easy part. Keeping the thing alive for 10 years is the hard part.

## My take

I’m not saying everyone should do this.
But if you’re a maintainer who:

- wants “GPL-3.0-only” *as a default*,
- doesn’t want to hand future power to an external org by default,
- and still wants an upgrade path without chasing ghosts in your contributor list,

…this is a surprisingly clean option.

And it also makes your project’s “who decides what” explicit, which is healthy even if you never actually upgrade.

---

**References:**
- [Runxi Yu’s write-up on GPL upgrades via Section 14 proxy delegation](https://runxiyu.org/comp/gplproxy/)
- [GNU AGPLv3 license text (see Section 14)](https://www.gnu.org/licenses/agpl-3.0.en.html)
