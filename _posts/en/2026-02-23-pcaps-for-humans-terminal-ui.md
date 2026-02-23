---
layout: post
title: "PCAPs for Humans: Why a Flows-First Terminal UI (Babyshark) Actually Matters"
date: 2026-02-23 23:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![PCAPs for humans](/img/posts/2026-02-23-pcaps-for-humans-01.webp)

I’ve lost count of how many times I’ve opened a PCAP with a very simple question:

- “Why is this request slow?”
- “Which domain is eating bandwidth?”
- “Is this a TCP thing, a DNS thing, or just my app being dumb?”

…and then Wireshark greeted me with a thousand fields and a UI that basically says: *good luck, nerd*.

So seeing **Babyshark** pop up (a terminal UI for PCAPs) hit a nerve in a good way. Not because it’s doing magic packet analysis, but because it’s making a pretty strong product bet:

**Most people don’t want packets. They want answers, then a path to drill down.**

## The UX problem: Wireshark is powerful, but it’s not kind

Wireshark is a masterpiece. It’s also a tool you learn the way you learn Vim or GDB: slowly, with pain, and usually because something is on fire.

The “PCAPs for humans” pitch makes sense because most real debugging sessions look like this:

1) Get a rough overview
2) Identify the suspicious flow(s)
3) Follow the stream
4) Export something you can show to another human

If the tool forces you to start at layer 4 decode tables, you’re already burning time.

## Babyshark’s core idea: start from flows, not packets

Babyshark is explicitly **flows-first**. It gives you:

- an Overview dashboard (what’s happening, top talkers, quick hints)
- Domains view (hostnames first, even when DNS is incomplete)
- “Weird stuff” view (heuristics like high latency flows, resets, retransmit hints)
- the usual drill-down (flows → packets → follow stream)

That’s not “dumbing down”. It’s putting the *common mental model* first.

When I’m debugging production traffic, I usually care about “which conversation is bad” before I care about “which packet is packet #1432”.

## The underrated killer feature: reports you can hand to someone else

One detail I really like: Babyshark can export a Markdown report and keep timestamped copies.

In real teams, you often need to answer:

- “Can you summarize what you found?”
- “Can you show me a before/after?”
- “Can you attach this to an incident doc?”

A PCAP alone is not communication. A short report with bookmarks is.

## The part I’m cautious about: heuristics can turn into false confidence

The “Weird stuff” section is exactly what beginners need… and also exactly where you can get misled.

High latency flows, resets, retransmit hints—these are great **triage signals**, but they’re not a root-cause diagnosis. If the UI reads too confidently, people will stop verifying.

My mental model for this kind of tooling is:

- green = probably fine
- yellow = investigate
- red = *something is off, go look at the raw evidence*

If Babyshark keeps that attitude, it’ll be genuinely useful.

## Practical usage (the few commands you actually need)

```text
babyshark --pcap ./capture.pcap
babyshark --list-ifaces
babyshark --live en0 --dfilter "tcp.port==443"
```

It also uses tshark for live capture, which I think is the right call. Don’t reinvent capture. Build a better interface on top.

## My take

Tools like this are a reminder that “engineering” isn’t just inventing new algorithms. Sometimes it’s taking something that’s already possible (PCAP analysis) and making it **less hostile**.

If you’re the kind of person who *avoids* PCAPs because Wireshark feels like a cockpit, a flows-first terminal UI might be the difference between “I guess it’s the network” and “here’s the exact flow that’s broken.”

And honestly? That’s a pretty good trade.

---

**References:**
- [Babyshark project page and README (flows-first PCAP TUI)](https://github.com/vignesh07/babyshark)
- [Babyshark releases (download prebuilt binaries)](https://github.com/vignesh07/babyshark/releases)
