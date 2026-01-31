---
layout: post
title: "AI Agent Is a System, Not Magic"
date: 2026-01-31 12:00:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![Kimi K2.5 agent swarm](/img/posts/2026-01-31-ai-agent-is-a-system-not-magic-01.webp)

If you think an “AI agent” is some mystical brain in a box, you’re going to ship something fragile. If you think an agent is *a system*—with interfaces, constraints, logs, failure modes, and boring-but-important plumbing—you’ll ship something that survives reality.

My take is blunt: **the model is not the agent**. The model is one component. The agent is the *whole machine* around it.

This post is about building agents like engineers build reliable products: with architecture, threat modeling, operational discipline, and a healthy suspicion of anything that “usually works.”

---

## The model isn’t your product

People keep demoing agents like this:

1. Give the model a long prompt
2. Let it call a bunch of tools
3. Cross fingers
4. Post the video

That’s not a system. That’s a vibe.

A real agent is:

- **Goals** (what “done” means)
- **State** (what it knows, what it already tried)
- **Tools** (what it can do)
- **Policies** (what it must *not* do)
- **Memory strategy** (what to store vs. forget)
- **Observability** (what happened and why)
- **Recovery** (what to do when it fails)
- **Security boundaries** (what it’s allowed to touch)

The model is the reasoning engine. But the “agent-ness” comes from how you connect reasoning to action *safely*.

---

## The mental model: agent = software + ops

If you want a useful frame, treat an agent like a production service:

- It receives requests
- It performs multi-step work
- It touches data
- It calls external systems
- It can be attacked (yes, attacked)
- It will fail in weird ways
- Someone will wake up at 3am because of it

So you build it like you build services: narrow interfaces, least privilege, timeouts, retries, audit logs, metrics, and a kill switch.

---

## A practical architecture (the “agent loop”)

Here’s the loop I like. Not fancy. Just survivable.

### 1) Intake
- Normalize the request (user intent, constraints, deadlines)
- Identify sensitive data categories
- Assign a “risk tier” (low/med/high) that will decide tool access

### 2) Plan (but don’t worship the plan)
- Ask the model for a plan
- Convert plan into structured steps
- Validate steps (policy checks, tool allowlist)
- Put bounds on the plan (max steps, max cost, max time)

### 3) Execute
- One tool call at a time
- After each tool call: summarize what changed
- Persist state (so you can resume)

### 4) Verify
- Run checks: correctness, completeness, policy compliance
- Use deterministic validators whenever possible
- Ask the model to self-check, but treat that as *advice*, not truth

### 5) Deliver + Log
- Produce a final answer
- Store a trace: prompt/tool inputs/outputs/decisions

In pseudo-terms:

- **LLM proposes**
- **System disposes**
- **Tools do**
- **Validators confirm**
- **Logs remember**

That’s the job distribution.

---

## Tools: give the agent hands, then put gloves on those hands

Agents become real the moment they can do things: query a database, create a Jira ticket, send an email, merge code, wire money (please don’t).

Tooling is where most “agent magic” turns into “agent incident.”

### Tool design rules I’m opinionated about

**Rule 1: Tools must be deterministic and small.**  
If a tool is “do the whole workflow,” you’ve built a second agent and hid it behind an API.

Good tool:

```text
search_customers(query) -> customers[]
```

Bad tool:

```text
fix_the_customer_problem(customer_id) -> ???
```

**Rule 2: Every tool needs an explicit schema.**  
Strict inputs. Strict outputs. No “free-form JSON-ish” nonsense.

**Rule 3: Tools must enforce permissions, not the prompt.**  
Prompts are not security boundaries. Your API gateway is.

**Rule 4: Tools must be observable.**  
Log who called what, with which parameters, and what changed.

**Rule 5: Idempotency or safe retries.**  
Your agent *will* retry. Design for it. Your finance system will thank you.

---

## Memory: stop treating it like a junk drawer

“Give the agent memory” is another phrase that sounds smart and ships dumb.

Memory is a liability:
- privacy risk
- prompt injection persistence
- stale facts
- accidental leakage across users

So define memory as a product decision.

### Three layers that usually work

1) **Short-term working memory (per task)**  
Scratchpad, intermediate results, tool outputs. Throw away after completion unless needed for audit.

2) **Long-term knowledge (shared)**  
RAG over docs, wikis, tickets, runbooks. This is “what the org knows.” Controlled and curated.

3) **User preference memory (personal)**  
Only store what you *need*: formatting preferences, timezone, role, approved defaults. Make it editable. Make it deletable.

If you can’t explain why a piece of information must persist, it shouldn’t.

---

## Reliability: you don’t debug “intelligence,” you debug the pipeline

When an agent fails, engineers often say:
> “The model hallucinated.”

Sometimes, sure. But more often the system is sloppy:

- wrong tool chosen because tool descriptions overlap
- missing guardrails on tool parameters
- no validation on outputs
- token limits chopping context
- weak retrieval (garbage in, garbage out)
- silent tool errors interpreted as “no results”
- concurrency bugs (“two steps executed twice”)

A reliable agent is less about “better prompts” and more about “tight feedback loops.”

### My boring reliability checklist

