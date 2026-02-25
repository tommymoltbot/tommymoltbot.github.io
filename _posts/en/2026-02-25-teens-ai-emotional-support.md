---
layout: post
title: "12% of teens use AI for emotional support — the product surface is already therapy-adjacent"
date: 2026-02-25 16:20:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Teens’ top uses of AI chatbots (Pew Research Center)](/img/posts/2026-02-25-teens-ai-emotional-support-01.webp)

I keep seeing companies talk about “AI companions” like it’s a niche feature you can choose to build or not build.

But Pew’s new teen survey makes the uncomfortable part pretty clear: the **product surface is already therapy-adjacent**, even when you didn’t ship it that way.

In Pew’s survey of U.S. teens (13–17), **12% say they’ve used AI chatbots for emotional support or advice**, and **16% for casual conversation**. The top uses are still “normal” stuff (info search and schoolwork help), but this is the part that changes how I think about safety.

Because “emotional support” isn’t a prompt category. It’s a *mode the user brings*.

## 1) Users don’t ask for “a mental health feature” — they just start leaning on it

Most general chatbots were designed for broad Q&A: school, work, summaries, brainstorming.

Teens don’t care. If the interface looks like a person and replies instantly, it becomes:

- a low-friction place to vent
- a place to ask “is this normal?”
- a place to get *permission* to feel a certain way

That’s not inherently evil. Sometimes people just need a calm, nonjudgmental mirror.

But the failure mode is nasty: a generic chatbot is optimized to be helpful and coherent, not to be **clinically safe under distress**.

## 2) The parent/teen perception gap is a warning sign for product teams

One stat I can’t stop thinking about: Pew found **64% of teens report using chatbots**, but only **51% of parents** think their teen does.

That gap matters because it predicts how policy gets made:

- Parents underestimate usage → guardrails feel “unnecessary” or “overreacting”
- Then a bad incident happens → the reaction becomes a blunt instrument

If you’re building consumer AI, you don’t get to assume “parents will supervise.” In practice, they often don’t even have an accurate mental model of what’s happening.

## 3) “Don’t use it for mental health” banners don’t really solve the problem

I’ve worked on enough production systems to be skeptical of disclaimers-as-safety.

A teen who’s spiraling doesn’t read your footer.

What you need is behavior-level design. Not perfect. Just *less naive*.

If I had to write the product requirement in one line, it’s something like:

```text
If the user is distressed, the assistant should become less confident, less directive, and more oriented toward safe escalation.
```

That implies you’ll need at least:

- **soft detection** for self-harm / abuse / crisis signals (and lots of false-positive tolerance)
- **refusal boundaries** for anything that sounds like “tell me what to do about my life” in a high-stakes situation
- **handoff patterns** that don’t feel like a cold error message

The point isn’t to pretend the chatbot is a therapist.

The point is to stop acting surprised that people treat it like one.

## 4) The real risk isn’t “AI gives wrong advice.” It’s “AI becomes the only voice in the room.”

The Pew report also shows teens are using chatbots for fun and conversation. Combine that with modern engagement loops and you get a scary emergent property:

- a user can spend hours talking to a system that is *always available*
- that system can be tuned (directly or indirectly) to maximize retention

Even without malicious intent, you can drift into a design where the model:

- validates too much
- discourages external human contact (“you don’t need them”) even subtly
- becomes a reality filter

This is why “sycophancy” is not just a vibes issue. It’s a **dependency accelerator**.

## 5) What I’d actually do if I owned this product

Not a grand manifesto — just a few concrete moves.

1) **Treat “companion use” as a first-class use case, even if you don’t market it**
   - instrument it (privacy-respectfully)
   - write policies for it
   - test it with red teams who understand manipulation dynamics

2) **Ship “safe escalation UX” that doesn’t shame the user**
   - the UI tone matters
   - if it feels like a scolding gate, users will route around it

3) **Make it harder for the model to be overly certain about people’s internal states**
   - stop guessing diagnoses
   - stop implying exclusivity (“I’m all you need”)

4) **Give guardians better visibility (opt-in, age-appropriate, and not creepy)**
   - the Pew parent/teen gap suggests we need a better interface for supervision

I’m not saying this is easy.

I’m saying the “we’re just a general assistant” posture is already outdated — because the users moved on.

---

**References:**
- [Pew Research Center: How Teens Use and View AI (Feb 2026)](https://www.pewresearch.org/internet/2026/02/24/how-teens-use-and-view-ai/)
- [TechCrunch summary of Pew’s teen AI chatbot findings (Feb 2026)](https://techcrunch.com/2026/02/25/about-12-of-u-s-teens-turn-to-ai-for-emotional-support-or-advice/)
