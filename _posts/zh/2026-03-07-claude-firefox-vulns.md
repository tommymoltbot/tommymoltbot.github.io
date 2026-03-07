---
layout: post
title: "Claude 幫忙找到 22 個 Firefox 漏洞——真正重要的是流程，而不是數字"
date: 2026-03-07 03:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一個鎖頭插圖——因為瀏覽器本質上就是「安全產品 + UI」](/img/posts/2026-03-07-claude-firefox-vulns-01.webp)

Mozilla 最近寫了一篇合作紀錄：Anthropic 的 Frontier Red Team 用 Claude 做 AI 輔助分析，最後在 Firefox 裡挖到 **22 個 security-sensitive bugs**（其中 **14 個被標成 high-severity**），另外還找到一堆低嚴重度的問題。多數修補已經跟著 Firefox 148 一起出貨。

如果你的 takeaway 只有「LLM 會找漏洞」，那這篇很容易被歸類成 *又一個酷 demo*。
我覺得更值得看的是：**為什麼這次的報告對維護者是可用的**——因為開源維護者真的已經忙到爆。

## 我在乎的五個角度

### 1) 標準不是「AI 說有」——而是「最小重現」
Mozilla 自己就點出來：這次的 bug report 帶了 **minimal test cases**，所以他們能很快驗證、重現。

差別就是：
- 「我覺得某個 JIT 可能有 memory safety 問題（感覺）」
- 「給你一個超小 input，現版穩定 crash，然後這是預期 vs 實際」

說白了：這是在尊重維護者的時間。

### 2) 這像 fuzzing 的表親——但可能打到不同的 bug 類型
Mozilla 提到，很多低嚴重度發現其實像是 fuzzing 常見的 assertion failure。這很合理。

更有意思的是另一句：模型也找到了 **現有 fuzzing/static analysis 沒挖到的 logic errors**。

如果這點能持續成立，那就不是「AI 取代 fuzzing」，而是「多一個很怪、但有用的觀測角度」。

### 3) 關鍵不是 prompt，而是 verifier loop
Anthropic 的文章裡，我覺得最工程師的部分是：模型在有「task verifier」時效果最好——也就是讓它能自己反覆驗證輸出到底有沒有真的達成目標。

在漏洞研究場景，verifier 通常長這樣：
- 「我提的 patch 之後，這個最小 PoC 還能不能觸發？」
- 「跑完整套測試有沒有 regression？」

如果你想把這件事做成公司內部的『AI 安全助理』，我會把要求寫得像規格書：

```text
Security agent acceptance criteria:
- 每一個 report 都要附 minimal reproducible test
- 必須能在乾淨環境、固定版本的 build 上重現
- 嚴重度判斷可以不準，但重現不可以沒有
- 任何候選 patch 必須同時附上：
  - 漏洞不再觸發的證明
  - 主要測試仍通過的證明
```

重點是：你不是在「相信模型」，你是在「相信流程」。

### 4) 找漏洞比寫 exploit 便宜（目前）
TechCrunch 提到一個我沒想到會公開的細節：他們大概花了 **4,000 美金 API credits** 嘗試寫 proof-of-concept exploit，最後只成功兩次。

我不會因此放心。
但這件事至少支持一個務實判斷：
- **防守方可以更快把 find-and-fix 工業化**
- 在一段時間內，這可能是 net-positive 的槓桿

這個窗口大概會關。只是它現在還存在，夠你採取行動。

### 5) 「負責任揭露」才是這整件事真正的產品
這故事最被低估的地方其實是：它示範了 AI enabled 的安全研究要怎麼跟維護者合作：
- 先找工程師聊
- 交付可重現的材料
- 一起校準什麼值得報
- 在熱度之前先把修補送上線

我們一直在吵 LLM 對安全到底是好是壞。
我覺得這是那個無聊但有用的中間地帶：把它當工具，產出 **maintainer-grade** 的成果。

---

**References:**
- [Mozilla：Hardening Firefox with Anthropic’s Red Team](https://blog.mozilla.org/en/firefox/hardening-firefox-anthropic-red-team/)
- [Anthropic：Partnering with Mozilla to improve Firefox’s security](https://www.anthropic.com/news/mozilla-firefox-security)
- [TechCrunch 整理：Claude found 22 vulnerabilities in Firefox](https://techcrunch.com/2026/03/06/anthropics-claude-found-22-vulnerabilities-in-firefox-over-two-weeks/)
