---
layout: post
title: "科技沒有在變快，它在脫皮：API Surface 變小之後的 Reliability 稅"
date: 2026-01-30 21:15:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![Fragile Stack](/img/posts/tech-fragile-stack.webp)

我們一直在講「科技很快」。

但我最近看到的比較像：科技在 **脫皮**。

API 比理解它的人更快被 deprecated。SDK 一層包一層。平台宣稱「簡化」，實際上是在把逃生口封起來；每次有人說這是為了「developer experience」，我腦中都會響警報。

因為真正付代價的不是平台，是跑 production 的人。

我不是懷舊派。以前也很亂。但現在的脆弱很特別：**我們正在失去可靠的介面**。

## 共同劇本：surface area 變小，控制變大

很多大型平台在做同一件事：

- 官方路徑變窄
- 把你推去「推薦做法」
- 拿走底層存取
- 用 managed service 把複雜度蓋起來

文件上看起來是降低認知負擔。

現實是：把 failure mode 從「我能 debug」變成「我看不到、也摸不到」。

出事的時候你不是修，你是開 ticket 等。

這不是簡化，這是依賴。

## Reliability 不會轟然倒下，它會死在「少了旋鈕」

在 production 我大概把工程師分兩種：

- 做 feature 的
- 讓系統活著的

平台通常優化前者，因為他們人多、聲量大。

後者人少、比較悲觀、但往往比較接近真相。

當平台把旋鈕拿走——timeout、retry policy、queue 設定、連線池、隔離策略——它不是拿走複雜度，它是拿走你 **駕馭複雜度的能力**。

系統會變得「很容易用」，直到你遇到：

- partial outage
- region degrade
- read-after-write 不一致
- noisy neighbor
- quota 波動

然後你才發現你在一個密封盒子裡。

## 一種很難講出口的架構：Support-driven architecture

這就是很多人其實正在建的東西：

1. 你用 managed service，因為它看起來是 best practice。
2. 服務以你的 SLA 沒涵蓋的方式失效。
3. 你的 mitigation 是開 ticket + 寫 workaround。
4. 久了你整個系統變成 workaround 堆疊。

最後你不是在 engineering，你是在談判。

我看過團隊花幾個月建「韌性層」，而那層存在的唯一理由是平台把可觀測性砍掉。

一點都不酷，也不創新，就是新的稅。

## 平台為什麼要這樣做？因為他們想要可預測

平台給開發者太多權力，結果通常是：

- 奇怪的 workload
- 不可預測的成本曲線
- 安全事故
- 支援地獄

所以平台會限制能力，降低變異。

對平台來說合理。

對你來說就是：你還是得背 edge case，但你少了工具。

Outage 仍然會來。

你只是少了 lever。

## 我現在怎麼評估一個平台

我有一個很粗暴的 checklist，沒過我就當它以後一定會害我：

1. **我能不能不求人就拿到 raw logs / traces？**
2. **timeout / retry 能不能明確設定？**
3. **錯誤碼是 deterministic 的，還是「something went wrong」？**
4. **我能不能在 production 外做隔離重現？**
5. **平台 degrade 時，我能不能讓系統優雅降級？**

大多數答案如果都是「不行」，那不是簡化，是解除武裝。

## 務實立場：你要保留自己的逃生口

我不是在喊「全部自架」。我是說：你的 Plan B 不能只存在 PPT 上。

真正有效的做法通常很無聊：

- 把平台關鍵呼叫包在你自己的 interface 後面
- 你得存足夠狀態，能 replay / recover
- idempotency / dedupe 要在你這一層做好
- 留一條 migration path（就算很醜）
- 定期做災難演練：假設平台真的掛了

不帥。

但 reliability 本來就不帥。

Reliability 是「刻意變得無聊」。

## 我不太喜歡但只能接受的結論

整個產業正在往：控制、成本可預測、降低法律責任 這個方向優化。

開發者得到更漂亮的 docs。

工程師得到更少的旋鈕。

所以如果你在做 production 系統，你要假設：很多平台會同時變得 **更好用** 也 **更不透明**。

我的策略很簡單：

- 享受效率
- 不信任介面
- 以 failure 為前提設計

因為密封盒子在凌晨三點裂開時，平台不會醒。

你會。
