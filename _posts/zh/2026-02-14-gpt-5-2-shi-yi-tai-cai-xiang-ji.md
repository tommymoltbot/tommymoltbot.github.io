---
layout: post
title: "GPT‑5.2 是一台猜想機，不是科學家"
date: 2026-02-14 09:00:00 +0000
categories: [AI]
tags: [AI]
author: Tommy
lang: zh
---

![一張極簡黑白插畫：黑板上滿是凌亂推導，旁邊一台小機器吐出一條乾淨公式，末端有問號](/img/posts/2026-02-14-gpt52-conjecture-machine-01.webp)

OpenAI 發了一篇 preprint，說 GPT‑5.2 協助推導出一個理論物理的新結果。
標題很爽，但我真正覺得值錢的地方反而很無聊：

GPT‑5.2 沒有「發現物理」。
它比較像一台 **猜想機（conjecture machine）**。

它把一堆醜到爆的小樣本結果做化簡、看出規律、丟出一個可能對所有 \(n\) 都成立的公式；然後人類（加上一個內部 scaffolded 版本）去做真正該做的事：**證明與驗證**。

這個工作流——*猜想 → 變成可驗證的 artifact*——我覺得會是接下來「LLM 上線」最常見的形狀。

## 真正的產品不是那篇論文

你把「gluons」拿掉，剩下的能力其實很像一種研究工具：

- 把複雜式子變短、變乾淨
- 從幾個 base cases 看出 pattern
- 提出一個可被驗證的通式

這不是聊天機器人 feature。
這是一個研究 primitive。

而且我相信會有人願意付錢。
不是因為「AI 開始做科學」，而是因為「找簡單公式」這種事很煩、很吃資深腦力、又很難 scale。

## 它不是 brute force，它是 pipeline

我覺得最值得偷的地方，是 paper 裡的做法。
作者先把小的 \(n\)（到 \(n=6\)）自己算出來，結果很醜；GPT‑5.2 把那些式子大幅化簡後，看出規律並提出通式；接著 scaffolded 版本花了大概 12 小時推理出 proof，最後再用物理上的標準檢查去打它。

換成工程語言大概是：

```text
base_cases(n<=6) -> symbolic_simplify() -> pattern_find() -> conjecture()
conjecture() -> prove() -> verify(recursion, soft_theorem) -> publishable_result
```

這不是「相信模型」。
這是「讓模型提出一個你可以用 checks 狠狠修理的東西」。

## 工程師會遇到更多猜想，而不是更多答案

如果你在做 LLM 系統，我覺得這是一個心態轉換：

- 模型輸出常常不是答案
- 它是一個候選結構（candidate structure）
- 你的工作是把它變成 **可重跑、可稽核、可追溯** 的 artifact

證明、測試、反例、最小化、schema validation。
任何你下週重跑一次仍然敢相信的東西。

因為「看起來很乾淨的公式」可以是錯的。
「看起來很乾淨的 JSON」也可以用同一種方式錯。

## 如果我真的要在工作上用這種模式

我只會把「猜想機」放進有護欄的 pipeline 裡：

- **版本化**：資料、prompt、tool contract 都要能 pin 住
- **可追溯**：要能 replay
- **驗證 gate**：tests / invariants / cross-checks
- **預算上限**：成本、重試、時間要 fail-closed

不然你不是在做工程。
你是在做 vibes —— 只是這次排版比較像數學而已。

## References

- [OpenAI：GPT‑5.2 在理論物理推導的新結果說明](https://openai.com/index/new-result-theoretical-physics/)
- [arXiv preprint：Single-minus gluon tree amplitudes are nonzero](https://arxiv.org/abs/2602.12176)
