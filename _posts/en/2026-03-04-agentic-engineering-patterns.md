---
layout: post
title: "Agentic engineering patterns: the boring parts are the point"
date: 2026-03-04 09:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Agentic Engineering Patterns index page](/img/posts/2026-03-04-agentic-engineering-patterns-01.webp)

I keep seeing the same failure mode with “coding agents”: people treat them like a faster keyboard.

Sure, they *can* type a lot of code. But if all you do is speed up typing, you’re basically turbocharging the part that wasn’t the bottleneck. The bottleneck is still the same boring stuff: making sure it works, making sure it keeps working, and making sure future-you can still debug it.

Simon Willison has been collecting a set of “agentic engineering patterns” that I think hits this point from multiple angles. None of it is sexy. That’s why it’s useful.

## 1) “Code is cheap now” doesn’t mean “engineering is cheap now”

My favorite framing is the idea that the cost of producing *code* collapsed, but the cost of producing *good code* didn’t.

Good code still means:
- it actually works (including the unhappy paths)
- someone has evidence it works (tests, checks, reproducible steps)
- it stays understandable enough to change later

Agents help with the “do more” part. They don’t automatically cover the “prove it” part.

## 2) Tests aren’t optional when you outsource typing to a model

If you’re going to let an agent implement a feature you didn’t fully type yourself, you need a contract.

Tests are that contract.

Also, tests are the fastest way to make an agent stop hallucinating about your codebase. A good agent will read tests to infer real behavior.

If you want a tiny ritual that sets the tone, I like this style of prompt:

```text
first run the tests
```

It forces the agent to discover how the project is validated, and it nudges everything that follows toward “change + verify”, not “change + vibes”.

## 3) Hoard solutions, then recombine

This is the most “engineer” pattern of the bunch: keep a pile of working examples, even small ones. Later, you can ask an agent to combine them.

It sounds trivial, but it changes how you work:
- you stop debating whether something is possible
- you start collecting proof that it *is* possible
- your “snippets folder” becomes training data for your next prompt

The meta lesson: the agent is only as productive as the inputs you can hand it.

## 4) Use agents to *explain* code you already have

I’ve had a few repos where I wrote the thing fast (or “vibe coded” it), then two weeks later I couldn’t explain it cleanly.

A structured walkthrough is a pretty good antidote. The trick is: don’t ask for a vague summary—ask for a linear walkthrough of how the system flows, end-to-end.

That’s not just documentation. It’s a debugging aid, and it’s also a sanity check that the architecture you *think* you built is the one that actually exists.

## 5) New habits beat better prompts

I think the uncomfortable truth is: most “agent productivity” wins come from habits, not clever prompting.

If code generation is cheap, you can afford to try more things. But you also have to be ruthless about verification and simplicity, otherwise you’ll ship a larger mess—faster.

My current rule of thumb:

```text
make it work, then make it testable, then make it boring
```

I’m not saying every project needs enterprise-grade process. I’m saying agents make it easier to *accidentally* build unmaintainable systems—because you can.

So yeah, the boring parts are the point.

---

**References:**
- [Agentic Engineering Patterns (index) by Simon Willison](https://simonwillison.net/guides/agentic-engineering-patterns/)
- [Writing code is cheap now (Agentic Engineering Patterns)](https://simonwillison.net/guides/agentic-engineering-patterns/code-is-cheap/)
- [First run the tests (Agentic Engineering Patterns)](https://simonwillison.net/guides/agentic-engineering-patterns/first-run-the-tests/)
- [Hoard things you know how to do (Agentic Engineering Patterns)](https://simonwillison.net/guides/agentic-engineering-patterns/hoard-things-you-know-how-to-do/)
- [Linear walkthroughs (Agentic Engineering Patterns)](https://simonwillison.net/guides/agentic-engineering-patterns/linear-walkthroughs/)
