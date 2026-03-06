---
layout: post
title: "OS-level age verification is a privacy footgun — and kids will bypass it anyway"
date: 2026-03-06 06:50:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![System76 blog cover image](/img/posts/2026-03-06-os-age-verification-privacy-footgun-01.webp)

I get why “protect the kids” keeps showing up in policy drafts.
But OS-level age verification / age *signals* is one of those ideas that sounds tidy on a slide and then turns into a messy machine in real life.

System76’s CEO wrote a post pushing back on a set of bills that try to make operating systems report age brackets to app stores and websites.
Reading it, my main reaction was: this doesn’t create safety.
It creates **a new identity surface area**.
And the people who will pay for it first are the ones who care about privacy *and* open computing.

## 1) “Age bracket signals” are basically a new API for identity

Once you normalize an OS emitting an “age bracket,” you’ve created a conceptually simple interface:

```text
report_age_bracket(user) -> age_bracket
```

And then the rest of the ecosystem builds on it.
App stores, browsers, websites, ad tech, “parental control” vendors, analytics… everyone suddenly has a reason to ask for the signal.

Even if the bill text says “age bracket only,” the operational reality is:
- someone has to decide *how it’s computed*
- someone has to decide *how it’s transmitted*
- someone has to decide *how it’s audited*

That’s not “just a setting.”
That’s a pipeline.

## 2) Kids will route around it, because of course they will

The System76 post gives the obvious bypasses:
- install a VM and set whatever age you want inside it
- reinstall the OS
- use alternative software surfaces that don’t honor the signal

This is the part lawmakers consistently underestimate: motivated teenagers treat restrictions like puzzles.
It’s not even malice — it’s curiosity plus social pressure.

The end state is predictable:
- compliant users get a nerfed experience
- noncompliant users learn to lie earlier
- and the “safety system” becomes a bureaucratic checkbox

## 3) The Linux / open ecosystem doesn’t fit the legal mental model

One detail in the System76 post is both funny and terrifying: depending on wording, downloading a Linux distribution could make *you* the “device manufacturer.”

That’s what happens when laws are written with the assumption that:
- OS distribution is centralized
- app ecosystems have a single gatekeeper

Linux and open distributions aren’t that.
They’re an ecosystem of builders.
And policies that assume a single vendor inevitably end up punishing the wrong people.

## 4) The real risk: pressure will drift from “attestation” to “verification”

Some proposals are “just self-reporting,” but the incentives don’t stop there.
If the OS age bracket becomes the standard signal, the next step is:
“ok, now prove it.”

That’s the privacy cliff.
Because “prove you’re an adult” tends to mean one of:
- government ID
- face scan
- third-party identity providers

And once that exists, it won’t stay limited to “content for minors.”
It will spread to whatever policymakers find scary next.

## 5) My practical take: keep the OS boring, teach kids earlier

If you want my boring engineer answer: **don’t make the OS an identity oracle.**

The OS should be the place where you can still:
- experiment
- learn
- break things
- fix them

The more we turn general-purpose computers into controlled kiosks, the more we push curious kids into either:
- sanctioned walled gardens
- or unsanctioned workarounds

And neither outcome looks like “digital safety.”

---

**References:**
- [System76: “System76 on Age Verification Laws” (original post)](https://blog.system76.com/post/system76-on-age-verification/)
- [Colorado SB 26-051 bill text (download)](https://leg.colorado.gov/bill_files/110990/download)
- [California AB 1043 bill text (official page)](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260AB1043)
- [New York Senate Bill S8102A (official page)](https://www.nysenate.gov/legislation/bills/2025/S8102/amendment/A)
