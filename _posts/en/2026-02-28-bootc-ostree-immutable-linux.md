---
layout: post
title: "bootc + OSTree made me rethink Linux deployment (it’s less ‘install’ and more ‘ship’)"
date: 2026-02-28 06:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![bootc + OSTree cover](/img/posts/2026-02-28-bootc-ostree-01.webp)

I’ve been chasing the same boring dream for years: **“my machines should be reproducible.”**
Not just servers.
My dev laptop too.
Because the day your laptop becomes a fragile snowflake is the day you start *cargo-culting your own workstation*.

I ran into a write-up about **bootc** and **OSTree** that basically reframed the whole problem for me:
stop thinking of Linux as something you “install and then patch forever”, and start thinking of it as something you **build, version, ship, and roll back**.

The punchline is simple:
- **OSTree**: “git-like” content-addressed filesystem trees + atomic deployments.
- **rpm-ostree**: an OS image workflow that still speaks RPM (layer packages, compose images).
- **bootc**: use **OCI container images** as the transport format for a *bootable host OS*.

No, your OS doesn’t run “inside a container”.
It just uses container images as a delivery mechanism.
That subtle distinction matters.

## Five angles I keep coming back to

1) **This is ops thinking, finally applied to the laptop.**
On servers, “immutable” stopped being a religion and became a risk management tool: fewer drift variables, better rollbacks, fewer 3am surprises.
It’s kind of wild it took this long for desktop workflows to get a first-class versioned-deployment story.

2) **The unit of change becomes the *system*, not the *package*.**
Traditional Linux upgrades are basically a stream of tiny mutations.
When it goes wrong, you debug a timeline.
With OSTree-style deployments, you debug a snapshot.
That’s a different failure mode.
It’s not “which package post-install script broke my boot?”.
It’s “which deployment hash did I boot?”.

3) **OCI as a transport format is… annoyingly practical.**
If you already have:
- registries
- signatures
- mirroring
- caching
- CI pipelines

…then bootc is basically saying: “cool, reuse all of that for OS delivery too.”
Not glamorous, but it collapses a lot of tooling sprawl.

4) **Rollbacks become a real habit, not a once-a-year panic button.**
A system where rollback is expected tends to:
- keep older deployments around
- make switching cheap
- treat “oops” as normal

That changes how you upgrade.
You stop postponing updates because you’re afraid of bricking the box.

5) **The dev experience tradeoff shifts from ‘flexibility’ to ‘containment’.**
If `/usr` is read-only, you can’t just `dnf install whatever` and call it a day.
That sounds annoying until you realize it forces a cleaner separation:
- base OS image (boring, stable)
- layered packages (explicit, tracked)
- per-project toolchains (toolbox / containers)

I’m not saying it’s perfect.
I’m saying it’s an opinionated workflow that matches how we already deploy everything else.

## The mental model that clicked for me

Imagine your OS like a Git repo.
Not in the “I keep dotfiles in Git” way.
In the “the whole root filesystem has commits” way.

You don’t “upgrade a file.”
You **deploy a new tree**.

When you install a package (with rpm-ostree), it’s not mutating the live system in-place.
It’s staging a new deployment.

So commands that used to mean “change things right now” start behaving more like “prepare the next boot.”

Here’s the vibe in one screenshot-worth of text:

```text
rpm-ostree install <package>
# => creates a new deployment, effective on next reboot

rpm-ostree rollback
# => go back to the previous deployment
```

That alone is already nice.
But bootc takes it a step further:

```text
bootc switch <registry>/<image>:<tag>
# => switch the entire base system to another image
```

If you’ve ever had “this machine is cursed” feelings, you can see why this is appealing.

## Where I’m still skeptical

- **Layering too much defeats the point.**
  If your “immutable OS” accumulates 80 layered packages and hand-edited config glue, you just reinvented mutable Linux with extra steps.

- **State is the hard part.**
  Your OS can be atomic, but your state isn’t.
  Databases, secrets, disk layouts, drivers, firmware updates… that’s where reality bites.

- **The escape hatch must be ergonomic.**
  Devs will always need *some* way to do weird things.
  If the path is painful, people will create drift anyway (and then blame the tool).

Still, I like the direction.
It feels like taking the lessons from container delivery and applying them to the thing that was still stuck in “manual install wizard” land.

## If I were adopting this tomorrow

My personal rule would be:
- keep the base image boring
- keep changes explicit
- push experiments into toolboxes/containers

And if I need to “just hack it” on the base system?
Fine — but then I want to be able to reset the machine to a known-good deployment without a weekend rebuild.

That’s the real feature.
Not immutability.
**Recoverability.**

---

**References:**
- [Bootc and OSTree: Modernizing Linux System Deployment (source article)](https://a-cup-of.coffee/blog/ostree-bootc/)
- [bootc project (boot and upgrade via container images)](https://github.com/bootc-dev/bootc)
- [libostree / OSTree documentation (git-like OS trees)](https://ostreedev.github.io/ostree/)
- [rpm-ostree documentation (hybrid image + package system)](https://coreos.github.io/rpm-ostree/)
- [Fedora Silverblue overview (atomic desktop)](https://fedoraproject.org/atomic-desktops/silverblue/)
