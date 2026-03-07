---
layout: post
title: "驗證債（Verification Debt）：AI 讓你寫得更快，但上線更慢"
date: 2026-03-07 19:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![驗證債主視覺](/img/posts/2026-03-07-verification-debt-01.webp)

我最近在一些「全員 agentic coding」的團隊身上看到一個很一致的現象：

不是他們變 10x 會上線。

而是他們變 10x 會**產出**。

PR 變多、diff 變大、每個 commit message 都像作文比賽冠軍。但你真的要 merge 的那一刻，反而更卡。

因為瓶頸不在「打字」，在「你敢不敢相信它」。

這個落差其實有個滿好用的名字：**驗證債（verification debt）**。

簡單說就是：生成輸出的速度變得超快，但驗證「它真的對、真的安全、真的符合使用者要的」的速度沒有跟上。

## 1) AI 沒有讓工作消失，它只是把工作搬家

以前大家卡在「把東西寫出來」。

現在卡在「這東西到底是不是對的」。

用 agent 的時候，你不是在 review 一個人腦的意圖翻譯成 code，你是在 review 一個系統吐出來的結構化產物。

它很會長得像正確答案，但它沒有跟 production 一起被打過。

所以驗證不夠，就很容易形成那種「看起來沒問題」的假安全感。

## 2) 為什麼它比技術債更陰險

技術債通常會大聲痛：

- build 越來越慢
- 模組越來越纏
- 每次改 code 都心裡發毛

驗證債反而很安靜，甚至很爽：

- code 乾乾淨淨
- PR 排版漂亮
- tests 全綠

然後半年後你才發現：你把 ticket 寫得很完美，但 ticket 本身就是錯 spec。

或是漏了一個「在 scale 下才會爆炸」的小假設。

或是 agent 默默拉了一個你根本不能商用發佈的 dependency。

人類也會犯，但 AI 讓你更容易、更頻繁、更快地累積它。

## 3) 組織層級的陷阱：review queue 變成你的產品

如果 AI 讓每個工程師「多產」30–50%，團隊不會自動多上線 30–50% 的價值。

常見結果是：

- PR 變多 30–50%
- diff 變大
- 一堆「順手重構」因為 agent 覺得比較漂亮
- 文件變多但沒人讀

最後 throughput 的 limiter 變成那幾個願意（也有能力）說：

> 「不行，這要拆小。這要證明。」

如果團隊沒人練這個 veto 肌肉，你的 repo 很快就會變成一桌「沒驗證過的 buffet」。

## 4) 怎麼在它變成災難前，真的把驗證做起來

我不太信「小心一點」這種建議。下面是比較務實、我覺得真的能降債的做法。

### 4.1 給 diff 一個 review 預算

agent 一口氣開 1,500 行的 PR，本質上就是叫你借一筆貸款。

訂規則：**大改動必須拆 PR**。

你甚至可以把這種（看起來很蠢但很有用）的規則寫下來：

```text
review_time_budget(changed_lines, risk_level) -> minutes
```

你不需要精準公式，你需要的是那個習慣：
「如果我們沒時間 review，它就不值得 merge。」

### 4.2 先寫驗收條件，再讓 agent 產 code

agent 很擅長把錯的東西做得很完整。

所以先逼出至少一個可驗證的東西：

- 例子型 spec（input → output）
- perf budget（p95 latency、memory 上限）
- 不變量（例如「絕對不能在沒有 where 的情況下 delete」）

這會把你從「產 code」的心態，拉回「定義正確」的心態。

### 4.3 把驗證從『感覺』換成『證據』

如果你的測試策略主要是「跑一下看起來 OK」，AI 會很樂意幫你更快開進坑裡。

我偏好的最低配組合是：

- 可怕邏輯 → **property tests**
- 格式 / 序列化 → **golden tests**
- 新路徑 → **structured logs + traces**
- 只要 performance 有一點重要 → **接近 production 的 load test**

目標很單純：能用機械證據取代直覺的地方，就不要靠 vibe。

### 4.4 逼 agent 講 trade-off，並且懲罰廢話

不要問「你做了什麼」。改問：

- 你刻意沒做什麼？
- 你考慮過哪些替代設計？
- 哪個假設在 production 會把它搞爆？

然後限制輸出。如果 10–15 行都講不清楚設計，我通常會懷疑它自己也沒真的理解。

## 5) 我對 2026 的直覺：驗證能力就是新的資深程度

我不太擔心 AI 會把工程師變笨（那個太抽象）。

我比較擔心的是：組織文化會把「產 diff」當成最高價值，然後把「細緻驗證」當成沒績效的苦工。

但老實說，能讓系統活下來的就是後者。

所以如果你想在 AI 時代變得更難被取代，我的建議不是只學 prompt。

而是學怎麼把事情**證明**出來。

---

**References:**
- [Medium：Verification debt — the hidden cost of AI-generated code](https://fazy.medium.com/agentic-coding-ais-adolescence-b0d13452f981)
- [Kevin Browne：Verification debt is the AI era’s technical debt](https://www.kevinbrowne.ca/verification-debt-is-the-ai-eras-technical-debt/)
