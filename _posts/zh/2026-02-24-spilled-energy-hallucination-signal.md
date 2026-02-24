---
layout: post
title: "Spilled Energy：其實 hallucination 的訊號可能就藏在 logits 裡"
date: 2026-02-24 10:20:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Spilled Energy（概念示意圖）](/img/posts/2026-02-24-spilled-energy-01.webp)

大部分「hallucination 偵測」我看久了，常見的路線就兩種：

- **再訓練一個 classifier / probe**（然後你會得到一個需要跟著模型版本一起養的東西）
- **加更多 retrieval**（有效，但它主要是在改 *輸入*，不一定能抓到 *decoder 當下到底在幹嘛*）

這篇 arXiv 的角度我覺得比較務實：**不訓練任何東西、不看 activation，直接用你本來就拿得到的 logits**。

它的主張很直白：解碼的過程裡，概率分佈在相鄰 step 之間理論上應該有某種「連續性」。當這個連續性破掉，你會看到一個「energy spill」，而這種 spill 跟錯誤/偏誤/失敗會有相關。

我不會說這就能把 hallucination 解決掉。但如果你把它當成工程上的 primitive——「從 logits 算出來的訊號」——它反而很香：便宜、好接、也比較容易在 production 變成一條 guardrail。

## 我在乎的是什麼（工程師腦）

真實系統裡，hallucination 很少是「模型很笨」。更多時候是「它講得夠像真的，所以沒人察覺」。

如果你能拿到一個 **decoding-time 的風險訊號**，而且不需要額外訓練、不需要一堆外掛工具，你就有不少實用招：

- 直接中止，改成追問使用者
- 只在「看起來要翻車」的時候才觸發 retrieval
- 轉到慢一點但穩一點的模型
- UI 上加提醒（老實說，這已經很有價值了）

## 這個方法在講什麼（高層版本）

作者把 final softmax 重看成 Energy-Based Model，然後定義了兩個「免訓練」的 metric：

- **spilled energy**：比對相鄰 decoding step 的能量；那個「不該出現的差」就是 spill。
- **marginalized energy**：單一步驟也能量測。

如果你真的要把它接進系統，我理想中的介面其實很無聊：

```text
spilled_energy(logits_t, logits_t_plus_1) -> float
```

沒有 prompts、沒有額外模型，就只是數字。

這種東西才比較像是能在 production pipeline 活下來的設計，而不是「請遵守 17 條 prompt 規範」。

## 我會懷疑的點

在我願意押注之前，至少想看/想測幾件事：

- **跨模型家族的 calibration**：LLaMA 的閾值不一定能用在 Gemma。
- **創作類內容的 false positive**：有些「怪但合理」的生成，可能看起來也像 spill。
- **跟 decoding 參數的互動**：temperature、top-p、類 beam 的策略都可能影響訊號。

但它的好處是：因為免訓練，所以你可以很快 A/B。

## 真正的價值：一條便宜的「安全帶」

我不覺得 spilled energy 會變成什麼「真理檢測器」。

但我覺得它很可能是一條好用的安全帶：一個輕量、可組合的訊號，可以跟其他檢查一起用（retrieval 命中、引用覆蓋、tool execution 成功率、等等）。如果你在做 agents，這種「無聊但能組裝」的 safety lever 越多越好。

---

**References:**
- [arXiv 論文：Spilled Energy in Large Language Models（摘要與 PDF）](https://arxiv.org/abs/2602.18671)
