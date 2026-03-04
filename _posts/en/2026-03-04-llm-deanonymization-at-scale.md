---
layout: post
title: "LLMs turned de-anonymization into a product feature"
date: 2026-03-04 06:14:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![A chart showing how small details can re-identify people](/img/posts/2026-03-04-llm-deanonymization-01.webp)

I used to think “don’t post your real name” was a decent baseline for staying semi-anonymous online.

It’s not.

What changed isn’t that people suddenly got more careless. It’s that LLM agents can take messy, free-form text (an interview transcript, a Reddit history, a questionnaire) and do the annoying human part automatically:

- extract identity signals (job, city, niche hobbies, timelines)
- search the web like a bored investigator
- cross-check candidates until one fits

That workflow existed before. What’s new is: it’s now cheap, scalable, and doesn’t require a clean “dataset A joins dataset B” setup.

## “7% recall” sounds small until you realize what it implies

In one experiment reported publicly, an agent used answers from an anonymized questionnaire and correctly identified about 7% of 125 participants.

If you’re looking for a headline number, 7% doesn’t sound like the end of the world.

But as an engineer, the scary part is the direction, not the current score:

- The system already works **sometimes** with **weak signals**.
- The cost is mostly compute + browsing time.
- As models get better at tool use + reasoning + search, the success rate will trend upward.

And unlike “traditional” deanonymization attacks, you don’t need a tidy schema. Humans don’t talk in schemas. LLMs don’t care.

## The real problem: your identity is a pile of boring coincidences

Most “pseudonymous” people aren’t hiding a single secret. They’re leaking dozens of mundane facts:

- the one weird conference you attended
- the exact combo of tech stack + industry
- a relocation window
- a hyper-specific hobby

Individually, none of those is identifying. Together, it becomes a fingerprint.

LLM agents are basically fingerprint collectors.

## This is a product feature now: unstructured → structured → lookup → verify

If I had to describe the core capability as a spec, it’s something like:

```text
reidentify(free_text) -> { candidates[], best_match?, evidence[] }
```

The “free_text → structured claims” step is the multiplier. Once the agent turns vibes into constraints, the rest is just search + filtering.

And yeah, it’s the same pattern we celebrate in RAG/agent workflows… just pointed at people.

## What should you actually do with this information?

Not “delete your account.” That’s not realistic.

But if you publish anything that mentions real humans (users, interviewees, employees), or you run a community where people *assume* pseudonymity is safe, you probably need to update your threat model:

1. **Treat anonymized transcripts as risky artifacts.** Redact *combinations*, not just names.
2. **Don’t publish raw long-form histories.** Even harmless stuff like “movies you liked” can be identifying when it’s enough of it.
3. **Assume cross-site correlation is trivial.** If a human can google it, an agent can do it at scale.
4. **Be honest about “anonymous.”** Most systems only provide “not immediately obvious,” not “untraceable.”

I’m not saying this to be paranoid. I’m saying it because this is exactly the kind of capability that gets quietly embedded into “analytics,” “trust & safety,” and “investigations” tooling.

And once it’s a checkbox feature, it’s not going away.

---

**References:**
- [Ars Technica report on LLM agents re-identifying pseudonymous users](https://arstechnica.com/security/2026/03/llms-can-unmask-pseudonymous-users-at-scale-with-surprising-accuracy/)
- [arXiv paper PDF: LLM agents for automated deanonymization (PDF)](https://arxiv.org/pdf/2602.16800)
