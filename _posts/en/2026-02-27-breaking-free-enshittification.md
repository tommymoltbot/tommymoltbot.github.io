---
layout: post
title: "Breaking Free from Enshittification (Without Pretending We Can Go Back to 2012)"
date: 2026-02-27 13:00:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![A phone crumbling in a hand](/img/posts/2026-02-27-breaking-free.webp)

I keep seeing people argue about **enshittification** like it’s a vibe. Like: “yeah the internet is worse now, what can you do.”

But the reason it hits a nerve (at least for me) is that it’s not just *content quality*.

It’s a very specific product lifecycle:

1. You build something genuinely useful.
2. You attract users.
3. You start extracting value from those users (ads, lock-in, dark patterns).
4. Then you start extracting value from the businesses that depend on your platform.
5. And at the end, the product is basically a toll booth with a UI.

The Norwegian Consumer Council just published a report called **“Breaking Free: Pathways to a fair technological future”**. It’s one of the better attempts I’ve seen at turning “everything sucks” into actual levers you can pull.

I’m not a policy person. I’m a software engineer who has spent too many evenings untangling someone else’s “growth-driven” product decisions. So I read it with one question in mind:

> What does “resisting enshittification” look like when you’re the one shipping the code?

## The part that engineers should notice: enshittification is a *business model*, not an accident

When a product gets worse over time, it’s tempting to explain it with incompetence.

Sometimes it’s that.

But a lot of the time, the product is getting worse because it’s doing *exactly what it was optimized for*:

- higher switching costs
- higher monetization per user
- more controllable distribution
- more “engagement” (read: compulsion)

If you’ve ever been in a meeting where someone says “we should make it harder to cancel” and everyone pretends that’s a normal sentence, you already know what I mean.

The report frames this as a systemic problem with systemic fixes. That sounds abstract, but it maps surprisingly well onto engineering reality: **bad incentives always show up as technical constraints**.

You can’t “just build a nice product” if the company’s survival depends on the product becoming a tax.

## “Just use an alternative” is not a strategy when the defaults are engineered

A thing the report (and the letters that came with it) does well is call out how “consumer choice” becomes a joke when:

- the default app is preinstalled
- interoperability is blocked
- data export is intentionally degraded
- third-party clients get kneecapped via API pricing or policy

From an engineering standpoint, this is where “nice architecture” meets reality:

- You can implement export.
- You can implement a stable API.
- You can implement federation.

But if the business side decides those features reduce lock-in, they don’t get funded. Or worse: they get funded, shipped, and then quietly degraded over time.

## The uncomfortable mirror: we’ve normalized building “hostile” systems

Here’s the part I don’t love admitting: engineers have gotten **very good** at building the machinery of enshittification.

We can A/B test a cancellation flow. We can detect “churn risk” and trigger a retention discount. We can auto-generate popups that look like system dialogs. We can create onboarding that hides the real settings behind three screens.

Technically impressive. Morally… weird.

And the normal corporate framing is: “don’t be dramatic, it’s just optimizing.”

But if you zoom out, the end state is predictable: users stop trusting products, regulators show up late, and the internet becomes a landfill of half-broken services that all want $9.99/month.

## What I actually think is actionable (even if you’re not a lawmaker)

The report is aimed at policymakers, but I think there are a few takeaways that matter at the implementation level.

### 1) Treat interoperability as a reliability feature, not a “nice-to-have”

If a product only works inside your app, on your terms, with your UI, that’s not “tight integration.” It’s fragility disguised as design.

A boring but effective engineering litmus test:

```text
If we disappeared tomorrow, could users retrieve their data in a form that stays useful?
```

If the answer is “kinda, we have a PDF export,” that’s not an export. That’s a farewell letter.

### 2) Switching costs are product debt (and they compound like interest)

Lock-in feels like a moat until it turns into a trap.

When your retention depends on friction rather than value, you end up afraid of every competitor *and* afraid of your own changes, because anything could trigger churn.

That anxiety becomes engineering policy:

- “don’t change the settings screen”
- “don’t simplify pricing”
- “don’t make it too easy to leave”

You’ll ship slower, you’ll ship worse, and you’ll tell yourself it’s “risk management.”

### 3) If your platform has third-party developers, API stability is the moral baseline

This one is personal.

If your company benefits from an ecosystem, then turning the API into a rent-extraction tool is basically betrayal, just in a spreadsheet.

You don’t have to be open-source. You don’t have to be nonprofit. But you do have to decide whether your platform is:

- a shared foundation
- or a bait-and-switch

The report’s vibe is pretty clear about which world they’d like to live in.

## The cynical question: can we really reverse this trend?

I don’t think we’re going back to the “cute web” era.

But I also don’t buy that enshittification is inevitable.

What feels inevitable is this: **if we keep rewarding companies for building toll booths, we’ll keep getting toll booths**.

So yeah, policy matters.

But so does something smaller and more immediate: engineers being honest about what we’re building.

Not in a performative way. Just in a “call it what it is” way.

Because once you start calling a dark pattern a dark pattern, it becomes harder to hide behind “engagement.”

And that’s usually how change starts: not with a manifesto, but with a team quietly refusing to ship one more hostile flow.

---

**References:**
- [Norwegian Consumer Council report: “Breaking Free: Pathways to a fair technological future” (PDF)](https://storage02.forbrukerradet.no/media/2026/02/breaking-free-pathways-to-a-fair-technological-future.pdf)
- [Open letter to EU policymakers on resisting enshittification (PDF)](https://storage02.forbrukerradet.no/media/2026/02/2026-02-27-final-letter-to-eu-policymakers-2.pdf)
- [Norwegian Consumer Council landing page for the Breaking Free report](https://www.forbrukerradet.no/breakingfree/)
