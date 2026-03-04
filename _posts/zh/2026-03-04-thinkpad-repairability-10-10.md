---
layout: post
title: "ThinkPad 拿到 10/10 可維修性：很無聊，但我反而覺得這才重要"
date: 2026-03-04 04:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Lenovo ThinkPad 可維修性](/img/posts/2026-03-04-thinkpad-repairability-01.webp)

我看到 iFixit 給 Lenovo 新一代 T 系列 ThinkPad 一個很誇張的分數：**可維修性 10/10**。

老實說我第一反應不是「哇創新」，而是：「終於喔，這台本來就應該是給企業用五年的筆電，現在才像樣。」

而且重點其實不是 10/10 這個數字。

可維修性只有在它不是「極客玩具」的時候才真的有意義。當企業採購部門、IT 部門那種「一買就是一整批」的主力機型，開始變得好拆、好修，而且（希望）有完整的零件和文件供應鏈，這件事才會從道德辯論，變成採購清單上的一條規格。

## 多數筆電的「可維修」其實是：可以修，但你會很痛苦

現在很多筆電都能修，就像你也可以用一堆 `print()` 來 debug 分散式系統一樣。

理論上辦得到。

但整個設計優化的是：越薄越好、膠越多越好、組裝線越快越好。不是為了那個半夜兩點還得拆機、因為有人在客戶簡報前把咖啡灑進去的倒楣工程師。

如果這個 10/10 在 provisional 階段結束後還站得住腳，它代表的是：可維修這件事是在**設計早期**就被當成約束條件來做的——

- 該模組化的地方真的模組化
- 常見維修不會一路升級成「整台拆光」
- 產品假設自己會被打開不只一次

聽起來很不浪漫。

但這種工程，才是真的有紀律。

## 我在意的不是一個神功能，而是一堆「很煩但重要」的決策

iFixit 的文章裡讓我覺得有感的，不是一招致勝。

而是一堆小到你不會在發表會上講、但會決定你未來維修人生的設計選擇：

- **標準 M.2 SSD**（拜託不要再藏什麼焊死的驚喜）
- **電池維修不再像談判**
- **鍵盤更換流程看起來…正常**
- **散熱模組可拆、風扇可換**
- **I/O 更模組化**，包含 Thunderbolt（這東西在真實世界壞很常見）

另外，**LPCAMM2** 記憶體回歸也滿有意思。

不是因為我很想每週末都去升級筆電 RAM，而是因為它代表一條少數能同時滿足「薄」跟「可維修」的路徑——至少不像「全部焊死」那麼絕。

## 真正重要的是：把可維修當成產品的一部分

iFixit 的 10/10 是標題，但我覺得更大的改變是心態：

- 可維修性被當成**設計 constraint**，不是最後才補救
- 服務性（serviceability）在夠早的時候就進入討論，能影響 layout
- 文件與零件供應不再是另一個宇宙，而是產品本身的一部分

如果 Lenovo 能在 ThinkPad T 系列這種「商務筆電原型」上做到，那其他家廠商的藉口就會變得更薄。

不會消失。

但會更薄。

身為工程師，我永遠更願意買單「無聊、可預期、可維修」，而不是「很帥、封死、用完就丟」。

---

**References:**
- [iFixit：Lenovo 新款 T 系列 ThinkPad 可維修性拿到 10/10](https://www.ifixit.com/News/115827/new-thinkpads-score-perfect-10-repairability)
- [iFixit：Provisional repairability scores 的說明](https://www.ifixit.com/Wiki/Provisional_Repairability_Scores)
- [iFixit：關於 LPCAMM2 記憶體的背景文章](https://www.ifixit.com/News/95078/lpcamm2-memory-is-finally-here)
