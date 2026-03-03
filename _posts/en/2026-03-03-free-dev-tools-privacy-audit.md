---
layout: post
title: "Free Online Dev Tools Aren’t Free: A Privacy Audit That Should Make You Rethink Pasting Secrets"
date: 2026-03-03 21:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A padlock on a keyboard](/img/posts/2026-03-03-dev-tools-privacy-tracking-01.webp)

I’ve always had this tiny bad habit: when I’m in a hurry, I’ll paste a chunk of JSON into some random “formatter” tab I left open, fix the indentation, move on.

And yeah, I *know* the rule: “don’t paste secrets into random websites.”

But what hit me reading a recent privacy audit is that the real risk isn’t only “the site steals your API key.”

The scarier part is: you’re doing the paste inside a page that’s running a whole surveillance industry in parallel.

## The uncomfortable model: the tool is the bait

A developer tool page can be “client-side” (it never POSTs your input), and still be a privacy mess.

Because the page can simultaneously:
- contact a pile of ad networks and trackers the moment it loads,
- fingerprint your browser (timezone, resolution, GPU/WebGL bits, etc.),
- sync your identity across ad exchanges,
- and ship page URLs / titles to analytics.

So even if your pasted content stays local, **your dev activity becomes data**.

I don’t love that sentence.

## What the audit found (the parts I can’t unsee)

The audit I read used automated browsing + network inspection to see what leaves the browser when people use popular free tools.

A few highlights:

### 1) “Just a JSON formatter” that boots 20+ trackers first
Some sites start ad auctions and tracker calls *before you type anything*. It’s not “a banner ad.” It’s a tracking stack.

### 2) Diff tools that appear to store your diffs server-side
One example in the audit pointed out a telltale pattern: after you click “diff,” the URL changes to something like `/unsaved/{id}`.

That’s… not a great sign. It implies the diff content got uploaded and referenced by a server-generated identifier.

### 3) Leakage through the page title
Even if you never share a link, if the page title includes a snippet of your input, that content can end up in places you didn’t think about:
- browser history
- tab titles during screen-share
- analytics that read `document.title`

### 4) “1,570 partners” for a Base64 decoder
If a consent dialog says it has **over a thousand advertising partners**, I don’t care how good the UI is. That’s not a tool anymore; that’s an ad business wearing a tool’s skin.

## My practical rule set (what I do now)

I’m not going to pretend everyone will stop using web tools overnight. Sometimes you just need to move.

But here’s a more realistic checklist:

### Prefer local tools for anything sensitive
Use CLI tools that never need the network:

```text
jq . file.json

diff -u old.txt new.txt

base64 --decode < input.b64 > output.bin
```

### If you must use a web tool
- Treat the tab like a hostile environment.
- Open DevTools → Network before pasting. Watch what lights up.
- Use an ad blocker.
- Paste redacted data (replace real keys with `REDACTED`).
- Avoid tools that generate shareable URLs for your content.

### Use “privacy-first” tools that are actually client-side
There *are* sites that keep processing local and keep tracking minimal. The audit mentioned regex101 as a rare “okay, respect” example.

## The engineer takeaway

We spend so much time talking about secret scanning and vaulting, but we ignore the tiny daily paper cuts:

The “quick formatter” tab.
The “just diff it online” shortcut.
The “decode this token real quick” moment.

Individually, they feel harmless.
At scale, it’s how your work habits get turned into a profile.

And I’m not interested in being somebody’s ad inventory just because I needed indentation.

---

**References:**
- [Privacy audit of popular free online dev tools (ToolBox blog)](https://www.toolbox-kit.com/blog/i-audited-popular-dev-tools-privacy-results-are-scary)
- [Unsplash photo used as header image (Towfiqu barbhuiya)](https://unsplash.com/photos/FnA5pAzqhMM)
