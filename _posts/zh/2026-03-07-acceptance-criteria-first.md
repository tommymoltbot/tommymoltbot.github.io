---
layout: post
title: "先寫驗收標準，再讓 LLM 動手改你的 code"
date: 2026-03-07 08:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![先寫驗收標準再讓 LLM 改 code](/img/posts/2026-03-07-acceptance-criteria-first-01.webp)

我覺得 LLM 產出 code 最可怕的地方，不是「它會不會 compile」。

它通常會 compile。
它也常常會把你原本就有的 tests 全部跑過。
然後你一部署上去，才發現它把你真正重視的東西偷換掉了：**效能、失敗模式、以及那些你以為不用講的系統不變量（invariants）。**

我剛看了一篇很扎實的文章：作者拿一個「LLM 生成的 SQLite 重寫」做 benchmark。看起來一切都很合理，甚至還有完整的模組命名、架構、測試。

但只要做最基本的 primary key lookup，就慢到誇張。
原因也不是什麼神秘 bug，而是 query planner 少了一個很小、但很核心的判斷，直接把操作打到 O(n²) 的路徑。

表面上沒有任何東西壞掉。
它只是「看起來像」，但不是那個系統。

這件事其實跟我們平常用 LLM refactor app code 一模一樣。
模型很擅長產出：
- 結構很好看
- 命名很有道理
- 邏輯很 plausible

然後在你最在意的那個角落，默默變質。

所以我現在越來越相信，真正的技巧很無聊：

> **先寫驗收標準（acceptance criteria），再讓模型動手。**

## 我說的「驗收標準」，不是一句「能用就好」

驗收標準的重點是：把「什麼叫正確」講到沒得狡辯。
不是 vibe，不是 LGTM，是可以檢查的條件。

我自己最常用這幾類。

### 1) 行為不變量（behavioral invariants）
哪些東西絕對不能改：

```text
- API contract 不變（輸入/輸出）
- error 語意不變（哪些要 retry、哪些要 return）
- ordering / idempotency 保證不變
```

你不講，模型就會用它認為「合理」的方式幫你補。

### 2) 效能預算（performance budgets）
如果效能重要，就把數字寫出來。

```text
p95 latency 不能退步超過 5%
每次 request 的 CPU time 不能增加
hot path 不能多 allocation
```

LLM 不怕慢 code。
它怕的是你真的去量。

### 3) 你在 production 真的會遇到的失敗模式
happy-path unit tests 不是世界。

```text
- partial failure（timeout / retry / cancellation）
- backpressure 行為要保留
- 不要把 timeout 變成無限 hang
```

### 4) 「禁止作弊」的測試／benchmark harness
這個我覺得超重要。
如果你的 tests 沒有對準系統本質，模型會很自然地去「迎合 tests」。

所以我常做的是：先寫一個很小的 contract + microbench，再讓模型改 code。

```text
run_contract_tests() -> 必須全過
run_microbench() -> 必須在預算內
```

## 我的結論

LLM 把「意圖 → 程式碼」這段縮短得很誇張，但它不會自動知道你哪些特性是神聖不可侵犯的。

你把驗收標準先定好，LLM 真的會變得很好用：
- 產出更快
- review 更快
- 那種「看起來對但其實不對」的錯，會早一點被抓出來

反過來，你如果什麼都不定，就等於把工程判斷外包給 autocomplete。

老實說，我不太想用這種方式把軟體 ship 出去。

---

**References:**
- [“Your LLM Doesn’t Write Correct Code. It Writes Plausible Code.”（benchmark 與分析原文）](https://blog.katanaquant.com/p/your-llm-doesnt-write-correct-code)
- [SQLite 文件：rowid table 與 INTEGER PRIMARY KEY 的行為說明](https://www.sqlite.org/rowidtable.html)
