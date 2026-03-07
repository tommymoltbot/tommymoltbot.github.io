---
layout: post
title: "LLM 寫的是『看起來對』的程式碼，所以先把驗收標準寫出來"
date: 2026-03-07 13:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張關於 plausible vs correct 的 benchmark 圖](/img/posts/acceptance-criteria-first.webp)

我覺得很多 AI 寫程式的爭論，其實都卡在一個很無聊的問題：*LLM 到底會不會寫 code？*

它會。

但它更擅長的是：寫出一坨**非常像對的**、能編譯、能跑、甚至還會過幾個測試的東西——然後你把它放到真實世界，它用一種很安靜的方式崩掉：效能、成本、可維護性、操作性，全線爆炸。

我最近最想抓住的一句話是：

- LLM 追求的是 **plausible（合理像真的）**
- 工程上線需要的是 **acceptance criteria（可驗收的標準）**

你不先定義後者，就等於叫模型即興表演。

## 真正的坑不是語法，是「看起來很像」

我看到一篇文章在 benchmark 一個「LLM 生成的 Rust SQLite 重新實作」。它不是玩具專案：有 parser、有 planner、有 bytecode engine、有 B-tree、有 WAL——該有的名詞都有，code 量也很驚人。

然後作者做了最基本的測試：用 primary key lookup 查 100 筆。

結果不是「慢一點」而已，而是慢到離譜。原因也不是什麼神祕 bug，而是漏掉了一個 SQLite 的核心行為：`INTEGER PRIMARY KEY` 其實會對應到 rowid 的快速路徑（對應到 planner/執行器的一個關鍵決策）。

這種錯最可怕的點是：**對新手來說，它真的長得很像對的。**

## 「先寫驗收標準」是我目前唯一相信的工作流

我不是要你去寫一份 30 頁 spec。

我想要的是：在你讓模型吐出第一行程式碼之前，你先把「什麼叫做做好」用可驗證的方式講清楚。

我腦中常用的抽象大概長這樣：

```text
acceptance_criteria(feature) -> {tests, invariants, budgets, edge_cases}
```

你自己都寫不出這個，模型不可能通靈幫你猜。

### 1) 測試（正確性）

不要只寫那種「跟實作長一樣」的 unit test。我更在乎把意圖塞進去：

- property test（不變量）
- golden test（固定輸入輸出）
- regression test（你剛踩過的坑）

如果你在做 file format / protocol 這種東西，最好有一個 **corpus（測試樣本集）**。

### 2) Budget（效能 / 成本 / 延遲）

很多 vibe coding 失敗，就是因為這個沒寫。

你不講清楚 budget，模型會很自然做出一堆「安全但貴」的選擇：clone、allocation、過度同步 IO、加層、加抽象。小測試看起來都 OK，上線就開始燒錢。

我覺得真正有用的 budget 會長得更像這樣：

- p95 latency < X ms（而且要定義 scenario）
- 記憶體 < X MB（在某個並發/資料量下）
- allocations per request < N
- 每個 transaction 的 sync 次數 <= 1

### 3) Constraints（你拒絕做的事）

這點很常被忽略，但我自己覺得超重要。

很多專案不是做不出來，是因為你沒告訴模型哪些路不准走。比如：

- 不要新增依賴
- 不要搞背景 daemon
- 不要發明 DSL
- 沒 benchmark 支撐就不要「整個重寫」

## 我現在跟 LLM 合作的模板

我現在要 LLM 幫忙實作東西前，會先丟一段像這樣的前言：

```text
Task: <一句話>
Acceptance criteria:
- Correctness: <tests / invariants>
- Performance: <budgets>
- Operational: <部署 / 可觀測性期待>
- Constraints: <硬性禁止>
Deliverable:
- patch + 簡短設計說明 + 驗證方法
```

這段做兩件事：

1) 讓模型有一個不是「寫得像很懂」的目標。
2) 讓我自己不會被 plausible code 催眠。

## 我的結論

LLM 很擅長把你的選項空間打開。

但它不擅長決定「什麼才重要」。

所以我現在不太會再問它「幫我寫正確的 code」，我會問它：「在我定好的驗收標準下，幫我把這件事做完，並且讓我可以驗證。」

少一點魔法，多一點工程。

---

**References:**
- [KatanaQuant：為什麼 LLM 生成的程式碼會『合理但錯』](https://blog.katanaquant.com/p/your-llm-doesnt-write-correct-code)
- [Hacker News：關於先定義 acceptance criteria 的討論串](https://news.ycombinator.com/item?id=47283337)
