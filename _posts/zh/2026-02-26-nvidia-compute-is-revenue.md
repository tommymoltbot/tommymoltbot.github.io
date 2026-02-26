---
layout: post
title: "Nvidia 說「算力就是營收」：token 經濟正在把 capex 變成護城河"
date: 2026-02-26 12:15:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![一種資料中心的味道：capex 變成 token 的地方](/img/posts/2026-02-26-nvidia-token-capex-01.webp)

Nvidia 這季又炸了一次，Jensen Huang 在法說上丟了一句話，我覺得接下來一年會被引用到爛：

> 「在這個新的 AI 世界裡，算力就是營收（compute is revenue）。」

我懂他想講什麼。但我也覺得這句話其實是在幫很多事情「正名」。

因為如果算力等於營收，那 capex 就不再是「要想辦法省下來的成本」，而是「要砸出來的護城河」。市場一旦接受這個敘事，整個獎勵機制會一起翻過去。

五個我很難假裝沒看到的想法。

## 想法 1：講 token，其實是在講「更乾淨的計量式需求」

Nvidia 說 token 需求指數成長，不只是聊天機器人的熱度。

更大的點是：token 是一種雲端最愛的計價方式。
- 用量可量化
- 需求可以在沒有採購流程的情況下飆升
- 邊際單位（再多一個 token）可以動態定價

很 AWS，只是換成推論。

而且你能把用量量乾淨，就能把投資說乾淨。

## 想法 2：產品 roadmap 變成「資本支出 roadmap」

以前 SaaS 世界在問：「我們能多快把功能做出來？」

現在 AI 世界越來越像在問：

```text
how_many_tokens_per_$ = (tokens_per_second * utilization) / total_cost
```

你的 roadmap 變成：
- 拿到更好的 GPU
- 把它餵飽（網路 + 儲存）
- 把利用率拉高（batching、cache、排程）
- 別讓電力和散熱變成天花板

這不是軟體 roadmap。這是工廠。

## 想法 3：贏家不只是「有 GPU 的人」，而是「能把 GPU 塞滿的人」

很多團隊最近會痛一次才懂：
- 買（或租）GPU 只是第 0 步
- 真正的戰場是：你能不能在不把 latency 搞爛的前提下，把利用率維持在高點？

做不到，就等於你在付「閒置矽的租金」。

所以那些看起來很無聊的基礎設施又變重要了：
- 網路 fabric
- admission control
- queue 設計
- cache layer
- 能真的告訴你 token 跑去哪的 observability

vibe coding 時代不太愛聊這些，但 production 最後一定把你拖回物理世界。

## 想法 4：「算力就是營收」也是一個很方便的「無限花錢正當化」

如果你是雲端業者要跟市場溝通，這句話超好用：
- 我們不是在燒錢
- 我們是在投資一個會產生營收的資產

有時候這是真的。

但更刺的問題是：**這個營收到底是誰的？**

如果客戶現在的 token 用量主要來自「試驗、探索、好奇」，曲線當然漂亮……直到 CFO 出現。

「生產力」跟「新奇支出」的界線還很糊。等那條線變硬的那天，有些看起來指數上升的 token 需求，可能沒那麼黏。

## 想法 5：最被低估的風險不是模型品質，是 ROI 被競爭壓扁

大家都在拼更高吞吐、更低每 token 成本。

工程上很合理。

但經濟上這很像任何成熟基礎設施市場會發生的事：
- 效率提升最後會被競爭吃掉
- 毛利被壓縮
- 差異化往上層搬

所以 Nvidia 長期真正的楔子不只是「GPU 最強」，而是他們能不能把自己插進整個 AI 工廠（硬體、網路、軟體、ecosystem），讓上層搬家之後，錢還是繞不開他們。

這也是為什麼我看他們法說時，反而會特別注意那些「不是 GPU」的敘事：那通常是在透露下一層 lock-in 會長在哪裡。

---

**References:**
- [TechCrunch：Nvidia 本季財報與 capex 敘事整理](https://techcrunch.com/2026/02/25/nvidia-earnings-record-capex-spend-ai/)
- [NVIDIA 新聞稿：fiscal 2026 財報與 data center 重點](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026)
