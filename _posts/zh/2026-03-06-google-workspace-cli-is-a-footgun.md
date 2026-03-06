---
layout: post
title: "Google Workspace CLI 這種『agent 管線』我很想要……但它也很可能讓你一週都在收拾爛攤子"
date: 2026-03-06 22:15:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Ars Technica 報導使用的主視覺：Google Workspace icons 截圖](/img/posts/2026-03-06-google-workspace-cli-01.webp)

我對 command line 一直有一種偏心。
不是因為它很「駭客」。
而是因為在 UI 跟 SaaS 後台一直變形的世界裡，CLI 算是少數 **比較可預期的介面**。

所以當我看到 Google 推出 *Google Workspace CLI*（可以打 Gmail / Drive / Calendar，而且還很明確地把它定位成「人跟 AI agents 都可以用」），我第一個反應是：

> 終於啊。agent 自動化需要的那種 boring 介面。

第二個反應也很快出現：

> 好喔。又多了一種可以不小心把自己公司搞爆的方式。

這類工具會讓「agentic workflow」變得更像真的。
但同時，它也會把一個小錯誤，放大成一個很貴的事故。

## 我在乎的五個角度

### 1) CLI 其實就是我們一直假裝存在的「穩定 API」
現實世界的 Workspace 自動化很多最後會變成：
- 零散的 scripts
- 半死不活的 OAuth 流程
- 或是「去 Admin console 點這個按鈕」的 runbook

CLI 不太一樣。
CLI 逼你把事情講清楚。

當 agent 可以跑這種指令：

```text
workspace-cli gmail messages list --query "from:billing" --json
```

它不是在猜 UI 哪個 tab 又搬家了。
它是在用一個你可以 version‑control、寫測試、做稽核的介面。

這就是 **boring engineering**。
也正因為 boring，才比較能用。

### 2) 結構化的 JSON 輸出，才是「可落地 agent」的安靜關鍵
我不太會被「AI 會打指令」打動。
我比較在乎的是：你有沒有給它 **乾淨的契約**。

如果工具穩定輸出結構化結果，你才能寫出正常的 loop：

```text
run(cmd) -> { stdout_json, stderr_text, exit_code }
```

有了這個，你才可以做：
- 驗證（schema checks）
- diff（到底改了什麼）
- retries（針對可重試、可冪等的動作）
- guardrails（例如只有符合某些條件才允許建立事件）

沒有 JSON，你就會回到「regex 解析 vibe」那條路。
老實說我有點累了。

### 3) 「不是官方支援產品」不是法律文案而已
讓我停一下的是那句 disclaimer：這是 Google 的 GitHub 專案，但不是 officially supported product。

翻成工程語言就是：
- 旗標可能會改
- 輸出格式可能會漂
- 行為可能會變
- 你的 automation 很快變成一小堆玻璃碎片

Agent 系統本來熵就夠高了。
如果工具層也不穩，你的週末大概會被各種莫名 breakage 吃掉，而且還不是你造成的。

### 4) Workspace + agents：權限才是你真正的產品
大家都愛聊「agent 能做什麼」。
但更該問的是：

> 它到底能碰到哪些東西？你要怎麼證明它沒有多碰？

如果你的 agent 可以寄信、改 Drive 檔、建行事曆事件，你其實是在部署一個機器人員工。
那就需要那些 boring 的控制：
- 最小權限（least‑privilege scopes）
- 把 automation 跟真人帳號切開（獨立 service account）
- 敏感動作要有審核流程
- 稽核 log 不是「有就好」，而是你真的會看

不然出事不是「會議標題打錯」那種小尷尬。
而是「把含有客戶個資的草稿寄給全公司」這種級別。

### 5) 最好的 agent feature 其實是「dry run」
如果我要把這類工具放進 production workflow，我最想要的模式是：

```text
plan(actions) -> { diff, estimated_impact }
apply(plan) -> { result }
```

不是因為它很高級。
而是因為它能救命。

Agent 的權限是要「賺」來的。
而「先讓我看你要做什麼」是我目前知道最便宜、而且可擴展的安全門檻。

## 我的結論
我喜歡這個方向。
一個能講 Workspace、又能吐出結構化輸出的 CLI，確實是 agent 系統一直缺的管線。

但我也想把話講白：

- 工具越好用
- 就越需要更 boring 的工程紀律

因為當「自動化」變成「用你的真網域去寄真正的 email」，你犯蠢的成本就不再是理論。

---

**References:**
- [Ars Technica 報導：Google Workspace CLI 為什麼要做給 AI agents 用](https://arstechnica.com/ai/2026/03/googles-new-command-line-tool-can-plug-openclaw-into-your-workspace-data/)
- [Google Workspace CLI 的 GitHub 專案（文件與原始碼）](https://github.com/googleworkspace/cli)
- [Addy Osmani 提到 JSON 輸出與內建 agent skills（X 上的貼文）](https://x.com/addyosmani/status/2029372736267805081)
