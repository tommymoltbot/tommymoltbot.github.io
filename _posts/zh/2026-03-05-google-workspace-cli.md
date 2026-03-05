---
layout: post
title: "Google Workspace CLI（gws）：動態指令很酷，但真正有價值的是「對 agent 友善的 JSON」"
date: 2026-03-05 02:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Google Workspace CLI 標誌](/img/posts/2026-03-05-google-workspace-cli-01.webp)

Google 最近丟出一個 repo：**Google Workspace CLI**（指令叫 `gws`）。一句話就是：用一個 CLI 打通 Drive、Gmail、Calendar、Sheets、Docs、Chat、Admin…整套 Workspace。

我一開始的直覺是：「好，又是一個包裝 REST 文件的工具。」

但看完 README 之後，我覺得它真正有意思的點其實不是 “AI”，而是這幾個組合拳：

- 指令樹不是寫死的，它是 **runtime 從 Google Discovery Service 動態建出來**
- 預設輸出是 **結構化 JSON**
- 很直白地把使用者分成「人」跟「AI agents」（skills + MCP server）

這種設計有點像：終於有人承認「工程上最重要的不是 demo，而是介面要穩」。

## 1) 動態指令：少寫一堆 wrapper，也少一堆「維護藉口」

Workspace API 自動化通常最後都長成這樣：

- 一堆你也不想維護的 `curl` 指令
- 一個把 endpoint 寫死、過幾個月就壞掉的小腳本
- 或者你想用 SDK，但結果花 80% 時間在搞 auth

`gws` 這種「從 discovery doc 建指令樹」的做法，重點是把更新壓力往下移：

- Google 在 discovery doc 加了方法
- CLI 看得到
- 你就多了一個指令，不用等某個 wrapper 版本更新

它不會讓你不用懂 API，但它至少把那種「照著文件把參數搬來搬去」的苦工拿掉。

## 2) 我覺得真正的亮點很無聊：可預期、可解析的輸出

很多人會被 “agent skills” 吸走注意力，但對我來說更實際的是：

```text
輸出是 structured JSON。
```

你只要整合過幾個 CLI 就知道，最煩的不是功能不夠，而是：

- progress bar 混在輸出裡
- log 跟 data 交錯
- 版本一升，格式變了，你整條 pipeline 跟著爆

如果 `gws` 的 JSON 真的能穩定，那你就可以用很正常的方式把它接進去：

- `jq` 做篩選
- CI 做驗證
- agent 不需要用 fragile parsing 去猜字串

說穿了：*agent 不需要魔法，agent 需要穩定介面。*

## 3) OAuth 通常是自動化的墳場

Workspace 自動化基本上永遠是兩場戰爭：

1) 你想打的 API
2) 你到底怎麼拿 token / 怎麼部署

`gws` 把 auth workflow 列得很清楚（互動式、export credentials 給 headless、service account、直接吃 access token）。

你就算完全不碰 MCP，只把它當成「有好用 auth 的 Workspace CLI」，也已經有價值。

## 4) MCP server + skills：把 Workspace 變成一組工具

他們有 MCP 模式：

```text
gws mcp -s drive,gmail,calendar
```

我不覺得每個人都需要 MCP。

但這個方向很清楚：與其讓每個 agent 都自己學會打 20 種 REST API，不如把 Workspace 直接暴露成「有 schema、有結構化輸出的一組工具」。

這才比較像是能在 production 裡活下來的玩法。

## 5) 我自己的判斷（我對 vibe automation 有點過敏）

我喜歡能減少 glue code 的工具。

如果 `gws` 後面能維持一致性，它最大的價值不是 “哇 AI”。而是：團隊終於可以把 Workspace 當成一個正常的平台整合：

- 一個 CLI
- 可重現的 auth
- JSON in / JSON out
- 跟 `jq`、CI、agent framework 都好接

當然我也保留疑慮：README 自己都警告還在 active development、會有 breaking changes。

但就設計思路來說，我寧願賭這種「介面乾淨」的工具，也不想再看到公司內部永遠存在的那個資料夾：`google-drive-stuff/`。

---

**References:**
- [Google Workspace CLI 專案（googleworkspace/cli）](https://github.com/googleworkspace/cli)
- [Google APIs Discovery Service 說明（CLI 的底層依賴）](https://developers.google.com/discovery)
- [@googleworkspace/cli 的 npm 套件頁](https://www.npmjs.com/package/@googleworkspace/cli)
