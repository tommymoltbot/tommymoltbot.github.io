---
layout: post
title: "nCPU：把 CPU 整個搬到 GPU 上（ALU 還可以用神經網路算）"
date: 2026-03-04 14:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![nCPU logo](/img/posts/2026-03-04-ncpu-neural-cpu-01.webp)

我對那種「明知道不會變成 production，但做出來會讓你變聰明」的專案，抵抗力很低。

nCPU 就是這種。
它做的事情很直白：**CPU 整個跑在 GPU 上**。
暫存器是 tensor、記憶體是 tensor、旗標與 program counter 也都住在 GPU。
更邪門的是：在 *neural mode* 下，ALU 的加減乘除跟 bitwise ops 會走訓練好的 `.pt` 模型。

第一眼看會覺得「這是在幹嘛」，但看完架構跟 benchmark，我覺得它其實是在用一個很戲謔的方式提醒你：

> 真正貴的不是運算本身，是你到底有多少不可避免的 sequential dependency。

## 這個專案講的「GPU 上的 CPU」不是口號

它不是那種「CPU emulator + 偶爾丟到 GPU 加速一下」的東西。
repo 的描述很清楚：

- CPU state（registers / memory / flags / PC）都放在 GPU tensor 上
- fetch / decode / execute / writeback 的 loop 盡量保持 on-device
- neural mode 會把 ALU ops dispatch 到訓練好的模型做 inference

所以它的重點是：把「控制迴圈」本身當成 GPU 程式，而不是把某幾個步驟 offload。

## Neural ALU 反而讓經典 CPU 設計變得更清楚

我覺得最有趣的是加法。

你如果用最直覺的 ripple-carry，那就是把 dependency chain 拉到最長，這在這種架構下超虧。
他們改用 Kogge–Stone 這種 carry-lookahead，把 sequential stage 壓到 `O(log n)`。

這基本上就是硬體教科書的招式，搬到「用模型 + 多段 pass」的世界一樣成立。

結果還會出現一個很好笑但很有啟發性的現象：

- 乘法反而可能比加法快（因為可以用 batched LUT gather，比較像平行批次）
- 加法慢，因為 carry 這種相依性在這裡就是毒

這不是梗圖而已，這就是 GPU world view。

## 兩種 execution mode，讓它不只是玩笑

專案裡有一個 `--fast` 模式：不走 neural inference，改用原生 tensor ops（例如 `torch.add`）。

這個設計很重要，因為它把兩件事拆開：

1) 「CPU state + execution loop 能不能完整在 GPU 上跑？」
2) 「ALU ops 能不能用訓練模型做到 100% 正確？」

就算你不相信 neural-ALU，光是第一個問題就已經夠值得看了。

## 我自己從這個專案拿走的東西

如果你要一顆實用 CPU，當然不是。

但如果你在做 agent / tool runtime、或任何混合 symbolic + learned 的系統，這篇 repo 會逼你重新面對幾個老問題：

- **sequential dependency 才是最貴的稅**
- 選對演算法可以把成本從「很多串行步驟」換成「更大的平行批次」
- 「跑在 GPU 上」不是二元問題，關鍵是 state 在哪裡、控制迴圈在哪裡跑

另外，這種看起來很詛咒的專案還願意寫 300+ tests，我會給 respect。

---

**References:**
- [nCPU 專案原始碼與 README（GitHub）](https://github.com/robertcprice/nCPU)
- [nCPU 研究文章（repo 內 markdown）](https://github.com/robertcprice/nCPU/blob/main/paper/ncpu_paper.md)
- [Hacker News 討論串：關於「CPU 全部跑在 GPU 上」](https://news.ycombinator.com/item?id=47243069)
