---
layout: post
title: "從『預測下一個字』到像真人一樣挑毛病：為什麼 refine 這種工具讓人覺得像魔法"
date: 2026-02-26 15:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![從 next-token 到真正的批判](/img/posts/2026-02-26-next-word-refine-01.webp)

John Cochrane（Grumpy Economist）寫了一篇短文，說他試了 Refine 這種「幫你把學術文章 refine 得更扎實」的工具。
他講了一句很刺眼、也很真實的話：

> 「我真的不知道怎麼從『預測下一個字』走到這種程度。」

老實說，我也會有這種震撼。
但如果用工程師的角度拆開來看，我覺得路徑其實不神祕，只是我們以前沒看過這種密度的「評論能力」。

五個想法。

## 想法 1：next-token 是訓練目標，不是產品描述

大家講「它就只是預測下一個字」的語氣，常常像是在貶低。
我反而覺得這句話有點像：

- CPU「就只是」翻轉電晶體
- 編譯器「就只是」把字串改寫

沒錯，但最後你照樣可以跑出飛控系統。

當你把模型餵到足夠大的語料（尤其是大量專業寫作 + 專業評論），它就會把「好 reviewer 通常怎麼抓問題」壓縮進去：
- 哪裡會有 circularity（用結果反推原因）
- 什麼叫 identification 薄弱
- 什麼地方應該補可觀測的指標
- 典型的表述矛盾、跳步、偷換概念

Refine 不一定「懂」經濟學，但它很可能學會了「像讀過很多 referee report 的人那樣挑毛病」。

## 想法 2：refine 其實是在『寫作空間裡做搜尋』

要模型從零寫一篇長文，難度很高，因為自由度太大。
它可以一路自信地寫到很順，但你可能要 30 段後才發現：整篇的核心假設就是空的。

Refine 類工具的優勢是：
- 你的 draft 已經提供了骨架
- 它可以 anchor 在明確章節、明確論點
- 它提出的多半是「針對性的修補」而不是「憑空創作」

它比較像在做這件事：

```text
suggest_improvements(draft) -> {需要補證據的主張, 不清楚的名詞, 推論斷裂處, 可能的數學錯誤}
```

這種 bounded 問題，LLM 特別容易看起來像真的。

## 想法 3：最像魔法的不是『推理』，而是『長得像 judgment 的文字』

Cochrane 提到 Refine 會指出：論證有 circularity 風險、關鍵主張缺少可觀測對照、甚至抓到代數符號錯誤。

這些看起來像推理。
但很多其實是：
- 很強的「審稿 checklist」內化
- 大量歷史評論樣本的 pattern
- 在長文中維持脈絡的能力

你如果看過很好的 code review，就會懂那種感覺：
不炫技、不哲學。
就是狠準、很具體。

## 想法 4：這才是我願意付錢的『AI 知識工作』

寫 paper、寫 design doc、寫 proposal、寫 ADR，最花時間的從來不是打字。
是那一輪又一輪的來回：
- 你的論點方向對，但證據不足
- 你晚了兩節才定義關鍵名詞
- 你這段跟前面矛盾
- 你在講因果，但你只有相關

Refine 工具本質上就是：一個不會累的快速 reviewer。
你仍然要做最後判斷。
但整個迭代速度會變快。

我喜歡的是「把無聊的迭代次數降下來」，不是「取代寫作者」。

## 想法 5：新的寫作素養：要同時寫給人看，也要寫給模型審稿人看

Cochrane 最後的擔心我也有：10~20 年後，大家不讀原文，只讀 LLM digest。

如果這是真的，那很實際的策略就會變成：
- 把 claim 寫清楚
- 把證據貼得更明確
- 把假設寫在明面上
- 不要靠 vibe 撐內容

不是為了 SEO。
而是因為 reviewer 開始有一部分是機器，而機器獎勵的是「清楚」這件事。

我不確定我喜不喜歡這個未來。
但如果它真的要來，我寧可站在「作品能穿過 pipeline」的那一邊。

---

**References:**
- [Cochrane 試用 Refine 的文章（含『predict the next word』那句）](https://www.grumpy-economist.com/p/refine)
- [Refine 官方網站（學術寫作 refinement 工具）](https://www.refine.ink)
- [Hacker News 討論串："I don't know how you get here from \"predict the next word.\"" ](https://news.ycombinator.com/item?id=47162059)
