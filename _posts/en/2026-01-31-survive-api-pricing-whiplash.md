---
layout: post
title: "Surviving API Pricing Whiplash (and Deprecation Mondays)"
date: 2026-01-31 12:00:00
categories: Tech
tags: Tech
author: Tommy
lang: en
---
![Robot arms in a lab](/img/posts/2026-01-31-survive-api-pricing-whiplash-01.webp)

I used to think “vendor lock-in” was a dramatic phrase people used to sell consulting gigs.

Then I shipped a product with an external API as its beating heart.

And one day—without any code changes on our side—our unit economics quietly did a backflip. The next week, the API version we were relying on was “sunsetting.” The week after that, our support inbox discovered a new hobby: sending us screenshots of error messages at 2:13 a.m.

If you build products on top of APIs—especially LLM APIs—you don’t just ship features. You inherit someone else’s pricing committee, their platform roadmap, their rate limits, their “oops we deprecated that endpoint” blog posts, and their incident response culture.

This post is a playbook for surviving that reality.

Not with hand-wavy “abstract your dependencies” advice. With concrete moves you can make—today—to keep shipping when prices jump, models get renamed, or a provider decides your use case is “not aligned.”

### The new kind of platform risk: LLMs make it personal

Traditional platform risk is annoying but usually legible:

- Payment processors change risk rules.
- Cloud providers introduce a new SKU.
- App stores update policies.
- Mapping APIs raise prices.

LLM APIs add a few spicy twists:

1. **The surface area is huge.** You’re not calling a single endpoint. You’re designing prompts, tool schemas, safety settings, eval harnesses, response formats, and “please don’t hallucinate” guardrails.
2. **Behavior changes even when the endpoint doesn’t.** A “model update” can shift tone, compliance, latency, and refusal behavior. That’s a product change.
3. **Cost is non-linear.** Token counts vary with user input, retrieved context, chain-of-thought suppression, tool calls, multi-turn chat history, and output verbosity.
4. **Deprecation is real, and frequent.** The pace of change is the point.

So if you treat “LLM provider selection” as a one-time architecture decision, you’re not being decisive—you’re being optimistic.

The goal is not to avoid risk. The goal is to **price it in, measure it, and design for it**.

### Step 0: Admit the truth—your API bill is part of your COGS

If your product delivers value through an API call, that call is not “hosting.” It’s cost of goods sold.

Which means:

- Finance cares.
- Pricing cares.
- Support cares.
- Sales cares.
- And you, the builder, should care enough to make the cost legible at a per-user and per-feature level.

If you can’t answer “how many dollars does this feature cost per 1,000 successful uses?” you’re driving at night without headlights.

Start with this instrumentation checklist:

- **Per-request token accounting** (input, output, cached/reused context if applicable).
- **Per-user and per-workspace cost rollups.**
- **Per-feature attribution** (e.g., summarize, rewrite, classify, agent run).
- **Latency and error metrics by provider/model/version.**
- **Rate-limit and timeout telemetry** (you want to see throttling before customers do).
- **Quality proxy metrics** (human feedback, rubric scores, task success rate).

This isn’t “nice to have.” It’s the foundation for every decision below.

### Step 1: Don’t be “multi-provider.” Be “switchable.”

A lot of teams hear “platform risk” and immediately promise themselves a multi-provider architecture.

Then they build:

- one prompt tuned for provider A,
- tool calls designed around provider A’s function-calling quirks,
- JSON output validated against provider A’s “mostly JSON” output,
- and a retrieval strategy that assumes provider A’s context window.

At that point, “multi-provider” is a slide, not a system.

Instead, aim for a sharper concept:

> **Switchable** means you can route a given workload to a different provider/model within hours (not quarters) while keeping product behavior within acceptable bounds.

Switchability is achieved through *interfaces*, *contracts*, and *test suites*, not through wishful thinking.

#### The Minimum Viable Abstraction (MVA)

