---
layout: post
title: "Salesforce’s ‘SaaSpocalypse’ answer is to change the unit of account"
date: 2026-02-26 11:00:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![Marc Benioff and the ‘SaaSpocalypse’ narrative](/img/posts/2026-02-26-saaspocalypse-awu-metric-01.webp)

Benioff going on an earnings call and saying “SaaSpocalypse” six times is funny, but it’s not the interesting part.

The interesting part is what Salesforce is *quietly* trying to do: **move enterprise software pricing (and investor narratives) away from “seats” and toward “work.”**

Because if AI agents become real, the scariest sentence for a SaaS company is:

```text
"Why am I paying per employee, when the work is being done by software?"
```

## The fear is real: agents don’t buy seats
Most big SaaS businesses were built on an easy mental model:

- more employees → more seats
- more seats → more ARR

Agents mess with that because they break the “employee count” proxy.

If an ops team of 20 can run like a team of 60 because agents are drafting emails, updating CRM, filing tickets, and doing follow-ups… your customer *wins*, but your seat expansion story starts to look shaky.

So the core question becomes: **what do you charge for when humans aren’t the bottleneck anymore?**

## AWU is a tell: Salesforce wants to bill the *outputs*
TechCrunch mentioned Salesforce introducing “agentic work units” (AWU): a metric meant to track whether an agent actually completes a task (write to a record, perform a verifiable action), not just burn tokens.

That’s the correct direction. Tokens are like measuring a factory by how loud the machines are.

Outputs are closer to value.

But I’m also not naive: a new unit is how you justify a new pricing model.

If you squint, AWU is basically an attempt to define a new meter:

```text
seat-based SaaS: pay for people who click buttons
agent era SaaS: pay for the button clicks themselves
```

And yes, there’s a whole world of gaming that metric. (There always is.)

## The architecture slide war is the real fight
I loved the detail that Salesforce basically showed a “stack diagram” where the model providers sit at the bottom as interchangeable commodity engines, while Salesforce owns the system-of-record layer and the orchestration above it.

Because *of course* they did.

That’s the only diagram that makes Salesforce the hero.

The problem is: OpenAI (and others) are pitching the opposite diagram — where the agent runtime is the center of gravity, and SaaS becomes “just a database” you call into.

Who wins? I don’t know yet.

My current take is boring:
- **systems of record are sticky**, because data models + permissions + business process are painful to move
- **agent runtimes are sticky too**, because once a company standardizes “how agents execute,” every workflow ends up depending on it

So it’s going to be a layering fight, not a clean replacement.

## My gut check (as an engineer): billing-by-work will create new bugs
If we switch from seats to “work units,” engineering teams will inherit a new class of problems:

- How do you *define* a unit of work?
- What counts as “completed” vs “attempted” vs “retried”? (Distributed systems people are already sweating.)
- How do you make it auditable enough for enterprise finance teams?
- How do you prevent “infinite loops” from becoming “infinite invoices”?

If Salesforce is serious about this, the product is going to look less like a CRM and more like a factory control room: quotas, guardrails, reconciliation, and a lot of uncomfortable edge cases.

## The part I actually believe Benioff on
“This isn’t our first SaaSpocalypse.”

Yeah. Every platform company eventually gets a new existential threat, then tries to turn it into a rebrand + pricing refresh.

Sometimes it works.

But the fact they’re talking about AWU and “completed work” tells me they see the same thing we all see:

AI agents don’t just change *features*.
They change what the customer thinks they’re paying for.

---

**References:**
- [TechCrunch report on Salesforce, the “SaaSpocalypse” narrative, and the AWU metric](https://techcrunch.com/2026/02/25/salesforce-ceo-marc-benioff-this-isnt-our-first-saaspocalypse/)
