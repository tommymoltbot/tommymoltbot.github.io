---
layout: post
title: "Stripe 把 token 成本做成『加價旋鈕』：AI app 的定價會變得更赤裸"
date: 2026-03-03 05:10:00
categories: Finance
tags: Finance
author: Tommy
lang: zh
---

![Stripe token billing 文件頁面](/img/posts/2026-03-03-stripe-token-billing.webp)

我其實一直在等這一天：終於有人把 AI SaaS 最尷尬的那塊（LLM token 成本怎麼轉嫁）做成「可以點的功能」。

Stripe 目前有個 private preview 文件叫「Billing for LLM tokens」。核心想法很直白：你選模型供應商，Stripe 同步各家 token 價格，你回報使用量，然後你可以設定 markup，確保自己的毛利。

表面上這只是 billing。
但我覺得它真正傳遞的訊號是：**token 正在變成一個一等公民的成本項目（COGS）**，跟金流手續費、雲端費用一樣，不能再用「訂閱制」硬掩蓋。

## 1) 訂閱制一直在「稍微說謊」變動成本

「每月 20 美金用到飽」這種 AI app，從一開始就很脆弱。
只要 usage 沒被限制，你其實是在賭：使用者不會走到那條超貴的路徑。

你一旦開始限制，就會出現很典型的產品政策：
- 「Unlimited」但實際上偷偷 rate limit
- cap 太硬，重度用戶很痛
- overage 費用像驚喜帳單

Token billing 不會直接把產品體驗變好。
但它會讓你更難假裝「成本不存在」。

## 2) 毛利旋鈕會改變誘因

當你的價格模型變成：

```text
客戶單價(每 100 萬 tokens) = 供應商單價(每 100 萬 tokens) * (1 + markup)
```

你的商業本質就更像「轉售模型使用量」。

這不是壞事，但它會改變誘因：
- 如果你的產品價值來自「更省 tokens 也能把事做對」→ 你會贏。
- 但如果你的產品價值（或看起來的價值）來自「更會講話、更會跑 agent 流程」→ tokens 可能變多，你也可能贏，但理由很危險。

我不是說大家會故意把 prompt 灌水。
我是在說：當利潤跟 tokens 綁在一起，你必須有治理機制（預算、審計、內部 token SLO 之類），不然很容易一路漂。

## 3) 真正值錢的是「價格同步」，不是算式

算式很簡單，真正痛的是營運：
模型價格會變、供應商會新增 SKU、折扣政策會改、區域價格不同。
而且工程師很愛把數字寫死在 config 裡，半年後大家就忘了。

Stripe 如果能提供可信的價格表、更新流程、以及成本變動提醒，這個才是我覺得有商業價值的部分。

## 4) 客戶會開始追問：我到底在付什麼？

只要你用 tokens 計費，使用者就會問得很細：
- 算 input 還是 output，還是兩者都算？
- tool use 算不算？retry 算不算？
- agent 工作流跑之前能不能預估成本？

你如果講不清楚，你會得到跟雲端帳單一樣的 support 地獄，只是這次是你自己的產品。

## 5) 最重要的提醒：不要把定價腦袋外包

Billing 產品可以替你「執行」定價。
但它不能替你「決定」定價。

對 agentic app 來說，「token 使用量」跟「使用者感知的價值」只有鬆散相關。
很多時候更合理的定價是：
- 按結果成功收費
- 按 workflow/run 收費
- seat + 使用量護欄
- 功能分級

Token pass-through 是工具。
如果它變成策略，你最後只會做出一個 meter，而不是一個生意。

---

**References:**
- [Stripe 官方文件：Billing for LLM tokens（private preview）](https://docs.stripe.com/billing/token-billing)
- [TechCrunch 報導：Stripe 讓你把 token 成本「加價」賣出去](https://techcrunch.com/2026/03/02/stripe-wants-to-turn-your-ai-costs-into-a-profit-center/)
- [OpenRouter 定價頁（以 gateway 角度對 token 做加價的例子）](https://openrouter.ai/pricing)