Build a thin internal interface that captures what your product actually needs:

- `generate_text()` with explicit parameters (max tokens, temperature, response schema, safety requirements).
- `classify()` if you do classification.
- `embed()` if you do retrieval.
- `transcribe()` if you do audio.

But do **not** chase a “one API to rule them all” that exposes every knob from every vendor. That becomes a leaky mess.

The point is to define **your** contract.

A good internal contract includes:

- A **normalized request object** (prompt/messages, tools, retrieval context).
- A **normalized response object** (text, structured fields, tool calls, citations).
- A **standard error taxonomy** (timeout, rate limit, invalid request, safety refusal, provider outage).
- **Deterministic logging** (request hash, model/version, tokens, cost estimate).

Your abstraction is not to hide differences. It’s to isolate them.

### Step 2: Make “deprecation readiness” a product requirement

Deprecations feel like interruptions because teams treat them like interruptions.

Flip it: treat them like **weather**.

Not “if,” but “when.”

Concrete moves:

1. **Version pin everything.** Models, endpoints, response formats, SDK versions. “Latest” is not a strategy.
2. **Track provider announcements like security advisories.** Subscribe, set calendar reminders, and put it on someone’s rotation.
3. **Maintain a compatibility matrix** in your repo:
   - Supported providers
   - Supported model versions
   - Required features (tool calling, JSON schema, streaming)
   - Known behavior notes (“model X refuses more often on finance prompts”)
4. **Build a migration harness**: a script that replays a representative dataset of requests against a candidate model and reports diffs.

When you can replay 10,000 realistic tasks overnight and wake up to a report, deprecations become manageable. When you can’t, they become panic.

### Step 3: Treat LLM output as untrusted input (because it is)

Pricing whiplash and deprecations are dramatic, but reliability failures are sneakier.

If your system assumes the LLM will:

- always return valid JSON,
- always call the correct tool,
- always stay within policy,
- always cite sources,

…then you’re not building an LLM product. You’re building a demo.

Switchability also depends on this. Different models have different failure modes.

Practical guardrails:

- **Schema validation** for structured outputs; auto-retry with a repair prompt.
- **Tool-call sandboxing**: validate arguments, limit side effects, rate limit tools.
- **Budget caps**: max tokens, max tool calls, max turns per request.
- **Time caps**: overall SLA timeouts; graceful fallback to “lite mode.”
- **Fallback flows**: if structured fails, accept plain text; if agent fails, return partial.

Your users don’t care why the model failed. They care that the product kept moving.

### Step 4: Build a FinOps loop, not a one-time cost analysis

LLM costs move. Your usage patterns move. Your prompts move.

That means the only sustainable approach is a **continuous loop**:

1. Observe (measure cost and quality)
2. Decide (budget policies and routing)
3. Act (optimize prompts, caching, provider mix)
4. Verify (evals and regression tests)

This is basically FinOps applied to AI workloads.

If your org doesn’t know FinOps, here’s the simple translation:

- **Unit economics**: cost per task, per user, per workspace.
- **Allocation**: who/what is causing spend.
- **Optimization**: reduce cost without reducing outcomes.
- **Governance**: budgets, alerts, approvals, and guardrails.

Microsoft’s FinOps documentation is a solid starting point for the culture and mechanics of this loop (even if you’re not on Azure):

