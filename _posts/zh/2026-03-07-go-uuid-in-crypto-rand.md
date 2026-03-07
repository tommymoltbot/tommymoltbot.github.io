---
layout: post
title: "Go 標準庫 UUID 提案：把 UUIDv4/UUIDv7 生成塞進 crypto/rand，反而是最 Go 的解法"
date: 2026-03-07 10:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Go UUID 提案在 GitHub 上的討論](/img/posts/2026-03-07-go-uuidv7-crypto-rand-01.webp)

Go 社群每隔一段時間就會吵一次同樣的問題：「為什麼我每個專案都要 import 第三方 UUID 套件？」

我這週又看到一輪，路線還滿有趣：
- 先有人想做完整的 `crypto/uuid`（生成 + parse）
- 後來收斂成更小的範圍：**只在 `crypto/rand` 加 UUID 生成 helper**

老實說，如果 Go 真的要把 UUID 這件事收進標準庫，**這大概是唯一一種不會把 API 戰爭拖到永遠的形狀**。

## 重點差別：標準庫支援 ≠ 給你一整套 UUID 生態

收斂後的提案大概長這樣：

```text
crypto/rand.UUIDv4() -> string
crypto/rand.UUIDv7() -> string
```

就這樣。

沒有 `UUID` type、沒有 parse、沒有 marshaling、沒有二進位欄位的 endian 之爭、也沒有「那 v1/v3/v5/v6 要不要一起支援？」

只給你一個一致的方式，拿到一個**長度固定、格式明確**的 unique string。

需要進階功能（parse、不同輸出格式、binary 表示、驗證/容錯），你就繼續用[google/uuid（Go 社群最常見的 UUID 套件）](https://pkg.go.dev/github.com/google/uuid) 這種成熟實作。

## 只做「生成」其實更符合 RFC 的建議

新的 UUID RFC（RFC 9562）其實一直在推一個觀念：

- UUID 應該盡量當成 **opaque identifier（不透明識別碼）**
- 除非你真的非 parse 不可，否則不要 parse

這點很重要。

很多團隊導入 UUIDv7 之後，下一秒就開始依賴「裡面有 timestamp，所以我可以用來排序/分片/除錯」。聽起來很香，但你一旦開始做 introspection，就等於把 identifier 變成半個 API：後面每個人都會開始期待某種行為（例如 monotonic）。

所以 Go 這個路線（只生成、不要承諾 introspection）本質上在說：

> 你要的是穩定的 UUID 字串，不是再開一個十年級別的 bikeshed。

很 Go。

## UUIDv4 vs UUIDv7：你都要改呼叫點了，順便換 v7 很合理

討論串裡我最有感的其實不是「Go 要不要有 UUID」，而是：

- v4 很普遍（純 random）
- v7 越來越常被當成預設，因為它對 **排序 / index locality** 比較友善

如果你本來就要把第三方套件的呼叫點換掉，那順便改成 UUIDv7 的成本其實不高。

但我也理解為什麼提案會同時放 v4 + v7：

- v4 比較不會引發「行為期待」
- v7 一出現，大家就會開始期待 monotonic（這通常是坑）

Go 維護者保守一點，完全可以預期。

## 我喜歡的點：它刻意避免承諾一個「UUID 大一統」

Go 標準庫的相容性承諾很硬。你一旦做出一個 `uuid.UUID` type，後面就得背：

- string format 的決策
- binary representation 的決策
- JSON/text marshal 的決策
- parse 的嚴格/寬鬆
- 還有「那為什麼不支援更多版本」的長期噪音

相反地，`crypto/rand` 直接回傳 string，很多麻煩就被關在門外。

它不酷，但它很可能活得久。

## 我的結論（以還在寫 production code 的人角度）

如果這東西真的進標準庫，我會用。

不是因為我討厭 [google/uuid（常用第三方 UUID 套件）](https://pkg.go.dev/github.com/google/uuid)（那套其實很好），而是 UUID 跟 timestamp 一樣：

**只要語言提供一個「大家都接受」的預設，你就少掉一堆每個 repo 都要吵一次的雜音。**

我唯一希望的是：文件要一直強調「opaque」這件事。
UUIDv7 很好用，但一旦大家把「抽 timestamp 出來」當成常態，整個生態就會又回到各自發明半套標準。

---

**References:**
- [Go issue：在 crypto/rand 加 UUIDv4/UUIDv7 生成 helper 的提案（GitHub）](https://github.com/golang/go/issues/76319)
- [較早的提案：新增 crypto/uuid 套件支援 UUID 生成與解析（GitHub）](https://github.com/golang/go/issues/62026)
- [RFC 9562：UUID 與「opacity」建議的原文](https://www.rfc-editor.org/rfc/rfc9562.html)
