---
layout: post
title: "可重播的 Agent：可靠性問題其實是 Debug 問題"
date: 2026-02-05 14:00:00 +0000
categories: [Engineering]
tags: [Engineering, AI]
image: /img/posts/agent-reliability-replay.webp
---

很多人聊「agent 不可靠」的時候，第一反應是：再改一下 prompt。

我覺得這方向常常搞錯。

Agent 的可靠性，很多時候不是 prompt 的問題，而是**你根本沒辦法 debug**。

一個 agent 做了奇怪的事，你如果不能重現，就不是 bug —— 那叫靈異事件。

所以我想推一個很土、但很有用的原語：**replay（重播）**。

## 可靠性的第一步：能不能重播一次 run

一般後端服務出事，你通常至少有：
- request ID
- logs
- trace
- 有時候還有 snapshot

但很多 agent 系統上線時提供的是：
- 「prompt 長這樣」
- 最後輸出一段話
- 然後工具鏈炸掉就開始靠信仰

那不是可觀測性，那是 vibe。

所謂「可重播的 agent run」，意思是你能把當時的輸入拿出來，再跑一次（或至少把 tool interaction 重現到足以定位問題），去回答四個很實際的問題：

- 它當時看到了什麼？
- 它做了什麼決定？
- 它到底執行了什麼？
- 因為這些執行，世界被改了哪些東西？

如果這四題答得出來，大部分「agent 很飄」的抱怨會瞬間變成正常工程問題。

## 該記錄什麼（最小但有效的集合）

我講 replay 不是要你把 token 全部存起來。

我想要的是：把「把謎團變證據」的那些東西留下來。

### 1) 把 tool call 當成 append-only event log

每一次 tool call 應該是一個事件，至少長這樣：

```text
{ run_id, step_id, tool_name, contract_version, request, response, ts }
```

這裡面我覺得兩個欄位是硬規則：
- **contract_version**：因為工具一定會演化，schema 一定會漂
- **request/response**：因為「它有呼叫工具」不等於你知道它做了什麼

尤其如果你不記 response，你根本沒辦法重播。

### 2) 世界會變動，就要做 snapshot

工具常常在讀一個會變的世界：
- 檔案系統
- 資料庫 row
- 網頁內容
- 行事曆

如果後續步驟會依賴那個讀取結果，你就該捕捉 snapshot。

Snapshot 不一定要很重：
- 有時候是「檔案 hash + 內容」
- 有時候是「DB row version」
- 有時候是「當時抽取到的 HTML」

Replay 不追求完美，它追求的是：足夠讓你 debug 常見失敗。

### 3) 有副作用的操作要有 idempotency key

一旦你能 replay，下一個坑會立刻出現：

你重播一次 run，結果多扣一次款、或多發一次貼文。

所以任何「會改世界」的操作，我都希望 tool 介面能表達類似這個形狀：

```text
op(request, idempotency_key) -> result
```

如果你的 tool contract 連這種東西都放不進去，那你的 replay 故事基本上是假的。

## 不太好聽但很常見：agent 壞在介面邊界

很多 flakiness 其實不是 model。

而是邊界設計太爛：
- tool input 沒型別
- schema 默默改掉
- best-effort parsing（看起來很貼心，其實很難運維）
- retry 直接把副作用重放
- 沒有版本化

看到這種系統再去「微調 prompt」我都覺得像是在修一個一直 crash 的服務，結果只去改 README。

## 一個不拖慢出貨的落地順序

如果要我這週把這件事推進 production：

1) **先把 tool call event log 做出來**（append-only，結構化）。
2) **先加 tool contract version**（今天全部先叫 `v1` 也行）。
3) **把少數危險操作加上 idempotency key**。
4) **在關鍵讀取點加 snapshot**（會影響後續決策的那些）。
5) 然後才聊 prompt 品質。

這些都不性感。

但它會把「agent 可靠性」從一種信仰，變成一個你真的能操作、能追責、能 debug 的系統。

## References

- [OpenAI function calling guide（結構化工具呼叫）](https://platform.openai.com/docs/guides/function-calling)
- [Stripe 的 idempotency patterns（避免重播造成重複副作用）](https://stripe.com/docs/idempotency)
- [OpenTelemetry（traces/logs/metrics 的標準）](https://opentelemetry.io/)
