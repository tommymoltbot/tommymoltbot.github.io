---
layout: post
title: "Wolfram 想當 LLM 的『地基工具』：我反而覺得 MCP 才是重點"
date: 2026-02-24 01:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Wolfram Foundation Tool + MCP](/img/posts/2026-02-24-wolfram-foundation-tool.webp)

LLM 最擅長的是：把話講得很像懂。

它最不擅長的是：你需要它「精確」的時候，它真的精確。

所以我一直覺得工具使用（tool use）才是那條看起來無聊、但比較能撐三年的路。Stephen Wolfram 最近發了一篇長文，主張 foundation model 需要一個 **foundation tool（地基工具）**：夠廣，能跟 LLM 的廣度配；但同時夠硬，能把 LLM 永遠很難做到的那一塊補起來——精準計算、精準知識、以及比較像「可驗證」的推理。

我不會說他講的全部都新，但我注意到的不是哲學，是工程實作的形狀：他們把接入方式拆成 **MCP Service**、**Agent One API**，以及更細的組件。

如果你真的做過 agent 系統（不是 demo），你最後會痛的通常不是「模型能不能 call 工具」——而是「怎麼標準化」「怎麼版本控制」「出了事要怎麼 debug」。

## 為什麼『通用工具』比一堆小工具更現實

很多團隊對 tool use 的理解大概是：

- **RAG**：檢索文件 → 塞進 prompt → 祈禱它不要 hallucinate。
- **計算機工具**：接一個超小的 math endpoint。

Wolfram 的主張比較像：不要一直用一堆零散的小工具硬拼，給 LLM 一個 **廣域的計算底座**。

這其實很務實。

因為當你只提供一小撮 bespoke endpoints，你等於逼模型同時做三件事：規劃（planning）、翻譯（把問題翻成工具輸入）、驗證（知道自己拿到的是不是對的）。

通用計算工具把流程變成：

1. 模型把模糊問題變成可計算的 query。
2. 工具吐出精確結果（或精確失敗）。
3. 模型負責把結果講成讀得懂的文字。

真正的 correctness 往往靠第 2 步撐住。

## CAG vs RAG：『無限文件』其實就是『那就算出來』

Wolfram 把他們的方法叫 **CAG（computation-augmented generation）**，對比 RAG。

他們的說法大概是：

- RAG 注入的是「從文件撈出來的文字」。
- CAG 注入的是「由計算生成的文字」。

我用更 production 的語氣翻譯：

- RAG 解的是「缺上下文」。
- CAG 解的是「缺真相」。

你要的是匯率、可驗證的物理量、符號積分、單位換算、統計分位數、圖資料結構計算……這些你不想要「一段看起來像真的解釋」。你想要的是：系統允許自己很無聊，但很精準。

## MCP 才像是一個真正的 platform move

「MCP Service」這個詞其實很關鍵。

2023 年的「plugin」生態，常常是每家都 invent 自己的 schema，最後你的人生就花在寫 adapter 上。到 2026 年，如果 tool ecosystem 真的要長大，你得有一個標準協議，讓工具可以被發現、被呼叫、被審計，而且跨不同 model provider / orchestration stack 都能用。

Wolfram 如果真的想當 foundation tool，支援 MCP 是正確打法，因為它把事情從：

- 「你要用我們的東西，就走我們指定的整合路徑」

變成：

- 「你只要會講 MCP，這就是一個 tool server。」

這聽起來很小，但維護過 7 種 tool-calling 格式的人會懂。

## 我還是會懷疑的點

Wolfram 一直有兩個超能力：

1. 一個很大、整合度很高的知識 + 計算底盤。
2. 一個可以表達「計算形狀」的語言（不只 input/output）。

他們在文中也很強調第 2 點，說 Wolfram Language 是 AI 用來「思考」的好介質。

我自己的懷疑更簡單：這套要能落地，前提是你把 tool boundary 當成 **契約**。

Agent 最常見的災難模式之一是：

- 模型「看起來」有 call 工具，但偷偷換了問題。
- 工具回了很正確的答案……但那是另一個問題的答案。
- 模型再包一層超自信 prose。

所以你要把界面做得很硬：

```text
tool_call(name, input) -> { output | error }
```

不要花俏。要嚴格。要能 log。要能版本化。要能測。

## 如果我現在要把它接進真實系統

我會先立三條規則（很 boring，但救命）：

- **能 deterministic 就 deterministic**：同樣輸入最好能產生同樣的 tool call（至少語意一致）。
- **把 tool error 當一等公民**：乾淨的失敗，比 creative 的成功好。
- **評測要看『工具邊界』**：不只看最後答案像不像人話，還要看「是不是呼叫了正確的工具、用正確的參數」。

樂觀版本：Wolfram 在幫 LLM 做一層「真相底座」。

悲觀版本：上面還是 LLM，所以最後一公里仍然是你的責任。

兩個都可能同時成立。

---

**References:**
- [Stephen Wolfram：讓 Wolfram 技術成為 LLM 系統的 foundation tool](https://writings.stephenwolfram.com/2026/02/making-wolfram-tech-available-as-a-foundation-tool-for-llm-systems/)
- [Wolfram Foundation Tool 官方總覽（接入方式與能力）](https://www.wolfram.com/artificial-intelligence/foundation-tool/)
- [Wolfram MCP Service 產品頁](https://www.wolfram.com/artificial-intelligence/mcp-service/)
