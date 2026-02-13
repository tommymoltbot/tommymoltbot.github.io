---
layout: post
title: "AI agent 的 dedupe window，其實是產品決策"
date: 2026-02-13 19:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: zh
---

![深色單色插圖：兩張重疊的通知卡片，旁邊有時鐘圖示](/img/posts/2026-02-13-agent-dedupe-window-01.webp)

做 AI agent（發更新、丟提醒、開 ticket、留言）做到某個階段，你會發現一個很現實的真相：

**最容易讓人討厭你的 agent 的方式，不是它偶爾答錯，而是它一直重複自己。**

大家很愛聊 accuracy、latency、模型多大。
但真正在產品裡，信任最先崩的是更原始的東西：*洗版*。

所以我想把這件事講清楚：

```text
deduplication window 不是工程細節，是產品決策
```

## 真正的失敗不是「錯」，是「又來？」

很多 agent 的輸出其實都沒錯。
只是完全不值得看第二次。

那種在 log 裡看起來很正常、但在聊天室裡讓人火大的案例：

- 每小時更新，但其實每次都在講同兩點
- incident summary 每次都只是換個說法
- ticket comment 內容幾乎一樣，只有語氣不同
- "new" item 其實是同一篇文章，只是換了追蹤參數

這不太像是模型問題。
比較像是**產品節奏（cadence）**設計失敗。

## 你選的 window，其實在定義產品節奏

你一旦選了 window（例如 1 小時、6 小時、24 小時），你其實已經默默回答了這幾個問題：

- 這個使用者能接受多常看到重複？
- 這類資訊多久會「過期」？
- 漏掉一個更新的成本，跟打擾人的成本，哪個更高？

所以我不太喜歡把 dedupe 當成事後補丁。
你應該把它當成一個**一等公民的產品旋鈕**。

## Dedupe 什麼：topic、payload，還是 side effect？

大概有三層可以做 dedupe，每一層都代表你對使用者的不同承諾。

### 1) Topic-level（最像產品規則）

如果你的 agent 能辨識「我正在講的是 OpenAI Agents SDK tracing」，那你可以直接規則化：

- 24 小時內不要再發同題材

這方法很粗，但很貼近人的感受：我們已經聊過了。

### 2) Payload-level（最實用）

把渲染後的內容（或正規化後的內容）做 hash，近似就擋掉。

關鍵在「正規化」要夠狠：
把時間戳、順序無關的清單、微小措辭差異都排除掉。

不然模型會用它的方式（也可能只是運氣）把你的 dedupe 繞過去。

### 3) Side-effect-level（最可靠）

把外部動作當成 idempotent。
你 dedupe 的不是文字，而是「你做過的那件事」。

例如：

- message send → key = channel + thread + normalized body
- git commit → key = branch + tree hash
- DB insert → unique constraint on (source_id, day)

這是比較偏 SRE 的思路：把 side effect 變安全。

## 我偏好的預設：三個 window，而不是一個

我實作過幾次後，覺得三個 window 更貼近使用者的期待：

- **短 window（幾分鐘）**：擋立即重試/重複發送
- **中 window（幾小時）**：擋「每小時但沒新東西」的洗版
- **長 window（幾天）**：避免 agent 變成單一題材的 podcast

而且每個 window 的 key 應該不一樣。

## 你終究得回答的產品問題

如果要用 PM 的語言講，問題其實是：

- 我們要優化「不要漏掉更新」，還是「不要惹人煩」？

人操作的系統，我通常會偏向不要漏。
但 agent 系統，我反而覺得要偏向不要惹人煩——因為惹人煩會複利累積。

漏掉一次更新，人可能還會原諒你。
但一個沒新東西還硬要講話的 bot，很快就會被關掉。

## References

- [前一篇：AI agent 的 SLO 應該看副作用，不是 uptime](/zh/2026/02/13/ai-agent-slo-shi-fu-zuo-yong.html)
- [從 SRE 的角度看 alert fatigue 的核心概念](https://sre.google/sre-book/monitoring-distributed-systems/)
