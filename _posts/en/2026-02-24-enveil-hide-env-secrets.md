---
layout: post
title: ".env is the easiest secret leak in the AI-coding era (and enveil’s take is refreshingly pragmatic)"
date: 2026-02-24 06:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A GitHub-style banner about hiding .env secrets](/img/posts/2026-02-24-enveil-hide-env-secrets-01.webp)

If you’re using tools like Claude Code / Cursor / Copilot, you already accepted the deal: *the model will read a bunch of your repository*.

The part that still feels weird to me is how many projects keep **plaintext secrets** sitting right next to the code in a `.env` file.

Not because people are dumb — it’s because `.env` is frictionless.

But once an AI assistant is part of your workflow, plaintext `.env` becomes the new “I swear this S3 bucket is private” moment.

I stumbled on **enveil**, a small Rust tool that tries to fix this with a simple idea: *your `.env` contains only references; the real values live in an encrypted local store and get injected at runtime.*

Here’s what I think is actually interesting about the approach.

## 1) The threat model changed: “local file” is now “shareable context”

Historically, `.env` was “local.”

Now it’s “local, but also:
- read by a code assistant
- copied into bug reports
- pasted into tickets
- accidentally committed during a late-night hotfix”

And yes, even if your tool claims it ignores `.env` by default, you’ll eventually add a new tool, a plugin, or a teammate with different settings.

So I like that enveil treats plaintext-on-disk as the *root* problem.

## 2) It keeps the ergonomics of `.env`, without trusting `.env`

The most practical part: you don’t need to rewrite your app.

Your `.env` becomes a template:

```text
DATABASE_URL=ev://database_url
STRIPE_KEY=ev://stripe_key
PORT=3000
```

And you run your program like:

```text
enveil run -- npm start
```

Everything after `--` is just your normal command.

That’s the right mental model: keep the app dumb, move the secret handling into a launcher.

## 3) “Deliberately missing commands” is a security feature

This is where the author’s paranoia is… healthy.

enveil intentionally avoids commands that would dump secrets into stdout (“get/export”), because that’s literally how you leak stuff to:
- terminals with scrollback
- shell history
- logs
- the AI assistant that’s watching your repo and (sometimes) your output

It’s a small design choice, but it shows the tool is built around the actual failure modes.

## 4) You still need to be honest about the trade-offs

Two trade-offs you’ll feel immediately:

- **Debuggability**: when something fails to connect, you’ll *want* to print env values. That desire doesn’t go away just because you’re being responsible.
- **Workflow friction**: prompting for a master password (or unlocking a store) is friction. Some teams will hate it.

Personally, I’ll take a little friction over “oops I fed Stripe keys to an LLM context window.”

## 5) My baseline rule: don’t give your AI assistant a chance to read secrets “by accident”

Whether you use enveil, 1Password CLI injection, Doppler, SOPS, AWS/GCP secret managers — I don’t care.

I care about one invariant:

- **secrets should not exist as plaintext in a directory an AI tool can read**

If your workflow currently relies on “don’t worry, the assistant won’t look at that file,” you’re betting your security on UI defaults and human discipline.

That bet doesn’t age well.

---

**References:**
- [enveil on GitHub (project README and threat model)](https://github.com/GreatScott/enveil)
- [Filip Hric: Don’t let AI read your .env files (1Password-based injection approach)](https://filiphric.com/dont-let-ai-read-your-env-files)
- [Hacker News thread discussing enveil and AI-assisted secret leakage](https://news.ycombinator.com/item?id=47133055)
