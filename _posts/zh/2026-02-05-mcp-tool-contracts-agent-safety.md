---
layout: post
title: "大家在聊 MCP，但我更在意的是：Tool Contract（以及它能不能 fail closed）"
date: 2026-02-05 17:00:00 +0000
categories: [AI]
tags: [AI, Engineering]
image: /img/posts/mcp-tool-contracts.webp
---

最近 MCP（Model Context Protocol）被討論得很熱。

我懂那個爽點：你如果曾經把 LLM 接到一堆內部系統，聽到「工具的 USB‑C」這種標準化敘事，很難不興奮。

但我心裡一直有個更想講的：

**MCP 不是重點。重點是 agent 需要可執行介面的合約（tool contract），而且要能被嚴格執行。**

因為真正會把你搞死的情境，通常不是「模型不知道 API 怎麼用」。

而是：模型講了一段「看起來像 request」的東西，你的 runner 又剛好把它當 request 了。

## 我先把五個角度攤開（避免又寫成同一篇）

1) **商業角度**：標準化能降低整合成本，但前提是行為可預期。
2) **系統角度**：tool call 是 I/O 邊界；邊界就該有 schema + validation。
3) **歷史角度**：每個新介面最後都會走向「版本化與 migration」。
4) **工程師角度**：沒有可 replay 的 tool call，你根本沒辦法 debug。
5) **個人角度**：我喜歡 MCP，但我只信任能 fail closed 的系統。

## MCP 解決「連得上」，可靠性靠的是「合約」

MCP 的價值很清楚：互通性。

- 工具以較標準的方式暴露能力
- client 可以 discovery + call，不用每次都手刻 glue

這些都是真的。

但你把 agent 放進 production 之後，你真正要回答的是：

> 在我的系統裡，什麼才算「可執行的 request」？我怎麼證明它合格？

這不是 protocol 的問題。

這是 **contract + enforcement** 的問題。

## 一個能讓我保持清醒的心智模型：把兩種 channel 分開

只要模型能觸發動作，我就會強迫自己分兩個 channel：

- **自然語言 channel**（給人看）：本質上就是模糊。
- **command channel**（給工具跑）：必須嚴格。

不分開的話，你等於讓自然語言可以「偷渡」動作。

然後所謂的「agent 可靠性」就會不知不覺變成「安全性問題」。

## Tool contract 不是玄學，就是把 API 當 API 管

最小我會想要這種程度：

```text
request  = { op, version, payload }
response = { ok, data, error }

validate(request) -> ok | error
migrate(v1 -> v2) -> request'
```

接著把它變成可運營的規則：

- **版本化**：你改 schema 不該讓舊 run 原地爆炸。
- **runtime validation**：不合格的 request 先在入口被擋掉。
- **fail closed**：不要做「盡量猜」的 best-effort 解析。
- **記錄拒絕原因**：每次拒絕都要有可聚合的 reason string。
- **可 replay**：不能 deterministic replay，你就是瞎子。

很 boring。

但就是因為 boring，才會活。

## 不舒服但真實：標準化救不了你自己的寬鬆

protocol 可以讓你更容易呼叫工具。

但它阻止不了你：
- 接受半結構化的 tool call
- 默默把型別 coercion 掉
- 用「貼心」名義去猜缺欄位
- 讓權限在多個工具之間互相滲透

如果你的 runner 很 permissive，MCP 只會讓你多一個地方可以 permissive。

所以我很樂見 MCP。

但如果你問我真正下注什麼：

我下注的是 contract、validation、以及 boring 的 failure mode。

## References

- [MCP 介紹：What is the Model Context Protocol?](https://modelcontextprotocol.io/docs/getting-started/intro)
- [OpenAI function calling 指南（結構化 tool calls）](https://platform.openai.com/docs/guides/function-calling)
- [JSON Schema 官方網站（runtime validation）](https://json-schema.org/)
