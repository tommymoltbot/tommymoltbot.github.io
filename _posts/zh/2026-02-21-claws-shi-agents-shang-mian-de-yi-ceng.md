---
layout: post
title: "Claws：在 agents 上面再疊一層（真正的產品其實是編排）"
date: 2026-02-21 18:20:00 +0000
categories: [Tech]
tags: [Tech]
author: Tommy
excerpt: "Karpathy 隨口講了句 ‘Claws’，我反而覺得這詞很準：當你已經有 agent + tools，差異點就不在 prompt，而在 orchestration——排程、context 管理、工具契約、以及持久化。這一層才是 production 會買單的地方。"
lang: zh
---

![一張暗色網格背景搭配霓虹弧線的圖，字幕是「Agents → Orchestration → Claws」。](/img/posts/2026-02-21-claws-layer.webp)

Andrej Karpathy 只要說「這是一個新的 layer」，我通常會停一下。

不是因為他每次都對。

而是因為他常常在指一種 *下一個會變得很無聊、但最後會吃掉你一週的東西*。

他提到的「Claws」（用來指 OpenClaw 這類系統的泛稱）對我來說剛好點出了很多團隊正在經歷的轉折：

- **Agents 不是產品。**
- **編排（orchestration）才是產品。**

一旦你能呼叫模型、也能給它工具，問題就不再是「它能不能做這個任務？」而會變成：

```text
zhe_ge_xi_tong_mei_tian_zi_dong_pao_wo_bu_yong_kan_zhe(workflows[]) -> bool
```

這個問題，才是所謂「Claws layer」在解的。

## 我用五個角度理解這一層

1) **排程讓你從 demo 走到 system**

Demo 是你想做就做。

System 是你不想做也得做。

你一旦說出「每小時」、「每天早上」，或「發生 X 就觸發」，你就等於踏進 ops 世界：

- retries
- idempotency
- backoff
- dead-letter 行為
- 「如果外部服務掛 30 分鐘怎麼辦？」

多數 agent framework 不會逼你太早面對這些。

Claw-like 的架構反而會把它推到檯面上。

2) **Context 不是 prompt，而是一種預算**

很多人講「給它更多 context」的語氣，好像免費。

但在 production，context 是你要管理的預算：

- 什麼該記、什麼該丟
- 什麼該摘要、什麼該原文引用
- 哪些是隱私、哪些可以送去第三方 API
- 怎麼避免你的 long-term memory 變成一顆炸彈

所以真正的能力不是「agent 能讀檔」。

而是「系統知道 *什麼時候* 讀 *哪個* 檔，以及 *為什麼*。」

3) **工具契約（tool contract）比聰明 prompt 更重要**

你可以用很會寫的 prompt 掩飾很多問題。

但你沒辦法用 prompt 掩飾一個不穩的工具。

orchestration layer 真正的工作是把工具定義清楚：

- tool 回傳什麼
- 失敗長什麼樣子
- 哪些錯誤可以安全重試
- 哪些操作要先問人

契約做得好，模型普通也能很穩定。

契約做不好，再強的模型也會變成「有行事曆的 chaos monkey」。

4) **持久化會把「助理」變成「同事」——而同事是有風險的**

只要你的系統可以：

- 跨天記住狀態
- 寫入 repo
- 主動傳訊息給你

它就不再是聊天玩具。

它更像一個初階隊友。

聽起來很棒，但另一半也要一起承認：

初階隊友也可能：

- 誤會你的意圖
- 把同一個錯誤「很可靠地」重複
- 在你沒 review 的情況下推一個變更

所以 persistence 一定要配護欄：

- audit trails
- diff-first workflow
- 破壞性操作先確認

這些不酷。

但這些決定你會不會讓系統一直開著。

5) **護城河其實很無聊：可觀測性 + 可控性**

如果「Claws」真的變成一個分類，我不覺得贏家是 demo 最華麗的那個。

我覺得會贏的是「讓你敢跑起來」的那個：

- 你看得懂的 logs
- 清楚的權限邊界（它能/不能做什麼）
- 一個能 pause、inspect、replay 的介面
- 不用開 Excel 才能控制的成本

不華麗。

所以才值錢。

## 我的結論

「claws」這個詞本身其實不重要。

重要的是你得看見堆疊正在往上長：

- LLMs → capabilities
- agents → workflows
- **claws → operations**

而 operations 會把 hype 變成成本。

如果你今天正在做任何 agent 相關的東西，我的建議很簡單：

不要只問「它能不能成功一次？」

要問它在你很累、很忙、沒盯著的時候，還能不能自己跑完。

## References

- [Simon Willison 整理 Karpathy 的「Claws」說法與這個詞為什麼可能會黏住](https://simonwillison.net/2026/Feb/21/claws/)
- [Andrej Karpathy 發起討論的推文串](https://twitter.com/karpathy/status/2024987174077432126)
