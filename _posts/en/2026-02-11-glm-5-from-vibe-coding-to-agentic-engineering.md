---
layout: post
title: "GLM-5 Isn’t the Point. The Point Is You’re Now Managing a System"
date: 2026-02-11 21:01:30
categories: AI
tags: AI
author: Tommy
lang: en
---

![GLM-5: from vibe coding to agentic engineering](/img/posts/2026-02-11-glm-5-agentic-engineering.webp)

I saw GLM-5’s launch post and my first reaction wasn’t “new model!”

It was: *oh, they’re explicitly optimizing for long-horizon agent work now.* Not chat. Not “help me write an email.” **Operational tasks**.

And that matters because the moment you move from *vibe coding* to *agentic engineering*, your failure modes change. You stop arguing about prompt cleverness and start arguing about contracts, traceability, and what your system is allowed to touch.

GLM-5 is marketing itself as “for complex systems engineering and long-horizon agentic tasks,” with big numbers (744B total parameters, 40B active; more data; sparse attention; etc.). Cool.

But the more interesting part to me is the implied product requirement:

> You can’t ship “agents” if you can’t make their actions legible.

If you’ve ever tried to run a coding agent on a real repo, you already know the pain: it reads *something*, searches *something*, edits *something*, and you’re staring at a generic line like:

```text
Read 3 files.
Searched for 13 patterns.
```

That’s not observability. That’s vibes with a receipt printer.

So here’s the angle I care about: **“Agentic models” are forcing the ecosystem to admit that UX is part of correctness.**

## 1) The hidden tax of long-horizon work: you need an audit trail

In short tasks, you can eyeball it.

In long-horizon tasks (hours, days, multiple sub-agents), you can’t. You need to be able to answer, quickly:

- What did it read?
- What did it search for?
- What did it change?
- What did it *try* to do but got blocked?

If any of those are “expand a collapsed UI element and hope you remember,” your system doesn’t scale.

This is why people get mad when tools hide file paths or search patterns in the default view. It’s not about being picky. It’s about being able to debug and to trust.

## 2) “Verbose mode” is not a solution; it’s a failure to design a middle layer

There’s a recurring anti-pattern in dev tools:

- Users complain: “I need one specific piece of context.”
- Vendor replies: “Use verbose mode.”

Verbose mode is a firehose. It’s *diagnostics*, not *workflow*.

When I’m reviewing an agent run, I don’t want full transcripts and walls of text. I want **identifiers**:

```text
Read: src/auth/policy.ts
Search: "token_exchange"
Edit: _posts/en/2026-02-11-....md
```

That’s the “middle layer”: compact, glanceable, and actionable.

Agentic engineering is basically the discipline of building that middle layer everywhere:

- in the runtime,
- in the tools,
- in the UI,
- and in the operator’s habits.

## 3) Model capability is now coupled to tool contracts

A long-horizon model without tool contracts is just a very confident intern.

If your tools don’t have strict schemas, if your reads/writes aren’t versioned, if you can’t validate requests and responses, you don’t have “agents.” You have nondeterministic automation.

And once you have nondeterministic automation touching prod, you’ll rediscover an old truth:

> Reliability is mostly boring process.

Pin versions. Log the right identifiers. Make outputs replayable. Keep the contracts stable.

## 4) My honest take on GLM-5

I’m not saying GLM-5 is bad or good. I haven’t benchmarked it, and I’m allergic to taking launch posts at face value.

But I *do* think it’s useful as a signal:

- More teams will build agent products.
- More teams will hit the “I can’t see what it did” wall.
- More teams will realize the agent UX is part of the safety model.

If you’re building in this space, my advice is boring on purpose:

- Don’t hide identifiers.
- Don’t confuse “less noise” with “less information.”
- Treat every tool call like a mini-API: schema, version, audit.

That’s the difference between a demo that feels magical and a system you can live with.

---

**References:**
- [GLM-5 launch post: “From Vibe Coding to Agentic Engineering”](https://z.ai/blog/glm-5)
- [GitHub issue: request to show file paths in Claude Code’s collapsed READ view](https://github.com/anthropics/claude-code/issues/21151)
- [Essay: “Claude Code Is Being Dumbed Down” (discussion of the collapsed tool output change)](https://symmetrybreak.ing/blog/claude-code-is-being-dumbed-down/)
