---
layout: post
title: "Mercury 2 跟 diffusion LLM 真正想解的問題：把延遲預算拿回來買推理"
date: 2026-02-25 10:15:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Mercury 2 speed](/img/posts/mercury-2-speed.webp)

你只要真的把「agent」丟進 production 一次，就會瞬間理解一件事：產品不是 model，產品是 **loop**。

一個任務很容易變成 10～50 次模型呼叫（plan → retrieve → rank → extract → verify → retry），然後一個使用者會變成 1,000 個併發使用者。

所以我對任何「最快 LLM」的標題都會先打個折。但 Inception 的 **Mercury 2** 這篇介紹，有一個點我覺得講對了：**diffusion 不是讓你打字更快而已，它會改變你怎麼花延遲預算。**

不是「autocomplete 快一點」那種小確幸，而是「你終於有機會在同樣的 UX 期限內做更像推理的事情」。

## 五個我一直在腦內打轉的想法

### 1) 有 loop 之後，速度就不是 vanity metric

單次回答 800ms vs 3s，你可以說是 UX。

但如果你的 pipeline 需要 25 次串起來的 call？那就是「這功能看起來像真的」跟「這功能明顯在硬撐」的差別。

他們在文裡一直強調 latency 會 compound，我覺得這很貼近現實。

他們也提到在 NVIDIA Blackwell 上 **1,009 tokens/sec** 這種數字。如果是真的，重點其實不是炫耀，而是 **高併發下的 p95 行為** —— 也就是最容易把 production 搞爛的那一塊。

### 2) Diffusion 更像「先出草稿，再整篇修稿」

Autoregressive decoding 像打字機：左到右，一 token 一 token 打。

Diffusion 的直覺比較像：先從雜訊開始，然後用少數幾步去把整段文字一起 refine。

我喜歡這個比喻，因為這也比較符合我們希望工具輸出長什麼樣：先給你一個大致能用的版本，再把局部的錯字、邏輯斷裂慢慢修掉，而不是一開始就被某個早期 token 帶歪，後面只能一路硬編下去。

### 3) 真正的價值：把「推理預算」買回來

我覺得 2025～2026 的 AI app 有個有點尷尬的事實：很多「推理」其實是 **test-time compute**。

你能用錢買到的東西大概是：
- 更長的 chain
- 多採樣幾次
- 多 retry 幾次
- 再跑一遍自我檢查

但這些全部都在燒 latency 和 cost。

Diffusion 這條路有趣的地方是：它有機會把「推理等級的品質」塞進更可接受的延遲預算裡。

Mercury 2 在真實、混亂的工作負載下到底能不能做到？我現在不敢下結論。但方向是對的：下一波「更好的模型」，可能長得像 **quality-per-millisecond**，不是又多贏幾個 benchmark。

### 4) 「OpenAI API compatible」其實是產品策略

他們說 Mercury 2 是 OpenAI API compatible。這點很重要，因為它把導入門檻直接壓到「改設定」。

如果你只要換 base URL、換 model name，就能做 A/B latency 測試，那你在一天內就可以知道它值不值得繼續。

當然，我也不會把 “compatible” 當成二元的。

我真的要整合的話，我會先把最 boring 的東西確認過：

```text
POST /v1/chat/completions
```

接著才測：
- streaming 的節奏（是真的順，還是一次噴一坨）
- tool calling 的 determinism（重跑會不會亂飄）
- schema-aligned JSON 在長 prompt 壓力下會不會碎掉

### 5) 我還是會對 tokens/sec 保持懷疑（因為我在乎的不是那個）

tokens/sec 在 lab 裡是個好指標。

但 production 我更在乎：
- tail latency（p95/p99）
- 併發撐不撐得住、什麼時候崩
- time-to-first-token vs time-to-last-token
- turn-to-turn 的一致性（jitter 真的很殺「體感」）

所以我目前對 Mercury 2 的態度比較像：**有機會，但要看 serving 這一整套能不能扛住真實世界。**

不過就算最後不是 Mercury 2 成為主流，diffusion 這個方向我覺得是少數看起來能「改變 agent 系統經濟學」的架構路線之一，而不是繼續在同一個序列解碼瓶頸上堆更多 GPU。

---

**References:**
- [Inception Labs 官方部落格：Mercury 2 發表文章（diffusion 推理 LLM）](https://www.inceptionlabs.ai/blog/introducing-mercury-2)
- [arXiv 論文：Diffusion-LM（以 diffusion 做非自回歸文字生成）](https://arxiv.org/abs/2205.14217)
