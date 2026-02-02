---
layout: post
title: "Two Kinds of AI Users, One Astonishing Gap"
date: 2026-02-02 10:30:00 +0800
categories: [AI, Tech]
lang: en
image: /img/posts/two-kinds-of-ai-users.webp
---

![The future of knowledge work: user prompting an agent that connects to systems via APIs and generates outputs](/img/posts/two-kinds-of-ai-users.webp)

I recently came across an article that exploded on Hacker News: 188 upvotes, 165 comments. The title was simple: "Two kinds of AI users are emerging. The gap between them is astonishing." I clicked through, read it, and my first reaction was—damn, this is exactly what I've been seeing these past few months.

The author, Martin Alderson, describes the phenomenon plainly: AI users are splitting into two groups. One group consists of power users running Claude Code, using terminals, MCPs, and skills. The other? Still chatting with ChatGPT on a web page.

Sounds unremarkable, right? But the actual gap is huge. The article gives an example: a non-technical CFO used Claude Code to convert a 30-sheet Excel financial model into Python with just a few prompts. After the conversion? He suddenly had the capabilities of an entire data science team—running Monte Carlo simulations, pulling external data sources, building web dashboards.

That's the gap between these two types of users. On one side, people slowly tweaking Excel formulas. On the other, people re-architecting entire workflows with code.

## Microsoft Sells Copilot, Uses Claude Internally

The most ironic part of the article? Microsoft's internal teams are rolling out Claude Code, even though they have M365 Copilot, even though they're a major OpenAI investor, even though Copilot costs them nearly nothing internally.

Why? Because Copilot **really is terrible**.

The author puts it bluntly: "Copilot feels like a poorly cloned version of the ChatGPT interface." How does its agent feature compare to CLI coding agents? "It's absolutely laughable."

Worse still, in many enterprises Copilot is the **only permitted AI tool**. IT policies lock everything down. Want to use something else? Either risk getting fired or spend ages going through procurement. The result? C-suite executives use this terrible tool and conclude: "AI is useless."

Then they dump budgets into consulting firms and spend fortunes getting nowhere.

## How Enterprises Die

The article breaks down the enterprise problem into three fatal combinations:

1. **Locked-down IT environments**: Can't even run a script; VBA if you're lucky
2. **No APIs**: Core systems are ancient with no "internal APIs" to connect to
3. **Outsourced or siloed engineering teams**: No one can help you build a safe agent sandbox

What do these three add up to? Enterprises **cannot use genuinely useful AI tools**.

I think this observation is spot on. It's not that enterprise security concerns are wrong—you absolutely don't want people casually running coding agents against production databases. But when your IT policies lock down all possibilities and your engineering team lacks the capability to build a safe environment, you're stuck.

Small companies? No such baggage. They use modern SaaS tools, most with ready-made APIs. Employees can install Python locally, run scripts, use Claude Code. The result? A 10-person team can be more productive than a 1,000-person enterprise division.

This is the first time I've seen small teams genuinely **crush** large companies purely on execution.

## Finance People Don't Need Engineers Anymore

There's a detail in the article I particularly liked. The author mentions seeing many **non-technical people** using Claude Code effectively. Especially in finance roles.

Why? Because Excel is genuinely too weak for financial analysis.

Once you get used to Python's flexibility, Excel's "drag formulas, copy formatting, manual adjustments" workflow feels incredibly limiting. But before, there was no choice—finance people couldn't code, and hiring engineers was too slow with too much communication overhead.

Now? Claude Code converts your Excel to Python, then you ask it directly: "Run a Monte Carlo simulation," "Visualize this data," "Connect to this API." And it does it.

This is real productivity revolution. Not some "30% efficiency improvement" on a PowerPoint slide, but **fundamentally changing how work gets done**.

## What's Next

The author ends with several observations I find compelling:

**First, real progress is bottom-up.**  
Not some "AI transformation strategy" or "digital transformation initiative," but small teams deciding to try things and producing results. They know the workflows best; they don't need outsourced engineers guessing.

**Second, companies with APIs will win.**  
Whether it's a read-only data warehouse or fully API-fied core processes, companies that let agents connect will move faster than others.

**Third, legacy SaaS companies are at risk.**  
If your product was built decades ago with APIs bolted on later for developers only, you might become a bottleneck. Employees will want to bypass you because you can't keep up with their needs.

**Fourth, small team era has arrived.**  
Never before in history could a 10-person team so easily beat a company 1,000 times its size.

## My Own Take

I'm genuinely seeing what this article describes around me.

Some friends at small companies tell me their AI-assisted development speed is way faster than before. And it's not "copy-paste from ChatGPT," but genuinely using Claude Code as **an always-available senior colleague** to discuss with.

Meanwhile, friends at big enterprises are still stuck with that terrible Copilot, or can't touch AI tools at all because IT policies forbid it.

The gap will keep widening. And I think this isn't just a tools problem—it's an **organizational structure problem**. Big enterprise IT policies, procurement processes, security reviews—these might have been tolerable in the pre-AI era, but now? They've become **fatal disadvantages**.

Small companies don't have this baggage. They can quickly test, quickly adjust. Big enterprises? By the time your approval process finishes, others have iterated three times.

So I think the next few years will be fascinating. Either big enterprises genuinely start reorganizing, changing processes, giving employees more freedom, or they'll watch small teams eat their market share.

For engineers, it's an interesting time. You can choose to stay at a big company slowly dying, or join a small team experiencing that "10 people doing the work of 1,000" thrill.

I know which one I'd pick.

## References

- [Original article: Two kinds of AI users are emerging (Martin Alderson's blog)](https://martinalderson.com/posts/two-kinds-of-ai-users-are-emerging/)
- [Discussion: Heated debate on Hacker News about the two types of AI users](https://news.ycombinator.com/item?id=46850588)
