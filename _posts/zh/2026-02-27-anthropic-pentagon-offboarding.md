---
layout: post
title: "Anthropic 跟『任何合法用途』翻臉：一條採購條款，怎麼把 AI 安全變成供應鏈角力"
date: 2026-02-27 22:10:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![五角大廈：任務關鍵採購的象徵](/img/posts/2026-02-27-anthropic-pentagon-offboarding-01.webp)

這件事很多人都在吵「誰對誰錯」，但我覺得真正值得看的點其實很工程：**一條合約/採購用語**。

TechCrunch 的報導是：特朗普要求聯邦機構停止使用 Anthropic 產品（給六個月緩衝期），起因是跟五角大廈的爭議。

如果把政治語氣先放一邊，核心機制是：五角大廈要的是 **any lawful use（任何合法用途）**。

翻成工程語言就是：**把產品邊界撤掉。**

## 1) 「任何合法用途」聽起來合理，但軟體本來就靠邊界活著
正常軟體不會賣「任何合法用途」。我們賣的是：
- 有支援的介面
- 有寫清楚的限制
- 威脅模型（至少心裡要有）
- 有些場合會有 SLA

因為一旦你把邊界拿掉，你不是變彈性，你是在做一件事：**把風險往外丟**。

所以當買方說「不要預先限制我們怎麼用」，其實等於是在要求：
- 更大的爆炸半徑
- 更大的責任面
- 出事時更模糊、更好互相甩鍋

## 2) 我比較相信 Anthropic 的不是道德，而是「今天的模型真的還不夠可靠」
Anthropic 的聲明畫了兩條線：不做「大規模國內監控」，不做「完全自主武器」。

先不談價值觀，純工程角度也一樣：這是可靠度問題。
- 模型會 hallucinate
- 模型很容易被 prompt 牽著走
- 很難給出你能在法庭或審計上站得住腳的保證

如果你把它接在「錯了會死人」或「錯了會把人抓走」的系統上，那門檻不是「大概準」。
門檻是「在 worst-case 假設下也能 defend」。

老實說，現在大多數 agent demo 都還差很遠。

## 3) 一旦進入採購語言，安全會變成談判籌碼
當這件事變成合約拉扯，安全以外的槓桿就會全部上桌：
- 下架/換供應商
- 供應鏈風險標籤
- 法規/行政壓力

我對這段比較不舒服：不是安全不重要，而是 **當安全被表達成合約文字，它就會變得可議價**。

因為合約不是在追求真理，它是在定義權力。

## 4) 真正的問題：通用模型的邊界，到底誰說了算？
如果你把通用模型賣給政府，穩定的結局大概只剩幾種：

- **供應商定義邊界**（Anthropic 這派）：你拿到能力，但在 guardrails 裡。
- **買方定義邊界**（any lawful use）：你拿到最大自由，但也拿到最大 failure mode。
- **監管定義邊界**（慢、政治化、但一致）：你最後會得到一個比較可預期的框架。

現在我們看到的是：邊界正在公共場合被談判。
這其實很不像工程——但 AI 變基礎設施之後，大概就會這樣。

## 5) 我賭這會在每個「任務關鍵 AI」買方身上重播
這不會只是一個五角大廈 vs Anthropic 的故事。

當 AI 從 pilot 變成 infrastructure，採購會變成產品的一部分。
問題會變成：**你買的是工具，還是你買的是供應商的判斷？**

而 any lawful use 基本上是在說：*我們不要你的判斷。*

這個偏好可以理解。
但那你也不能對供應商說「那你簽啊」；因為對方的答案也很合理：*那我不簽。*

---

**References:**
- [TechCrunch 對聯邦機構停止使用 Anthropic 產品的報導](https://techcrunch.com/2026/02/27/president-trump-orders-federal-agencies-to-stop-using-anthropic-after-pentagon-dispute/)
- [Dario Amodei 的聲明：描述要求的 safeguards 與拒絕原因](https://www.anthropic.com/news/statement-department-of-war)
- [Wikimedia Commons 的 Pentagon 圖片（本文首圖來源）](https://commons.wikimedia.org/wiki/File:Pentagon.jpg)
