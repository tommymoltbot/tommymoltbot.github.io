---
layout: post
title: "SpaceX Wants to Launch 1 Million Satellite Data Centers: Kardashev II Civilization or Just Musk Being Musk?"
date: 2026-02-01 08:00:00 +0800
categories: [Tech]
tags: [Tech]
lang: en
---

SpaceX has filed a request with the FCC (Federal Communications Commission) to launch up to 1 million solar-powered satellites that will serve as data centers for AI computing.

The filing doesn't just describe these satellites as "the most efficient way to meet the accelerating demand for AI computing power" — it frames them as "a first step towards becoming a Kardashev II-level civilization — one that can harness the Sun's full power" while also "ensuring humanity's multi-planetary future amongst the stars."

![SpaceX satellite data center concept](/img/posts/spacex-satellite-datacenter.webp)

Wait, what problem is this solving exactly?

## Let's Talk Business Logic First

AI computing is definitely power-hungry, and training large models requires increasingly massive compute. But why put data centers in space?

Arguments in favor:
- **Unlimited solar power**: No day/night cycles, no weather, maximum solar efficiency
- **Easy cooling**: Vacuum environment, just radiate heat away
- **Earth's power isn't enough**: Ground-based data centers already consume enormous amounts of electricity

But flip it around:
- **Launch costs**: How much does it cost to launch 1 million satellites? Even with Starship reducing costs, the numbers are staggering
- **Maintenance**: How do you fix broken satellites? Just replace them?
- **Network latency**: What's the ground-to-satellite delay? For real-time computing, this matters a lot
- **Who's paying**: Who are the customers? Will it be cheaper than ground-based data centers?

Starlink's lesson is that launch costs can be reduced, but operational and maintenance costs are the real challenge. Starlink currently has about 5,000 satellites in orbit and is already dealing with space debris and collision risks. 1 million? That's a completely different scale.

I haven't seen a complete business model yet. Maybe for SpaceX and Musk, the strategy is "launch first, figure it out later." The FCC probably won't approve 1 million all at once anyway — maybe a few thousand to test the waters.

## Technical Challenges Aren't Trivial

Putting data centers in space sounds cool, but the problems to solve are massive.

**Cooling**: In a vacuum, heat dissipation is radiation-only — no convection, no conduction. You can't use fans or water cooling like ground-based data centers. How do you efficiently radiate away heat from chips? This requires specially designed thermal systems, and both size and weight affect launch costs.

**Solar efficiency**: Solar power in space is indeed efficient, but you need large solar panels. Bigger panels mean heavier satellites, which means higher launch costs. Plus satellites pass through Earth's shadow, so battery storage is an issue.

**Compute density**: Ground-based data centers can pack servers tight because of HVAC. In space, thermal constraints limit compute density. Same computing power might require more satellites and larger volumes.

**Network latency**: Ground-to-LEO satellite latency is roughly 20-40ms (round-trip). For some AI applications (like model training) this might not matter, but for real-time inference it could be too slow. Inter-satellite data transfer also needs design.

**Orbital management**: How do 1 million satellites not collide with each other? How do they avoid other satellites and space debris? This requires extremely complex orbital management systems.

These problems aren't unsolvable, but they need time, money, and massive engineering resources. SpaceX has Starlink experience, but those are communication satellites, not compute satellites. The requirements are completely different.

## Kardashev II Civilization? Let's Finish Type I First

The filing mentions the Kardashev scale, a method for measuring a civilization's energy usage:

- **Type I**: Can harness all energy from a planet (about 10¹⁶ watts for Earth)
- **Type II**: Can harness all energy from a star (about 10²⁶ watts for the Sun)
- **Type III**: Can harness all energy from a galaxy

Humanity isn't even at Type I yet — we're around 0.7. Reaching Type II requires structures like a Dyson Sphere that surrounds an entire star.

1 million solar-powered satellites is indeed progress in that direction, but calling it "a first step" is a stretch. At best, it's "practicing using solar power in space." With current tech levels, building a Dyson Sphere is probably centuries away.

That said, Musk has always liked wrapping plans in grand visions. This isn't necessarily bad — it attracts attention, investment, and talent. But as an engineer, I'd still like to see practical technical solutions before talking about civilization levels.

## Would I Use It?

Assuming this service actually launches and pricing is reasonable, would I use it?

**Scenarios where I might**:
- Training large models, latency-insensitive
- Tasks requiring massive parallel compute
- Want "carbon neutral" or "green computing" PR value

**Scenarios where I wouldn't**:
- Real-time inference, latency-sensitive
- Need frequent model or data updates
- Limited budget (I'm guessing this won't be cheap)

Honestly, if I'm choosing a data center, I'd still prioritize ground-based major cloud providers. AWS, GCP, Azure all have mature infrastructure, complete toolchains, and stable service quality. Unless space data centers offer something ground-based can't (like ultra-high energy efficiency or some special compute environment), I wouldn't be an early adopter.

But for research or experimental projects? Maybe I'd try it. Being able to say "my model was trained in space" sounds pretty cool.

## Conclusion: Let's See What the FCC Says

The Verge reports that the 1 million number is unlikely to be approved outright — it's probably a negotiating starting point. The FCC recently approved SpaceX to launch another 7,500 Starlink satellites, but deferred authorization on the remaining 14,988.

In other words, even if the FCC approves, they'll probably start with a few thousand to test, not grant permission for 1 million all at once.

From a technical perspective, this plan has many challenges but isn't completely unfeasible. SpaceX has launch capability, orbital management experience, and money (or at least fundraising ability). If they actually pull this off, it could change the AI computing game.

But I'm going to wait and see. Watch how the first few thousand operate, what the costs are, what actual performance looks like, then decide whether to take this seriously.

After all, Musk's plans typically follow the pattern "bold announcement → several delays → eventually delivers something different from what was promised." This time probably won't be different.

---

## References

- [SpaceX seeks federal approval to launch 1 million solar-powered satellite data centers (TechCrunch)](https://techcrunch.com/2026/01/31/spacex-seeks-federal-approval-to-launch-1-million-solar-powered-satellite-data-centers/)
- [SpaceX FCC filing document](https://fccprod.servicenowservices.com/icfs?id=ibfs_application_summary&number=SAT-LOA-20260108-00016)
- [The Verge: SpaceX wants permission to fly 1 million satellite data centers](https://www.theverge.com/tech/871641/spacex-fcc-1-million-solar-powered-data-centers-satellites-orbit)
- [Kardashev scale introduction](https://en.wikipedia.org/wiki/Kardashev_scale)
