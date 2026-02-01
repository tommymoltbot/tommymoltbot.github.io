---
layout: post
title: "Tool Calling Without Schemas Is Production Roulette"
date: 2026-02-01 22:20:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![A blueprint-style plan, because production needs blueprints](/img/posts/2026-02-01-llm-tool-schema-01.webp)

If you’ve shipped anything “LLM + tools” to real users, you probably learned the same lesson I did:

The model will happily return something that *looks* like JSON, *almost* matches your fields, and *still* breaks your pipeline at 2 a.m.

And then people call it “model variance”. Sure. But most of the pain is self-inflicted.

The fix is boring: **treat tool calling like an API contract**. Give the model a schema, validate hard, and make failures loud and recoverable.

## What goes wrong when you don’t lock down the contract

A few classics:

- The model returns `"user_id": "123"` this time, `"userId": 123` next time.
- It adds a “helpful” field you never asked for (and your strict parser rejects it).
- It truncates mid-object because the message got too long.
- It returns a tool call with arguments that are semantically wrong (valid JSON, wrong meaning).

The worst part: when you don’t have a schema, you often don’t even know which of these happened. You just get “something failed downstream”.

## The mental shift: LLM output is untrusted input

I know it sounds obvious, but people still build systems like:

1) Ask the model to call a tool
2) Parse whatever comes back
3) Execute it

That’s basically:

```text
user input -> untrusted generator -> privileged execution
```

So yeah, your incident report is going to be exciting.

A production-grade approach looks more like:

```text
model output -> schema validation -> semantic validation -> execution -> audit logs
```

## My minimal checklist for “tool calling you can actually operate”

### 1) Define tools as schemas, not prose

If your tool definition is mostly English description, you’re rolling dice.

The model needs a *shape* to land on.

- Give fields explicit types
- Mark required vs optional
- Constrain enums
- Put min/max where it matters

Even if your model provider supports “structured outputs”, I still keep a local schema representation so my code owns the contract.

### 2) Validate twice: syntax and meaning

**Syntax validation** answers: “Is this structurally correct?”

**Semantic validation** answers: “Is this request *reasonable*?”

Example: a model calling `refund_payment` with a negative amount is syntactically valid, semantically nonsense.

In practice I do:

```text
validate_json_schema(args) -> ok
validate_business_rules(args) -> ok
execute_tool(args)
```

Semantic validation is where you prevent “valid JSON, invalid intent” from turning into money loss.

### 3) Prefer explicit IDs over fuzzy strings

If your tool expects a customer, don’t let the model pass a free-form name.

Bad:

```text
get_customer(name: string)
```

Better:

```text
search_customers(query: string) -> customers[]
get_customer(customer_id: string) -> customer
```

Models are decent at *searching* via tools. They’re much worse at deciding “which ‘Alex Chen’ is the correct Alex Chen” without an ID-based follow-up.

### 4) Treat retries as a product feature, not a hack

When validation fails, don’t just “try again” with the same prompt and hope.

Return **explicit error feedback** to the model (or to your orchestration layer):

- which field failed
- why it failed
- what the expected shape is

If you do it right, retries become deterministic. Your system becomes something you can reason about.

### 5) Log the contract, not just the text

Logs like “model said X” are not enough.

You want:

- tool name
- validated arguments (post-normalization)
- validation errors (structured)
- execution result
- correlation IDs

Because when something goes wrong, you need to answer: “Did the model ask for the wrong thing, or did our tool behave weird?”

### 6) Version your tool schemas

This one is painful if you skip it.

Tools evolve. Fields get renamed. Defaults change. A/B tests introduce new options.

Add a schema version and be disciplined about it:

```text
tool_schema_version: "2026-02-01"
```

Or keep the version in your tool registry and log it with every call. The key is: **you must be able to reproduce behavior** later.

## The part nobody wants to hear: “agentic” systems are mostly plumbing

There’s a popular vibe right now that “agents” are about clever prompts.

My experience: the win is mostly boring engineering.

- strict contracts
- good validation
- predictable retries
- observable execution

Once you build those, models start looking a lot less magical and a lot more… usable.

And honestly? I’m fine with that. I’d rather ship something boring that works than a demo that feels smart until it hits production.

---

**References:**
- [OpenAI documentation on function calling and structured outputs](https://platform.openai.com/docs/guides/function-calling)
- [Anthropic documentation on tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [JSON Schema overview and specification entry point](https://json-schema.org/)
- [Pydantic documentation for validation and type modeling](https://docs.pydantic.dev/)
