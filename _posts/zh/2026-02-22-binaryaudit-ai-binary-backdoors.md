---
layout: post
title: "BinaryAudit：AI 真的能從二進位抓出後門嗎？可以，但最痛的是誤報"
date: 2026-02-22 18:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![BinaryAudit benchmark overview](/img/posts/binaryaudit.webp)

你如果做過一次「拿到一顆 vendor binary、沒有 source、還要你判斷它乾不乾淨」的 IR，你就懂那種感覺：你突然被迫變成 reverse engineer，但你今天原本不是要幹這個。

所以我看到 **BinaryAudit** 這種 benchmark（他們把後門真的塞進 *~40MB* 的可執行檔，再叫 AI agent 用 Ghidra + binutils 去抓）我其實是有點興奮的。

因為這不是「幫我寫個 todo app」這種玩具題，而是「請你告訴我這顆 binary 有沒有在騙我」——這才是 production 世界會遇到的問題。

結論很現實也很有意思：**AI 有時候真的抓得到後門，但命中率還不夠穩；更麻煩的是誤報（false positives）會把你整個流程拖垮**。

## 我讀完腦中冒出的五個想法

### 1) 命中率不是唯一 KPI；誤報高就直接沒人敢用
在 benchmark 裡，false positive 只是扣分。

在真實世界，false positive 是：
- 一個工程師半天沒了
- 一個客戶升級成 escalation
- 有時候還會搞到 release 被卡住

所以「它會亂報」不只是缺陷，它會直接摧毀信任。

### 2) 工具鏈跟模型一樣重要
我喜歡他們沒假裝模型是魔法。

他們讓 agent 用的就是 reverse engineering 常見工具：

```text
objdump
nm
strings
Ghidra
Radare2
```

這才像真的：你不是在『理解』 binary，你是在『做分層式的排查』。

### 3) 這種工作非常吃「先想再做」（planning vs execution）
Binary analysis 本質是搜尋問題：
- 先用便宜訊號（strings、imports、可疑 syscall）粗篩
- 再逐步付出更貴的代價（decompile、追 call chain、交叉引用）

agent 如果一開始就走歪路、把 budget 燒光，最後通常不是「失敗」，而是回你一堆 vibes。

### 4) 「49%」這個數字很大聲
文章提到：就算是他們最強的模型，在一些相對明顯、binary 規模小到中等的情境，也大概只有一半左右能抓到。

這不是在酸模型。

這是在提醒所有賣「AI malware detection」的人：別把它講成插上去就能自動守住供應鏈。

要能上 production，你得：
- 把它當成 suggestion engine
- 或者跟強 heuristics + 人工 review 結合

### 5) 供應鏈（supply chain）才是這整件事的核心價值
很多事件根本不是「你的 repo 被駭」。而是：
- dependency
- installer
- firmware
- 或你根本沒 build 過的 binary

這類 benchmark 把討論拉回一個比較誠實的問題：

```text
我們有沒有一個可規模化的方法，預設就不信任 binaries？
```

現在答案還是「大部分時候沒有」。但至少我們開始有量化指標，而不是只在社群上吵。

## 如果要我今天就用，我會怎麼用
如果你逼我今天就把這種 agent 放進流程，我只敢用在：

- **Triage**：幫我找出「最怪的函式」以及它為什麼怪
- **Diffing**：兩個 vendor build 做比較，標出可疑差異
- **Lead generation**：給我 5 個最值得查的點，我自己驗

但不會用在：『它說乾淨，所以就乾淨、直接出貨』。

那個落差，就是 demo 跟 production 的差。

---

**References:**
- [BinaryAudit：benchmark 與結果介紹文章](https://quesma.com/blog/introducing-binaryaudit/)
- [BinaryAudit 成績與排行榜頁面](https://quesma.com/benchmarks/binaryaudit/)
- [BinaryAudit 開源任務與方法論（GitHub repo）](https://github.com/quesmaOrg/BinaryAudit)
