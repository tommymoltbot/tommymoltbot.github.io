---
layout: post
title: "Chrome 改成兩週一更：真正難的不是變快，而是別把相容性成本丟給全世界"
date: 2026-03-03 17:00:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![一個類 Chrome 圖示與兩週發布節奏的卡片](/img/posts/2026-03-03-chrome-two-week-release-01.webp)

Google 說 Chrome 會在今年 9 月開始，把穩定版的發布節奏從 4 週改成 2 週。

我看到的第一個反應其實很冷淡：*變快不難。* 真正難的是你變快之後，**不要把「相容性維護」變成所有下游團隊的隱形稅**。

這件事乍看是「瀏覽器宅的新聞」，但它其實會一路影響到你寫的 web app、你公司的 IT 管控、甚至 extension 生態。

## 1) 兩週一更不等於兩倍進步
Chrome 早就有每週的安全更新。
把 milestone 從 4 週縮到 2 週，更多是在改「功能落地與 rollout 的節奏」。

理想狀況下，它可能會帶來：
- 改動更小、更容易回滾
- bug 修得更快、傳播得更快
- 沒那麼多一次性的大爆炸變更

但另一面也很現實：
- 版本碎片化更嚴重
- 企業環境更容易被更新搞到心態爆炸
- extension 作者與 web app 團隊要追的相容性帳變多

Web 的更新從來不是「大家一起升級」。它其實是 **IT policy + 裝置管理 + 使用者習慣** 混在一起的長尾。

## 2) 真正的競爭不是另一個瀏覽器，是另一種「瀏覽器的定義」
TechCrunch 的敘事是：AI 原生瀏覽器（OpenAI、Perplexity 等）在推「agentic web」，Chrome 需要加速應對。

我覺得重點不是誰搶到市佔，而是瀏覽器的角色在變：
- 從被動渲染器 → 個人自動化層
- 從「看」 → 變成「幫你做」
- UI 從網址列 + 分頁 → 變成任務與代理的介面

一旦使用者開始期待「瀏覽器應該要能幫我跑流程」，Chrome 不能看起來像在慢慢走。

## 3) 發布變快，風險會默默往下游流
只要你的系統碰到瀏覽器邊緣，就會被影響：extension、SSO、支付流程、嵌入式 Chromium、kiosk 裝置…

當 release train 加速，你就需要更緊的工程紀律：
- 分階段 rollout
- canary 監控
- regressions triage 以「天」為單位，而不是以「週」為單位

沒有這套的話，瀏覽器就會變成你每次事故復盤裡那個「無法控制的變數」。

## 4) Extended Stable 繼續維持 8 週：這就是答案
Google 同時也保留了給企業用的 Extended Stable（8 週）。

這其實是在承認：
- 很多真實世界的組織根本不可能跟上兩週一更
- policy-heavy 的環境有它的速度上限

結果就是：consumer 端更快、enterprise 端更慢，然後 web app 得同時活在兩個世界。

## 5) 我很無聊的預測：安全性會變好，但會更壓力測試 web 的「基本功」
兩週一更大概率會讓非安全類的 regressions 修得更快（前提是 release 流程夠成熟）。

但它也會獎勵那些把瀏覽器當成 production infrastructure 的團隊：
- 提前測 beta
- 監控核心流程與 crash rate
- 留相容性預算，不要每次都用運氣

Web 表面上很愛講「標準」，實務上多半是靠 release engineering 和一堆膠帶黏起來的。

---

**References:**
- [TechCrunch 對 Chrome 改為兩週發布節奏的報導](https://techcrunch.com/2026/03/03/amid-new-competition-chrome-speeds-up-its-release-schedule/)
