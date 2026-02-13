---
layout: post
title: "OpenAI Agents SDK 不是 agent framework，它更像一個 tracing 產品"
date: 2026-02-13 17:00:00 +0000
categories: [AI]
tags: [AI]
author: Tommy
lang: zh
---

![一個黑盒子拉出很多線，每條線都標註 span，就像 ops trace 圖](/img/posts/2026-02-13-openai-agents-sdk-tracing-01.webp)

做一個「AI agent」最快的方法，就是把模型黏上一堆工具。

做一個「很快會後悔的 agent」最快的方法，是把它丟上線，卻沒有 trace。

所以我最近在看 OpenAI 的 Agents SDK 時，注意力其實沒有放在「又多了一個 agent 框架」這件事上。

我反而覺得它最像的，是一個很現實的 production 產品能力：**內建 tracing**。

如果你有做過任何多步驟 workflow（更別說會動到外部系統的那種），你就懂我意思：

```text
沒有 trace = 沒有 debug = 沒有信任
```

這篇不是教學。我想講的是一個心智模型。

---

## 多數「agent framework」一開始就做錯的事

很多 agent demo 追求的是「看起來很會做事」：

- 模型呼叫工具
- 工具回來資料
- 模型講一句很像結論的話

畫面很精彩。

但你把它放到 production，第一個折磨你的問題通常超級無聊：

```text
剛剛到底發生了什麼？順序是什麼？為什麼會走到這一步？
```

你會需要回答：

- 呼叫了哪些工具？
- 參數送了什麼？
- 觸碰了哪些外部系統？
- 哪些輸出被接受、哪些被拒絕？
- agent 在哪一刻改變決策？
- 最終回答是基於哪一段證據？

答不出來，你就不是在營運產品。
你是在看魔術秀。

---

## 真正關鍵的功能：tracing

在 OpenAI Agents SDK 的文件裡，它明講 SDK 內建 tracing，可以讓你**把 agent flow 視覺化、debug**，後面也能做 eval / fine-tune / distillation 等。

我看到這句話的第一反應是把它翻成 ops 語言：

- 每一次 tool call 都是一個 span
- 每一次 handoff 都是一條 link
- 每一次失敗都可以被搜尋
- 每一次 run 都可以被檢視（甚至重播）

如果你做過分散式系統，你會知道這有多大槓桿。

### Agent 其實就是分散式系統（你承不承認都一樣）

所謂 agent loop，本質上就是小型 workflow engine：

- LLM 提案下一步
- 系統去 call tool
- 把結果餵回去
- 重複

再加上現實的東西：

- timeout
- retry
- 上游不穩
- rate limit
- partial failure
- 併發（多個 run 同時跑）

你其實已經在寫 distributed system 了。

而 distributed system 沒有 trace，只剩下痛苦。

---

## 我的規則：把 trace 當成產品

在 agent 世界，trace 不是「加分」。它是底線。

我喜歡用這種比喻：

- 模型是 **大腦**
- 工具是 **手**
- tracing 是 **神經系統**

你看不到 agent 做了什麼，你就沒辦法：

- debug
- 做安全設計
- 做評估
- 安全地迭代

所以當有人問我「要選哪個 agent framework？」我通常會反問：

```text
哪一個可以用最少儀式感，給你最好的 traces？
```

---

## tracing 能帶來的不只 debug

### 1) 不是 vibes 的 guardrails

寫在 prompt 裡的 guardrail，本質上是禮貌建議。
寫在 runtime 的 guardrail，才是可執行的邊界。

而 tracing 會讓 guardrail 變成可稽核的東西：

- 哪個檢查跑了
- 它看到了什麼
- 它擋了什麼
- 它放行了什麼

當 agent 會動到敏感系統，這件事很重要。

### 2) 真正的評估（不是「demo 感覺還不錯」）

你想把 agent 做好，一定得做 dataset / grading。

但更底層的前提是：

- 你要能穩定看到輸入
- 你要能穩定看到決策
- 你要能穩定看到結果

tracing 就是那個地基。

### 3) 不用猜的 incident response

當 agent 做錯事，你的 postmortem 不能只寫：

-「模型 hallucinate」

那不是 root cause。

有 trace 你才講得出真正可修的原因：

- tool X 被 429 擋了回空
- retry policy 沒有觸發
- agent fallback 到舊記憶
- validator 放過了弱輸出

這樣你修的是系統，不是祈禱「模型變聰明」。

---

## 我唯一會盯的一點：trace 要能被問問題

trace 只有在你能快速回答問題時才有價值。

所以我會用看 observability 工具的方式去看 tracing：

- 能不能用 user / 時間 / 工具 / error 快速搜尋？
- 能不能看到 tool 參數的原樣？
- 能不能對敏感欄位做 redaction？
- 能不能做 sampling，不然 volume 會把你淹死？
- 能不能 export 到自己的 stack（或會不會被鎖死）？

不能 query 的 trace，只是一篇很貴的日記。

---

## 如果你要做 agents：先把無聊的基礎建好

我不反對 framework。
我反對的是自欺。

要把 agent 放到線上，第一個 milestone 不是「換更聰明的模型」。

而是：

- 嚴格的 tool schema
- timeout + retry
- least privilege
- 還有 **tracing**

因為 agent 一旦碰到現實，現實就會要你拿出收據。

---

**References:**
- [OpenAI Agents SDK TypeScript 文件（概覽、primitives，以及內建 tracing）](https://openai.github.io/openai-agents-js/)
- [OpenAI Agents SDK Python 文件（專案首頁與 docs）](https://openai.github.io/openai-agents-python)
- [OpenAI API Agents 指南（Agent Builder、tools、guardrails、evals）](https://platform.openai.com/docs/guides/agents)
