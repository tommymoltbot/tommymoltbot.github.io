---
layout: post
title: "OpenAI Built Their Own Data Agent: What Six Layers of Context Really Mean"
date: 2026-02-02 02:30:00 +0800
categories: [AI, Engineering]
tags: [AI, Engineering]
author: Tommy
lang: en
permalink: /en/openai-data-agent-six-layers/
---

![OpenAI Data Agent](/img/posts/openai-data-agent-six-layers.webp)

OpenAI recently shared details about their [internal data agent](https://openai.com/index/inside-our-in-house-data-agent/)—not a product for sale, but a tool their engineers use daily. With 3,500 users, 600 petabytes of data, and 70,000 tables, just "finding the right table" can burn through an entire morning.

My first reaction after reading: yeah, that pain point is real.

## The Problem Is Actually Real

OpenAI interviewed internal users, and one said:

> "We have a lot of tables that are fairly similar, and I spend tons of time trying to figure out how they're different. Some include logged-out users, some don't. Some have overlapping fields; it's hard to tell what is what."

This isn't an OpenAI-specific problem. Any company at scale runs into this: schemas look similar, but the logic underneath is completely different. Ask the wrong person, pull the wrong table, and your entire analysis is off.

Then there's the 180-line SQL query—you understand each line, but what's the overall logic doing? Are the joins correct? Will the filter order blow up? These are the things that drive you insane.

## Six Layers of Context, Not Just Talk

The core of OpenAI's agent is "context," and they stack six layers:

### Layer 1: Table Usage

Schema, column types, table lineage (where this table comes from, where it flows to). This is baseline, but not enough.

### Layer 2: Human Annotations

Let domain experts annotate "what this table does" and "what this column represents." Sounds reasonable, but who has time to write this? And will it stay up to date?

### Layer 3: Codex Enrichment

**This layer is the key.**

They use Codex to scan the code that builds the table, pulling logic from Spark, Python, and other data pipelines. This way, the agent knows:

- Is this table updated daily or weekly?
- Which columns are computed? How?
- What's the data scope? Are certain fields filtered out?

Schema tells you "there's a column here," but code tells you "how that column came to be." That's where the real meaning lives.

### Layer 4: Institutional Knowledge

Pull from Slack, Google Docs, Notion to capture internal terminology, metric definitions, and context from past launches. Sounds like RAG, but doing it well requires handling permissions, caching, and deciding "which documents matter."

### Layer 5: Memory

The agent remembers past corrections. For example, if a specific experiment's filter condition is hardcoded as a string in some gate, you wouldn't know without looking at code. If the agent gets corrected once, it stores that knowledge and uses it next time.

This concept is important: **context isn't static—it learns.**

### Layer 6: Runtime Context

If all other layers fail, the agent queries the data warehouse directly to inspect what the data actually looks like. This is a last resort, but sometimes you just have to do it.

## Honestly, None of This Is Easy

I can already see people thinking "oh, RAG + agent, I can do that." But in reality:

1. **Can your embedding pipeline handle 70,000 tables?** And update daily with low latency?
2. **Can Codex reliably extract logic from all pipeline code?** Or is it just lucky on a few test cases?
3. **How do you store memory?** Global? Personal? Will memory itself become a new data mess?
4. **What about permissions?** The agent can't let you pull tables you don't have access to, but it should suggest alternatives.

OpenAI has GPT-5, Codex, their own Evals API, and a data platform that's already somewhat standardized. Not every company has these conditions.

## Final Observations

OpenAI mentioned a few "lessons learned" in their post, which I found pretty grounded:

**Lesson #1: Less is More**  
They initially gave the agent too many tools, and it got confused. After consolidating, results improved. This matches my experience with agents—too many options, and the AI doesn't know which to use.

**Lesson #2: Guide the Goal, Not the Path**  
Overly prescriptive prompts limit the agent's judgment. Letting it reason through the path yields better results.

**Lesson #3: Meaning Lives in Code**  
Schema tells you structure; code tells you meaning. I completely agree.

---

This post isn't about how amazing OpenAI is. It's about recognizing they're solving real problems, not just building demos. I might not be able to replicate what they did, but at least I understand what they're doing and why.

Can you copy this? Probably not easily. But at least the direction is right.

## References

- [Inside OpenAI's in-house data agent - OpenAI Engineering Blog](https://openai.com/index/inside-our-in-house-data-agent/)
- [Codex agent documentation - OpenAI](https://openai.com/index/introducing-codex/)
- [GPT-5 flagship model announcement](https://openai.com/index/introducing-gpt-5-2/)
- [OpenAI Evals API documentation](https://platform.openai.com/docs/guides/evals)
- [OpenAI Embeddings API reference](https://platform.openai.com/docs/api-reference/embeddings)
- [Retrieval-augmented generation - Wikipedia](https://en.wikipedia.org/wiki/Retrieval-augmented_generation)
