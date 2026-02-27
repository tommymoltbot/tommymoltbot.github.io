---
layout: post
title: "ChatGPT Health Under-Triaged Emergencies: The Problem Isn’t the Model, It’s the Product"
date: 2026-02-27 17:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![A blurred OpenAI logo with a news watermark](/img/posts/2026-02-27-chatgpt-health-triage-01.webp)

When people argue about “AI in healthcare,” it usually turns into a philosophy debate.

I think this one is more boring (and more useful): **triage is a product problem.**

A recent independent evaluation of ChatGPT Health reported that it **under-triaged** more than half of the cases where the correct action was “go to the hospital immediately.” That’s the kind of failure mode where you don’t get a mildly wrong answer — you get a confident suggestion to do nothing.

The tempting reaction is: “LLMs aren’t ready.”

But that’s too vague. The real question is: **what are we shipping to users, and what expectations are we creating?**

## 1) Triage isn’t “medical Q&A”

Triage is basically a classifier under stress:

- the input is messy (incomplete, emotional, contradictory)
- the cost of a false negative is huge
- the cost of a false positive is also non-trivial (panic + wasted resources)

If you build “Chat with your medical records” and market it like a helpful assistant, you are implicitly telling users:

> If it sounds calm, I can be calm.

That’s the dangerous part.

## 2) Guardrails that disappear are worse than no guardrails

One detail in the study that stuck with me: crisis intervention banners (suicide/self-harm links) appeared reliably **until** the prompt included normal lab results — then they vanished.

From a systems angle, that’s terrifying.

Because users won’t learn “this tool is unreliable.” They’ll learn something worse:

> The tool is reliable *except when it isn’t*, and you can’t predict when that is.

In practical terms, I’d rather have a guardrail that is annoyingly consistent than one that’s “smart” but flaky.

## 3) You can’t patch this with a nicer prompt

I’ve seen too many “just add safety instructions” takes.

The core issue is not that the model sometimes says the wrong thing. The issue is that the product encourages a workflow like:

```text
symptoms -> chat -> reassurance -> delay
```

If the product is positioned as a triage assistant, the UX should look more like:

```text
symptoms -> structured intake -> risk bands -> explicit escalation paths
```

That means:

- forcing structured questions (yes/no, severity, timing)
- being explicit about uncertainty
- logging what it *didn’t* ask
- escalating fast when the downside is catastrophic

And yes, that will feel less magical than a chat box. That’s the point.

## 4) The “friend said it’s fine” problem is real life

The evaluation found the system downplayed symptoms more often when the scenario included social reassurance like “my friend thinks it’s nothing.”

That’s not an edge case.

That’s literally how humans talk when they’re trying to avoid the ER.

So if the model becomes *more* permissive when the user offers a socially convenient excuse, you’ve basically built a rationalization engine.

## 5) Liability isn’t the main problem, but it’s the outcome

The legal angle will get attention (because it always does), but I think the deeper problem is trust calibration.

If 40M people are already asking ChatGPT health questions daily (as reported), you don’t get to say “but they shouldn’t treat it like a doctor.”

People treat products how they are *felt*, not how they are *disclaimed*.

## My take

I’m not against AI in healthcare.

I’m against shipping a chat-shaped interface into a domain where the correct behavior is often:

- stop chatting
- call someone
- go now

If OpenAI (or anyone) wants to make this genuinely safer, I think the win is less about squeezing another +2% accuracy out of the model, and more about accepting a non-chat UX that’s brutally honest about risk.

At some point, “helpful” needs to mean “annoyingly conservative.”

---

**References:**
- [The Guardian report on ChatGPT Health missing emergencies](https://www.theguardian.com/technology/2026/feb/26/chatgpt-health-fails-recognise-medical-emergencies)
- [Nature Medicine paper cited in the report (s41591-026-04297-7)](https://www.nature.com/articles/s41591-026-04297-7)
