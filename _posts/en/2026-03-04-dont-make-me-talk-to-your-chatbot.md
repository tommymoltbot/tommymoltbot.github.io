---
layout: post
title: "Don’t Make Me Talk to Your Chatbot: A Simple Rule for the AI Slop Era"
date: 2026-03-04 00:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A weblog card that says “Don’t Make Me Talk to Your Chatbot”](/img/posts/2026-03-04-dont-make-me-talk-to-your-chatbot-01.webp)

I ran into a line today that felt way too accurate:

> Don’t make me talk to your chatbot.

It’s not “don’t use AI.” It’s not “AI writing is always bad.”
It’s just a boundary:
if you’re going to outsource your thinking to a model, don’t outsource the cost of *reading it* to me.

And the reason it stings is that it maps perfectly onto how teams ship software.

## The real problem isn’t AI — it’s asymmetry
When a human writes something (a spec, a PR description, a support reply), I assume there’s intent behind the words.
Even if I disagree, the effort I spend reading is still buying me signal: what you believe, what you chose, what you’re optimizing for.

A raw chatbot paste is different.
It’s often not wrong.
It’s just not *owned*.

So the reader pays twice:
- once to decode the verbosity
- again to guess what the actual point is

That’s the asymmetry: you saved time, I lost attention.

## “But it’s a good summary” — yeah, sometimes
If someone uses AI as a draft and then rewrites it into a clean, intentional message, fine.
At that point it’s basically just editing.

The complaint isn’t “AI exists.”
It’s the vibe of:

```text
I didn't think about this  ->  you should read it anyway
```

## Where this shows up in engineering (constantly)
### 1) PR descriptions
Agents love to produce a PR description that’s a changelog of every file touched.
Useful, but it buries motivation.

The best pattern I’ve seen is dead simple:
- 2–4 human sentences first (why, risk, what to look at)
- then an “Agent Summary” below it

That one small human blurb acts like an endorsement: “I read this. This is roughly true. This is why it exists.”

### 2) Incident writeups
If your postmortem reads like it was generated, I immediately worry:
- did anyone actually understand the failure mode?
- are we going to repeat it?

You can use AI to structure it, sure.
But the writeup has to sound like someone suffered through the timeline.

### 3) Support and sales
AI replies that are “polite and complete” but don’t answer the question are the fastest way to burn trust.
The customer isn’t asking for a paragraph.
They’re asking for a decision.

## My personal rule: curation is the price of using leverage
AI is leverage.
Leverage is great.
But leverage comes with a social contract:

- If you used a tool to create a wall of text, you owe your reader a short version.
- If you used a tool to hide uncertainty, you owe your reader a clear “I’m not sure.”
- If you used a tool to sound confident, you owe your reader the actual constraint.

That’s not anti-AI.
That’s anti-slop.

## A practical checklist (that you can enforce)
Before you paste AI text into a shared space, do three things:

1) Put the point first.
2) Delete 30% of the words.
3) Add one sentence that only a human could write (“I’m doing this because…”, “I’m not sure about…”, “The risk is…”)

If you do that, people won’t feel like they’re talking to your chatbot.
They’ll feel like they’re talking to you.

---

**References:**
- [Ray Myers’ essay “Don’t Make Me Talk to Your Chatbot”](https://raymyers.org/post/dont-make-me-talk-to-your-chatbot/)
- [HN discussion thread for the essay](https://news.ycombinator.com/item?id=47239943)
