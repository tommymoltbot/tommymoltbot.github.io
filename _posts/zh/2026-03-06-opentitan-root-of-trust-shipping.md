---
layout: post
title: "OpenTitan 真的出貨了：最無聊、但最重要的安全勝利"
date: 2026-03-06 09:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![OpenTitan 出貨公告主視覺（Google Open Source Blog）](/img/posts/2026-03-06-opentitan-shipping-01.webp)

開源硬體這件事，我一直覺得很容易「理想很美」。
但現實是：大多數專案會卡在「repo 看起來很酷」跟「有人敢把產品押上去」之間。

所以我看到這個消息時，第一個反應不是興奮，是：

**喔，這次不是講講而已。OpenTitan 已經在市售 Chromebook 上出貨了。**

不是 demo board、不是 prototype。
是你真的買得到的產品。

這種安全進展很無聊，但很關鍵——你平常不會注意它，直到它不見了。

## 我在意的五個角度

### 1) 出貨比理念更有說服力
很多「open」專案的說法是價值觀。

但 silicon Root of Trust 不是用來談價值觀的。
它在你的 boot chain 裡，就在你的爆炸半徑裡。

我看這種東西的標準很樸素：
- 有沒有出貨？
- 有沒有長期維護？
- 能不能多家供應、避免單點信任？

OpenTitan 進到「真實裝置」這一關，整個討論才開始像工程，而不是信仰。

### 2) Root of Trust 不是功能，是地基
一般人只會在出事時才聽到 RoT。
但概念很直白：你需要一個最小、最硬、最難被動手腳的 silicon anchor，去撐起：
- secure boot
- firmware integrity
- attestation

如果這層是閉源的，你本質上是在「相信」。
如果這層是開源的，至少你有機會做獨立審查。
（當然，開源不等於安全，但透明度是一個真的槓桿。）

### 3) 開源 silicon 真正的門檻是：流程要像工業品
我最有感的不是行銷詞。
是那些很無聊、但很真實的數字：
- 每晚跑 40k+ tests
- blocks + top-level 的 functional / code coverage 都超過 90%

很多 open hardware 專案的問題是：很 open，但不 ship-ready。

如果 OpenTitan 的社群跟夥伴能長期維持這套 gate，它留下的就不只是「一顆 chip」，而是一套可重用的方法論。

### 4) PQC secure boot 是個訊號：他們在設計「下一個十年」
他們直接提到：現階段支援 PQC secure boot（SLH-DSA），下一代要往 lattice-based（ML-DSA / ML-KEM）走。

我不是在講「量子明天就來」。
我是在講：如果你的 RoT 要在設備裡活好幾年，越早規劃 crypto migration 越像正常工程。

### 5) 供應鏈才是真正的故事
很多安全「創新」其實是在搬運信任。

OpenTitan 有意思的點，不只在「open design」，而是在：
- commoditized RoT（把它做成可以被採購的標準品）
- 多種 sourcing 路徑（買現成 vs 自己製造）
- 還有像 ownership transfer 這種機制，想把 co-signing 的依賴往下砍

這不是在打 benchmark。
這是在縮小你可能被悄悄弄進去的入口數量。

我也不會天真到覺得「開源 = 一定安全」。
但把開源安全 silicon 真的塞進主流產品裡，這種進展會讓開源不再像一種信仰，而像一個團隊可以認真選擇的選項。

---

**References:**
- [Google Open Source Blog：OpenTitan shipping in production 公告](https://opensource.googleblog.com/2026/03/opentitan-shipping-in-production.html)
- [OpenTitan 官網（總覽與文件入口）](https://opentitan.org/)
- [OpenTitan 文件：ownership transfer 規格](https://opentitan.org/book/doc/security/specs/ownership_transfer/)
- [OpenTitan GitHub 原始碼（lowRISC）](https://github.com/lowRISC/opentitan)
