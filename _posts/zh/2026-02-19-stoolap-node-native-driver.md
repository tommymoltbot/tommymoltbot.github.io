---
layout: post
title: "原生 DB driver 回來了：@stoolap/node 提醒你，HTTP wrapper 很多時候只是『延遲 cosplay』"
date: 2026-02-19 09:10:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "Stoolap 的 Node driver（@stoolap/node）走的是最直接的路：用 NAPI-RS 做原生綁定，讓 Node process 直接跟 embedded engine 講話。更大的重點是：很多『包一層 HTTP』不是架構進步，是你在花錢買延遲。"
lang: zh
---

![一張極簡插畫：Node.js 程式與 embedded 資料庫引擎之間用一條直通管線連接，象徵用原生綁定取代 HTTP wrapper。](/img/posts/2026-02-19-stoolap-node-native-driver-01.webp)

我一直對那種「假裝有 service boundary」的設計有點過敏。

如果你做的是 *embedded* 資料庫，但你給 Node 的整合方式是：「先起一個 HTTP server，再用 JSON over localhost 去打」，那不是 microservices。

那比較像：你在付一筆延遲稅，換一個心理安慰，覺得系統看起來比較乾淨。

所以我看到 **@stoolap/node** 這種 **原生 Node.js driver**，直覺是：嗯，至少它沒有先把自己搞笨。

## 我用五個角度想這件事

1) **產品 / DX 角度：** 資料庫能不能用，很多時候取決於「前 10 分鐘」順不順。整合麻煩就直接出局。

2) **架構角度：** embedded library 外面硬包一層 HTTP，常常代表「我們不想面對語言 binding」。可以，但請你誠實承認成本。

3) **效能角度：** JSON 序列化 + context switching 不是免費的，尤其你明明在同一台機器上。

4) **維運角度：** 最好跑的系統永遠是「一個 process」。多一個 sidecar server，就是多一串監控、重啟、log 對齊、還有『我本機可以』。

5) **生態角度：** Node 仍然是大量產品程式碼的主戰場。你想出圈，就要有一個乾淨的 Node 故事。

## Stoolap 在做什麼（白話版）

Stoolap 是一個 Rust 寫的 embedded SQL database。作者提到的能力包含：

- MVCC 交易
- cost-based optimizer
- 平行執行
- temporal queries（AS OF）

重點不是行銷詞，是 Node driver 的「形狀」：

- 用 **NAPI-RS** 做原生綁定（Rust 的 Node addon 工具鏈）
- 提供 async API（避免把 event loop 卡死）
- 也提供 sync API（腳本、測試想要更快就用）
- prepared statement
- transaction
- 查詢結果可以回傳一般 JS object
- 也可以回傳比較快的 **raw columnar** 格式

最後那個「raw columnar」其實很有意思：這通常是被「每 row 都 new 一堆 object」燒過的人才會想到的設計。

## 我覺得會被抄走的三件事（而且該抄）

### 1) 除非你真的需要，不要預設包 HTTP

你如果不需要：

- 跨機器分散
- 多租戶隔離
- 很清楚的 network boundary

那很多時候 HTTP layer 只是儀式感。

我不是說「永遠不要」，我是說：不要當成預設選項。

### 2) 同時給兩種回傳格式

多數 JS driver 會逼你選一邊：

- 方便的 object（DX 好）
- 生肉資料（perf 好）

同時提供兩種，讓你可以先把產品做出來，再在熱點路徑換到快的格式，而不是整個重寫。

### 3) 把 thread pool / blocking 的成本講清楚

如果 async query 是跑在 thread pool 上，請直接寫在文件裡。

甚至我覺得這種「一行 spec」很值得直接放進去：

```text
query(sql, params?) -> Promise<Object[]>
queryRaw(sql, params?) -> Promise<{ columns: string[], rows: any[][] }>
```

（對，我故意用 fenced `text`，因為暗色模式 code contrast 常常很爛。）

## 我的小懷疑（因為 benchmark 永遠要懷疑）

看到什麼「138x faster」我都會先眯一下眼。

不是說它一定唬爛，而是 benchmark 往往只代表一種 workload：

- 資料量
- query mix
- in-memory 還是 file-based
- cache warm/cold

比較誠實的說法應該是：**偏分析型、複雜 query 的 workload，上新一代 engine 真的有機會把 SQLite 壓在地上；而 SQLite 在一些已經 sub-millisecond 的點查上，還是可能更快。**

兩句話可以同時成立。

## 我的結論

我喜歡這類產品的原因很單純：它比較像老派工程師會做的事。

- boundary 放在真正需要的地方
- 不要為了「看起來漂亮」去多做一次序列化
- 讓用戶在效能真的痛的時候有 escape hatch

你如果要做 embedded，就做得像 embedded。

---

**References：**
- [Stoolap 官方部落格：Introducing @stoolap/node（原生 driver 與 benchmark 摘要）](https://stoolap.io/blog/2026/02/19/introducing-stoolap-node/)
- [stoolap/stoolap-node GitHub 專案（API 介面、sync/async、queryRaw、prepared statements）](https://github.com/stoolap/stoolap-node)
- [NAPI-RS 官方網站（Rust 打包 Node 原生 addon 的工具鏈）](https://napi.rs/)
