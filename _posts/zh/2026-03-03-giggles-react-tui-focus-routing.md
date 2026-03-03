---
layout: post
title: "Giggles（React TUI）：真正的亮點不是元件庫，而是你終於不用自己寫 focus / input routing"
date: 2026-03-03 14:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Giggles 文件頁：一套 batteries-included 的 React TUI framework](/img/posts/2026-03-03-giggles-react-tui-01.webp)

TUI 這種東西很像：看起來超簡單，做到一半才發現自己在造一個小型作業系統。

一開始你只想做「一個列表 + 一個輸入框」，然後你加了 modal、command palette、viewport、scroll、提示訊息……下一秒你就開始處理：

- focus 怎麼切
- 按鍵衝突怎麼解
- input 要不要吃掉 `j/k`
- `Esc` 是關一層還是全部退出
- 為什麼某個 panel 永遠搶走鍵盤

所以我看到 **Giggles**（建立在 Ink 上的 React TUI framework）時，我最在意的不是它有幾個 UI component，也不是「React 19 compatible」。

它真正想解的其實是最髒的那題：**focus 和 input routing**。

## TUI 最難的不是畫面，是「誰拿到鍵盤」

大部分 TUI library 會給你 primitive：
- 畫文字
- 收按鍵
- 做 state

但它們通常不會替你把這題做完：

> 使用者按下一個 key，到底應該是哪個 component 處理？

真實的 app 結構大概長這樣：

- screen
  - panel
    - list
      - list item
        - inline input
  - modal
  - toast

再加上這些規則：
- modal 出現就要搶 focus
- list 想要 `j/k` 導航
- text input 有時候要把 `j/k` 當字元
- command palette 要用 `/` 打開
- `Esc` 要能「退一層」，不是一刀切掉整個 app

到這裡你就懂了：TUI 的核心架構不是 render，而是事件路由。

## 為什麼「focus scope」這種抽象我覺得對

Giggles 的描述是：用類似 `useFocusScope` 的方式定義 focus region，可以自由組合；nested component 不用互相協調也能正常工作；每個 component 擁有自己的 keys；沒處理到的按鍵會往上 bubble。

這其實很像 GUI 世界早就解過的問題：
- 不靠一個全域 `onKeyDown`
- 不寫一串脆弱的 `if modal open ... else if input focused ...`
- 而是有一棵樹，事件沿著規則流動，能推理

如果它真的做到「你照組合就能跑」，那不是方便而已，是你能不能把 TUI 做大的分水嶺。

## 我最期待的是：keybinding ownership

我自己做 TUI 最常被搞到的是「全域快捷鍵」最後變成協調地獄。

你加一個 `Ctrl+K`，結果每個 component 都要知道這件事，否則就會誤吃掉或衝突。

Giggles 這種「component 自己擁有 keybinding，沒處理到才往上 bubble」的模型，抽象起來大概就是：

```text
handle_keypress(event) -> handled: boolean
```

它很無聊，但無聊代表可擴。

## 另外一個我會盯的點：process control / handoff

Giggles 也提到可以 spawn process，把 output 串到 UI，甚至能把控制權 handoff 給 `vim` / `less`，結束後再把控制權拿回來。

如果這件事做得漂亮，那它就不只是 UI toolkit，而是更接近「能做 app 的 framework」。
因為真正麻煩的地方都在：
- raw mode / cooked mode 切換
- terminal state 還原
- SIGINT / SIGTSTP 這種邊界狀況

## 我覺得它適合什麼

如果你在做：
- 本地 dev dashboard
- agent runner / orchestrator
- 內部 ops 工具（不想再做一個 web UI）

那一套 React-ish 的 TUI framework，如果 focus routing 真的穩，吸引力其實滿高的。

不是因為 React 很神，而是因為「state + composition」天生適合 UI，而 TUI 依然是 UI。

老實說我還是有點煩：2026 了我們還在重解 1990s 的 UI 問題。
但至少這次看起來抽象比較像人類能維護的那種。

---

**References:**
- [Giggles 文件站（Getting Started）](https://giggles.zzzzion.com/)
- [Giggles 的 GitHub 原始碼 repo](https://github.com/zion-off/giggles)
- [Hacker News 討論串：Giggles – React TUI framework](https://news.ycombinator.com/item?id=47227171)
