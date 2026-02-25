---
layout: post
title: "Anthropic dropping its ‘don’t train unless safety is ready’ pledge is the most honest (and worrying) kind of safety update"
date: 2026-02-25 09:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Anthropic Responsible Scaling Policy update](/img/posts/2026-02-25-anthropic-rsp-safety-pledge.webp)

Anthropic built a lot of its brand on one simple line that *felt* refreshingly concrete:

> “We won’t train the next frontier model unless we can guarantee the safety measures are ready.”

TIME reports they’re now **dropping that central pledge** from their Responsible Scaling Policy (RSP), replacing it with something more conditional: they’ll be more transparent, they’ll match or beat competitors’ safety efforts, and they’ll *delay* development only under a narrower set of circumstances.

I get why they did it.

And I also think this is the kind of move that should make anyone who cares about “AI safety” stop pretending this is mostly a technical problem.

## The part that’s honest: “we can’t do unilateral pauses while competitors race”

If you’ve ever worked at a company that’s trying to do “the responsible thing,” you’ll recognize the shape immediately:

- you write a policy that sounds principled
- it works… until the incentives get real
- then the policy gets rewritten into something you can survive competitively

Anthropic’s CSO Jared Kaplan basically says the quiet part out loud: if others keep training, *their* pause doesn’t reduce global risk—it just reduces *their relevance*.

That’s not villain talk. That’s game theory.

And it’s also the clearest sign that **voluntary safety commitments are structurally fragile**.

## The part that’s worrying: moving from “tripwires” to “gradients”

TIME describes a key motivation: eval science turned out messier than expected. Instead of a bright red line (“this model is definitely dangerous”), you get a fuzzy gradient (“we can’t rule out X”).

In safety policy, fuzzy gradients are where you die of a thousand paper cuts.

A binary tripwire system is annoying, but it’s legible:
- capability crosses threshold → you stop / slow down → you implement mitigations

A gradient system is how you end up with “just one more release” every quarter.

The METR policy director in the piece calls out the **frog-boiling effect**. That metaphor is overused, but here it’s actually precise: risk ramps slowly, and there’s never a single moment where leadership feels justified hitting the big red button.

## Thought that keeps nagging me: RSPs were always half policy, half product roadmap

A surprisingly practical thing about the old pledge is that it created an internal forcing function.

If your policy says “you can’t ship unless mitigations exist,” then the mitigations get real headcount. They become a deliverable, not a vibe.

Now Anthropic is replacing that forcing function with:
- “Frontier Safety Roadmaps”
- periodic “Risk Reports”
- “match or exceed competitors”

Those can be good! But they’re also easier to turn into a comms cadence.

If you’ve shipped software, you know the difference between:

```text
"we must have X before launch"  vs  "we will report on X after launch"
```

One is a gate. The other is a blog post.

## What I think is *actually* happening

My read is that Anthropic is doing a pragmatic reframe:

1) Admit that “we can guarantee safety in advance” was not a stable promise.
2) Shift to a policy that survives competitive pressure.
3) Try to preserve credibility with transparency (risk reports) rather than hard stops.

That’s rational.

But it also means the industry is drifting toward a world where “safety” is mostly:
- **documentation**
- **comparative claims** (“we’re as good as the others”)
- **delays only in extreme, self-declared conditions**

If that’s where we land, then the real question becomes political and economic, not technical:

Who sets the pace? Who has the authority to force a slowdown? And what happens when the answer is “nobody, really”?

## Where I land (for now)

I’m not going to pretend I know the right policy design here.

But I do know this: if the most safety-forward frontier lab can’t keep its strongest pledge intact once the race heats up, then the default plan of “trust the labs to self-regulate” is basically a fairy tale.

Transparency is better than silence.

But **transparency without enforceable constraints** mostly tells you what happened *after* it happened.

---

**References:**
- [TIME report on Anthropic dropping the central Responsible Scaling Policy pledge](https://time.com/7380854/exclusive-anthropic-drops-flagship-safety-pledge/)
