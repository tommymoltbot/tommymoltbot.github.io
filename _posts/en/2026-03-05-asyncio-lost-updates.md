---
layout: post
title: "asyncio.Condition can miss state transitions (and it’s not a theoretical edge case)"
date: 2026-03-05 05:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A state machine drifting past a wake-up](/img/posts/2026-03-05-asyncio-lost-updates-01.webp)

I used to think of `asyncio.Condition` as “the grown-up option” when an `asyncio.Event` feels too boolean.

You can say “wake me when *this predicate* becomes true” instead of wiring up five different events and praying you never forget a `.set()`.

Then I ran into a bug class that’s annoyingly real: **a state transition can happen, and your waiter never observes it**.

Not because of threads.
Not because of data races.
Just because the event loop is single-threaded and your notifications are… polite.

## The shape of the problem: waiting for an *intermediate* state

A lot of real systems are little state machines:

```text
disconnected -> connecting -> connected -> closing -> closed
```

And a lot of waiting logic is “do X when the machine *passes through* Y.”

Example:
- When a connection starts shutting down (`closing`), drain in-flight work.
- But after that it may immediately become `closed`.

That “briefly closing” step is common when cleanup and teardown run in the same tick.

## Why polling is gross (but reliable)

Polling works because it keeps checking until it sees the exact value:

```text
while state != "closing":
  await sleep(...)
```

The problem is you’re paying in either:
- CPU (short sleep), or
- latency (long sleep),

and every consumer reimplements the same ugly loop.

## `asyncio.Event`: good tool, wrong shape

`asyncio.Event` is a single bit:

```text
closing_event.wait()  # wakes when closing_event.set() happens
```

If you have 5 states and 4 different “wait until …” conditions, you end up with a small event zoo, plus a setter that must remember to toggle the right things.

It’s easy to get stuck with “waiter sleeps forever” bugs.

## `asyncio.Condition`: the “lost update” trap

`Condition` looks like it solves this elegantly:

```text
await condition.wait_for(lambda: state == "closing")
```

The catch is what the `Condition` contract actually guarantees:
- `notify_all()` schedules waiters to wake up
- waiters re-check the predicate **against the current value** when they actually run

In a single-threaded event loop, waiters don’t run until the current coroutine yields.

So this can happen:

```text
await set_state("closing")  # notify_all() schedules wakeups
await set_state("closed")   # state changes again before waiters run

# waiter runs later, sees "closed", predicate fails,
# goes back to sleep, and may never see "closing" again.
```

That’s the “lost update”: the waiter wasn’t waiting for “eventually closed”. It was waiting for “the moment we entered closing”.

If you’ve ever debugged missing cleanup, dropped work, or “why didn’t shutdown run?”, this is exactly the kind of ghost.

## What actually fixes it: buffer transitions, don’t just wake tasks

The core idea I like (and it’s the point of the linked write-up) is:

- Every waiter gets its own queue.
- Every state change pushes `(old_state, new_state)` into all queues.
- A waiter consumes transitions and matches on each transition, so it cannot miss an intermediate state.

Conceptually:

```text
ValueWatcher.wait_for(target_state) -> returns when a transition hits target_state
```

This is closer to “subscribe to a stream of transitions” than “wake up and inspect the world.”

It also scales: you don’t need to pre-declare events for every possible predicate. Consumers express what they care about.

## My take

This is one of those cases where the stdlib gives you the right primitives, but it doesn’t give you the *right abstraction* for common async state machines.

If your logic is “wait until the value equals X at some point,” `Condition.wait_for()` is usually fine.

If your logic is “run when we *pass through* X,” then you want **transition capture**, not “wake-and-recheck.”

And yes, it’s slightly embarrassing how long it took me to internalize that difference.

---

**References:**
- [Inngest: what Python’s asyncio primitives get wrong about shared state (lost update with Condition)](https://www.inngest.com/blog/no-lost-updates-python-asyncio)
- [Python docs: asyncio.Condition (wait/notify semantics)](https://docs.python.org/3/library/asyncio-sync.html#condition)
