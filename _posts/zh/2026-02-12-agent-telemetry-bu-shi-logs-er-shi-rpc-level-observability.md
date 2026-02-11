---
layout: post
title: "Agent telemetry 不是 logs，是 RPC 等級的可觀測性"
date: 2026-02-12 01:00:00 +0000
categories: [Engineering, Tech]
tags: [Engineering, Tech]
author: Tommy
excerpt: "只要 agent 會 call tools，你就是在跑分散式系統。你需要 trace、budget、contract，而不是事後 grep 一堆 log。"
image: /img/posts/agent-telemetry-waterfall.svg
lang: zh
---

我最近一直看到同一種「agent 死法」：

- demo 很順
- 上線開始怪
- postmortem 變成挖骨董：大家在 log 裡考古

然後所有人都在講「要多打點 log」。

不。

只要 agent 能 call tools，你其實已經在跑一個分散式系統了。你需要的不是更多 logs，你需要的是 **telemetry（可觀測性訊號）**。

這差別不是哲學，是你能不能把系統當 production 在養。

## 我用五個角度確認自己沒在自嗨

1) **商業角度：** agent 一旦能花錢（token / API），你要能解釋「錢去哪了」。

2) **系統角度：** tool call 就是 RPC。沒有 end-to-end trace，你就是瞎子。

3) **歷史角度：** microservices 的坑十年前就踩過。呼叫者換成 LLM，不會讓物理定律改寫。

4) **工程師角度：** debugging 如果要「重跑對話」才看得懂，你做出來的是靈異系統。

5) **我自己的底線：** 60 秒回答不了「發生什麼事」，就不算能上線。

## Logs 只告訴你印了什麼；Telemetry 才告訴你發生了什麼

Logs 是字串。

Telemetry 是結構化且可關聯的訊號，讓你能把一次 request 的全路徑拼回來：

- request id
- 哪個 model 被叫了
- 哪些 tools 被叫了、順序是什麼
- 每一步花多少時間
- 成本是多少
- 哪裡 fail、哪裡 retry

講白一點：你要的是 trace。

如果只有 logs，你最後會卡在這種問題：

```text
"到底是 tool 慢，還是 model 想太久？"
```

然後你沒有穩定答案。

## 把 tool call 當 RPC：spans + attributes + budgets

最直覺的 mental model 是：

```text
user request
  -> agent span
     -> llm.call span
     -> tool spans (http.fetch / db.query / browser.act / exec)
     -> write spans (cache / queue / storage)
```

每個 span 都記一些你可以做統計的欄位：

- `trace_id` / `span_id` / `parent_span_id`
- `name`（tool name / model name）
- `duration_ms`
- `status`（ok/error/timeout）
- `attempt`（重試次數）
- `cost`（tokens、$）
- input/output 的 **digest**（hash、大小），不是直接把秘密寫進去

然後補上 budgets（護欄）：

- 每個 request 最多 tool calls
- 每個 request 最多 dollars / tokens
- 最長 wall-clock time
- per-tool circuit breaker

沒有 budgets，「autonomous」就只是「無上限」。

## 最常見的坑：為了可觀測性，把 prompt 全部存起來

很多團隊會用「把完整 prompt + tool input 全部寫進 log」來換可觀測性。

那不是 observability，那是一場等著發生的資料事故。

比較安全的做法是：

- 預設只存結構化 metadata
- payload 需要另外開 gate（sampling / redaction / short retention）
- 用 digests 去做關聯與去重，但不洩漏內容

你能在不蒐集敏感資料的前提下定位事故原因，才是真的成熟。

## 另外一個重點：contract 比 prompt 更重要

agent 其實常常死在很無聊的地方：

- tool schema 改了
- tool 回傳 shape 微妙變了
- best-effort endpoint 被 rate limit
- browser automation 開始 timeout

你不把 tools 當合約在管，就會把「整合漂移」怪到 model 頭上。

所以我在 production 最在乎的是：

- tool versioning
- stable schemas
- 明確的 error taxonomy
- idempotency keys

這些才是讓你不要抓鬼的東西。

## 我的簡單判斷

這三題答不出來，你就還沒做出 telemetry：

1) agent 做了什麼？
2) 時間花在哪？
3) 錢花在哪？

能答出來之後，你才有資格去討論有趣的事：model 選擇、prompt 風格、tool 品質、產品體驗。

在那之前，都是猜。

---

## References

- [OpenTelemetry：Trace 的概念與術語](https://opentelemetry.io/docs/concepts/signals/traces/)
- [OpenTelemetry 規格（資料模型與語意）](https://opentelemetry.io/docs/specs/)
