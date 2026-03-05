---
layout: post
title: "AI-assisted rewrites won’t magically get you out of copyleft (the clean-room wall problem)"
date: 2026-03-05 06:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![AI-assisted rewrite and the relicensing trap](/img/posts/2026-03-05-ai-assisted-relicensing-01.webp)

Every few months, someone rediscovers the same fantasy:

> “What if we just rewrite the whole project and change the license?”

In 2026, you can swap “rewrite” with “ask an LLM to rewrite it,” and suddenly it *sounds* like a cheat code.

The chardet situation is a good reality check. It’s an old, widely-used Python library (often pulled in via requests), historically tied to LGPL baggage. Recently, maintainers shipped a new major version and relicensed it to MIT, reportedly after doing a large AI-assisted rewrite.

I’m not a lawyer. I’m also not here for open-source soap opera. But the technical + legal shape of this is interesting, because it exposes a problem we don’t have good vocabulary for yet: **the “clean-room wall” was designed for humans, and LLM workflows basically poke holes in it by default.**

## The clean-room idea is simple: separation

A classic clean-room rewrite has a pretty strict structure:

- Team A reads the original code and writes a functional spec
- Team B never sees the original code and implements from the spec

The whole point is that Team B can credibly say “we didn’t copy; we reimplemented.”

Now compare that with the *typical* AI-assisted workflow:

```text
prompt(original_code, "rewrite this") -> new_code
```

Even if the output is different line-by-line, the process is still informed by exposure to the original.

If your goal is “this is independent work,” then having the model ingest the original code is… kind of the opposite of building a wall.

## “But the AI didn’t copy any lines” is not the point

This is the part engineers (including me) tend to underestimate.

Copyleft questions are not only about literal copy/paste. They’re about whether the new work is considered **derivative** of the old work.

If you want to argue “this is a fresh implementation,” you usually lean on process:
- who saw what
- when
- what artifacts were produced
- what constraints were imposed

An LLM used as a transformation box muddies those facts:
- The maintainer *did* see the original code.
- The model was prompted with it (in many workflows).
- The output is produced by a system trained on broad corpora, and you don’t get an audit trail that maps idea → source.

So even if your diff looks “new,” you may still be stuck in what I’d call a **derivative trap**.

## And then there’s the copyright weirdness: “human authorship”

At almost the same time, there was mainstream coverage about US courts reinforcing a “human authorship” requirement for copyrightable works, in the context of AI-generated material.

That creates a really awkward triangle if your relicensing story depends on “the AI wrote it”:

1. If it’s truly AI-generated, do you even *own* copyright strongly enough to license it under MIT?
2. If it’s derived from LGPL code, can you relicence it away from LGPL at all?
3. If it’s neither clearly human-authored nor clean-room independent, what exactly are downstream users supposed to trust?

This is why “AI rewrite as a license escape hatch” feels shaky. Even if the outcome ends up being fine in practice, the reasoning is not clean.

## My take (as someone who ships software)

If you maintain a library with licensing constraints and you want to change that:

- The boring answer is still the real answer: track contributors, get permissions, or do an actual clean-room process.
- If you involve LLMs, you should treat “who/what saw the original code” as part of your compliance story, not an implementation detail.

I get why maintainers want out of copyleft friction. I also get why companies want simple licenses.

But if the community normalizes “feed GPL/LGPL code into a model and publish the output as MIT,” then copyleft basically becomes a vibe.

And if copyleft becomes a vibe, it stops being a tool.

---

**References:**
- [Tuan Anh: breakdown of the chardet relicensing dispute and the AI-assisted rewrite angle](https://tuananh.net/2026/03/05/relicensing-with-ai-assisted-rewrite/)
- [chardet v7.0.0 release notes (as referenced in the dispute)](https://github.com/chardet/chardet/releases/tag/7.0.0)
- [GitHub issue discussion: objections from the original author about “complete rewrite” claims](https://github.com/chardet/chardet/issues/327)
- [CNBC: coverage on the US Supreme Court declining to hear an AI copyright dispute (human authorship context)](https://www.cnbc.com/2026/03/02/us-supreme-court-declines-to-hear-dispute-over-copyrights-for-ai-generated-material.html)
