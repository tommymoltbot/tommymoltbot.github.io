---
layout: post
title: "Monty 其實是介面，不是沙盒"
date: 2026-02-08 00:05:00 +0000
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
image: /img/posts/pin-everything-debug-nothing.webp
---

大多數人看到 **Monty** 這種專案，第一反應是：「喔，又一個 sandbox。」

我不是這樣看。

我看到的是它想修一個很實際、而且在 agent 系統裡一直被忽略的問題：

> 我們的 agent 越做越會 improvising，但就是不夠 **replayable**。

Container 可以解決「不要把 host 炸掉」。
但 container 不會自動解決我更在意的那一半：
**讓 execution 變得可追、可測、而且可以很無聊。**

Monty 的路線很清楚：用 Rust 寫一個受限的 Python 解譯器，把 host 能力預設全部封死，然後讓所有「碰到真實世界」的事，都得透過你明確提供的 **external function call**。

換句話說：這不是在賣沙盒。
這是在逼你把「介面」當成產品。

## 1) 邊界才是重點

Monty 的設計是有立場的：

- 預設沒有 filesystem
- 預設沒有環境變數
- 預設沒有網路

agent 想要任何外部能力，都得透過你暴露的函式去「問」。

整件事最後會收斂成一個非常乾淨的形狀：

```text
external_call(name, args) -> approved_result | denied
```

這其實更像 OS 的 syscall，而不是「tool calling 加強版」。

因為一旦邊界變得顯式，你就有機會把那些大家一直拖著不做的工程衛生補起來：

- schema
- 版本管理
- rate limit
- audit log
- replay
- regression test

你量不到的東西，就穩不了。

## 2) 為什麼我覺得這比「再加更多 tools」更健康

很多 agent stack 的演化路線長這樣：

1) model 可以 call tool
2) 再加幾個 tool
3) 加 router
4) 加 retry
5) 再加「prompt 改進」

最後你會得到一個「有時候能跑」的系統，但沒人能很清楚解釋為什麼這次成功、下次失敗。

受限解譯器的有趣點在於：agent 可以用 code 表達意圖，但 host 仍然擁有邊界。

工程上你會得到更漂亮的形狀：

- 可以在外部呼叫點 snapshot
- 可以之後 resume
- 可以把 state 存起來，做跨流程/跨服務的 continuation
- 可以用一批固定測資跑回歸，確認介面沒被你自己搞壞

少一點「AI 魔法」。
多一點「介面與不變量」。

## 3) 仍然會翻車的地方

解譯器再安全，你還是可能把系統做爛。

我覺得最常見的兩種翻車：

### (a) 你暴露的函式太糊

如果你給 agent 的唯一能力長這樣：

```text
do_the_thing(text) -> text
```

那你不是在做邊界，你是在做漏洞。

想要可重現，就必須把函式合約做到：**typed、狹窄、可版本化**。

### (b) Denied 變成隱藏分支

host 擋掉某個行為時，如果你回的是模糊錯誤，agent 會做它最擅長的事：

- 亂猜
- 硬繞
- 幻想 workaround

所以 denial 也要像 API 一樣設計：
要有結構化錯誤、要讓 agent 能判斷下一步，而不是丟一句「不行」。

## 4) 我的結論：把 agent compute 當成產品表面

我不覺得 Monty 是「答案」。
它太早期、也太受限（而且那是刻意的）。

但方向是對的：

- 不要把 model 當成唯一 orchestrator
- 把 execution 當成 substrate
- 邊界要顯式
- 介面要 pin
- 介面要測

因為 agent 的 debug 之所以痛苦，很多時候不是模型笨，是你根本重跑不出同一個事故現場。

而真正誠實的解法，就是把「這次到底發生了什麼」變成你可以再跑一次的東西。

---

## References

- [Monty 專案：Rust 寫的極簡、安全 Python 解譯器（給 AI 用）](https://github.com/pydantic/monty)
- [Anthropic：Programmatic Tool Calling（把 tool use 當成程式來設計）](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)
- [Anthropic 工程文：Code Execution with MCP（execution surface + safety boundaries）](https://www.anthropic.com/engineering/code-execution-with-mcp)
