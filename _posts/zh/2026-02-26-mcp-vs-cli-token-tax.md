---
layout: post
title: "MCP vs CLI：真正貴的不是 tool call，是那本『工具說明書』"
date: 2026-02-26 09:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張簡圖：token 到底花在哪裡——schema 還是 help text](/img/posts/2026-02-26-mcp-vs-cli-token-tax-01.webp)

我最近越來越常看到一種很「工程師會做的錯事」：

大家在優化 agent 的時候，會去省 prompt 的幾十個 tokens、把 tool arguments 寫得更短，結果**真正的錢其實是在 session 一開始就燒掉了**。

原因很無聊：你把整本工具說明書（每個 tool 的 JSON Schema）一次塞進 context。

有篇文章在講「用 CLI 讓 MCP 便宜很多」把這件事算得很清楚：如果你有很多 MCP servers、很多 tools，但每次 session 只用到其中一小部分，那你就是在付一筆固定稅。

五個想法。

## 想法 #1：tool call 本身很便宜，昂貴的是 tool 定義

token 的結構其實長這樣：

```text
cost(session) = cost(tool_catalog) + cost(tool_calls)
```

MCP 的做法偏向：`cost(tool_catalog)` 直接一次付清——把所有工具的 schema 全丟進去。

這對穩定性跟「模型不會亂猜參數」很友善。

但代價就是：**你不管用不用，都先付錢**。

## 想法 #2：lazy loading 不是旁門左道，反而才正常

CLI 的策略很直白：
- session 開始只載入「有哪些工具」的清單
- 真正要用某個工具時，再去看 `--help` / 文件
- 然後執行

本質上跟「Tool Search / fetch on demand」同一派：
把固定成本變成變動成本，只有用到才付。

## 想法 #3：代價是多一步探索：可預測性 vs 探索成本

這也不是完全沒有 trade-off。

不預載 schema，agent 常常會多做一步：

```text
1) discover(tool) -> usage
2) execute(tool, args) -> result
```

這個「discover」步驟本身就可能出問題（例如 help 太長、格式怪、或模型理解歪掉）。

但如果你真的在做 production，很多東西你本來就得有：
- retries
- timeouts
- 權限/安全檢查
- “你確定要用這個 tool 嗎？” 的防呆

所以多一步 help lookup，我覺得不是世界末日。更痛的通常是那個固定稅。

## 想法 #4：這會逼你把工具做小、做乾淨（我反而喜歡）

大而全的工具，schema 就大而全。

你去看那種「包山包海」的 API wrapper，最後會變成：
- 一個工具帶 30 個參數
- 你要在 schema 裡面描述半本 SDK

lazy discovery 反而會推你回到比較健康的設計：
- 參數更少
- default 更明確
- 事情更單一

老實說，這才像人會維護的東西。

## 想法 #5：最合理的解法大概是混合式

我自己的偏好會是：
- 永遠只預載一個很小的 index（工具名稱 + 一句話描述）
- 需要用到時才拉完整 docs / schema
- 在 session 內做 cache

讓 agent 不會迷路，但也不用先把整本說明書印出來。

如果你的工具數量已經到 80+，你會很快感受到差別。

---

**References:**
- [「I Made MCP 94% Cheaper」：用 CLI 重新包裝 MCP 的 token 成本比較](https://kanyilmaz.me/2026/02/23/cli-vs-mcp.html)
- [Anthropic 工程文章：Advanced tool use 與 Tool Search 的設計](https://www.anthropic.com/engineering/advanced-tool-use)
