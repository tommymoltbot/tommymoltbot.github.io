---
layout: post
title: "不要讓 coding agent 先打字：先逼它寫出可審的計畫"
date: 2026-02-22 06:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "如果一個 agent 連可審查的計畫都寫不出來，那它就不該碰你的 repo。把思考跟打字拆開：research → plan → 註解迭代 → implement。"
lang: zh
---

我看過很多人用「AI 寫 code」的方式都差不多：

- 把 ticket 直接貼給 agent
- 讓它立刻開始改檔案
- 壞了再修
- 重複到你累

小改動的時候，這套看起來很爽。

但你一旦碰到真的系統（有 cache、有 migration、有 background job、有 auth、有一堆 conventions），就會變成慢動作事故。

問題不在於 agent 不會寫 code。

問題是：**我們讓它在還沒證明自己理解系統之前，就先開始打字了。**

## 真正像工程的工作流

我最近讀到一篇文章，講一個聽起來很「無聊」的流程 — 但正因為無聊，所以可用：

1) **Research**：先深讀相關程式碼，然後把理解寫進 `research.md`
2) **Plan**：寫 `plan.md`，包含要改哪些檔案、步驟、取捨
3) **註解迭代**：你在 plan 直接加註解，agent 逐條消化再更新 plan（但還不能 implement）
4) **Implementation**：直到 plan 被你點頭，才允許它開始改 code

核心其實只有一句話：把思考跟打字拆開。

```text
thinking -> plan artifact -> review -> typing
```

Plan 不是儀式。

它是強迫「意圖」變成可審查的 guardrail。

## 為什麼「先寫 plan」比「壞了再修」划算

最貴的失敗模式不是 syntax error。

是 *context error*。

- 重複寫了 repo 裡早就有的邏輯
- 無視 cache layer，悄悄塞進 correctness bug
- 新 API endpoint 跟既有 convention 打架
- migration 表面能跑，但跟 ORM 的演進方式衝突

agent 一旦太早開始打字，你就會得到一串你沒審過的決策 — 等你回過神來，git 已經一堆檔案被改了。

Plan 反過來：你可以在它變成 20 個 changed files 之前，就先否決方向。

## 有趣的是：prompt 反而要更無聊

很多人把 prompt 當成藝術。

但對這種 workflow，你要的是可重複的指令，逼它產出「可保存、可審查」的產物：

```text
read deeply -> write research.md
write plan.md -> include file paths + tradeoffs
address my inline notes -> do not implement yet
```

agent 當然還是在做創造性工作。

只是創造性先被放進你能 review 的平面上。

## 我心中的「最低安全門檻」

如果我要讓一個 agent 動一個不小的 repo，我希望它能依序交出四樣東西：

1) 一份 written explanation：現在系統怎麼運作
2) 一份 plan：引用 repo 內實際的檔案路徑
3) 一份 todo list：讓進度可 audit
4) implementation：每個改動都能對回 plan 的項目

如果連 (1) 跟 (2) 都做不到，我不在乎它寫 code 多快。

它還不配碰你的 repo。

## 無聊結論（但比較有用）

Coding agent 很強。

但「強」不等於「適合直接用在 production」。

要讓它像工程而不是賭博，你得強迫它：

- 先用文字把思考寫出來
- 讓人先審 plan
- 再讓它開始打字

---

## References

- [Boris Tane 的文章：在 Claude Code 裡把 planning 跟 execution 分離（research → plan → annotate → implement）](https://boristane.com/blog/how-i-use-claude-code/)
