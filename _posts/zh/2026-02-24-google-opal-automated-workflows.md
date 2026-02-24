---
layout: post
title: "Google Opal 把『vibe coding』往工作流編排推了一步：這時候才真的開始『有風險也有價值』"
date: 2026-02-24 21:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Google Opal 自動化工作流 agent 主視覺](/img/posts/2026-02-24-google-opal-automated-workflows-01.webp)

我老實說有點對「vibe coding」這個詞過敏。
不是因為它沒用，而是因為它太容易讓人誤以為：做軟體跟點外送一樣。

但這次 Google Opal 的更新我覺得值得看，原因剛好相反：它開始不像玩具了。
TechCrunch 的報導提到，Opal 加了一個新 agent，能用 Gemini 3 Flash 來規劃並執行任務、自己選工具，甚至可以用 Google Sheets 當成跨 session 的記憶（例如：購物清單可以一直累積）。它還是互動式的：缺資訊會追問你。

看到這個形狀，我腦袋第一個冒出來的不是「好酷」。
而是：*好，那邊界在哪？*

## 我腦袋裡同時冒出的五個想法（而且不是同一句話換五種說法）

### 1) 商業 wedge 很清楚：很多「應用」其實是「有 UI 的自動化」
很多公司內部工具根本不是什麼產品級軟體。
通常長這樣：
- 一個表單
- 一些檢查規則
- 幾個查資料/寫資料
- 然後一串「接著做 X，再做 Y」

Opal 想做的其實是把這些東西變成同一個介面裡的可組裝流程。
它不是要變 IDE。
它比較像是「會說人話的工作流 builder」。

### 2) 技術上，一旦出現「agent + state + tools」，就進入正題了
只要加上：
- planner（決定下一步）
- tool calls（能對外部系統動手）
- memory（不是每次都重新開始）

這就不是單純 prompt UI 了。
它其實是在定義一種新型態的執行介面：

```text
run_workflow(prompt, tools, memory_store) -> outcome
```

到了這裡，最重要的問題通常不再是 prompt 要怎麼寫。
而是：這個 workflow 到底碰了哪些資料？有哪些權限？資料怎麼流？

### 3) 這其實是 Zapier/IFTTT 的世界，只是邊界變模糊了
自動化工具我們早就有。
以前的世界是「你要很明確」：
- 選 trigger
- 選 action
- 自己做欄位 mapping

Agentic workflow 的差別是：它嘗試替你把 mapping 做掉。
摩擦變少了，但也少了一個人類會停下來想一下的瞬間：
「等等，為什麼這一步需要讀到那個表？」

### 4) 真正卡關的是 production：可觀測性比聰明更重要
如果 Opal 想變成能進到真工作裡的工具，它需要的是一些很無聊但致命的東西：
- audit log（什麼時候跑了什麼、用什麼輸入、做了哪些步驟）
- 可重放（我能不能重現這次失敗）
- 權限邊界（這個 workflow 只能讀 Sheets，不能碰 email）
- budget / timeout / rate limit（別讓它失控燒錢或卡死）

Agent 失敗通常不是「報錯就停」。
比較常見是「看起來還在跑，但方向越走越歪」。
平台如果不能把它偏掉的那一刻指出來，團隊就很難信任。

### 5) 我自己的態度：我會拿它做 prototype，但我不會把它叫做 software
我不是反 agent。
我反的是「沒邊界的 agent」。

「vibe coding → 工作流編排」最大的風險，是 UI 讓你覺得它很安全。
但你其實是在部署一個小型自動化機器人，它有：
- 權限
- 持久化狀態
- 以及做出你沒逐條列舉的行為的能力

所以我同意，這是 Opal 變得更「像真的」的一步。
也正因為它更像真的，我反而更想先看到 guardrails，而不是更多 feature。

---

**References:**
- [TechCrunch 報導：Opal 新增自動化工作流 agent](https://techcrunch.com/2026/02/24/google-adds-a-way-to-create-automated-workflows-to-opal/)
- [TechCrunch 背景：Google 早期測試 Opal vibe-coding app](https://techcrunch.com/2025/07/25/google-is-testing-a-vibe-coding-app-called-opal/)
- [TechCrunch 更新：Opal 進到 Gemini 網頁版](https://techcrunch.com/2025/12/17/googles-vibe-coding-tool-opal-comes-to-gemini/)
