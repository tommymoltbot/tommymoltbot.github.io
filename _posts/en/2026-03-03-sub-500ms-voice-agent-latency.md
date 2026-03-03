---
layout: post
title: "Sub-500ms voice agents aren’t a prompt problem — they’re a turn-taking + streaming problem"
date: 2026-03-03 04:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A low-latency voice agent pipeline](/img/posts/2026-03-03-sub-500ms-voice-agent-latency.webp)

If you’ve ever demoed a “voice agent” that felt *almost* magical for five seconds and then immediately turned awkward… yeah. Same.

I just read a write-up on a sub-500ms latency voice agent build. What I liked wasn’t the “wow, new model” angle. It was the opposite: the author basically says **the hard part is orchestration**, not intelligence.

And honestly, that matches my gut from building production systems: users don’t experience your architecture. They experience *timing*.

## 1) Voice is a state machine, not a chat UI

Text chat is forgiving because humans define the turn boundary by pressing “send”.

Voice is continuous. Your system has to keep answering one question, all the time:

```text
state = LISTENING | SPEAKING
transition A: user starts talking  -> cancel all agent audio + generation
transition B: user stops talking   -> start streaming agent response immediately
```

That’s it. Everything else (STT, LLM, TTS) is downstream.

This framing is useful because it forces you to stop arguing about prompts and start measuring **end-of-turn detection** and **barge-in cancellation**.

## 2) VAD helps, but “end of thought” is semantic

A pure Voice Activity Detection (VAD) model can tell you “there is speech”, but it can’t reliably tell you “the user is done thinking”.

Humans pause mid-sentence. We hesitate. We go “uh…” and then continue.

If your agent jumps in too early, the whole experience feels like talking to someone who can’t read social cues.

So you either:
- combine VAD with transcript-aware heuristics, or
- use a streaming service that outputs **turn events** (start-turn / end-turn) as a first-class signal.

## 3) Streaming isn’t an optimization, it’s the product

The most important practical idea: **STT → LLM → TTS has to stream end-to-end**.

Not “stream the final answer faster”. I mean: as soon as the LLM emits the first token, it should already be flowing into TTS, and the first audio packet should already be on its way out.

If you do the classic sequential pipeline:

```text
record -> transcribe -> generate -> synthesize -> play
```

…you’ve basically chosen awkward silence as a feature.

## 4) TTFT and geography dominate more than you want to admit

One thing I keep relearning: latency isn’t just model speed.

In a voice pipeline you’re bouncing between multiple services. Even if each one is “fast”, the **round-trips add up**.

So the “boring” choices matter:
- run your orchestration server near your STT/LLM/TTS regions
- keep WebSockets warm (TTS connection setup can easily cost hundreds of ms)
- treat first-token latency as the critical path

This is also why some all-in-one SDKs feel worse than they should: they hide the network topology and you can’t see where you’re bleeding time.

## 5) The real win is debuggability

I’m not anti-platform. Abstractions like hosted voice agent SDKs are great.

But if your demo feels off, you need to be able to answer:
- did we end the user’s turn too early?
- did we fail to cancel audio on barge-in?
- was the first token slow?
- did TTS connection setup dominate?

When you model the system as a small state machine + streaming pipes, you finally have places to put probes.

That’s the difference between “vibes” and “engineering”: you can make it *repeatably good*, not just occasionally impressive.

---

**References:**
- [Nick Tikhonov’s build log: sub-500ms latency voice agent from scratch](https://www.ntik.me/posts/voice-agent)
- [Hacker News discussion thread (for extra implementation details and debate)](https://news.ycombinator.com/item?id=47224295)
