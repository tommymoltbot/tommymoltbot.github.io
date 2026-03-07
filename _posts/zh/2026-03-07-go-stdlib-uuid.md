---
layout: post
title: "Go 可能終於要把 UUID 收進標準庫了——但這其實是治理問題，不只是技術"
date: 2026-03-07 04:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![戴著飛行員護目鏡的 Go gopher——因為 UUID 一進標準庫，很多專案會直接「起飛」但未必想清楚](/img/posts/2026-03-07-go-uuid-stdlib-01.webp)

最近看到一個 Go 的提案：想在標準庫加入 `crypto/uuid`，提供 UUID 生成與解析（v3/v4/v5）。

表面上超無聊：
- parse UUID
- generate UUID
- end

但 UUID 這種東西，越無聊越危險。
因為一旦標準庫「官方認證」了某種 API 形狀，整個生態系會跟著定型。

## 我在乎的五個角度

### 1) 不是在發明 UUID，是在「欽點一個形狀」
Go 其實早就有事實上的 UUID 標準：大家常用的第三方套件。
這個提案真正要決定的不是「RFC 4122 能不能實作」——那很簡單。
而是：

> 未來 10 年 Go 世界裡，UUID 應該長什麼樣？

一旦標準庫選了：
- 型別長相（`UUID`？`[16]byte`？struct？）
- 字串格式與大小寫
- error 的語意

之後 codegen、framework、教學文都會對齊。
到時候你會在每個 repo 看到：

```text
import "crypto/uuid"
```

### 2) 最強的理由其實是：依賴的重力
做後端 Go，你幾乎一定會碰 UUID。
DB primary key、request id、tracing、idempotency key、message dedupe——隨便挑一個。

現在一個「乾淨的小服務」常常會帶著：
- router
- logger
- UUID lib

標準庫提供 UUID，可以減少那種「每個 repo 都要選一次同樣的套件」的摩擦。

但反方也不是沒道理：
如果每個 staple 都收進標準庫，最後標準庫會變成博物館。
所以 UUID 只有在它夠穩、夠普及、夠不帶立場時，才值得進來。

### 3) 「先放個 v4」很容易變成一個意外的安全故事
大部分人預設會用 v4（random）。
它大多時候沒問題。
但一旦它在標準庫，很多人會拿它做它不適合的事。

我看過最常見的兩種誤用：
- 把 UUID 當成「不可猜的 secret」
- 把 UUID 當成授權邊界（不是）

所以我希望 API 的意圖要清楚，文件也要把「這不是什麼」講得很白。
標準庫的東西，天然帶著一種被背書的感覺。

### 4) 真正麻煩的是格式與互通性，不是生成
UUID 生成不難。
真正會讓人受傷的是 parsing 與互通：
- 要不要接受 `urn:uuid:...`
- 要不要接受 `{...}`
- 大小寫要不要寬鬆
- nil UUID、variant 的處理

parser 太嚴格，現實世界的輸入會炸。
parser 太寬鬆，canonicalization 又會變模糊。

更麻煩的是：
一旦變成標準庫，你很難說「之後再改」。
你會被迫背著它走很久。

### 5) 我的願望：它應該超 boring，而且很好 audit
如果 Go 真要收 UUID，我希望它是：
- 行為可預期
- surface area 小
- 測試很硬
- 沒有任何花招

我不需要 UUID 變酷。
我需要它變成那種「你從此不用再想」的依賴。

## 我自己的結論
我偏支持。
不是因為 UUID 很重要，而是「沒有標準」會逼每個專案一再做同樣的選擇。

但如果要做，最好做到：
- package 很小
- parsing 規則講清楚
- v3/v4/v5 明確分開
- 文件先把常見誤用打掉

UUID 的價值就是：越 boring 越好。

---

**References:**
- [Go 提案 issue：把 UUID 相關 API 加入標準庫](https://github.com/golang/go/issues/62026)
- [RFC 4122：UUID 規格（版本、variant、格式）](https://www.rfc-editor.org/rfc/rfc4122)
- [google/uuid：目前多數 Go 專案常用的 UUID 套件](https://github.com/google/uuid)
