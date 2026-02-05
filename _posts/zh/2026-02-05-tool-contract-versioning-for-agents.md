---
layout: post
title: "Agent 的工具契約：別再靠改 prompt，schema 版本控管才是正道"
date: 2026-02-05 06:02:00 +0000
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
image: /img/posts/2026-02-05-tool-contract-versioning-01.webp
---

![有版本的契約是一種安全設計，不是文書作業](/img/posts/2026-02-05-tool-contract-versioning-01.webp)

現在大家講「agent 可靠性」，很多建議其實都在做 prompt 衛生：

- 指令寫清楚一點
- 多塞幾個例子
- 多加幾條 guardrail

有用。

但它常常在閃避真正會在 production 爆炸的點：

**你的 tool contract 是會變的。**

只要工具的輸入/輸出稍微動一下（欄位、語意、行為），你不會得到像編譯器那種明確錯誤。

你會得到的是：模型繼續很有自信地講話，然後系統在不知不覺中開始漂。

如果你看過 agent：

- 工具呼叫的 JSON 形狀看起來對，但意思其實錯
- 一直傳以前用過、現在不存在的欄位
- 少傳一個「新增的必填欄位」
- 把 enum 當成「建議值」在亂填

…你其實已經遇過真正的 failure mode 了。

## Tool「變更」其實有很多種

大家很愛說「schema 改了」，好像它是一種事情。

不是。

下面這五種改動，在 diff 裡很小，但在半夜三點會很大：

1) **欄位改名**
   - `customer_id` → `id`
   - 模型會一直傳舊欄位，因為它在 examples / 記憶裡看過

2) **新增必填欄位**
   - 你加了 `workspaceId`，整個鏈路就斷
   - 模型會硬編一個值，因為它不想說「我不知道」

3) **語意漂移**
   - `limit` 以前是「筆數」，現在是「bytes」
   - JSON 一樣，意圖完全不同

4) **行為漂移**
   - 工具以前錯就 fail，現在改成回傳 partial
   - agent 把 partial 當成 complete

5) **權限/政策漂移**
   - 你把權限收緊
   - 模型開始改用別的工具繞路達成同樣效果

最後那個就是為什麼我把「契約」當成安全工程，而不是「API 文件」。

## 什麼叫「版本化的工具契約」（落地版）

目標很無聊：有變更時，系統應該在 agent 開始 improvising 之前就大聲地 fail。

我的底線大概是：

- **每個工具都有穩定的名稱**
- **每個工具都有 versioned schema**
- **每次 request 都要驗證** 才能真的執行
- **每次 response 都要驗證** 才能回給模型

如果你想說「模型可以自己 handle」……對，它可以 handle，直到它 handle 不了。

版本化契約的意義，就是把錯誤留在「軟體 bug」領域，而不是變成「AI 玄學」。

### 一個我真的想看到的最小例子

如果我在某個 agent 系統裡看到這種東西，我會放鬆一點：

```text
search_customers_v2(query: string, limit: int) -> { customers: Customer[], next_cursor?: string }
```

兩個細節超重要：

- **`_v2` 明講**：你沒有假裝相容。
- **輸出 shape 穩定**：你可以圍繞它做 monitoring。

（而且是的：工具版本化了，你的 monitoring 也應該跟著版本化。）

## 大家不想付錢的那段：migration 紀律

版本控管如果沒有 migration，只是在用更漂亮的方式累積技術債。

所以我通常會想要三條規則：

1) **工具 owner 要公告 deprecation window**
2) **agent 要 pin 版本**（別用「永遠最新版」）
3) **升級要當成正式 release 測**

第三條才是成本。

你需要的測試不是「JSON unit test」。

你需要的是代表 agent 真正在做的事情的 test cases：

- 典型的 prompt / intent
- 典型的 retrieved context
- 你預期會出現的 tool call arguments
- 你能接受的 failure modes

因為最可怕的不是「錯誤輸出」。

最可怕的是 **看起來合理的輸出**。

## 一份我會直接偷去用的 checklist

如果你的 agent 會呼叫會動到真實系統的工具，我會希望至少做到：

- **JSON schema validation**（request + response 兩邊都要）
- **semantic validation**（range、ID 格式、允許的 enum）
- **tool call logging（可遮罩敏感資料）**
- **結構化錯誤回傳**（不要「不知道就一直重試」）
- **canary tool version**（先少量流量試水溫）

Prompt 不是契約。

它比較像 UI。

契約才是那條，把「小小 API 改動」擋在外面，不要變成「一個奇怪 incident」的線。

---

## References

- [OpenAI function calling 官方指南](https://platform.openai.com/docs/guides/function-calling)
- [JSON Schema 官方網站](https://json-schema.org/)
