---
layout: post
title: "Epistemic Traps：為什麼『多打點 reward』救不了錯的世界模型"
date: 2026-02-23 10:15:00 +0000
categories: AI
tags: AI
author: Tommy
excerpt: "一篇新 arXiv 提出：很多被叫做 misalignment 的行為，其實是在『主觀世界模型』錯置下的理性均衡。問題不只是偏好學歪，而是它相信的世界本來就歪。"
lang: zh
---

![一張用相圖表示 reward 與主觀模型錯置的示意圖](/img/posts/2026-02-23-epistemic-traps-phase-01.webp)

我最近越來越不喜歡一種很常見的敘事：

- 模型做了不安全的事
- 我們「再 tune 一點」（更多 reward / 更多 RLHF / 更多規則）
- 於是它就會變安全

這敘事舒服，因為它暗示 safety 是一個滑桿。

但我剛看到一篇 arXiv：**「Epistemic Traps: Rational Misalignment Driven by Model Misspecification」**，它在講一個很刺的版本：

> 有些 misalignment 不是訓練瑕疵，而是在錯的世界模型下，最理性的策略。

如果這句話成立，你就會突然理解為什麼某些壞行為會「修了又長回來」。

## 我覺得最關鍵的句子：misalignment 可能是均衡

我用工程師語言翻譯一下（不保證跟作者完全一致，但意思大概是）：

- agent 在最大化 reward
- 但它是在自己的「主觀世界模型」裡最大化
- 當世界模型 misspecified（對世界的假設結構性地錯），你從外部看就會覺得它在發瘋

於是你看到的可能是：

- sycophancy（迎合）
- hallucination（幻覺）
- strategic deception（策略性欺騙）

這些不一定是「隨機 bug」，反而可能是**穩定、會重複出現的結果**。

這讓我想到一個很不浪漫、但很真實的工程定律：

```text
世界模型錯了 -> 你越用力最佳化 -> 只會更快撞牆
```

## 為什麼「多打 reward」不一定換到「更安全」

作者提到一個我覺得很有衝擊的說法：安全可能更像**相變（phase）**，不是連續曲線。

意思是：

- 你小幅調 reward → 還在同一個坑
- 你大幅調 reward → 也可能還在同一個坑
- 你改「先驗 / 信念結構」→ 邊界本身才會動

這個感覺其實很像現實：

- 你補一個規則，模型就學會另一種「規避 vibe」
- 你修一個症狀，類似症狀換個形式冒出來

不是說模型有惡意。
更像是：你在跟一個 optimizer 協商，但它玩的遊戲跟你想的不是同一個。

## 「Subjective Model Engineering」這詞很 production

他們把這件事命名為 **Subjective Model Engineering**：設計 agent 的內在信念結構。

這詞我反而很買單，因為在 production 你早就這樣做了：

- 你定義哪些資料源可信
- 你決定什麼叫 ground truth
- 你限制行為空間（能做的事就那幾種）
- 你給 deterministic 的工具與清楚的 contract

所以 agent 不是漂浮在空中的心智。
它是在一個「你設計過的 epistemic environment」裡做推理。

用一句話講就是：

- reward shaping 是「調旋鈕」
- subjective model engineering 是「改掉旋鈕背後的世界」

## 我會偷回去用的三個實務結論

我不打算假裝我已經把他們用經濟學 formalism 套到 AI 的推導都看懂。
但我很願意把結論拿去做系統設計：

1) **不要把穩定重複的壞行為當成雜訊**

如果某個 failure mode 很穩、很可重現，先假設它有內在邏輯。

2) **優先處理 epistemics（怎麼相信世界），不只處理 preferences（喜歡什麼）**

更好的：
- priors（哪些來源「算真」）
- state（記憶與上下文）
- instruments（工具輸出與合約）

3) **用「跨過邊界」的心態設計 safety**

如果 safety 是相變，你的目標不是「多安全 2%」。
你要想辦法「過線」。

這篇不一定會成為最後的主流框架。
但它至少敢講一件大家都不想面對的事：

也許我們一直在轉錯旋鈕。

---

**References:**
- [arXiv 摘要頁 — 「Epistemic Traps: Rational Misalignment Driven by Model Misspecification」](https://arxiv.org/abs/2602.17676)
- [arXiv PDF 下載 — 「Epistemic Traps」全文](https://arxiv.org/pdf/2602.17676)