- [learn.microsoft.com/en-us/cloud-adoption-framework/…](https://learn.microsoft.com/en-us/cloud-adoption-framework/ready/azure-best-practices/finops)

Also, AWS’s Well-Architected **Cost Optimization Pillar** is the rare cloud document that reads like someone has actually paid an invoice before:

- [docs.aws.amazon.com/wellarchitected/latest/…](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html)

### Step 5: Use caching like an adult (and not as a desperate hack)

Caching is the closest thing we get to “free money” in LLM land.

But you have to be deliberate. There are multiple caches:

1. **Response cache**: same input → same output (works for deterministic tasks like classification).
2. **Embedding cache**: don’t re-embed identical chunks.
3. **Retrieval cache**: store top-k search results for common queries.
4. **Prompt/context cache**: reuse long system prompts or static context across calls.

Some providers now offer first-class prompt caching primitives, which is important because it can reduce both latency and cost when your request has a large static prefix.

Anthropic’s prompt caching docs (a stable entry point):

- [docs.anthropic.com/en/docs/…](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)

Rules of thumb:

- Cache **static** context (policies, style guides, long instructions) aggressively.
- Cache **user-specific** context carefully; it’s often sensitive and expires quickly.
- Never cache without thinking about **privacy** and **data retention**.
- Instrument cache hit rate like it’s a feature (because it is).

### Step 6: Design tiers and “quality knobs” you can turn

Pricing whiplash kills teams because they only have two modes:

- Full quality (expensive)
- Off (useless)

Instead, design your product with **graduated modes**:

- **Lite mode**: smaller model, shorter context, lower max tokens, fewer tools.
- **Standard mode**: normal behavior.
- **Premium mode**: best model, deeper reasoning, more retrieval, higher cost.

Then couple these modes to:

- user pricing tiers,
- internal budgets,
- and real-time provider conditions.

This is not just for margin protection. It’s also for incident response.

When your primary model is rate-limiting or having a bad day, you can degrade gracefully instead of going dark.

### Step 7: SRE thinking: error budgets for “model behavior”

The SRE community has spent decades turning reliability from an emotion into math.

The Google SRE book is still the cleanest explanation of concepts like SLIs, SLOs, and error budgets:

- [sre.google/sre-book/table-of-contents](https://sre.google/sre-book/table-of-contents/)

Apply the same thinking to LLM features:

- **SLI**: % of requests that return valid structured output.
- **SLI**: task success rate (did we actually solve the user’s problem?).
- **SLI**: average cost per successful task.
- **SLO**: 99% of tasks under X seconds.
- **Error budget**: how much failure you can tolerate before you freeze launches and fix reliability.

And yes, you can have an error budget for “the model suddenly refuses half the time.”

That’s not an act of God. It’s a dependency shift.

### Step 8: Have a “Tuesday plan” for when the provider changes something

Here’s the scenario I want you to rehearse:

- It’s Tuesday.
- Your provider ships an update.
- Your evals show a 6% drop in task success.
- Customer support sees a spike in “it doesn’t work anymore.”
- Your CFO sees a 18% jump in cost per task.

If your team’s response is “drop everything and investigate,” you’re going to live in permanent interruption.

Instead, write the plan now.

Your Tuesday plan:

1. **Detect**: dashboards + alerts on quality, latency, cost.
2. **Triage**: is it pricing, behavior, outage, or your own change?
3. **Mitigate** (fast):
   - route traffic to fallback model/provider,
   - reduce max tokens,
   - disable high-cost tool paths,
   - turn on stricter caching,
   - ship a hotfix prompt patch.
4. **Diagnose** (deep):
   - replay eval datasets,
   - inspect diff reports,
   - isolate which prompt or tool call regressed.
5. **Decide**: keep the new model, pin the old one, or migrate.
6. **Communicate**: status page, in-app notice, release notes.

The difference between “we’re fine” and “we’re cooked” is rarely intelligence. It’s preparation.

### Step 9: Contractual and procurement moves that actually help

Engineers don’t like contracts. I get it. But if your business depends on an API, procurement is part of your architecture.

A few non-sexy but high-impact moves:

- **Negotiate price protection** for a period, or volume discounts that align with your growth.
- **Get clarity on deprecation windows** and notification channels.
- **Data retention and training policies** in writing.
- **Support SLAs** if you’re big enough; incident comms matter.

If you can’t negotiate (early-stage reality), you compensate with stronger technical switchability and conservative pricing.

### Step 10: Price your product like your costs can change

If your pricing assumes your LLM cost will monotonically decrease, that’s adorable.

Yes, long-term compute trends can push costs down. But in the short term, **provider packaging** (what’s included, what’s billed separately, what gets discounted) is volatile.

So:

- Avoid unlimited “all-you-can-eat AI” unless you have strict fair-use limits.
- Offer usage-based overages for heavy workloads.
- Put expensive workflows behind explicit user actions (not auto-run everywhere).
- Align your pricing units with your cost units (per doc, per minute, per 1,000 actions).

The goal is not to squeeze users. The goal is to avoid waking up one morning with a product that is mathematically impossible to sell.

### Step 11: Keep a “provider exit kit” up to date

This is the one file I want every LLM product team to maintain:

**`/docs/provider-exit-kit.md`**

It contains:

- Current providers and models used (and why).
- Required capabilities (tool calling, JSON schema, streaming, context window).
- Dependency map (SDKs, endpoints, auth, rate limits).
- Migration steps and estimated effort.
- Known alternatives and what will break.
- Test harness instructions.
- Rollback plan.

This is not pessimism. This is professionalism.

### Step 12: Watch deprecations like you watch security

Finally, bookmark the official deprecation pages.

For OpenAI, the deprecations page is the canonical place to monitor model and API retirements:

- [platform.openai.com/docs/deprecations](https://platform.openai.com/docs/deprecations)

Your job isn’t to panic when something gets deprecated.

Your job is to never be surprised.

### The calm conclusion

If you’ve read this far, you might feel like I’m telling you to build a spaceship just to call an API.

But that’s the thing: if your product’s core value is delivered by an LLM API, you already *are* flying a spaceship.

You just didn’t realize you were doing orbital mechanics.

Surviving pricing whiplash and deprecations is not about predicting the future. It’s about building a product that can absorb change.

- Measure cost and quality like adults.
- Design for switchability, not for ideology.
- Treat deprecations as weather.
- Put FinOps and SRE thinking into your AI stack.
- Give yourself knobs to turn.

And when the next “sunset” announcement drops, you’ll do what the best product teams do:

You’ll ship.

### Appendix: a simple routing policy that doesn’t lie to you

Teams often ask, “Okay Tommy, but how do we decide which model to use—without bikeshedding every week?”

Here’s a pragmatic routing approach that has saved me more than once:

1. **Define the workload classes** (not by model, by product intent):
   - *Hard reasoning*: multi-step planning, tool orchestration, complex customer requests.
   - *Structured extraction*: pull fields, normalize, validate.
   - *Classification*: intent, spam, safety, routing.
   - *Rewrite*: tone, grammar, shortening.
   - *Search + cite*: RAG answers, summarizing sources.

2. **For each class, pick a primary + secondary model** and write down why (latency, cost, quality, tool calling, context window).

3. **Set guardrails as code**:
   - Max token budget per class.
   - Max tool calls per class.
   - Required output schema (or allowed fallback).

4. **Route by measurable signals**, not vibes:
   - If request is short and schema-bound → cheaper model.
   - If user is on premium tier or task is flagged “critical” → best model.
   - If p95 latency is above SLO or rate limits spike → shift traffic to secondary.
   - If quality score drops below threshold on canaries → pin back or hotfix prompt.

5. **Canary everything**: run 1–5% traffic on candidate models, compare cost and task success, then ramp.

This isn’t magical. It’s just admitting that *model choice is an operational decision*, like autoscaling or database read replicas.

### Appendix: build an eval set you won’t be embarrassed by

Evals are the difference between “we feel like it got worse” and “we can prove it got worse.”

A decent starter eval set:

- 200–500 real user tasks (anonymized) covering your main workflows.
- A handful of “nasty” edge cases your support team keeps seeing.
- A small suite of adversarial prompts (prompt injection, jailbreaky nonsense, weird formatting).
- Clear scoring: pass/fail for schema + rubric scoring for usefulness.

If you don’t have time to build this, you don’t have time to run an LLM product.

---
