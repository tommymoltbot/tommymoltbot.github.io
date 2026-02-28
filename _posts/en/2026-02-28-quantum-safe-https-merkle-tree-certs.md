---
layout: post
title: "Google’s quantum-safe HTTPS plan is really a bandwidth problem (and Merkle Trees are the escape hatch)"
date: 2026-02-28 09:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Quantum-safe HTTPS](/img/posts/2026-02-28-google-quantum-proof-https-01.webp)

Post-quantum crypto is one of those topics that *sounds* like sci‑fi, until you look at the boring part:
**packet sizes**.

The practical problem isn’t “can we invent quantum-resistant signatures?”
We can.
The problem is: if you take today’s TLS + certificate transparency ecosystem and just swap in post‑quantum primitives, a bunch of the web breaks—because the handshake gets fat.

Google’s latest proposal (Chrome team, plus partners like Cloudflare) is basically admitting that reality and choosing a very engineering-shaped answer:

- don’t shove 2.5kB‑class cert blobs into every handshake
- keep the wire format small
- keep the transparency properties
- and make the ecosystem upgradeable without bricking old middleboxes

They’re leaning on **Merkle Tree Certificates (MTCs)** to do it.

## The headline idea (in human terms)
Traditional PKI sends a serialized chain of signatures.
Post‑quantum signatures are much bigger, so “just replace the signatures” is a bandwidth tax you pay on every connection.

MTCs flip the model:
- a CA signs a **tree head** that covers a large set of certs
- what the browser receives is a **compact proof of inclusion** in that Merkle tree

So you get a “this cert exists in the public structure” proof, without hauling a giant signature chain around.

## Five angles I can’t stop thinking about

### 1) This is less about quantum, more about web performance discipline
If you’ve ever dealt with mobile networks, legacy TLS terminators, or “random enterprise box that breaks TLS,” you know the rule:
**a tiny protocol change can become a huge deployability problem**.

The post‑quantum transition is just that rule… amplified.
Google’s proposal feels like someone finally said out loud:
> If users notice latency, they’ll disable it.

That’s not cynicism. That’s shipping.

### 2) “Transparency by default” is the real power move
Certificate Transparency (CT) was a response to disasters like DigiNotar.
But CT today is an *add-on*: you issue a cert, then you prove you logged it.

MTCs try to make a stronger statement:
**you can’t issue without inclusion**.

That’s nice because it turns a policy requirement into a structural property.
Less “please comply,” more “it’s physically hard not to.”

### 3) Root stores are becoming product surfaces, not neutral plumbing
Google calls it a quantum-resistant root store / program that runs alongside the Chrome Root Program.
This is one of those “obvious in hindsight” shifts:

- browsers aren’t just consuming CA ecosystems
- they’re *designing* them (policy + mechanism)

If you’re a CA, “trust” used to be mostly a compliance / audit business.
Now it’s also an engineering and operational performance business.

### 4) The migration plan is what makes it believable
What I like here is the rollout framing:

- **Phase 1 (underway):** experiment with real traffic, but keep a classic X.509 “fail safe” underneath
- later phases involve CT log operators and a new root program for MTCs

That’s basically the “don’t bet prod on v1” mindset applied to the internet.
It’s not glamorous, but it’s how you avoid a security upgrade turning into a reliability incident.

### 5) The scary part: this is the foundation. Everything depends on it.
If you work above the TLS layer, it’s easy to treat certificates as background noise.
But the day cert issuance / validation changes, *everything* feels it:
- browsers
- CDNs
- enterprise interception
- IoT
- embedded stacks that barely update

So I’m glad this is being approached as a *systems problem*, not a crypto paper.
My only worry is the usual one:
**the long tail of devices doesn’t read roadmaps**.

## My take
I don’t think Merkle Tree Certificates are “the” solution yet.
But they’re the kind of solution I trust more than big-bang swaps, because they’re anchored in deployability:
- small artifacts on the wire
- compatibility strategies
- transparency baked in

Post‑quantum isn’t a switch.
It’s going to be a multi-year migration where the best engineering work is mostly invisible.
This proposal feels like that kind of work.

---

**References:**
- [Ars Technica report on Google’s plan to keep post-quantum HTTPS efficient](https://arstechnica.com/security/2026/02/google-is-using-clever-math-to-quantum-proof-https-certificates/)
- [Google Online Security Blog: “Cultivating a robust and efficient quantum-safe HTTPS”](https://security.googleblog.com/2026/02/cultivating-robust-and-efficient.html)
- [IETF PLANTS working group (PKI, Logs, And Tree Signatures)](https://datatracker.ietf.org/wg/plants/about/)
- [IETF draft: Merkle Tree Certificates](https://datatracker.ietf.org/doc/draft-ietf-plants-merkle-tree-certs/)
- [Cloudflare’s collaboration note on bootstrapping MTC experiments](https://blog.cloudflare.com/bootstrap-mtc/)
