---
layout: post
title: "Context Mode：MCP 的『另一半』上下文問題（不是 prompt，是工具輸出）"
date: 2026-02-25 07:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Context Mode MCP output compression](/img/posts/2026-02-25-context-mode-mcp-01.webp)

最近大家很愛聊「context window 變大」，但我自己在做 agent / coding assistant 的時候，真正把 session 搞死的通常不是 prompt，而是**工具輸出（tool outputs）**。

你只要用過 MCP 類的工具就懂這種痛：
- 跑一次 Playwright snapshot
- 列一下 GitHub issue
- 貼一段 log

然後你的「200K context」瞬間變得像一個塞滿雜物的小背包。

Context Mode（Show HN 的專案）有意思的地方在於，它解的不是「記憶不夠」，而是另一個更務實的問題：**不要把原始輸出硬塞進模型上下文**。

## 核心想法：把 raw data 留在沙盒，不要進對話
它的做法大概是：

- 在 agent 和 noisy tools 中間加一層 MCP server
- 重的處理在 sandbox 裡跑
- 回到模型的只是一點點 summary / snippet
- 原始輸出則用 SQLite FTS5 建索引，之後再查

他們宣稱有些場景可以把「幾十 KB」壓到「幾百 bytes」，整個 session 從半小時慢掉，變成可以撐好幾小時。

## 為什麼我覺得這方向很像 production
### 1) Context 不只是「記憶」，也是頻寬
很多人把 context window 當 RAM 在講。
但實務上它也像頻寬：你每分鐘能把多少「跟下一步決策有關」的 token 穿過模型。

raw tool output 基本上是最差的頻寬使用方式，因為你貼進去的當下，多半 90% 都用不到。

### 2) 逼你回到 retrieval-first 的正確姿勢
「先存起來、需要時再查」其實就是我們想要 tool-augmented agent 的樣子：

- 全部資料都保留
- 每一步只取回當下需要的那一小段

### 3) 也會引入新的 bug（這件事不能裝沒看到）
這不是免費午餐。

只要你開始 summarize 工具輸出，就一定會冒出新問題：
- summary 漏掉關鍵一行
- agent 過度相信 summary
- debug 變成「沙盒看到什麼 vs 模型看到什麼」

所以如果要用這類東西，我會把它當工程系統看，流程應該很清楚：

```text
raw_output -> index -> query -> snippet -> model
```

每一段都要有可觀測性（不然你被 on-call 叫起來會很痛）。

## 我自己的看法
如果你是真的在做 agentic workflow（跑測試、看 logs、抓頁面快照、掃 repo），只靠「買更大的 context」其實有點偷懶。

更好的答案是：**不要餵模型垃圾**。

Context Mode 這個專案不一定會以原樣成為標準解法，但我滿確定這種「工具輸出先留在外面、需要時檢索」的模式會越來越常見。

---

**References:**
- [Context Mode 的 GitHub 專案（把 MCP 工具輸出壓縮、索引、再檢索）](https://github.com/mksglu/claude-context-mode)
- [Show HN 貼文：Context Mode 的動機與 benchmark](https://news.ycombinator.com/item?id=47148025)
