---
layout: post
title: "From 'predict the next word' to real critique: why refinement tools feel like magic"
date: 2026-02-26 15:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![From next-token to critique](/img/posts/2026-02-26-next-word-refine-01.webp)

John Cochrane (the “Grumpy Economist”) wrote a short post after trying an academic “refinement” tool called Refine.
His line was basically: *“I don’t know how you get here from ‘predict the next word.’”*

Honestly, same.

But I think I *do* know how you get here.
Not in a mystical way — in a boring engineering way.

Five thoughts.

## Thought #1: “Predict the next token” is the training objective, not the product

People repeat “it’s just next-token prediction” like it’s an insult.
To me it’s more like saying:

- a CPU “just” flips transistors
- a compiler “just” rewrites strings

Sure. And out the other side you get flight control software.

The objective is simple, but the dataset is huge and the behavior you can *compress* into weights is surprisingly rich:
- critique patterns
- common failure modes
- what good reviewers look for
- how arguments tend to fall apart

Refine didn’t “understand economics.”
It learned to *sound like someone who has read thousands of papers and referee reports*, then apply that style to your draft.

## Thought #2: Refinement is basically “search in writing-space”

If you ask a model to draft from scratch, it has too many degrees of freedom.
It can confidently write garbage and you’ll only notice 40 paragraphs later.

Refinement tools have a huge advantage:
- the input already contains *your* structure
- the tool can anchor on concrete claims and concrete sections
- it can propose targeted edits instead of inventing new worlds

In other words, the model is doing something closer to:

```text
suggest_improvements(draft) -> {claims_to_strengthen, missing_evidence, unclear_terms, math_errors}
```

That’s a more bounded problem than “write a paper.”
Bounded problems are where LLMs stop looking like toys.

## Thought #3: The real magic is *judgment-shaped text*, not “reasoning”

Cochrane describes Refine pointing out circularity risk, missing observables, unclear identification, and even algebra errors.

Those things feel like “reasoning,” but a lot of it is:
- a learned checklist of what strong critique looks like
- pattern matching against thousands of past critiques
- the ability to keep a thread across a long document

If you’ve ever read a great code review, it’s the same vibe:
- not flashy
- not philosophical
- just relentlessly specific

## Thought #4: This is exactly where “AI for knowledge work” starts to pay for itself

If you’re writing anything serious — paper, design doc, proposal, ADR — the time cost is not the typing.
It’s the back-and-forth:
- “your argument is right but your evidence is weak”
- “define terms earlier”
- “this section contradicts the previous one”
- “you’re claiming causality but you only have correlation”

A refinement tool is basically a fast, repeatable reviewer who never gets tired.
You still have to decide what to accept.
But the *queue* moves.

That’s the kind of automation I’m happy to see.
Not “replace writers.”
More like “reduce the number of dumb iterations.”

## Thought #5: New literacy: write for humans *and* for reviewers-that-are-models

Cochrane ends with a worry I share: people will read less original work and more “LLM digests.”

If that’s true, then the practical game becomes:
- make your work easy to parse
- make claims explicit
- attach evidence clearly
- don’t bury assumptions in vibe

Not because “SEO.”
Because the reviewers are now partially machines — and machines reward clarity.

I don’t love that future.
But if it’s coming anyway, the best move is probably to be the person whose writing survives the pipeline.

---

**References:**
- [Cochrane’s post on trying Refine (and the “predict the next word” quote)](https://www.grumpy-economist.com/p/refine)
- [Refine product page (academic writing refinement tool)](https://www.refine.ink)
- [Hacker News discussion: “I don't know how you get here from \"predict the next word.\"”](https://news.ycombinator.com/item?id=47162059)
