---
layout: post
title: "Netbird Hit 455 Points on HN — What's the Fuss About Zero Trust Networking?"
date: 2026-02-01 17:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: en
permalink: /en/netbird-open-source-zero-trust-networking/
image: /img/posts/2026-02-01-netbird-mesh-network.webp
---

![Zero Trust Mesh Networking Concept](/img/posts/2026-02-01-netbird-mesh-network.webp)

Saw [Netbird](https://netbird.io/) on HN frontpage this morning — 455 points, 171 comments. That's not the usual "oh cool another tool" level of engagement. That's the "engineers are actually using this and have opinions" level.

So what is it? In short: open source zero trust networking. If that sounds like buzzword bingo, hold on — there's something real here.

## What Problem Does This Actually Solve?

Let's start with the practical stuff. You've got machines scattered around — a home server, a VPS, maybe a Raspberry Pi somewhere, your laptop. You want them to talk to each other securely without punching holes in firewalls or exposing services to the public internet.

Traditional solution? VPN. Set up OpenVPN or WireGuard, configure routing, manage keys, hope nothing breaks when you're three timezones away.

Netbird (and things like Tailscale/Headscale) say: what if we just make all your devices part of a private mesh network? No central server to route through, no complex firewall rules, just point-to-point encrypted connections.

When I first heard about this approach a year ago, I was skeptical. "Just use WireGuard" was my reaction. But after seeing how many people are running this in production — not just homelabs, actual work setups — I started paying attention.

## Zero Trust: The L3/L4 vs L7 Confusion

The term "zero trust" gets thrown around a lot. It helps to separate two different architectures that both claim to be "zero trust":

**L3/L4 (Network Layer)**: This is what Netbird/Tailscale/Headscale do. You still get IP reachability between devices, but enrollment and access control are driven by identity/device state. It's "zero trust-ish" — nothing is implicitly trusted, you micro-segment, but once you're in the mesh, you're doing network-level access.

**L7 (Application Layer)**: This is the Cloudflare Access / Teleport style. No raw network access at all. Every request is authenticated/authorized per app/service/session. Closer to the strict BeyondCorp definition.

Both are useful. They solve different problems. A lot of teams end up combining them: mesh VPN for ops/workloads, L7 gateway for user-facing apps where you really want per-request identity checks.

Netbird is firmly in the L3/L4 camp. Under the hood, it's WireGuard. What it adds is the management layer — automatic peer discovery, key exchange, ACLs, without you having to manually configure every device.

## Real Use Cases (From the HN Thread)

The HN comments are always more interesting than the landing page. Here's what people are actually using this for:

**Internal services behind VPN**: Someone mentioned they have servers sending Telegraf metrics to a home server using Netbird instead of opening a port. Makes sense — why expose that to the internet if only two machines need to talk?

**Remote access to homelab**: Multiple people running Coolify, old laptops as dev servers, home cinema control — all accessed remotely through the mesh. No ngrok, no dynamic DNS, just an internal network that follows you around.

**Cheap NAS**: One person has an old Mac connected to an external HD, accessed via Netbird, backed up to Hetzner. Not enterprise-grade, but for personal use? Why not.

**Mullvad VPN exit node**: Tailscale has UI for this now — use one of your mesh nodes as a VPN exit point. Privacy without trusting a third-party VPN provider.

What I find interesting is how practical these use cases are. This isn't "wouldn't it be cool if..." territory. These are problems people have today, solved with tools that already work.

## The Open Source Landscape: Tailscale vs Headscale vs Netbird

If you're looking at this space, you've got three main options:

**Tailscale (commercial)**: The original. Polished, well-supported, works everywhere. Free tier is generous, but if you scale up or want certain features, you're paying.

**Headscale (open source Tailscale control plane)**: Community project. Compatible with Tailscale clients, self-hosted. But — and this is important — the maintainers are very upfront about what it *isn't*. From their FAQ:

> "Headscale is not enterprise software and our focus is homelabbers and self-hosters. [...] We focus on correctness and feature parity with Tailscale SaaS over time."

They've deprecated Postgres support, only recommend SQLite. Why? Because supporting distributed databases adds complexity they don't want to maintain. Fair enough. But it tells you what the target audience is.

Some people in the HN thread were annoyed by this. "Why drop Postgres?" The answer is: because they're designing for a specific use case and being honest about it. If you want enterprise-grade HA, use Tailscale's paid tier.

**Netbird**: Also open source, but seems to be aiming for a broader range of deployments. Still relatively young compared to Tailscale/Headscale. The fact that it's getting this much traction on HN suggests it's doing something right.

## So... Would I Use This?

Here's the thing: I don't have a homelab (yet). My setup is pretty simple — laptop, a couple of VPS nodes, not much that needs constant secure access.

But if I were building something more complex? Yeah, I'd probably try this. The alternative is managing WireGuard configs by hand or dealing with traditional VPN overhead. Neither sounds appealing.

What I like about this whole category (mesh VPN with identity-based access) is that it solves a real problem elegantly. You don't have to be a networking expert to set it up. You don't have to maintain complex firewall rules. It just works.

What I'm still cautious about: maturity. Tailscale has been around longer, has more resources. Headscale is explicit about being a homelab tool. Netbird is somewhere in between. For personal projects, I'd use any of them. For production? I'd want to see more battle-testing.

## The Underlying Trend

This whole space — WireGuard-based mesh networking — is part of a broader trend I find interesting: the infrastructure layer becoming more accessible to individuals and small teams.

Ten years ago, setting up a private network across multiple locations was enterprise territory. Now? Install a binary, run a command, done. Same with containers, same with serverless, same with a lot of things that used to require dedicated ops teams.

That's both exciting and a little concerning. Exciting because it lowers the barrier to building things. Concerning because when something goes wrong, you need to understand what's actually happening under the hood. And a lot of people... don't.

But that's a broader conversation.

## References

- [Netbird Official Site](https://netbird.io/)
- [HN Discussion: Netbird – Open Source Zero Trust Networking](https://news.ycombinator.com/item?id=46844870)
- [Headscale Official Documentation](https://headscale.net/)
- [Tailscale: How NAT Traversal Works](https://tailscale.com/blog/how-nat-traversal-works/)
