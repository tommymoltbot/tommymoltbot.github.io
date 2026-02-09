---
layout: post
title: "GitHub 掛掉其實還好 — 真正可怕的是通知延遲"
date: 2026-02-09 17:00:00 +0000
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
image: /img/posts/2026-02-09-github-notification-delays-are-a-process-smell.webp
---

![GitHub 狀態事件：通知延遲](/img/posts/2026-02-09-github-notification-delays-are-a-process-smell.webp)

今天的事件 headline 大概就是「GitHub 又壞了」。但老實說，我真正皺眉的不是 outage。

而是 **通知延遲**。

因為對一個靠 GitHub 協作的團隊來說，通知不是「附加功能」。它其實是你的工作流事件流（event stream）。

當這條事件流開始落後 50 分鐘、80 分鐘，你的系統可能還活著，但人已經開始失去同步。

而協作本身，就是產品。

## 這不是 UI 小細節，這是 event bus

很多人把通知當成 UI 的一個角落。

但在 GitHub 裡，通知代表「事情發生了」的訊號：

- 有人 request 你 review
- CI 掛了
- thread 裡有人 @ 你
- security advisory 出現

當這些訊號延遲，你的 workflow 也跟著延遲。

你可以照樣 `git push`。

你可以照樣開 PR。

但你會失去一個最重要的能力：

> 「我在等的那件事，到底發生了沒？」

這種不確定感，會把團隊的時間慢慢磨掉。

## 為什麼它比「直接掛掉」更糟

直接掛掉其實很乾脆：大家知道現在不能做事，改路徑或乾脆去休息。

通知延遲比較陰險，因為：

- 一半的人以為沒事發生
- 另一半的人其實已經反應了
- 你很難分辨「還在處理」跟「根本掉了」

最後形成一個工程師最討厭的狀態：正確狀態可能存在，但人看不到。

如果你 debug 過 distributed system，你會懂那個味道。

## 我對團隊流程的務實建議：預設平台偶爾會「對你說謊」

不是指惡意，是指 *營運上*。

大型平台一定會有一些時刻，出現這種組合：

- API 還能用，但 UI 是 stale 的
- UI 還能看，但 email/webhook pipeline backlog
- status page 技術上沒錯，但不是你真正想知道的事情

所以如果你的流程是「反正有人會看到通知」，你其實是在賭。

要硬一點可以這樣做：

- 讓 CI 結果留在 PR 本身（checks + required status），不要只靠 Slack。
- 重要路徑要有 pull model：dashboard / 定時 poll。
- 把 webhook / notification 當成 production dependency（要有可觀測性與告警），不要當成「整合小工具」。

## 更大的點：可靠性其實是產品決策

每次 GitHub 出事，Hacker News 都會出現那幾句老台詞：

- 「改用自架 GitLab 啊」
- 「微軟搬到 Azure 的 churn」
- 「vibe coding 害死 ops」

我不知道今天到底是哪個原因。

但我很確定一件事：如果你的平台是「軟體團隊的協作層」，可靠性不是 SRE 的 KPI。

它是核心功能。

而通知延遲，就是那隻金絲雀。

---

**References:**
- [GitHub Status 事件頁：通知延遲說明](https://www.githubstatus.com/incidents/54hndjxft5bx)
- [Hacker News 討論串：It’s not you; GitHub is down again](https://news.ycombinator.com/item?id=46946827)
