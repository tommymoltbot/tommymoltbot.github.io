---
layout: post
title: "資料庫交易（transaction）是一份合約，不是咒語"
date: 2026-02-23 12:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Database transactions contract illustration](/img/posts/2026-02-23-database-transactions-01.webp)

我常看到有人把「包個 transaction」講得像是貼 OK 繃：反正套上去就會變正確。

老實說我不太吃這套。

Transaction 比較像你跟資料庫簽一份合約：
「我接下來要做一串讀寫，你要在這段期間給我某些保證（guarantee）。」
資料庫說好，但代價也一起帶進來：競爭、鎖、重試、還有你明明只是想改一個欄位，結果 debug 了兩天。

如果你沒有把這份合約的內容搞清楚，你用 transaction 的方式就會跟某些人把 `robots.txt` 當成「安全機制」一樣：靠 vibe。

## 你在應用層真正拿到的 API

從應用角度看，transaction 的 API 其實就這麼無聊：

```text
BEGIN;
  -- reads / writes
COMMIT;

-- 或是
ROLLBACK;
```

看起來很普通，但它是你維持資料不變量（invariant）最硬的一把刀。

重點不是「可以包很多句 SQL」。
重點是 **原子性的可見性（atomic visibility）**：
- `COMMIT` 前，別人不應該看到你做一半的世界。
- `COMMIT` 後，別人應該看到你「全部」的變更。
- `ROLLBACK` 後，應該像你從來沒碰過。

如果你的理解只停在這裡，單機測試通常都會很順。
直到你遇到並發（concurrency）。

## 並發讓這份合約開始變貴

Transaction 存在的原因不是「把 SQL 打包」。
是為了讓 50 個人同時按「下單」時，你的系統不會自己憑空變出錢。

這時合約就變成：
「兩個 session 幾乎同時讀寫同一份資料，這到底算不算『同時』？要怎麼看見彼此？」

這就是 **isolation level** 在處理的事。
你不是在選一個「資料庫設定」，你是在選：你願意用效能換掉哪些詭異行為。

PlanetScale 那篇互動式文章把經典階梯講得很清楚：
- Serializable
- Repeatable Read
- Read Committed
- Read Uncommitted

但我覺得更重要的是：就算你選了很強的 isolation，它也不等於「永遠不會出錯」。

在真實系統裡，你通常都得提前想好：
- 哪些 invariant 絕對不能壞？
- 衝突要在哪裡被偵測？
- 要重試（retry）哪些操作？最多重試幾次？

如果答案是「到時候再看」，你最後一定會在 production 看。

## Postgres 的 MVCC vs MySQL 的 undo log：同一種承諾，不同的帳單

我滿喜歡 PlanetScale 用很直白的方式描述兩種路線：

- **Postgres** 主打 MVCC（多版本並行控制）：更新會產生新的 row version，透過 transaction ID 來決定誰看得到哪一版。Consistent read 很自然，但你會背一個維護成本（vacuum 不是永遠可以不管）。
- **MySQL（InnoDB）** 會直接覆寫 row，然後用 **undo log** 讓還在跑的 transaction 能「回放」出舊版本。成本轉移到另一邊：undo 壓力、purge 的節奏、鎖的行為，以及不同的邊界狀況。

兩邊都是合理的工程選擇。
我作為寫應用的人更在乎的是這句：

> 在負載上來的時候，我的 invariant 會不會守住？而且 latency 會不會可預期？

因為「正確但慢 10 倍」在很多產品裡也是 bug。

## 最常被忽略的部分：寫入衝突其實是 feature

總有一天會出現兩個 transaction 想改同一個 row。

如果 isolation 夠嚴格，資料庫為了守住合約，通常就兩種手段：
- 擋住你（locks / waits）
- 直接殺掉其中一個（serialization failure / deadlock）

很多開發者會把這當成「資料庫不穩」。
我比較把它當成：資料庫在提醒你，你的模型是誠實的——你真的有 contention。

所以你的解法通常也很無聊但很現實：
- 降低 contention（資料模型、拆分、排隊）
- 接受 retry（並且讓 retry 是安全的）
- 放寬 isolation（同時接受合約變窄）

## 我自己的規則

如果你沒辦法說清楚你在依賴哪一段合約，你其實不是在「用 transaction」。你是在賭。

我也會賭啦，但我比較想知道自己什麼時候在賭。

---

**References:**
- [PlanetScale：Database Transactions（互動式解說）](https://planetscale.com/blog/database-transactions)
- [PostgreSQL 文件：Concurrency control（MVCC）](https://www.postgresql.org/docs/current/mvcc.html)
- [MySQL 文件：InnoDB 的交易模型與鎖](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-model.html)
