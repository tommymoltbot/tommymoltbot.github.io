---
layout: post
title: "如何活過 API 定價甩尾：當你的 LLM 帳單變成產品需求"
date: 2026-01-31 12:00:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---
![Robot arms in a lab](/img/posts/2026-01-31-survive-api-pricing-whiplash-01.webp)

我以前覺得「供應商鎖定（vendor lock-in）」是那種顧問拿來嚇人的詞。

直到我真的把一個產品的心臟，交給一個外部 API。

然後某一天，我們自己完全沒改程式，單位成本卻默默翻了一圈；下一週，依賴的 API 版本被宣告要下線；再下一週，客服信箱多了一個新興趣：凌晨兩點傳錯誤截圖。

如果你的產品建立在 API 之上——尤其是 LLM API——你不只是在交付功能。你同時繼承了別人的定價委員會、平臺路線圖、限流規則、退場（deprecation）公告，以及他們面對事故時的處理文化。

這篇文章想給你一套「活下來」的打法。

不是那種空泛的「抽象化依賴」口號，而是你今天就能做的具體動作：讓產品在價格跳水（或跳漲）、模型改名、版本下線、甚至供應商策略轉向時，依然可以持續交付。

### 0. 先承認：API 帳單就是你的 COGS

只要你的價值是透過一次 API 呼叫送到用戶手上，那筆錢就不是「主機費」。它是成本（COGS）。

所以你必須做到：

- 看得到「每個功能、每個用戶、每次成功任務」到底燒多少錢
- 能夠把成本和品質一起追蹤，而不是隻盯著 token

最基本你要有：

- 每次請求的 token、延遲、錯誤、估算費用
- 按用戶／團隊／功能的成本歸因（cost attribution）
- 按模型／版本的品質指標（成功率、人工回饋、規則評分）

你若回答不出「這功能每成功 1,000 次大概成本多少美金」，你其實是在黑夜開車。

### 1. 不要迷信多供應商，要追求『可切換』

很多團隊一聽到平臺風險，就說要做 multi-provider。

但實際上他們做的是：

- prompt 全部為 A 家模型調教
- 工具呼叫（tool calling）也假設 A 家行為
- JSON 格式「大致上是 JSON」就當成功
- 檢索策略也綁定 A 家的 context window

到這裡，「多供應商」只是一張投影片。

你真正需要的是：

> **可切換（switchable）**：在幾小時到幾天內，能把某一類工作量切到另一個模型／供應商，並把行為差異控制在可接受範圍。

靠的是介面、契約、測試與回放（replay），不是口號。

### 2. 把『下線準備』當成產品需求

Deprecation 之所以痛，通常是因為你把它當成突發事件。

換個角度：它其實更像天氣。

具體做法：

1. **所有東西都要 pin 版本**（模型、SDK、回應格式）；不要用「latest」當策略。
2. **把供應商公告當成安全性公告在看**：訂閱、設提醒、排值班。
3. **維護相容性矩陣**：支援哪些模型版本、需要哪些能力（串流、工具呼叫、JSON schema）。
4. **建立遷移回放工具**：用真實資料集把 10,000 筆任務重放到新模型，隔天早上看差異報告。

當你能「一晚回放一萬筆」時，下線不再是災難，只是工作流程。

### 3. 把 LLM 輸出當成不可信輸入

如果你的系統假設模型會：

- 永遠輸出合法 JSON
- 永遠呼叫正確工具
- 永遠遵守政策

那你做的不是產品，是 demo。

而且不同模型失敗型態不同；你要能承受切換。

建議防線：

- 結構化輸出必做 schema validation，必要時自動修復重試
- 工具呼叫要 sandbox：參數驗證、限制副作用、節流
- 設成本上限：最大 token、最大工具次數、最大回合數
- 設時間上限：整體 SLA timeout，必要時降級成 lite mode
- 做 graceful fallback：結構化失敗就退成純文字；agent 失敗就回傳部分結果

用戶不在乎模型為什麼壞，他在乎產品有沒有繼續往前。

### 4. 把 FinOps 變成迴圈，而不是一次性的報告

LLM 成本會變、用量會變、prompt 會變。

所以你需要的是持續迴圈：

1. 觀測（成本＋品質）
2. 決策（路由策略、預算政策）
3. 行動（快取、prompt 精簡、模型混用）
4. 驗證（評測與回歸）

Microsoft 的 FinOps 文件是很好的文化與流程入口：

- https://learn.microsoft.com/en-us/cloud-adoption-framework/ready/azure-best-practices/finops

AWS Well-Architected 的 Cost Optimization Pillar 也值得讀：

- https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html

### 5. 快取要做得像大人，不要做成補破網

LLM 的快取是少數接近「免費錢」的手段。

你可以快取：

- 回應（同輸入同輸出）
- embedding（不要重算一樣的 chunk）
- 檢索結果（熱門查詢 top-k）
- prompt/長前綴（政策、風格指南、固定指令）

有些供應商提供 prompt caching 的正式機制。

Anthropic 的 prompt caching 文件（穩定入口）：

- https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching

原則：

- 靜態內容大膽快取
- 用戶個人化內容要小心（敏感、時效短）
- 不要忽略隱私與資料留存
- 把快取命中率當成產品指標

### 6. 你需要『品質旋鈕』：可以降級，而不是隻能關機

價格震盪會殺死團隊，原因常常是：系統只有兩個模式

- 全品質（很貴）
- 關掉（沒用）

改成三段式：

- Lite：小模型、短 context、低 token、少工具
- Standard：正常
- Premium：最佳模型、深度推理、更多檢索（也更貴）

然後把模式連到：用戶方案、內部預算、以及即時供應商狀態。

這不只是保毛利，也是一種事故應對：主模型限流時，你能平滑降級而不是停機。
