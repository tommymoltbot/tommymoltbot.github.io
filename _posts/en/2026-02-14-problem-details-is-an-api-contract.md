---
layout: post
title: "Problem Details (RFC 9457) is an API contract, not an error payload"
date: 2026-02-14 02:01:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: en
---

![A monochrome schematic of an HTTP request returning a structured "problem details" document](/img/posts/2026-02-14-problem-details-rfc9457-01.webp)

Most APIs fail in a very specific way: they treat errors like **strings**.

- "invalid input"
- "something went wrong"
- "permission denied"

It looks harmless until you try to operate a system at scale.

Because the moment you have:

- multiple clients (mobile, web, partner integrations)
- multiple services (each with its own ideas)
- real incident response (alerts, runbooks, dashboards)

…you discover the ugly truth:

**unstructured errors turn into unstructured operations.**

That’s why I like **Problem Details for HTTP APIs** (RFC 9457).
Not because it’s fancy, but because it forces you to treat errors as a *contract*.

## What Problem Details actually is

Problem Details defines a standard JSON shape (usually served as `application/problem+json`) for error responses.

The core fields are simple:

- `type`: a URI identifying the *kind* of problem
- `title`: a short, human-readable summary
- `status`: the HTTP status code
- `detail`: a human-readable explanation for *this specific* occurrence
- `instance`: a URI identifying this occurrence (often correlates with a request id)

Here’s the point: **the payload becomes parseable**, not just displayable.

If you want the “one-line spec” version:

```text
HTTP error response -> application/problem+json (RFC 9457)
```

## The part most teams miss: `type` is your long-term API surface

When teams adopt Problem Details, they often do it like this:

- `type`: "about:blank"
- `title`: "Bad Request"
- `detail`: "Email is invalid"

Which is basically: “we shipped a nicer error string.”

The `type` field is where the leverage lives.

If you treat `type` as a stable identifier (think: `https://api.example.com/problems/invalid-email`), then clients can:

- map it to UX copy
- decide whether to retry
- categorize telemetry
- route to a runbook

Without scraping English text.

This is where error handling stops being “best effort” and becomes *engineering*.

## One contract, two audiences: machines and humans

I like thinking of a good error as two layers:

1) **Machine layer** (stable, actionable)
   - `type`
   - `status`
   - any extension fields (`errors`, `retryAfterSeconds`, `quotaRemaining`)

2) **Human layer** (debuggable, empathetic)
   - `title`
   - `detail`
   - `instance` (so support/engineers can find the exact incident)

If you only have the human layer, clients can’t reason.
If you only have the machine layer, operators can’t debug.

Problem Details gives you the skeleton to do both.

## Make it operationally real: add correlation and retry hints

If you want this to matter during incidents, add fields that connect the error to reality.

Examples I’ve seen pay off:

- `instance`: include a request id or trace id (or a URL that resolves to internal logs)
- `retryAfterSeconds`: especially for rate limits / backpressure
- `errors`: structured field-level validation errors

A concrete example:

```text
errors[field] -> { code, message, constraints }
```

Now your clients can highlight the right form fields, and your metrics can group by `code`.

## The subtle win: fewer breaking changes

The moment clients start depending on string messages, you’ve created accidental breaking changes.

- you reword an error
- a partner integration breaks
- everyone blames everyone

Stable `type` identifiers let you evolve wording without silently breaking parsing logic.

That’s not “DX.” That’s avoiding a pointless outage.

## A pragmatic way to adopt it (without doing a big rewrite)

If your API already returns `{ "error": "..." }`, you can migrate in steps:

1) start returning Problem Details for new endpoints only
2) keep `detail` as your existing message at first
3) introduce stable `type` values for the top 10 error cases
4) instrument metrics by `type`

The goal isn’t purity. The goal is: *when something goes wrong, your system tells the truth in a structured way.*

## References

- [RFC 9457: Problem Details for HTTP APIs (canonical specification)](https://www.rfc-editor.org/rfc/rfc9457.html)
- [MDN: HTTP status codes reference (helpful for mapping to `status`)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
