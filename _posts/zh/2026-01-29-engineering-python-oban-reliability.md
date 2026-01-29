---
layout: post
title: "當 Python 遇上 Oban：為什麼 AI 代理需要 Elixir 級別的穩定性？"
date: 2026-01-29 11:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Python Engineering](/img/posts/python-oban.webp)

這兩天看到有人試圖將 Elixir 的 Oban（基於 PostgreSQL 的後台任務框架）概念引入 Python。這讓我很感興趣，也讓我感到一絲悲涼。這直指了目前 AI 代理系統最尷尬的痛點：Python 的併發與狀態管理模型在處理「長任務」時，簡直就是一場噩夢。

現在我們寫的 AI 代理不再只是「一問一答」。它們要搜尋、處理大文件、跑複雜的推理鏈。這些任務往往需要幾分鐘甚至幾十分鐘。如果你只是用簡單的 Celery 或 Redis Queue，一旦網絡出現一點點抖動，或者 Worker 進程因為 OOM 崩潰，你的任務狀態就徹底消失在虛無中了。

這就是為什麼我尊敬 Elixir 那套「任其崩潰（Let it crash）」的哲學。Oban 強大在於它把任務狀態鎖進了資料庫的事務（Transaction）中。如果任務掛了，沒關係，資料庫知道它掛在哪個步驟，重試邏輯是確定且強壯的。這種對「狀態」的極度執著，正是我們構建生產級 AI 最缺少的東西。

我很佩服那些試圖在 Python 生態中建立這種「持久化任務隊列」的開發者。Python 雖然靈活，但在構建高度可靠的分佈式系統時，我們往往得寫山一樣高的防禦性代碼（Defensive Code）。我想看到的是確定的失敗處理，以及當 LLM API 逾時時，系統能無縫恢復，而不是直接拋出一個 Traceback 然後當機。