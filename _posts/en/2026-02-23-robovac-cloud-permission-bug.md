---
layout: post
title: "A Robot Vacuum Isn’t a Webcam — But Your Cloud Backend Might Treat It Like One"
date: 2026-02-23 13:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![A redacted view of how a DJI Romo client talked to cloud services](/img/posts/2026-02-23-robovac-permission-bug-01.webp)

If you want a quick way to ruin your day as an engineer, here’s one:

A guy tries to drive his robot vacuum with a PS5 controller. His app talks to the vendor’s cloud. The cloud replies, “Sure, you’re the owner.”

…of **thousands** of other vacuums.

This DJI Romo incident (as reported by The Verge and Popular Science) is not interesting because “lol smart homes are cursed.” It’s interesting because it’s a clean example of a failure mode we keep repeating:

- devices in private spaces (camera + mic + floor maps)
- a cloud relay that *must* exist for remote control
- and a backend authorization layer that accidentally assumes “authenticated” means “authorized for everything.”

That’s the whole story. And it’s also why “just add TLS” doesn’t buy you much.

## 1) Authentication is not authorization (still)

I know, everyone has heard this. But we keep shipping systems that behave like:

```text
authenticate(token) -> ok
```

…and then quietly skip the part that actually matters:

```text
authorize(token, device_id, action) -> allow | deny
```

If your token can subscribe to everyone’s MQTT topics (or query everyone’s device status, camera feed metadata, maps, etc.), then your backend is effectively running a **shared apartment** and trusting everyone’s key.

The Verge’s reporting framed it as a backend permission validation issue in MQTT-based comms. That’s exactly the kind of bug that doesn’t look dramatic in code review — until you realize the data plane is “a vacuum cleaner that can see your living room.”

## 2) “TLS protected it” is the wrong mental model

Even if transport is encrypted, you can still have a privacy disaster if the wrong party can legitimately receive the plaintext *after* the TLS tunnel.

This is why the phrase “TLS does nothing to prevent this — it only protects the pipe” keeps showing up in security writeups. If an authenticated client can join the broker and wildcard-subscribe, then encryption is doing its job… while your access control is not.

The scary part isn’t a Hollywood hacker. It’s that the system *works as designed* — for the wrong user.

## 3) Robots are sensors first, appliances second

A $2,000 robovac with a camera, microphone, and room mapping is not “just a vacuum.” It’s a moving sensor platform.

You can argue the mic is for voice commands, the camera is for obstacle detection, and the maps are for navigation. Sure.

But the moment you upload any of that to the cloud — or even just make it accessible via cloud relay — you’re shipping a product that needs to be treated like a **home security camera**.

Same bar:
- strict per-device ACLs
- strong audit logs
- rate limits that assume abuse
- and a revocation story that doesn’t depend on “please update the app.”

## 4) AI coding tools don’t “cause” this — they change who can exploit it

I’m not buying the moral panic that “AI assistants create hackers.”

But I *do* buy the operational reality: AI tools compress the time between “I have a weird idea” and “I have a working prototype that talks to your production servers.”

The vulnerability is still the company’s fault. Yet the pool of people who can discover and operationalize it becomes bigger.

So if you’re building IoT + cloud:
- you don’t get to assume “only skilled attackers will find this.”
- you have to assume “a curious engineer on a weekend” will.

## 5) My boring takeaway: topic-level ACLs and least privilege, everywhere

This story reads like a classic least-privilege failure.

If you’re using MQTT (or anything message-broker-ish), your baseline should feel annoyingly strict:

- a device publishes only to its own topics
- a user token can subscribe only to its own device topics
- “#” (wildcard) should be basically impossible in production

Because the cost of being wrong is not “someone turns on my vacuum.” The cost is:
- live audio
- live video
- home floor plans
- rough geolocation

That’s not a bug. That’s a surveillance product you didn’t mean to ship.

---

**References:**
- [The Verge report on DJI Romo’s backend permission bug and remote access risk](https://www.theverge.com/tech/879088/dji-romo-hack-vulnerability-remote-control-camera-access-mqtt)
- [Popular Science summary of the DJI Romo incident and broader smart home privacy concerns](https://www.popsci.com/technology/robot-vacuum-army/)
