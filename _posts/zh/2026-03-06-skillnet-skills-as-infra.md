---
layout: post
title: "SkillNet 讓我更確定一件事：AI Agent 不缺 demo，缺的是『技能供應鏈』"
date: 2026-03-06 08:20:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![SkillNet 論文首頁示意圖（技能圖譜 / 技能網路概念）](/img/posts/2026-03-06-skillnet-skills-as-infra-01.webp)

我每次看到新的 AI Agent demo，都會有一種很矛盾的感覺：

- 模型真的變強了。
- 但整個專案還是很像用膠帶黏起來的。

這週是 web-shopping agent。
下週是行事曆 agent。
再下週是「幫我報稅」agent。

然後大部分都藏著同一個現實問題：**它們沒有像工程團隊那樣累積能力。**
它們是在「重新發明」能力。
一次又一次。

最近 arXiv 上有篇 paper：*SkillNet: Create, Evaluate, and Connect AI Skills*，大概就是想補這個洞：把「技能（skill）」當成一級公民，做成可被建立、被評估、被串接的資產（而且評估維度還包括 safety / completeness / executability / maintainability / cost‑awareness）。

我不確定 SkillNet 會不會成為標準答案。
但它盯著的問題，我覺得很對。

## 我在意的五個角度

### 1) 「重複造輪子」不是小瑕疵，是一堵經濟牆
如果每個 agent 專案都得重做：
- 登入流程
- 購物車結帳
- API 分頁
- retry/backoff
- captcha/2FA 的 fallback
- 一些基本的 tool 使用套路

那 agent 永遠會是：demo 很神，production 很痛。

工程世界早就知道怎麼避免這件事：
- 共用 library
- runbook
- coding convention
- 讓踩過的坑能「留下來」的地方

Skill repo 其實就是把「內部平台（platform）」思維搬到 agent 行為上。

### 2) Skill 的品質不只是「能不能跑」，而是「能不能一直跑」
我滿喜歡 SkillNet 把評估寫得比較務實。
因為在現實系統裡，一個 skill 要真的有用，必須能扛住：

- UI 改版
- API 版本更新
- 網路抖動
- rate limit
- 部分失敗（partial failure）

Maintainability 跟 cost-awareness 聽起來很無聊，但它就是把差距拉開的那條線：
- 「哇靠跑一次成功了」
- vs
- 「凌晨三點沒人盯著也敢放它跑」

### 3) Ontology 很煩…直到你想在自己的技能垃圾堆裡找東西
工程師通常不愛分類學。
但你只要遇過這種問題一次，就會懂：

> 「我們是不是已經有一個技能，可以穩定解析 invoice，還要支援 EU 格式？」

沒有共通 schema 的技能，最後看起來都像 random snippet：

```text
run_tool("extract_invoice", file) -> json
```

然後你要把它跟別的東西組起來，就開始進入拼命 debug 的地獄。

「connect skills」這件事重要的點在於：composition 才是 agent 變成系統的地方。
不然就只是更大型的黏膠碼（glue code）。

### 4) 真正缺的其實是：技能供應鏈（CI、測試、溯源）
如果 skill 是資產，那你需要一整套軟體世界已經被打過一次的東西：

- versioning
- regression test
- CI gate
- provenance（這技能從哪來？）
- security review（它會碰到哪些東西？）

如果有一天 agent 可以像裝 plugin 一樣裝第三方 skill，那你其實是在跑一個 package ecosystem。
而 package ecosystem…真的很硬。

所以我比較不在乎「20 萬個 skill」這種數字。
我在乎的是：
- 有多少是真的可執行
- 壞掉時的 failure mode 是什麼
- 評估成本能不能低到做到持續驗證

### 5) 目標應該是：不要再把 agent 行為當成一次性的 prompt
我現在越來越覺得：

- prompt 是 UI
- tool 是 API
- **skill 是缺的中介層（middle layer）**

skill 這層用來寫清楚：
- 什麼時候呼叫什麼
- 怎麼 recover
- 世界跟你假設不一樣時該怎麼處理

如果我們不把這層做起來，agent 就會一直卡在這個循環：
- 亮眼 demo
- 脆弱崩壞
- 重寫

老實說，這通常不是模型問題。
這是工程紀律問題。

---

**參考資料：**
- [SkillNet arXiv 論文頁（Create, Evaluate, and Connect AI Skills）](https://arxiv.org/abs/2603.04448)
- [SkillNet 專案首頁（論文中提供的連結）](http://skillnet.openkg.cn/)
