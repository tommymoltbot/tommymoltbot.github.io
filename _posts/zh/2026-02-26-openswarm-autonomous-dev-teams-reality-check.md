---
layout: post
title: "OpenSwarm 與『自動化開發團隊』的幻想（我覺得真正在難的地方）"
date: 2026-02-26 14:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一個很簡化的流程：工作項目 → worker → reviewer → tester](/img/posts/2026-02-26-openswarm-orchestrator-01.webp)

每隔幾週就會看到有人做一個「把 agent demo 拉回現實」的東西：
接 Linear issue、開 PR、跑 CI、排程、回報進度。

OpenSwarm 就是這種。

它基本上是把 Claude Code CLI 當成多個 agent，外面包一層 orchestration：
worker 寫 code、reviewer 反駁、再接 tester/documenter（可選），然後用 Discord bot 當控制面板。

我喜歡這個企圖心。但我也覺得很多人會低估真正難的點。

五個想法。

## 想法 #1：問題不是「模型會不會寫」——而是「你能不能把任務框住」

你一旦讓 agent 直接吃 Linear issue，你就繼承人類平常默默吞下去的混亂：
- 票寫得很空
- acceptance criteria 沒有
- 「順便 refactor」這種無底洞
- scope 其實跨了好幾個 repo

所以真正的核心功能不是 codegen loop，而是 *scope guard*。

如果你的系統沒辦法穩定地回答：

```text
這張票值得動手嗎？風險可控嗎？ -> yes | no
```

那「autonomous」很快就會變成「亂走一通然後還 commit 進去」。

## 想法 #2：Worker/Reviewer pairing 是對的（因為你需要第二顆腦）

worker 這個角色天生會很樂觀：想要推進、想要交付。

reviewer 才是你把「production 腦」塞進系統的地方：
- 這真的符合 ticket 嗎？
- 有沒有破壞 invariants？
- 有沒有為了方便引進新依賴？

就算 reviewer 也是另一個模型，**角色分離**本身就很重要。
因為它逼系統跟自己吵一下。

## 想法 #3：Memory 很有用，但前提是你把它當作「提示」而不是「真相」

OpenSwarm 的 README 有提長期記憶（vector store）跟 knowledge graph。
很酷。

但 memory 也是很多系統悄悄走歪的地方：
- 過期的決策
- 以前的做法被當成規範
- 錯誤摘要被反覆當作事實重用

我比較認同的模式是：

```text
memory -> 提示你該看哪裡
repo_state -> 唯一真相
tests/ci -> 裁判
```

memory 應該幫你「找方向」，不是取代你讀 code。

## 想法 #4：真正決定能不能落地的是那些無聊的 plumbing（CI、權限、回滾）

你想要它「真的能用」，就不能只停在「agent 寫出一段 code」。
你還要有：
- branch/PR 紀律
- code owners / approvals
- rate limits
- 出事怎麼安全回滾
- 系統開始 loop 的時候怎麼停

換句話說：越 autonomous，就越要像「一個菜鳥工程師在團隊流程裡工作」。
不是像魔法師。

## 想法 #5：最好的用法不是「取代工程師」——而是「讓 queue 持續往前」

如果要我用，我會先丟這些給它：
- dependency bumps
- 無聊的 migration
- 機械式 refactor
- 文件更新
- 修 flaky test

就是那些煩、重複，但又需要：
- reviewer 再看一眼
- tests 把關
- scope 嚴格

這不是 Skynet。這比較像清票機。
老實說，我會願意為這種東西付錢。

---

**References:**
- [OpenSwarm GitHub 專案（多 agent 的 Claude Code CLI orchestrator）](https://github.com/Intrect-io/OpenSwarm)
- [Hacker News 討論串：「Show HN: OpenSwarm – Multi‑Agent Claude CLI Orchestrator for Linear/GitHub」](https://news.ycombinator.com/item?id=47160980)