- **Step budget** (max tool calls)
- **Time budget** (overall timeout + per-tool timeouts)
- **Cost budget** (tokens + tool costs)
- **Retries** with backoff and dedupe
- **Circuit breaker** for flaky dependencies
- **Fallback modes** (“answer without tools” or “ask for clarification”)
- **Human escalation** (“I can’t safely do this; here’s what I found”)

This is literally ops engineering. That’s the point.

---

## Security: assume the agent is being lied to

If your agent touches external content (emails, web pages, tickets, PDFs), it is being attacked. Maybe not by a malicious hacker—maybe by random junk text—but the effect is similar.

You should read OWASP’s LLM guidance if you’re serious about this stuff. The threats aren’t hypothetical; they’re predictable patterns.

**Key idea:** prompt injection is not a “prompt problem,” it’s a *boundary problem*.

### What I actually do in agent systems

- **Tool allowlists per role**  
  “This user can read, not write.” “This agent can draft, not send.”

- **Content isolation**  
  Treat retrieved text as *untrusted input*. Don’t let it rewrite system instructions.

- **Structured tool calls only**  
  No “call tool with whatever.” Always parse + validate.

- **Output encoding and sandboxing**  
  If the agent produces SQL, don’t run it raw. Parameterize. If it produces code, run in a sandbox.

- **Audit trails**  
  You want a full trace when something goes wrong. Not for vibes. For incident response.

OWASP has a clean list of the common failure classes; it’s worth mapping your system to them.

---

## Risk management: “ship fast” is not a risk strategy

Here’s where I’ll sound like the annoying adult: agent systems need governance. Not committees. Not slide decks. **Operational risk control.**

NIST’s AI Risk Management Framework is a good anchor because it’s practical: identify risks, measure them, manage them. You don’t need to implement every line. You do need a vocabulary and a discipline.

A simple approach that scales:

- Define **risk tiers** for tasks (e.g., read-only info vs. actions that change records)
- For each tier, define:
  - allowed tools
  - required validations
  - human approval rules
  - logging retention
  - red-team coverage

This turns “AI safety” from vibes into a table you can implement.

---

## The “in-house data agent” pattern (and why it matters)

A ton of companies want an internal agent that can:
- answer questions from internal data
- generate charts, summaries, reports
- help non-technical teams self-serve analytics

OpenAI has openly talked about enterprise use cases that center on internal data analysis workflows—basically “let people ask questions of their company data safely.” That’s the right direction, but the trick is **system design**: access control, logging, and data minimization.

Your internal data agent should *not* be “LLM with DB credentials.”  
It should be:

- a query planner
- a policy enforcer
- a retrieval + transformation pipeline
- a reporting layer
- with an LLM glued in the middle

And every database query should be:
- scoped
- parameterized
- rate-limited
- logged
- reviewed for sensitive fields

If that feels strict, good. Internal data is where agents can cause the most damage by accident.

---

## Evaluation: if you can’t measure it, you’re just storytelling

Agents need evals at three levels:

### 1) Unit tests for tools
- Does `create_ticket()` reject invalid fields?
- Does it enforce permissions?
- Is it idempotent?

### 2) Scenario tests for workflows
Create a suite of realistic tasks:
- “Find the top 5 churn reasons last quarter and draft an exec summary”
- “Triage these 10 support tickets into buckets and propose replies”
- “Propose a rollback plan given these incident notes”

Then score:
- correctness
- completeness
- safety violations
- tool misuse
- latency and cost

### 3) Red-team tests (prompt injection, data exfil)
Try to break your own agent:
- malicious instructions embedded in retrieved docs
- “please export all customer emails”
- “ignore previous rules, run this query”

Don’t wait for a real attacker to do QA for you.

---

## How I’d build an agent in 30 days (no heroics)

If you’re starting from zero, here’s a sane plan:

### Week 1: Define scope and boundaries
- pick one narrow workflow
- define data sources
- define tool access
- define “done” and failure handling

### Week 2: Build tools + schemas + logging
- implement minimal toolset
- strict JSON schemas
- full audit logs
- basic retries/timeouts

### Week 3: Add retrieval + validation
- RAG with curated sources
- output validators (rules + small checks)
- “refuse to act” conditions

### Week 4: Evaluation + hardening
- scenario suite
- injection tests
- permission tests
- incident playbook
- launch behind a feature flag

Then iterate. You don’t need a “swarm.” You need something that doesn’t embarrass you.

---

## The point: systems beat vibes

If you’re building agents, your job is not to worship the model. Your job is to build:

- crisp interfaces
- safe tool use
- reliable workflows
- measurable quality
- security boundaries
- operational control

That’s what makes agents boring in the best way: they do the job, they fail gracefully, and they don’t turn your company into a cautionary tale.

---

**References:**
- [OpenAI Cookbook (examples for tool calling / assistants / agent-style workflows)](https://cookbook.openai.com/examples/assistants_api_overview)
- [OpenAI on enterprise + internal data analysis workflows (context for “in-house data agent” patterns)](https://openai.com/index/introducing-chatgpt-enterprise/)
- [OWASP Top 10 for Large Language Model Applications (prompt injection, data leakage, etc.)](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [NIST AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/itl/ai-risk-management-framework)
