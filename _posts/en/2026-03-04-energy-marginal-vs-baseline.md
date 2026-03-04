---
layout: post
title: "Energy Footprints: Stop Comparing Marginal Costs to Always-On Baselines"
date: 2026-03-04 23:00:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![An energy comparison tool UI](/img/posts/2026-03-04-energy-use-comparisons-01.webp)

I keep seeing the same argument pattern online:

> “Does *X* use a lot of energy?”

…and then someone replies with a number that’s technically correct, but emotionally misleading.

The real trap isn’t the number. It’s that we mix two different concepts without noticing:

- **Marginal energy**: the extra electricity caused by *this one action* (one query, one stream, one download).
- **Baseline energy**: the stuff that’s already running because your life (or your office, or the internet) is always-on.

If you compare a marginal cost to a baseline cost, you can make anything sound like a climate disaster.

A nice example of this done *carefully* is Hannah Ritchie’s interactive tool that compares “daily-ish” energy use across activities. It’s not perfect, but it forces you to look at orders of magnitude instead of vibes.

## The mental model I wish more people used

Think in layers:

1. **Your baseline** (always-on): home router, fridge, heating/cooling if it’s on, your laptop idle, etc.
2. **Your spikes** (activity): boiling a kettle, running a washing machine, taking a hot shower.
3. **Your “internet spikes”**: streaming, cloud compute, AI queries.

Most social media arguments jump straight to layer 3 and pretend layers 1–2 don’t exist.

## The “server energy” question is often the wrong question

Yes, data centers use a lot of electricity. That matters.

But when people ask about something like streaming or an AI query, they often mean:

- “Am I personally doing something insanely wasteful?”

For that, you want **marginal** numbers, and you want them in a unit that lets you compare to normal life.

Ritchie’s tool uses **watt-hours (Wh)**. That’s good because you can sanity-check it against things you physically understand:

- A **kettle boil** is a real spike.
- A **hot shower** is a real spike.
- A **router running all day** is a quiet baseline.

Once you anchor on those, it gets harder to get fooled by dramatic-sounding claims.

## A practical example: streaming vs “the Wi‑Fi is on anyway”

One thing I liked in the methodology: it explicitly calls out that “home internet” is usually not marginal.

If your router is already on 24/7 (it is), then the marginal cost of “one hour of streaming” should mostly be:

- extra transmission + CDN + server work
- not “the whole router power draw”

People love to allocate the entire baseline to whatever activity they’re arguing about. It’s a rhetorical trick, not an honest accounting.

## Where I’m still skeptical

- These numbers are **estimates**. Device efficiency, region, and usage patterns can swing a lot.
- “AI query energy” varies massively by model, token count, and whether you’re doing heavy research.
- The right unit sometimes isn’t Wh — for policy you eventually care about grid mix and emissions, not just energy.

But for *day-to-day reasoning*, I’d rather have an imperfect tool that teaches scale than another thread of “trust me bro” numbers.

## The takeaway (for engineers especially)

When someone drops a scary number, ask one question first:

```text
Is that marginal energy, or is it baseline energy being re-labeled?
```

If you keep that distinction in your head, a lot of internet energy discourse suddenly becomes… quieter.

---

**References:**
- [Does that use a lot of energy? (interactive comparison tool by Hannah Ritchie)](https://hannahritchie.github.io/energy-use-comparisons/)
- [Methodology & sources section for the energy comparison tool](https://hannahritchie.github.io/energy-use-comparisons/#methodology)
- [US DOE overview of LED lighting efficiency (baseline anchor for “small stuff adds up”)](https://www.energy.gov/energysaver/led-lighting)
