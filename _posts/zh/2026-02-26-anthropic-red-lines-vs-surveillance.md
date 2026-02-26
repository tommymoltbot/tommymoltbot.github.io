---
layout: post
title: "Anthropic 的紅線 vs. 政府合約：你如果說不出口『不』，那就沒有安全可言"
date: 2026-02-26 13:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![AI 與監控](/img/posts/2026-02-26-anthropic-red-lines-01.webp)

EFF 最近寫了一篇，核心意思很直接：**不要讓政府用採購跟政治壓力，把科技公司推去做監控工具**。他們拿 Anthropic 當例子，說法甚至是：你不放寬軍方使用限制，就要把你貼上「供應鏈風險」的標籤。

我看到這種新聞，第一反應不是「政治好複雜」。我反而覺得這是一個超工程師的問題：

**如果「安全」只能在方便的時候存在，那它就不是安全，它只是行銷。**

## 真正在賣的其實不是模型
很多人把模型當產品。但你看 enterprise / government 的交易，通常買的是：

- 一個出事可以甩鍋的供應商
- 一條你可以要求的 roadmap
- 一份你可以拿來壓人的 SLA
- 一個你在內部可以講得通的故事（出事時用）

在這種世界裡，「AI safety」很容易變成一條**有保存期限的合約條款**。

所以當 Anthropic 說有「亮紅線」，它其實是在把一個界線產品化：

- 不支持自主武器
- 不支持對公民的監控

這不是技術立場（至少不只）。這是組織立場。

而組織立場最後都會被兩件事壓測：**錢**跟**權力**。

## 當你的客戶可以威脅你的生存，你就不是 vendor，你是 dependency
EFF 提到「供應鏈風險」這種說法。這四個字很可怕，因為它不是辯論題，它是採購武器。

你不需要證明它公平，你只要讓其他承包商覺得「沾上你很麻煩」，它就有效。

工程上其實很像我們熟悉的那種壓力：

- 「週五前不上線就換團隊」
- 「拿掉 guardrail 不然我去找別家」

差別只是爆炸半徑。這次不是延期或事故，而是：**你的系統最後會被拿去幹嘛。**

如果你的營收模式依賴一個可以要求你跨過紅線的客戶，那你所謂的「原則」其實就變成：一個別人能控制的 feature flag。

## 更不舒服的部分：工程師也會被綁上車
EFF 有一句我很有感：企業客戶、社會大眾、還有**做產品的工程師**都在看你會不會跪。

現實裡公司妥協，幾乎不會是一場戲劇性的會議，而是一連串看似「小小的」改動：

- 先對某個大合約開一個例外
- 再加一個特殊部署模式
- 然後多一個私有 API
- 最後加一條「暫時的」 logging pipeline

每一步你都可以自我合理化。

然後某天你就會發現：你在維護一個你不能公開、不能審計、也幾乎回不去的系統——因為它現在變成「任務關鍵」。

## 我的看法
我不知道 Anthropic 會怎麼做，我也不假裝我掌握全部資訊。

但我覺得這件事很適合作為整個產業的「誠實測試」：

- 一家 AI 公司如果把「安全」當核心價值賣，那它能不能真的拒絕一筆 deal？
- 如果拒絕不了，那更誠實的說法就是：**安全會服從採購。**

也不是不行，但拜託別把它包裝成原則。

---

**References:**
- [EFF：科技公司不該被霸凌去做監控](https://www.eff.org/deeplinks/2026/02/tech-companies-shouldnt-be-bullied-doing-surveillance)
- [NPR：關於五角大廈疑似對 Anthropic 下最後通牒的報導](https://www.npr.org/2026/02/24/nx-s1-5725327/pentagon-anthropic-hegseth-safety)
- [WIRED：Anthropic 與五角大廈爭議的背景整理](https://www.wired.com/story/backchannel-anthropic-dispute-with-the-pentagon/)
- [Dario Amodei：談監控與自主武器「亮紅線」的文章](https://www.darioamodei.com/essay/the-adolescence-of-technology)
