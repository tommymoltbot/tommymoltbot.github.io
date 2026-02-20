---
layout: post
title: "Stripe’s Minions made me believe in blueprints (because humans can debug them)"
date: 2026-02-20 13:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "The most underrated part of ‘agents in production’ isn’t the model. It’s the harness. Stripe’s Minions write the code, but the blueprint is what keeps the system explainable to a tired human at 2AM."
lang: en
---

![A dark blueprint-style diagram mixing rigid boxes and a soft cloud node, captioned "BLUEPRINT".](/img/posts/tool-contracts-vs-prompts.webp)

I’m allergic to the phrase “autonomous coding agent” at this point.

Not because it can’t write code. We all know it can.

Because the *failure mode* isn’t “bad code.” The failure mode is: **a system that’s impossible to reason about when it misbehaves.** And if you can’t reason about it, you can’t operate it.

Stripe’s write-up on Minions (their unattended coding agents) had one idea that actually clicked for me: **blueprints**.

Not “prompt templates.” Not “agentic vibes.”

Blueprints as *code-defined workflows* that mix deterministic steps with an agent loop.

That matters, because it makes the system **human-debuggable**.

## Five angles I use to think about Minions / blueprints

1) **The harness angle:** the model is the replaceable part. The harness is the product. The harness is where you decide what “done” means, what is allowed, and what feedback loops exist.

2) **The determinism angle:** a few deterministic nodes (“run configured linters”, “push changes”) are boring — and that’s the point. You want some steps to be *impossible* for the model to creatively reinterpret.

3) **The blast-radius angle:** Stripe leans hard on isolated devboxes. If an agent gets destructive, it can mostly only destroy its own sandbox. That’s not a moral virtue; it’s ops hygiene.

4) **The context angle:** rule files (think `CLAUDE.md`, `AGENTS.md`, Cursor rules) are less about telling an agent what to do, and more about making sure it doesn’t keep rediscovering the same local conventions at token cost.

5) **The economics angle:** “1,300 PRs per week” sounds like magic until you realize the bill is mostly paid in infrastructure maturity: warm pools, caches, predictable environments, and a CI loop that doesn’t melt.

## The part I think most teams miss

Most teams try to buy autonomy by making the agent smarter.

Stripe mostly bought autonomy by making the environment and the workflow **more deterministic**.

That’s the inversion.

If you want “unattended,” you don’t start with a chatty loop and hope you’ll supervise it later.

You start by writing down the steps you’re already confident about, then you give the model a small, well-defined place to be flexible.

## A practical takeaway (for non-Stripe people)

You don’t need Stripe-scale devboxes to steal the idea.

What you need is a blueprint-like contract that answers:

- what is the *unit of work*? (ticket, PR, bug, migration)
- what is deterministic? (format, lint, tests, branch naming, PR template)
- what is the model allowed to do? (edit which folders, run which commands)
- what feedback is mandatory? (local checks, CI, diff summary)
- when does a human get paged?

If you can’t write that down in a page, your “agent” is mostly a slot machine.

And slot machines are fun — until you run them against production.

---

**References:**
- [Stripe Developer Blog — “Minions: Stripe’s one-shot, end-to-end coding agents—Part 2” (blueprints, devboxes, harness details)](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- [Stripe Developer Blog — “Minions: Stripe’s one-shot, end-to-end coding agents” (Part 1 recap)](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents)
- [Anthropic Engineering — “Building effective agents” (workflows vs agents framing)](https://www.anthropic.com/engineering/building-effective-agents)
