---
layout: post
title: "Emdash 這種 ADE 才是 coding agents 的正解：你缺的不是模型，是隔離"
date: 2026-02-24 20:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Emdash agentic development environment 截圖](/img/posts/2026-02-24-emdash-agentic-development-environment-01.webp)

我越來越覺得，coding agent 最強的地方不是「寫得多快」，而是「可以吐出 diff」。

問題是：你一旦想要它同時做兩件事，你的 repo 很快就會變垃圾場。

真正折磨人的不是模型好不好，是工作流衛生：
- agent 把你的 working tree 攪爛
- 你開始搞不清楚「這段改動是哪一次 prompt 產生的」
- 你沒辦法同時跑兩個實驗而不互相污染

所以我很吃「Agentic Development Environment（ADE）」這個抽象。
它講的不是更炫的聊天介面，而是更務實的東西：**隔離模型（isolation model）**。

Emdash 是一個開源 ADE，核心態度很工程師：如果你要多 agent 並行，每個 agent 都該有自己的沙盒；在 Git 的世界裡，最便宜的沙盒就是 worktree。

## 真正的限制：並行，但不能讓 repo 失控
大家對 agent 的想像通常是：
「開三個 agent 同時跑三張 ticket，我只要最後 review。」

現實如果沒有隔離，就是：
- 衝突亂飛
- 半套 branch 堆成山
- 你最後花最多時間在追溯：到底哪個修改是怎麼來的

worktree-based 的心智模型乾淨很多：

```text
issue A -> worktree A -> agent A -> PR A
issue B -> worktree B -> agent B -> PR B
```

沒有魔法，只有邊界。

## 「provider-agnostic」不是裝飾，是降低切換稅
很多人把 provider-agnostic 當成行銷用語。
我反而覺得這是 ADE 會不會活下來的關鍵。

因為 agent 的能力波動太大了：
今天你覺得某個工具適合 refactor，下個月可能就換人領先。

如果你的 workflow 跟某一家綁死，你會一直付切換稅（時間 + 心智負擔）。

Emdash 的方向是：整合多個 CLI agent，把它們當成可插拔後端。換句話說：**標準化的是流程，不是模型**。

## SSH remote dev 是那種「很不性感但很重要」的能力
認真一點的 repo，常常不在筆電上。
它在 build box、GPU host、或遠端 dev VM 上，環境才是可重現的。

ADE 如果不能在「code 真正所在的地方」跑，就很容易變成 demo 工具。

所以我喜歡 Emdash 把 SSH 當第一等公民。
它其實是在承認一個無聊的事實：接近 production 的工作，通常發生在你不會帶著走的機器上。

## 沒人想承認的一點：agent 越多，你的 review 負擔越大
並行 agent 不會消除工作，只是重新分配。

你能開 5 個 agent，就能產出 5 個「看起來有點對，但不完全對」的解法。
然後你就變成：merge conflict resolver + product owner + QA。

所以最強的 ADE 不會是「最會生 agent」的那個。
而是能讓 review、diff、cleanup 變得很便宜的那個。

## 我的結論
我不確定我們真的需要「到處都是 agent」。
但我很確定：我們需要 **到處都是隔離**。

未來的 agentic coding，可能不會是：
- 「一個超級 agent 在同一個 branch 做完所有事」

而更像：
- 「很多小 agent，各自被限制，各自吐出可 review 的 diff」

如果方向是這樣，ADE 會變得越來越重要。
因為瓶頸不再是打字寫 code。
而是你的 repo（跟你的腦）能不能維持在一個狀態：你可以信任『到底改了什麼』。

---

**References:**
- [Emdash 的 GitHub repo（開源 ADE）](https://github.com/generalaction/emdash)
- [Emdash 官網：ADE 的定位與使用方式](https://www.emdash.sh/)
- [Git 官方文件：用 git worktree 做隔離](https://git-scm.com/docs/git-worktree)
