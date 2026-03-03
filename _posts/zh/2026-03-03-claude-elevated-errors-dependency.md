---
layout: post
title: "Claude 掛掉的那幾小時：可靠性不是附贈品，而是你默默買下來的依賴"
date: 2026-03-03 09:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![一張模擬狀態頁 incident 的 AI 服務中斷主視覺](/img/posts/2026-03-03-claude-elevated-errors-01.webp)

今天早上看到 **Claude.ai** 在狀態頁上出現「elevated errors」。

表面上這就是一則普通的 incident 更新。

但我覺得它真正提醒的是：如果你在做任何「AI-native」的產品，你其實不是在選模型，你是在選一個 uptime profile。你把它接進來的同時，也把它的延遲尾巴、錯誤率、限流策略，一起接進你自己的產品裡。

然後你會在最尷尬的時候學到這件事：demo 的一半、deadline 的前一天，或是你正在用 AI 幫你 debug 一個 AI 相關的 production 問題。

## 最不舒服的真相：LLM 不是「library」，比較像「水電瓦斯」

很多團隊談 LLM 的方式很像談 dependency：

- 「我們用 Claude 寫 code。」
- 「我們用 GPT 做抽取。」
- 「之後可以換供應商。」

這種說法很舒服，因為 dependency 聽起來是可控的。

但 hosted AI 更像 utility：

- 你按用量付費
- 你不掌握底層 capacity 怎麼被分配
- 你只會在事後看到 incident 更新
- 你的產品體感品質會被別人的 p99 綁死

狀態頁變紅的時候，對使用者來說不是「他們掛了」，是「你這個功能壞了」。只是你手上可調的旋鈕比較少。

## 大多數 AI 產品其實都在 shipping 單點故障（只是叫它「迭代快」）

最常見的整合長這樣：

```text
llm_call(provider, model, prompt) -> response
```

然後你所有 downstream 都假設 `response` 一定存在。

這在 prototype 階段完全 OK。內部工具也可能 OK。

但當 LLM 進了你的 critical path，就開始痛：

- 客服/工單流程
- onboarding
- agent 自動化（會改狀態、會下指令）
- 使用者開始依賴的「AI 同事」功能

而且破壞 UX 的不一定是大 outage。很多時候只是：

- 5xx 增加
- tail latency 變長
- streaming 卡住
- auth/usage 被 throttle
- 某些區域部分故障

只要有 jitter，體感就會掉。

## 可靠性的稅是真的：你要嘛現在付，要嘛之後用事故來付

你如果想把 AI 做成「像產品」而不是「像 demo」，就一定會加很多 boring engineering：

1) **timeouts + 有預算的 retries**
   - 不是無限重試，而是「重試一次，不行就降級」。

2) **circuit breaker**
   - provider 明顯在抖的時候，別把自己也拖下去。

3) **不說謊的 fallback**
   - 「AI 暫時不可用，這裡有簡化流程」遠比「轉圈圈轉到天荒地老」好。

4) **該 cache 的地方就 cache**
   - 你會意外發現很多請求其實重複得很誠實。

5) **provider abstraction（但要有現實感）**
   - 你可以包一層。
   - 但「隨便換」通常不成立，因為你的 prompts、tool calling、以及 safety 假設多半已經跟某個模型綁在一起。

如果你做的是 agent，還要多付一筆：

- idempotency
- 去重
- 你以為的「exactly-once」在 retries 面前通常只是幻覺

## 我的私人規則：只要會改狀態，就要有 no-AI 的逃生門

如果 LLM 的失敗可能造成現實世界的 side effects（錢、資料、工單、寄信、關閉票），那我就希望它有一條路可以在「沒有 AI」的情況下仍然完成核心任務。

不是因為 LLM 不好。

是因為 outage 很正常。

我覺得很多團隊漏掉的點在這裡：**需要完美 AI uptime 才能成立的產品，不是 AI-first，是 fragile-first。**

## 更大的問題：我們在依賴一個你無法推理的黑箱系統

「elevated errors」這四個字其實很不 actionable。

你不知道：

- 究竟是哪個層級壞了
- 哪些 request 類型被影響
- 哪些 region
- provider 在做什麼 backpressure / 降載策略

於是你最後只能從外圍繞著 debug：

- 自己記 request IDs
- 自己量 latency
- 自己對照流量波動

這就是 vibe coding 最容易破功的地方。

如果 AI 要成為基礎設施，那最後跑得比較穩的，通常不是「prompt 最大」的人，而是把它當基礎設施在做的人：SLO、預算、fallback、可觀測性。

## 我接下來會觀察什麼

這次 incident 看起來很快就被處理了。

但趨勢比這個早晨更大：

- 越來越多產品把 LLM 放進 UX loop
- 越來越多團隊「預設只用單一供應商」
- 越來越多使用者期待 AI 像 deterministic feature 一樣穩

期望跟現實的落差，就是 churn 會長出來的地方。

所以如果你在做 AI 功能：把可靠性當成產品需求，而不是 ops 的備註。

因為 Claude 變紅的時候，使用者不在乎那是哪家的狀態頁。

---

**References:**
- [Anthropic 狀態頁：Claude.ai / 平台 / Claude Code elevated errors 的 incident 時間線](https://status.claude.com/incidents/yf48hzysrvl5)
- [Hacker News 討論串：社群轉貼與一些背景脈絡](https://news.ycombinator.com/item?id=47227647)
