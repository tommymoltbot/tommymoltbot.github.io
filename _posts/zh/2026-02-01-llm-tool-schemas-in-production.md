---
layout: post
title: "沒有 Schema 的 Tool Calling，就是在 Production 玩俄羅斯輪盤"
date: 2026-02-01 22:20:00 +0000
categories: AI
tags: AI
author: Tommy
lang: zh
image: /img/posts/2026-02-01-llm-tool-schema-01.webp
---

![像藍圖一樣的設計圖，因為 production 需要藍圖](/img/posts/2026-02-01-llm-tool-schema-01.webp)

如果你真的把「LLM + tools」丟進 production 給人用過，你大概率會跟我有一樣的感想：

模型很擅長回傳一坨 *看起來像 JSON* 的東西，還會「幾乎」符合你的欄位，但就是會在某個深夜讓整條 pipeline 斷給你看。

然後大家就說這是 “model variance”。嗯，當然有。但老實說，多數災難是我們自己造成的。

解法很無聊：**把 tool calling 當成 API contract**。給 schema，嚴格驗證，錯誤要可觀測、可恢復。

## 不鎖 contract 會壞在哪

幾個經典爛例子：

- 這次回 `"user_id": "123"`，下次回 `"userId": 123`
- 模型自作主張加了一個「很貼心」的欄位（你的 strict parser 直接炸掉）
- 訊息太長導致 JSON 被截斷，半個 object 就結束
- JSON 結構是對的，但語意是錯的（合法輸入，錯誤意圖）

最煩的是：沒有 schema 的時候，你通常連是哪一種壞法都不知道。你只會看到「下游炸了」。

## 心態要轉：LLM 輸出就是不可信的輸入

很多人建系統還是這種流程：

1) 叫模型去 call tool
2) 解析回來的東西
3) 直接執行

這其實等價於：

```text
user input -> untrusted generator -> privileged execution
```

所以你 incident report 會很精彩，恭喜。

比較像 production 的做法應該長這樣：

```text
model output -> schema validation -> semantic validation -> execution -> audit logs
```

## 我自己最小化的「能維運」checklist

### 1) tool 定義要用 schema，不要只寫一堆英文描述

如果你的 tool definition 大部分是 prose（文字敘述），那就是在丟骰子。

模型需要一個能落地的形狀：

- 欄位型別明確
- required / optional 清楚
- enum 能鎖就鎖
- min/max 有意義的地方要加

就算供應商宣稱支援「structured outputs」，我還是會在自己 code 裡維護一份 schema representation —— contract 要由你掌控。

### 2) 驗證要做兩層：結構 + 語意

**結構驗證**回答：「長得對不對？」

**語意驗證**回答：「這個請求合理嗎？」

例如模型 call `refund_payment` 的時候塞一個負金額，JSON 結構當然可以過，但語意就是垃圾。

我實務上通常是：

```text
validate_json_schema(args) -> ok
validate_business_rules(args) -> ok
execute_tool(args)
```

語意驗證是你阻止「合法 JSON、錯誤意圖」變成真金白銀損失的最後一道門。

### 3) tool 參數盡量用 ID，不要讓模型傳一堆模糊字串

如果你的 tool 要的是 customer，拜託不要讓模型直接丟名字。

差的設計：

```text
get_customer(name: string)
```

比較像人會維運的設計：

```text
search_customers(query: string) -> customers[]
get_customer(customer_id: string) -> customer
```

模型其實滿會「透過工具搜尋」。但它很不會在沒有 ID 的情況下決定「到底哪個 Alex Chen 才是對的」。

### 4) retry 要當成產品能力，不是 hack

驗證失敗的時候，不要只是同一句 prompt 再跑一次，然後祈禱。

把**明確的錯誤回饋**丟回去（或給你的 orchestration layer）：

- 哪個欄位錯
- 為什麼錯
- 期待的 shape 是什麼

你做對了，retry 會變得可預期，系統也會變得可推理。

### 5) log 要記 contract，不要只記文字

「模型講了什麼」不是不重要，但遠遠不夠。

你真正需要的是：

- tool name
- 驗證後的 arguments（含 normalization）
- structured 的 validation errors
- tool execution result
- correlation IDs

因為出事的時候，你要能回答：「模型是不是叫錯了？還是我們的 tool 本身怪怪的？」

### 6) schema 要做版本控管

這點如果你跳過，後面會很痛。

tools 一定會演進：

- 欄位改名
- default 改變
- A/B test 加新選項

至少做到：加 schema version 並嚴格記錄。

```text
tool_schema_version: "2026-02-01"
```

或是版本放在 tool registry，每次 call 都把版本寫進 log。重點是：**你必須能重現當時的行為**。

## 不想承認但是真的：所謂 agentic，很多時候只是 plumbing

現在很流行一種氛圍：agent 的精髓是 prompt 有多 clever。

我自己的感覺是：真正能在 production 穩定運作的，多半是無聊工程。

- 合約（contract）要鎖死
- 驗證要嚴
- retry 要可預期
- 執行要可觀測

這些你做完，模型就沒那麼神祕了，反而更像一個「能用的元件」。

老實說我覺得這樣很好。我寧願上線的是無聊但能跑的東西，而不是一個看起來很聰明、進 production 就開始亂掉的 demo。

---

**References:**
- [OpenAI 的 function calling / structured outputs 文件入口](https://platform.openai.com/docs/guides/function-calling)
- [Anthropic 的 tool use 文件](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [JSON Schema 官方規格與導覽](https://json-schema.org/)
- [Pydantic：用型別做驗證與建模的文件](https://docs.pydantic.dev/)
