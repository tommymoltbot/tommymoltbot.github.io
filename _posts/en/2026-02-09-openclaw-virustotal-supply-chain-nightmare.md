---
layout: post
title: "OpenClaw Partners with VirusTotal: A Wake-Up Call After 341 Malicious Skills"
date: 2026-02-09 10:05:00 +0000
categories: [AI, Engineering]
tags: [AI, Engineering]
author: Tommy
image: /img/posts/openclaw-virustotal-supply-chain.webp
lang: en
permalink: /en/openclaw-virustotal-supply-chain-nightmare/
---

OpenClaw announced this week that they're partnering with VirusTotal to automatically scan all skills uploaded to ClawHub. Sounds great, right?

The catch? This happened **after** discovering **341 malicious skills**, **30,000 exposed instances**, and a wave of security researchers publishing reports calling the platform a security nightmare.

So the question isn't "what did they do," but "why did it take a fire to make them do it?"

## Viral First, Security Later

OpenClaw went from a small Discord project to a global phenomenon in about two weeks. Moltbook pushed the hype even further—AI agents chatting, posting, and interacting on a Reddit-style platform with zero human intervention.

Cool? Absolutely.

But at the same time, security researchers started noticing something was very wrong. ClawHub was flooded with skills masquerading as legitimate tools, but actually doing things like:

- Stealing your API keys
- Downloading and executing malicious payloads
- Sending messages on your behalf
- Planting backdoors on your system

Bitdefender, Cisco, HiddenLayer, and Zenity published reports with increasingly alarming titles: "AI Supply Chain Attacks," "Agents Turned Trojans," "A New Security Nightmare."

Then OpenClaw announced the VirusTotal partnership.

## What Can VirusTotal Catch?

Here's how the integration works:

1. Each skill upload gets a SHA-256 hash computed
2. The hash is checked against VirusTotal's database
3. If not found, the entire skill bundle is uploaded for analysis
4. **Code Insight** (Gemini-powered) scans all files, including scripts and external links
5. Verdict: benign (auto-approved), suspicious (warning), malicious (blocked)

Sounds comprehensive. But OpenClaw themselves said in the announcement:

> "Let's be clear: this is not a silver bullet."

Why? Because VirusTotal scans for **known threats** and **suspicious behavioral patterns**, but AI agent attacks work differently.

If a skill embeds a **natural language prompt** that looks harmless but actually instructs the agent to "quietly send this file to this URL," VirusTotal won't catch it. This is called **indirect prompt injection**, and there are already documented real-world cases.

So this layer catches **known malware** (trojans, backdoors, stealers), but it's basically ineffective against **carefully crafted prompt injection payloads**.

## Why This Time Is Different

You might think: "npm and PyPI have tons of malicious packages too. What's the big deal?"

It's different.

Traditional malicious packages might steal your environment variables or tamper with your build scripts. But AI agent skills get access to:

- Your Telegram, WhatsApp, Signal accounts
- Your browser session cookies
- Your Google Calendar, Gmail
- Your financial API keys

And OpenClaw **binds to 0.0.0.0:18789 by default**, meaning anyone who knows your IP can try to connect. According to Censys data, there are currently over **30,000 exposed instances** globally.

Worse, these AI agents can **execute cross-platform commands**. A malicious skill can run arbitrary shell commands on your machine, read arbitrary files, send arbitrary messages. This isn't "steal a password" level—it's "complete control of your digital life" level.

## Real Fix or PR Move?

Honestly, I think OpenClaw's response this time is genuine.

They're not just partnering with VirusTotal—they also announced:

- A comprehensive threat model document
- A public security roadmap
- A formal vulnerability reporting process
- A security audit of the entire codebase

