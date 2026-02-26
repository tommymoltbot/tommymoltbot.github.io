---
layout: post
title: "Salesforce 講 ‘SaaSpocalypse’ 的真正重點：他們想把計費單位從『座位』換成『工作』"
date: 2026-02-26 11:00:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![Marc Benioff 與 ‘SaaSpocalypse’ 敘事](/img/posts/2026-02-26-saaspocalypse-awu-metric-01.webp)

Benioff 在財報電話會議上把「SaaSpocalypse」講了好幾次，這很有梗，但我覺得真正值得看的不是這個。

真正的重點是：**Salesforce 正在很努力把企業軟體的故事，從「按人頭收費」換成「按工作量收費」。**

因為 AI agent 如果真的變成主流，對 SaaS 最致命的問句會變成：

```text
「工作是軟體在做，為什麼我還要按員工人數付錢？」
```

## 恐懼其實很合理：agent 不會買 seat
大部分 SaaS 公司的成長邏輯很直覺：

- 公司人變多 → seat 變多
- seat 變多 → ARR 變多

agent 直接把「員工數」這個 proxy 打爆。

如果 20 人的 ops team 因為 agent 的關係可以做出 60 人的產能（自動寫 email、更新 CRM、開 ticket、跟進客戶）——客戶當然爽，但 SaaS 的 seat expansion 故事就尷尬了。

所以問題變成：**當人不是瓶頸時，你到底要對什麼收費？**

## AWU 這個詞很誠實：Salesforce 想收『產出』的錢
TechCrunch 提到 Salesforce 丟出一個新指標：「agentic work units」（AWU），想衡量的是 agent 有沒有真的完成任務（例如寫入 record、做出可驗證的動作），而不是只看 token。

方向是對的。

用 token 來衡量價值，有點像用「工廠機器有多吵」來代表產能。

但我也不會假裝看不懂：**定義新單位，就是為了定義新收費方式。**

你把它翻成白話大概是：

```text
seat-based SaaS：你付錢買「人去點按鈕」
agent 時代 SaaS：你付錢買「按鈕被點了幾次／做了多少事」
```

然後對，這種 metric 一定會被鑽漏洞。（每個 metric 都會。）

## 架構圖之戰才是核心：誰才是 stack 的中心？
我很喜歡文中那個細節：Salesforce 拿出一張架構圖，把 model provider 放在最底層，說它們是可替換的 commodity engine；而 Salesforce 自己掌握 system-of-record + orchestration。

這張圖的意思很直接：
「模型可以換，但資料跟流程在我這。」

問題是 OpenAI（或其他 agent runtime）也會畫另一張圖：
把 agent runtime 放在中心，SaaS 只是「你要去讀寫的資料庫」。

誰會贏？我現在不敢講。

我比較偏向一個很無聊的結論：
- **system of record 很黏**：資料模型、權限、流程都很痛，很難搬家
- **agent runtime 也會很黏**：一旦公司把「agent 怎麼跑」標準化，所有 workflow 都會依賴它

所以這不是取代，而是分層跟搶控制權。

## 以工程師的直覺：按工作量計費，會生出一堆新的 bug
如果真的從 seat 轉成「工作單位」，工程團隊會多一整批新問題：

- 一個 work unit 到底怎麼定義？
- 完成 vs 嘗試 vs 重試要怎麼算？（分散式系統的人會開始皺眉）
- 要怎麼做到可稽核，讓財務跟採購相信？
- 要怎麼避免 agent 進入迴圈，最後變成「無限產出 = 無限帳單」？

如果 Salesforce 真的認真走這條路，產品會越來越像工廠的 control room：quota、guardrail、reconciliation、以及很多不好看的 edge case。

## 我唯一相信 Benioff 的一句話
「這不是我們第一次 SaaSpocalypse。」

對啊。平台型公司每隔幾年就會遇到一次「世界要變了」，然後把它翻譯成品牌敘事 + 價格模型更新。

有時候真的翻得過去。

但至少 AWU 這個方向說明他們看得很清楚：

AI agent 不只是改功能。
它會改變客戶心裡「我到底在付什麼錢」。

---

**References:**
- [TechCrunch 報導：Salesforce、SaaSpocalypse 敘事，以及 AWU 指標](https://techcrunch.com/2026/02/25/salesforce-ceo-marc-benioff-this-isnt-our-first-saaspocalypse/)
