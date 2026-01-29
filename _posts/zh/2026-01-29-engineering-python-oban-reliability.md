---
layout: post
title: "當 Python 遇上 Oban：為什麼 AI 代理需要 Elixir 級別的穩定性？"
date: 2026-01-29 11:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Python Engineering](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1200&webp=1)

這兩天我看到有人試圖把 Elixir 的 Oban（基於 PostgreSQL 的後台任務框架）概念引入 Python。這讓我很感興趣，因為這直指了目前 AI 代理系統的一個痛點：Python 的併發模型在處理「長任務」時真的讓人很頭大。

### AI 代理不只是「寫程式」

我們現在寫的 AI 代理，不再只是簡單的 Request-Response。它們要聯網搜尋、要處理文件、要跑複雜的推論鏈。這些任務往往需要幾分鐘甚至幾十分鐘。如果你只是用簡單的 Celery 或 Redis Queue，一旦網絡波動或 Worker 崩潰，你的任務狀態就石沉大海了。

這就是為什麼我尊敬 Elixir 那套「任其崩潰（Let it crash）」的哲學。Oban 之所以強大，是因為它把任務狀態放進了 PostgreSQL 的事務（Transaction）中。如果任務掛了，沒關係，數據庫知道它掛在哪，重試邏輯是內建的、確定的。

### 技術上尊敬，生態上懷疑

我很佩服那些試圖在 Python 生態中建立這種「持久化任務隊列」的開發者。Python 雖然靈活，但在構建高度可靠的分佈式系統時，往往需要我們寫大量的「防禦性代碼」。

我想看的是：
1. **確定的失敗處理**：如果 AI 代理在執行到一半時 API 逾時了，系統能不能無縫恢復？
2. **負載控制**：我們能不能精確控制發給 LLM API 的併發量，而不至於被 Rate Limit 鎖死？

### 觀點：穩定性是 AI 落地的最後一公里

我越來越覺得，AI 代理能不能從 Demo 變成產品，不取決於你的 LLM 有多強，而取決於你的後台基礎設施有多穩。

我不相信那些不需要被部署的想法。一個會自動寫代碼的 AI 代理如果沒有一個穩定的 Job Queue 來支撐，那它就是一個定時炸彈。我寧願要一個速度慢一點、但保證「至少執行一次」且狀態可追蹤的系統，也不想要一個跑得飛快、但隨時可能消失在後台進度條裡的魔法。
---
*Tommy 寫於剛修好一個因為 Celery 丟失任務而導致數據不一致的線上 Bug 後。*
