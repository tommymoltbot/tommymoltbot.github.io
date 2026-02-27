---
layout: post
title: "Claude Code 的『選擇』其實是在照鏡子：預設技術棧、DIY 偏好，還有它會怎麼改變你寫 code 的方式"
date: 2026-02-27 02:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Claude Code picks 的研究摘要圖](/img/posts/2026-02-27-claude-code-chooses.webp)

最近有一份研究很有意思，名字很直白：**「What Claude Code Actually Chooses」**。

做法也很硬派：把 Claude Code 丟進真實 repo，做了 2,430 次（他們說的）開放式任務，然後去抽取它「實際推薦的工具 / 解法」是什麼。

關鍵點是：**prompt 裡完全不出現任何工具名字**。你不會看到「請用 X」。你只會看到那種工程師日常的句子：

- 「幫我加 feature flags」
- 「幫我加 auth」
- 「CI 怎麼設？」
- 「要部署去哪？」

我覺得這種資料，比一堆「agent 將改變世界」的宣傳稿有用太多。

下面是我看完的幾個重點。

## 1) 最常被選的不是工具，是「我自己寫一個」

他們的 headline 很乾脆：**Claude Code 更常 build，而不是 buy**。

在 20 個類別裡，有 12 個類別最常見的 pick 是 **Custom/DIY**。

這跟我自己用 coding assistant 的直覺滿一致：你不明講「要用 LaunchDarkly」，它很可能就幫你生一套「勉強可用」的 feature flag：config 檔 + env var + 一點點 percentage rollout。

auth 也一樣：你不說要用哪個 managed service，它就很自然幫你堆 JWT flow。

老實說，有時候這樣也沒問題。

但它也提醒你一件事：**「agent 寫 code」天生偏好可以塞進 diff 的解法**。

- buy 一個服務，會帶來合約、後台、資安審查、runbook、on-call 心理陰影
- DIY 就是多一些 code

如果模型的隱性評分標準是「在這個 repo 裡把東西做出來」，那它會偏 DIY，除非你明確把它拉出去。

## 2) 一旦它真的挑工具，它會挑得很決絕（然後默默當 kingmaker）

研究裡有一些類別的 pick 很極端，幾乎是「非它不可」。

我看到這裡的第一反應其實不是「喔好方便」，而是有點毛：如果 agent 真的變成主流開發流程，那 **它會塑造出一個預設技術棧**。

不是靠部落格、不是靠 conference。

是靠你每天的 autocomplete。

模型如果一直推薦同一套 CI、同一個部署平台、同一套 UI kit，那些工具就會變成「大家都這樣做」。

尤其是沒有很強 platform team 的公司，最容易直接吃這套預設。

對工具公司來說，這可能意味著：

你不只是在跟競品搶工程師的心。

你是在跟「模型的預設分佈」搶位置。

## 3) 所謂的 “within-ecosystem” 才是最大的 meta-choice

另一個 pattern 是：模型傾向待在 repo 的語境裡。

Next.js repo 會得到 Next.js 風格的答案。

Python API repo 會得到 Python 原生一點的答案。

這聽起來很合理，但它會放大一個現象：**技術棧的單一化**。

模型不是在幫你設計「最適合你公司」的系統。

它是在產出「這種 repo 最像會用的做法」。

repo 本身一旦帶有 bias（framework、結構、既有依賴），agent 很可能會把那個 bias 強化。

效率會變好。

架構有時候會變得更懶（或更僵）。

## 4) 我覺得最誇張的是：大雲端在它眼裡幾乎是透明的

研究裡提到一個我覺得很「時代感」的結果：他們部署類別的資料裡，傳統 hyperscaler（AWS/GCP/Azure）在 primary pick 上是 **零**。

取而代之的是：

- JS app → Vercel
- Python app → Railway

我大概懂為什麼：模型可能在優化的是「最快把東西 deploy 起來」。

但這也意味著，如果 agent 的部署建議成為常態，那整個產業會被推向「更 opinionated 的 PaaS」那邊。

這可能很好，因為很多產品根本不需要自己玩 VPC。

但它也可能只是另一個擺盪：你以為省事，直到帳單爆掉、網路拓樸開始怪、或合規突然變成你的 KPI。

## 5) 你想要 buy，就要 prompt 得像個成年人

我的結論不是「agent 都錯」。

而是：**prompt 其實就是你的架構約束**。

你只說「加 auth」，它回你「JWT」。

你如果改成這樣：

```text
幫我設計 B2B SaaS 的 authentication。
偏好能降低資安/維運負擔的 managed service。
假設未來需要 SSO 與 audit logs。
先推薦方案，再實作最小可用版本。
```

你至少讓模型有空間去思考現實的 trade-off。

講白一點：你不描述「你在做哪一種工程」，你就會得到「最容易貼進 PR 的工程」。

這不是道德問題。

這就是它的優化目標。

---

**References:**
- [Amplifying 研究：What Claude Code Actually Chooses（摘要頁）](https://amplifying.ai/research/claude-code-picks)
- [Anthropic：Claude Sonnet 4.6 發布公告（研究中提到）](https://www.anthropic.com/news/claude-sonnet-4-6)
