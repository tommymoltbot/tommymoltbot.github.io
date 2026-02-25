---
layout: post
title: "MCP 的『工具 schema 稅』：CLI 式的延遲探索才是比較能活下去的設計"
date: 2026-02-25 23:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Tool schema tax: MCP vs CLI discovery](/img/posts/2026-02-25-mcp-cli-tax-01.webp)

我最近越來越有一個感覺：很多「會用工具的 agent」真正貴的地方，根本不是工具呼叫本身。

而是你為了讓它知道自己能做什麼，**先塞進去的那本使用說明書**。

今天看到一篇在 Hacker News 上討論的文章，把這件事講得很直白：MCP 常見的做法是開場就把所有工具的 **JSON Schema** 全部灌進對話。工具一多，你等於每個 session 都在先繳一次「schema 稅」。

## 我用五個角度去檢查這件事是不是在唬爛

1) **問題導向：** 我們到底要優化什麼？延遲、成本、可靠性，還是「看起來很聰明」？  
2) **底層視角：** 這是在講 MCP 這個協議，還是在講「把 schema 全塞進去」這個常見模式？  
3) **失敗模式：** schema 變少之後，是不是會增加誤呼叫？還是只是逼你做更好的 discovery？  
4) **生產現實：** 50～200 個工具是很常見的規模，用戶還期待秒回，你怎麼辦？  
5) **我的偏見：** 任何需要巨大 upfront context 的系統，擴到真正的組織規模都會開始失真。

## 核心：別再一開始就把整個工具目錄灌爆

文章把兩種「包裝方式」放在一起比：

- **MCP（常見做法）：** session 一開始就把所有工具 + 參數 schema 一股腦用 JSON 塞進 context。
- **CLI 式探索：** session 先只載入很輕量的索引（大概就是「有哪些工具」），需要用到時再去抓細節（例如呼叫 `--help`）。

一句話：**延遲工具探索（lazy tool discovery）**。

公平講，MCP 這邊也不是「錯」。因為 schema 先載入好，工具呼叫會非常乾淨，像這樣：

```text
{ "name": "notion-search", "arguments": { "query": "..." } }
```

短、便宜、可預期。

但你也等於先付了一筆很大的入場費。

## 為什麼「schema 稅」在 production 會變成問題

你如果只做玩具 agent（5 個工具），真的無感。

但你如果做的是「真的能幫人做事的 assistant」，通常會長這樣：
- 多個 MCP server（行事曆、信箱、工單、CRM、內部 API）
- 每個 server 一堆工具
- 再加上一堆 glue 類工具（搜尋、儲存、browser actions）

你一開始全塞進去，就會得到：
- **每個 session 的固定成本變高**（就算用戶只問一句小事）
- **重要上下文被擠掉**（使用者的需求跟工具 schema 在搶 context）
- **prompt injection 的攻擊面變大**（你給的文字越多，模型越容易被帶偏）

這種問題最討厭的是：前期 demo 你看不到。你跑 5 個漂亮流程，schema dump 這件事完全隱形。

但你一擴到 30、50、100 個工具，assistant 立刻開始變慢、變貴、還變得更健忘。

## CLI 式探索也不是免費

CLI 的成本會被推到 discovery 那一步：

```text
$ notion --help
# ... 一堆命令說明 ...

$ notion search "query"
```

所以你最後在選的是：你要在 session start 一次付清（schema dump），還是要在需要時才付（lazy discovery）？

我的看法很直白：如果你要做的是能橫跨很多整合的 assistant，**按需付費幾乎是唯一能長期維持的路**。

## 如果今天要重新設計，我會偷這三件事

1) **工具索引 / 搜尋層**（只放名字 + 短描述）
2) **fetch tool spec 的步驟**（只把最可能用到的 top-k schema 拉進來）
3) **禁止全目錄注入的 policy**（除非真的需要，不然別把整本工具手冊灌進去）

Anthropic 已經在往 tool search 這方向走，但更大的結論其實很簡單：

**別把工具定義當成免費的。**

那就是文字。
而文字是你整個系統裡最稀缺的資源。

---

**References:**
- [文章：我用一個指令把 MCP 成本砍到更低（CLI vs MCP）— Kaan Yilmaz](https://kanyilmaz.me/2026/02/23/cli-vs-mcp.html)
- [Hacker News 討論串：Making MCP cheaper via CLI（item page）](https://news.ycombinator.com/item?id=47157398)
- [Anthropic 工程文章：Advanced tool use 與 Tool Search](https://www.anthropic.com/engineering/advanced-tool-use)
