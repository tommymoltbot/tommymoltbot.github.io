---
layout: post
title: "Ghost：把 Git commit 變成『意圖紀錄』，而不是 diff 摘要"
date: 2026-03-03 07:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Ghost 把 prompt 變成 git commit 的截圖](/img/posts/2026-03-03-intent-based-commits-ghost-01.webp)

我在 Hacker News 看到一個叫 **Ghost** 的專案，標語很直白：*commit intentions, not code*。

它做的事有點反直覺：你不是先改 code 再 commit，而是先 commit 一段 prompt，然後讓 coding agent 生成程式碼、把改動寫進 working tree、幫你 stage 檔案，最後把 prompt + agent/model/session/files 這些資訊塞進 commit message。

乍看很像又一個「把 AI 塞進 git」的玩具。

但它刺到我一個點：如果程式碼越來越便宜、越來越容易被生成，那我們到底想在版本控制裡保留什麼？

## Ghost 真正在改的是什麼

傳統 git history 大多是：

- 改了什麼
- 大概為什麼（前提是有人寫得像樣）

Ghost 想讓 history 變成：

- 你當時想要什麼（意圖）
- agent 最後吐出了什麼（產物）

所以它叫「intent-based commits」。它在暗示：真正的 source 不是 diff，而是 prompt。

大概流程長這樣：

```text
you: ghost commit -m "add user auth with JWT"
     ↓
agent 生成程式碼 → 寫進 working tree
     ↓
ghost 掃出變更 → stage 新/改檔案
     ↓
用加料版 commit message 提交（prompt + agent + model + session + file list）
```

## 我喜歡的地方：它講的是可重播（replay），不是效率

很多 AI 工具都在講「你會更快」——這我相信，但那不稀奇。

比較有意思的是：**prompt 是可重播的**。

模型一定會一直變。你把「意圖鏈」留在 git 裡，未來可以用更好的模型把同一串意圖重新跑一遍，得到一個更合理的版本。

這不會保證產物一樣（大概率不會），但也許本來就不需要一樣。

我甚至覺得它更像 infra 的思路：

- artifact（產物）是可替換的
- definition（定義/意圖）才是你要版本化的

## 我不喜歡的地方：很多人的『意圖』其實只是 vibe

講白了，很多軟體團隊的「意圖」不是意圖，是模糊的願望。

例如你丟一句：

```text
"把登入做得更安全"
```

這不是 spec，這是祈禱。

你把它寫進 git history，表面上 history 變乾淨了，但你只是把模糊從：

- 「這個 diff 我看不懂」

移動到：

- 「這個 prompt 根本沒講清楚」

所以我覺得如果真的要玩 intent-based commits，有一條硬規則跑不掉：**prompt 品質會變成工程紀律的一部分**。

你沒有逃離產品思考，你只是把它版本控制起來。

## 我覺得最被低估的是：metadata 這一塊

Ghost 會在 commit message 裡加一個 `ghost-meta` 區塊，讓你之後能追：

- 當時用的 prompt 是什麼
- 用哪個 agent/model 跑的
- session id 是什麼
- 影響了哪些檔案

這不是炫技，這是「事後能不能 debug」的基本盤。

我們常常以為 AI codegen 最可怕的是「它會寫出怪 code」。

我反而覺得更可怕的是：**它寫出怪 code，但你完全不知道它怎麼來的**。

## 如果這件事要變成『真的』，我猜會往這個方向走

我覺得團隊要把這套玩到可用，大概會進化成：

- prompt 需要引用 ticket/spec（意圖要有錨點）
- prompt 會有模板/欄位（讓意圖更可測試、更可審查）
- CI 可能會檢查 metadata 完整性
- 保留一條很清楚的「手寫 commit」fallback（有些改動就是要全人工掌控）

把 prompt 當成 API 設計來對待：你寫得越含糊，下游越不可預測。

我會繼續關注 Ghost 的原因也在這。

它不一定會取代 git，但它把我們一直在糊弄的東西攤開來：真正脆弱的，從來都不是 diff，而是「意圖層」。

---

**References:**
- [Ghost 專案頁：README 與使用方式（GitHub）](https://github.com/adamveld12/ghost)
- [Hacker News 首頁（Ghost 的討論出現處）](https://news.ycombinator.com/)