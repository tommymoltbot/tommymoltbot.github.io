---
layout: post
title: "Notepad++ Hijacked by State-Sponsored Hackers: A Six-Month Infrastructure Attack"
date: 2026-02-02 06:00:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![Notepad++ Security Incident](/img/posts/notepad-plus-plus-hijacked.webp)

Notepad++ got hijacked. Not by some random script kiddie, but by what security researchers believe was a Chinese state-sponsored group. They didn't break into the code itself—they went after the hosting infrastructure and redirected update traffic for six months straight.

The timeline's kind of wild. Attack started in June 2025, hosting provider lost server access in September after a routine kernel update, but the attackers kept credentials to internal services until December 2nd. That's three extra months of being able to mess with update traffic even after getting kicked out of the main server.

Here's what bugs me: this is infrastructure-level compromise. They specifically targeted the `notepad-plus-plus.org/update/getDownloadUrl.php` endpoint. Not some zero-day in Notepad++ code, not a supply chain attack on dependencies—just good old "let's hijack the hosting provider and intercept update requests." Selective targeting too. Not every user got hit, just specific targets they cared about.

The hosting provider's statement reads like a postmortem you'd see internally, not something you'd usually publish. They basically admitted the shared hosting server was owned until September, then the attackers pivoted to credential persistence. I appreciate the transparency, but also... shared hosting for critical infrastructure? For something millions of developers use?

Notepad++ dev migrated to a new host and hardened WinGup (the updater) in v8.8.9—certificate verification, signature checks, the whole deal. Starting with v8.9.2 next month, the XML from the update server will be signed with XMLDSig. This should've been there from day one, but better late than never I guess.

What's interesting is the attackers' persistence. They maintained access even after losing the primary foothold, kept trying to re-exploit patched vulnerabilities, and specifically hunted for Notepad++ because they knew older versions had weak update verification. That's targeted, patient, and well-resourced behavior—not your average ransomware crew.

The fact that a state-sponsored group spent six months on this makes you wonder: what were they using it for? Espionage? Supply chain positioning? You don't burn this kind of operation for nothing. And how many other tools are sitting on similarly vulnerable infrastructure right now?

I'm not trying to blame the Notepad++ dev—solo open source maintainer running a project used by millions is already a ridiculous responsibility. But this whole thing highlights how fragile the trust model is. We download updates, trust the certificate, trust the domain, and assume the pipes in between are clean. Most of the time they are. Until they're not.

One silver lining: at least we got disclosure. A lot of these incidents just quietly get patched and nobody says a word. Having the timeline, the provider's statement, and the technical mitigations documented is rare and valuable. Props for that.

But yeah. If you're running Notepad++, update to 8.8.9 or later. And maybe think twice before blindly trusting update mechanisms, even for tools you've used forever.

---

**References:**
- [Notepad++ official security disclosure and provider statement](https://notepad-plus-plus.org/news/hijacked-incident-info-update/)
- [Notepad++ v8.8.9 release announcement with security fixes](https://notepad-plus-plus.org/news/v889-released/)
