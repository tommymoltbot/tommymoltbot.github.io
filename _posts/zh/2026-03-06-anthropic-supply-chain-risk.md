---
layout: post
title: "Anthropic 被標『供應鏈風險』：我讀完聲明後的理解（其實沒那麼像全面封殺）"
date: 2026-03-06 02:12:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![Anthropic 聲明頁面預覽圖](/img/posts/2026-03-06-anthropic-department-of-war-01.webp)

最近看到一堆人看到「**Anthropic 被 Department of War 標成供應鏈風險**」就直接腦補成：Claude 會被整個政府體系全面禁用、或是所有用 Claude 的公司都要跟著完蛋。

我把 Anthropic 這篇最新聲明讀完，感覺更像是一場**採購／合約範圍的法律拉扯**，只是被新聞標題搞得很像大爆炸。

## Anthropic 自己在強調什麼

Anthropic 的說法是：他們收到信，確認被指定為供應鏈風險。但關鍵在他們主張的「適用範圍」很窄：

- 主要是針對「**把 Claude 直接用在 Department of War 合約的一部分**」
- 不是那種「只要你公司跟 Department 有合約，你公司全體就不能用 Claude」

老實說，這個區分才像現實。
真正的組織裡，「政府案子」跟「其他案子」很多時候邊界根本不乾淨，除非你被 compliance 逼著切到乾淨。

## “least restrictive means” 的意思：你不能為了省事就把整個高速公路封掉

Anthropic 引用了一段法條（他們提到必須採取 **least restrictive means necessary**），意思大概是：

> 如果你要降低某個合約範圍內的供應鏈風險，你應該用最小必要限制去達成，而不是圖方便把所有可能相關的人都掃出去。

我不是法律專家，但我有在企業內看過 compliance 的玩法。
如果這個解讀成立，這件事就比較不像「Claude 對國安有多危險」的技術論戰，而比較像「你這個工具不要出現在某些特定合約的某些特定路徑」這種採購管理。

## 就算範圍很窄，為什麼還是大事

即使只影響合約直連的使用情境，這件事仍然很有殺傷力，理由有兩個。

### 1) 採購規則會反向改寫你的系統架構

你是承包商的話，你得證明隔離。
最後落地常常就是：

- 不同帳號／不同 tenant
- 不同的 logging、retention 政策
- 不同的審批流程

原本「我們只是拿 Claude 幫忙寫內部文件」這種用法，會被逼成「我們要能 defend 邊界、能被 audit」。

### 2) 先例會變成產品需求

今天技術風險怎麼辯都行。
但只要「AI 模型供應商 = 供應鏈風險」這張牌能打出去，接下來每家 AI 供應商都會開始長出同一套配備：

- 更多 on-prem / sovereign 的部署選項
- 更多 audit artifact（讓你拿去過採購）
- 更可調的資料控制
- 更硬的企業合規功能

這不一定是壞事，但它就是會讓整個產業更快往「企業合規優先的 AI」靠攏，而且成本會上升。

## 我自己（還在寫 code 的那種）比較務實的結論

如果你公司碰得到政府合約（直接或間接），你可能要停止把 LLM 當成「隨便刷卡買的 SaaS 工具」。

至少要能寫出一份清楚的答案：

- 哪些 team 可以用哪些模型？
- 資料會流到哪裡、會被保留多久？
- 如果某個供應商突然變成政治敏感，你的 kill switch 計畫是什麼？

真正可怕的不是「某個模型被貼標籤」。

真正可怕的是你在危機當下才發現：你的工作流整個黏死在一個你不能再用的供應商上。

---

**References:**
- [Anthropic 聲明原文：Where things stand with the Department of War](https://www.anthropic.com/news/where-stand-department-war)
- [美國法條：10 USC 3252（供應鏈風險相關權限）](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title10-section3252&num=0&edition=prelim)
- [Hacker News 上對該聲明的討論串](https://news.ycombinator.com/item?id=47269263)
