---
layout: post
title: "AI agent 上線需要 runbook（不是靠 vibes）"
date: 2026-02-13 03:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: zh
---

![一張乾淨的黑白插畫：runbook 勾選清單，上面有個小機器人圖示](/img/posts/2026-02-13-agent-runbooks-01.webp)

大家都喜歡 agent 的 demo 階段。

你把模型接上幾個工具，給它一點權限，它就能幫你訂會議、開 PR，你腦袋會立刻冒出一句：「好，未來到了。」

然後你把它放進真實環境跑。

氣氛就變了。

因為一旦 agent 可以採取行動，你其實是引入了一種新的 production system：

- 會跟不穩定的外部 API 講話
- 會留下 side effect（發訊息、開 ticket、commit）
- 壞掉的時候長得像「它剛剛做了怪事」
- 還帶點機率性，導致可重現性變成一個專案

這時候，問題不是「模型夠不夠聰明」。

問題是：

```text
3am 出事的時候，我們要怎麼處理？
```

## 沒有 runbook 的 agent，就是 pager duty 稅

你如果回答不了一些基本營運問題，那你其實沒有產品。
你只有一台「抽獎式」pager 機器。

我會先看這幾個問題有沒有被講清楚，才會相信 agent 可以上線：

- **怎麼立刻停下來？**（kill switch、停排程、撤 token）
- **怎麼知道它剛剛做了什麼？**（可稽核的 tool call + output 紀錄）
- **怎麼重播同一次 run？**（inputs、版本、model id、tool contract version）
- **爆炸半徑怎麼切？**（scope、allowlist、需要人工批准的步驟）
- **健康是什麼意思？**（不是靠「目前沒人靠北」的那種 SLO）

這些沒做，incident 最後一定會變成「誰最會講故事」。

## 失敗型態都很無聊——所以團隊會忽略

多數 agent 的失敗不是科幻。
它其實就是你熟悉的老問題，只是外面包了一層新皮。

### 1) Tool drift（介面變了，agent 不知道）

API 多了一個必填欄位、HTML 改版、登入流程換掉。

agent 不會像人一樣說「我卡住了」。
它會開始產出一堆看起來合理、但其實是垃圾的結果。

如果你的工具介面本質上是：

```text
call_tool(name, payload) -> result
```

那 **真正的系統是這個 call 的 contract**。
你要 version、要測試，把「tool output 形狀」當成 breaking change。

### 2) 部分成功，看起來像成功

它有發訊息，但附件錯了。
它有開 ticket，但缺了 escalation label。
它有 commit 修正，但 commit 到錯的 branch。

你沒有做 post-action verification，就只能等人類發現。

### 3) 慢性成本爆炸

agent 很擅長「我再試一次」。
所以它也很擅長花錢。

沒有 budget guardrail 的話，你會很快體驗到什麼叫 runaway retry loop。

## 我會怎麼寫一份 agent runbook（實用版）

不是 40 頁 PDF。
是一份真的拿來救火的 runbook。

### A. Kill switch（你需要不只一種）

- 停 scheduler / cron
- 撤掉工具 token
- 降權限（fallback scope）
- 把 tool call 轉進 sandbox mode

### B. Incident triage 清單

看到不對勁時：

- 找出**最近 N 次 run**與結果
- 對「預期」跟「實際」留下的 side effect 做 diff
- 找到第一個壞掉的 tool call（不是最後那個）
- 確認當下的 model version + prompt revision

### C. 最小可重播條件

要能重現一次 run，你至少得記：

```text
inputs + tool outputs + model id + prompt version + tool contract versions
```

我不在乎你叫它 trace、span 還是 event log。
你重播不了，就 debug 不了。

### D. 不靠模型「自律」的 guardrails

- 目的地 allowlist（repo、channel、domain）
- rate limit
- 高影響 action 要求人工批准
- 工具輸入/輸出做 validation

## 重點不是讓 agent 變弱

runbook 不會降低能力。
它降低的是 *entropy*。

我見過最穩的 agent 產品團隊，行為很像 ops：

- 預設 partial failure 是常態
- 預設 drift 一定會發生
- 預設 demo 不是證據

老實說，這是 agent 最無聊的一段。

但也正是最重要的一段。

## References

- [Google SRE 書：incident management 基礎](https://sre.google/sre-book/managing-incidents/)
- [NIST 最小權限原則（存取控制）概覽](https://csrc.nist.gov/projects/role-based-access-control)
