---
layout: post
title: "GLM-5 不是重點。重點是你接下來要『管理一個系統』"
date: 2026-02-11 21:01:30
categories: AI
tags: AI
author: Tommy
lang: zh
---

![GLM-5：從 vibe coding 到 agentic engineering](/img/posts/2026-02-11-glm-5-agentic-engineering.webp)

我看到 GLM-5 的發布文，第一個反應其實不是「哇新模型」。

而是：*他們開始很明確地把目標放在 long-horizon 的 agent 工作上了*。不是聊天、不是「幫我改文案」，是那種會一路讀 repo、改檔、跑命令、甚至需要多人（多 agent）接力的「操作型任務」。

這件事一旦發生，整個問題域就變了：你不再是在比誰的 prompt 比較會寫，而是在比誰的系統比較能活。

GLM-5 的文案當然會堆一些數字：744B 參數、40B active、更多 tokens、稀疏注意力、省成本……好，這些我都看得到。

但我更在意的是它背後暗示的產品需求：

> 你不可能賣「agents」，同時又讓它做的事不可見。

只要你認真跑過一次 coding agent，你一定遇過這種 UX：它說它讀了檔案、搜尋了 pattern、改了內容，但你看到的只是這種沒有靈魂的摘要：

```text
Read 3 files.
Searched for 13 patterns.
```

這不叫 observability，這叫 vibes 加收據。

所以我今天想寫的角度很簡單：**「agentic」逼著整個生態系承認：UX 其實是 correctness 的一部分。**

## 1) long-horizon 的隱形稅：你需要能追溯的證據鏈

短任務你可以用肉眼 review。

長任務（幾小時、幾天、多個 sub-agents）你做不到。你需要能快速回答：

- 它到底讀了哪個檔？
- 它到底搜尋了什麼字串？
- 它到底改了哪裡？
- 它有沒有「想做但被擋下來」的操作？

如果這些答案都得靠你一直點開折疊區塊、再靠記憶拼起來，那你的系統沒辦法 scale。

也因此，當工具把「檔案路徑」或「搜尋 pattern」藏起來時，大家會很火大。那不是龜毛，是因為你少了信任與 debug 的基本材料。

## 2) 「用 verbose mode」不是解法，那是中間層設計失敗

開發工具界有個超常見的回覆模板：

- 使用者抱怨：「我只需要一個很關鍵的上下文。」
- 供應商回：「去開 verbose mode。」

問題是 verbose mode 是 firehose。它是診斷用的，不是工作流用的。

我在 review agent run 的時候，不想看滿版 transcript。我想看的是可操作的識別資訊：

```text
Read: src/auth/policy.ts
Search: "token_exchange"
Edit: _posts/en/2026-02-11-....md
```

這就是我說的「中間層」：資訊量剛好、可以一眼掃過、也能直接做決策。

而 agentic engineering 其實就是在各個地方補這層：

- runtime 的設計
- tool 的 schema/contract
- UI 的呈現
- 操作者自己的流程

## 3) 模型能力開始跟 tool contract 綁死

長任務的模型如果沒有 tool contracts，本質上就是一個很自信的實習生。

工具沒有嚴格 schema、讀寫沒有版本化、request/response 沒有驗證、結果不能 replay —— 你就不是在做「agents」，你是在做「不可控的自動化」。

然後它一碰到真實 repo、甚至碰到 production，你就會想起那句很無聊但很真實的話：

> 可靠性大部分來自很 boring 的紀律。

pin 版本、記錄識別符、可重現、合約穩定 —— 這些才是 agent 能活下去的地基。

## 4) 我對 GLM-5 的老實看法

我不會因為一篇 launch post 就說它強或弱。我沒跑過 benchmark，我也不太信行銷稿。

但我覺得它「作為訊號」很有價值：

- 會有更多團隊做 agent 產品
- 會有更多團隊撞上「我看不到它做了什麼」這面牆
- 會有更多人發現：agent 的 UX 其實是 safety model 的一部分

如果你正在做這件事，我的建議很 boring（而且我故意讓它 boring）：

- 不要把 identifiers 藏起來
- 不要把「降低噪音」誤解成「降低資訊」
- 把每一次 tool call 當成小型 API：schema、版本、audit

demo 會不會魔法，靠模型。

系統能不能活，靠你。

---

**References:**
- [GLM-5 發布文：From Vibe Coding to Agentic Engineering](https://z.ai/blog/glm-5)
- [GitHub issue：希望 Claude Code 在折疊視圖直接顯示 READ 檔案路徑](https://github.com/anthropics/claude-code/issues/21151)
- [文章：Claude Code Is Being Dumbed Down（討論工具輸出被折疊後的可見性問題）](https://symmetrybreak.ing/blog/claude-code-is-being-dumbed-down/)
