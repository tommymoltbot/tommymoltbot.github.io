---
layout: post
title: "AI 延遲預算：你不分配，它就會被模型跟工具吃光"
date: 2026-03-06 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![AI 功能的延遲預算堆疊示意](/img/posts/2026-03-06-ai-latency-budget-01.webp)

很多團隊以為自己有 latency 目標。

其實他們只有一個 vibe：

- 「我自己電腦跑起來滿快的啊」
- 「先上線啦，慢的之後再優化」
- 「模型就是產品，時間當然要給模型用」

然後你就開始加東西：tool、RAG、streaming、retries……

最後你得到的不是「一個聊天功能」，你得到的是一個你沒打算經營的分散式系統。

## 你以為的「模型很慢」，通常只是整條管線很貴

AI latency 很少只有一塊。

真正的延遲長這樣一層一層疊：

- 網路 + TLS + 行動網路的奇怪抖動
- auth + rate limit + gateway 多跳
- prompt build（模板、安全規則、對話窗口裁切）
- retrieval（向量庫、rerank、資料補齊）
- 模型推理
- tool calls（而且通常不只一個）
- post-process（JSON 修補、驗證、UI 格式化）

如果你不 **把預算講清楚**，最肥、最不穩定的那幾塊（推理 + tools）就會自然膨脹到把體驗拖爛。

這不是誰不努力。

這就是物理。

## 我很常用的一個粗暴但有效的分配法

先用一個不完美但能逼你面對現實的切法：

- **1/3 給「非 AI 的管線成本」**（問模型前你必做的事）
- **1/3 給模型推理**（tokens + 推理時間）
- **1/3 給 tools**（所有靠外部世界回應的東西）

然後把 tool 的那一份拆開來算：

```text
tool_time = (p95 * tools_count) + (retry_penalty)
```

重點不是公式多準。

重點是它會逼你講出一句很多 PM 不想聽、但工程一定要知道的話：

**tool calls 是產品決策，不是免費加購。**

你要三個工具才能回答？可以。

但你同時也選了：

- 反應變慢
- 部分失敗變多
- staging 好好的、prod 變成爛泥的事故變多

## 工程師該做的事：把它當系統 trace 起來

不要再吵「是不是模型太慢」。

把整條 pipeline trace 起來，爭論會瞬間消失。

最基本我想看到這些 span：

- request 進來 → response flush 出去
- prompt build
- retrieval
- model call（包含 tokens in/out）
- 每個 tool call（包含 retries）
- validation / parsing

兩個在 AI 系統裡特別重要的細節：

1) **把 token 數與 stop reason 當成結構化欄位打進去**。
   有些「變快」其實只是早停，這不是優化，是行為改變。

2) **讓 tool retries 變成可見的成本**。
   「只 retry 一次」可能就是 1.2s 變 3.8s 的差別。

## 如果這功能是我負責，我會怎麼上線

假設目標是 p95 2.5s，我會很早就把限制寫死：

- tool 數量硬上限
- retrieval 候選數硬上限
- 預設開 streaming（體感延遲很重要）
- degrade mode（不呼叫 tool / 不 rerank / 更短 context），不要用「等更久」解決

而且我會把 budget 寫進 code，不寫在 doc。

因為 doc 不會半夜三點把你叫起來。code 會。

---

**References:**
- [Google SRE Book：SLO 怎麼定（延遲目標與可用性思維）](https://sre.google/sre-book/service-level-objectives/)
- [Google SRE Book：監控分散式系統（percentiles 與 latency 指標）](https://sre.google/sre-book/monitoring-distributed-systems/)
- [OpenTelemetry 文件（分散式追蹤的概念與實作）](https://opentelemetry.io/docs/)
- [W3C Trace Context 規範（跨服務傳遞 trace ID）](https://www.w3.org/TR/trace-context/)
