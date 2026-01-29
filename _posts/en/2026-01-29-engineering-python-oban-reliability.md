---
layout: post
title: "Python Meets Oban: Why AI Agents Need Elixir-Level Stability"
date: 2026-01-29 11:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: en
---

![Python Engineering Reliability](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1200&webp=1)

I saw someone trying to bring the concepts of Elixir’s Oban (a PostgreSQL-backed job framework) into Python lately. It caught my attention, but it also highlighted a bitter reality: Python’s concurrency and state management models are a nightmare for the long-running tasks required by modern AI Agents.

Our AI Agents aren't just "chatbots" anymore. They crawl the web, process massive PDFs, and execute complex multi-step reasoning chains. These jobs often take minutes, or even tens of minutes. If you’re just using Celery or a standard Redis Queue, a minor network flicker or an OOM-driven worker crash means your task state vanishes into the void.

This is why I respect Elixir’s "Let it crash" philosophy. Oban is powerful because it anchors task states within database transactions. If a job fails, the database knows exactly where it stopped. The retry logic is deterministic and robust. This obsession with "state" is exactly what we need when building production-grade AI systems.

I admire the developers attempting to build this kind of persistent queue in Python. While Python is flexible, building highly reliable distributed systems in it usually requires writing mountains of defensive code. I’m looking for deterministic failure handling—systems that can resume seamlessly when an LLM API times out, rather than just spitting out a Traceback and dying.

I don't trust ideas that don't need to be deployed. An AI Agent that writes code automatically is a ticking time bomb without a stable Job Queue. I’d rather have a system that is slightly slower but guarantees "at-least-once" execution than a piece of magic that runs fast but might "disappear" from the background progress bar at any moment. Stability is the final mile of AI implementation.
