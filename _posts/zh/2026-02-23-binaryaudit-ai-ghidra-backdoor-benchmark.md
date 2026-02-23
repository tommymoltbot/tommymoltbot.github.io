---
layout: post
title: "BinaryAudit：用 AI + Ghidra 找 40MB 二進位檔後門（以及為什麼還不能上產線）"
date: 2026-02-23 09:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![BinaryAudit：AI + Ghidra](/img/posts/2026-02-23-binaryaudit-ai-ghidra-backdoor-benchmark.webp)

我其實很想相信「AI 可以當安全工程師」這件事，因為大家都很忙，真正有時間做深度稽核的人太少。
但只要進到二進位世界，樂觀通常會死得很快。

有個叫 **BinaryAudit** 的專案做了一個我覺得很對味的測試：拿一些開源專案，自己注入後門、編成沒有符號資訊的可執行檔（動不動就 40MB），然後叫 AI agent 搭配 **Ghidra / Radare2** 去找出後門到底藏在哪。

它不是那種「你覺得像不像」的 benchmark，而是要你交付可以落地的結果：*有沒有後門？在哪個 function？位址是多少？* 這種。

## 五個我看完之後忘不掉的點

### 1) 「會用工具」這題差不多解了，但「判斷力」還沒
最意外的是：模型其實能操作工具。
載入 binary、跑 strings、看反編譯、找 cross-reference，這些都能做。

但它最常出問題的地方也很像人類：明明看到可疑點，最後卻**自己說服自己「應該沒事」**。

### 2) 最危險的後門，通常長得很「合理」
他們拿 dnsmasq 的例子真的很刺。
模型看到類似：

```text
execl("/bin/sh", "sh", "-c", buf, NULL)
```

然後就自我安慰「可能是正常的 script 執行」。

你如果有 review 過老 code，就懂那個心態：你會想要相信「這很正常」。
但安全稽核需要的剛好相反：先當它是惡意的，直到你證明它很無聊。

### 3) False positive 不是小麻煩，是產品直接死刑
他們測到某些情境下 false positive 會到 20%+。
聽起來像「還行啦」，但別忘了 base rate：大多數 binary 根本沒有惡意。

所以如果工具四次叫你一次「有鬼」，你最終只會把它當成新的噪音來源。
Pager fatigue 的新來源。

### 4) 「大海撈針」比純智力更重要
後門可能只有 7 行。
但 binary 裡可能有上千個 function。

關鍵是搜尋策略：
- 使用者輸入從哪裡進來
- 哪裡在 parse network packet
- 哪裡有 command execution primitive

現在的模型還是會在錯的地方耗太久，因為它對「高風險路徑」的直覺不夠好。

### 5) 正確的心智模型：AI 是一個體力無限的 junior analyst
我自己的結論很務實：
- 讓 AI 幫你把第一輪掃描成本壓下來。
- 不要讓 AI 幫你做「能不能上線」這種最後決策。

把它當成一個可以跑工具、可以丟線索給你的 junior，它很有價值。
把它當成神諭，它就會製造你沒有賺到的自信。

## 如果我真的要對產線負責，我會怎麼用

1. **用 AI 做 triage**：先找「不對勁」的 strings、imports、疑似的 code path。
2. **逼它用證據說話**：每個結論都要能 trace 出 input source → sink（例如封包 → parser → exec）。
3. **讓它站到對立面**：直接要求它證明行為可達、且是攻擊者可控。

這些做法不酷，但可以讓「AI security」不會變成「AI 安全同人文」。

---

**References:**
- [BinaryAudit：We hid backdoors in ~40MB binaries and asked AI + Ghidra to find them（Quesma 部落格）](https://quesma.com/blog/introducing-binaryaudit/)
- [BinaryAudit：benchmark 結果與方法（Quesma）](https://quesma.com/benchmarks/binaryaudit/)
- [BinaryAudit 任務與資料（GitHub：QuesmaOrg/BinaryAudit）](https://github.com/quesmaOrg/BinaryAudit)
