---
layout: post
title: "‘continvoucly morged’ is funny. the process behind it isn’t."
date: 2026-02-18 07:00:00 +0000
categories: [Tech]
tags: [Tech]
author: Tommy
excerpt: "A Microsoft Learn page reportedly shipped an AI-mangled version of a well-known Git branching diagram. The meme is great. The underlying workflow — ‘wash off the fingerprints and publish’ — is the part that should make engineers uncomfortable."
lang: en
---

![A dark diagram-style thumbnail with the phrase “continvoucly morged”](/img/posts/2026-02-18-continvoucly-morged-01.webp)

I laughed when I first saw the phrase.

```text
continvoucly morged
```

It has the perfect "AI hallucinated typography" energy: you can *feel* a human word trying to escape a machine.

But the story around it is less funny.

Vincent Driessen (the author of the widely-referenced post *A successful Git branching model*) wrote about finding what looks like an AI-generated knockoff of his diagram on Microsoft Learn — published without attribution or even a link back to the original.

The diagram itself isn’t the point.

The point is the workflow it implies.

## Five angles I use to judge “AI-generated docs” when the input was somebody else’s work

1) **Business angle:** if you’re Microsoft-sized, the cost of attribution is basically zero — and the downside of not doing it is reputation debt.

2) **Engineering angle:** a good doc pipeline has the same property as a good deploy pipeline: it’s hard to ship garbage.

3) **Quality angle:** this is the cruel part — the original diagram is *already good*. Running it through a model to make it worse isn’t “automation”, it’s value destruction.

4) **Process angle:** this is what bothers me most. There’s a distinct vibe of: “generate an asset, ship it, nobody checks it.” That’s not an AI problem. That’s a review culture problem.

5) **Long-term angle:** this one got caught because the original is famous *and* the artifact was meme-level obvious. Most creators aren’t that lucky.

## The uncomfortable pattern: “wash off the fingerprints”

I’m not mad at copying.

People have reused that Git branching diagram for years: in slides, wikis, internal onboarding docs. That’s how the internet works.

What’s new is the attempt to launder the origin:

- take a thing that someone clearly made with care
- run it through a generator
- publish the mutation as “new”

This isn’t inspiration.

It’s the opposite.

## Why this matters to engineers (not just artists)

If you ship software, you already know the shape of this failure:

- a tool makes output cheaper
- the organization mistakes *volume* for *progress*
- review pressure drops because “it’s just docs”
- quality quietly rots until users stop trusting the surface

Docs are part of your product.

If they’re unreliable, your product feels unreliable.

And if your docs pipeline normalizes unattributed “AI remixing”, you’re teaching your org a habit that will leak into code, specs, and decisions.

## What “good” would look like (boringly)

If I were building an AI-assisted docs workflow, I’d insist on three boring rules:

- **Attribution is default.** If the input is external, the output needs a reference.
- **Human review is mandatory for visuals.** If it’s a diagram, treat it like UI.
- **You track sources like dependencies.** If you can audit libraries, you can audit assets.

None of these rules are anti-AI.

They’re pro-responsibility.

## My bottom line

The meme is great.

But if “continvoucly morged” is what it takes for a huge company to notice a broken process, that’s… not a win.

It’s a warning sign.

---

## References

- [Vincent Driessen’s post: “15+ years later, Microsoft morged my diagram”](https://nvie.com/posts/15-years-later/)
- [Vincent Driessen’s original article: “A successful Git branching model”](https://nvie.com/posts/a-successful-git-branching-model/)
