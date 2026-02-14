---
layout: post
title: "OpenAI 的 mission 文字正在變成一個產品介面"
date: 2026-02-14 17:00:00 +0000
categories: [Tech]
tags: [Tech]
author: Tommy
lang: zh
---

![一張極簡黑白插畫：一份法律文件、一個標著「safely」的 UI toggle、以及一把扳手](/img/posts/2026-02-14-openai-mission-safely-01.webp)

我最近在看一個很不「情懷」的現象：**AI 公司寫在首頁或文件裡的 mission statement，正在變成一個產品介面。**

以前 mission 是那種你看過一次就忘的段落，偏 vibe。

但現在不一樣。

它更像 public API surface：每個詞的改動，都可能在下游造成連鎖反應——監管、合作夥伴、企業採購、甚至公司內部的優先順序。

今天這波又被翻出來的引子，是一個小細節：OpenAI 在 IRS / tax filing 的文字裡，2024 版把一些帶安全意味的用詞拿掉了（大家最愛抓著「safely」這種字做解讀）。

我不打算做道德審判。

我比較在乎的是：**為什麼這種改字，會在工程/產品層面變得重要？**

## 1) Mission 以前是 vibe，現在是 constraint（約束）

寫 code 久了，你會慢慢接受一個很無聊的事實：大多數「文化」只有在它變成 constraint 的時候才是真的。

- SLO 是 constraint
- runbook 是 constraint
- 預算是 constraint
- compliance 要求也是 constraint

Mission 不是 constraint——直到它變成別人能拿來引用、甚至拿來要求你的文字。

而在 AI 這個圈子，每個人都會引用每個人。

所以 filing 裡的一句話不是「branding」。它會變成**子彈**，子彈會變成**產品壓力**。

## 2) 讀者不是重點，重點是「未來每一次談判」

看到這種文字修改，我不太會想「他們要討好誰」。

我會想：

- 雲端合作夥伴在意的是什麼語氣，才能讓 distribution 順？
- enterprise procurement 需要看到什麼承諾，才能簽字？
- 監管單位需要拿什麼作為「你自己說過」的依據？

換句話說，真正的 audience 是：

> 「未來每一次會議裡，有人問你：你到底承諾了什麼？」

這也是為什麼 mission wording 會越來越像法律文字。

因為它就是。

## 3) Safety 不是哲學，它是 cost center

工程師最愛的版本是：

> 「我們應該做對的事。」

公司活著的版本是：

> 「做對的事要花多少錢？誰付？」

當 safety 變成可量化的東西——headcount、eval pipeline、red team 合約、incident response、policy enforcement——它就變成可以編列的成本。

可以編列，就可以談。

所以是的，一個字被拿掉可能是一個 signal。

不是預言，是 signal。

## 4) 最不舒服的點：mission 也是你和「自己員工」的契約

很多人只把 mission 當外部宣傳。

但在大公司裡，mission 同時是**內部授權系統**：

- 研究團隊覺得「合理」的研究方向是什麼
- 產品團隊敢不敢 launch 某個功能
- infra / security 團隊能不能拒絕支持某些風險

你看過大組織吵優先序就知道，最後常常會收斂到一句話：

> 「但我們說過我們會……」

當「我們說過」的文字改了，內部 bargaining chips 也會跟著改。

## 5) 我的工程結論：把 mission 文字當成 API contract 在管

如果你的產品是靠信任活著，那你的承諾本身就是系統的一部分。

所以我會希望 AI 公司至少做到：

- **版本化（version）**：對外/對內都要知道現在是哪一版
- **說明差異（diff）**：像 changelog 一樣講清楚
- **預期下游破壞（breakage）**：語氣一變，下游就會重解讀

因為下游使用者是真的：

- 客戶會用你的承諾寫政策
- 夥伴會拿你的語氣做背書
- 監管會追你的 commit history

你不控制 interpretation，就會有人替你控制。

## References

- [Simon Willison 文章與 OpenAI mission wording 的整理入口（含歷年比較）](https://simonwillison.net/)
- [上一篇：Safety 是 legal string，不是口號](/zh/Tech/2026/02/14/safety-is-a-legal-string.html)
