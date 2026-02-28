---
layout: post
title: "Please stop using passkeys to encrypt user data (the UX blast radius is brutal)"
date: 2026-02-28 04:25:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A key icon on top of a warning banner, representing passkeys being overloaded as encryption keys](/img/posts/2026-02-28-passkeys-prf-warning-01.webp)

Passkeys are great at one job: **phishing-resistant authentication**.

But I keep seeing teams treat “passkey + WebAuthn PRF” like a convenient substitute for “real key management” — and then proudly ship end-to-end encrypted backups on top of it.

I get the appeal. If a user already has a credential, and PRF can deterministically derive a secret, why not just do:

```text
backup_key = PRF(passkey_credential, app_salt)
```

Because the moment you do that, you’ve attached your users’ *most sacred data* to a credential they don’t emotionally recognize as “the key to my memories”. And that mismatch is where disaster happens.

## The problem isn’t crypto. It’s “what happens when the credential disappears?”

The most convincing argument I’ve read recently is Tim Cappalli’s warning post: users will delete a passkey and have **no idea** they just deleted the only thing that can decrypt their backups.

And honestly… yeah.

If you’ve ever watched someone clean up their password manager, you know how this goes:

- They don’t remember why a credential exists.
- The UI treats deletion like routine hygiene.
- A year later, on a new phone, they *finally* hit “restore backup”… and the app asks for a thing they don’t have.

From a user’s perspective, that’s not “oops I lost a login method.”

That’s **permanent data loss**.

## “But passkeys sync now, so it’s fine” — no, not fine

Yes, passkeys can sync across devices.

But you’re still building on top of a piece of UX that was never designed to communicate:

> “If you delete this, you might lose photos of deceased relatives.”

Credential managers are optimized for *account access*, not for *irreplaceable-data custody*.

And it gets worse:

- Some users turn off sync.
- Some environments are multi-account / multi-profile chaos.
- Some people migrate ecosystems (Android → iOS or vice versa).
- Enterprises can enforce policies that break assumptions.

If your encryption story has a single hidden dependency on “the passkey must remain present in the user’s credential manager forever”, you’ve built a trap.

## PRF does have legit uses — just not this one

PRF in WebAuthn isn’t inherently evil. It can be very reasonable for things like:

- unlocking a credential manager vault *as one factor* (alongside a master password, recovery key, etc.)
- OS-level flows where the platform can provide durable recovery affordances

The key phrase is **durable recovery**.

If your design doesn’t have a recovery path that a normal human can understand and actually use under stress, it’s not “secure”. It’s brittle.

## What I’d do instead (if you insist on E2EE backups)

If you want end-to-end encrypted backups, you need to treat it like a product with real failure modes:

1. **Use a dedicated backup key**, not the login credential
2. **Wrap it** with multiple recovery options (choose two or more):
   - a recovery key the user can print / store
   - a strong passphrase (human-managed)
   - hardware keys or device keys
   - social recovery (depending on threat model)
3. Make deletion warnings explicit, *in the app*, at the moment you bind encryption to anything

Passkeys can still help in this system — just don’t make them the single point of irreversible failure.

## My bias: authentication should stay boring

When we overload an authentication credential into a data custody key, we’re basically increasing blast radius because it’s convenient for engineers.

I’m not saying “never use PRF for anything”.

I’m saying: if a user can delete something in 3 taps, then it’s not a good place to hide the only key to their life.

---

**References:**
- [Tim Cappalli: “Please stop using passkeys for encrypting user data” (PRF warning)](https://blog.timcappalli.me/p/passkeys-prf-warning/)
- [W3C: WebAuthn PRF extension (spec background)](https://w3c.github.io/webauthn/#sctn-prf-extension)
- [W3C: Passkey Endpoints and PRF usage details (so UIs can warn users)](https://www.w3.org/TR/passkey-endpoints/#usage)
