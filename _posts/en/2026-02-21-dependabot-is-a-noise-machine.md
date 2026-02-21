---
layout: post
title: "Dependabot is a noise machine (and it trains you to do the wrong kind of work)"
date: 2026-02-21 03:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "If your security tooling can’t tell ‘reachable’ from ‘installed somewhere in the graph’, it’s going to manufacture work. A better pattern is reachability-aware scanning plus ‘test against latest’ in CI — signal without PR spam."
lang: en
---

![A dark dashboard-style graphic with PR cards and the headline "Dependabot is a noise machine".](/img/posts/2026-02-21-dependabot-noise-machine.webp)

I have a pretty simple test for tooling: **does it reduce cognitive load, or does it manufacture it?**

Dependabot (especially “security” PRs) often fails that test.

Not because dependency updates are bad. They’re necessary.

But because the *shape* of the workflow it creates is backwards: it floods you with low-signal tasks, trains you to rubber-stamp them, and then quietly makes real vulnerabilities harder to spot — because everything looks like a fire.

A recent write-up by Filippo Valsorda framed it in a way I wish more teams internalized: **alert fatigue is a security bug**.

## Five angles I use to think about this

1) **The “work-like activity” angle**

A constant stream of small PRs feels productive. You get green checks. You merge.

But if the majority of those PRs are irrelevant to your actual risk, you’re just converting machine time into human attention burn.

2) **The reachability angle (the only one that matters for most teams)**

Most ecosystems already know *which symbol* is vulnerable, not just “this module has a CVE attached.”

So the key question isn’t “do I have the package anywhere?”

It’s:

```text
is_vulnerable_symbol_reachable(my_code, dependency_graph) -> bool
```

If your scanner can’t answer that, it’s not a scanner — it’s a notifier.

3) **The “PR spam as policy” angle**

Automated PRs are a policy decision: you’re choosing to interrupt humans.

If your automation can’t filter hard enough to keep interrupts rare, **it’s not automation**. It’s a subscription to toil.

4) **The “security updates are not remediation” angle**

Bumping versions is sometimes a fix.

Sometimes it’s the *start* of the incident response: rotate keys, invalidate sessions, assess exposure, communicate.

If your tooling trains your org that “merge the PR = done,” you’re building a bad muscle.

5) **The “test against latest” angle**

One thing I actually like: instead of constantly updating deps, you can run CI regularly against *latest* to detect breakage early.

That keeps you close to upstream without turning dependency churn into daily human work.

It also limits the blast radius of supply-chain weirdness: it hits CI before it hits prod.

## What I would do instead (boring on purpose)

- Turn off Dependabot PRs (or at least security PR auto-opening).
- Run a reachability-aware scanner on a schedule.
- Separately, run CI against “latest dependencies” on a schedule.

The point is to get back to a sane contract:

- **Security signal** should be rare and actionable.
- **Compatibility signal** should be early, but not interrupt-driven.

If your tooling can’t do that, it’s not helping you ship — it’s just giving you something to click.

---

**References:**
- [Filippo Valsorda — “Turn Dependabot Off” (case study, alert fatigue, suggested workflow)](https://words.filippo.io/dependabot/)
- [Go documentation — govulncheck tutorial (reachability-based vulnerability scanning)](https://go.dev/doc/tutorial/govulncheck)
- [Go Vulnerability Database documentation (metadata: module/package/symbol)](https://go.dev/doc/security/vuln/)
