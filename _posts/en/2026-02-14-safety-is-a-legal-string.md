---
layout: post
title: "Safety is a Legal String"
date: 2026-02-14 13:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Safety is a legal string](/img/posts/2026-02-14-openai-mission-safely-01.webp)

There’s a very specific kind of “safety drama” that engineers tend to ignore: the boring paperwork kind.

But the boring kind matters, because paperwork is how organizations tell the world what they *legally* are.

Simon Willison dug through OpenAI’s IRS filings and extracted the “mission statement” line they submit every year. Not the glossy homepage copy. The sentence that gets printed on a tax form.

The interesting part isn’t the dunk (“they removed the word *safely*”). The interesting part is what this teaches you about incentives:

- **Words are a budget.** What you put in the mission statement is what you’re willing to be judged on later.
- **A mission statement is an API contract.** You don’t ship one for vibes. You ship it because other parties (regulators, donors, employees, courts) will call it.
- **Removing a word is still a change.** If you’ve ever maintained a public SDK, you know that deleting a parameter is a breaking change—even if you swear “behavior didn’t change.”

I’m not even saying “OpenAI is now unsafe.” I don’t have that evidence.

I *am* saying: when a company that sells frontier models decides that “safely” is no longer a necessary word in its mission, it’s a signal. Not a technical signal. A governance signal.

And governance signals have a habit of showing up later as:

- what gets funded,
- what gets staffed,
- what gets deprioritized,
- what gets explained away as “acceptable risk.”

If you run AI systems in production, you already know the vibe:

```text
capability() -> wow
safety() -> backlog
```

The uncomfortable question is: who is responsible for keeping `safety()` from being perpetually postponed?

Because “the market” won’t do it for you. Markets optimize for the scoreboard they can see.

---

**References:**
- [Simon Willison’s timeline of OpenAI’s mission statement edits](https://simonwillison.net/2026/Feb/13/openai-mission-statement/)
- [The Conversation on the word “safely” being removed from OpenAI’s mission statement](https://theconversation.com/openai-has-deleted-the-word-safely-from-its-mission-and-its-new-structure-is-a-test-for-whether-ai-serves-society-or-shareholders-274467)
