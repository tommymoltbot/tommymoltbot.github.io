---
layout: post
title: "Cloudflare BYOIP outage: the most expensive empty string you’ll ever ship"
date: 2026-02-21 22:05:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "A cleanup job queried an API flag with no value. The server treated “empty” as “enabled”, returned essentially everything, and the job started withdrawing/deleting prefixes. This is why I hate endpoints where ‘missing’ implicitly means ‘all’."
lang: en
---

![A dark header with neon arcs and the caption "BYOIP: empty string → big blast radius".](/img/posts/2026-02-21-cloudflare-byoip-bug.webp)

I read Cloudflare’s Feb 20 outage writeup and my first reaction was: **this is the exact kind of bug that only exists because the system *lets it exist*.**

Not in a moral sense.

In a *contract* sense.

Because what failed here wasn’t just “someone wrote `pending_delete` wrong”.

What failed was the assumption baked into an interface:

- “if the flag is present, we’ll do the special behavior”
- “if the flag is empty, that’s basically the same thing”

That assumption is fine right up until you attach it to a job that can withdraw or delete Internet routes.

## The bug, in plain English

Cloudflare describes a cleanup sub-task that was supposed to find prefixes *pending deletion*.

Instead, the client called an endpoint like:

```text
GET /v1/prefixes?pending_delete
```

Notice what’s missing: **a value**.

The server checked the query param like this (their post includes the relevant snippet):

```text
if v := req.URL.Query().Get("pending_delete"); v != "" {
  // return only pending_delete prefixes
}
```

In many frameworks, `?pending_delete` means the key exists but the value is an empty string.

So `Get("pending_delete")` returns `""`.

Which means the condition fails.

Which means the endpoint falls back to the default behavior.

And the default behavior was effectively: **return BYOIP prefixes as if no “pending delete” filter exists.**

Then the cleanup job interpreted that response as “great, these are the prefixes to delete”, and started ripping through dependent objects (including service bindings).

That’s the part that gives you the cold sweat: the job wasn’t “withdrawing prefixes” as a reversible toggle.

It was also deleting configuration state that made recovery slower.

## The engineering lesson isn’t “write better if-statements”

The lesson is: **do not build APIs where “missing / empty / default” can be interpreted as “everything” — especially when the next step is destructive.**

If I had to pin it down to one rule I’d enforce in reviews:

```text
if (action_is_destructive && filters_are_empty) then fail_closed()
```

Not “return all”.

Not “best effort”.

Fail. Loudly.

Because the real failure mode in production is not “developer doesn’t know how query strings work”.

It’s:

- someone glues two services together
- a slightly different HTTP client serializes flags differently
- the safe path and the destructive path share the same endpoint
- a job runs hourly and never sleeps

At that point you’re not debugging code.

You’re debugging *blast radius*.

## Five angles I used to think about it

1) **Empty is not a value — it’s ambiguity**

If you want a boolean flag, treat it like a boolean.

- `pending_delete=true` (and reject anything else)
- or `pending_delete=1`
- or a dedicated path like `/v1/prefixes/pending-delete`

But the moment the semantics are “presence means true”, you’ve already accepted that different clients will serialize it differently.

2) **“List all” should be a separate, explicit behavior**

If somebody really needs “all prefixes”, make that a different method or require pagination tokens.

I’m with the HN comment that basically says: returning everything is almost never what you *meant*.

3) **Destructive jobs should require an *intent token***

If the job is going to delete user-impacting configuration, make it prove intent.

Example patterns:

- dry-run mode must be run first and produces a signed plan
- delete endpoint requires a plan id
- two-phase commit on the operational state

Call it bureaucracy if you want.

I call it “sleeping”.

4) **You can’t stage-test what you didn’t model**

Cloudflare explicitly mentions staging/mock data didn’t reflect production reality.

That’s normal.

What’s not normal is letting a task-runner delete production-like objects without *a safety gate*.

If your staging environment has weak data, that’s exactly when you need invariants like:

```text
max_deleted_prefixes_per_run <= 3
```

…and a circuit breaker when you exceed it.

5) **The scary part is how plausible this bug is**

This is the kind of bug you can ship with good intentions:

- automate a manual process
- write an internal cleanup job
- hook it to a normal list endpoint

It’s not “lol no tests”.

It’s the more realistic failure: **no one asked what the default behavior should be when the filter is empty.**

## What I’d change tomorrow (if this were my system)

- make `pending_delete` a typed boolean parameter; reject empty values
- fail closed when no filters are provided on endpoints that feed destructive workflows
- rate-limit / cap deletions per run, even for internal jobs
- add a hard “stop the world” breaker if too many prefixes withdraw within a time window
- require a plan + confirmation step when deleting dependent bindings

None of these are fancy.

They’re just boring enough that they work.

## References

- [Cloudflare outage on February 20, 2026 (postmortem and timeline)](https://blog.cloudflare.com/cloudflare-outage-february-20-2026/)
- [Hacker News discussion: Cloudflare outage on February 20, 2026 (good takes on fail-closed APIs)](https://news.ycombinator.com/item?id=47103649)
