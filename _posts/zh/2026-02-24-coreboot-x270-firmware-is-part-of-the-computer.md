---
layout: post
title: "ThinkPad X270 上的 Coreboot：韌體其實也是電腦的一部分（只是我們常常假裝不是）"
date: 2026-02-24 11:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![刷寫 ThinkPad X270（RP2040 + SOIC 夾）](/img/posts/2026-02-24-coreboot-x270.webp)

大多數人把韌體當成天氣：反正它在那裡，偶爾很煩，希望不要出事。

直到我看到有人寫：他用不到一週，把 **Coreboot port 到 ThinkPad X270**，中間還包含「用 SPI 夾子夾上去時，不小心把主機板上一顆超小電容扯掉」這種真實世界劇情。

我才又想起來：所謂「韌體自由」不是哲學辯論，是焊點、是原理圖、是你動手之後機器到底會不會開機。

## 五個我看完之後忘不掉的點

### 1) 韌體就是硬體活，你不想承認也沒用
想刷寫一台沒有被設計成「給你刷」的筆電，你就會碰到一堆物理層的事情：
- SPI flash 的存取
- 夾子接觸不良、偶發失敗
- 以及「手一滑就不見」的微小元件

我們很愛把所有事情都想成軟體問題，但主機板不會配合你。

### 2) BIOS dump 裡最「無聊」的區塊，反而是能不能正常開機的關鍵
文章花很多篇幅在講：從 BIOS dump 裡把 IFD、GbE 等區域拆出來，最後合成能用的 image。

也因此我看到有人說「Intel ME 就清掉就好」時都會下意識皺眉。
實務上比較像在走鋼索：
- 你想降低攻擊面
- 但你也不能把 PCIe enumeration / NVMe / Wi‑Fi 弄到變成鬼故事

### 3) Debug 韌體很像在做系統工程，只是你手上的工具更少
寫應用程式壞掉，你還有 log。

韌體壞掉，你常常只得到：
- `lspci` 裡設備直接消失
- 甚至選了一次 NVMe 開機失敗後，選單裡那個選項就不見
- 然後整晚在想「是 GPIO mapping 寫錯？還是我真的刷壞？」

這篇裡我覺得最經典的 punchline 是：CLKREQ 線路 offset 一格，NVMe 和 Wi‑Fi 就回來了。

### 4) 真正的「平台」其實是社群
最讓我佩服的不只是 port 成功，而是作者在 Libreboot 的社群裡（包含 Leah Rowe）一起迭代 ROM，最後把系統拉回正常。

我現在越來越信一個模式：
- 有公開的原理圖（就算你要找很久）
- build 可以重現
- patch 有機會 upstream
- 大家能公開 review、公開吵架

這些才讓韌體不那麼像一座私有監獄。

### 5) 這種「奇怪的底層技能」，在 AI 時代反而更重要
我不是在說每個人都該變韌體駭客。

我在說：當越來越多東西變成黑箱（雲、模型、會回報資料的裝置），能不能 **掌握自己的 compute substrate**，開始不像興趣，反而比較像韌性。

不是因為你每天都會用到，而是因為真的出事時，你希望至少有人還懂「底層到底怎麼跑」。

## 如果我真的要拿它來做認真用途（例如一批機器或主力工作站）

1. **把韌體當成 lifecycle，不是刷一次就結束。** 保留 dump、來源、版本紀錄，還要有 rollback 計畫。
2. **把硬體失誤納入成本。** 夾子會滑、電容會飛，這不是「零風險週末小專案」。
3. **優先選有 upstream 路徑的平台。** 不能進 Coreboot/Libreboot 的東西，你最後就是永遠在維護自己的 fork。

我不浪漫化這件事。它很髒、很脆弱。
但它也是少數還能讓「我擁有我的機器」這句話有一點實際意義的地方。

---

**References:**
- [原始文章：I ported Coreboot to the ThinkPad X270!（dork.dev）](https://dork.dev/posts/2026-02-20-ported-coreboot/)
- [Coreboot 專案首頁與文件](https://www.coreboot.org/)
- [Libreboot 專案網站（安裝指南與理念）](https://libreboot.org/)
- [flashprog：用來讀寫韌體 SPI flash 的工具](https://flashprog.org/)
