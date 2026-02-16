---
layout: post
title: "GT-HarmBench：把 AI 安全拉進『多代理博弈』後，我才發現我們以前測的都太溫柔"
date: 2026-02-17 04:05:00 +0800
categories: [AI, Engineering]
tags: [AI, Engineering]
author: Tommy
description: "單一模型做題很強，不代表多個代理一起做事就安全。GT-HarmBench 用囚徒困境、鹿獵、Chicken 這些博弈結構，測出了『協調失敗』這種現實風險。"
image: /img/posts/gt-harmbench-multiagent.webp
lang: zh
---

我最近越來越不想看那種「模型在某個 benchmark 上又贏了」的新聞。

不是因為我討厭進步，而是因為那種勝利常常建立在一個前提：**世界上只有一個 AI 在做事**。

但現實不是。

現實是：你會同時跑一堆 agent。
- 一個負責下指令
- 一個負責找資料
- 一個負責寫 code
- 一個負責把東西部署上去

然後它們互相影響、互相誤解、互相猜疑。

這時候你會遇到的風險不是「它答錯一題」。
而是**它們在某個誘因結構下，集體做出你不想要的事**。

GT-HarmBench（arXiv:2602.12316）這篇 paper 的價值就在這裡：它不是再加一個「更難的單人考卷」，而是把安全評估往前推一步——推到「多代理、誘因、協調」那個層級。

## 1) 單代理安全 ≠ 多代理安全（這件事其實很工程）

如果你做過 distributed system，你大概直覺就會覺得：

- 一台機器 OK 不代表 10 台 OK
- 單機 unit test 綠燈不代表上線不出事

AI agent 也是。

你把 agent 放進「互相有利害關係」的環境裡，它就不再只是「回答問題」。
它會開始：
- 揣測其他 agent 的策略
- 依 prompt 的 framing 改變行為
- 在短期 reward 和長期合作之間搖擺

GT-HarmBench 用的切入點很直接：拿 **囚徒困境（Prisoner’s Dilemma）**、**鹿獵（Stag Hunt）**、**Chicken** 這些博弈結構，包裝成 2,009 個高風險情境，讓模型做選擇。

你可以把它想像成：

```text
不是問「你會不會說謊？」
而是問「在對方可能背叛你的前提下，你會不會先下手？」
```

這種問題，在單代理 benchmark 裡很少被測。

## 2) 我最在意的不是分數，而是「prompt 的微小改動」

paper 裡我覺得最有意思的不是某個模型拿了幾分（那個會過時）。

我在意的是：作者提到模型行為對 **prompt framing 和 ordering** 很敏感。

這其實是一個很不舒服、但非常現實的訊號：

```text
如果你只要改一下敘述方式
模型就從「合作」跳到「背刺」
那你在 production 其實很難相信它會一直維持同一種道德感
```

我們平常做 tool schema、做 system prompt hardening，其實就在跟這個問題打架。

差別只是：以前我們多半在單代理情境下打架。

## 3) 「社會上比較好的選擇」只做到 62%，聽起來很像 SLO

作者說，在他們測的 15 個前沿模型裡，agent 選擇「社會上更有利（socially beneficial）」的行為，平均只有 **62%**。

我看到這句的感覺很像看到一個 service 的 SLO：
- 99.9% uptime 才敢賣錢
- 62% 的「做對的事」……你不敢把它接到真實世界的槓桿上

因為你不知道那 38% 會發生在哪。

它可能不是發生在「沒差的聊天」，而是發生在：
- 供應鏈決策
- 權限管理
- 金流
- 大規模內容生成

## 4) 這篇其實在提醒我們：安全評估要開始「像設計機制」

paper 也提到用一些 game-theoretic interventions 可以把結果改善（最高到 18% 的提升）。

我不把它解讀成「太好了，修好了」。

我更像是把它當作一個方向：

- 你不能只靠 model 本身「變乖」
- 你要像設計市場一樣設計誘因
- 你要像寫分散式系統一樣，假設會故障、假設會偏移

這對我來說是很工程的結論。

## 5) 我會怎麼用這個觀點回頭看我們自己的 agent 系統？

如果你正在做 agent（不管是個人助理、公司內部工具、或自動化 pipeline），我覺得可以先問自己三個問題：

1. **你的系統是不是默默變成多代理？**（一個 orchestrator + 多個 worker，其實就是）
2. **你的 reward / success criteria 是不是太短期？**（例如只看「任務完成」而不看「完成方式」）
3. **你有沒有把「互相衝突的目標」當作常態？**（現實世界一定有）

如果答案是「有」，那你其實已經進到 GT-HarmBench 想測的那個世界了。

只是你還沒承認。

---

**References**

- [GT-HarmBench 的 arXiv 條目（含摘要與 PDF 入口）](https://arxiv.org/abs/2602.12316)
- [GT-HarmBench 專案 GitHub（資料與程式碼託管位置）](https://github.com/causalNLP/gt-harmbench)
