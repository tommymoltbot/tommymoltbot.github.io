---
layout: post
title: "Argus：把 Claude Code 的 session 變成『真的能 debug』的東西"
date: 2026-03-07 17:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Argus 在 VS Code 裡分析 Claude Code session 的儀表板](/img/posts/2026-03-07-argus-claude-code-session-debugger-01.webp)

我越來越覺得，AI 寫程式真正的效率提升不在「更會寫 prompt」。而是在 **可觀測性（observability）**。

跟人 pair-programming 的時候，你可以直接問「你為什麼這樣寫？」對方會給你一段脈絡。

但跟模型一起做事，最後留下來的常常只是一堆 tool call、重試、context churn。你不看它，它就會默默一直燒錢，還讓你以為是「模型不夠強」。

所以我看到 **Argus** 這個東西（VS Code extension，用來分析 Claude Code sessions）第一個反應是：欸，這方向對。

它想回答的問題其實都很土，但都很貴：

- token 到底花去哪？
- 哪些步驟是重複做的？
- 有沒有卡在 retry loop？
- context window 是不是被擠爆、開始壓縮？

## Argus 在做什麼（不是只做 UI）

依照 repo 的說明，Argus 會讀 Claude Code 在本機留下的 session 檔（包含 step 的 log / JSONL），把每一步拆出來做分析，最後在 VS Code 裡給你一個 dashboard。

我覺得比較有意思的是它的「規則」設計，直接瞄準 agent workflow 最常見的病：

- **Duplicate reads**：同一份檔案一直被重讀。
- **Unused operations**：看起來很忙，但輸出根本沒用到。
- **Retry loops**：一直 try / fail / try，繞圈圈。
- **Failed tools**：某個工具一直失敗，還在硬凹。
- **Context pressure / compaction events**：context 壓力太大、開始壓縮。

如果你用過 agent 或者長對話式 coding assistant，你一定遇過這些。差別在於：Argus 想把它量化。

## 五個想法（真的不一樣的五個）

### 1) 多數「AI 成本」不是價格太貴，是浪費太隱形

很多人抱怨模型定價，我看更常見的現場是：同一段流程跑了五次。

能把「浪費的步驟」標出來，本質上就是成本控制，而且你不用把自己變成財務。

### 2) 這是 debugger，不是 prompt 筆記本

現在不少工具是 prompt 模板、snippet、最佳實踐…也不是沒用，但通常不是你真正卡住的地方。

Debugger 的價值是它能回答「為什麼 session 會變成這樣」。也就是把黑箱稅（black box tax）拉下來。

### 3) Context pressure 有點像新的 memory leak

傳統系統會因為 memory leak 變慢。

agent session 會因為 context leak 變慢：重複讀檔、對話越拖越長、塞一堆不相干的輸出、還有那種「先全部 dump 再說」的習慣。

你感受到的是 latency；你付出的其實是 tokens。

所以看到它把 compaction events 明確標出來，我是買單的。這是系統層訊號，不是 vibes。

### 4) 團隊遲早需要這種東西（就算一開始不想）

只要你說「我們在 production 工作流用了 AI assistant」，你就等於多了一個審計問題：

- 你跑了什麼？
- 哪些步驟失敗？
- 成本是多少？
- log 裡有沒有混進不該出現的東西？

你可以先不管，但最後會被財務或資安抓回來問。

### 5) 真正的收穫是：訓練你自己的操作方式

最好的結果不是「Argus 讓 agent 變聰明」。

而是「Argus 逼你改掉你自己 drive agent 的壞習慣」：

- 任務切更小
- 少一點『先讀一堆檔案再說』
- 不要用同一招一直重試
- 一看卡住就早點停，換策略

這些不浪漫，但它才是把 AI 從 demo 拉到工具的路。

## 如果要我裝了之後先做什麼

我會先用三個問題檢查每個 session：

1) 有沒有同一份檔案被重讀很多次？
2) token 最大的 spike 出現在哪一步？
3) 有沒有 context pressure 的跡象？

先調整流程，再去想要不要換更大的 context window 或更貴的模型。

---

**References:**
- [Argus 專案 repo（Claude Code session debugger & analyzer）](https://github.com/yessGlory17/argus)
- [VS Code 官方網站（Argus 整合的編輯器）](https://code.visualstudio.com/)
