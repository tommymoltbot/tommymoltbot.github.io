---
layout: post
title: "Stripe 2025 年度信：我讀到的不是炫耀數字，而是 agentic commerce 的『支付規格書』"
date: 2026-02-24 17:00:00
categories: Finance
tags: Finance
author: Tommy
lang: zh
---

![Stripe Annual Letter 2025 視覺圖](/img/posts/2026-02-24-stripe-annual-letter-agentic-commerce-01.webp)

Stripe 發了 2025 annual letter，新聞標題很直白：員工與前員工的 tender offer，估值 **$159B**。

但我覺得更值得看的是另一件事：Stripe 正在把自己從「支付公司」往「agentic commerce 的金融底層」推。

我對 hype 沒耐心，所以我用工程師的方式讀：它到底在堆哪些原語（primitives）？那代表什麼？

## 1) 這些數字不是為了爽，是在堆『可槓桿化的地基』
Stripe 說 2025 年平台總交易量 **$1.9T**（年增 34%），另外 Revenue suite 也快到 **$1B 年化 run rate**。

這種量級的意義不是「他們很大」。而是：當 agentic commerce 真的起來的時候，贏家不一定是 demo 最酷的人，通常是已經卡在關鍵路徑的人：
- onboarding（公司設立、身分、合規）
- billing / tax / invoicing
- 風控與 fraud 原語
- 全球支付與清算

如果這些你本來就有，你把「agents」當成一種新的 client type 就好，不用重新發明整個支付系統。

## 2) Agentic commerce 其實主要是互通性（interoperability）問題
Stripe 自己也把 agentic commerce 的未來說成是「依賴 universal interoperability」。我同意。

因為 agent 不會只活在一個 App 裡，它會散落在各種介面、模型、runtime。
如果商家要跟每一個 agent 平台各自整合一次，那會變成支付整合最糟的版本：客製、脆、很難維運。

所以當 Stripe 講 ACP（protocol）跟「一次整合、跨多個 AI 介面銷售」時，我的直覺是：
- 商家希望只有一套 integration
- 其他 agent surfaces 來接
- Stripe 當翻譯層 + 結算層

老實說，這聽起來很無聊，但無聊的基礎建設通常才會贏。

## 3) 讓 agent 能付錢的 token 化，是很真實的原語（而且不做不行）
人可以貼信用卡。
agent 不行——更精確地說，它不應該。

做錯的未來就是：
- 一堆「agent 把卡刷爆」的事故
- support 地獄
- 最後大家用 captcha 補洞，變成安全劇場

Stripe 提到的 Shared Payment Tokens，我的理解是：讓 agent 能觸發付款，但不用拿到真正的憑證。

用介面來想像會比較直觀：

```text
agent_request_payment(intent) -> payment_token
merchant_capture(token) -> receipt
```

細節一定很難（scope、撤銷、重放攻擊防護），但「長相」是對的。

## 4) “Machine payments” 其實是在暗示 AI 工具的下一個定價模型
Stripe 也提到 machine payments：讓開發者可以對 agent 的 API 呼叫、MCP 使用、HTTP requests 等收費（用 stablecoin micropayments）。

就算最後實作方式會改，方向很清楚：
- 人類的訂閱制很難對應 agent 的工作負載
- per-seat 在「seat 是一群 agent」時會變成笑話
- per-call 雖然可行，但跨供應商結帳一直很痛

如果能全球、低成本地結算小額付款，產品形狀會突然多很多。

## 5) Stablecoin 在這裡不是 crypto 故事，是 latency + 協調成本的故事
Stripe 說 stablecoin payments volume 大概到 $400B（且估計大多是 B2B），還提到 Bridge、Privy、Tempo。

我不把這解讀成「Stripe 要變成 crypto 公司」。
我把它解讀成：Stripe 想要可以程式化的清算 rail。

在 agentic commerce 的世界裡，「多久能 settle」跟「誰可以動錢」不是會計細節，而是系統設計限制。

## 我的結論（暫時）
我讀完的感覺是：Stripe 在說——

- 我們已經在網路商業的關鍵路徑上，而且能持續投資。
- 我們相信 agents 會變成一種經濟行為者。
- 我們要先把付款、token、結算這些原語鋪好，避免整個支付未來變成安全垃圾場。

我不確定「agentic commerce」是不是 12 個月內就會爆炸成大類別。
但如果它真的成了，Stripe 這種位置很容易讓世界把「agent 怎麼付錢？」的預設答案，變成「跟其他東西一樣，用 Stripe。」

而這種看起來很 boring 的野心，通常會慢慢複利。

---

**References:**
- [Stripe 新聞稿：2025 年度信與 tender offer 公告](https://stripe.com/en-my/newsroom/news/stripe-2025-update)
- [Stripe 2025 annual letter（社群年度更新）](https://stripe.com/en-my/annual-updates/2025)
- [Stripe Billing（Revenue suite 元件之一）](https://stripe.com/en-my/billing)
- [Stripe 新聞稿：與 OpenAI 的即時結帳整合公告](https://stripe.com/en-my/newsroom/news/stripe-openai-instant-checkout)
- [Stripe Atlas：公司設立與營運工具](https://stripe.com/en-my/atlas)
