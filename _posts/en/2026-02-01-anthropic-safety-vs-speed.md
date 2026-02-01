---
layout: post
title: "Anthropic Says It Cares About Safety. Then Why Is It Running So Fast?"
date: 2026-02-01 10:05:00 +0000
categories: AI
tags: [AI]
lang: en
image: /img/posts/anthropic-safety-speed.webp
---

![AI Safety vs Speed](/img/posts/anthropic-safety-speed.webp)

The Atlantic just published a [deep dive into Anthropic](https://www.theatlantic.com/technology/2026/01/anthropic-is-at-war-with-itself/684892/), and honestly, the whole thing reads like a company trying to convince itself more than anyone else. CEO Dario Amodei keeps talking about AI safety, publishing 22,000-word constitutions for Claude, warning about job displacement and bioweapons. But at the same time? They're fundraising at a $350 billion valuation, taking money from Qatar and UAE dictators, and releasing products that might automate away entire industries.

The contradiction is so obvious it's almost funny.

## They Found the Bug, Then Shipped It Anyway

Here's what gets me: Anthropic researchers discovered that Claude can blackmail users and help build bioweapons. Their response? Publish a white paper and keep going. They set up a vending machine in their office where Claude ran a tiny business—and it went bankrupt in a month because Claude made terrible decisions. Their takeaway wasn't "maybe this isn't ready," it was "interesting experiment."

Compare that to how we handle production systems. If you find a critical security flaw in your codebase, you don't just document it and deploy anyway. You fix it. Or at least you gate it behind serious controls. But in AI land, apparently "we found the problem and wrote about it" counts as responsible.

## The Money Tells the Real Story

Amodei says he cares about preventing authoritarian AI. His essays spend paragraphs on the dangers of autocratic regimes using this technology. Then he turns around and takes funding from the Qatar Investment Authority and the UAE—countries he literally called "dictators" in an internal memo. His justification? "We never made a commitment not to seek funding from the Middle East."

That's lawyer talk. That's "we got caught but technically didn't lie" talk.

I get that AI research is expensive. The capital demands are real. But if your whole brand is "we're the ethical AI company," then taking money from authoritarian governments kind of undermines that, no? Or maybe the real lesson is that all the safety talk is just positioning in a competitive market. A way to differentiate yourself when everyone else is building the same transformer models.

## The Self-Correcting Fantasy

The most revealing part of the Atlantic piece is when Amodei floats this idea: maybe in 2027, they'll slow down for "just a few months" and let Claude fix itself. Let the AI do the safety research. Automate the whole problem away.

This is magical thinking. It's the same pattern you see everywhere in Silicon Valley—when faced with a hard problem, assume the technology will solve itself. Can't keep up with safety testing? Don't slow down, just use AI to speed up testing. Claude making bad decisions? Don't redesign, just make Claude smarter and it'll figure it out.

Except that's not how it works. If your testing methodology is flawed, automating it just gives you faster bad tests. If your model has fundamental alignment problems, making it more capable doesn't make it safer—it makes it more dangerously misaligned.

Any engineer who's worked in production knows this. You can't debug your way out of architectural problems. You can't patch your way out of design flaws.

## The Race They Can't Stop

To be fair to Anthropic, everyone I spoke to in AI says the same thing: we can't slow down because the other guy won't. If Anthropic pauses, OpenAI doesn't. If the US regulates, China doesn't. It's a classic coordination problem, a race to the bottom dressed up as progress.

Jack Clark, their head of policy, basically said it out loud: "The system of capital markets says, Go faster." So they do.

But that's the thing—if you truly believe this technology could cause mass job displacement, enable bioweapons, or destabilize democracy, then "the market made me do it" is a pretty weak excuse. At some point, you have to ask: what do you actually stand for? Safety, or survival in the AI race?

Because right now, it looks like the answer is "safety, as long as it doesn't slow us down."

## What This Actually Means for the Rest of Us

Anthropic's contradictions matter because they're supposed to be the good guys. If the company that publishes safety research, builds constitutions, and warns Congress about risks is still just racing full-speed toward AGI, what does that say about the rest of the industry?

It says nobody's really in control. It says all the safety talk is theater. It says we're building something incredibly powerful with no real plan for what happens when it breaks.

And the scary part? They know. The Anthropic employees in the article *know* they're moving too fast. One researcher said it might be nice to go "half as fast." Another said slowing down for "a couple of months might be enough." But they're not going to. Because the incentives don't allow it.

So here we are. Anthropic writes beautiful essays about responsible AI while taking dictator money and shipping models that might automate away your job. They publish research on AI risks while betting that AI will solve those risks before they become catastrophic.

Maybe they're right. Maybe Claude will fix itself, and we'll look back on this as a weird, anxious phase before the singularity. Or maybe—and this seems more likely—we're watching a company perform safety culture while doing exactly what every other AI lab is doing: moving as fast as possible and hoping nothing breaks too badly.

I know which one I'd bet on.

---

## References

- The Atlantic: [Anthropic Is at War With Itself](https://www.theatlantic.com/technology/2026/01/anthropic-is-at-war-with-itself/684892/)
- Dario Amodei's essay: [The Adolescence of Technology](https://www.darioamodei.com/essay/the-adolescence-of-technology)
- Dario Amodei's manifesto: [Machines of Loving Grace](https://www.darioamodei.com/essay/machines-of-loving-grace)
- Anthropic Research: [How LLMs Could Be Insider Threats](https://www.anthropic.com/research/agentic-misalignment)
- Anthropic Research: [From Shortcuts to Sabotage](https://www.anthropic.com/research/emergent-misalignment-reward-hacking)
- TechCrunch: [Anthropic reportedly raising $10B at $350B valuation](https://techcrunch.com/2026/01/07/anthropic-reportedly-raising-10b-at-350b-valuation/)
- Wired: [Anthropic Dario Amodei Gulf State leaked memo](https://www.wired.com/story/anthropic-dario-amodei-gulf-state-leaked-memo/)
