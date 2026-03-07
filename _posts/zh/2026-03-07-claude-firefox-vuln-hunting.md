---
layout: post
title: "Claude 找到 22 個 Firefox 漏洞：我更在意的是，為什麼這次的報告『真的能被維護者用』"
date: 2026-03-07 18:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![鎖頭主題的插圖——這故事的重點其實是「讓漏洞報告可重現」](/img/posts/claude-firefox-security.webp)

Mozilla 跟 Anthropic 這次的合作，我覺得是少數「AI 幫到開源」的案例，而且不是那種會把維護者搞死的版本。

重點摘要：Anthropic 的 Frontier Red Team 用 **Claude Opus 4.6** 去掃 Firefox，最後 Mozilla 這邊確認並發了 **22 個漏洞**（其中 **14 個高嚴重度**），修補也跟著進到 **Firefox 148**。

你如果維護過稍微有名的專案，大概第一個反射是：
「很好，接下來我會收到 10 倍的垃圾報告。」

但這次有意思的地方是：他們展示了「不垃圾」的 AI 漏洞報告長什麼樣。

## 我在意的五個角度

### 1) 亮點不是『LLM 會找洞』，是『LLM 讓可重現這件事可以被規模化』

Fuzzing 早就有了。Static analysis 也早就有了。人類研究員更不用說。

真正卡住的是：
不是你能不能弄出一個 crash。
而是你能不能把 crash 變成維護者可以 **很快驗證**、而且可以 **安全修** 的東西。

Mozilla 的文章特別提到，Anthropic 提交的報告裡有 **minimal test cases**（縮到最小的重現輸入），讓 Firefox 工程師可以很快重現並確認。

這會直接把結果分成兩種世界：
- 「AI 找到 1000 個問題」→ 你基本上會忽略
- 「AI 找到 20 個問題，而且我每個都能在幾分鐘內重現」→ 你會認真修

### 2) 這就是安全領域的 verification debt

最近大家在講一個詞：*verification debt*（驗證負債）。
大概意思是：你做出來的東西越多，但你越沒辦法證明它真的對，最後那個「不確定性成本」會累積成債。

安全其實就是 verification debt 的極端版本——因為不確定性是會被拿去打的。

Anthropic 的技術文裡提到他們用 **task verifiers**：可以給模型即時回饋的可信工具，讓模型不是在那邊猜，而是在一個很緊的回圈裡試、驗、再試。

如果你在公司裡想做「能用在 production 的 agent」，我覺得這個才是該偷的精髓。

不是「讓 agent 自己 commit」。
而是把系統變成這種節奏：

```text
verifier(vulnerability_id) -> {reproducible: bool, regression_free: bool}
```

- 找到 bug
- 產出最小重現
- 提出 patch
- 證明 patch 真的把 bug 殺掉
- 再跑測試避免修了 A 壞了 B

這樣你才有機會把「AI 的直覺輸出」變成「可以進 security review 的工程產物」。

### 3) 成本不對稱很明顯：找洞便宜，寫 exploit（目前）還是貴

Anthropic 提到一個數字我覺得很關鍵：他們花了大概 **$4,000 的 API credits** 去試著把漏洞變成 proof-of-concept exploit，但只成功 **兩次**。

也就是說，至少在現在這個時間點，Claude 更擅長的是：
- 找出可疑的行為、crasher、邊界條件
而不是：
- 把它變成可靠的端到端 exploit

對防守方來說算是偏好消息。

但同時也是提醒：你不能指望 exploit 一直都難。
如果「找洞」變快了 10 倍，防守方也得讓「分流、修補、出版本」快 10 倍，不然最後還是會輸。

### 4) 維護者不缺報告，他們缺的是『形狀正確』的報告

開源維護者真的很忙。
最糟糕的報告長這樣：
- 描述很模糊
- 沒有步驟
- 沒有 reduced testcase
- 沒有版本資訊
- 「好像能 exploit，但我也不確定」

Mozilla 的態度其實很務實：AI 報告常常很吵，所以他們本來就懷疑；但這次不同，因為報告是 **可重現、可驗證、可修補** 的。

所以如果你用 LLM 做 security 或 QA：
把「minimal repro」當成一級公民。

你不能在乾淨 VM 裡用 deterministic script 重現的東西，它不是 report，它只是想法。

### 5) 不舒服但現實：防守方最後也會被迫用 AI

我完全理解工程師圈對 AI 的反感。
太多「看起來很像、實際上浪費時間」的輸出，真的會把人磨到不想碰。

但 Firefox 這個案例比較像我願意接受的版本：
- 模型沒有取代工程師
- 它把搜尋範圍在巨大 codebase 裡放大
- 然後人類負責驗證、修補、負責任地出版本

我現在比較在意的是基準線會被拉到哪裡：

如果 frontier model 可以掃上千個 C++ 檔案、快速產出一堆能重現的 crasher，那「靠看不到就安全」這種幻想會死得更徹底。
最低標準會變成：
- 持續 hardening
- 更快的 patch pipeline
- 更扎實的 sandbox / defense-in-depth
- 還有把 verification 當成產品能力的一種文化

不炫炮，但很可能就是接下來的日常。

---

**References:**
- [Mozilla：與 Anthropic Red Team 合作，強化 Firefox 的安全性](https://blog.mozilla.org/en/firefox/hardening-firefox-anthropic-red-team/)
- [Anthropic：與 Mozilla 合作改善 Firefox 安全（技術細節）](https://www.anthropic.com/news/mozilla-firefox-security)
- [Firefox 148 版本更新說明（修補在這版出貨）](https://www.firefox.com/en-US/firefox/148.0/releasenotes/)
