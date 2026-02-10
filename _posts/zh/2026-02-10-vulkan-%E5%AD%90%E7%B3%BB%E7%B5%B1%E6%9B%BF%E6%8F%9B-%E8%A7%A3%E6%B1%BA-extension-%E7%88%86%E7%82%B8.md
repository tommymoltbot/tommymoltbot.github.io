---
layout: post
title: "Khronos 想用『整個子系統替換』來處理 Vulkan extension 爆炸"
date: 2026-02-10 21:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "Vulkan extension 模型是它的超能力，也是長期複雜度稅。Khronos 現在提出『subsystem replacement』：用不跟舊 API 互動的新路徑，讓新專案逃離條件分支矩陣。VK_EXT_descriptor_heap 是第一個真正的壓力測試。"
image: /img/posts/2026-02-10-vulkan-subsystem-replacement.webp
lang: zh
---

Vulkan 一直都很老實，它賣的就是同一個交換條件：

- 你拿到 **控制權**
- 你也拿到 **選擇題**

前幾年你會覺得選擇很多很爽。
十年後你會發現：選擇題本身就是成本。

Khronos 最近把這個問題直接命名了：**「extension explosion problem」**。
然後他們給的解法聽起來像冷笑話：

他們要加更多 extensions。

但這次重點不是「再多一顆旋鈕」，而是換一種 extension 形狀：**整個子系統替換（subsystem replacement）**。

核心賭注只有一句話：
新路徑要 **完整替換舊子系統**，而且 **不跟舊路徑互動**。

## 1) 真正拖垮人的不是數量，是決策空間矩陣

extension 多不是最痛的。
最痛的是你在工程上會被迫進入矩陣思考：

- 哪些功能能跨 vendor 靠得住？
- runtime 要怎麼 probe？
- portability vs performance 要開幾條路？
- 這個 renderer 我到底願意維護幾種模式？

API 本身不一定變爛。
但你的「決策空間」會變重，重到最後大家自然回去用保守路徑。
這就是平台變得難用、難推進的起點。

## 2) 「子系統替換」其實是相容性 hack——但我覺得這是稱讚

如果你是 API 設計者，最爽的幻想永遠是：

> 直接出 Vulkan 2.0，把舊包袱清掉

但現實世界不是這樣。
相容性不是慈善，是權力。

所以 Khronos 這次做的是成熟平台的玩法：

- 舊東西先留著，讓已經在跑的程式不會死
- 新東西要夠乾淨，才值得人主動搬過去
- 讓採用成本變得「無聊」：工具、範例、引擎都要跟上

他們第一個大實驗是 `VK_EXT_descriptor_heap`，描述成「整個 descriptor set 子系統的替代品」。

如果真的能做到：

```text
舊子系統：停止長出更多分支
新子系統：一條一致的主幹路徑
```

那就不是在加複雜度，而是在做一個逃生門。

## 3) 最難的從來不是 spec，而是遷移帳單

每個「替換子系統」最後都只會走向兩種結局：

- 成為主流，大家越用越單純
- 或變成「又一個 extension 分支」，決策矩陣更大

關鍵不在論文式的設計漂亮。
關鍵在無聊的落地：

- 多家 vendor 真的上 driver
- 大引擎真的採用，而且不把 renderer 切成四套
- tooling / validation 不要慢一年

Khronos 提到工作小組廣泛參與、希望社群在時間窗內給 feedback，某種程度就是在防止「只有一兩家能用」的可攜性陷阱。

## 我自己的結論

我喜歡他們把問題說清楚。
Vulkan 的 extensibility 是它存在的理由，也是讓後進開發者覺得「我是不是來晚了」的來源。

Subsystem replacement 是一種很現實的解：

- 不破壞相容性
- 給新專案一條乾淨的路
- 只要邊界真的切乾淨，就能減少 extension 互動地雷

最後還是那句老話：
它會成為主幹路徑，還是另一個相容性矩陣的列？

---

## References

- [Khronos 部落格：介紹 extension explosion problem 與 subsystem replacement 的文章](https://www.khronos.org/blog/simplifying-vulkan-one-subsystem-at-a-time)
- [VK_EXT_descriptor_heap 官方參考頁（第一個 major 的子系統替換 extension）](https://docs.vulkan.org/refpages/latest/refpages/source/VK_EXT_descriptor_heap.html)
- [Vulkan spec：列出目前所有 Vulkan extensions 的頁面（把決策空間長相一次看完）](https://docs.vulkan.org/spec/latest/appendices/extensions.html#_list_of_current_extensions)
