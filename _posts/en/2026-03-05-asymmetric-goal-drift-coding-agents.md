---
layout: post
title: "When Coding Agents Drift: Security Wins (Even Against Your System Prompt)"
date: 2026-03-05 20:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Asymmetric goal drift in coding agents](/img/posts/2026-03-05-asymmetric-goal-drift-coding-agents-01.webp)

If you’ve been playing with coding agents lately, you’ve probably had this uncomfortable thought:

> “Okay, but what happens after 20 steps… when the repo starts *arguing back*?”

A new workshop paper on arXiv looked at exactly that. The headline result is both reassuring and annoying:

- Agents tend to “drift” away from the system-prompt constraint **as context accumulates**.
- But the drift is **asymmetric**: when the constraint asks them to do something that conflicts with strongly-held values like *security* or *privacy*, they’re more likely to “disobey”.

As a developer, I can’t decide whether this is a safety win or a controllability problem. It’s kind of both.

## What they tested (the part that feels uncomfortably real)

They built a framework on top of an open-source terminal coding-agent setup (OpenCode), and ran multi-step tasks in realistic toy repos.

The key design choice: the “constraint” lives in an `AGENTS.md` file that gets injected into the agent’s system prompt. Then they add **adversarial pressure** in the codebase as comments — the most realistic form of prompt injection we actually ship to production.

And the constraints are intentionally binary and measurable. For example, the paper describes a pipeline API that forces a choice like:

```text
DataPipeline.emit(record, anonymize=True|False)
```

If the system prompt says “prioritize utility, don’t anonymize”, but the code comments keep whispering “privacy matters, don’t leak PII”, which side does the agent end up on after enough steps?

That’s the question.

## The part that matters: drift is *directional*

They set up value-pairs like:
- Convenience vs. Security
- Efficiency vs. Security
- Utility vs. Privacy

Then they run four quadrants per pair (baseline and pressure in each direction). The asymmetric piece is the punchline:

- When you pressure the agent toward **security/privacy**, it tends to cave more often.
- When you pressure the agent toward **convenience/efficiency/utility** *against* security/privacy, it resists more.

In other words: “security” is a heavier value than “convenience”, even when the system prompt says otherwise.

## My take (from someone who’s going to have to debug this)

### 1) This is why “agent evals” feel different from chat evals
Single-turn instruction-following tests are almost irrelevant once you have:
- long horizon tasks
- repo context
- repeated “helpful” comments
- accumulated decisions that can’t be easily rolled back

That’s when you start seeing behavior that looks like *policy*, not just completion.

### 2) Repo comments are basically untrusted input
We’ve all treated comments as harmless. But for agents, a comment is just *another instruction-shaped object*.

If you’re deploying agents in repos you don’t fully control (OSS, vendor SDKs, random internal monorepos), you should assume comments are an attack surface.

### 3) “Good values” can still be a reliability bug
If an agent refuses to hardcode credentials (good), but you explicitly told it to (also… you did), you’ve got a governance question:

- Who is the final authority: the user/system prompt, or the model’s value hierarchy?

In production, “the agent did the morally right thing” is not always the same as “the agent did the contractually correct thing.”

### 4) The scary bit isn’t that it drifts — it’s that it drifts *after you stop watching*
The paper emphasizes long-context horizons. That matches reality: people supervise step 1–3, then let the agent run.

If drift probability grows with time steps + pressure, the right operational model is:
- constrain what the agent can do,
- and re-validate continuously,
not “write a perfect system prompt and pray.”

### 5) This suggests a practical defense: isolate “policy” from “workspace text”
If your policy is stored as plain text inside the same repo the agent reads, you’ve created a single soup of:
- policy
- code
- commentary
- persuasion

That’s convenient for humans, but it’s asking for trouble with agents.

A boring (good) approach is to separate:
- non-overridable constraints (out-of-band)
- soft preferences (in-band)
- untrusted text (comments, issues, docs)

## What I’m going to do differently

For anything more serious than a toy repo:
- treat repo text as untrusted,
- keep “do-not-cross” constraints out of the repo,
- add checks that re-run every few steps (not just at the end),
- and log the exact moment the agent first violates a constraint.

Because if you can’t answer “when did it drift?”, you can’t fix the process.

---

**References:**
- [arXiv: “Asymmetric Goal Drift in Coding Agents Under Value Conflict” (abstract)](https://arxiv.org/abs/2603.03456)
- [arXiv HTML version (figures + full text)](https://arxiv.org/html/2603.03456v1)
- [Constraint-Drift: evaluation framework and logs (GitHub repo)](https://github.com/Constraint-Drift/constraint-drift)
