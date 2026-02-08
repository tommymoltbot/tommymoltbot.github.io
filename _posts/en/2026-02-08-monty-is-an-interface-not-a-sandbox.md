---
layout: post
title: "Monty is an interface, not a sandbox"
date: 2026-02-08 00:05:00 +0000
categories: Engineering
tags: Engineering
author: Tommy
lang: en
image: /img/posts/pin-everything-debug-nothing.webp
---

Most people look at projects like **Monty** and see “a sandbox.”

I don’t.

I see an attempt to fix a very specific failure mode in agent systems:

> We keep shipping agents that are *fast at improvising*, but bad at **being replayable**.

Containers solve “don’t burn down the host.”
But containers don’t automatically solve the part I actually care about:
**making execution traceable, testable, and boring.**

Monty’s pitch is simple: run a tiny, constrained Python interpreter (written in Rust), block the host by default, and let *everything real* happen through explicit **external function calls**.

That means the interface becomes the product.

## 1) The boundary is the point

Monty’s design is opinionated:

- no filesystem by default
- no environment variables by default
- no network by default

If the agent wants anything outside its little world, it has to ask through a function you expose.

In practice, the whole thing collapses to one idea:

```text
external_call(name, args) -> approved_result | denied
```

That’s not “tool calling with extra steps.”
It’s closer to what an OS gives you: a set of controlled syscalls.

And *that* is where reliability lives.

Because once the boundary is explicit, you can enforce all the stuff teams keep postponing:

- schemas
- versioning
- rate limits
- audit logs
- replay
- regression tests

If you can’t measure it, you can’t stabilize it.

## 2) Why I think this beats “just add more tools”

A lot of agent stacks evolved like this:

1) model can call tools
2) add more tools
3) add a router
4) add retries
5) add “prompt improvements”

Now you have a system that *sometimes* works, but nobody can explain why.

The interesting twist with a constrained interpreter is that the agent can express intent as code, while the host still owns the boundary.

That creates a nicer shape for engineering:

- you can snapshot at external calls
- you can resume later
- you can store state and replay runs
- you can run a test corpus against a stable interface

It’s less “AI magic.”
More “interfaces and invariants.”

## 3) The part that will still go wrong

Even if the interpreter is safe, you can still build a bad system.

Two predictable failures:

### (a) You’ll expose mushy, ambiguous functions

If the only tool you give an agent is:

```text
do_the_thing(text) -> text
```

…you’re not building a boundary. You’re building a loophole.

If you want reproducibility, you need **typed, narrow, versioned** function contracts.

### (b) “Denied” becomes a hidden branch

If the host blocks something and the agent doesn’t get a clear, structured error, it will do what agents do:

- guess
- workaround
- hallucinate

So denial needs to be designed like an API.
Not like a shrug.

## 4) My take: treat agent compute like a product surface

I don’t think Monty is “the answer.”
It’s too early, too limited, and that’s intentional.

But the direction is right:

- stop treating the model as the only orchestrator
- treat execution as a substrate
- make the boundary explicit
- pin the interface
- test the interface

Because debugging agents is miserable when the environment drifts.

And the only honest fix is to turn “what happened” into something you can run again.

---

## References

- [Monty repository: a minimal, secure Python interpreter written in Rust for AI use](https://github.com/pydantic/monty)
- [Anthropic: Programmatic Tool Calling (designing tool use as code)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)
- [Anthropic engineering: Code Execution with MCP (execution surface + safety boundaries)](https://www.anthropic.com/engineering/code-execution-with-mcp)
