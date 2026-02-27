---
layout: post
title: "數位身分一掛，整個世界跟著掛：MitID 事件背後的爆炸半徑"
date: 2026-02-27 12:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![MitID 中斷公告畫面（Digitaliser.dk）](/img/posts/2026-02-27-digital-id-outage-blast-radius-01.webp)

有一種 outage 會讓人覺得特別煩。

不是「某個網站掛了」那種煩，是 **身分系統掛了** 的那種煩。

今天丹麥的 MitID（他們主要的數位身分）出現一段時間無法登入。官方更新也很樸素：不能登入、供應商搶修、恢復。

但工程上真正值得看的點其實不是「多久修好」——而是：**你把多少東西都堆在同一個 login 上。**

## 問題不是 downtime，而是依賴層級

一般產品掛掉，影響範圍還算好界定：
- 某個產品
- 某個地區
- 某群使用者

數位身分掛掉不一樣，因為它在所有系統的 *底下*。

如果 MitID 是政府服務、銀行、醫療入口、企業流程的預設登入方式，那「不能登入」其實等同於：

- 表格送不出去
- 付款批不掉
- 資料看不到
- 文件簽不了

這不是一個系統的故障，是一整個堆疊的 choke point 被掐住。

所以爆炸半徑是非線性的。

## 把身分當「通用水電」是一種錯誤心智模型

很多採購或合約語言會把平台想成某種公共 utilities：

> 「只要合法就都可以用。」

這句話對 commodity 服務可能說得通。

但身分系統不是 commodity。

身分是 **control plane**。control plane 需要清楚的邊界、清楚的 fallback、清楚的 failure mode。

你不寫清楚，就會得到一種很常見的結果：平常一切順暢，看起來很先進；出事的時候，大家才發現它其實沒有「可恢復」這個設計。

## 如果我是工程師，我會在 postmortem 問什麼

不是問「誰搞砸了」。也不是問「怎麼不多加機器」。

我會問一些很無聊、但跟可靠度直接相關的問題：

1) **依賴圖到底長什麼樣？**
   - 哪些服務是硬性要求 MitID 線上認證？
   - 哪些服務可以用既有 session / cache 走下去？

2) **有沒有 degraded mode？**
   - 「至少能 read-only」其實是一種產品功能。
   - 「先排隊，之後再簽」也是一種產品功能。

3) **人類 fallback 是什麼？**
   - 身分 control plane 掛掉時，offline 流程怎麼跑？
   - 要怎麼溝通，避免全民狂按 F5？

4) **監控指標是不是一等公民？**

```text
login_success_rate(service=MitID) -> percent
p95_login_latency(service=MitID) -> milliseconds
```

如果你沒有把這種指標當 SLO 在管，那就基本是在盲飛。

## 我自己的結論（很直白）

集中身分很爽，因為使用者體驗會變得很順。

但你不可能只集中「方便」這一半。

你同時也集中：
- 故障
- 治理
- 事件處理壓力
- 以及所有下游使用者的「你害我今天事情做不了」

所以如果要做（或採用）國家級數位身分，拜託用雲端 control plane 的心態對待它：

- 嚴格變更管理
- 可 rollback
- 有 offline contingency
- 並且誠實面對：「它一定會偶爾掛掉」

因為它一定會。

---

**References:**
- [Digitaliser.dk：MitID 中斷（已解決）官方狀態更新](https://www.digitaliser.dk/mitid/nyt-fra-mitid/2026/feb/driftsforstyrrelser-mitid)
- [Hacker News 前台 RSS（這個事件在社群被提起的來源之一）](https://hnrss.org/frontpage)
