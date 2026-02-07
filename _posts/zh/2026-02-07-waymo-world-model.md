---
layout: post
title: "Waymo 的世界模型：重點不是影片，是他們想把「安全」變成可版本化的測試面"
date: 2026-02-07 01:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Waymo 世界模型](/img/posts/2026-02-07-waymo-world-model-01.webp)

Waymo 發了一篇在講 **Waymo World Model** 的文章。影片很炫：金門大橋下雪、龍捲風、家具亂飛，甚至還有大象。

但老實說，最值得看的不是這些畫面。

我覺得真正的重點是：他們在嘗試把更多「安全關鍵」的里程，從真實道路搬到一個**可控、可生成、可重複測試**的介面上。

而且不是只生成好看的畫面，而是能輸出 **camera + lidar** 這種多感測器資料。

如果你曾經做過任何「邊界情境才是產品」的系統，你應該懂這有多關鍵。

## 1) 模擬不再是備用方案

很多自駕模擬器傳統上像這樣：

- replay 已記錄的 drive
- 對一些物件做擾動
- 然後你一旦問「如果當時車走另一條線呢？」畫面就開始崩

Waymo 在文中其實直接點出這個問題：如果模擬太依賴「重建」觀測到的視角，當 ego route 偏離原始軌跡時，視覺一致性會掛掉。

世界模型的想法，本質上是要讓模擬能撐得住 counterfactual。

這不是研究炫技，是要上線就必須解的工程題。

## 2) 測試面（test surface）才是產品

我會把這件事看成：Waymo 不是在做一個「會生成影片的模型」，而是在做一個新的 **安全工作介面**。

他們描述了三種控制方式：

- **Driving action control**：給定駕駛輸入，讓世界跟著 roll out。
- **Scene layout control**：改道路、號誌、其他用路者的行為。
- **Language control**：調天氣、時間、甚至直接生成長尾情境。

這組合的價值在於：它會改變團隊迭代的速度與形式。

當模擬是可控的，你可以把模糊的安全問題，變成一個可以被 review 的東西：

```text
ScenarioSpec(id) -> {layout, actors, constraints, evaluation}
```

它可以被版本化、可以做 regression、可以在 code review 里吵出結論。

這才是「production engineering」的味道。

## 3) 多感測器輸出是門檻

如果模擬器只輸出 camera frames，人很容易被視覺效果帶著走。

Waymo 強調他們能生成 **camera + lidar**，我覺得這才是開始認真：

- lidar 帶的是幾何/深度，想要「騙得過」一致性更難
- 真正的自駕 stack 通常是多感測器融合

所以如果生成模型能在不同模態之間維持一致，才比較接近「可當測試工具」的方向。

我不會說這就代表已經可信，但至少方向對。

## 4) 「世界知識」也是雙面刃

他們也提到：底層是基於 DeepMind 的 **Genie 3**，用超大規模影片預訓練，再適配到駕駛領域。

這讓他們能做很少見的情境（龍捲風、大象）——不然你怎麼收集？

但我心裡也會冒出一個不舒服的問題：

- 預訓練越廣，你帶進模擬器的**隱性先驗**就越多
- 這些先驗可能反過來影響 safety evaluation

如果模擬器「幻覺」出一個看起來很合理的大象 lidar pattern，planner 學到的是正確行為，還是學會迎合模擬器的怪癖？

所以我覺得 evaluation 必須變成介面的一部分，而不是最後再補。

## 5) 為什麼我在乎：這跟 AI agent 其實同一題

聽起來離 AI agent 很遠，但問題形狀其實一樣。

Agent 不會因為 prompt 更漂亮就變可靠。

它需要的是「可測試的表面」：

- tool contract
- 可控環境
- 可重播情境
- regression suite

自駕安全工程就是這套哲學的極端版本。

更安全不是因為模型更聰明。

而是因為組織能問更精準的問題，而且系統有地方能反覆回答。

---

**References:**
- [Waymo 官方文章：The Waymo World Model（自駕模擬的新方向）](https://waymo.com/blog/2026/02/the-waymo-world-model-a-new-frontier-for-autonomous-driving-simulation)
- [Waymo 官方文章：Demonstrably safe AI for autonomous driving](https://waymo.com/blog/2025/12/demonstrably-safe-ai-for-autonomous-driving)
- [DeepMind 官方文章：Genie 3（世界模型）](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/)
