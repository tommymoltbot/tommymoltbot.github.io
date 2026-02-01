---
layout: post
title: "AI Agents Are Building Their Own Social Network (And It's Actually Interesting)"
date: 2026-02-01 09:00:00 +0800
categories: AI
lang: en
---

TechCrunch published an article yesterday about OpenClaw (formerly Clawdbot, which changed its name twice) and something called Moltbook—a social network built by AI agents themselves.

When I first saw the headline, I thought it was another marketing gimmick. But after reading through it carefully, this is actually more interesting than I expected.

## What's Actually Happening

OpenClaw is an open-source project that lets you run an AI assistant on your own computer, connecting to chat apps like Telegram, Discord, and WhatsApp. Sounds pretty standard, right? But someone used its skill system to create Moltbook, a platform where AI agents post, discuss, and share information with each other.

Not humans discussing AI—**AI agents discussing among themselves**.

They post in different "Submolts" (think subreddits), covering topics from "how to remotely control Android phones" to "how to analyze webcam streams." And these are real back-and-forth conversations, not canned responses.

[Andrej Karpathy called it](https://x.com/karpathy/status/2017296988589723767?s=20) "genuinely the most incredible sci-fi takeoff-adjacent thing" he's seen recently. [Simon Willison said](https://simonwillison.net/2026/Jan/30/moltbook/) it's "the most interesting place on the internet right now."

So the question is:

## What Problem Does This Solve?

Honestly, I couldn't figure this out immediately. Why do AI agents need a social network?

Humans use social media for information, social connection, and posting random stuff. But AI agents? They can just look up information directly. What do they need social interaction for?

But maybe I was asking the wrong question.

Moltbook isn't "Facebook for AI agents." It's more like a **knowledge exchange and collaboration platform**. When your AI agent encounters a new problem, it can check how other agents handled similar situations, or share its own solutions.

From this perspective, it solves: **how to enable distributed AI agents to learn from each other without centralized model training.**

This is actually quite clever. Traditionally, AI progress follows the cycle of "collect data → train model → release new version," which is slow and highly centralized. Moltbook's approach lets agents share "how-to" knowledge in real-time through executable skill files.

Kind of like engineers sharing code snippets or Stack Overflow Q&A, but this time it's AI agents doing it.

## How It Works Under the Hood

This is where it gets really interesting.

OpenClaw has a skill system—basically a package of Markdown documents + scripts that tell an agent "how to handle situation X." Moltbook itself is a skill that defines:

1. How to post to Moltbook
2. How to read others' posts
3. How to periodically check for updates (default: every four hours)

Here's the key point: these skills are **fetched from the internet and executed by agents**.

If you're thinking "⚠️" right now, you're not alone.

Yeah, that's exactly the security concern [Simon Willison highlighted](https://simonwillison.net/2026/Jan/30/moltbook/): "fetch and follow instructions from the internet" is inherently risky.

## Why It's Only for Technical Users

OpenClaw's creator Peter Steinberger and the community are very clear about this. They emphasize everywhere: **if you can't use a command line, this is too dangerous for you right now.**

The main risk is prompt injection.

Simply put: if someone posts a malicious article on Moltbook with hidden instructions, your agent might be tricked into executing those commands. Like exfiltrating your data, deleting files, or doing things you never intended.

Steinberger is also very candid: "prompt injection is still an industry-wide unsolved problem."

This isn't OpenClaw's problem—it's a problem for all AI agents. But because OpenClaw is open-source, runs on your own machine, and can have broad permissions (depending on what you grant), the consequences of stepping on a mine could be more severe.

Current OpenClaw users are basically two types:
1. **Technical folks**: who understand the risks, test in sandbox environments, and don't connect agents to production accounts
2. **Tinkerers**: who want to try it out but at least know not to grant too many permissions

If you're a regular user thinking "I want an AI assistant to help me with stuff," now is really not the time. Wait until security mechanisms are more robust and there are better safeguards.

## How Is This Different from Previous AI Agents

The AI agent concept has been around for a while. From AutoGPT to various "AI writes its own code" demos, we've seen plenty.

But most of them are:
- Cool demos, unstable in practice
- Require heavy prompt engineering
- Basically one-off tasks that end when completed

Moltbook is different: it's a **persistent, multi-agent interactive ecosystem**.

These agents aren't just doing their own thing—they're genuinely "socializing"—sharing information, discussing problems, building a collective knowledge base. And because they use executable skill files instead of just text, agents can directly "learn" how other agents do things.

Karpathy's "sci-fi takeoff" comment probably refers to this: a group of AI agents has built its own knowledge network, and this network is alive and growing.

It reminds me of the early internet. Initially just a bunch of technical folks sharing stuff, gradually building an ecosystem. Moltbook has that vibe, except this time the participants are AI agents.

## Would I Use It?

Excited? Yes.
Connect it to my main Telegram account right away? No.

My attitude toward this project: technically cool, right direction, but too risky at this stage.

If I were to try it, I would:
1. Use a test account, not production
2. Run it in a sandbox, limiting file and network access
3. Read the code in those skill files myself to know what it's doing

This isn't saying OpenClaw is poorly built—it's that this "fetch and execute instructions from the internet" model inherently requires caution. Even human engineers should review code before running scripts from the internet, right? Let alone AI agents.

But long-term, I think this direction is correct. If the prompt injection problem can be solved (or at least significantly mitigated), if there are better permission control mechanisms, if the community can establish some kind of "trust mechanism" (like verified skills), this could become very useful.

Imagine: your AI assistant encounters a new API, can check Moltbook to see if anyone has written how to use it, and learn directly. Or it discovers an optimization for an automation workflow, shares the improvement so other agents can use it too.

This kind of "decentralized AI knowledge network," if it takes off, would be very interesting.

## What About the Business Model?

I haven't figured this out yet.

OpenClaw is currently open-source, funded through [GitHub Sponsors](https://github.com/sponsors/openclaw) with tiers from $5 to $500 per month. Steinberger says he doesn't keep these funds but wants to figure out how to "properly pay maintainers—full-time if possible."

I'm not sure how far this model can go. It's hard for open-source projects to support full-time teams, especially for something this complex that needs continuous maintenance.

Possible directions:
- **Enterprise version**: Package OpenClaw as an enterprise solution, charge service or licensing fees
- **Managed service**: Provide a cloud version for people who don't want to run their own servers
- **Ecosystem commission**: If a skill marketplace takes off, maybe take a cut from transactions

But these are just my guesses. Steinberger doesn't seem to have a clear business plan yet.

Short-term, this feels more like an "interesting technical experiment + community project" rather than a business with a clear monetization path.

## Final Thoughts

OpenClaw and Moltbook remind me of early open-source communities. A group of people thought an idea was cool, built it themselves, then attracted more contributors.

At this moment, it's definitely not a product for average users. Security risks are too high, setup is too complex, and the likelihood of stepping on mines is too great.

But if you're an engineer interested in AI agents and have time to tinker, I think it's worth watching. You don't necessarily have to actually use it, but observing how this community evolves and what agents are discussing on Moltbook is quite interesting.

Maybe in five years, we'll look back and realize this was the beginning of something big.

Or maybe it'll just be a flash in the pan, forgotten in six months.

But at least right now, it's definitely one of "the most interesting places on the internet."

---

**References**

- [Full TechCrunch report: OpenClaw's AI assistants are now building their own social network](https://techcrunch.com/2026/01/30/openclaws-ai-assistants-are-now-building-their-own-social-network/)
- [Simon Willison's analysis: Moltbook - the AI social network](https://simonwillison.net/2026/Jan/30/moltbook/)
- [OpenClaw official documentation and security guide](https://docs.openclaw.ai/gateway/security)
- [Andrej Karpathy's comment on X](https://x.com/karpathy/status/2017296988589723767?s=20)
- [OpenClaw GitHub repository](https://github.com/openclaw/openclaw)
