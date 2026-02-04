---
layout: post
title: "LLM agent guardrails as a contract: control-plane separation, not vibes"
date: 2026-02-04 00:01:00 +0000
categories: [Engineering]
tags: [Security, Agents, Reliability]
lang: en
image: /img/posts/2026-02-04-llm-policy-guardrails.webp
---

![Guardrails aren’t a slogan](/img/posts/2026-02-04-llm-policy-guardrails.webp)

I keep seeing “guardrails” discussed like it’s a feature checkbox.

As if you can sprinkle a few safety prompts, add a refusal policy, and call it done.

If you’re building an **LLM agent**—a system that can actually *do things* (read internal docs, open PRs, change configs, trigger deploys)—guardrails aren’t a vibe.

They’re a **contract** between:

- what the model *can* propose
- what the system *will* execute
- and what you can *audit* afterwards

If you can’t explain those three in plain language, your “agent” is just a production incident waiting for a time window.

## Five angles I use to sanity-check guardrails

1) **Control-plane angle**: if untrusted input can influence your command channel, you don’t have guardrails—you have a contaminated control plane.

2) **Product angle**: every new capability is a new promise. “The agent can restart services” implicitly means “the agent can restart the wrong service.” Your guardrails are the warranty terms.

3) **Reliability angle**: retries + tool calls + partial failures create weird edges. Guardrails have to cover *compositions*, not just single actions.

4) **Security angle**: prompt injection isn’t just “a chatbot got tricked.” It’s an attacker trying to smuggle instructions into the path that ends with execution.

5) **My take (practical)**: stop asking “how do we make the model behave?” Start asking “how do we make execution safe even when the model is wrong?”

## The core design move: separate observation from instruction

When agents go wrong, it’s often because we let the model speak with too much authority.

A simple but effective separation:

- **Observation**: what the model saw / extracted / inferred (untrusted)
- **Proposal**: what the model wants to do (untrusted)
- **Execution**: what the system does (trusted, policy-gated)

That last step should be decided by something boring.

Not by vibes.

## A guardrail that’s actually enforceable: the “policy function”

If you want one mental model that works across code, infra, and business ops: treat execution like an API behind an authorization layer.

I like expressing it as a single function:

```text
can_execute(action, target, context) -> allow | deny | require_human
```

Where:

- `action` is a small, explicit set (e.g., `open_pr`, `restart_service`, `rotate_key`)
- `target` is scoped (repo/service/env/account)
- `context` includes the evidence trail (links, diffs, logs, ticket ids)

If you can’t write this down, you don’t have a guardrail. You have hope.

## The three guardrail layers that matter (in practice)

### 1) Capability boundaries (what tools exist)

- Don’t give the agent a “shell” if all it needs is “read-only search.”
- Don’t give write access to production when staging is enough.

In other words: **least privilege**, but applied to tool design.

### 2) Policy gating (what is allowed per action)

Examples of boring rules that save you:

- production deploys require a ticket reference + diff summary
- restarts require a recent health signal + cooldown window
- deleting anything requires `require_human`

If you can’t encode the rule, you can’t rely on it.

### 3) Auditability (what you can prove later)

After a bad day, you need to answer:

- who/what requested the action
- what evidence was used
- what policy decision was made
- what exactly executed

If your “agent framework” can’t produce that trail, it’s not ready for serious work.

## Why this matters right now

Because agents are getting embedded into real workflows.

And the failure mode isn’t “the model hallucinated a fact.”

It’s “the model hallucinated an *action*.”

Once execution is on the table, guardrails stop being an ethics discussion and become an engineering spec.

---

## References

- [Anthropic’s overview of prompt injection and mitigations](https://www.anthropic.com/news/prompt-injection)
- [OWASP Top 10 for LLM Applications (prompt injection + related risks)](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
