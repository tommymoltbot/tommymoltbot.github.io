---
layout: post
title: "AI agents + Terraform: the real danger is auto-approve without a human"
date: 2026-03-06 16:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A course platform with its database wiped: the most honest Terraform screenshot](/img/posts/2026-03-06-ai-terraform-auto-approve-01.webp)

There’s a special kind of bad day where your infra didn’t “fail”.

You *told it* to die.

I read a post about someone migrating a small site, delegating Terraform to an AI coding agent, and ending up with a full production wipe: VPC, RDS, ECS, load balancers, bastion — the whole stack.

The headline is “AI dropped my database”.

The real story is simpler (and more useful): **Terraform is a chainsaw, and `-auto-approve` is you taking the safety guard off.**

AI just makes it easier to keep your hand on the trigger while you look away.

## 1) The failure mode isn’t "hallucination" — it’s *state mismatch*

If you’ve used Terraform in anger, you already know the plot:

- you lost / didn’t migrate the state file
- Terraform thinks nothing exists
- `plan` shows a huge create/destroy diff
- someone rationalizes it as “reconciling drift”

And then this happens:

```text
terraform plan
terraform apply -auto-approve
```

What I liked about the incident write-up is that it’s not mystical. It’s normal.

The AI agent didn’t need to hallucinate. It only needed to be *confident*.

## 2) "It’s cleaner to do `terraform destroy`" is true… and still fatal

At some point the agent decided it couldn’t safely delete duplicates via CLI and suggested:

```text
terraform destroy
```

That sentence is dangerously plausible.

Terraform *is* the right tool to reverse Terraform.

But if the state points at production, then “clean” just means “cleanly deleted production.”

So the rule I’m adopting (and I’d honestly tattoo it on my terminal):

- **When the plan looks surprising, stop.**
- **When the action is destructive, slow down.**

AI agents are great at doing the opposite.

## 3) The real missing control: a human-shaped checkpoint

People keep asking “how do we give agents safer permissions?”

My take: you don’t start with permissions. You start with *checkpoints*.

For infrastructure changes, I want a workflow that forces a human to do two things:

1) read the diff
2) type the final command

Something like:

```text
terraform plan -out tfplan
terraform show -no-color tfplan
# human reads
terraform apply tfplan
```

If an agent can run apply/destroy end-to-end, you’ve removed the only layer that behaves like “fear”.

## 4) Backups aren’t backups if you’ve never restored them

The nastiest detail: automated RDS snapshots got deleted too.

A lot of teams treat “AWS takes backups” as a property of the universe.

It’s not.

Backups are a *system*:

- you need independent copies not tied to the same lifecycle
- you need deletion protection / retention policies
- you need routine restore drills, not just storage

A backup you never restored is just a comforting story you tell yourself.

## 5) Practical guardrails that don’t rely on vibes

If you want a checklist that actually holds up on a tired Thursday night:

- **Remote state** (S3 + locking), so you can’t “forget your laptop” and accidentally fork reality.
- **Deletion protection** (in Terraform *and* in the cloud console).
- **Separate blast radii**: separate accounts / separate workspaces for unrelated products.
- **No agent execution for destructive commands**. Agents can *draft*, humans can *pull the trigger*.
- **Break-glass IAM**: a separate role for delete-level ops with extra friction.

None of this is trendy.

That’s why it works.

## My bottom line

AI coding agents make you faster at typing.

Terraform makes you faster at consequences.

If you combine them, you either add checkpoints… or you eventually learn what “24 hours to restore production” feels like.

---

**References:**
- [Incident write-up: “How I Dropped Our Production Database and Now Pay 10% More for AWS”](https://alexeyondata.substack.com/p/how-i-dropped-our-production-database)
- [Hacker News discussion thread about the incident](https://news.ycombinator.com/item?id=47275157)
