---
layout: post
title: "蒸餾攻擊正在變成新的爬蟲：Anthropic 指控 Claude 被『抽能力』這件事"
date: 2026-02-23 21:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Claude 蒸餾攻擊](/img/posts/2026-02-23-claude-distillation-attacks-01.webp)

如果你曾經做過公開 API，你大概懂那個感覺：只要一個東西開始有價值，就一定有人想把它自動化榨乾。

TechCrunch 的報導提到，Anthropic 指控三家中國 AI 團隊（DeepSeek、Moonshot AI、MiniMax）建立了 **兩萬四千多個假帳號**，跟 Claude 產生了 **一千六百萬次以上的對話**，用來做所謂的「distillation（蒸餾）」——說白一點，就是把 Claude 的輸出當訓練資料，回去把自家模型補強。

新聞本身很戲劇化。但我覺得更大的訊號是：**前沿模型公司正在被迫變成安全公司。**

而且這不只影響到幾家大廠，最後痛的是我們這些做產品、寫 code、接 API 的人。

## 蒸餾不是問題，蒸餾「別人的模型」才是

先講清楚：蒸餾本身很正常。

你要把模型做小、做快、做便宜，或做成特定領域的專家，蒸餾是標準套路。

但那個「工程師直覺會刺痛的界線」其實很明確：
- 「我蒸餾我自己的模型。」
- 「我蒸餾競爭對手的模型，而且規模大到需要假帳號農場，還專挑新模型剛上線的時間下手。」

這已經不像研究了，比較像是用 API 反推對方系統行為，把能力複製走。

如果你把它放到更熟悉的脈絡：這很像以前的 **爬蟲**。

只是以前偷的是 HTML；現在偷的是 **能力（competence）**。

## 為什麼「假帳號」這個細節很關鍵（而且只會越來越嚴重）

小量 query 你可以混在雜訊裡。

但 Anthropic 講的是「千萬級」的互動量，這種等級一定需要一整套操作：
- 身份基礎設施（大量假帳號）
- 付款/額度路徑（卡、代充、轉售）
- 流量形狀控制（避免一眼看出是 bot）
- prompt 操作（系統性覆蓋行為空間）

這不是週末黑客松能搞定的，是一個有預算、有目標的 operation。

更麻煩的是，誘因會越走越陡：
- 前沿模型越強 → 輸出越值錢
- 輸出越值錢 → 盜用輸出越有利
- 越有利 → 攻擊者投入越多

最後防禦會變嚴，然後真正付出摩擦成本的，會是正常使用者：
更嚴的驗證、更低的速率、更高的誤殺率。

## 「Agentic reasoning」這種東西真的很值得偷

Anthropic 說攻擊者特別鎖定 Claude 的差異化能力：agentic reasoning、tool use、coding。

我覺得這說法合理。

一般聊天內容你要抄，頂多抄到語氣。

但 **會用工具的模型行為**，才是你在做 agent 產品時真正想要的資產：
- 怎麼拆解任務
- 何時呼叫工具
- 失敗怎麼補救
- 看到部分結果怎麼繼續推進
- 何時停手

這些東西一旦可以大量蒐集成軌跡資料，就很適合拿來做 imitation。

用一個很工程師的抽象來說，大概長這樣：

```text
student_model(prompt) -> action_sequence
```

你最後在意的其實不是 prompt，而是那串 action_sequence。

## 出口管制：Anthropic 想讓你讀到的那個版本

這個新聞也被放在「美國 AI 晶片出口管制」的背景裡。

Anthropic 的意思大概是：這種規模的蒸餾攻擊需要先進晶片，所以出口管制更有道理。

我理解他們的立場，但我覺得有個微妙的落差：

出口管制管的是 **算力（compute access）**。

蒸餾攻擊卡的卻是 **API access**。

即使你把 GPU 全部鎖死，只要有人能用各種方式買到（或轉手拿到）模型 API，用「輸出」抽能力這件事就依然可能發生。

真正的 choke point 反而是：
- 帳號/身份驗證
- abuse detection
- rate limit
- 客戶究竟是不是那個客戶（以及背後的轉售鏈）
- cloud provider 會不會睜一隻眼閉一隻眼

所以如果政策端把這件事讀成「限制晶片就解決」，我覺得太樂觀。

## 對開發者/產品團隊的含義：你可能得先接受幾個現實

### 1) 把 prompt 當產品的一部分，但不要把它當護城河

如果最強的 agent 行為可以被大量複製，你真正比較耐久的東西通常是：
- 你的私有資料與 feedback loop
- 你整合進 workflow 的深度
- 分發
- 信任

如果你的產品本質是「一個寫得很好看的 prompt」，那被抄只是早晚。

### 2) 你會看到更多「用安全當理由」的綁平台

模型供應商要防抽取，最直覺的方式就是把平台收緊：
- 更強的身份驗證
- 更細的權限與條款
- 更封閉的工具生態
- watermark / fingerprint

有些是真的必要；有些可能只是順便把控制權拿回去。

### 3) 做 API 的人都會變成半個風控

以前你覺得「abuse / fraud」是支付公司、社群平台的問題。

現在 LLM API 變成高價值標的，這套防禦能力會變成標配：
- 行為異常偵測
- 更聰明的速率限制
- 大量用量的 KYC/驗證流程
- 新模型版本的延遲開放 / 分層供應

最後一點很惱人，但我覺得八成會發生。

## 我自己的不舒服結論

網路早就教過我們：只要一個東西是公開的、而且有價值，它就一定會被複製。

LLM 只是把「價值單位」換了。

以前你複製的是頁面；現在你複製的是能力。

一旦這件事可行，產業就會從「open access」慢慢走向「managed access」。

身為工程師我很矛盾。我喜歡開放，也討厭一堆摩擦。

但如果 Anthropic 講的數字哪怕只是大方向正確，這不是一次性的八卦，這是新常態。

---

**References:**
- [TechCrunch 關於 Anthropic 指控蒸餾攻擊的報導](https://techcrunch.com/2026/02/23/anthropic-accuses-chinese-ai-labs-of-mining-claude-as-us-debates-ai-chip-exports/)
- [Anthropic：Detecting and preventing distillation attacks](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks)
