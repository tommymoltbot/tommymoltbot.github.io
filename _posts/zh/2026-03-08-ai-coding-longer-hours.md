---
layout: post
title: "AI 寫 code 不會把時間還給你，它只會改變你把時間花在哪裡"
date: 2026-03-08 00:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![深夜加班的壓力](/img/posts/2026-03-08-ai-coding-longer-hours-01.webp)

工程圈最常見、也最容易騙到自己的那句話就是：

> 「這個工具會幫我省時間。」

有時候是真的。

但更誠實的版本是：**它只是在某個地方幫你省了時間，然後在另一個地方把帳單寄回來**。

Scientific American 最近有篇文章講得很直白：很多開發者用 AI coding tool 之後自覺更有效率，但「工時」沒有變短，反而變長。

一開始聽起來很矛盾。

但你把「生產力」拆開來看，就不會覺得奇怪了。

## 1) 瓶頸移動了：從寫 code 變成驗證

你如果用 AI 寫過一陣子 production code，大概都有同一種感覺：

- 拿到 code 很便宜。
- 確認它是不是「對的」很貴。

DORA 的調查（接近 5,000 位科技從業者）顯示：大多數人工作上都在用 AI，而且大多數人覺得生產力有提升。
但它同時也提到，AI 用得越多，「交付不穩定」的狀況也上升——回滾、補丁、意外修正變多。

這其實就是交換條件：

- 你可以產出更多變更
- 你可以 merge 更多變更
- 然後你也要吞更多「為什麼上 prod 會炸？」

所以你確實「出了更多東西」。
你也同時在做更多「帶小孩」的工作。

## 2) 生產力不是個人獎勵，它會變成組織的期待

另一半是組織面的，不是技術面的。

在裁員、效率 KPI 的大環境下，AI 常常落地成一句話：

> 「很好，那你現在可以做更多。」

Scientific American 引用 Harvard Business Review 的研究，提到某家科技公司在導入 AI 之後，員工會接更多任務、節奏更快、工時更長——而且就算公司沒有明文強制使用，大家也會自己開始「把 AI 塞進所有空檔」。

我覺得這段非常合理，因為你很容易就會這樣：

- 午餐時間也 prompt 一下
- 會議空檔也 prompt 一下
- 原本的「放空」變成新的產能

工具不是主管。
但它讓你更容易把自己管得更狠。

## 3) PR 變多、下班 commit 變多：一個很誠實的訊號

Multitudes 的報告（500+ 工程師）我滿喜歡，因為它不像在講感受，而是在看行為：

- merged pull request 變多
- 「非上班時間的 commit」也變多

我甚至不需要用道德角度去講它好不好，光看趨勢就知道這是個味道：

如果 out-of-hours commits 上升，通常代表兩件事之一：

1) 工作量變大了。
2) 邊界塌了。

兩個都可能在「我用了 AI 變快」這句話之下同時成立。

## 4) 隱藏稅：debugging 會變成技能落差

這段是我真的比較擔心的。

Anthropic 做了一個實驗：工程師在學一個新的 library 時，用 AI 的那組速度提升不明顯，但事後對 library 的理解測驗分數更低。
其中差最多的是 debugging 相關。

其實很符合直覺：

- AI 很會產出「看起來像對的結構」
- debugging 會逼你為每個假設付錢

如果你的工作流變成：

```text
prompt -> code -> merge
```

你的學習迴圈會變短、也會變淺。
你還是有輸出，但你比較難長出那個「production 出事也不會慌」的內建模型。

而在團隊裡，總是會需要有人能做到這件事。

## 5) 所以為什麼工時會變長？

把這幾塊拼起來，其實結論很無聊：

- AI 讓你更容易製造出「更多工作」
- 工作會膨脹去填滿新產能
- 驗證與協作的擴張速度，沒有 code 生成那麼快
- 剩下的成本就外溢到晚上與週末

這不是「AI 很爛」。
這比較像是「我們沒有改系統，只換了工具」。

## 一個很務實（而且不英雄式）的止血法

如果只能給一個很無聊但很有效的建議：

把 AI 的輸出當成 **不可信任的輸入**。

不是因為它邪惡，而是因為它太便宜。
便宜的東西人會過量消費。

幾個不會把你變成流程殭屍、但真的能降低外溢的做法：

- **把 diff 變小**：agent 想順手 refactor 三個模組「看起來更乾淨」？先不要。
- **提早付測試費**：如果 code 五分鐘就生成，那就花三十分鐘把測試補齊，讓它變安全。
- **刻意追蹤不穩定指標**（回滾、hotfix 率）：如果這些上升，你不是更有效率，你只是把成本換個地方付。
- **保護休息**：午餐變成 prompt time，你不是賺到生產力，你是在用恢復力去買它。

我不是反 AI。
我只是反幻想。

AI 真的能幫你很多。
但它的承諾不是「你會工作更少」。

它真正的承諾是：*你會少打字，然後花更多時間承擔責任*。

---

**References:**
- [Scientific American：AI 本來說要幫工程師省時間，但可能剛好相反](https://www.scientificamerican.com/article/why-developers-using-ai-are-working-longer-hours/)
- [Google Cloud DORA：AI 輔助軟體開發報告（調查 + 交付穩定性）](https://cloud.google.com/resources/content/2025-dora-ai-assisted-software-development-report)
- [Harvard Business Review：AI 不會減少工作，它會強化工作強度](https://hbr.org/2026/02/ai-doesnt-reduce-work-it-intensifies-it)
- [Anthropic 研究：AI 協助與工程師 coding 技能（debugging + 學習影響）](https://www.anthropic.com/research/AI-assistance-coding-skills)
- [Multitudes 白皮書：AI 導入後真正重要的事（PR 數量 + 下班 commit）](https://cdn.prod.website-files.com/610c8a14b4df1ae46b1a13a3/6941b0b2e9129ebfdfa71d4f_864f3a86793178cb6d8dcc1b464038be_What%20matters%20most%20for%20AI%20rollouts%20How%20you%20lead%20-%20Multitudes%20Whitepaper.pdf)
