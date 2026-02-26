---
layout: post
title: "Codex ↔ Figma via MCP is cool — but it moves merge conflicts upstream"
date: 2026-02-26 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A cover image about Codex and Figma working together](/img/posts/2026-02-26-figma-codex-mcp-01.webp)

I think the Codex ↔ Figma integration is genuinely a big deal.
Not because “design to code” is new — we’ve had that pitch forever — but because this is the first time it looks like a *round-trip* might be normal.

Design context flows into the coding agent, and rendered UI can flow back into the canvas as editable layers.
If teams actually do this daily, the workflow changes.

Also: it creates a new class of problems that most teams are not set up for.

Five thoughts.

## Thought #1: The killer feature isn’t codegen — it’s shared context

If you’ve ever tried to implement a Figma file with a design system, you know the pain:
- spacing tokens are “close enough”
- a component looks right but the states are missing
- you ship something that matches the screenshot but not the *system*

The whole point of MCP here is: the agent can pull structured design context (layout, styles, components, variables) instead of guessing.

When the agent can reliably do something like:

```text
get_design_context(figma_selection_url) -> {layout, styles, components, variables}
```

…then you stop arguing about pixels and start arguing about intent.
That’s an upgrade.

## Thought #2: Round-tripping UI back into Figma is going to be a “diff” problem, not a “generation” problem

The part that caught my eye is pushing *running UI* back into Figma frames.

```text
generate_figma_design(live_url_or_localhost) -> figma_file_url
```

This is great for:
- comparing flows side-by-side
- quickly exploring alternatives
- having designers comment on something that’s already real

But the second you do this repeatedly, you’ve basically invented:
- “the code produced these layers”
- “the designer adjusted these layers”
- “now translate that back into code changes”

That’s not just “design to code.”
That’s *version control between two representations*.

## Thought #3: The real merge conflict will be between “spec” and “implementation”

Git merge conflicts are annoying, but at least they’re explicit.
You see the hunks.
You resolve them.

Design/code round-tripping creates a softer, more dangerous conflict:
- a designer updates a component variant
- an agent regenerates markup
- your codebase has local exceptions, hacks, feature flags, and performance tradeoffs

Now what?

If your system can’t answer:

```text
why_did_this_ui_change(hunk_or_layer) -> explanation + source
```

…you’ll end up with “mysterious UI drift.”
And people *hate* that.

## Thought #4: Teams will need an audit trail for UI decisions (like code already has)

In a healthy engineering org, code changes come with:
- PRs
- reviewers
- commit history
- rollbacks

Design changes often don’t.
Not at the same granularity.

Once design is part of a fast agent loop, the lack of auditability becomes a productivity tax:
- Who changed this?
- Was it intentional?
- What prompt caused it?
- Can we roll it back without breaking 3 other screens?

My bet: the next “real” feature isn’t more generation.
It’s better *diffs*, better *provenance*, better *rollback stories* across canvas ↔ code.

## Thought #5: This won’t replace designers or engineers — it’ll pressure everyone to be more explicit

The integration pitch says “engineers can iterate visually” and “designers can work closer to implementation.”
I buy that.

But it also means:
- design systems need tighter contracts
- components need clearer state models
- acceptance criteria can’t be vibes

The agent can move fast.
If your spec is fuzzy, it will move fast in the wrong direction.

I’m optimistic, but I’m also pretty sure the first wave of teams will learn the hard way:
round-tripping makes it easier to build on your best ideas — and also easier to accidentally overwrite them.

---

**References:**
- [OpenAI developer blog: building frontend UIs with Codex and Figma (MCP round-trip workflow)](https://developers.openai.com/blog/building-frontend-uis-with-codex-and-figma)
- [Figma Help Center: guide to the Figma MCP server (what it can do and how to connect)](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
- [TechCrunch coverage: Figma partners with OpenAI to bake in support for Codex](https://techcrunch.com/2026/02/26/figma-partners-with-openai-to-bake-in-support-for-codex/)
- [Figma developer docs: tools and prompts for the Figma MCP server](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)