---
layout: post
title: "現在寫 code 變便宜了，但帳單只是換地方而已"
date: 2026-02-23 18:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一條簡單流水線：code → tests → docs → review → ops → security](/img/posts/2026-02-23-code-is-cheap-01.webp)

我最近最常聽到的一句話是：

> 「AI 讓寫程式幾乎變免費，那工程就差不多解決了吧？」

不是。

**變便宜的只有「把字打進編輯器」這件事。** 成本沒有消失，只是搬家。

Simon Willison 在他的文章裡把這個心理落差講得很準：我們過去所有的工程直覺，都是建立在「code 很貴」的世界上。現在 agent 可以把 implementation 的速度拉到很誇張，你的直覺會瞬間失靈。

而且更可怕的是：如果你讓「code 變便宜」改變了你的節奏，但你沒有同步升級品質控制，你得到的不是槓桿，你得到的是**更快的故障**。

## 新的價格標籤：證明它是好 code

當有人說「agent 6 分鐘就寫完了」，我腦袋第一個浮現的不是佩服，是這幾個問題：

- happy path 以外也能跑嗎？
- regression tests 在哪？
- 這段到底改了哪些行為？
- 下禮拜輪值的人會不會想打人？

AI 可以幫你生 tests，也可以幫你列 edge cases。

但真正貴的還是：你要有足夠的信心把它放進 production，並且能在出事的時候快速定位。

那種信心通常不是靠「看起來合理」堆出來的，而是靠一些很無聊、但真的會救命的東西：

- 會抓到破壞行為的 tests
- 出事時能看懂的 logs
- 和行為一致的 docs
- 會抓到「看起來對」但其實不對的 code review

如果你把這些當 optional，你的 codebase 就會變成一台拉霸機。

## 五個角度，讓我在 agentic 時代不至於失智

這幾個想法最近很常救我。

### 1) code 變便宜，但注意力還是稀缺

agent 可以同時丟你 10 種寫法，但你還是得選。

所以我現在更在乎的是：**降低未來要做決策的次數。**

我很願意花 token 去換：
- diff 更小
- interface 更清楚
- error handling 明確
- 少一點「聰明」

當 code 變多，稀缺的反而是「可讀性」和「理解成本」。

### 2) 新 bottleneck 是 review，不是 implementation

如果你讓 agent 幫你生一個超大 PR，你不是省時間，你只是把工作從「寫」搬到「看」，而 review 才是最容易累、最容易漏 bug 的地方。

我的規則是：**agent 只能做小切片。**

- 一個 endpoint
- 一個 migration
- 一個 test suite 修復
- 一個監控面板

在 agentic 時代，小 PR 不是保守，是效率。

### 3) 「本機能跑」不是 production 策略

最容易被 AI code 騙的方式，就是把「local 跑得動」當成功。

production 真正在乎的是：
- 部分失敗時的正確性
- 真實 load 下的行為
- 凌晨三點不對勁時，你能不能看懂它

所以我常拿這句話當檢查點：

```text
如果它失敗了，我們怎麼知道？又怎麼在 10 分鐘內把它救回來？
```

如果回答不了，這段 code 一點都不便宜，它只是把成本延後成 incident。

### 4) 便宜 code 的最好用途：把你一直跳過的東西補齊

這其實是我最喜歡的部分。

以前很多「我們知道很重要」但總是做不完的東西，現在突然變得合理：

- debug UI
- 更好的 CLI tooling
- golden-path integration tests
- incident 重播/重現 harness
- migration dry-run 模式

agentic 工具讓這些的邊際成本下降，你就比較敢投資。

Simon 也提到類似的直覺：當你腦袋浮現「不值得花時間」，可以先丟出去跑一個 prompt。最糟就是浪費 token，不是浪費一週。

### 5) 組織習慣通常會落後工具一大截

很多團隊還活在舊經濟：

- 長時間估工、設計、開會
- release 慢
- 「沒時間寫 tests」

如果 implementation 快了 10 倍，但流程不變，你不會得到 10 倍產出。

你會得到：
- 更多 WIP
- 更多半成品
- 更脆的系統

正確回應不是「把流程全部砍掉」，而是把流程移到「驗證」上：

- 更小的 release
- 更好的監控
- 更清楚的 rollback 路徑
- 明確的 quality gates

## 我的結論

我不是反 agent。我每天都在用。

但我越來越覺得，「現在寫 code 變便宜了」這句話如果不補後半句，其實很危險：

**寫 code 變便宜了，所以你唯一負責任的做法，是把省下來的時間拿去買品質。**

不然你只是把成本往後推，推成更大、更痛的那種。

---

**References:**
- [Simon Willison 的〈Writing code is cheap now〉（Agentic Engineering Patterns）](https://simonwillison.net/guides/agentic-engineering-patterns/code-is-cheap/)
- [Hacker News 上對〈Writing code is cheap now〉的討論串](https://news.ycombinator.com/item?id=47125374)
