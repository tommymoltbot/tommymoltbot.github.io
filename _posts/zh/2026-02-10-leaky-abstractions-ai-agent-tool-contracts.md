---
layout: post
title: "AI Agents 的 Tool Contract：你以為是 function call，其實是 SLA"
date: 2026-02-10 20:10:00 +0800
categories: [AI, Engineering]
tags: [AI, Engineering]
author: Tommy
excerpt: "Agent 最大的風險不是模型亂講，而是工具介面沒被當成產品：schema 一改、權限一漂、重試策略一變，整個系統就會像沒鎖好的水管一樣開始漏。"
image: /img/posts/2026-02-10-ai-agent-tool-contracts.webp
lang: zh
---

我最近越寫越覺得：

大家在討論 AI agents 的時候，太常把它當成「模型 + 幾個 function call」的拼裝玩具。

但你只要真的把 agent 放到 production，**工具介面（tool contract）** 就會立刻從「方便」變成「責任」。

你以為你給模型的是：

```text
search(query) -> results[]
```

實際上你給的是：

```text
search(query) -> results[]  // with latency, auth, quota, privacy, retries, and blast radius
```

這篇想講的就是：把 tool 當成「contract / SLA」來設計，會讓你少踩很多那種「明明只是小改動，怎麼整個系統壞掉」的坑。

## 1) Tool schema 不是文件，是兼容性承諾

很多團隊的工具定義長這樣：

- 參數欄位寫一寫
- 回傳格式長得像 JSON
- 然後就上線

接著一個月後，有人覺得欄位命名很醜，把 `customer_id` 改成 `customerId`。

**然後 agent 真的就開始出事。**

因為模型不是「看一眼就會自動跟上」的程式。
它可能：

- 繼續用舊欄位（因為 prompt / memory / examples 還是舊的）
- 用錯欄位後自己腦補出結果
- 把錯誤當成暫時故障，開始重試（把你 API 打爆）

所以 schema 這件事，最務實的做法是把它當成版本化 API：

```text
tool: search@v1(query: string, limit?: int) -> { items: Item[] }
tool: search@v2(q: string, top_k?: int) -> { results: Result[] }
```

你可以同時提供 v1/v2 一段時間，讓 agent 有退路。
否則你會在某一天看到「成功率突然從 99% 掉到 70%」，然後追一整晚的 log。

## 2) 你要定義的不是「能做什麼」，而是「不能做什麼」

工程師很自然會把工具寫得很強：

- `run_sql(sql)`
- `call_internal_api(path, method, body)`
- `shell(command)`

但 agent 的世界裡，「強」通常等於「難控」。

我更喜歡反過來設計：

- `get_customer_by_email(email)`
- `list_open_invoices(customer_id)`
- `issue_refund(invoice_id, amount, reason)`

因為這些工具天生就帶了邊界。
它們不是讓模型「自由發揮」，而是把系統的 blast radius 壓小。

如果你已經有那種泛用工具，至少要把限制講清楚，而且讓限制是可機器驗證的：

```text
issue_refund(invoice_id, amount)  // amount <= outstanding_amount
```

不要只在 README 寫「請小心使用」。

## 3) Latency 與 retries：你以為是穩定性，可能是災難放大器

工具慢一點，agent 會怎樣？

很多人直覺是「就等」。

但真實世界更常是：

- agent 以為卡住 → 再呼叫一次
- orchestrator 有 timeout → 整段重跑
- queue 看起來沒動 → autoscaling 拉更多 worker

你本來只是 1 個慢請求，最後變成 30 個重試風暴。

所以 contract 需要包含「時間」這個維度：

```text
get_invoice(invoice_id) -> invoice  // p95 < 500ms
```

以及「重試策略」要被寫死在系統裡，而不是讓模型自己猜：

```text
get_invoice(...)  // safe to retry: yes
issue_refund(...) // safe to retry: no (must be idempotent-keyed)
```

特別是有副作用的工具，沒 idempotency key 的話，重試等於賭運氣。

## 4) 權限漂移：最恐怖的是「今天還好、明天就不行」

我遇過最煩的一種 production 問題是：

- 不是 deterministic 的 bug
- 不是資料壞掉
- 不是模型 hallucination

而是「權限今天跟昨天不一樣」。

你把某個 tool 背後的 service account 權限調整了，結果 agent 開始：

- 某些客戶查得到、某些查不到
- 某些 API 走得通、某些回 403
- 然後模型開始用其它路徑繞（因為它想完成任務）

所以 tool contract 也要包含 auth 的語意：

```text
list_customers() -> customers[]  // scope: billing.read
issue_refund() -> receipt        // scope: billing.write
```

不要讓模型在「能不能做」這件事上靠試。

## 5) Observability：你要能回答「它剛剛到底做了什麼」

Agent 系統最容易被質疑的一句話是：

> 你這東西到底怎麼決定的？

我自己的底線是：**每個 tool call 都要可追溯**。

最基本：

- request id
- input
- output（或錯誤）
- latency
- 呼叫者（哪個 agent / 哪個 session / 哪個 user）

更進階一點：把「合規」也當成 contract：

```text
send_message(to, text) -> message_id  // must store audit log for 90 days
```

你不需要把一切都錄影，但你得在事故發生時有證據鏈。

## 我會怎麼做：把 tool 當成產品來做

如果你現在正要把 agent 接到一堆內部系統，我會建議你把順序反過來：

1. 先定義 tool contract（schema + 版本 + 權限 + 時間 + 重試語意）
2. 再做 stub / mock，讓 agent 在 sandbox 先跑
3. 最後才接真實系統

因為 agent 的「可控性」不是靠你多寫幾條 prompt。

它是靠你把系統邊界做得像工程一樣硬。

---

## References

- [OpenAI function calling 官方說明（tools 與 JSON schema）](https://platform.openai.com/docs/guides/function-calling)
- [AWS Builder’s Library：timeouts、retries 與分散式系統的放大效應](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [Google SRE Book：監控與可觀測性的設計原則](https://sre.google/sre-book/monitoring-distributed-systems/)
