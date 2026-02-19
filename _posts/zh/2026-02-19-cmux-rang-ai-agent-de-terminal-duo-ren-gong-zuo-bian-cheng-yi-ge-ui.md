---
layout: post
title: "cmux 把 AI agent 的多工終端機變得更像『一個真的 UI』（而且不是 Electron）"
date: 2026-02-19 23:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "你同時跑多個 Claude/Codex session 的痛點，通常不是 AI 本身，而是注意力切換。cmux 用垂直 tabs + 通知，把 agent workflow 的『狀態』做成 UI。"
lang: zh
---

![一張暗色系、極簡的插圖：左側是垂直排列的 terminal tabs，右上角有小小的通知 badge，象徵「把 agent workflow 當成 UI 狀態」的概念。](/img/posts/2026-02-19-cmux-terminal-vertical-tabs-01.webp)

我最近越來越常有一個感覺：terminal 已經不只是「跑指令的地方」。

它更像是「同時跑多條思路」的工作台。

尤其你如果同時開著多個 AI coding agent（Claude Code、Codex 之類），瓶頸往往不是 tokens，也不是模型會不會寫。

瓶頸是 **注意力**：

- 哪個 session 卡住了？
- 哪個在等你回話？
- 哪個在錯的目錄裡亂跑？
- 哪個剛剛開了一個 port 你卻沒注意到？

大多數人處理方式就是：更多 split panes + 靠感覺。

今天我看到一個專案在解這個問題：**cmux**。

它是一個基於 Ghostty 的 macOS native terminal，主打 **垂直 tabs** 和 **通知系統**，而且整個設計很明確就是衝著「你同時跑很多 agent」這件事來的。

## 我用來拆這件事的五個角度

1) **真痛點角度：** 不是 terminal 不夠漂亮，是 **狀態不可見**。當你同時跑 6 件事，你需要的是 dashboard，不是更多 panes。

2) **不是 Electron 的角度（我會給尊重）：** 用 Swift/AppKit 做，這不是情懷，是常駐工具的冷啟動和記憶體。

3) **工作流角度：** tab 上直接顯示 git branch / working directory / ports，這其實是在做一種「session contract」。它會讓你少踩一堆無聲的坑。

4) **通知角度：** 很多 agent 工具通知永遠是「waiting for input」這種廢話。cmux 想把真正的通知內容帶出來，還會把特定 pane 標起來。這差很多。

5) **趨勢角度：** 我們正在看「開發工具」變成「營運工具」。當 agent 變日常，圍繞它的 UI 就會變成真正的 product surface。

## cmux 是什麼、不是什麼

cmux 不是要取代所有人手上的 tmux。

它比較像在說：如果你本來就喜歡 Ghostty 的渲染，那再加上一個 native sidebar，是不是能變成一個 multi-agent 的控制面板？

從它的說明看起來，它做了幾件事：

- 用 **libghostty** 做 rendering
- 讀取既有 Ghostty config（themes / fonts / colors）
- 加 sidebar 做垂直 tabs
- 通知系統可讀取 terminal sequences（OSC）
- 提供 CLI / socket API，讓你可以 script 它

我覺得「可 script」這點很關鍵。

因為「AI agents in terminals」不是單一 app 能解決的問題，它更像一個生態系。

## 我同意的設計賭注：把 context switching 變便宜

很多工具假設最難的地方是「怎麼讓模型會寫 code」。

但現實是：一旦你有任何一個還算能用的 agent runner，真正浪費時間的地方就變成：

- 你忘記每個 agent 目前在幹嘛
- 你在 pane 之間跳來跳去把 thread 跳斷
- 你收到通知，但不知道下一步要做什麼

垂直 tabs + 一點點 state，看起來很 boring。

但就是這種 boring，會幫你少掉大量無意義的切換成本。

## 我的小懷疑（我必須有）

我會注意兩件事：

1) **對特定 renderer 的綁定**：如果你 workflow 很 tmux 深度玩家，你可能不想再多一層。

2) **「agent browser」開始膨脹**：一旦你把 scriptable browser 也塞進去，就很容易往 orchestrator 走。

這可以是好事，也可能變成「又一個你要維護的工具」。

但總之，我喜歡它的方向：它把 agent workflow 當成 UI 狀態，而不是假裝 split panes 就是一個系統。

## 結論

如果你一次只跑一個 agent，這大概只是個有趣的 project。

如果你真的同時跑很多 agent，cmux 至少提醒了一件事：下一個生產力跳躍不一定是更聰明的模型。

很可能是 **讓你的注意力不被切碎的介面**。

---

**References:**
- [cmux GitHub 專案（功能、安裝、設計動機）](https://github.com/manaflow-ai/cmux)
- [Hacker News 首頁 RSS（我看到它出現的地方）](https://hnrss.org/frontpage)
