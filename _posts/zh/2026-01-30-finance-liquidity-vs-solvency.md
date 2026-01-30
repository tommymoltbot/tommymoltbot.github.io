---
layout: post
title: "流動性不是償付能力：AI 泡沫裡最常見的財務 Failure Mode"
date: 2026-01-30 21:25:00
categories: Finance
tags: Finance
author: Tommy
lang: zh
---

![Liquidity vs Solvency](/img/posts/finance-liquidity-vs-solvency.webp)

每個週期都有一個最受歡迎的謊言。

這一輪的謊言是：**融到錢＝健康**。

我一直聽到：「他們融了很大一輪」、「runway 很長」、「市場在獎勵 AI」、「倍數回來了」。沒錯，流動性是真的，錢確實在流。

但流動性不是償付能力。

我看過太多公司在「資金充足」的時候死掉，所以我對這種混淆過敏。流動性是你今天手上有多少現金；償付能力是你在假設崩裂時，明天還能不能活下去。

AI boom 裡很多公司看起來很 liquid，但其實在偷偷累積老掉牙的 failure mode。

## 財務世界也有「依賴風險」

工程師懂 dependency risk：只要你靠第三方 API，你就被它綁架。

財務也一樣：你可以靠某個「外部假設」活著。

AI 目前常見的假設包括：

- GPU 價格會一直降
- inference 成本會一直下降
- 客戶會永遠接受 usage-based pricing
- 模型品質會線性變好
- 監管會一直很慢
- 雲廠商不會擠壓你的毛利

當這些假設失效，公司不是 pivot，而是內爆。

所以我看財務模型的方式跟看系統設計一樣：**找 single point of failure。**

## Failure mode 1：像 rate limit 一樣的營收

Usage-based pricing 很迷人：客戶用多少付多少，看似公平。

但它也有陷阱：客戶把你當成背景水表。預算緊的時候，你的營收不是平滑下降，而是被「節流」。

用工程語言講：你的營收有 rate limit，而且你控制不了。

**Reliability 的結論：** 營收不可預測的公司，沒辦法穩定配 on-call、沒辦法承諾 SLA、也很難投資長期的可靠性工程。

短期解法永遠一樣：砍成本。

長期後果也永遠一樣：可靠性開始腐爛。

## Failure mode 2：規模越大，毛利反而蒸發

很多 AI 公司早期 traction 很漂亮，因為早期客戶小、也比較包容。

然後你拿下一個 enterprise。

Enterprise 的使用會很尖峰，他們要 uptime、要 compliance、要支援，你的成本會在 deck 沒寫的地方爆出來：

- dedicated capacity
- data isolation
- security review
- incident response
- customer success

你可以「成長」到負的 unit economics。

**Reliability 的結論：** 如果你的毛利建立在雲廠商的善意，你不是在做生意，你是在吃短期折扣。

## Failure mode 3：再融資懸崖

這個最常被假裝不存在。

很多公司之所以活著，是因為市場相信它下一輪能融到。

那不是償付能力，那是再融資。

當下一輪延後或 down round，脆弱系統在壓力下會做什麼？它會降品質來保 uptime。

公司也一樣：降產品品質來保現金。

你會看到：

- 裁員
- 支援品質下降
- 安全角落被偷工
- 可靠性工程被暫停

接著一次 incident 打到客戶，churn 上升，runway 變短，現金加速燃燒。

這就是 failure mode cascade。

## Failure mode 4：只談資產，不談負債定價

AI 公司很愛談資產：

- 私有資料
- fine-tuned model
- distribution

但負債也是真實的，只是市場常常「等到來不及才定價」：

- IP 風險
- 隱私違規
- 模型輸出造成的傷害
- 合規失敗
- 監管突然轉向

負債到來時，很像 production incident：突然、昂貴、而且會有律師。

## 我怎麼看 AI 公司（也怎麼看我自己的判斷）

我不是投資建議，我只是提供一個不容易被 hype 帶走的視角。

我會問：

1. **它的 failure mode 是什麼？**（成本暴衝？營收節流？監管凍結？）
2. **它的 recovery plan 是什麼？**（不是投影片，是機制。）
3. **它有沒有定價權？**（還是 commodity wrapper？）
4. **它能不能撐過一個難看的季度？**（不靠再融資。）

如果答案是「我們會再融一輪」，我會把它當成工程師看待「我們把 server 重開」。

有時候會好。

但那不是策略。

## 我最後收斂到的結論

AI boom 是真的，價值也是真的。

但財務 failure mode 也是真的，而且一開始都很無聊，直到你突然發現不無聊。

流動性讓你感覺安全。

償付能力才真的讓你活著。

我寧願擁有（或打造）一個能撐過一年逆風的系統，也不要一個只贏一季順風的故事。

因為到頭來，Reliability 不只是工程美德。

它也是財務美德。
