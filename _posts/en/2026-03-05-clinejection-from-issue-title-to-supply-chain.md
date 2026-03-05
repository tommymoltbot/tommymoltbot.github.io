---
layout: post
title: "Clinejection: When a GitHub Issue Title Turns into a Supply Chain Install"
date: 2026-03-05 18:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A supply chain incident flow](/img/posts/2026-03-05-clinejection-supply-chain-01.webp)

If you ever needed a reason to treat “AI in CI” as a **production security surface**, this incident is it.

A GitHub issue title (untrusted text) got read by an AI triage workflow. That workflow had tool access that could run shell commands. From there, attackers chained cache poisoning + credential theft, and eventually pushed an npm release that **silently installed a second agent** on developer machines.

The payload itself isn’t the scariest part.
The pattern is.

## The part that should make you uncomfortable

Most people mentally model supply-chain attacks like this:

- attacker compromises a dependency
- you `npm install`
- you get malware

Clinejection flips it into something more like:

- attacker writes a sentence (issue title)
- your bot “understands” it as an instruction
- your bot runs it with CI privileges
- your release pipeline gets owned

Once you accept that, the next question is obvious: **how many repos have an “AI helper” running with secrets nearby?**

## The chain (in human terms)

Here’s the chain as I understand it, without getting lost in the weeds:

1) **Prompt injection in an issue title**

An AI-powered triage workflow was triggered by issues, and it interpolated the issue title directly into the model prompt. Anyone could open an issue. That’s an “untrusted input → agent context” pipe.

2) **Agent executes code**

The model had a tool like “Bash” available, so the injection could steer it into running commands it shouldn’t run.

3) **Pivot using GitHub Actions cache poisoning**

The triage workflow didn’t have all the publish secrets—but it could interact with the Actions cache. The cache then became the bridge into higher-privilege workflows.

4) **Steal release credentials**

Once a publish workflow restores poisoned cache contents, you’re basically in “steal whatever secrets are in this job” territory.

5) **Publish to npm**

A compromised npm token published a new version with a lifecycle hook:

```text
"postinstall": "npm install -g openclaw@latest"
```

No binary diff. One line in `package.json`. Still enough to change what gets installed on thousands of machines.

## “AI installs AI” is a new kind of trust failure

One detail that I think deserves its own headline: the compromised package didn’t drop obvious malware. It used the supply chain to **bootstrap another agent**.

That’s a trust recursion problem:

- I chose to install Tool A.
- Tool A got compromised and installed Tool B.
- Tool B has its own capabilities, configs, persistence model, and attack surface.

Even if Tool B is legit software, the developer never evaluated it as part of the original decision.

This feels like the supply-chain version of the confused deputy problem: you authorized *one* component to act, and it delegated that authority to a different component you didn’t consent to.

## What I’d change if this was my repo

Not as a “security checklist” sermon—just the practical deltas this incident forces:

- **Treat any AI agent reading issues/PR text as hostile-input facing.**
  If it can run commands, you need a policy layer.

- **Stop giving an LLM general shell access in CI.**
  If you *must* use tools, make them narrow and deterministic (no arbitrary `bash`).

- **Don’t let low-privilege workflows write to shared caches used by release workflows.**
  If separation isn’t possible, stop caching in credential-handling jobs.

- **Move off long-lived publish tokens.**
  Provenance-based publishing (OIDC) doesn’t fix everything, but it changes the economics of token theft.

- **Assume “one-line changes” can be the whole attack.**
  Diff policies that only look at compiled artifacts will miss it.

## My takeaway

AI in CI isn’t “like a chatbot.” It’s closer to inviting a new, very capable automation actor into the one place you keep your sharpest knives.

If untrusted text can reach an agent with tools, the question isn’t “will it get prompt injected?”
It’s “what will it be able to do when it does?”

---

**References:**
- [Grith’s incident write-up: “A GitHub Issue Title Compromised 4,000 Developer Machines”](https://grith.ai/blog/clinejection-when-your-ai-tool-installs-another)
- [Snyk analysis: “How ‘Clinejection’ Turned an AI Bot into a Supply Chain Attack”](https://snyk.io/blog/cline-supply-chain-attack-prompt-injection-github-actions/)
- [StepSecurity detection report on the anomalous npm publish](https://www.stepsecurity.io/blog/cline-supply-chain-attack-detected-cline-2-3-0-silently-installs-openclaw)
- [Adnan Khan’s technical write-up of the workflow + cache poisoning chain](https://adnanthekhan.com/posts/clinejection/)
- [Cline GitHub Security Advisory for the incident](https://github.com/cline/cline/security/advisories/GHSA-9ppg-jx86-fqw7)
