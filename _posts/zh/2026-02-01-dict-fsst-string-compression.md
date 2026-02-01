---
layout: post
title: "Dictionary + FSST：我最近看到最務實的字串壓縮技巧"
date: 2026-02-01 21:30:00 +0000
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
image: /img/posts/2026-02-01-dict-fsst-compression.webp
---

![Dictionary + FSST 的資料佈局示意](/img/posts/2026-02-01-dict-fsst-compression.webp)

我一直對資料庫圈子聊「壓縮」有個小陰影。

簡報上永遠是：壓縮 → 省空間 → 更快。

但你真的把東西丟進 production，會發現事情沒那麼單純：你省了 IO，然後在 CPU 端被解壓縮打爆；最後結果是「磁碟省了，但 hot query 更慢」。

所以我很喜歡 CedarDB 這篇文章，因為它很老實地把 trade-off 講清楚，而且丟出一個很工程師腦的做法：**用 Dictionary 壓縮保留可查詢性，再用 FSST 去壓縮 dictionary 本身**。

## 為什麼字串這麼煩
你只要碰過真實資料，就知道字串是躲不掉的。

你可以一直喊「用 enum 啊」，但現實是：

- status 欄位最後還是 text
- UUID 有人就是用 text 存
- URL / user agent 這種東西更是天生字串

字串的問題通常不是「不能存」，而是：

1) **很吃空間**（雲端存儲直接變成錢）

2) **不好查**（長度不固定、比較成本高、cache 也不友善）

資料庫系統一直想做的一件事，其實是把字串變成「更像整數」的東西，讓比較跟掃描變便宜。

## Dictionary 壓縮很香，但有上限
Dictionary 壓縮的套路你一定看過：

- 把所有 distinct string 收進 dictionary
- column 裡只存小整數 key
- 查詢時盡量在 key 上做 filter

如果 dictionary 是有序的，你還會得到一些很好用的性質：

- 像 `url = '...'` 這種 predicate，可以在每個 block 先對 dictionary 做一次 binary search 找到 key
- 接著整段掃描就變成整數比較（SIMD friendly）

但 dictionary 壓縮有個致命點：**distinct value 一多，dictionary 本身就膨脹成新的怪物**。

你把 column 變小了，但你同時也把一堆原始字串「完整存進 dictionary」。

## FSST：有點像 tokenizer，但用在 bytes 上
FSST（Fast Static Symbol Table）基本上是「把常出現的 substring 變成 1 byte code」。

大概是這樣：

- 找出最多 255 個常見 substring（稱為 symbols，最長 8 bytes）
- 用 1 byte codes 取代
- 留一個 code 當 ESC，處理沒在表內的 byte

概念上你可以把它當成「LLM tokenization 的遠房親戚」。

它在工程上好用的一個原因很現實：**256 entry 的 symbol table 很容易塞進 L1 cache**。

但它也有問題：FSST 壓縮後的東西，依然是「變長 bytes 序列」。

所以 ordering（<、>）沒那麼好做；就算是 equality，有時候你也會被迫解壓很多。

## 真正務實的點：DICT + FSST（壓縮 dictionary，不壓縮 column）
我覺得最值得抄的是這個做法。

不要直接 FSST 壓整個 column。

改成：

- 先做 dictionary
- column 照樣存整數 key（查詢邏輯幾乎不變）
- **把 dictionary 裡的字串用 FSST 壓起來**

結果是：

- 你保留 dictionary 壓縮最重要的好處：*可查詢性*（predicate 主要還是跑在 keys 上）
- 你又能利用 FSST 去吃掉 dictionary 裡「模式重複」的那堆浪費

是的，它多一層 indirection。

但如果你本來就是 columnar / block-oriented 的系統，這個成本通常很可控。

也不意外 DuckDB 早就有類似的 `DICT_FSST`。

## 不好聽但重要：壓縮會害 hot query 變慢
這篇文章我最認同的是它把「壓縮會變慢」直接講出來。

workload 是 cold run（從 disk 讀）時：壓縮常常會更快，因為 IO 變少。

workload 是 hot run（都在 memory）時：壓縮可能更慢，因為 bottleneck 變成 CPU 解壓縮。

他們提到一個很具體的情境：像 LIKE 這種需要解壓很多資料才能判斷的 query，hot run 可能被 FSST 拖到更慢。

這就是我說的：壓縮不是「免費加速」。

所以 CedarDB 的策略是：**FSST 要比下一個 best scheme 明顯更小，才值得用**（他們甚至設定了一個 penalty threshold）。

聽起來不酷，但這種做法才像在寫真的資料庫。

## 我的 takeaway
如果你在做分析系統、資料倉儲，或任何「一堆 text-ish 欄位」的資料模型，**壓縮 dictionary** 是一個很務實的工程解。

它沒有改你的 query execution model，也不是什麼玄學加速。

它只是很直接地攻擊最浪費的地方：dictionary 裡大量重複的 pattern。

最後一句：**壓縮是 performance feature，但前提是你願意把整條 pipeline（IO + cache + CPU）一起算進去**。

---

**References:**
- [CedarDB：Efficient String Compression for Modern Database Systems](https://cedardb.com/blog/string_compression/)
- [FSST 論文（VLDB）：Fast Static Symbol Table compression](https://www.vldb.org/pvldb/vol13/p2649-boncz.pdf)
- [DuckDB 文件：提到 DICT_FSST 的 compression functions](https://duckdb.org/docs/stable/sql/functions/compression.html)
