---
layout: post
title: "Notepad's Markdown links turned into a tiny RCE surface — and the fix is basically: prompts"
date: 2026-02-12 05:00:00 +0000
categories: [Tech]
tags: [Tech]
author: Tommy
lang: en
---

![Screenshot of a Markdown file in Notepad with links used as the exploit primitive](/img/posts/2026-02-12-notepad-markdown-link-rce-01.webp)

I have a soft spot for Notepad because it’s the closest thing Windows has to a “trust nothing, just text” tool.

So it’s kind of hilarious (and slightly depressing) that as soon as Notepad grew Markdown support, it also grew a new class of bug: **links as an execution surface**.

The recent Windows 11 Notepad issue (CVE-2026-20841) is basically this:

- Notepad renders Markdown links.
- Some link schemes aren’t “web browsing”; they’re *system behaviors* (launching handlers, opening installers, touching local files, etc.).
- If the app treats those schemes as normal clickable links, you’ve turned a text file into a **workflow trigger**.

That’s enough to qualify as “remote code execution” if the click can launch something executable without a meaningful warning.

## The part that matters isn’t Notepad — it’s the pattern

This isn’t a “lol Microsoft” post. This is a product pattern:

1. You ship a document viewer/editor.
2. You add a “nice” feature (rich text, Markdown, previews).
3. You accidentally import the entire browser threat model.

In security terms, you didn’t add Markdown. You added an **embedded link dispatcher**.

And once links exist, attackers stop thinking in terms of “formatting.” They think:

```text
what_input -> which_handler -> which_side_effect
```

That’s the whole game.

## Why prompts are a weak but inevitable fix

The fix (as reported) is basically: *if the user clicks a non-http(s) link, show a warning dialog.*

That’s… fine. It’s also the lowest-friction option, and therefore the one product teams pick.

But prompts are not a security boundary. Prompts are a **user training exercise**, and the internet is a giant machine that trains users to click “Yes” to keep moving.

If you’re designing this class of feature, I think the hierarchy should be:

- **Best:** disallow dangerous schemes entirely in rendered mode.
- **Acceptable:** allowlist safe schemes + hard block everything else.
- **Fallback:** warn + require explicit intent.

Notepad is choosing the fallback.

I get it. If you block everything except http(s), users will complain that `mailto:` doesn’t work, internal tooling breaks, etc.

But from an engineering perspective, you’re making a call:

```text
compatibility > safety
```

That tradeoff should be explicit.

## If you build any “Markdown viewer”: steal this checklist

If your product renders Markdown (or any doc format that supports links), this is the boring checklist I’d actually want in the PR:

- Do we have a **scheme allowlist**?
- Do we treat `file:` as untrusted by default?
- Do we block “execution-adjacent” schemes (installers, settings, search, custom app protocols)?
- If we warn, is the warning text specific enough that a user can understand the risk?
- Do we log/telemetry non-http(s) link clicks as a potential abuse signal?

Because “Markdown support” sounds harmless. In practice it’s a tiny router into OS behaviors.

## The deeper point: the attack surface is wherever you collapse contexts

A text editor is one context. The OS protocol handler table is another.

The moment you make a *piece of text* become a *system action*, you’ve collapsed contexts — and that’s where these bugs breed.

![Second screenshot showing the follow-up step / impact scenario](/img/posts/2026-02-12-notepad-markdown-link-rce-02.webp)

## References

- [BleepingComputer report on the Windows 11 Notepad Markdown link RCE (CVE-2026-20841)](https://www.bleepingcomputer.com/news/microsoft/windows-11-notepad-flaw-let-files-execute-silently-via-markdown-links/)
- [Microsoft Security Response Center entry for CVE-2026-20841](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-20841)
- [Proof-of-concept repository referenced by researchers (CVE-2026-20841 PoC)](https://github.com/BTtea/CVE-2026-20841-PoC)
