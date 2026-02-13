---
layout: post
title: "AI agent 的 SLO 是副作用，不是 uptime"
date: 2026-02-13 04:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: zh
---

![一張極簡黑白插畫：控制面板上有 checklist 與一個小機器人警示圖示](/img/posts/2026-02-13-agent-slo-side-effects-01.webp)

你第一次把 agent 放進 production，多半會盯錯指標。

你會盯 **uptime**。

很合理，因為我們這幾年就是這樣被訓練的：服務要活著、endpoint 要回 200。

但 agent 這種東西，「活著」不代表「可靠」。
它可以在**完全正常**的狀態下，悄悄地：花錢、出錯、惹人。

如果要我用一句話講清楚差異，我會這樣說：

```text
對 agent 來說，可靠性不是 availability，而是副作用（side effects）
```

## Uptime 是陷阱指標

API 掛了很好發現。
agent 亂來，反而常常像「正常輸出」——直到後果出現。

最常見的「全部監控都綠色」災難：

- 發到錯的群組 / 頻道
- 開 ticket 少了關鍵欄位
- commit 到錯的 branch
- tool call 重試迴圈跑到燒預算
- 摘要明明是對的，但對象完全搞錯（寫給工程師的內容丟給客戶）

更麻煩的是：這些很多是 **成功執行**。

tool call 回 200。
訊息真的送出了。
PR 真的 merge 了。

Uptime 對這些幾乎沒感覺。

## 把「副作用」當成你真正承諾的東西

SRE 的問題還是有用，但你得翻譯成 agent 的語言。

不要只問「服務在不在」，改問：

- **副作用有沒有去對地方？**（allowlist：repo、domain、channel）
- **副作用長得對不對？**（schema validation、必填欄位、格式規則）
- **副作用頻率對不對？**（rate limit、cooldown、dedupe window）
- **副作用能不能回滾？**（delete/edit、rollback、補償性動作）
- **副作用能不能稽核？**（tool calls + outputs 的 trace）

答不出來就不是「不夠成熟」。
那叫把一隻有 credentials 的 chaos monkey 放進公司流程。

## 我會怎麼寫一個「agent 版本」的 SLO

SLO 不是哲學。
它應該是你真的可以拿來 on-call 的東西。

我常用的模板長這樣：

### 1) 副作用正確率（主指標）

先定義你的副作用單位：message、ticket、commit、或資料列寫入。
然後量：

- **% 副作用去到正確目的地**
- **% 副作用通過輸出驗證**（schema + 基本 business rules）

這個掉下去就該 page。

### 2) 副作用預算（護欄）

agent 會用「很努力」的方式幫你花錢。
所以預算要設成 fail-closed：

- 每次 run 最多 tool calls
- 每次 run 最多 tokens
- 每個 tool 最多 retries
- 每天整條 pipeline 的 max $ 成本

碰到上限就直接停，並且把事故講清楚。

### 3) 人類信任（落後指標）

這是軟指標，但 agent 會不會死，常常就死在這裡。

我會追：

- 人類有多少比例會 edit / delete agent 的輸出
- 「撤銷」動作：revert commit、reopen ticket、刪訊息
- 從 agent 做出副作用到人類修正的 time-to-correct

不是拿來檢討人，是拿來抓「系統開始漂移」的早期訊號。

## 你越不信 model，就越該信 contract

我最近一直卡在這句話上，因為它是少數可以 scale 的解法：

- tool contract 要 version
- 輸出要先驗證再落地成副作用
- trace 要留到能 replay

如果 agent 是 probabilistic policy，contract 就是軌道。

是很煩沒錯。

但比起早上醒來發現：系統完全可用、而且完全做錯了 300 次 —— 便宜太多。

## References

- [上一篇：跑 AI agents 需要 runbook（不是 vibes）](/zh/2026/02/13/ai-agent-xu-yao-runbook-bu-shi-vibes.html)
- [Google SRE book（SLO 的概念來源）](https://sre.google/sre-book/service-level-objectives/)
