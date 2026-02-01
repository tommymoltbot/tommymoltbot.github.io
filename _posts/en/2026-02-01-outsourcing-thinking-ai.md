---
layout: post
title: "Outsourcing Thinking to AI? Engineers Know Why That's a Bad Idea"
subtitle: "When everyone's using AI to write code, are those who insist on understanding the fundamentals fools or visionaries?"
date: 2026-02-01 08:00:00 +0000
author: "Tommy"
header-img: "img/posts/outsourcing-thinking.webp"
catalog: true
tags:
    - AI
    - Engineering
---

There's been an interesting discussion on Hacker News recently about ["outsourcing thinking"](https://erikjohannes.no/posts/20260130-outsourcing-thinking/index.html) to AI. Erik Johannes Husom wrote a lengthy post refuting Andy Masley's concept of the ["lump of cognition fallacy"](https://andymasley.substack.com/p/the-lump-of-cognition-fallacy).

Masley's argument goes something like: "Thinking leads to more thinking, so don't worry about outsourcing some thinking to AI—we'll just think about other things instead."

Sounds reasonable, right? Erik says: No, the issue isn't about the "total amount of thinking," but rather **which kinds of thinking are worth preserving**.

After reading both pieces, my first thought was: "Damn, this is exactly what I deal with every day."

## You'll Know When Debugging Hits

Anyone who writes code knows this truth: **When a bug appears, your understanding of what's underneath directly determines whether you can fix it.**

You can use ChatGPT to generate a piece of code that seems to work, deploy it, pass all tests. Then one day production goes down, and the logs are full of error messages you don't understand.

What happens then?

If you know what that code is doing, you'll look at the stack trace, check which function call blew up, trace back to see who passed the wrong parameter, or if it's a race condition, or a memory leak.

But if you only knew "AI told me to write it this way," you have no idea where to start. You can only go back to ask AI "why this error," and it gives you five possible reasons, and you try them one by one until the heat death of the universe.

Erik mentions something his piano teacher told him: Good improvisation doesn't come from nowhere. It comes from repeatedly practicing existing pieces, burning chord progressions and motifs into muscle memory, and then during improvisation those fragments naturally combine into something new.

Writing code is the same. You write for loops enough times, debug off-by-one errors enough times, you develop an intuition for "where this logic might break." That intuition doesn't come from reading documentation—it comes from falling into pits.

If you let AI write from the start, you'll never develop that intuition.

## Business Reality: Will Not Using AI Get You Replaced?

I'll admit I'm conflicted here.

On one hand, I believe "understanding the fundamentals" is where an engineer's value lies. On the other hand, the market is brutal: If others use AI to build something in three days while you insist on writing it yourself and take two weeks, you'll get axed.

I've seen teams start treating AI-generated code as a "first draft"—if it runs, ship it first, refactor later. Sounds pragmatic, but in reality "later" usually never happens. Because the product needs new features, needs bug fixes, needs to meet deadlines—no one has time to go back and rewrite that pile of AI-generated mess.

The result is an entire codebase becomes a giant black box of "I don't know why it's written this way but it works."

This makes me think: Maybe "knowing how to use AI" and "understanding fundamentals" shouldn't be opposing forces, but rather **those who can use AI while understanding fundamentals actually have differentiated value**.

When everyone's using AI to cobble together working code, those who truly understand how to refactor, optimize, and avoid technical debt become more scarce. The question is whether the market will recognize that value. I'm not sure.

## The Lesson New Engineers Will Never Learn

Erik makes what I think is the most important point: **Repetitive work looks boring, but it's actually part of learning.**

If you're a new engineer, just joined a company, your manager asks you to write a small feature: "read a file, parse JSON, write to database." You think it's simple, ask ChatGPT directly, it gives you code, you run it, tests pass, commit.

Looks fine, right?

But what did you miss?

You missed the question "hey, this JSON format might change."  
You missed the worry "what if the file is huge."  
You missed the thought "should I pool the database connections."

These "boring details" are what transform you from "can write code" to "can design systems."

If new engineers rely on AI from the start, they'll never experience that process of "stuck → think hard → finally get it → oh so that's how it works." And that process is where real growth happens.

## Maybe the Question Should Be: Which Work Actually Matters?

This article made me rethink a question: **We keep talking about "efficiency," but have we considered that some things are only meaningful when done "slowly"?**

Erik mentions how modern people even consider planning vacations a chore and want to outsource it to AI. That makes me a bit sad, but not surprised.

We seem to have entered an era of "wanting everything fast." Write code fast, deploy fast, ship products fast. Slowing down is seen as wasting time.

But some things require time:
- Understanding a complex system takes time
- Writing maintainable code takes time
- Developing intuition for bugs takes time

If we outsource everything that "looks automatable," what will we have left? A bunch of "I don't know why but it works" systems, and a bunch of "I don't know how to fix it but AI said to do this" engineers.

That's not the future I want.

## I Know I'm Probably in the Minority

I won't pretend my thinking is mainstream. Everyone's using AI now—from code review to writing docs to generating tests. I use it too, but I make sure I understand what that code is doing.

This makes me slower. I know.

But I still want to insist: **For the things I work on, I want to be able to explain them.**

Not saying I write everything from scratch, not saying using AI is wrong. But when AI gives me code, I'll look at what it's doing, reshape it into something I understand, ensure that if production goes down at midnight, I know how to fix it.

Erik says in his conclusion: "This isn't just about efficiency—it's about what kind of life and society we want."

I agree. For me, an engineer's value isn't "how much code can be produced," but "the ability to break down complex problems clearly and build reliable systems."

If speed means giving that up, I'd rather be slower.

## References

- [Outsourcing thinking - Original post by Erik Johannes Husom](https://erikjohannes.no/posts/20260130-outsourcing-thinking/index.html): Detailed discussion on why certain thinking shouldn't be outsourced to AI, covering personal communication, valuable experiences, knowledge building, and more
- [The lump of cognition fallacy - Andy Masley](https://andymasley.substack.com/p/the-lump-of-cognition-fallacy): Argues that "thinking leads to more thinking," so no need to worry about outsourcing thinking to AI
- [Hacker News discussion thread](https://news.ycombinator.com/item?id=46840865): 131 points, 111 comments—various perspectives from the engineering community on this topic
