---
layout: post
title: "Codex ↔ Figma 用 MCP 串起來很香，但它會把 merge conflict 往上游推"
date: 2026-02-26 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Codex 與 Figma 串接的封面圖](/img/posts/2026-02-26-figma-codex-mcp-01.webp)

我覺得這次 Codex ↔ Figma 的整合是真的有份量。

不是因為「design to code」這句話多新（老實說我聽到都快免疫了），而是因為它看起來第一次把「來回」做得像是日常流程：
- 從 Figma 抽 design context 給 coding agent 用
- 再把跑起來的 UI 直接丟回 Figma 畫布，變成可編輯的 layer

如果一個團隊真的開始每天這樣跑，流程會變。

但我也很確定：它會順便製造一種你現在八成沒有工具處理的新問題。

五個想法。

## 想法一：重點不是 codegen，是「同一份上下文」

你只要真的做過把 Figma 落地成產品，就知道最痛的通常不是寫不出 UI，而是「看起來像、但不是同一套系統」。
例如：
- spacing token 差一點點但就是不對
- component 長得像，但 state/interaction 沒定清楚
- 最後你做出一個對著 screenshot 交差的版本，但 design system 被你悄悄掏空

MCP 這件事的價值在於：agent 不用猜，它能拿到結構化的設計上下文（layout、style、component、variable）。

你可以把它想成，agent 有機會穩定做到：

```text
get_design_context(figma_selection_url) -> {layout, styles, components, variables}
```

這樣你們吵的就不會是「像不像」，而會更接近「你到底想要什麼行為/語意」。

## 想法二：把「跑起來的 UI」丟回 Figma，會變成 diff 問題，不是生成問題

我最在意的是「把 live UI 變成 Figma layer」這段。

```text
generate_figma_design(live_url_or_localhost) -> figma_file_url
```

這很適合用來：
- 把真實流程拉回畫布，快速對齊
- 讓設計師在「已經是真的」的東西上評論
- 同時探索幾個版本，不用手動重畫

但只要你開始重複做這件事，你就會遇到一個核心問題：
你其實在做「兩種表示法之間的版本控制」。

「這個畫面」到底以誰為準？
- 以 code render 出來的為準？
- 以 canvas 上調整過的 layer 為準？
- 以 design system contract 為準？

如果沒有答案，團隊很快會被拉進一種很累的對齊地獄。

## 想法三：真正的 merge conflict 會發生在「spec」跟「implementation」之間

Git 的 merge conflict 雖然煩，但至少它很誠實：
你看得到衝突的 hunk，然後你做決定。

設計/程式碼來回之後，衝突會變得更軟、更危險：
- 設計師改了一個 component variant
- agent 重新生成 markup
- 但你的 codebase 裡有 local exception、feature flag、效能 tradeoff、歷史包袱

這時候如果你的工具無法回答：

```text
why_did_this_ui_change(hunk_or_layer) -> explanation + source
```

你就會得到一種大家最討厭的東西：神秘的 UI 漂移。
不是壞掉，但就是「怪怪的」。

## 想法四：你會需要 UI 決策的稽核軌跡（像 code 已經有的一樣）

工程世界裡，我們習慣這些東西：
- PR
- reviewer
- commit history
- rollback

設計變更常常沒有那麼細、那麼可追。

但當設計進入 agent loop 之後，缺乏稽核能力會直接變成生產力稅：
- 誰改的？
- 有意圖嗎？
- 是哪個 prompt 造成的？
- 能不能回滾，而且不要連帶弄壞另外三個頁面？

我賭下一個「真正」會讓這套流程變穩的能力，不是更強的生成。
而是更好的 diff、更好的 provenance（來源/原因）、更完整的 rollback 故事，橫跨 canvas ↔ code。

## 想法五：它不會取代設計師或工程師，但會逼大家更明確

「工程師可以視覺化迭代、設計師更貼近實作」這個我相信。

但反過來，你也會被迫把模糊的東西講清楚：
- design system contract 要更硬
- component state model 要更完整
- acceptance criteria 不能再靠 vibe

agent 會跑很快。
spec 只要是糊的，它就會很快地往錯的方向跑。

我偏樂觀，但我也很確定第一波團隊會用血淚學到：
round-trip 讓你更容易 build on the best ideas，也更容易在不小心之下把它們覆蓋掉。

---

**References:**
- [OpenAI 開發者文章：用 Codex + Figma 建前端 UI（MCP round-trip 的示範流程）](https://developers.openai.com/blog/building-frontend-uis-with-codex-and-figma)
- [Figma Help Center：Figma MCP server 指南（功能與連接方式）](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
- [TechCrunch 報導：Figma 與 OpenAI 合作把 Codex 支援整合進工作流](https://techcrunch.com/2026/02/26/figma-partners-with-openai-to-bake-in-support-for-codex/)
- [Figma 開發者文件：Figma MCP server 的 tools 與 prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)