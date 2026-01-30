---
layout: post
title: "沒有 Failure Mode 的 LLMOps 只是氛圍：我到底怎麼把模型系統做成可靠的產品"
date: 2026-01-30 21:35:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Engineering Failure Modes](/img/posts/engineering-failure-modes.webp)

我越來越覺得，很多 LLMOps 的討論像是在 cosplay。

看板、prompt 模板、eval harness（測的都是小測驗），再配上一句「只要調得夠久，production 就會乖」。

我不討厭工具。

我討厭的是那個缺席的問題：

**你的系統會怎麼壞？它壞掉時你打算怎麼辦？**

在 production 裡，reliability 不是氛圍。reliability 是一套把必然失敗轉成可承受事故的機制。

這篇我把我做模型系統時的實戰心法寫出來，偏悲觀，但是真的能救命。

## 先從 SRE 的地方開始：定義什麼叫「好」

還沒優化前，先定 SLO。

不是「準確率」。不是「更有幫助」。

是可以落地的 SLO：

- 99.9% requests 在 2 秒內回覆
- <0.1% 回覆觸發 policy 違規
- <1% tool call 進入 unknown state
- action ledger 不能有 silent data corruption

沒有 SLO，你沒有可靠性，你只有意見。

## 核心矛盾：非決定性 + side effect

LLM 本質上是非決定性。

但會寫入、扣款、改權限的 production 系統，偏偏需要決定性。

這個不匹配就是事故溫床。

所以我設計的核心規則只有一句：

> **model 可以提案，但系統必須能拒絕。**

接下來所有機制都是為了讓「拒絕」變得可行。

## 機制 1：讓每個行為都可重播（replayable）

不能 replay 就不能 debug。

所以只要是 agentic flow，我會持久化：

- user input
- model raw output
- tool request/response 原始資料
- 正規化的 decision record（我們當時相信什麼）
- 有簽名的 action ledger（我們嘗試了什麼）

很無聊。

但它會讓你不用猜。

## 機制 2：到處都是 idempotency

任何可能造成 side effect 的 tool 都要有 idempotency key。

如果工具本身不支援，我會包一層直到它支援。

因為分散式系統最常見的失敗是：**成功了，但你沒收到成功回覆**。

沒設計這點，你一定會做出重複扣款、重複寫入這種低級但致命的錯。

## 機制 3：有邊界的自治（bounded autonomy）

我不信「全自動」agent。

不是因為它做不到，而是因為自治會放大 blast radius。

我會用分級：

- Tier 0：read-only（安全）
- Tier 1：draft-only（草擬 email、PR、ticket）
- Tier 2：可回復寫入（feature flag、staged change）
- Tier 3：不可逆（錢、權限、刪除）→ 必須 human approval

自治不是二元開關，它是一種 policy。

## 機制 4：circuit breaker（對 tool，也對 model）

很多團隊會加 retry。

但他們忘了加「停下來」。

我會設：

- 每一步 max tool failure
- 每個任務 max tool calls
- 每個任務 max wall-clock
- 每個任務 max tokens

任何一個上限到，就直接 halt，並吐出 incident report。

這可以防止 runaway agent：

- 一直 spin 在失敗上
- 燒 quota
- 產出胡話
- 還用自信語氣掩蓋

## 機制 5：真正的 degrade mode（不是行銷用語）

當 model 變慢、變貴、變不穩，你怎麼辦？

如果答案是「我們 scale」，那你還沒在想 failure mode。

我會做的 degrade mode：

- 換便宜模型
- 切到 extraction-only（不做 action）
- 切到 deterministic heuristics
- 強制更多確認
- 任務排隊，延後執行

可靠性不是永遠滿血，而是失敗時仍能交付「部分價值」。

## 機制 6：用工程師方式做 eval，不要用 Demo 方式

我不太在乎 benchmark 吹牛。

我在乎的是：

- 發版後的 regression
- load 下的 tail latency
- tool-call correctness 分佈
- policy violation rate
- unknown-state rate

而且我會做反映 production 的 adversarial test：

- tool response 被截斷
- API 偶發 timeout
- 權限不足
- 指令互相衝突
- cache 資料過期

如果你的 eval 沒模擬「依賴會壞」，你是在訓練自己相信一個謊。

## 我最後常寫在白板上的一句話

LLMOps 不是 prompt engineering。

LLMOps 是 reliability engineering——只是多了一個會說話、也會用奇怪方式失敗的元件。

所以我的實戰立場很簡單：

- 假設 model 會錯
- 假設 tool 會退化
- 以 unknown state 為前提設計
- 把 blast radius 做小
- 保存 artifacts，讓你能學到東西

最後贏的團隊不會是 prompt 最漂亮的。

會是把 failure mode 當成一等公民需求的。
