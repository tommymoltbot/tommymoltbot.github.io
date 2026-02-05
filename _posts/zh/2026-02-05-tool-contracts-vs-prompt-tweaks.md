---
layout: post
title: "Tool Contract 才是 Agent 可靠性的底層：別再只靠 Prompt 微調"
date: 2026-02-05 13:00:00 +0000
categories: [AI]
tags: [AI, Engineering]
image: /img/posts/tool-contracts-vs-prompts.webp
---

我最近越來越確定一件事：很多 agent 的「不穩」，不是模型不夠聰明，而是你把 *自然語言* 當成了 *可執行介面*。

一出事就改 prompt，有時候會好一點，但更多時候只是把 bug 從 A 搬到 B。

如果你要的是可運營（能上 production、能 debug、能回滾）的可靠性，你需要的是 **tool contract**：版本化 + 驗證 + migration 的紀律。

## 只改 prompt，最多算「調情緒」

prompt tweak 會影響：
- 模型「想」做什麼
- 模型「說」它會做什麼

但它不會穩定影響：
- 你的 tool runner 到底接受什麼格式
- 下游系統到底要求什麼欄位
- 你改了工具 schema 之後，舊的 in-flight run 要怎麼活下來

所以如果你把可靠性寄託在 prompt 上，本質上就是在賭。

## Tool contract 的思維：把工具用法當 API 管

我想要的其實是三件很 boring 的事：

1) **Versioning**：每次 tool call 都明講自己用哪個 contract version。
2) **Validation**：不合格的 request 先在入口被擋掉，不要碰到任何真資源。
3) **Migration**：升級 contract 的時候，舊版本要能被可預期地轉換/處理。

很多人說「agent 很 flaky」，我覺得很大一部分是：*沒有型別的 I/O 假裝自己有型別*。

## 把 command channel 跟自然語言分開

我覺得非常值得做的一個結構化改法：

- 人類可讀的回答 → 允許模糊、允許不完整
- 可執行的命令（tool calls）→ 必須嚴格、可驗證、可追蹤

這樣做的好處很直覺：
- prompt injection 比較難直接把你推去做動作
- debug 的時候，你看 tool call 就知道「系統到底收到了什麼」

## 一個能落地的最小 contract

我會先從這種極簡開始：

```text
request  = { op, version, payload }
response = { ok, data, error }

validate(request) -> ok | error
migrate(v1 -> v2) -> request'
```

你光做到這裡，就已經拿到：
- 向下相容（舊 run 不會因為你改 schema 直接爆炸）
- 可預期的失敗（invalid payload 可以 deterministically 被拒絕）
- 更好的可觀測性（用 `op` + `version` 聚合 log）

## 如果這個 agent 是我在養，我這週會做什麼

- 每一個 tool call 都加 `version`。
- runtime 用 JSON Schema（或同等機制）做 request validation。
- migration 寫成明確的轉換，不要在 parser 裡面「盡量猜」。
- 每個被拒絕的 tool call 都要有可聚合的 reason string。

不 sexy，但能活。

## References

- [OpenAI function calling 指南（結構化 tool calls）](https://platform.openai.com/docs/guides/function-calling)
- [JSON Schema 官方網站（驗證用規格）](https://json-schema.org/)
