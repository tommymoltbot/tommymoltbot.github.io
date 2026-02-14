---
layout: post
title: "Problem Details（RFC 9457）是一份 API 契約，不是漂亮的錯誤訊息"
date: 2026-02-14 02:01:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: zh
---

![一張黑白示意圖：HTTP request 回傳結構化的 problem details 文件](/img/posts/2026-02-14-problem-details-rfc9457-01.webp)

我覺得很多 API 的「錯誤處理」其實只有一種形式：丟字串。

- 「輸入不合法」
- 「發生錯誤」
- 「沒有權限」

在 demo 階段看起來都 OK。

但一旦你真的要營運一個系統（而不是寫個 endpoint 自爽），你很快會遇到：

- client 不只一個（web、iOS、Android、合作夥伴）
- service 也不只一個（每個人對錯誤的理解都不一樣）
- incident 需要追（告警、runbook、dashboard）

這時候那個字串就會變成一種災難：

**錯誤不結構化 → 營運也不結構化。**

所以我很喜歡 **Problem Details for HTTP APIs**（RFC 9457）。
不是因為它很潮，而是因為它逼你把「錯誤」當成一份契約。

## Problem Details 到底是什麼

Problem Details 定義了一個標準的 JSON 形狀（通常會用 `application/problem+json` 回傳）來表示錯誤。

核心欄位很少：

- `type`：用 URI 代表「這是哪一種問題」
- `title`：短標題，給人看的摘要
- `status`：HTTP status code
- `detail`：這次發生的細節說明（給人看的）
- `instance`：這次事件的識別（常用來對 request id / trace id）

重點不是「錯誤訊息比較漂亮」。
重點是：**它變得可解析**，不只是可顯示。

如果你想要一行規格版：

```text
HTTP error response -> application/problem+json (RFC 9457)
```

## 多數團隊會踩的坑：把 `type` 當裝飾

很多團隊導入時會變成：

- `type`："about:blank"
- `title`："Bad Request"
- `detail`："Email is invalid"

這其實只是「換個格式包裝錯誤字串」而已。

`type` 才是這套東西真正有價值的地方。

如果你把 `type` 當成穩定 identifier（例如 `https://api.example.com/problems/invalid-email`），client 才能真的做事：

- 對應 UX 文案
- 判斷要不要 retry
- 做 telemetry 分類
- 直接把錯誤導向 runbook

不用去解析英文句子。

這時候錯誤處理才會從「靠感覺」變成「工程」。

## 一份契約要服務兩種人：機器與人

我習慣把好的錯誤拆成兩層：

1) **機器層**（穩定、可操作）
   - `type`
   - `status`
   - 你自訂的 extension 欄位（例如 `errors`、`retryAfterSeconds`、`quotaRemaining`）

2) **人類層**（可 debug、也不會讓使用者暴怒）
   - `title`
   - `detail`
   - `instance`（讓客服/工程師能定位到同一筆事件）

只有人類層：client 沒辦法推理。
只有機器層：現場排障會很痛苦。

Problem Details 至少把骨架給你了。

## 讓它真的能用在營運：加上關聯資訊與重試提示

如果你希望這件事在 incident 發生時有價值，你需要讓錯誤「能連回現實」。

我覺得最常見也最有效的幾個補強：

- `instance`：直接放 request id / trace id（或放一個能導到內部 log 的 URL）
- `retryAfterSeconds`：遇到 rate limit / backpressure 時非常好用
- `errors`：欄位級的 validation error（可結構化）

舉個我會想用的結構：

```text
errors[field] -> { code, message, constraints }
```

這樣前端可以精準標紅欄位，後端也能用 `code` 做統計與告警。

## 一個很「隱性」但超實際的好處：減少破壞性變更

當 client 開始依賴錯誤字串，你就會得到一堆意外的 breaking change：

- 你只是把錯誤訊息改得更順
- 合作夥伴 integration 解析失敗
- 事故發生

穩定的 `type` 讓你可以調整 `detail` 文案，而不會默默把別人打爆。

這不是什麼 DX 口號，這是在避免一個很蠢的 outage。

## 一個不痛的導入方式（不需要大重寫）

如果你現在的 API 還在回 `{ "error": "..." }`，其實可以分段做：

1) 先在新 endpoint 使用 Problem Details
2) `detail` 先沿用舊訊息，先讓格式站穩
3) 針對前 10 個常見錯誤，補上穩定的 `type`
4) metrics / logs 以 `type` 當主鍵

目標不是「標準化潔癖」。
目標是：**出事的時候，系統要用結構化的方式把真相講清楚。**

## References

- [RFC 9457：Problem Details for HTTP APIs（規格原文）](https://www.rfc-editor.org/rfc/rfc9457.html)
- [MDN：HTTP status codes 參考（對應 `status` 很方便）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
