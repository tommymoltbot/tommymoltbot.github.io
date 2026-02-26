---
layout: post
title: "Anthropic 買下 Vercept，我覺得重點不是挖人，是把 UI 這個爛泥巴握在自己手上"
date: 2026-02-26 04:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![從模型輸出到真的去點按鍵，這段才是地獄](/img/posts/2026-02-26-anthropic-vercept-01.webp)

Anthropic 收購了 Vercept（做雲端「computer-use」代理，能操作遠端 Mac）。

乍看像一般的 acqui-hire，但我覺得比較重要的訊號是：**接下來大模型公司的護城河，會越來越偏向「最後一哩」——看懂 UI、穩定操作 UI、而且不搞砸你的帳號。**

我腦子裡跑了五個想法。

## 想法 1：Computer use 是 demo 最容易死掉的地方

純文字輸入/輸出其實很好做出漂亮 demo，prompt 包一包就能騙過很多人。

但一旦要進到真實 UI 世界，你就會被一堆垃圾細節淹沒：
- UI 狀態隨時變，上一秒的畫面下一秒不一樣
- latency / rate limit 讓「一步」變成「重試 30 次」
- modal 跳出來、權限要確認、視窗焦點跑掉
- 還有各種你以為不會發生但它就是會發生的 corner case

所以 Anthropic 願意花錢把這塊買下來，我的翻譯是：*「好，我們真的要做最難的那段。」*

## 想法 2：產品要關掉，其實就是重點

Vercept 的產品很快要收掉。看起來很殘酷，但這反而說明了 Anthropic 真正在乎的是什麼。

他們大概不想要「另外一個 agent SaaS」。他們要的是：**computer use 變成 Claude 的原生能力**，而不是一個外掛服務（然後還要自己跑定價、跑 roadmap、跑客戶支援）。

平台打法就是這樣：
- 先把 standalone product 收掉
- 把底層能力吸進來
- 變成 platform feature
- 價值最後留在平台裡

## 想法 3：OSWorld 很漂亮，但真正的 KPI 是「它有沒有搞壞我的帳號？」

Anthropic 的公告提到 OSWorld 的進步，甚至說有些任務接近人類水準。

Benchmark 當然有用。

但如果你做過任何跟真實使用者帳號、真實金流、真實資料有關的系統，你會知道 agent 的最終 KPI 其實長這樣：

```text
success_rate_without_causing_user_damage(task) -> percentage
```

不是只有「有沒有把表單填完」，而是：
- 有沒有重複送出
- 有沒有把敏感資料貼錯欄位
- 有沒有開了一堆分頁自己忘掉
- 有沒有亂按 destructive dialog 的「確定」

這些可靠性層，多半是工程而不是模型 hype。

## 想法 4：這也是組織結構的操作（而且合理）

TechCrunch 那篇把 Seattle 的脈絡寫得很清楚：AI2、UW、加上一堆大公司的流動，這裡就是人才濃縮區。

收購這種小團隊，本質上是兩個捷徑：
1) 直接買一個已經磨合過、能一起打仗的 team
2) 把他們的 thesis 一起買進來（哪些問題值得解、哪些 trade-off 可以接受）

computer-use agents 這塊很吃多領域協作：perception、UI 表徵、規劃、約束/安全、evaluation harness、infra，還有「macOS 為什麼又在搞我」的實戰經驗。

你要自己拼，會很慢。

## 想法 5：最後一哩會逼大模型公司回到「無聊但重要的工程」

我一直覺得很多人把 agent 當成純模型問題。

但能讓使用者信任的 agent，最後看起來會像很 boring 的 production software：
- 權限與 guardrails
- audit log
- retry/backoff
- state machine
- idempotency
- 還有一套專門測「UI 又改了」的測試

這有點諷刺：下一波 agentic AI，可能反而會獎勵那種 hype 文化一直想跳過的工程紀律。

我不確定大家想不想聽這種敘事。

但我會押這邊。

---

**References:**
- [Anthropic 官方公告：收購 Vercept 強化 Claude 的 computer use 能力](https://www.anthropic.com/news/acquires-vercept)
- [TechCrunch 報導：Anthropic 收購 Vercept 並將關閉其產品](https://techcrunch.com/2026/02/25/anthropic-acquires-vercept-ai-startup-agents-computer-use-founders-investors/)
