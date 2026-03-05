---
layout: post
title: "asyncio.Condition can miss the state you were waiting for (the lost update trap)"
date: 2026-03-05 11:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![asyncio lost update cover](/img/posts/2026-03-05-asyncio-lost-updates-01.webp)

If you’ve ever written an asyncio state machine, you probably have code that looks “obviously correct”:

- producer: update state + `notify_all()`
- consumer: `await condition.wait_for(lambda: state == "closing")`

And then, under real load, the consumer just… never runs.

The bug isn’t that `asyncio.Condition` is broken. It’s that it’s doing exactly what it promises: it wakes you up to **re-check the predicate against the current value**. If the value moved through your desired intermediate state too fast, you can miss it.

## The version of the bug that hurts

Imagine a connection state machine:

```python
# disconnected -> connecting -> connected -> closing -> closed
state = "disconnected"
condition = asyncio.Condition()

async def set_state(new_state: str):
    global state
    async with condition:
        state = new_state
        condition.notify_all()

async def drain_requests():
    async with condition:
        await condition.wait_for(lambda: state == "closing")
    print("draining pending requests")
```

Now the “fast transition”:

```python
await set_state("closing")  # notify_all schedules wakeups
await set_state("closed")   # state changed again before waiters run
```

In a single-threaded event loop, wakeups are just “scheduled to run later”. If you don’t yield between those two transitions, your waiter might only run after the state is already `"closed"`. The predicate fails, and it goes back to sleep.

If `"closing"` was the only moment where you had to flush buffers / send a final message / emit metrics, you just lost the whole thing.

That’s the part that makes me annoyed: the code reads like it should work, and you won’t see the failure until it’s a production incident.

## Why `Event` doesn’t really save you

People often “fix” this by adding multiple `asyncio.Event`s:

- one for `connected`
- one for `closing`
- one for `closed`

It avoids the missed-intermediate-state issue **for that one state**, but it pushes complexity into the setter, and you end up with a pile of events you must set/clear correctly. That’s where bugs like to live.

## What you actually wanted: a stream of transitions

The Inngest team wrote a nice breakdown of this and ended up building a small primitive that’s basically:

- each waiter gets its own queue
- every state transition is pushed into every queue
- the waiter consumes transitions in order until it sees what it needs

Conceptually, it’s closer to “subscribe to changes” than “wake me up and I’ll check again”.

A minimal mental model looks like this:

```text
wait_for(target_state) -> await until you observe a transition whose new_state == target_state
```

Once you think in transitions, “missing `closing`” feels impossible, because it’s buffered as an event, not derived from the latest value.

## My practical take

If your state machine has intermediate states that *matter* (not just cosmetic), using a plain `Condition.wait_for(...)` is risky unless you can prove transitions can’t collapse within one event-loop tick.

The moment you have:

- fast transitions
- multiple consumers waiting on different predicates
- cancellation and timeouts

…I’d rather reach for an explicit “watch transitions” abstraction (queue-per-watcher, or an async pub-sub) than keep sprinkling `Condition` and hope.

Not glamorous, but at least your “closing” handlers won’t silently never run.

---

**References:**
- [Inngest: What Python’s asyncio primitives get wrong about shared state](https://www.inngest.com/blog/no-lost-updates-python-asyncio)
- [Python docs: asyncio.Condition (wait_for)](https://docs.python.org/3/library/asyncio-sync.html#asyncio.Condition.wait_for)
