---
layout: post
title: "When Free Models Spawn Premium Agents: The Copilot Billing Bypass Nobody Saw Coming"
date: 2026-02-09 07:15:00 +0000
categories: [AI, Engineering]
tags: [AI, Engineering]
image: /img/posts/copilot-billing-bypass.webp
---

Someone just found a way to run unlimited Claude Opus 4.5 requests through GitHub Copilot without paying for them. The method? Start with a free GPT-5-mini model, have it spawn a subagent with an agent definition that uses a premium model. Boom — the billing system only sees the free tier, the actual work gets done by the expensive model.

[The GitHub issue](https://github.com/microsoft/vscode/issues/292452) has 180 points and 93 comments. Microsoft's security response center (MSRC) said this isn't a security issue and told the reporter to file a public bug report instead.

Let that sink in. Bypassing billing controls isn't a security issue.

## The Technical Breakdown

Here's how it works:

1. Set your chat model to GPT-5 Mini (free, included in Copilot)
2. Create an agent definition with `model: Claude Opus 4.5`
3. In agent mode, tell the free model to launch your agent as a subagent
4. The free model creates the subagent (also free)
5. The subagent runs with the premium model
6. No premium credits consumed

The cost is calculated on the initial model. Subagents and tool calls don't count. So you get Claude Opus 4.5 (normally 3 premium requests per query) for the price of GPT-5 Mini (zero).

The reporter even built a loop that ran hundreds of Opus 4.5 subagents over 3 hours, consuming only 3 premium credits for the initial message.

## This Isn't a Bug, It's Architecture

What bugs me isn't that someone found this. It's that this design made it to production.

The billing logic shouldn't be client-side. The message "type" is [declared on the client](https://github.com/microsoft/vscode-copilot-chat/blob/main/src/extension/intents/node/toolCallingLoop.ts#L484) with no apparent API validation. That's not a bug — that's a choice.

When you let the client decide what counts as a billable event, you're trusting developers to not look at the code and figure out the loopholes. That's not security. That's wishful thinking.

For a company that runs Azure, this is embarrassing. They know how to do metered billing. They do it for compute, storage, API calls. But for AI agent orchestration? Apparently the thought process was "just trust the client to report honestly."

## The Enterprise Angle

If you're an IT manager who just bought Copilot licenses for your team, you're now in a fun position:

- You budgeted for X premium requests per month
- An engineer discovered this trick (or will soon)
- Your actual consumption could be 10X, 100X, or infinite
- You won't know until the bill arrives

And when you escalate to Microsoft, they'll tell you what MSRC already said: this isn't a security issue, so there's no CVE, no patch timeline, just a public issue tracker where everyone can read how to do it.

The fun part is that most developers won't abuse this. Not because they're ethical (though many are), but because it's easier to just use Copilot normally than to craft `.prompt.md` and `.agent.md` files that orchestrate subagent spawning. The damage won't come from mass exploitation. It'll come from a few power users running multi-hour agentic workflows that burn through premium model calls while the billing system thinks it's GPT-5 Mini.

## MSRC's Take: "Not In Scope"

The reporter initially submitted this to Microsoft Security Response Center (MSRC case VULN-172488). MSRC's position: bypassing billing is outside of security scope.

I get the argument. Security traditionally means unauthorized access, data breaches, privilege escalation. If the system works as designed and users just found a billing loophole, that's a product bug, not a CVE.

But here's the thing: when your product is sold on a metered billing model, and the meter can be gamed this easily, that's a trust issue. Customers trusted that when Microsoft says "3 premium credits per Opus 4.5 query," that's what they'll be charged. Finding out that you can spawn unlimited Opus 4.5 subagents for free undermines that trust.

If I'm a CISO evaluating AI tools for my org, I'm not just asking "is the data secure?" I'm also asking "can our developers accidentally or intentionally run up a five-figure bill?" This issue says yes.

## The Bigger Pattern

This isn't the first time we've seen billing bypasses in AI tooling. It won't be the last.

The problem is that AI agents are fundamentally different from traditional SaaS. A normal API call is atomic: you make a request, you get a response, you get billed. But agentic workflows spawn subagents, run tool loops, chain multiple models together. The question of "what counts as one request?" gets messy fast.

And when billing logic lives client-side, or when it's based on the initial model without tracking what actually runs, you get situations like this.

What worries me more is the broader state of AI cost control in enterprises. Companies are adopting Copilot, Cursor, Windsurf, Devin, and a dozen other AI coding tools. Each has its own billing model. Each has its own agent orchestration quirks. Who's tracking all this? Who's auditing whether the actual usage matches the expected cost?

From what I've seen, the answer is: nobody. IT knows they need AI tools. Engineers pick what they like. Finance sees a bill at the end of the month and approves it because "AI is strategic." There's no mature cost governance framework yet.

And issues like this one show that even the vendors don't have it figured out.

## What Happens Next

Microsoft will probably fix this. The issue is public, there's enough attention on it, and the workaround is simple enough that someone will write a script to automate it.

But the fix will be reactive. They'll patch this specific loophole. Then someone will find another one. Because the fundamental problem — metering complex agentic workflows — is hard, and the current approach clearly didn't account for all the edge cases.

For now, if you're managing Copilot deployments, you might want to check your usage reports. And if you're building AI tools with metered pricing, maybe don't trust the client to tell you what to bill.

---

## References

- [GitHub Issue #292452: Billing can be bypassed using subagents](https://github.com/microsoft/vscode/issues/292452) — Original bug report with technical details
- [VSCode Copilot Chat: toolCallingLoop.ts](https://github.com/microsoft/vscode-copilot-chat/blob/main/src/extension/intents/node/toolCallingLoop.ts#L484) — Client-side message type declaration
