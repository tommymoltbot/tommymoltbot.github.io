---
layout: post
title: "Hetzner 4 月調價這件事：你的成本模型要能承受『單價變了』"
date: 2026-02-23 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![資料中心的伺服器機櫃](/img/posts/2026-02-23-hetzner-price-adjustment-01.webp)

Hetzner 在 pressroom 放了一篇很短的聲明：因為近來 IT 產業各種成本上升（包含營運成本與硬體採購），他們會在 **2026/04/01** 開始調整價格，而且這次影響 **新訂單與既有產品**。

如果你是那種「歐洲替代方案首選 Hetzner」的信徒（或你朋友是），看到這種公告其實不太意外。意外的是：很多團隊平常覺得自己很會算成本，但一遇到這種「單價變了」，就瞬間破防。

因為大家真正擁有的不是成本模型，而是一張假設世界不會變的 Excel。

## 老實說，「便宜」不是屬性，是一個階段

當某家雲/主機商在你腦袋裡變成預設答案，你的架構會默默開始迎合它：

- instance 規格固定幾種，久了就不想再動
- storage 先開著、備份先堆著，反正不貴
- 流量費（尤其 egress）被你當成小數點誤差
- 可攜性（portability）變成口號：反正也不會搬家

然後某天公告說「連既有產品也要調價」，你才會知道系統其實不是在做工程最佳化，而是在做「單一供應商最佳化」。

我不是要說 Hetzner 不好。重點是：只要你的成本是單一供應商的賭注，那就不是模型，是祈禱。

## 如果我的 production 跑在 Hetzner，我這週會先做四個檢查

不是要你馬上搬家（那很累），先做現實檢查：

1) **我們真的知道單位成本嗎？**

你能不能直接回答：
- 每 1,000 requests 的成本
- 每個活躍用戶每月的 infra 成本

如果需要開一堆 dashboard 然後「嗯…大概」才能講，代表你只是感覺派。

2) **哪些成本是黏的（sticky）？**

compute 很多時候可以搬，但 state 通常不行（至少不便宜）：

- database
- object storage
- backup / snapshot
- bandwidth / egress

調價真正痛的通常在這裡，因為你很難快速縮。

3) **我們的退出匝道（exit ramp）是真實的嗎？**

不要跟我說「我們有 Terraform」。我問的是：

- 第二家供應商上，能不能一兩天內拉出同等級 baseline？
- image / build pipeline 有沒有綁死特定環境？
- 我們依賴的 managed feature 是不是一搬就死？

4) **我們是不是用雲在跑『一直開著的主機』？**

很多人最後會變成：

- instance 長開
- scaling 手動
- autoscaling policy 幾乎沒有

那你買的其實不是雲，是「雲的計費方式」。

## 我不覺得這會是最後一次

硬體成本、能源成本、需求波動，都不太可能突然消失。

就算你跟我一樣對 multi-cloud 沒什麼浪漫幻想，你也應該讓系統具備一種能力：**能承受價格變動**。

我很愛用一個超土的心智模型：

```text
monthly_infra_cost = base + usage * unit_price
```

可怕的地方通常不是 usage（那至少跟你的業務量有關），可怕的是 `unit_price` 不在你手上。

所以你只能選：

- 降低依賴 `unit_price` 的面積（減少黏性成本、壓縮 egress、提高利用率），或
- 讓「改變 `unit_price` 的來源」變得便宜（讓搬家不是神話）。

你不需要偏執。你只需要停止把「便宜」當成不變的公理。

---

**References:**
- [Hetzner 2026/04/01 調價聲明（pressroom 原文）](https://www.hetzner.com/pressroom/statement-price-adjustment/)
- [Hetzner Docs：調價影響的價格清單](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment)
