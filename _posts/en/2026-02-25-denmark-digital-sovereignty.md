---
layout: post
title: "Denmark's Microsoft Exit Isn’t About LibreOffice — It’s About Control"
date: 2026-02-25 11:00:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![Denmark digital sovereignty](/img/posts/2026-02-25-denmark-digital-sovereignty-01.webp)

When a government agency says it’s ditching Microsoft Office for LibreOffice, the internet predictably turns it into a “lol good luck opening .docx” joke.

But if you read between the lines, this isn’t really about word processors. It’s about **who gets to pull the emergency brake** when politics, pricing, or platform decisions swing against you.

Denmark’s digital modernization ministry is reportedly moving staff off Microsoft Office next month, aiming for a broader open‑source transition by the end of the year. They explicitly framed it as reducing dependence on U.S. tech firms — and that’s the real story.

## The boring part: spreadsheets
Yes, office suites matter. Formatting bugs matter. Macros matter. People will complain.

If this were “just” a cost-cutting exercise, they could negotiate licenses, switch plans, or do the normal procurement dance. Governments have been doing that forever.

The interesting part is that they’re choosing the painful route on purpose.

## The real part: dependency shows up on the worst day
The problem with vendor lock-in is you don’t feel it on normal days. You feel it when you’re already under stress:

- **A support deadline hits** (Windows 10 end-of-support is a very real forcing function)
- **A geopolitical fight breaks out** and suddenly “where your data lives” stops being a theoretical debate
- **A pricing or product change** lands and your only options are “accept it” or “migrate in panic mode”

Digital sovereignty is basically a fancy way of saying:

> “We want the option to leave without setting the building on fire.”

LibreOffice is less the destination and more the proof that they’re willing to pay an upfront migration tax to buy that option.

## If you’re an engineer, here’s what to watch (not the Office UI)
Office apps are the visible part. The hard part is usually everything around it:

1. **Identity + device management**: who’s doing auth, MDM, and policy enforcement if you unwind Microsoft 365?
2. **Email + calendar**: the moment you touch Outlook/Exchange equivalents, org pain goes nonlinear.
3. **Document workflows**: templates, compliance, retention, e‑discovery, signatures.
4. **Interoperability rules**: do they mandate open formats (ODF) internally, or are they still living in a .docx world?

If Denmark (and other European regions doing similar moves) can build a playbook here, it matters far beyond Denmark. It becomes a reusable migration pattern instead of a heroic one-off.

## My take
I don’t think “open source” is magic. It’s work.

But I do think **control is underrated** until you lose it.

And honestly, I respect a government that admits: “We might roll back if it’s too complex.” That’s not weakness — that’s what operational honesty looks like.

If they pull it off, the win isn’t LibreOffice. The win is proving that a modern organization can design for exit.

---

**References:**
- [Recorded Future News: Denmark’s digital agency plans to replace Microsoft products with open-source software](https://therecord.media/denmark-digital-agency-microsoft-digital-independence)
- [Politiken interview referenced in the report (Danish): Minister discusses phasing out Microsoft in the digitalisation ministry](https://politiken.dk/viden/tech/art10437680/Caroline-Stage-udfaser-Microsoft-i-Digitaliseringsministeriet)
- [Euronews: Danish municipalities previously announced moves away from Microsoft amid sovereignty concerns](https://www.euronews.com/next/2025/06/12/two-city-governments-in-denmark-are-moving-away-from-microsoft-amid-trump-and-us-big-tech-)
