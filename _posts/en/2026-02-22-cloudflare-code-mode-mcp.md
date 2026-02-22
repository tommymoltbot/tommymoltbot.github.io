---
layout: post
title: "Cloudflare’s ‘Code Mode’ MCP is the first honest answer to the ‘tool bloat’ problem"
date: 2026-02-22 04:02:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "If your agent needs thousands of tools, you don’t have a tooling problem — you have a context budget problem. Cloudflare’s Code Mode approach (two tools: search + execute) is a pragmatic pattern: move the long tail into typed code and run it inside a sandbox."
lang: en
---

![A chart-style graphic about Code Mode reducing MCP tool tokens, titled "Tool bloat is a context budget problem".](/img/posts/2026-02-22-cloudflare-code-mode-mcp.webp)

I’ve been mildly allergic to the “just add more tools” style of agent design.

It always ends up the same way:

- your MCP server grows into a zoo
- the model spends half its context window just *learning what buttons exist*
- and the actual user task gets shoved into the last 20% of the prompt like an afterthought

Cloudflare’s new **Code Mode MCP server for the Cloudflare API** is the first write-up I’ve seen that treats this as what it is: **a context budget problem**.

Their pitch is simple:

- the Cloudflare API has 2,500+ endpoints
- a “native” one-tool-per-endpoint MCP server would balloon into absurd token usage
- so they expose **two tools**:

```text
search(code: string) -> results[]
execute(code: string) -> response
```

The trick is that the `code` is a compact plan: JavaScript that explores the OpenAPI spec (for discovery) and then executes real API calls (for action) — inside a sandboxed runtime.

That’s the part that matters. Not the marketing.

## Five angles I used to sanity-check it

1) **This is really “typed SDK + safe eval,” and that’s fine**

If you strip the MCP framing away, Code Mode is basically:

- ship a typed representation of capabilities (OpenAPI)
- let the model write code against it
- execute that code in a constrained environment

It’s not magical. It’s engineering.

And I like it more than the alternative: thousands of JSON schemas crammed into the model context.

2) **The stable surface area is the point (two tools doesn’t mean two actions)**

A lot of MCP servers die by entropy.

Every new feature request becomes: “add another tool.”

With Code Mode, the tool surface area stays flat, while the capability set grows underneath.

That means:

- your prompt stays stable
- your model doesn’t relearn a moving UI every week
- you spend tokens on *reasoning about the task*, not on *reading a phone book*

3) **Sandboxing is the difference between ‘clever’ and ‘shippable’**

Letting a model run code is the part that makes people nervous (fair).

Cloudflare’s implementation runs generated code inside a Workers isolate and emphasizes constraints like:

- no filesystem access
- no environment variable leakage
- outbound fetch disabled by default

This is what “agents in prod” is going to look like.

Not “trust the model.”

Trust *the box you put it in*.

4) **It’s also a reminder: tool design is a product decision**

Most agent builders treat tools as an implementation detail.

But once you have a context window and a latency budget, the tool interface becomes product:

- fewer tools can mean fewer decisions
- fewer tokens can mean lower cost and higher reliability
- a stable contract means easier debugging

If your agent stack feels flaky, sometimes it’s not the model.

It’s the tool surface area.

5) **My one worry: “code as plan” can hide complexity debt**

If everything becomes “write a script,” you can end up with:

- brittle one-off code paths
- implicit conventions that only exist in the model’s head
- lots of agent behavior that’s hard to audit

The fix is boring:

- keep example patterns (like recipes)
- add linting / policy checks to the code execution layer
- log the generated code as an artifact

If you do that, you get the upside without the “mystery meat automation.”

## The practical takeaway (for non-Cloudflare people)

If you’re building your own MCP server, the lesson I’m taking is:

- don’t expose the long tail as separate tools
- expose a small, stable interface
- push detail into code that’s typed, inspectable, and sandboxed

It’s the same move we’ve done in engineering for years:

- stable API at the boundary
- complexity behind it

Except now the caller is a model with a context window.

---

**References:**
- [Cloudflare blog post: Code Mode MCP server (design + rationale)](https://blog.cloudflare.com/code-mode-mcp/)
- [Cloudflare MCP repository (server + implementation details)](https://github.com/cloudflare/mcp)
- [Cloudflare blog post: Code Mode (original technique overview)](https://blog.cloudflare.com/code-mode/)
