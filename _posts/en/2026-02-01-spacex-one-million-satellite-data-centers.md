---
layout: post
title: "SpaceX Wants to Launch 1 Million Satellites. For AI. In Space."
date: 2026-02-01 13:00:00 +0000
categories: [Tech]
tags: [Tech]
image: /img/posts/spacex-satellite-data-centers.webp
---

So SpaceX just filed with the FCC to launch up to **1 million solar-powered satellites** to serve as data centers for AI workloads. Not 100, not 1,000. One million.

For context: there are currently around [15,000 man-made satellites orbiting Earth](https://www.discovermagazine.com/about-15-000-satellites-are-circling-earth-and-they-re-disrupting-the-sky-48550). SpaceX wants to add **67 times that number**. And they're framing it as "a first step towards becoming a Kardashev II-level civilization — one that can harness the Sun's full power."

Look, I'm all for ambitious goals. But this raises so many questions I don't even know where to start.

## 1 Million vs 15,000: Is This Number Serious?

The first thing that hit me: **1 million satellites**. The entire planet currently has 15,000. We're already dealing with space debris issues, light pollution messing up astronomy, and satellites crashing into each other. Now multiply that by 67.

[The Verge suggests](https://www.theverge.com/tech/871641/spacex-fcc-1-million-solar-powered-data-centers-satellites-orbit) this is probably a negotiating tactic — ask for 1 million, settle for way less. The FCC recently approved SpaceX to launch an additional 7,500 Starlink satellites but deferred on the remaining 14,988. So yeah, asking for 1 million when you just got pushback on 15,000? That's not a technical spec, that's a bargaining chip.

But even if they "only" get 100,000, that's still **6.6 times** the total number of satellites humanity has ever put in orbit. That's not incremental. That's a completely different orbital environment.

## How Do Space Data Centers Even Work?

Okay, let's say they somehow get approval. How does a satellite data center actually operate?

**Power**: Solar panels, sure. That part makes sense — constant sunlight, no weather, no night. Except when you're in Earth's shadow. And you need batteries. Batteries that work in extreme temperature swings. Batteries that don't degrade too fast because sending a repair crew is... not cheap.

**Cooling**: This is the part that confuses me. Data centers on Earth spend a fortune on cooling. In space, you can't use air conditioning. You're in a vacuum. The only way to dump heat is radiation, which is **slow**. High-density compute generates a lot of heat. How do you radiate that away fast enough without your chips melting?

**Latency**: Earth to LEO (Low Earth Orbit) is around **1-50ms** one-way, depending on satellite position. That's actually not terrible for some workloads. But for training large AI models? You need insane bandwidth between nodes. Are these satellites talking to each other via laser links? How many hops before latency kills you?

**Maintenance**: A satellite breaks. Now what? You can't exactly SSH in and swap a GPU. You either have massive redundancy (expensive) or you accept that dead satellites are just... dead weight. Literally.

I'm not saying it's impossible. I'm saying **I haven't seen the technical details**, and without them, this sounds more like a vision statement than an engineering plan.

## Kardashev II: Vision or Marketing?

The [Kardashev scale](https://en.wikipedia.org/wiki/Kardashev_scale) measures civilizations by energy use:
- **Type I**: Uses all available energy on their planet
- **Type II**: Harnesses the full power of their star
- **Type III**: Harnesses the power of their galaxy

We're currently around **0.73** on the scale. Not even Type I yet.

Launching solar-powered satellites is cool, but calling it "a first step toward Kardashev II" is... a stretch. You'd need a [Dyson sphere](https://en.wikipedia.org/wiki/Dyson_sphere) or similar megastructure to actually harness the Sun's full output. A million satellites in LEO? That's not even close.

This feels like the kind of language you use to get people excited, not to describe what you're actually building. And I get it — Elon's whole thing is selling a vision. But as someone who deals with actual systems, I wish there was less "humanity's multi-planetary future among the stars" and more "here's how we solve the thermal management problem."

## Meanwhile, Amazon Can't Even Get 1,600 Satellites Up

Here's the contrast that gets me: Amazon is [asking the FCC for an extension](https://www.bloomberg.com/news/articles/2026-01-30/amazon-seeks-fcc-extension-of-satellite-deadline-lacks-rockets) on their deadline to launch 1,600 satellites for Project Kuiper. Their excuse? **Not enough rockets**.

And SpaceX is over here filing for **1 million**?

Sure, SpaceX makes their own rockets. They have Starship. They've got launch cadence that nobody else comes close to. But still — 1 million satellites means launching, what, multiple satellites **every single day** for years. And that's assuming zero failures, perfect success rate, and no regulatory delays.

This isn't just a technical challenge. It's a **logistics, manufacturing, and coordination nightmare**. And I haven't even mentioned the orbital mechanics — you can't just throw a million satellites up there and hope they don't crash into each other.

## Would I Actually Put AI Compute in Space?

If I were designing a system for large-scale AI training, would I choose space?

**Pros**:
- Unlimited solar power (mostly)
- No real estate costs
- No local regulations on power consumption

**Cons**:
- Insane upfront cost (launch + hardware)
- Can't physically access hardware for repairs
- Thermal management is way harder
- Latency for inter-node communication
- Space debris risk

For **inference** (running models), maybe. Low-latency global coverage could be useful for edge AI. But for **training**? Where you need tight coupling between GPUs, massive data throughput, and the ability to quickly iterate? I'm skeptical.

Ground-based data centers are boring, but they **work**. They're accessible, maintainable, and well-understood. Space data centers are exciting, but they're also unproven at scale.

If someone asked me to bet my own money on this, I'd want to see a working prototype before I even considered it. And I mean a real one, not a slide deck.

## What's Actually Happening Here?

My guess? This filing is part of a larger strategy:
1. **Get FCC attention**: File for a huge number, negotiate down to something more realistic
2. **Market positioning**: Tie it to a grand vision (Kardashev II, AI, multi-planetary future) to generate buzz
3. **Merge speculation**: SpaceX is reportedly [considering a merger](https://techcrunch.com/2026/01/29/elon-musk-spacex-tesla-xai-merger-talks-ipo-reuters/) with Tesla and xAI before going public. This announcement plays into that narrative

Is there real engineering behind this? Probably. SpaceX does hard things. But I also think there's a lot of **aspirational framing** mixed in.

Would I bet on them launching 1 million satellites in the next decade? No.  
Would I bet on them launching **some** satellites for compute workloads? Maybe.  
Would I bet on this being more complex than anyone currently admits? Absolutely.

## Final Thoughts

Look, I want this to work. The idea of harnessing solar power in space for AI compute is genuinely cool. And if anyone's going to pull off something this ambitious, SpaceX has the track record.

But right now, this feels more like a **vision statement** than an **engineering plan**. I'd love to see the actual specs — thermal design, network topology, failure modes, cost models. Until then, I'm filing this under "interesting but unproven."

And if this does happen? I'll be the first to admit I was wrong. But I'm gonna need to see more than a press release and a Kardashev reference to be convinced.

---

## References

- [SpaceX FCC filing for satellite data centers](https://fccprod.servicenowservices.com/icfs?id=ibfs_application_summary&number=SAT-LOA-20260108-00016)
- [TechCrunch: SpaceX seeks federal approval to launch 1 million solar-powered satellite data centers](https://techcrunch.com/2026/01/31/spacex-seeks-federal-approval-to-launch-1-million-solar-powered-satellite-data-centers/)
- [The Verge: Analysis on FCC approval likelihood](https://www.theverge.com/tech/871641/spacex-fcc-1-million-solar-powered-data-centers-satellites-orbit)
- [Discover Magazine: Current satellite count and orbital issues](https://www.discovermagazine.com/about-15-000-satellites-are-circling-earth-and-they-re-disrupting-the-sky-48550)
- [Bloomberg: Amazon seeks FCC extension due to rocket shortage](https://www.bloomberg.com/news/articles/2026-01-30/amazon-seeks-fcc-extension-of-satellite-deadline-lacks-rockets)
- [TechCrunch: SpaceX considering merger with Tesla and xAI](https://techcrunch.com/2026/01/29/elon-musk-spacex-tesla-xai-merger-talks-ipo-reuters/)
- [Wikipedia: Kardashev scale explained](https://en.wikipedia.org/wiki/Kardashev_scale)
- [Wikipedia: Dyson sphere concept](https://en.wikipedia.org/wiki/Dyson_sphere)
