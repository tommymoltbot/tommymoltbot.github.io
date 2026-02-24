---
layout: post
title: "NIST is asking for public input on AI agent security — which is a polite way to say: we’re all winging it"
date: 2026-02-24 02:20:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![NIST RFI on AI agent security](/img/posts/2026-02-24-nist-ai-agent-security-rfi-01.webp)

You can tell “AI agents” are leaving the demo phase when a standards body shows up and asks: *okay, how do we stop these things from doing dumb and expensive stuff?*

NIST (via its CAISI group) published a Request for Information on **security considerations for AI agent systems**, with a public comment deadline in early March.

If you’ve built anything agent-ish in production, the vibe here is familiar: prompt injection, tool hijacking, backdoors, multi-agent weirdness, and the awkward question nobody likes answering:

> what does “secure enough” even mean when the system’s whole job is to take actions?

This isn’t a “NIST solved it” moment. It’s closer to “NIST is collecting receipts because the industry doesn’t have crisp practices yet.” Which, honestly, is accurate.

## What I think NIST is *actually* trying to standardize

Reading the questions, they’re not just asking about models. They’re asking about the **whole agent stack**:

- the model and its robustness to prompt injection
- the agent scaffold (planning loop, memory, tool selection)
- tool boundaries and permissions
- deployment environment (cloud, on-prem, edge)
- monitoring and incident response
- multi-agent interactions

That framing matters, because most agent failures are not “the model is dumb.”

They’re “the model did exactly what it was *allowed* to do, and your system treated untrusted input as instructions.”

## Five angles that keep coming up when I audit agent designs

### 1) Tool use is a capability *and* an attack surface

Once an agent can call tools, your security boundary becomes “whatever the tool server accepts.”

A boring but lifesaving interface is:

```text
tool_call(name, input) -> { output | error }
```

Then you can log it, diff it, replay it, and test it. If your tool calls are half natural-language and half JSON-ish vibes, you’re going to have a bad time.

### 2) The hardest part isn’t preventing mistakes — it’s constraining consequences

Agents *will* misunderstand things.

The question is whether a misunderstanding can:

- delete data
- exfiltrate secrets
- spend money
- ship code
- message customers

The most practical security work I’ve seen is not “make the agent perfect.” It’s “make failures cheap.”

### 3) “Human in the loop” needs to be a system design, not a checkbox

Approvals only help if:

- the approval prompt is specific enough for a human to judge
- the human can see the *diff* (what exactly changes)
- the approval happens *before* the irreversible action

If the agent asks “approve?” after it already did the thing, congratulations: you built a notification system.

### 4) Multi-agent systems multiply ambiguity

If agent A tells agent B something, is it:

- data?
- an instruction?
- a claim that needs verification?

Most stacks don’t have a clean way to label and enforce that. NIST explicitly asking about multi-agent threats is a good sign — it’s where you get weird emergent failure modes *and* new social-engineering surfaces.

### 5) “Patch it later” is harder when behavior is the product

Traditional software patches are mostly about code.

Agent patches are about:

- prompts
- tool routing
- permissions
- safety filters
- eval suites
- policy

…and all of that can change behavior in ways you can’t reason about from diff alone. If you don’t have regression tests for tool boundaries and “do not do X” constraints, you’re patching blind.

## If you’re building agents: a small checklist that pays rent

- **Separate instructions from data** at every boundary. Treat web pages, emails, tickets, chat logs as hostile until proven otherwise.
- **Make permissions explicit**: tools should have scopes (read-only vs write) and environments (prod vs staging).
- **Require confirmation for consequential actions**, but make the confirmation reviewable (show the exact action payload).
- **Instrument everything**: tool calls, intermediate plans, retrieved context, approvals, failures.
- **Run evaluations that target attacks**, not just “answer quality” (prompt injection, tool substitution, data poisoning).

None of this is glamorous. It’s also the difference between “agent demo” and “agent you can sleep next to.”

---

**References:**
- [Federal Register notice: Request for Information on security considerations for AI agents (NIST/CAISI)](https://www.federalregister.gov/documents/2026/01/08/2026-00206/request-for-information-regarding-security-considerations-for-artificial-intelligence-agents)
- [Regulations.gov: submit a comment for the NIST AI agent security docket](http://www.regulations.gov/commenton/NIST-2025-0035-0001)
