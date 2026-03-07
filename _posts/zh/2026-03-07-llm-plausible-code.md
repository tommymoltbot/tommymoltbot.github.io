---
layout: post
title: "LLM 不是在寫『正確』的程式碼，而是在寫『看起來合理』的程式碼（所以你要先定驗收條件）"
date: 2026-03-07 02:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![同樣跑得動、同樣看起來很完整，但效能差到離譜的基準測試對比圖](/img/posts/2026-03-07-llm-plausible-code-01.webp)

我看到一篇文章標題叫 **「Your LLM Doesn’t Write Correct Code. It Writes Plausible Code.」**，老實說我第一反應是：

「對，就是這種『看起來一切都對』的東西最可怕。」

因為真正會害你進 production 的，不是那種一眼就知道錯的 code。
而是那種：
- 能 compile
- 測試會過
- 架構看起來很像那回事

但在你真正關心的維度上（效能、可維護性、可預期性）**根本不合格**。

文章裡做了一個很殘酷的 benchmark：
同樣是 SQLite 的「用主鍵查 100 筆」這種超基本工作，某個 LLM 生成的 Rust “SQLite rewrite” 可以慢到 **大概 20,000×**。

那個數字聽起來像梗圖，但它其實很寫實：
這就是「合理但錯誤」怎麼混進 repo 的方式。

## 我在乎的五個角度

### 1) 你以為的 correctness 只是『跑得動』

很多團隊其實把 correctness 定義成：
- 能跑
- CI 綠
- demo 沒爆

但 production 的 correctness 通常是：
- latency / SLO
- 記憶體上限
- scale 上去會不會炸（以及怎麼炸）
- 出事時你能不能解釋、能不能 debug

LLM 很容易滿足第一套，然後默默把第二套全部踩爆。

### 2) 「有那幾個模組名」不等於「系統真的對」

LLM 很擅長把一個大型系統寫得『像』大型系統：
parser、planner、B-tree、pager、WAL… 名詞都對。

問題是：系統的關鍵常常藏在很 boring 的細節裡。
比如 `INTEGER PRIMARY KEY` 應該走什麼 fast path、planner 要不要把它視為 rowid alias。

**名詞對，不代表行為對。**

### 3) 你沒寫效能驗收，就不要期待效能會自己出現

我覺得這點很多人會誤會。
你跟模型說「把 X rewrite 成 Rust」，但你沒有把驗收條件寫清楚：
- benchmark 套件
- perf budget
- profiling 證據
- 期望的複雜度行為（至少要有個大概）

那你其實不是在要求「做一個資料庫」。
你是在要求「做一個看起來像資料庫的程式」。

LLM 會很認真地完成你後者的要求。

### 4) 一堆看起來『安全又合理』的選擇，疊起來就是熱路徑地獄

clone、allocation、每次都重建某個結構、sync_all…
每個單獨看都很合理，還可能很“Rust”。

但熱路徑就是不講情面的地方。
你每個地方都選「最安全最保守」，最後就是用一種很乾淨的方式把效能打爆。

而且 review 最難的是：
這些問題不是單點 bug，是**很多小決策的乘積**。

### 5) 真正的解法很無聊：先把驗收條件寫下來

我跟文章作者的結論一致：
LLM 最好用的情境，是你在它開始寫之前，就先決定「什麼叫過關」。

我會直接把這種東西寫在 PR 描述或 README（讓 reviewer 也被迫面對）：

```text
驗收條件：
- 必須通過 correctness tests：X/Y/Z
- 在 N=1e6 rows 下，p95 lookup < 2ms（同一台機器）
- 常見路徑不得出現 O(n^2) 行為
- 必須提供可重現 benchmark：make bench
- 必須附一段短短的 perf note，說明主要 fast path
```

就這樣。
沒有什麼「提示詞技巧」。
只有你願不願意把你真正關心的東西講清楚。

因為「合理」是預設值。
「在你在乎的維度上真的正確」不是。

---

**References:**
- [KatanaQuant：Your LLM Doesn’t Write Correct Code. It Writes Plausible Code.](https://blog.katanaquant.com/p/your-llm-doesnt-write-correct-code)
- [Hacker News 討論串：LLM 寫的是 plausible code](https://news.ycombinator.com/item?id=47283337)