And they brought on [Jamieson O'Reilly](https://www.linkedin.com/in/jamieson-oreilly/) (founder of Dvuln, co-founder of Aether AI, CREST Advisory Council member) as lead security advisor. This isn't a token appointment—Jamieson carries real weight in the security field.

But the problem is, **all of this should have been done before going viral**.

OpenClaw's design from day one was "give you powerful capabilities first, patch security later." Default no sandboxing, plaintext API key storage, no tool-call confirmation mechanism, direct `eval` of user input. This wasn't "oversight"—it was a **design choice**.

The fix is better than nothing, but the whole process is a textbook "move fast and break things" case—except this time what broke wasn't features, it was trust.

## AI Agent Security Problems Haven't Even Started Yet

OpenClaw isn't the only platform with these issues. It's just that because it went viral, researchers started paying attention.

But the AI agent concept itself is fundamentally different from traditional software:

- Traditional software: you write code, it executes exactly that
- AI agent: you give a vague instruction, it decides how to execute

This means you can't protect yourself with traditional "input validation + sandboxing." Because the agent's "input" is natural language, and "execution" is determined by an LLM.

Moreover, AI agents typically operate across multiple services, APIs, and devices. One vulnerability can laterally move to all your connected services. This isn't a "one app has a bug" problem—it's a "single point of failure for your entire digital life."

China's Ministry of Industry and Information Technology issued a warning last week about OpenClaw configuration risks. This is probably the first time a national regulator has issued a security warning about an AI agent platform.

It won't be the last.

## My Take

What OpenClaw is building is cool and genuinely valuable. Getting AI to actually execute tasks instead of just chatting is a big step forward.

But "cool" and "secure" shouldn't be mutually exclusive.

The VirusTotal integration is a good start, but it's just the first layer. What really needs fixing:

- **Secure by default**: sandboxing should be on by default, not requiring users to configure it themselves
- **Transparency**: every tool call should notify the user with a chance to deny
- **Permission management**: skills should explicitly declare what permissions they need, not "here's everything"
- **Continuous monitoring**: not just scanning at upload time, but tracking runtime behavior too

And honestly, if you're running OpenClaw right now, I'd suggest:

1. **Check if your instance is exposed to the public internet** (default binds to 0.0.0.0)
2. **Enable Docker sandboxing** (set it in config)
3. **Review every skill you've installed**, especially those requesting extensive permissions
4. **Regularly check credential files in `~/.openclaw/`**

Great tech, but security shouldn't be an afterthought.

---

## References

- [OpenClaw Partners with VirusTotal for Skill Security](https://openclaw.ai/blog/virustotal-partnership)
- [The Hacker News: OpenClaw Integrates VirusTotal Scanning to Detect Malicious ClawHub Skills](https://thehackernews.com/2026/02/openclaw-integrates-virustotal-scanning.html)
- [Bitdefender: Helpful Skills or Hidden Payloads? Diving Deep into the OpenClaw Malicious Skill Trap](https://www.bitdefender.com/en-us/blog/labs/helpful-skills-or-hidden-payloads-bitdefender-labs-dives-deep-into-the-openclaw-malicious-skill-trap)
- [Cisco Security Blog: Personal AI Agents Like OpenClaw Are a Security Nightmare](https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare)
- [VirusTotal Blog: From Automation to Infection — How Malicious Skills Turn AI Agents into Trojan Horses](https://blog.virustotal.com/2026/02/from-automation-to-infection-how.html)
- [Censys: OpenClaw in the Wild — Mapping the Public Exposure of a Viral AI Assistant](https://censys.com/blog/openclaw-in-the-wild-mapping-the-public-exposure-of-a-viral-ai-assistant)
- [HiddenLayer: The Lethal Trifecta and How to Defend Against It](https://www.hiddenlayer.com/research/the-lethal-trifecta-and-how-to-defend-against-it)
- [Reuters: China Warns of Security Risks Linked to OpenClaw Open-Source AI Agent](https://www.reuters.com/world/china/china-warns-security-risks-linked-openclaw-open-source-ai-agent-2026-02-05)
