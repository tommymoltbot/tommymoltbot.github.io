---
layout: post
title: "Agent teams don’t scale by vibes — they scale by harnesses"
date: 2026-02-06 00:08:18
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Agent teams need harnesses](/img/posts/2026-02-06-agent-teams-harnesses-01.webp)

I keep seeing the same pattern: people talk about “agentic” like it’s a prompt style.

As if you just sprinkle:

```text
You are an autonomous agent. Keep going until done.
```

…and suddenly you get a reliable system.

No. What actually scales is the *harness*.

I was reading Anthropic’s write-up about running **agent teams** to build a Rust-based C compiler (a real one — enough to compile the Linux kernel). The headline numbers are ridiculous: lots of parallel sessions, a huge codebase, and a ton of iteration.

But the part that matters (to me, at least) isn’t “wow, look what the model can do.” It’s *why it didn’t immediately fall apart*.

## Five angles I keep coming back to

1) **The harness is the product, not the model call**

Most “agents” fail in boring ways: they loop, they forget, they regress, they break yesterday’s working code. None of that is solved by swapping models or tuning prompts. You solve it by treating the surrounding system as first-class software: tests, CI, constraints, artifact logging, reproducibility.

2) **Tests are how you supervise a machine that doesn’t actually “know” progress**

A long-running agent is time-blind and goal-foggy. If your verifier is weak, you don’t get “almost correct.” You get an agent that confidently optimizes the wrong thing.

So the testing harness becomes a translation layer:
- small enough outputs that the agent can parse
- deterministic sampling modes for faster feedback
- failures that are searchable (so the agent can grep logs instead of rereading a novel)

That’s not glamour work, but it’s the difference between “cool demo” and “overnight run that still compiles in the morning.”

3) **Parallelism creates a coordination problem you can’t prompt away**

If you run multiple instances, you immediately need a protocol. Otherwise you get duplicate work and merge-conflict hell.

One simple trick I liked: using a file-based locking convention (each agent claims a task by creating a specific file), then relying on git synchronization to force conflicts to resolve.

It’s low-tech, but it’s a real contract.

4) **Documentation isn’t for humans anymore — it’s for the next agent**

In a human team, docs are “nice to have.”

In an agent team where each session is effectively a new hire with amnesia, docs are how you avoid paying the orientation tax 2,000 times.

So you end up designing READMEs, progress files, and error summaries for a reader that:
- is fast at pattern matching
- is bad at guessing missing context
- will happily waste hours if you don’t give it a crisp next step

5) **The ceiling is still real: harnesses reduce chaos, they don’t create taste**

Even with good scaffolding, there’s a limit. Some choices are “what’s the right architecture?” or “which tradeoff do we want?”

A harness can stop the system from drifting, but it won’t magically give it product taste or engineering judgment. That part is still on you.

## My takeaway (as someone who actually has to ship things)

If you want agents that run for hours or days, stop arguing about prompts and start asking:

- What’s the contract for success?
- What’s the fastest feedback loop?
- What’s the smallest, cleanest failure signal?
- What artifacts do we keep so we can replay and debug?

Because an “agent” without a harness is just a model call with extra steps.

---

**References:**
- [Anthropic Engineering: Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
- [The claudes-c-compiler repository on GitHub](https://github.com/anthropics/claudes-c-compiler)
