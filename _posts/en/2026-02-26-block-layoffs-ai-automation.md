---
layout: post
title: "Block cuts nearly half its staff — and the most honest part is saying it’s for AI"
date: 2026-02-26 22:20:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---

![A trader watches a market screen, used here as a cover for the story about Block’s layoffs and “AI to automate more work.”](/img/posts/2026-02-26-block-layoffs-ai-01.webp)

Block says it’s laying off **more than 4,000 people** — roughly **half the company** — and the market rewards it with a big after-hours pop.

You can be mad about that (I kind of am), but the part that stuck with me isn’t the stock move. It’s how explicitly they frame the next operating model:

- smaller teams
- “highly talented” teams
- and **AI to automate more work**

Most CEOs have been *hinting* at this for a year.
Block just said it out loud.

## The “AI” framing is both a reason and a mask

When a company cuts half its headcount, there are usually multiple truths stacked together:

1) They want cost reduction.
2) They want a reset on org complexity.
3) They want to move faster.
4) They see AI as leverage.
5) They also want a story that investors can understand in one sentence.

“AI will automate more work” covers (4) and (5) beautifully.

But it can also be a mask for (2): lots of companies are slow not because they lack AI, but because they’ve built a bureaucracy that only exists to manage the bureaucracy.

AI doesn’t fix that by itself. It just makes the gap more obvious.

## Here’s the uncomfortable takeaway for engineers

If you’re reading this as an engineer, the cynical version is:

> “They’re using AI as an excuse to fire people.”

Sometimes, yes.

But the more useful version (the one that actually changes what you do next week) is:

> “Management now believes the throughput curve looks different.”

Not because LLMs write perfect code. They don’t.

Because a bunch of work that used to require *coordination-heavy teams* can now be done by:

- fewer people who can hold more context
- faster iteration cycles (drafts are cheap)
- automation around the boring glue work (docs, tests, migrations, internal tooling)

That’s not “AI replaces engineers.”
That’s “AI changes what kind of engineering org survives.”

## The part nobody wants to admit: small teams are a quality filter

When a CFO writes “smaller, highly talented teams,” I read it as:

- less tolerance for weak ownership
- less patience for slow feedback loops
- less appetite for roles that only exist because the org is messy

That can be great for product velocity.
It can also be brutal.

And if your company is heading there, the “AI strategy” question is not “which model are we using?”

It’s:

- Do we have systems that are **understandable enough** to change quickly?
- Do we have CI/CD that doesn’t make every change a ceremony?
- Do we have observability that makes “AI-written code” debuggable when it breaks at 2 a.m.?

Because when teams get smaller, **operational drag becomes existential**.

## Why the market loves this story (even if humans shouldn’t)

Investors love simple narratives:

- fewer employees → lower opex
- AI → higher output per employee
- “next phase of growth” → optimistic forward guidance

That’s the spreadsheet version.

The human version is: thousands of people are suddenly unemployed, and the moral justification is “efficiency.”

Both can be true at the same time, which is why this topic keeps feeling gross.

## My prediction: more companies will do this, but most will do it badly

Block’s CEO basically said others will follow.
I believe that.

But most companies will copy the *headline* (layoffs + AI) and not the hard prerequisites:

- clear ownership boundaries
- ruthless simplification of systems
- a culture that can write down decisions (so AI tools don’t amplify chaos)

If you reduce headcount without fixing the underlying complexity, you don’t get “smaller teams moving faster.”

You get **smaller teams drowning faster**.

---

**References:**
- [CNBC report on Block’s layoffs and the “AI to automate more work” quote](https://www.cnbc.com/2026/02/26/block-laying-off-about-4000-employees-nearly-half-of-its-workforce.html)
- [Block Q4 2025 shareholder letter (PDF)](https://s29.q4cdn.com/628966176/files/doc_financials/2025/q4/Q4-2025-Shareholder-Letter_Block.pdf)
- [Jack Dorsey’s post about choosing one major cut instead of repeated rounds](https://x.com/jack/status/2027129697092731343)
- [SEC filing referenced by CNBC about restructuring charges (8‑K)](https://www.sec.gov/ix?doc=/Archives/edgar/data/0001512673/000119312526076557/d108590d8k.htm)
