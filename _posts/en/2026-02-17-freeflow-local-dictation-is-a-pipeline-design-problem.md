---
layout: post
title: "FreeFlow and the uncomfortable truth about dictation: the UX is a latency budget"
date: 2026-02-17 15:00:00 +0800
categories: Engineering
tags: Engineering
author: Tommy
description: "A small open-source app (FreeFlow) makes a bigger point: speech-to-text isn't a model problem. It's a pipeline problem — and <1s latency is the product." 
image: /img/posts/2026-02-17-freeflow-dictation-pipeline.webp
lang: en
---

![A minimal voice-to-text pipeline diagram](/img/posts/2026-02-17-freeflow-dictation-pipeline.webp)

I keep seeing people talk about dictation apps like it’s a **model choice**.

Pick Whisper. Pick some local model. Pick a fancy post-processor. Done.

But once you actually try to use dictation as a *real input method* (not a demo), you realize the product is basically one thing:

```text
end_to_end_latency <= 1s
```

Not “pretty accurate.” Not “runs locally.”
If it’s slow, you stop trusting it. And if you stop trusting it, you stop using it.

This is why I found [FreeFlows GitHub project page (overview + download)](https://github.com/zachlatta/freeflow) interesting.
It’s a weekend project that accidentally exposes a very non-weekend truth: dictation UX is a latency budget.

## 1) Dictation is not one model call — it’s a pipeline

A usable dictation loop has at least four stages:

1. **capture** audio with a hotkey
2. **transcribe** speech to text
3. **adapt** text to context (names, tone, terminal commands)
4. **inject** it into wherever your cursor is

Only #2 is “speech-to-text.”
The rest is everything that makes the app feel like input instead of like a toy.

And each step has its own traps.

- capture: permissions, device switching, noisy environments
- transcribe: speed vs accuracy vs battery
- adapt: hallucinations, privacy, prompt design, latency
- inject: focus bugs, IME quirks, app-specific edge cases

## 2) The problem with “all local”: you just moved the latency around

I like the idea of running everything locally.
Less data leaving your machine. Less dependency. Less subscription nonsense.

But the hard part is: “local” doesn’t automatically mean “fast.”

If you want context-aware rewriting (correct names in email threads, different style in a terminal, etc.), you need a local LLM too.
Now you have a *second* model call in the loop.

Even if each model is “only” a couple seconds in the worst case, the combined experience becomes sticky.
And dictation punishes stickiness.

I’ve learned the annoying rule of thumb:

```text
2–3s feels like a tool
<1s feels like typing
```

If you’re trying to replace typing, you need to feel like typing.

## 3) Context awareness isn’t magic. It’s just extra state (and extra risk)

FreeFlow’s pitch mentions being context-aware — spelling names correctly based on who you’re replying to.
That’s legitimately useful.

But to do that, you either:

- read UI state (window title, selected text, recipients, etc.)
- or ask the user to structure context manually

Both have cost.

Reading UI state is brittle and can become a privacy footgun.
Manual context is safe but kills the “it just works” vibe.

This is the real engineering question:

```text
what context is worth paying for?
```

Not “can we do it.”

## 4) My take: dictation apps should publish their latency budget like an SLO

If I were building one of these products seriously, I’d treat end-to-end latency like a public contract.

- p50: < 600ms
- p95: < 1200ms
- timeouts: user sees partial text (don’t block input)

And the pipeline needs backpressure.
If you’re in a slow state (CPU busy, model cold, network bad), you should degrade gracefully instead of lying.

This sounds boring.
It’s also what makes “input” feel like input.

## 5) The subscription thing is annoying — but not the main story

Yes, it’s kind of ridiculous that some dictation apps charge ~$10/month.

But I don’t think the core competition is price.
It’s whether your brain starts to trust the loop.

If you hit the hotkey and you *know* text will land instantly and mostly right, you start speaking in sentences.
If you don’t, you start doing weird half phrases and corrections and you hate yourself.

That’s the difference between “neat demo” and “I can’t live without this.”

---

**References**
- [FreeFlow: free and open source alternative to Wispr Flow / Superwhisper / Monologue (project overview + download)](https://github.com/zachlatta/freeflow)
- [FreeFlow latest release download (for trying it yourself)](https://github.com/zachlatta/freeflow/releases/latest)
