---
layout: post
title: "Pi：一個不想當你 IDE 的 terminal coding harness"
date: 2026-02-25 06:12:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Pi 的互動式終端介面截圖](/img/posts/2026-02-25-pi-terminal-harness-01.webp)

我在 Hacker News 看到 **Pi** 的時候，第一眼其實是被它那句話打到：*「a minimal terminal coding harness」*。

它沒有說自己是「下一代 IDE」，也沒有說自己是「超強 agent framework」，更沒有那種「AI 會把工程師淘汰」的空話。

它就說：我是一個 harness。

老實說，這種自我定位我反而比較信。

因為我已經看太多 AI coding 工具，表面上在幫你寫 code，實際上是在逼你接受它的工作流：計畫模式、子代理、待辦清單、權限彈窗、記憶體、各種整合……你最後花最多時間的不是寫程式，是在跟工具的「想法」拉扯。

Pi 的態度更像：*我先把核心做小做乾淨，剩下你自己長出來。*

## 我用五個角度檢查它到底是不是噱頭

1) **它到底在解什麼問題？** 我們缺的是另一個 agent，還是缺一個能把 agent「關進可控環境」的 harness？

2) **底層在哪？** 如果核心極簡，那些工作流行為（例如 guardrails、context policy、compaction）到底放哪？能不能版本控管？

3) **對話可以分支**到底有沒有用？還是只是 UI 玩具？

4) **安全責任**怎麼切？「不做 permission popups」是務實，還是把風險丟回使用者？

5) **以工程師偏見來說**：如果我不能解釋它為什麼這樣做，我就不會把它放進 production 流程。

## Pi 看起來是什麼

就我讀文件的理解，Pi 是一個 terminal UI + CLI。

它不是要假裝自己是「懂一切的神」，比較像：
- 給 LLM 一組明確的工具（`read` / `write` / `edit` / `bash`）
- 然後你可以用 TypeScript 擴充整個體驗（extensions / skills / prompt templates / themes）

安裝方式也很直白：

```text
npm install -g @mariozechner/pi-coding-agent
```

這種東西看起來很無聊，但我覺得無聊反而是優點：它沒有在賣夢。

## 我最喜歡的點：它用「原語」而不是「功能清單」在思考

Pi 的哲學很硬：
- 沒有內建 **sub-agents**（你要就自己用 tmux 跑多個 instance，或寫 extension）
- 沒有內建 **plan mode**（你要就把 plan 寫到檔案裡，或寫 extension）
- 沒有內建 **MCP**（你真的要就自己加）

很多工具把這叫「缺功能」。但我越來越覺得，在 AI coding 這個領域，「內建功能」常常等於「內建限制」。

真正重要的是：你能不能把限制放在對的地方？
- **專案規則**應該在 repo 裡、可審核、可 version。
- **權限與執行邊界**應該靠環境隔離（container/sandbox），或你自己能控制的 gate。
- **context policy**應該是可以看得懂、改得動的 code，不是黑箱。

Pi 如果真的讓你做到這些，我會願意多看它一眼。

## Tree-structured sessions：這個點其實超務實

Pi 的 sessions 是樹狀的：你可以跳回任意歷史節點，從那裡分支繼續。

聽起來像 UI 玩具，但你只要真的用過 LLM 寫 code 就會懂：
- 你試了一個重構
- 半成功半失敗
- 你發現前面假設錯了
- 你想回到「假設還沒錯的那一刻」重新走一條路

多數工具只給你線性的 chat log。最後你不是在 debug code，是在 debug 自己的對話歷史。

樹狀 session 至少給你一個比較像工程的 mental model：**對話也可以像 git 一樣分支。**

## 它的「context engineering」比較像真的工程，而不是 cosplay

我平常超討厭「context engineering」這四個字，因為很多時候只是把 prompt 寫更長。

但 Pi 這套（AGENTS.md / SYSTEM.md、compaction、技能按需載入）至少比較接近我認知裡的工程：
- 你可以把專案規則放在 `AGENTS.md`
- 你可以用 `SYSTEM.md` 替換或追加系統提示
- context 快爆的時候可以 compaction，而且行為還能客製

這不是炫技，這是你要讓 agent 長時間跟著 repo 走、還不亂寫的前提。

## 我比較疑慮的點：「不做 permission popups」

Pi 的說法是：不要做權限彈窗（很多是 security theater），你要安全就跑 container，或自己寫確認流程。

我理解這個立場。

但「跑 container」不是功能，是負擔。尤其你如果真的在一個有 secrets、有私有 repo、有 production credential 的環境裡玩這些東西。

你最後還是會需要某種 guardrails：
- protected paths
- 指令 allowlist
- 寫入要人工核准的 gate

Pi 看起來是把這些放在 extension 去做。邏輯上是通的。

只是你要很誠實地說：**Pi 不是預設就安全，你要自己把它變安全。**

## 我覺得 Pi 的定位很清楚

如果你想要一個「開箱即用、工作流包好」的工具，Pi 可能不是那個答案。

但如果你想要的是一個比較像「LLM coding runtime」的東西——UI、session 格式、prompt surface、guardrails 都是你可以理解、審核、改掉的——Pi 其實滿有意思。

我不敢說它一定會成為主流。

但在 2026，「工具願意誠實說自己是什麼」這件事，就已經算稀有了。

---

**References:**
- [Pi 官方首頁與功能概覽](https://pi.dev)
- [Pi coding agent 文件與原始碼（安裝、模式、sessions、客製化）](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)
- [Pi 互動式介面截圖（上游圖片來源）](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/images/interactive-mode.png)
- [作者文章：為什麼可能不需要 MCP](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)
- [作者文章：Pi coding agent 的設計理由](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
