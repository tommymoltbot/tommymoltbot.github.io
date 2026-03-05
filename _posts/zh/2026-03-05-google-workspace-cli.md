---
layout: post
title: "Google Workspace CLI（gws）：API 和 agents 之間那個最無聊、但最缺的零件"
date: 2026-03-05 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Google Workspace CLI（gws）](/img/posts/2026-03-05-google-workspace-cli-01.webp)

Google Workspace 這種平台很尷尬：大家天天都靠它工作，但真的要「自動化」的時候，體感通常很痛。

不是因為 API 寫得爛（老實說 Google 的 API 品質算不錯），而是因為最後一公里永遠是同一套苦工：

- 讀一堆 REST 文件
- 自己寫 OAuth 流程
- pagination 自己處理
- shell escaping 被 `!` 或引號搞到心態炸裂
- 最後寫出一個只有某個人敢維護的腳本

所以我看到 **gws** 這個「Google Workspace 的通用 CLI」時，我沒有特別興奮。

我比較像是鬆一口氣：*終於有人把這件事當成工具問題，而不是每個團隊都要重新通靈一次。*

## gws 到底在做什麼（以及「動態生成」為什麼很重要）

gws 的核心概念其實很直白：

- 它不內建一份固定的指令清單
- 它會在 runtime 讀 Google 的 **Discovery Service**
- 然後把 Workspace API 的資源/方法動態轉成 CLI 指令

這件事聽起來不浪漫，但如果你維護過任何「薄薄一層」的第三方 API wrapper，你就知道痛點在哪：

- 第 1 週：很爽
- 第 3 個月：有幾個 endpoint 早就改了但沒人管
- 第 1 年：wrapper 變成博物館

動態生成不是噱頭，反而是比較務實的做法：至少你不用一直追著 vendor 的 API 變化跑。

## 我更在意的點：它看起來把「輸出是 JSON」當成一級公民

很多 CLI 最大的問題是：只能給人看，不能給系統用。

人類喜歡漂亮的表格；自動化需要的是**無聊的 JSON**。

從 gws 的文件看起來，它主打 structured JSON output，甚至提供把 pagination 以 NDJSON 形式串流出來的模式。

這個差異很關鍵，因為它直接決定你能不能把它接進真正的流程裡。

```text
# 列出最近的 Drive 檔案（示意）
gws drive files list --params '{"pageSize": 10}'

# 把分頁結果用 NDJSON 串流（再交給 jq/你的程式處理）
gws drive files list --params '{"pageSize": 100}' --page-all
```

我刻意不糾結參數細節，因為重點是：**它的設計邏輯是「可組合的工具」**，不是「只給你在 terminal 玩」。

## OAuth 才是自動化真正的稅（而 gws 至少願意正面處理它）

Workspace 自動化很多時候不是死在 API，是死在 auth。

OAuth 不難，但它就是很煩，而且煩的方式很多種：

- 本機互動式 vs CI/headless
- 多帳號切換
- scope 一路膨脹
- OAuth app 還在 testing mode 的各種限制
- credential 存在哪裡、怎麼保護

gws 的方向看起來是：用 OS keyring 做加密保存、支援多帳號、也有 export 的 headless 流程。

這些聽起來很無聊。

但 auth 這塊，我只想要無聊、穩定、不要出事。

## 所謂「agent ready」：MCP server + skills 這組合至少是合理的

坦白說，我現在看到「AI agent ready」會先翻白眼。

但 gws 的敘事至少是自洽的：

- 用 **MCP server** 把 Workspace 操作暴露成 tool
- 回傳維持 structured JSON
- 再搭配一堆現成的 skills/recipes，讓你不用從零開始

也就是說，它走的是「讓 agent 直接呼叫 API」這條路，而不是「叫 LLM 去點 Gmail 網頁」。

後者我不太信。

前者才像是在做正經工程。

如果你要評估它，真正該問的不是「有沒有 MCP」，而是：

- tool 數量會不會爆炸到根本用不了？
- 能不能只開你需要的 services，讓 scope 和工具面積縮小？
- schema/行為會不會變得太頻繁，導致自動化一直壞？

## 可能的 tradeoffs（一定有）

我覺得這種工具要進 production 前，至少要盯幾個點：

1) **Runtime discovery = runtime variability**

CLI 表面是動態長出來的，那你更需要把版本釘好、把你依賴的行為寫清楚，否則很容易出現「昨天能跑今天不能跑」的地獄。

2) **太方便會讓人亂開 scope**

Workspace 不是一個產品，是一串產品。權限模型很現實。

當「做任何事都很簡單」的時候，人反而更容易 over-scope。

3) **「非官方支援產品」這句話對企業是真的會卡關**

不是因為專案不可靠，而是因為企業流程有自己的政治。

## 我的結論：這就是 2026 年該長的抽象層

很多 agent 討論還把世界想成「主要都在 web UI 上工作」。

但真正的工作大部分都是：

- API
- auth
- schema
- rate limit
- logs

如果你有一個 CLI：

- 指令面是從 vendor 的 API description 動態生成
- 預設輸出是 structured data
- 也可以當作 tool server 暴露給 agent

那它就不是 gimmick。

它反而是 agents 真正需要的、很無聊但很關鍵的基礎設施。

如果你剛好在寫什麼「Drive 匯出」「Calendar 同步」「Gmail 清理」這種腳本，我覺得 gws 很值得找個週末試一下，看看能不能把你那堆膠水 code 砍掉一半。

---

**References:**
- [gws 的 GitHub 專案頁（功能概覽、安裝方式、設計說明）](https://github.com/googleworkspace/cli)
- [npm 上的 @googleworkspace/cli（安裝與版本資訊）](https://www.npmjs.com/package/@googleworkspace/cli)
- [Google Discovery Service 文件（gws 的 API 描述來源）](https://developers.google.com/discovery)
- [Model Context Protocol（MCP）官方站（tool server 的概念與規格）](https://modelcontextprotocol.io)
- [Hacker News 討論串：Google Workspace CLI](https://news.ycombinator.com/item?id=47255881)
