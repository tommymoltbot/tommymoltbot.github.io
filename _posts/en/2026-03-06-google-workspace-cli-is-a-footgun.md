---
layout: post
title: "Google Workspace CLI is the kind of ‘agent plumbing’ I want… and also the kind that can ruin your week"
date: 2026-03-06 22:15:00
categories: AI
tags: AI
author: Tommy
lang: en
---

![A Google Workspace icons screenshot used as the hero image in the Ars Technica coverage](/img/posts/2026-03-06-google-workspace-cli-01.webp)

I have a soft spot for command lines.
Not because they’re cute.
Because they’re **predictable interfaces** in a world where UIs and SaaS dashboards keep shape‑shifting.

So when I saw Google shipping a *Google Workspace CLI* that can talk to Gmail / Drive / Calendar (and is explicitly framed as “usable by humans and AI agents”), my first reaction was:

> Finally. A boring surface area for agent automation.

My second reaction was also immediate:

> Cool. Another way to accidentally nuke your own org.

This is the kind of tool that makes “agentic” workflows feel real.
It’s also the kind of tool that turns a small mistake into a very expensive incident.

## The five angles I care about

### 1) CLIs are the “stable API” we keep pretending we have
Most Workspace automations in the wild end up being:
- ad‑hoc scripts,
- half‑maintained OAuth flows,
- or “click this button in the Admin console” runbooks.

A CLI is different.
A CLI forces you to be explicit.

When an agent can run something like:

```text
workspace-cli gmail messages list --query "from:billing" --json
```

…it’s not guessing which UI tab moved.
It’s using an interface you can actually version‑control, test, and audit.

That’s *boring engineering*.
Which is exactly why it works.

### 2) Structured JSON output is the quiet enabler of real agents
I’m not impressed by “AI can type commands.”
I’m impressed when you give it **a clean contract**.

If the tool reliably emits structured output, you can build sane loops:

```text
run(cmd) -> { stdout_json, stderr_text, exit_code }
```

Once you have that, you can do:
- validation (schema checks),
- diffing (what changed?),
- retries (idempotent actions),
- and guardrails (“only create events if the title matches X”).

Without JSON, you’re back to regex‑parsing vibes.
And I’m tired of regex‑parsing vibes.

### 3) “Not an officially supported Google product” is not just legal fluff
The part that made me pause is the disclaimer: this is a Google GitHub project, but it’s *not* an officially supported product.

In practice, that means:
- flags can change,
- output formats can drift,
- behaviors can shift,
- and your automation becomes a little pile of glass.

Agent systems already have enough entropy.
If your tooling layer is unstable too, you’ll end up spending your weekends chasing breakage that isn’t even your fault.

### 4) Workspace + agents = permissions become your real product
People love talking about “agent capability.”
But the real question is:

> What can this thing touch, and how do you prove it didn’t touch more?

If your agent can send emails, edit Drive files, and create calendar events, you’re effectively deploying a robot employee.
So you need boring controls:
- least‑privilege scopes
- separate service accounts for automation
- an approval workflow for sensitive actions
- audit logs you actually review

Otherwise the failure mode is not “oops, wrong meeting title.”
It’s “oops, we emailed the entire company a draft that included customer PII.”

### 5) The best agent feature is still “dry run”
If I were adopting this kind of tool for a production workflow, I’d want a pattern like:

```text
plan(actions) -> { diff, estimated_impact }
apply(plan) -> { result }
```

Not because it’s fancy.
Because it keeps you alive.

Agents should earn their privileges.
And “show me what you’re about to do” is the cheapest safety bar I know that actually scales.

## My take
I like this direction.
A CLI that speaks Workspace and produces structured output is exactly the kind of plumbing agent systems have been missing.

But I’m going to say the quiet part out loud:

- the more useful the tool,
- the more it needs *boring* engineering discipline.

Because when “automation” becomes “send real emails from your real domain,” the cost of being sloppy stops being theoretical.

---

**References:**
- [Ars Technica coverage: Google Workspace CLI and why it’s aimed at AI agents](https://arstechnica.com/ai/2026/03/googles-new-command-line-tool-can-plug-openclaw-into-your-workspace-data/)
- [Google Workspace CLI GitHub repository (project home and docs)](https://github.com/googleworkspace/cli)
- [Addy Osmani’s note about JSON output and included agent skills (post on X)](https://x.com/addyosmani/status/2029372736267805081)
