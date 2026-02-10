---
layout: post
title: "Vulkan 擴充爆炸：Khronos 這次想用『子系統替換』逃離分支地獄"
date: 2026-02-11 00:10:00 +0800
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "Vulkan 最迷人的地方是可擴充性，但可擴充性活久了就會變成決策成本。Khronos 現在丟出一個更像平台政治的解法：用『不跟舊 API 互動』的 extension 直接替換整個子系統，讓新程式碼有機會走一條乾淨路徑。" 
image: /img/posts/2026-02-10-vulkan-extension-explosion.webp
lang: zh
---

Vulkan 一直在賣同一個交易：

- 你拿到 **控制權**
- 但你也得吞下 **選擇題**

前期選擇題像自由。
十年後選擇題開始像稅。

Khronos 最近寫了一篇很坦白的文章，直接把這個痛點叫做 **「extension explosion problem」**。
他們提出的解法乍聽有點好笑（也很真實）：

他們要靠「更多 extension」來解。

但重點不是「數量」，而是 *形狀*。

這次他們想做的是 **子系統替換（subsystem replacement）**：
不要再在舊系統上補洞，而是用一個新 extension 直接做出「整套替代方案」，而且盡量讓你可以忽略以前那堆歷史包袱。

第一個被拿來當示範的，是 `VK_EXT_descriptor_heap`，把 descriptor 這個子系統整個重做，還強調它 **不會跟舊的 descriptor set 世界互動**。

## 1) 可擴充性很棒……直到它變成決策空間的 DoS

沒碰過 Vulkan 的人，可能很難感受到它的痛。
痛點不只是「extension 多」。
是每一個 extension 都把你推進一個矩陣：

- 我到底可以假設什麼一定存在？
- runtime 要偵測什麼？
- 為了可攜性要支援到哪裡？
- 為了效能要走哪條路？

這其實是所有長壽平台最典型的老化模式：

- 「安全預設」越來越不清楚
- 「最佳實務」開始需要附帶很多前提
- 最簡單的做法取決於 vendor / driver / 時代

API 沒有變爛。
是整個生態越來越糾結。

## 2) 「子系統替換」其實是一個政治解法，只是穿著 API 設計的外衣

理性上你會想：那就 Vulkan 2.0，重新洗牌。
但現實平台不可能這樣玩。

相容性不只是善意。
它是權力。

所以 Khronos 做的事情很像成熟生態常見的路線：

- 舊的先留著（不能砍）
- 新的另外開一條路
- 用足夠好的設計 + 工具 + 生態推力，讓大家「自願」搬家

我覺得最關鍵的一句話，是他們描述 `VK_EXT_descriptor_heap` **不跟舊 descriptor set API 互動**。
這等於是在說：

```text
舊路線：別再長分支了
新路線：給你一條乾淨的單一路徑
```

如果他們真的守得住這個邊界，複雜度有機會是減少，而不是堆疊。

## 3) 真正的成本不是把新 API 寫出來，是把大家搬過去

每一個「替換子系統」的夢，最後都死在同一件事上：

- 工具鏈跟不上
- sample 跟不上
- middleware 跟不上
- 引擎不想維護雙路徑 renderer

所以這篇文章一直強調 working group 很多廠商參與、buy-in 很廣，我覺得不是宣傳。
那是在講「協調成本」：

子系統替換要成功，必須同時成立：

- 多家 IHV 都出貨支援
- 大引擎願意採用
- 開發者不用為了相容性寫四條 codepath

不然你只是發明了「另一個 extension 分支」，然後問題更大。

## 我怎麼看

我喜歡這種務實的誠實。
Vulkan 的 extension 模型既是它的超能力，也是它慢慢變難親近的原因。

所以「用 extension 去替換整個子系統，並且刻意跟 legacy 切割」這招，確實像一個逃生門：

- 不破壞既有生態
- 也讓新程式碼有機會回到簡單

最後成不成，會被最無聊的事情決定：
出貨時程、引擎採用、以及你到底能不能少寫一堆 `if (hasExtension)`。

---

## References

- [Khronos 官方文章：談 Vulkan 的 extension explosion problem 與 subsystem replacement 策略](https://www.khronos.org/blog/simplifying-vulkan-one-subsystem-at-a-time)
- [Vulkan 規格：目前 Vulkan extensions 的完整清單（看一眼你就懂什麼叫爆炸）](https://docs.vulkan.org/spec/latest/appendices/extensions.html#_list_of_current_extensions)
- [VK_EXT_descriptor_heap 參考頁：被定位成 descriptor 子系統的完整替代路徑](https://docs.vulkan.org/refpages/latest/refpages/source/VK_EXT_descriptor_heap.html)
