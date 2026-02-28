---
layout: post
title: "Passkeys Aren't Your Encryption Key: The Blast Radius Problem with PRF"
date: 2026-02-28 10:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A warning about tying encryption to passkeys](/img/posts/2026-02-28-passkeys-prf-blast-radius-01.webp)

Passkeys are great at one thing: **phishing-resistant authentication**.

And that’s exactly why it makes me nervous when I see teams trying to stretch them into *data encryption keys* (usually via the WebAuthn **PRF extension**) for “E2EE backups” or “secure vaults”.

Not because PRF is broken.
Because the **failure mode is brutal**.

## The part everyone underestimates: blast radius

If a passkey is only for login, losing it is annoying. You re-enroll. You recover the account. Life goes on.

If the same passkey is also used to derive an encryption key, losing it can mean:

- your backup is still there
- your account is recoverable
- but the data is **cryptographically dead**

The user experience difference is subtle at setup time (“Enable encrypted backups?” → tap tap done), and catastrophic a year later.

This is the “blast radius” problem Tim Cappalli is warning about. The scenario is depressingly realistic: people clean up their credential manager, delete an entry they don’t remember, and only discover the consequence when they get a new device.

## Why PRF makes this tempting (and why that’s a trap)

PRF makes it *feel* clean:

- you already have a passkey
- PRF gives you stable secret material
- so you do something like:

```text
derive_key(prf_output, salt) -> encryption_key
```

From an engineer’s perspective, it’s elegant.

From a product perspective, it’s a time bomb—because passkeys are designed to be *replaceable credentials*, not *irreplaceable keys*. Users are trained to think “credentials can be reset”. Keys can’t.

## “But passkeys sync across devices now”

Sure. Often.

But **sync is not a guarantee**, and more importantly: **deletion is a feature**.

If a user deletes a passkey, they didn’t just “log out”. They may have deleted their ability to decrypt memories, legal documents, or a wallet.

That’s a mismatch between the mental model you want users to have, and the model their OS encourages.

## What I’d do instead (if I actually cared about users not losing data)

If your real goal is “E2EE backups / encrypted vault data”, you want *durable recovery design*.

A few patterns that don’t silently turn a login credential into a single point of irreversible loss:

1) **Separate encryption keys from authentication**
   - Passkeys authenticate *who* the user is.
   - Data keys encrypt *what* the user owns.

2) **Use explicit recovery artifacts**
   - recovery key (print / store)
   - multiple recovery methods (trusted devices, contacts, or a second factor)

3) **If you insist on PRF, treat it like handling explosives**
   - very loud UX warnings at enrollment
   - warnings on deletion (ideally surfaced by credential managers)
   - publish a help page explaining the coupling and link it via the relying party passkey endpoints metadata

If you can’t make those tradeoffs honestly, you probably shouldn’t ship PRF-based encryption to end users.

## My take

Passkeys are already hard enough to roll out well.
They don’t need to also carry the responsibility of being the one key that—if deleted—silently destroys someone’s data.

If you’re building encryption features, build them like you mean it: with recovery, with clear mental models, and with the assumption that users will do normal user things.

---

**References:**
- [Tim Cappalli’s warning on PRF and passkeys for encrypting user data](https://blog.timcappalli.me/p/passkeys-prf-warning/)
- [WebAuthn PRF extension overview and the underlying rationale](https://www.w3.org/TR/webauthn-3/#sctn-prf-extension)
- [Relying Party Passkey Endpoints metadata (PRF usage details field)](https://www.w3.org/TR/passkey-endpoints/#usage)
