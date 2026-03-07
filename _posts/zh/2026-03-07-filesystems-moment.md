---
layout: post
title: "檔案系統又紅了（而且是 AI Agents 把它炒起來的）"
date: 2026-03-07 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Agents 和檔案系統](/img/posts/2026-03-07-filesystems-moment-01.webp)

老實說我沒想過 2026 會有人認真在討論「檔案」。

不是在討論 database，不是在討論 vector index，也不是在吵某個 agent framework。

就是那個你每天都在用、但從來不想寫文章稱讚它的東西：filesystem。

但如果你有真的把 coding agent 用在「會改 repo 的工作」上（CLI、IDE 內建 agent loop、任何能碰到你的專案的那種），你會發現一件事：

**能讀寫檔案的 agent 比較像同事。只能聊天的 agent 比較像金魚。**

### Context window 不是記憶（比較像白板）

很多 agent 的不可靠，其實很無聊：

- 20 分鐘前講好的規則，它忘了
- 真正重要的限制條件，它看不到
- 沒有持久狀態，只能一直重推導

Context window 充其量是一個臨時的 scratchpad。好用，但脆。

檔案剛好相反：慢、土、但永遠在那。

只要 agent 能把決策寫進檔案裡，它就不再只是「聊天很厲害」，而是開始變成「流程真的能跑」。

### Filesystem 其實就是最通用的 interface

我滿喜歡 LlamaIndex 的說法：與其丟給 agent 100 個工具，不如給它 filesystem，再配上少量 primitive。

實務上通常就是：

- 列檔、搜尋
- 讀某段內容
- 編輯檔案
- 跑 command / tests
- 寫一份短的 “memory” 檔

其實這樣就夠做很多事了。

而且它很好 audit：我直接看 diff 就知道它到底改了什麼。

### 很多人忽略的點：instruction files 也是產品設計

現在大家都在寫各種版本的：

```text
AGENTS.md / CLAUDE.md / .cursorrules / copilot-instructions.md
```

最常見的失敗是把它寫成 onboarding 文件，越寫越長。

但 ETH Zürich 最近有篇 paper 的結果很刺：repo-level 的 context files 常常會 **降低** 任務成功率，還會提高成本。原因也不玄：額外要求會讓 agent 更愛亂逛、更愛多跑測試、更容易拖著拖著就偏題。

所以重點不是「寫更多」，而是「寫更少、更尖銳的約束」。

我自己覺得比較好的方向是：把 context file 寫得像 safety checklist，而不是 wiki。

例如：

```text
AGENTS.md

- Commit 前跑 unit tests。
- 盡量改最小的 surface area。
- 不確定就問，不要硬猜。
```

這種檔案不會試圖教 agent 你的全部架構，但它能有效減少那種最蠢的翻車。

### 「File format is the API」這句話其實很關鍵

Dan Abramov 那篇文章有一句我覺得很準：file format 讓軟體可以互通，而且不需要彼此認識。只要兩個工具懂同一種檔案，它們就可以協作，不需要簽 API 合作、不需要上 marketplace。

這也是為什麼「skills-as-folders」跟 Agent Skills 這種標準開始變有趣。

它不只是 instruction。

它是可攜性：

- 可以放進 git
- 可 review
- 可組合
- 換不同 agent 產品也能沿用

你如果曾經做過「內部 prompt library」最後死在 Notion…你懂我在說什麼。

### Database 還是很重要（但越來越像底層 substrate）

我完全不覺得「files 會取代 database」。

只要你想要 concurrency、ranking、dedup、recency weighting、或大規模 semantic search，你最後都會做 index。做著做著就變成 database，只是你不想承認而已。

比較合理的拆法是：

- **Filesystem**：人跟 agent 都能用的通用介面
- **Database/index**：底下的實作細節

### 我的結論

Agents 反而把 personal computing 變得更像 personal。

不一定是因為什麼都要 local 跑，而是因為 **你的狀態**（偏好、限制、技能、長期筆記）可以放在你擁有的檔案裡。你就有選擇權：換工具不會失憶、出事可以 audit、AI 協作不再像某個 SaaS 功能，而比較像你工作環境的一部分。

這其實才像電腦原本該長的樣子（在一切都被塞進 walled garden 之前）。

---

**References:**
- [原文：Filesystems are having a moment（為什麼大家又開始談檔案系統）](https://madalitso.me/notes/why-everyone-is-talking-about-filesystems/)
- [LlamaIndex：Files for AI Agents（檔案作為 agent 的核心介面）](https://www.llamaindex.ai/blog/files-are-all-you-need)
- [LangChain：How agents can use filesystems for context engineering](https://blog.langchain.com/how-agents-can-use-filesystems-for-context-engineering/)
- [Dan Abramov：A Social Filesystem（file format 是互通層）](https://overreacted.io/a-social-filesystem/)
- [ETH Zürich：Evaluating AGENTS.md（context files 什麼時候會幫倒忙）](https://arxiv.org/abs/2602.11988)
- [Agent Skills：skills-as-folders 的標準與概念總覽](https://agentskills.io/home)
