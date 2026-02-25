---
layout: post
title: "把 AI 放進 Jira：Atlassian 想解的其實是『工作要有戶口』"
date: 2026-02-25 14:20:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![Jira 裡的人類與 AI agent](/img/posts/2026-02-25-jira-agents-mcp-01.webp)

現在的「AI agent」很常見的狀況是：

demo 很猛，實際落地很吵。

因為你最後一定會遇到那個很無聊、但最致命的問題：

**這些 agent 做的事，到底算不算『正式工作』？它住在哪裡？誰要負責？**

如果答案是「在某個人的聊天紀錄裡」，那你其實不是導入 workflow，你是在導入 vibe。

所以 Atlassian 這次推的 **agents in Jira（open beta）** 我覺得值得看。不是因為它最神，而是因為它直接挑戰最不性感的部分：

**把 agent 產出的東西，變成可追蹤、可審計、可負責的工作。**

## 1) 真正的痛點不是 agent 不夠強，是 agent 會『到處長』

很多公司導入 agent 的典型流程是這樣：

- 工程師/PM 在某個 AI 工具裡叫 agent 做事
- agent 給你一份計畫、摘要、或 patch
- 你把結果貼回 Jira（如果你記得的話）
- 一週後沒人知道那段內容怎麼來的、改過什麼、誰決定的

最後反而變成更多「工作以外的工作」：複製貼上、整理紀錄、補流程。

Atlassian 的想法其實很直白：

既然 Jira 本來就是你追 work 的地方，那 **agent 就應該在 Jira 裡面工作**。

## 2) 「agent 可以當 assignee」是一個很大的設計選擇

Atlassian 的公告裡，把 agents in Jira 拆成三個能力：

- agent 可以被指派 work item（像同事一樣）
- 你可以在留言裡 @mention agent，讓它在 context 裡反覆迭代
- 你可以把 agent 放進 workflow，讓它在狀態切換時自動介入

這聽起來只是 UI 改版，但其實它改的是「合約」。

agent 不再是你私下問的 chatbot，而是 Jira 的一個工作參與者：

- 有 ticket
- 有 assignee
- 有 timeline
- 有審計軌跡（audit trail）

對企業來說，這比「更聰明的 agent」重要。因為企業最怕的不是 agent 做錯，而是 **做錯了還找不到責任鏈**。

## 3) MCP 是 Atlassian 的關鍵棋：開放生態（順便把入口收回來）

這次新聞裡，我覺得最有策略價值的其實不是 agents in Jira，而是 Atlassian 對 **Model Context Protocol（MCP）** 的押注。

兩個重點：

- Jira 內可以用 **MCP-enabled 的第三方 agents**（不把你鎖死在單一 vendor）
- Atlassian 的 **Rovo MCP Server（remote MCP server）** 讓外部 AI 工具用 OAuth + 權限控管，安全地連 Jira / Confluence

更實際一點講：你可以繼續在你喜歡的地方用 AI（Claude、Cursor、VS Code…），但上下文可以從 Jira/Confluence 正規地拉進來。

這才是 enterprise 真的會買單的東西：

不是 agent 的人格，而是 **integration plane（整合平面）**。

## 4) 安全那段不是裝飾：tool 會放大爆炸半徑

用過 tool-using LLM 的人都懂：

- 有工具 → 能力上升
- 也代表出事的半徑變大

Atlassian 的 MCP server 文件裡甚至直接提 prompt injection、indirect prompt injection、tool poisoning 這些風險，這點我給尊重。

如果 agent 能幫你建 issue、改 Confluence、推動 workflow，那你的預設姿勢應該是：

- 最小權限（least privilege）
- 高影響操作要有人類確認
- audit log 要真的看（不是裝給稽核看的）

## 我的結論

我不覺得 agents in Jira 會讓每個團隊一夜 10x。

但我很同意它背後的那個「很無聊的真相」：

**AI 做的工作如果沒有被追蹤，最後會變成組織的技術債。**

Atlassian 做的事情很符合它的 DNA：

- 讓 agent 的工作可見
- 讓它可量化
- 讓它能被治理

不夠炫，但可能更能活過 enterprise 現實。

---

**References:**
- [Atlassian 公告：agents in Jira（open beta）](https://www.atlassian.com/blog/announcements/ai-agents-in-jira)
- [Stock Titan 轉載 Business Wire：agents in Jira + MCP 投資](https://www.stocktitan.net/news/TEAM/atlassian-introduces-agents-in-jira-to-drive-human-ai-collaboration-ym45ndbibxgq.html)
- [Atlassian 產品頁：Remote MCP server 概覽與 FAQ](https://www.atlassian.com/platform/remote-mcp-server)
- [Atlassian GitHub：Rovo MCP Server 文件與安全提醒](https://github.com/atlassian/atlassian-mcp-server)
- [TechCrunch 報導：Jira 讓人類與 AI agent 並肩工作](https://techcrunch.com/2026/02/25/jiras-latest-update-allows-ai-agents-and-humans-to-work-side-by-side/)
