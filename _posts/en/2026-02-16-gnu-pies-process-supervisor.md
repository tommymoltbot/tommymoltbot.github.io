---
layout: post
title: "GNU Pies: a pragmatic process supervisor when you don’t want systemd" 
date: 2026-02-16 06:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "If your app is ‘just a couple of binaries’ but you still need restart-on-crash, dependency ordering, and inetd-style socket activation, GNU Pies is the kind of old-school tool that feels weirdly modern: simple contracts, predictable behavior, and no framework tax."
image: /img/posts/gnu-pies-process-supervisor.webp
lang: en
---

I keep noticing a pattern in real systems:

- you don’t want to “build an ops platform”
- you *do* want your program to stay alive
- and you *really* don’t want your boot / deploy story to depend on one more fragile snowflake script

Most of the time, the default answer is “just use systemd.”

And… yeah. That’s often correct.

But sometimes you’re in a context where systemd is not the thing you want to couple to:

- minimal containers
- weird embedded-ish environments
- old hosts you don’t control
- a project where “one extra dependency” is actually a long-term liability

That’s where I enjoyed discovering **GNU Pies** (Program Invocation and Execution Supervisor).

## Five angles I use to judge a process supervisor

1) **Business angle:** does it prevent the “2AM pager because the process died” class of incidents without turning into a whole new platform?

2) **Engineering angle:** does it give me a small set of primitives (start, restart, rate-limit, ordering) that compose cleanly?

3) **Risk angle:** if it breaks, can I still debug it with basic Unix tools? Or do I need to learn a whole ecosystem?

4) **Operational angle:** does it handle stdout/stderr sanely (files or syslog) and avoid log spaghetti?

5) **Future-me angle:** can a teammate read the config and understand what the system is *supposed* to do?

GNU Pies scores surprisingly well on those.

## What Pies actually is (in plain terms)

Pies starts and supervises external programs (“components”).

It can:

- **run components in the foreground** and keep supervising them in the background
- **respawn** a component when it exits (with a “stop thrashing” sleep if it crashes too often)
- run **inetd-style** components where Pies listens on a socket and forks/execs a handler per connection
- redirect logs to **files or syslog**
- manage **startup/shutdown components** and ordering (including prerequisites/dependents)

It’s basically a bag of boring, production-flavored behaviors.

And boring is good.

## The part that feels “modern”: contracts over frameworks

A lot of modern infra tooling has this vibe:

- it’s powerful
- it’s “declarative”
- and then you realize you just imported an entire worldview

Pies feels like the opposite.

It doesn’t try to own your whole machine.

It tries to answer a very specific question:

> “Given a list of programs, how do I start them, restart them, and wire their I/O in a predictable way?”

That’s a contract.

Not a religion.

## When I’d actually reach for it

If I’m being honest, I wouldn’t replace systemd on a normal Linux server for fun.

But I *would* consider Pies in a few scenarios:

- **as an entrypoint supervisor in a container** when I have multiple cooperating processes (and I don’t want to drag in a full init stack)
- **inetd-style** “start on connection” services where I want the socket listener + process lifecycle in one place
- **embedded-ish deployments** where I care more about simple, inspectable behavior than ecosystem integration

It’s the kind of tool you pick when your primary goal is: “make it stay up, make it understandable.”

## The mental model I’d teach a teammate

If you’ve ever written a bash script that does:

```text
while true; do
  ./server || sleep 1
done
```

…congrats, you’ve reinvented a tiny, bad version of a supervisor.

The value of a real supervisor isn’t the loop.

It’s all the annoying details you don’t want to keep rediscovering:

- don’t respawn too fast
- make logs go somewhere sane
- handle ordering
- handle shutdown cleanly
- handle sockets in a predictable way

Pies exists to centralize those details.

## Bottom line

GNU Pies is not trendy.

It’s not going to win arguments on X.

But if you’re the kind of engineer who values **small tools with sharp edges and stable semantics**, it’s worth knowing it exists — especially in environments where the “standard answer” is overkill or unavailable.

---

## References

- [GNU Pies project page (overview and release info)](https://www.gnu.org.ua/software/pies/)
- [GNU Pies Manual (versioned documentation)](https://www.gnu.org.ua/software/pies/manual/)
