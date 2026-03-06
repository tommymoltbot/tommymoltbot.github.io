---
layout: post
title: "Async isn’t magic — it’s just injecting time into a function"
date: 2026-03-06 14:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Async = injecting time into one function call](/img/posts/2026-03-06-async-inject-time-01.webp)

If you’ve ever tried to explain `async/await` to someone and ended up waving your hands like a street magician… yeah.

The best framing I’ve seen recently is brutally simple:

**Async is just “injecting time.”**

A function runs, then **time gets inserted into the middle**, and later it continues *as if* it never left.

Once you see it that way, a bunch of things that feel “mystical” about async suddenly look like boring (and therefore debuggable) control flow.

## A function call is already a weird control-flow trick

Even “normal” functions are not as straightforward as we pretend.

When you call a function, you jump to a fixed address.
When you return, you jump back to a **dynamic** address (the call site).

The caller effectively provides an invisible “return here” pointer.

That’s why a signature like this is conceptually misleading:

```text
foo(x) -> y
```

It looks like a simple mapping. But control flow is doing an actual jump.

Async takes that existing trick and adds one more move:

- not only can a function return *a value*
- it can also return *later*

## “Injecting time” is really “capturing a continuation”

Here’s the part most engineers feel but don’t name:

When you hit an `await`, the runtime needs to remember:
- where you were in the function
- what locals you had
- what you were waiting on

…and then resume you later.

That “remember where I was and come back” package is basically a continuation.

This is why async stacks can look weird in production:
- your mental model is “one stack, one timeline”
- the runtime model is “many stacks stitched across time”

If you treat async as “invisible threads,” you will eventually debug something at 2am and hate your past self.

If you treat async as “control flow that crosses time boundaries,” you at least know what kind of monster you’re fighting.

## Exceptions, generators, and async are cousins

One reason I like the “functions don’t exist (they’re an abstraction)” framing is that it makes you notice a pattern:

- **exceptions**: jump to a handler *not at the return site*
- **generators**: suspend and resume at yield points
- **async/await**: suspend and resume at await points

Different surface syntax, same core idea: **control flow is escaping the straight line**.

This is also why people keep bringing up *effects* and *effect systems* when discussing async.

From an engineering standpoint, I translate that hype into a practical question:

> Can the language/runtime give me a *typed, structured way* to express “this function may jump” (or “this function may suspend”),
> instead of encoding it as conventions, folklore, and code review comments?

Because right now, a lot of languages handle it by social rules:

- “Don’t block inside async.”
- “Don’t swallow exceptions.”
- “Don’t call this API on the UI thread.”

Those rules work… until they don’t.

## Why this matters in real systems (not PL theory)

Async becomes painful when you try to do any of these at scale:

1) **Cancellation**

Cancellation is basically “a second control flow channel” that can interrupt your function.
If your runtime treats cancellation as a side flag, you get code that *looks* correct but isn’t.

2) **Resource safety**

You thought:

```text
open -> do work -> close
```

But async turns it into:

```text
open -> do work -> (time injected here) -> close
```

…and if your “close” depends on finally/defer semantics, you really want the language to guarantee it.

3) **Observability**

Tracing across an `await` boundary is basically admitting:

> my execution is not a continuous stack anymore

A good tracing system restores the story.
A bad one makes everything look like “random callbacks.”

## My takeaway

I’m not suddenly joining the PL theory fandom, but this framing made async feel less like a vibe and more like a mechanism:

- async isn’t “parallelism”
- async isn’t “threads, but cheaper”
- async is **a control-flow abstraction that allows suspension and later resumption**

Once you accept that, you can reason about it the same way you reason about exceptions:

- where can control jump?
- what state is preserved?
- what invariants must still hold after resumption?

That’s the difference between “it works on my machine” and “I can keep this service alive for two years.”

---

**References:**
- [Will Richardson: “Async Programming Is Just @Inject Time” (the framing that triggered this post)](https://willhbr.net/2026/03/02/async-inject-and-effects/)
- [Wikipedia: Continuation (the name for the ‘resume me later’ idea)](https://en.wikipedia.org/wiki/Continuation)
- [Koka language homepage (an example of a language built around effects)](https://koka-lang.github.io/)
