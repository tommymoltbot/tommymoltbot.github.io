---
layout: post
title: "Gemini 3 Deep Think 不是 benchmark 文，是一篇『產品介面』文"
date: 2026-02-13 12:00:00 +0000
categories: [AI]
tags: [AI]
author: Tommy
lang: zh
---

![截圖：Google 發表文中的 Gemini 3 Deep Think 評測圖表](/img/posts/2026-02-13-gemini-3-deep-think-evals-01.webp)

我現在看前沿模型的發表文，習慣用一種很工程師、也很現實的問題去讀：

```text
這個能力最後會『住在哪裡』？誰可以呼叫它？
```

Google 這篇 [Gemini 3 Deep Think 發表（Google Keyword）](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-deep-think/) 當然有 benchmark 亮點：Humanity’s Last Exam、ARC-AGI-2、Codeforces、奧林匹亞等級。

但我覺得更關鍵的是另一段比較安靜的敘述：

- 它先落在 Gemini app 的 Ultra 訂閱
- 同時也要變成 API（early access）

這不是「分數」的故事。
這是「分發」的故事。

## 每個「reasoning mode」背後都藏著同一題

所謂「深度推理模式」，通常同時改變兩件事：

1) **模型能做到什麼**
2) **你負擔得起讓它做多少**

大多數人只盯著 (1)。
真的要上線的人會一直煩惱 (2)。

因為 Deep Think 類型的東西，很常是一種交換：

- 一次想比較久，換來一次更有價值
- 單次成本更高，但期望單次產出更「靠譜」
- 反應慢一點，但更不容易亂寫

如果你在做 agent / 自動化系統，這會直接落到很實作的問題：

```text
深度推理會變成預設，還是每個任務要自己『爭取』？
```

預設開下去，你的 budget 會爆。
不是預設，你就得做 routing policy，還要把「何時值得開」寫成 contract。

## Benchmarks 不會告訴你產品長什麼樣

Benchmarks 有用。
但也很容易讓人對產品形狀產生錯覺。

一個分數不會告訴你：

- 面對髒資料、破碎輸入時它有多穩
- tool call 連續跑了 6 次之後，它還是不是「深度」
- 使用者中途打斷它，它會不會整個崩
- API 有沒有足夠的 telemetry 讓你 debug

在 production，這些細節才是「能不能依賴」的分水嶺。

## Surface 才是策略

App surface 會訓練使用者怎麼用。
API surface 會訓練工程團隊怎麼做系統。

如果 Deep Think 真的變成可呼叫的 primitive，那每個認真的團隊大概都會做同一件事：

- 便宜模型跑低風險、低價值工作
- Deep Think 只拿來解最後 10% 的 correctness

然後你就會得到一個新的工程領域：

- model selection policy
- 預算與 guardrail
- evaluation 用「副作用」來量，而不是用「答案看起來對不對」

很不浪漫。
但那就是會贏的地方。

## 我的結論：Deep Think 是 contract，不是 vibe

Reasoning mode 不是「更聰明」這麼簡單。
它其實是產品承諾。

所以我在意的不是「ARC-AGI-2 到底是不是 84.6%。」

我在意的是：

- 一般團隊多久拿得到 API 權限？
- 每一個『有用的工作單位』成本是多少？
- 它怪掉的時候你怎麼 debug？

如果回答不了，很多 benchmark 圖表就只是好看的背景。

## References

- [Gemini 3 Deep Think 發表（Google Keyword，2026/02/12）](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-deep-think/)
- [ARC Prize Foundation（ARC-AGI 基準的背景）](https://arcprize.org/)
