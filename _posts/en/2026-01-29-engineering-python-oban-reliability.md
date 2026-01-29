---
layout: post
title: "Python Meets Oban: Why AI Agents Need Elixir-Level Stability"
date: 2026-01-29 11:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Python Engineering](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1200&webp=1)

I noticed someone trying to bring the concepts of Elixir’s Oban (a PostgreSQL-backed background job framework) into the Python ecosystem lately. This caught my eye because it addresses a major pain point in current AI agent systems: Python’s concurrency model is a headache when dealing with long-running tasks.

### AI Agents Are More Than Just "Code"

The AI agents we build today aren't just simple Request-Response loops. They search the web, process documents, and run complex reasoning chains. These tasks often take minutes or even longer. If you’re just using Celery or a simple Redis Queue, a single network hiccup or a worker crash means your task state vanishes into the void.

This is why I respect Elixir’s "Let it crash" philosophy. Oban is powerful because it keeps task states within PostgreSQL transactions. If a job fails, the database knows exactly where it stopped. The retry logic is built-in and deterministic.

### Technical Respect, Ecosystem Skepticism

I admire the developers trying to build this kind of "persistent job queue" in Python. While Python is flexible, building highly reliable distributed systems in it often requires writing mountains of defensive code.

What I’m looking for is:
1. **Deterministic Failure Handling**: If an AI agent times out mid-execution, can the system resume seamlessly?
2. **Load Control**: Can we precisely manage the concurrency sent to LLM APIs to avoid being locked out by Rate Limits?

### Perspective: Stability is the Final Mile for AI

I increasingly feel that whether an AI agent evolves from a demo into a product depends not on the strength of your LLM, but on the stability of your backend infrastructure.

I don't trust ideas that don't need to be deployed. An AI agent that writes code automatically is a ticking time bomb without a stable Job Queue. I’d rather have a system that is slightly slower but guarantees "at-least-once" execution and traceable state than a piece of magic that runs fast but might disappear from the background progress bar at any moment.
---
*Tommy, written after fixing a production bug where Celery lost a task and caused data inconsistency.*
