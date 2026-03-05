---
layout: post
title: "五角大樓的『供應鏈風險』標籤：一種全新的鎖喉點（而且跟你程式碼乾不乾淨沒什麼關係）"
date: 2026-03-05 21:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![The Pentagon](/img/posts/2026-03-05-pentagon-anthropic-supply-chain-risk-01.webp)

企業軟體圈有一種很特別的恐慌感，通常不是來自 bug，而是來自這句話：

> 「等等，我們是不是 *不能* 用這個 dependency 了？」

根據 Bloomberg（TechCrunch 引述）的報導，美國國防部正式通知 Anthropic：他們被標記成 **「供應鏈風險（supply chain risk）」**。

這件事我覺得最詭異的地方不是政治立場（那一塊一定會吵翻），而是它用的不是輿論武器，而是 **採購機制**。

「供應鏈風險」不是一篇聲明稿，也不是道德審判。它比較像是一個 procurement 的開關。

而且這句話很致命：**跟五角大樓合作的公司或單位，可能需要證明自己沒有用 Anthropic 的模型。**

對工程師來說，這不是「辯論」。這是「要不要改架構」的問題。

## 為什麼這會直接打到工程師

我們習慣把「供應鏈風險」理解成：
- npm 上被投毒的套件
- CI/CD pipeline 被入侵
- signing key 外流

但這次的故事更像是：
- **供應鏈的風險源頭變成模型供應商本身**
- 風險定義不是 CVE，而是「你跟誰做生意」

你程式碼寫得再乾淨，也可能因為 checklist 上寫了「不准用 Claude」而直接 fail。

這是一種新的 choke point。

## 我一直在想：這種標籤是會『傳染』的

你只要賣過大客戶就懂：合規從來不是「我們怎麼做」，而是「我們的供應商怎麼做」。

所以這件事不只等於：
- 「我們不能直接呼叫 Anthropic API」

也可能等於：
- 「我們的客戶（或客戶的客戶）不能被看到用了『依賴 Anthropic』的那整條 stack」

這會逼大家走向兩種生存策略：

### 1) 把模型藏在平台層後面
軟體供應商會很想說：
- 「你買的是我們的產品，不需要知道底下是哪家模型。」

這聽起來像「簡化」，但實際上就是用合規當理由的 vendor lock-in。

### 2) 自己做一層『可切換』的模型抽象
真正要交付的人通常會反著做：
- prompt / tool contract 盡量可移植
- 把模型當成可替換的 backend
- 做好 eval harness，確保你換模型不會整個爆

因為當政策跑得比架構快，你唯一穩定的策略就是：**讓換供應商變便宜。**

## 政策爭議很亂，但工程後果很清楚

TechCrunch 的描述是：Anthropic 拒絕讓軍方用他們的 AI 做（例如）國內大規模監控，或沒有 human oversight 的全自動武器；而國防部則主張不該被私人承包商限制。

這裡可以吵倫理、吵法律、吵立場。

但工程師真的會遇到的版本是：
- security review 多了一條「模型供應商」
- compliance / legal 信件最後一句是「本週五之前移除」
- 架構圖要多一個方塊：model provider，旁邊標紅綠燈

## 我的看法：『AI 供應鏈』這個詞現在是真的了，而且一定會被濫用

好的那一面是：供應鏈控管本來就該保護真實系統。

壞的那一面是：「供應鏈風險」可能變成一個很鈍的工具，用來懲罰不配合的供應商；然後整個產業學到的教訓是：*不要當那個說不的人。*

不管哪種版本，對做產品的人來說結論都很 boring：

- 把你的模型依賴清單搞清楚。
- 把客戶的合規約束搞清楚。
- 架構設計要能快速換供應商。

這些都很無聊，但就是這種無聊的工程工作，最後會決定你能不能出貨。

---

**References:**
- [TechCrunch：五角大樓將 Anthropic 標記為供應鏈風險的報導](https://techcrunch.com/2026/03/05/its-official-the-pentagon-has-labeled-anthropic-a-supply-chain-risk/)
- [Hacker News 討論串（補充脈絡與社群反應）](https://news.ycombinator.com/item?id=47266084)
- [Wikimedia Commons：五角大樓照片（CC BY-SA，本文首圖來源）](https://commons.wikimedia.org/wiki/File:The_Pentagon,_Headquarters_of_the_US_Department_of_Defense_(cropped2).jpg)
