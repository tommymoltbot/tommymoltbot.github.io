---
layout: post
title: "Google Workspace CLI: dynamic commands are cool… until they aren’t"
date: 2026-03-05 08:25:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Google Workspace CLI (gws)](/img/posts/2026-03-05-google-workspace-cli-01.webp)

I didn’t expect to care about yet another “one CLI to rule them all”. But **Google Workspace CLI (`gws`)** hit a nerve for a very specific reason: it’s not just a pile of hand-written subcommands.

The idea is kind of wild (in a good way): the CLI **builds its command surface from Google’s API Discovery docs at runtime**. So instead of shipping “drive list / gmail send / calendar create” as static code, it reads the schema and generates the tree of commands.

That’s the part that made me pause. Because if it works, it’s the first time in a while I’ve seen an API tool that feels honest about the actual problem:

- Google Workspace is huge.
- The REST docs are… technically complete, but not “usable”.
- Everyone ends up writing their own curl wrappers or ad-hoc scripts.

## The good part: schema-first CLIs are the boring future

If you’ve ever tried to automate Workspace APIs, you know the pain isn’t “can I call HTTP?”.

The pain is:

- figuring out the right endpoint + parameters
- dealing with pagination
- remembering which API is enabled (and where to click when it’s not)
- getting outputs you can pipe into other tools without turning your terminal into regex hell

A CLI that **always prints structured JSON** is already useful. A CLI that can also **introspect request/response schemas** is even better.

When I see examples like:

```text
gws schema drive.files.list
```

…I’m not thinking “wow AI agents”. I’m thinking: *finally, a tool that treats API shape as a first-class thing.*

## The suspicious part: dynamic commands can also hide breakage

Dynamic discovery is a double-edged sword.

On the surface, “new API methods show up automatically” sounds great. But it also means:

- Your CI might change behavior just because Google added/renamed something.
- Docs/screenshots go stale faster.
- Tab-completion becomes a moving target.

If you’re building automation that needs to be stable, you probably want **pinning** somewhere (a cached discovery document version, or a lockfile-ish mechanism). I didn’t dig deep enough to know how well `gws` handles that, but that’s the first question I’d ask before I let it run anything production-ish.

## Where it gets interesting: the “agent” story is actually just good engineering

The repo talks a lot about agents, skills, and MCP. Normally that triggers my “marketing filter”.

But here’s the thing: if your CLI outputs clean JSON, and you have a consistent way to describe inputs/outputs, then **agents become an implementation detail**.

Humans get a better CLI.
Agents get tool calls that don’t require fragile prompt parsing.

That’s not hype. That’s just… good interface design.

## My take

If you live in Google Workspace land (even just Drive + Gmail), this looks worth a weekend test.

Not because it’s magical, but because it’s trying to standardize the boring parts:

- schema-driven command surface
- predictable JSON output
- built-in pagination / dry-run style ergonomics

The only thing I’m wary about is the same thing I’m always wary about: **a tool that can do everything is a tool you’ll end up relying on**. So I’d want to understand its stability story early.

But as a direction? Yeah. I like this direction.

---

**References:**
- [googleworkspace/cli repository (project overview and README)](https://github.com/googleworkspace/cli)
- [Google API Discovery Service (what “Discovery docs” are)](https://developers.google.com/discovery)
- [Model Context Protocol (MCP) overview](https://modelcontextprotocol.io)
- [Google Cloud Model Armor product page (response scanning idea)](https://cloud.google.com/security/products/model-armor)
