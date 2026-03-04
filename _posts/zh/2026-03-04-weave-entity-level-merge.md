---
layout: post
title: "Weave：Git 的 line merge 不是你的錯，但它真的開始拖慢你"
date: 2026-03-04 03:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Weave – entity-level merge](/img/posts/2026-03-04-weave-entity-level-merge-01.webp)

Git merge conflict 這件事，大家都習慣了。

但你如果最近開始讓多個人（或多個 agent）同時碰同一個 repo，你會發現很多 conflict 根本不是「邏輯衝突」，只是 Git 的 line-based merge 看到兩段文字碰在同一塊，就直接喊停。

我看到一個專案叫 **Weave**，它想做的事情很單純：把 merge 的單位從「行」提升到「程式結構（entity）」——像是 function、class、JSON key 這種。

老實說，這想法有點像「你早該這樣做了」。但我也同時覺得：任何會自動幫你 merge 的東西，最可怕的不是它衝突，而是它 *自信地 merge 錯*。

所以這篇我想講的是：它到底在解什麼痛點、為什麼現在特別重要，以及我會怎麼用 production 的眼光去看待它。

## Git 其實是在解一個很務實的問題

Git 從來就沒有想懂你的 code。

它的假設很簡單：文字檔 = 一行一行的字。

這個假設的好處是：

- 很 predictable
- 很好 debug
- 出事了也大多能回到「人類手動解」

但缺點也很明顯：**很多 conflict 其實是假衝突（false conflict）**。

典型例子：

- A 分支加了 `validateToken()`
- B 分支加了 `formatDate()`
- 兩個人都把 function 插在同一個檔案靠近同一段
- Git 看起來就是「兩段都改到同一塊」→ conflict

但在語意上根本沒有衝突。

你花時間解掉的，只是 Git 的視角太粗。

## 為什麼 entity-level merge 在 2026 年突然變很重要（因為 agents）

如果你是一個人寫 code，假衝突頂多煩。

如果是一般團隊協作，你還可以用一些手段減少：

- 拆檔
- 模組化
- 規範大家不要亂插同一區

但如果你開始讓多個 agent 平行工作，狀況就變了。

agent 很常：

- 生成大量 boilerplate
- 把 helper functions 集中塞同一個檔案
- 插入點不一致（因為它沒那種「我知道大家都在改哪」的默契）

然後你就得到一堆 conflict。

不是因為你架構爛，是因為「平行改動」變得太頻繁，Git 的 line-based merge 直接變成瓶頸。

## Weave 的做法大概是這樣

我理解它的核心流程是：

1) 用 tree-sitter 把 base/ours/theirs 都 parse 成結構
2) 抽出 entity（function/class/各種 key）
3) 依 identity（名字 + 類型 + scope）去對齊
4) entity 層級做 3-way merge
5) 只有兩邊真的改到「同一個 entity」才 conflict

換句話說，它把問題從「兩段文字重疊」換成「你們是不是同時改到同一個 function」。

這個問題問對了。

## 我覺得它最有用的幾種場景

### 1) JSON/YAML 之類的設定檔

line-based merge 很容易在設定檔產生超白痴的 conflict。

你改 A key，我改 B key，結果因為縮排或排序靠太近就 conflict。

如果 merge 的單位是「key」，那很多 conflict 就會自然消失。

### 2) 每個人都會加一點東西的 common 檔

像是：

- `utils.ts`
- `helpers.py`
- 一些大家都會丟 helper 進去的 module

這種檔案永遠都會被多人碰。

Weave 的方向其實是在說：這些檔案應該要能承受平行加 function，而不是每天都在人工解 conflict。

### 3) agent 的 bulk changes

你讓 agent 一次加 10 個 helper，它很常把 output 堆在同一段。

Git 就開始哭。

entity-level merge 可能就直接 merge 了，省掉人類的 babysitting。

## 我最擔心的點：它會不會「merge 錯但你不知道」

我對 merge 工具的態度一直很簡單：

- 它少衝突我很開心
- 但它如果會偶爾 merge 錯，那我寧願它衝突

Weave 看起來是走比較保守的路線：

- 不同 entity → 自動 merge
- 同一個 entity 兩邊都有改 → conflict 或做更小範圍的 merge
- 檔案太大 / 不支援類型 → 回退到正常 Git 行為

這種策略我能接受。

但 entity identity matching 永遠是硬題：

- rename
- move
- signature 改動

到底算不算「同一個 function」？

它猜錯的後果很大。

所以我還是會用 production 的方式去導入，而不是一口氣全 repo 開。

## 我會怎麼把它當成「可以上 production 的東西」

我自己會做一個超務實的 checklist：

1) **merge 後一定跑測試**

你本來就該做。但當 merge 越來越自動，人很容易放鬆。

2) **先用 `.gitattributes` 限縮範圍**

先從低風險檔案開始：

- JSON/YAML/TOML
- 那種「大家只會加 function」的 module

3) **保留隨時回退的路**

覺得怪就關掉，回正常 merge。不要讓它變成「出事要全公司查半天」的黑箱。

4) **讓 auto-resolve 的結果可觀測**

對 agent workflow 來說，你想知道：哪些東西是工具幫你自動解的。

不是只有 CI green/red 而已。

## 我為什麼仍然喜歡這個方向

這類東西其實不太「AI」。它就是工程。

但它明顯是被 AI 開發模式拉出來的需求：

- 平行改動更多
- 變更密度更高
- 機械式 refactor 更常發生

Git 的 line merge 是為人類手動寫字設計的。

我們現在想用「function」當變更單位去協作，那 merge 層也應該升級。

Weave 會不會成為標準我不知道。

但我很確定：如果 agentic dev 要真的變成常態，merge 這一層不可能永遠停留在「行」的世界。

---

**References:**
- [Weave 專案與設計說明（entity-level semantic merge driver）](https://github.com/Ataraxy-Labs/weave)
- [tree-sitter 官方文件（用於把程式 parse 成結構）](https://tree-sitter.github.io/tree-sitter/)
- [Git 文件：gitattributes 與 merge driver 設定方式（用來限制套用範圍）](https://git-scm.com/docs/gitattributes)
