---
layout: post
title: "Agent 的 sandbox 是產品邊界（不是權限清單）"
date: 2026-02-13 21:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: zh
---

![一張單色圖：agent 與 world 之間有一道 sandbox 邊界](/img/posts/2026-02-13-agent-sandboxing-01.webp)

我最近越來越常用一個很土的標準，去判斷一個「agent 產品」到底是不是玩具：

**它有 sandbox 嗎？還是只有希望？**

很多團隊談 sandbox 的方式很像在做權限打勾表：

- 能不能呼叫某個 tool？
- 能不能連某個 DB？
- 能不能跑在某個環境？

但這其實不是 sandbox。
這只是你「打算」不要出事。

我認為 sandbox 本質上是 **產品邊界**：你刻意設計一個界線，去限制 agent 在搞錯、想歪、或看起來成功但其實做錯事時，
**它「物理上」到底能造成多大影響。**

而且它會很無聊。
無聊到你在 demo 的時候會覺得它拖慢節奏。

但 production 才是付錢的地方。

## 不舒服的真相：agent 失敗的方式跟 production 系統一樣

一旦 agent 可以做動作，你就引入了一個新的 production 物種：

- 它會打外部 API（不穩、限流、偶爾抽風）
- 它會產生你收不回來的副作用（發訊息、開 ticket、merge）
- 它失敗時看起來不像 crash，而像「它怪怪的」

所以重點不是「模型有多聰明」。

而是：

```text
它一旦 misbehave，它『最多』能做什麼？
```

這句話其實就是產品設計。

## 我說的 sandbox，是硬限制，不是 vibe

如果要把 sandbox 拆成幾個具體的設計面向，大概是這四個。

### 1) 限制「在哪裡做事」（scope）

- prod / staging 分開憑證
- token 最小權限，不要共用一把神 key
- allowlist：只能碰哪些 repo、哪些 channel、哪些 project

只要你的 agent 還可以「什麼都做」，那 sandbox 就是假的。

### 2) 限制「能做什麼」（capabilities）

Tool 不是魔法。
Tool 是介面。
介面就是合約。

如果你對 tool 的想像只有：

```text
call_tool(name, payload) -> result
```

那你其實沒有安全系統。
你只有一個會吐 JSON 的輪盤。

把 tool 做窄、做 typed。
把「create_draft_pr」這種東西放在前面，而不是「git_push_anything」。

### 3) 限制「什麼時候做」（rate + sequencing）

這段通常最容易被忽略。

模型就算是對的，也可能因為 **太快** 而把小錯放大成事故。

- 每個 tool 的 rate limit
- 每次 run 的上限（例如最多 3 則訊息 / 最多 1 個 PR）
- 高爆炸半徑操作要分段確認

速度會把小錯變大災難。

### 4) 限制「怎麼算成功」（verification）

agent 不應該能自己宣告勝利。

- 發訊息就驗證是不是送到正確 target
- 開 ticket 就檢查 label / routing
- 改檔案就做 diff

產品要逼它拿出證據。

## 最好的 sandbox，是未來的你不會注意到的那種

好的 sandbox 在 demo 期會讓你覺得「摩擦感好重」。

但兩個月後，你遇到第一次「它到底為什麼會這樣？」的事故時，
你會發現 sandbox 的價值是：

**讓事故變得無聊。**

無聊的事故，才是能長期跑的系統。

## References

- [Google SRE Book：Release Engineering（談 blast radius 控制）](https://sre.google/sre-book/release-engineering/)
- [OWASP：最小權限原則（為什麼權限要做窄）](https://owasp.org/www-community/Principle_of_Least_Privilege)
- [NIST：least privilege 定義與概念（無聊但救命）](https://csrc.nist.gov/glossary/term/least_privilege)
