---
layout: post
title: "Evo 2 makes genomes feel like text. That’s exciting—and a little scary."
date: 2026-03-05 10:20:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Evo 2 and genomes](/img/posts/2026-03-05-evo2-genome-model-01.webp)

I’ve always had this mental boundary:

- LLMs are great at *human text*.
- biology is messy, slow, and you can’t “unit test” a cell the way you test an API.

Then I read about **Evo 2**, an open model trained on **trillions of DNA bases** across bacteria, archaea, and eukaryotes.

The vibe is: *treat the genome like a language*, learn the patterns at scale, and suddenly you can do “zero-shot” predictions about splice sites, regulatory regions, and mutation severity.

If this holds up, it’s one of those moments where the “LLM trick” stops being a software thing and starts biting into real science.

## Thought #1: the real win is not generation—it’s compression

People hear “genome model” and jump straight to *designing* new proteins or DNA.

But the more practical superpower is this:

- take a 3-billion-base genome
- compress it into a representation that makes **weak, distributed signals** legible

In software terms, it’s like turning a massive, unstructured log stream into a schema you can actually query.

## Thought #2: long context is the point (biology has “dependencies” too)

What made Evo 2 interesting to me is the training setup described in the coverage:

- short windows (thousands of bases) to learn local “grammar”
- then **very long windows** (up to a million bases) to learn large-scale structure

That maps to the real problem in eukaryotic genomes:

- introns
- scattered regulatory DNA
- signals that look like “45% of the time it’s a T” instead of a clean signature

So yeah, this is the same story as software agents: if you only ever train on short tasks, you’ll fail when the job has long-range coupling.

## Thought #3: zero-shot is cool, but “production reality” is evaluation

I don’t care how beautiful the paper is—biology is a graveyard of models that looked good on curated benchmarks.

If you want this to be production-grade (for researchers), you need boring questions answered:

- what’s the false positive rate when you annotate an entire genome?
- what happens on weird species, weird sequencing errors, weird GC-content?
- can you quantify uncertainty in a way that scientists can act on?

“Better than specialized tools” is promising, but the real bar is: **does it save humans time without creating silent failure modes**.

## Thought #4: open weights + bio capabilities means governance is not optional

The Evo 2 team reportedly excluded eukaryotic viruses from training because they worried about misuse.

That’s… a very engineering-flavored decision. Not perfect, but at least it acknowledges a reality:

- capability is a spectrum
- distribution matters
- “open” is a choice with downstream consequences

I like open science. I also like not living in a world where every sharp tool is instantly commoditized.

## Thought #5: the “LLM era” is quietly becoming a tooling era

What I take away isn’t “AI will solve biology.”

It’s more like:

- we keep finding domains where the data is huge
- the signals are subtle
- and humans are bottlenecked by attention

So the winning move becomes: build models that *index reality*, then build workflows around them.

Same as code. Same as security logs. Same as genomics.

If you’re an engineer reading this: don’t wait until it’s “mature.” Start learning how evaluation, uncertainty, and safety constraints work in domains where you can’t just roll back a deploy.

---

**References:**
- [Ars Technica coverage: “Large genome model: Open source AI trained on trillions of bases”](https://arstechnica.com/science/2026/03/large-genome-model-open-source-ai-trained-on-trillions-of-bases/)
- [Nature paper DOI landing page for the Evo 2 work](https://doi.org/10.1038/s41586-026-10176-5)
- [StripedHyena 2 arXiv preprint (foundation model architecture mentioned in the coverage)](https://arxiv.org/abs/2503.01868)
