---
layout: post
title: "Stripe 做 Token Billing 這件事，透露了一個現實：AI 成本正在變成 SKU"
date: 2026-03-03 19:00:00
categories: Finance
tags: Finance
author: Tommy
lang: zh
---

![Stripe 文件截圖：把 token 計費當成第一級產品能力](/img/posts/2026-03-03-stripe-token-billing-01.webp)

過去一年很多 AI 產品的定價方式，其實還停在「一般 SaaS」的想像；但它的成本結構更像「雲端基礎設施」：用越多就燒越多。

所以你會一直看到一些很尷尬的戲碼：
- 「Unlimited」方案改成 rate limit，然後大家吵起來。
- agent 做得越強，效果越好，但毛利越差。
- 創辦人每天在算 token 成本，像在做風控。

Stripe 最近釋出的 **LLM token billing**（private preview）我覺得值得看，不是因為它多炫，而是它把一個大家都知道但很常被迴避的事，直接做成產品能力：

```text
raw_llm_cost(tokens, model) + markup(%)  ->  customer_charge
```

不是「之後再想怎麼收費」，也不是「塞進 tier 裡面假裝沒看到」，而是：*token 成本本來就是 line item，那就讓它變成可計費的單位。*

## 這個轉變其實很安靜：token 成本開始面向客戶
只要你是用 hosted model，你就活在別人的 pricing surface 裡。

當 OpenAI / Anthropic / Gemini 調價，這不是新聞八卦，是你公司的 gross margin 在被拉扯。很多團隊現在的做法就是：excel + 自己記 usage + 祈禱不要爆。

Stripe 這個功能的敘述很直白：
- 幫你同步模型價格
- 幫你按客戶記 token 使用量
- 套用你設定的 markup
- 帳單自動生出來

字面上很無聊，但背後的意思很不無聊。

它把「AI 成本」從：
- **內部 ops 問題**（工程 + 財務每週一次小型戰爭）

推向：
- **產品的基本原語**（可量測、可稽核、可計費）

## 為什麼這件事重要（就算你不用 Stripe 的 gateway）
重點不是「Stripe 也有 AI gateway」。你可以用其他 gateway，也可以不用 gateway。

真正的訊號是：Stripe 這種等級的公司，直接說 *token metering 應該屬於 billing infrastructure 的範圍*。

這其實在暗示 AI app 的定價方向：
- token 成本不是暫時的
- usage 一旦變得尖峰化，「平均一下」的定價就撐不住
- 市場會越來越習慣「usage-based + 有 margin」

如果你做過任何 agentic workflow，你一定懂。

純聊天 UI 的成本曲線還算平滑；但 agent 會 loop、會 retry、會呼叫工具、會 fan-out 任務。效果更好沒錯，代價是：你的成本跟著使用者的好奇心一起飆。

## 真正的產品其實是「可預期」
Stripe 文件一直在講「同步模型價格」跟「價格變動通知」。聽起來像 convenience feature。

但我覺得它本質上是在賣 predictability：
- **客戶想要可預期**：我用一用會花多少？
- **你想要可預期**：有人狂用會不會把我燒到賠錢？

token billing 就是其中一種把兩者對齊的方法。

它也順便終結一種常見的幻想：

「Unlimited」只有在 marginal cost 幾乎是零的時候才成立。

LLM 的 marginal cost 很真實。

## Markup 不是邪惡，它只是把故事補完整
很多開發者看到「token markup」會本能反感，覺得像在當二房東。

但如果你是在做產品，markup 其實是在支付這些東西：
- 研發成本
- reliability（重試、fallback、evals）
- UX 打磨
- 客服
- 濫用與詐欺防護

如果你的收費方式是「完全照供應商成本，自己不留 margin」，那你不是 business，你只是 pass-through。

Stripe 這次有趣的點，是把 markup 做成 **顯性**、**可調**。

大家的心智模型會變得比較乾淨：

```text
provider_bill  ->  your_margin  ->  customer_bill
```

我猜接下來會更多產品採用這種拆法：
- 基本訂閱費（買產品表層：介面、功能、整合）
- 外加 usage-based（買昂貴的那段：tokens、tool calls、compute）

## 我有點偏執的解讀：基礎設施層正在「定型」
當 billing 系統開始把 token 當成一般的 meter，一堆二階效應就會變得簡單：
- per-customer budget / cap 變成可執行的限制，而不只是 UI 提示
- 成本歸因（按 model、按 input/output token 類型）
- 財報與成本分析不需要三個工程師陪 CFO 加班

也意味著「AI app 怎麼賺錢」會變得更可讀。

Cursor 的定價爭議、agent startup 的 burn rate、大家對「為什麼又要改價格」的集體崩潰……很多時候其實就是：這個產業還在學，如何替一個 COGS 用 token 量測的產品定價。

Stripe 的態度很像是在說：別再假裝這是魔法了。把它放到 invoice 上。

這不是 hype。

這是活下去的方法。

---

**References:**
- [TechCrunch 對 Stripe token billing（含 markup 機制）的報導](https://techcrunch.com/2026/03/02/stripe-wants-to-turn-your-ai-costs-into-a-profit-center/)
- [Stripe 文件："Billing for LLM tokens"（private preview 概覽）](https://docs.stripe.com/billing/token-billing)
- [Stripe Billing：AI 服務的彈性定價指南](https://stripe.com/resources/more/pricing-flexibility-in-ai-services)
