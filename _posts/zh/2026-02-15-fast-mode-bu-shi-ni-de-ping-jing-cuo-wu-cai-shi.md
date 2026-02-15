---
layout: post
title: "Fast mode 不是你的瓶頸——錯誤才是"
date: 2026-02-15 14:20:00 +0000
categories: [AI]
tags: [AI]
author: Tommy
lang: zh
---

![一個儀表板：tokens/s 在上升，但錯誤率上升更快](/img/posts/2026-02-15-fast-mode-01.webp)

最近大家都在推「fast mode」。
講白一點就是：同樣的模型（或看起來像同樣的模型），跑得更快。

我懂那個爽感。
你看著 agent 一步一步吐字，錢在燒，心裡自然想要加速。

但我覺得很多人忽略了一件事：

**在大多數真實工作流裡，推理速度不是瓶頸。可靠性才是。**

如果你的「變快」是靠換成更小、更不穩的模型，那你常常會在後面花更多時間擦屁股。

## 1) Throughput 很好量，錯誤率很難量

tokens/s 很乾淨。
你可以做圖表、做對比、做 KPI。

但你真正付出的時間長這樣：

```text
time = waiting_for_model + time_spent_fixing_model_mistakes
```

第二項才是大魔王。
而且它不是線性的。
一次錯的 tool call 可能把整個 run 直接炸掉。

更麻煩的是：**多數團隊根本沒在量「修正錯誤花了多久」。**
所以會很自然地去優化「看得見的那一段」。

## 2) 「fast mode」其實是兩種產品，硬被包成同一個名字

你看到的 fast mode，通常是這兩種之一：

- **同一個模型，但服務方式更激進**（例如更小 batch、成本更高）
- **換一個模型，換一種 tradeoff**（蒸餾/縮小版，為了速度調過）

兩種都可能有用。
但它們解的是完全不同的問題。

你如果是花更多錢買更低延遲，本質上是在買「優先通道」。
你如果是換成更小的模型，本質上是在買「不同的錯誤分布」。

這不是同一個旋鈕。

## 3) 可靠性崩壞，會發生在你最想用 agent 的地方

聊天的話，模型差一點還好。
你大不了再問一次。

但一旦進到 agent 領域——會動工具、會改檔案、會跑多步驟計畫——整個系統就更像 pipeline。

pipeline 最怕變異。

一個模型如果更容易：

- call 錯工具
- 幻覺參數/flag
- 跳過前置條件
- 看錯限制或約束

…它不會只是「差 15%」。
它可能會讓你感覺「爛 2 倍」，因為你得重跑、得人肉 babysit。

## 4) 正確心態：fast mode 應該是 *tier*，不是預設

如果我在幫一個認真團隊設計，我會把速度當成一種可控資源：

- **快的那層**拿來做可逆、便宜的步驟：解析、摘要、草稿、檢索。
- **慢但準的那層**拿來做不可逆的步驟：migration、deploy、付款、安全設定。

也就是：讓快模型負責「想」，讓慢模型負責「提交」。

這不是什麼 AI safety 作秀。
這就是 blast radius 的基本設計。

## 5) 我會量什麼指標

你要知道 fast mode 到底有沒有幫上忙，請量真正殘酷、但實用的指標：

- **完成率**：不用人工介入就跑完的比例
- **重試次數**：每個任務平均要重跑幾次
- **每次 run 的人工分鐘數**：babysitting 才是實際帳單
- **每個成功結果的成本**：不是每 token 的成本

速度當然重要。
但如果你不量可靠性，只是在優化儀表板，不是在優化工作流。

## References

- [Two different tricks for fast LLM inference（Sean Goedecke）](https://www.seangoedecke.com/fast-llm-inference/)
- [Anthropic fast mode 文件](https://platform.claude.com/docs/en/build-with-claude/fast-mode)
- [OpenAI 公告：GPT-5.3 Codex Spark](https://openai.com/index/introducing-gpt-5-3-codex-spark/)
- [OpenAI x Cerebras 合作公告](https://openai.com/index/cerebras-partnership/)
- [Wafer-scale engine 記憶體頻寬論文（arXiv）](https://arxiv.org/html/2503.11698v1)
