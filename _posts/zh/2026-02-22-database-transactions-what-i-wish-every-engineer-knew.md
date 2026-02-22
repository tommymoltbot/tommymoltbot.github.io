---
layout: post
title: "資料庫 transaction：我真心希望每個工程師早點內化的幾件事（不然會在事故裡學到）"
date: 2026-02-22 14:04:08
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![資料庫交易（transactions）](/img/posts/database-transactions-pscale.webp)

我一直覺得很多 production bug，其實本質上都是「transaction bug」在換皮。

不是我們不會寫 SQL。

而是我們腦中對資料庫的運作有一套想像，資料庫本人有另外一套。

所以當我看到 PlanetScale 寫了一篇超長、而且用動畫把 transaction 內部行為講清楚的文章，我的第一反應是：

> 「這篇應該被當成新人必修。」

我這篇不打算逐段翻譯或整理，而是挑幾個我覺得*真的會救命*的點：你早點把它們變成直覺，很多事故就會直接少一半。

## Transaction 是一個承諾，而 **commit** 是你簽名的瞬間
Transaction 的定義其實很樸素：

- 我想要這一串讀寫行為，被當成一個原子單位

你開始它，跑一堆 query，最後只有兩個結局：

- `commit;` → 讓改動對其他人「正式生效」
- `rollback;` → 當作剛剛都沒發生

大家在 production 真的會痛到的點，不是語法。

是這句話：**資料庫只會在你真的把操作包在 transaction 裡時，才幫你避免半套狀態。**

也就是說，如果你在做「read → 計算 → write」這種流程，卻沒有明確 transaction（或流程被拆成多段），你很可能是在量產 race condition。

## 「一致性讀取（consistent reads）」其實是你每天都在偷用的能力
很多應用程式碼都默默假設：

- 我讀一次，過一秒再讀一次，看到的應該還是同一個世界

這就是一致性讀取。

沒有一致性讀取的世界很可怕：你會開始 debug 鬼故事。

- log 寫你讀到 `status = pending`
- 你根據它做決策
- 下一秒你再讀，變成 `status = paid`
- 你完全不確定是你造成的、還是別人造成的

PlanetScale 那篇把這件事視覺化做得很好：MySQL 和 Postgres 都能提供一致性讀取（例如在 `REPEATABLE READ` 或更嚴格模式下），但它們的「底層做法」不同。

## Postgres vs MySQL：就算你想「DB agnostic」，底層差異還是會咬你
理想世界是：我寫 SQL，換 DB 也差不多。

現實世界是：即使名字都叫同一個 isolation level，各家 DB 的實作差異，會決定你遇到什麼怪事。

這篇文章的對比很直觀：

- **Postgres** 偏向 MVCC（多版本）：更新會產生新版本 row，舊版本會暫時留下，之後再清掉
- **MySQL**（InnoDB）偏向 undo log：row 會被覆寫，但會留歷史讓 transaction 能「重建」自己該看到的版本

如果你曾經疑惑：為什麼 Postgres 有一整套 vacuum 的故事？為什麼 long-running transaction 會讓一些行為變奇怪？

這就是很大一部分原因。

## Isolation levels：你先選政策，然後你就得付帳
Isolation level 本質上是在做 trade-off：

- 更安全 → 更多協調/更多 bookkeeping
- 更高併發 → 更多你必須自己吞的 edge case

我最想吐槽的是：很多人把 isolation 當冷知識。

它不是。

它是「政策」。

你為了 performance 選更弱的隔離，等於你同時選了：哪些異常行為你願意接受。

反過來，如果你選最強的 `SERIALIZABLE`，你會拿到另一種痛：

- transaction 可能被中止
- 你需要 retry
- 你的系統要能把「資料庫說不行，請重試」當成正常結果

如果你的 codebase 沒有一致的 retry 策略，那種「我們全站 serializable」通常只是把事故延後。

## Concurrent writes：你不是不會輸，你只是選擇在哪裡輸
兩個 transaction 同時改同一筆資料。

一定有人會輸。

有意思的是：資料庫怎麼決定誰輸。

文章裡的對比是：

- **MySQL**：row-level locking，這是大多數人直覺上理解的模型
- **Postgres**：Serializable Snapshot Isolation 用 predicate locks + 樂觀的 conflict detection，比較像「先跑，撞到再砍掉一邊」

我的工程師式結論是：

你不可能消滅併發問題，你只能選它出現在哪裡：

- 等待（lock contention）
- 或重試（aborts）

你不處理，它就會在 production 幫你處理。

## 如果你覺得 transaction 這題很學術，我會建議你週一做這四件事
1. **把所有「read → 再 write」的流程翻出來**，只要 correctness 重要，就要確認它是在明確 transaction 裡。
2. **按 workflow 選 isolation**：付款流程跟報表查詢不是同一種東西。
3. **把 retry 當成正式機制**（尤其是 deadlock / serializable abort 這類合理會發生的情境）。
4. **把 lock time / abort rate 當成指標**，像你看 latency 一樣看它。

就這樣。

不華麗，但很實在。

---

**References:**
- [PlanetScale 用視覺化講清楚 transactions（含 MySQL vs Postgres 的底層差異）](https://planetscale.com/blog/database-transactions)
