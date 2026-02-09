---
layout: post
title: "Let’s Encrypt Is About to Break Some Server-to-Server TLS — Here’s Why"
date: 2026-02-09 22:05:00 +0000
categories: [Engineering, Tech]
tags: [Engineering, Tech]
author: Tommy
excerpt: "From Feb 11, 2026, Let’s Encrypt will issue certificates with Extended Key Usage set to serverAuth only. That sounds harmless until you run protocols where servers also act as TLS clients (XMPP federation is a classic)."
image: /img/posts/2026-02-09-lets-encrypt-eku-server-only.webp
---

I love boring infrastructure. Certificates are supposed to be boring.

So when I see a change that’s technically small but operationally spicy, I pay attention.

On **Feb 11, 2026**, Let’s Encrypt will start issuing certificates that, by default, include **Extended Key Usage (EKU) = server authentication only**.

If your mental model is “a server cert is for servers”, you’ll shrug.

But a bunch of real protocols don’t follow that neat story—because **in TLS terms, the side that initiates a connection is the *client***. Even if it’s a server connecting to another server.

That mismatch is where the breakage comes from.

## The change, in plain terms

Traditionally, many public CA certs included two EKU purposes:

- **serverAuth** (the cert can be used to authenticate a server)
- **clientAuth** (the cert can be used to authenticate a client)

Let’s Encrypt is removing *clientAuth* from what it issues by default.

That means some software stacks will see an incoming TLS connection where the peer presents a cert that lacks *clientAuth*, and they’ll go:

> nope, not valid for clients

…and abort.

If you only run HTTPS, you’ll probably never notice.

If you run **federated / server-to-server protocols**, you might.

## Why this hits server-to-server protocols

Here’s the part that makes engineers argue at 2am.

In server-to-server setups, you often do mutual authentication (or at least strongly-validated authentication). A server connects out to another server.

From TLS’ point of view:

- Outbound connector = **TLS client**
- Receiver = **TLS server**

Now, if the outbound connector presents its own certificate to prove who it is, some TLS libraries interpret that as “a *client* certificate”, and they insist it must be valid for **clientAuth**.

But the operator thinks: “it’s a server cert, because it belongs to a server”.

Both models feel reasonable. They’re just not the same model.

## XMPP is the canary (Prosody’s write-up is worth reading)

The cleanest explanation I’ve seen is from the Prosody team, in their post:

- [Prosody: Upcoming changes to Let’s Encrypt and how they affect operators](https://blog.prosody.im/2026-letsencrypt-changes/)

XMPP federation (server-to-server) is exactly the kind of environment where:

- servers connect to servers,
- certificates are used as proof of domain control,
- and “who is the client?” is a semantic footgun.

Prosody says they already handle “server-only” certificates correctly for federation, but other servers may not.

If you’re running XMPP and you haven’t thought about this yet: do it now, not on Feb 11.

## My take: this isn’t a Let’s Encrypt problem, it’s an interface problem

This is the kind of incident that looks like “TLS is complicated” on the surface.

Underneath, it’s a contract problem:

- We’ve overloaded “certificate” to mean “identity proof for an entity”.
- TLS specs talk in terms of “client” and “server” roles *per connection*.
- Operators think in terms of “client apps” and “server software” as *products*.

The interface is leaky. So different stacks implement different interpretations, and the ecosystem holds together mostly by convention.

Then one big CA tweaks a default, and suddenly your federation graph has holes.

## What I would do this week (if I operate anything federated)

I’m not going to pretend everyone should become a PKI expert. But I *am* going to say: treat this like a production change.

Practical checklist:

1. **Inventory your server-to-server protocols**
   - XMPP federation, SMTP MTAs, custom mTLS meshes, anything where servers mutually authenticate.

2. **Test with a server-only EKU certificate path**
   - If your stack hard-requires *clientAuth* for the initiating side, you’ll see failures.

3. **Upgrade the server implementation (or patch config)**
   - If upstream has already shipped a compatibility fix, take it.

4. **Watch logs for certificate validation errors**
   - They’ll look like “invalid purpose”, “unsupported certificate purpose”, or generic “handshake failure”.

One more honest point: if you’re relying on a CA ecosystem that is effectively optimized for browsers, you should expect more “web assumptions” leaking into your non-web use cases over time.

Not because anyone’s malicious. Because that’s where the pressure is.

---

### References

- [Prosody team explanation: Let’s Encrypt EKU change and XMPP federation impact](https://blog.prosody.im/2026-letsencrypt-changes/)
- [Let’s Encrypt announcement: ending TLS client authentication EKU by default](https://letsencrypt.org/2025/05/14/ending-tls-client-authentication)
