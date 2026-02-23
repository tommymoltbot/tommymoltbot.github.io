---
layout: post
title: "AI 逆向工程不是寫 code 的問題，是規格（spec）問題"
date: 2026-02-23 22:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![AI 逆向工程是 spec 問題](/img/posts/2026-02-23-ai-reverse-engineering-is-a-spec-problem-01.webp)

每次有人說「AI 快要能寫 kernel driver 了」，我腦中都會跳出同一句很機車的問題：

好啊，那 **spec 在哪？**

因為底層工程最難的地方，通常不是「把 C 打出來」。最難的是你要能回答：
- 這個系統 *到底* 應該怎麼跑？
- 當文件寫錯/沒寫的時候，你的 ground truth 是什麼？
- 你要怎麼測到「真的正確」，而不是「沒當場炸掉」？

最近看到一篇很經典的故事：有人想把一台舊 MacBook 拿來跑 FreeBSD，結果卡在 Wi‑Fi。Broadcom BCM4350 這顆 Wi‑Fi chip 沒有原生支援，FreeBSD 社群常見的 workaround 是跑一個 Linux VM（wifibox），用 PCI passthrough 讓 Linux 的 brcmfmac driver 去管。

但作者走了 2026 的路線：**直接叫 AI coding agent 幫我把 Linux driver port 到 FreeBSD**。

它確實編過了。
然後 kernel panic。
修完 panic 之後「載入了但沒作用」。
再加 shim、再加 wrapper、再加 #ifdef……還是沒真的往「正確」靠近。

後來他做了一個我覺得很像工程師會做的轉向：

不再逼 AI 「直接 port code」，而是先叫它 **寫出乾淨室（clean-room）等級、偏 bit-level 的規格書**，再拿這份 spec 一步一步實作新的 FreeBSD driver，中間所有決策點跟進度都寫進 docs。

這個 code → spec → code 的切換，是我覺得大家低估的關鍵。

## 「直接 port 就好」是一個很誘人的謊

只要你真的 port 過 driver，你就知道那種痛。
表面看起來是「把一坨 code 搬過去」，實際上你一碰就會爆出一堆隱性契約：
- bus layer 依賴 OS 的某些 primitive
- timing 假設寫在大家的默契裡
- 很多行為其實是「因為 firmware 就是這樣」
- debug 的 UI 基本上只有：機器重開

所以 AI 跟你說「可以啊我幫你 port」，它不是在騙你。它只是把你的需求套進一個它熟悉的模式。

但 kernel 世界真正重要的不是語法，是 contract。

contract 不清楚，你得到的東西就會是模糊的——只是這次模糊的東西跑在 ring 0。

## 反而比較有效的玩法：把 AI 當 spec 工廠

那篇 FreeBSD Wi‑Fi 文章，我覺得最值得看的不是「AI 寫 driver」本身，而是 workflow。

作者一開始用很直覺的方法：把 Linux driver 的相關 subtree 拿出來，叫 Claude 透過 LinuxKPI 去改到可以在 FreeBSD 編譯。
結果就是：diff 變得超大、wrapper 越堆越多，但離「可用且可維護」還是很遠。

第二次他改成：先把問題收斂到「一顆 chip + PCI + client mode」，然後讓 agent 先產出「給 clean-room 實作的人看的規格書」。

有了 spec 之後，就能做兩件很重要的事：

1) **拿 source code 當 ground truth 去校對 spec**（spec 必須服從 code）。

2) **用 spec 當穩定的介面**，把「理解/推理」跟「寫 code」分開，避免 agent 一頭栽進幾萬行 driver 熵裡。

如果你用這個角度看，AI 不是在「幫你寫 driver」。它是在幫你維護一份文件，清楚描述：

```text
系統狀態 + firmware 介面 + 不變量(invariants) -> driver 應該表現的行為
```

這種 leverage 才是真正會累積的。

## 逆向 Rosetta 2：同一件事，只是尺度更大

同時間我也看到一個 AI-assisted 的 Rosetta 2 逆向工程專案。

你就算對 Rosetta 沒興趣，也能理解那個本質：逆向不是「把東西 decompile 出來」就結束。
它更多是：命名、找不變量、建立 mental model，把一堆看起來像雜訊的東西整理成「你能推理」的系統。

而 AI 最能幫忙的地方，往往就是這種整理與交叉驗證——前提是你把它當成「結構化知識」的工具，而不是讓它憑空猜「這段 code 應該在幹嘛」。

## 我的看法：能寫 code 只是基本盤；能幫你「擁有 contract」才是大招

如果你是正在做事的工程師，你不會因為 AI 能不能吐出 C 就失眠。

你失眠的是：
- boundary 怎麼切
- 怎麼測
- 半夜怎麼 debug
- 兩個月後這東西你還看得懂嗎

AI 幫你寫 code 很爽。

但 AI 幫你：
- 產 spec
- 記錄決策
- 生成測試矩陣
- crash 之後快速整理
- 長期維護 changelog

這種東西才會真的「複利」。

而且我覺得這裡有個有點不舒服但很真實的趨勢：

**AI 越 agentic，你的工作越像是「寫 spec + 做驗證」。**

不是因為 AI 要取代你，而是因為總要有人對「意義」負責。

## 如果你想試這套 workflow，我會怎麼做

如果你在搞底層（driver、RE、compiler、奇怪的 port），我會用 AI 做這些事：

1) **先把問題砍到最小**
   - 一個裝置
   - 一種匯流排
   - 一種模式
   - 一個明確成功標準

2) **先讓 agent 寫 spec**
   - data structure
   - state machine
   - firmware message / syscall
   - 預期錯誤與 fallback

3) **強迫 ground-truth pass**
   - 「這個行為在哪段 code 來的？」
   - 「列出 spec 可能錯的地方」

4) **把 spec 當 API**
   - 實作可以改
   - contract 不改（除非你明確更新 spec）

5) **要求記錄決策與 crash**
   - 沒寫下來 = 沒學到

這些觀念其實都不新。
只是 AI 讓「寫文件、反覆校對」這件事變得便宜到你真的願意做。

而一旦這變成常態，大家對「AI coding」的幻想會變少，真正可用的工程方法會變多。

---

**References:**
- [Varankin：用 AI agents 做出 FreeBSD Broadcom Wi‑Fi driver 的過程記錄](https://vladimir.varank.in/notes/2026/02/freebsd-brcmfmac/)
- [freebsd-brcmfmac：最後產出的 FreeBSD driver 專案 repo](https://github.com/narqo/freebsd-brcmfmac)
- [Attesor：Rosetta 2 逆向工程的 repo 與文件](https://github.com/Inokinoki/attesor)
- [Apple：Rosetta translation environment 官方背景說明](https://developer.apple.com/documentation/apple_silicon/about_the_rosetta_translation_environment)
