---
layout: post
title: "Claude Code 更常選擇自己做，而不是買工具——這其實是另一種平台力量"
date: 2026-02-26 20:20:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Claude Code picks study hero image](/img/posts/2026-02-26-claude-code-build-not-buy-01.webp)

我最近看到一篇 benchmark 研究，覺得滿值得咀嚼：他們把 **Claude Code** 丟進真實 repo 2,430 次，然後觀察它「會選什麼工具」。

結論其實很直白，但越想越不單純：

- 很多類別它會偏向 **自己做（Custom/DIY）**，不太推薦 SaaS。
- 但只要它願意推薦工具，又會非常「果斷」地把你帶往某些 **預設堆疊**（像 GitHub Actions、Stripe、shadcn/ui 這種）。

如果你在看 agentic dev tools（或 AI 幫你寫 code 這整坨），我覺得真正的重點不是模型多強，是「預設值」會怎麼把整個生態系往某個方向推。

## 1) 「自己做」是一種偏好，而且不一定是美德

你問「要不要加 feature flags」，它回你一個環境變數 + 百分比 rollout 的小系統，而不是直接說 LaunchDarkly。

身為工程師我其實懂這個直覺：

- 少一個 vendor
- 少一筆帳單
- 少一個 dashboard

但「自己做」也是很多團隊悄悄死掉的起點。

手刻的 feature flag 系統，通常在以下情境就開始長出牙齒：

- 需要 audit
- 需要大量 user targeting
- 需要跨服務 kill switch
- 你發現你其實在重做一個你根本不想維護的產品

AI 不是壞，它只是很自然地在優化「我現在把需求收掉」。這就是偏好。

## 2) 預設堆疊會變成重力場

研究裡提到，Claude Code 在某些類別（CI/CD、支付、UI 元件）推薦得非常一致。

如果這個現象是真的（就算只有方向上成立），那模型其實是在扮演一個超大的 distribution channel。

不是什麼陰謀論那種。

比較像是：如果大量工程師每天都在問「我該用什麼？」，而 AI 每次都把你推向同一批工具，那些工具就會變成最省阻力的路。

最可怕的是：整個過程不需要任何人明確做決策。

## 3) 「偏好新工具」不是品味問題，它會重寫生產系統

他們還提到一個 “recency gradient”：越新的模型越容易選新的工具（例如 ORM、job queue 之類的）。

聽起來像在聊品味，但在真實 codebase 裡會變成：

- migration
- data model 漂移
- ops/runbook 重寫
- on-call 肌肉記憶歸零

如果預設值每幾個月就跟著模型偏好漂一次，這不是「技術更新」而已，是一種組織債。

所以我開始在想：**AI 的工具建議，是不是也該當成一種 dependency，該 version pin？**

我目前傾向：要。

## 4) 「買或做」可能變成「先做再說，痛了再買」

2026 很多團隊不買工具，有時候不是因為它不值錢，而是因為他們不信自己 12 個月後還活著。

所以他們選擇先做。

不是更好，是比較能活下去。

如果 AI 一直把你推向 DIY，我覺得 SaaS 的策略可能不是「讓模型選我」。而是：

- 把 **遷移路徑** 做到幾乎無痛
- 把 **drop-in** 的故事講成真（不是簡報那種）
- 接受很多團隊會先 DIY，等痛點確認了才願意付錢

## 5) 我自己的結論（以會上線的人角度）

如果你正在用 Claude Code（或任何同類工具），我會做兩件很無聊但很重要的事：

1) 把你們家的 default（auth、feature flags、queue、observability）寫清楚，當成內部平台的一部分。
2) 當 AI 說「直接自己做就好」的時候，多問一句：

> 「我是在做一個我願意永遠維護的東西，還是我只是想撐到這週五？」

因為那是兩個完全不同的決策。

---

**References:**
- [Amplifying 研究：What Claude Code Actually Chooses（工具推薦偏好 benchmark）](https://amplifying.ai/research/claude-code-picks)
- [Anthropic 新聞：Introducing Claude Sonnet 4.6](https://www.anthropic.com/news/claude-sonnet-4-6)
