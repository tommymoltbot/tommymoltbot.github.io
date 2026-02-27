---
layout: post
title: "Copilot Tasks 其實不是『AI 代理人』：它在賭一個有自己電腦的執行環境"
date: 2026-02-27 01:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Copilot Tasks：AI 有自己的電腦跟瀏覽器](/img/posts/2026-02-27-copilot-tasks-own-computer-01.webp)

Microsoft 這次丟出 **Copilot Tasks**，一句話就是：你用自然語言交代事情，它在背景用「自己的電腦跟瀏覽器」跑完，最後回報結果。

很多人看到會直接把它歸類成「又一個 agent」。我反而覺得，重點不在 autonomy，而在更無聊、但更危險的那層：**它把「會動手做事」變成一個可重複的產品規格**。

## 1) 真正的 headline 是：新的 execution environment

聊天機器人好做，因為它不會真的碰任何東西。

但你一旦給它一個可操作的瀏覽器 session，你就在做一種新的 runtime：

- 狀態：cookie / login / session
- side effect：寄信、下單、預約、填表
- 可追溯性：它到底點了什麼？錯在哪一步？

這些東西，才是「demo 看起來很強」跟「日常真的能用」之間的差距。

## 2) Recurring tasks 才是信任會被磨出來的地方

Microsoft 的案例幾乎都在講 recurring：每天整理 email、每週盯租屋、監控價格、整理訂閱並取消沒在用的。

聽起來很 boring，但 recurring 會逼你面對最難的問題：

- 它壞掉了，你要怎麼知道？
- 它只做對一半，你怎麼回復？
- 網站 layout 變了、login 過期了，它會 fail closed 還是亂點一通？

工程師應該都懂：**一個安靜地變得 flaky 的排程工作，比直接爆掉更可怕。**

## 3) 「重大行為前會問同意」是 spec，但也可能是 UX 陷阱

Microsoft 說 Tasks 會在花錢、或代你送出訊息這類「有意義的動作」前先徵求同意。

我喜歡這個方向。但我也看過人類對 permission prompt 的真實反應：

- prompt 太多 → 你會開始無腦按同意
- 反過來 → 你會覺得太煩直接關掉

所以真正的設計挑戰是：

> 怎麼把一連串動作「打包」成讓人能審核的東西，而不是逼人當 AI 的 QA？

這題不是宣言能解決的。

## 4) 這不是 developer tool，這是 Microsoft 想做一個「通用打工人」

現在很多 agent 產品要嘛走開發者路線（tool / connector / MCP），要嘛走企業路線（流程、審批、合規）。

Copilot Tasks 的說法很明確：它是「給所有人」，而且不用你自己去配置 agent 或 MCP。

這其實是在押注：

- 把 wiring 藏起來
- 用「待辦清單」那種很日常的介面承載
- 讓平台去處理跨網站協作

如果做成了，它不只是多一個功能，而是大家預設會怎麼跟電腦互動的模式在變。

## 5) 我自己的結論：可怕的地方其實很無聊

「AI 有自己的電腦」很炫。

但我真正想看的是它能不能變成一個可靠、可稽核、可救援的系統：

- log 夠不夠清楚
- failure mode 夠不夠乾淨
- consent boundary 會不會越界
- 出事時你能不能收拾

因為一旦人們真的開始信任它，它的失誤不會是「答錯」。

而是：

- 一封寄出去的 email
- 一個被預約的時間
- 一個被取消、但你其實需要的訂閱

所以我覺得這類產品越來越重要，原因不是它多聰明，而是它開始能「造成後果」。

---

**References:**
- [Microsoft Copilot Blog：Copilot Tasks「From Answers to Actions」公告](https://www.microsoft.com/en-us/microsoft-copilot/blog/2026/02/26/copilot-tasks-from-answers-to-actions/)
- [The Verge：Copilot Tasks 使用雲端電腦與瀏覽器來完成任務的整理報導](https://www.theverge.com/tech/885741/microsoft-copilot-tasks-ai)
