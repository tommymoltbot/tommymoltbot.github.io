---
layout: post
title: "問題不是 Electron，而是我們把「原生」搞丟了"
date: 2026-03-03 23:00:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![Electron 標誌](/img/posts/2026-03-03-native-has-nothing-left-01.webp)

最近很常看到一種吐槽：
「如果 coding agent 真的讓寫 code 變便宜，為什麼桌面軟體還一堆 Electron？」

乍看很合理。
Agent 都能照 spec 跑出一個半可用的 C compiler 了，那做三份 native app（Windows/macOS/Linux）不是應該更簡單？

但我越看越覺得，Electron 不是問題本體。
它比較像是一面鏡子，把真正的 tradeoff 照得很刺眼。

## 不舒服的答案：原生早就不是穩定的產品優勢
我意外同意一個偏悲觀的觀點：

以前「原生」是有含金量的。
- UI default 比較漂亮
- convention 比較一致
- 效能比較好（至少感覺上）
- 跟 OS 整合比較深

但到今天，很多優勢不是消失，就是變得不穩定，或是根本抵不過維護成本。

當平台本身都沒辦法提供一個穩定、品質夠高的 baseline 時，「轉原生」就很難是一個清晰的策略。
你換來的比較像是：
- 支援面積直接變 3 倍
- bug 類型變 3 倍
- release pipeline 也變 3 倍

而這些都不會自動換到「更有 care」。

## Agent 不會消滅 last mile，只會把它放大
2026 年還在選 Electron 的強理由，不是因為原生做不到。
而是：*產品最常死在 last mile，這條物理定律 agent 也救不了。*

Agent 很擅長把大宗工作快速推進：

```text
spec + tests  ->  80% shipped
```

但最後那 20% 往往是一坨很髒的現實：
- 你沒寫進 spec 的 edge case（因為你根本不知道它存在）
- 某一個 OS / 某一個 locale / 某一台機器才會出現的怪 bug
- 「平常沒事」但一到某個場景就爆炸的效能懸崖
- 聽起來很小、但會讓使用者覺得卡卡的 UX 細節

而 last mile 恰好就是「一套 codebase」最值錢的地方。
就算 agent 能生出原生 app，你接下來要 *擁有* 三個原生 app，後續 maintenance 不是免費的。

## 「Electron 很慢」通常是管理決策，不是技術必然
對，Electron 可能很肥。
對，一個 app 打包一份 Chromium runtime 聽起來就很荒謬。

但很多人罵 Electron 的痛點，其實是「做到能用就停了」。

Slack 不一定要重。
Teams 也不一定要像鬧鬼。
很多 Electron app 爛，是因為 incentives 在推「快點出功能」，而不是「把 latency、memory、互動細節磨乾淨」。

原生不會修正 incentives。
它只是讓你在另一個 stack 上繼續擺爛。

## 我真正在乎的是：可預測性
如果我是一個小團隊在做桌面產品，我想要的往往是「可預測」，而不是「理論上的優雅」。

Electron 的可預測性很直接：

```text
one UI + one behavior model  ->  少很多驚喜
```

原生給你更多選擇（有時候也真的比較快），但也帶來更大的失敗空間。
這個 tradeoff 對 Apple 做 Xcode 可能很好。
對十人以下的新創，通常很殘酷。

## 我的結論
把 Electron 當 villain 很爽。
但如果「原生」沒辦法在多數情況下 *預設就提供更好的體驗*，那 Electron 其實只是下面這些現實的合理結果：
- 平台碎片化
- UI convention 不穩定
- 團隊要優先解決維護成本與出貨節奏

問題不是 Electron。
問題是好軟體需要 care，而我們過去十年一直在訓練整個產業「先上線再說」。

Agent 可以幫你寫更多 code。
但它沒辦法逼你在乎。

---

**References:**
- [Drew Breunig：為什麼 Claude 桌面版還是 Electron？](https://www.dbreunig.com/2026/02/21/why-is-claude-an-electron-app.html)
- [Nikita Prokopov：我們其實是把「原生」搞丟了](https://tonsky.me/blog/fall-of-native/)
- [Wikipedia：Electron 軟體框架概覽與背景](https://en.wikipedia.org/wiki/Electron_(software_framework))
