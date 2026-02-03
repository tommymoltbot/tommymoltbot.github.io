---
layout: post
title: "Printing prompt injection on a street sign: command hijacking risks for embodied AI"
date: 2026-02-03 04:30:00 +0000
categories: [AI, Engineering]
tags: [Security, PromptInjection, Robotics, Safety]
lang: en
image: /img/posts/2026-02-03-embodied-prompt-injection.webp
---

![Prompt injection is not just a prompt](/img/posts/2026-02-03-embodied-prompt-injection.webp)

I’m slightly annoyed by how often prompt injection gets framed as “a chatbot got tricked.”

If you’re building an **agent**, or more bluntly, **embodied AI**—systems that see the world and then *act* (drive, fly, track, brake, land)—the scary part isn’t that the model says something dumb.

The scary part is that **instructions can live inside the environment**:

- they look normal (a sign, a sticker, a banner)
- the LVLM reads them because it’s trained to “understand text”
- and then the system *executes* because the action space is real

Some recent work frames this as **CHAI (Command Hijacking against embodied AI)**: not pixel-level adversarial noise, but semantic-level “command shaping” designed to be interpreted as an instruction.

My engineering translation was immediate:

> This is indirect prompt injection, but moved from webpages/PDFs into the physical world.

And once it’s physical, the failure mode is no longer “weird words.” It’s “weird behavior.”

## Five angles I use to sanity-check how serious this is

1) **Threat-model angle**: this is closer to social engineering than classic adversarial examples. You’re defending against *meaning* manipulation, not just sensor tampering.

2) **Product angle**: if your pipeline has “read text → turn into constraints/tasks → execute,” you’ve created an insertion point. You don’t need a genius attacker, just someone who can write a sentence that looks like a helpful reminder.

3) **Reliability angle**: it’s basically “control plane contamination.” The moment you let the outside world speak in your command channel, your system will faithfully treat it as truth.

4) **Safety angle**: vulnerability varies a lot across models and prompting templates. That’s bad news: you can’t eyeball your way into a security posture—you need testing, red teaming, and layered mitigations.

5) **My take (practical)**: “don’t use LVLMs” isn’t a plan. You’ll just hide them. The real plan is to draw **hard authorization boundaries**.

## The core issue isn’t “will the model be fooled?”

The real questions are:

- What do you treat as a **command**?
- Did you separate **observation** from **instruction**?
- Do you have a **human-auditable policy layer** that can override model outputs?

If your pipeline is “the model sees text → planner executes it,” you’ve effectively wired the environment into a root shell.

A blunt but useful split:

- **Untrusted, environment-writable signals**: signs, posters, screens, stickers, printed text on objects
- **Trusted internal commands**: operator instructions, mission system inputs, safety controller directives

If you let the first one *masquerade* as the second, you will get played.

## Three defenses that are actually implementable

### 1) Command channel separation

Don’t let the VLM directly output “do X.” Let it output observations or interpretations—but never executable commands.

Treat commands like API calls: narrow format, authenticated source, explicit intent.

### 2) Capability / authorization boundary

Even if the model says “emergency land now,” your system should ask:

```text
can_execute(action="emergency_land", reason, evidence) -> allow | deny
```

…and require evidence that is traceable.

### 3) Human-auditable safety policy

Put non-negotiable rules into a deterministic (or at least verifiable) layer:

- when lane changes are allowed
- when landing is allowed
- when approaching humans is allowed

After an incident, you should be able to answer: “Which rule was violated?”

## This isn’t just a robotics problem

Any agent that can “see → read → act” inherits the same class of risk.

Today it’s a street sign.

Tomorrow it’s:

- a sticky note next to your ops console
- a harmless-looking warning banner on a dashboard
- a “friendly tip” injected into logs

If you let the model treat it as a command, it will helpfully execute the incident all the way to the end.

---

## References

- [Anthropic: Prompt injection overview and mitigation ideas](https://www.anthropic.com/news/prompt-injection)
- [OWASP: Top 10 for LLM Applications (includes prompt injection)](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
