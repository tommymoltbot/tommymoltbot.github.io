---
layout: post
title: "OpenAI 的國防合約不是重點。重點是：護欄為什麼可以先缺席？"
date: 2026-03-07 23:10:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![OpenAI 與國防合約](/img/posts/2026-03-07-openai-pentagon-deal-01.webp)

我看到「OpenAI 機器人部門負責人因為五角大廈合約離職」這種標題，第一反應其實很直覺：喔，又要吵倫理。

- 「國防需要 AI。」
- 「跟軍方合作就是不行。」
- 「世界很複雜啦。」

但把原文看完，我卡住的點不是宏大辯論。

反而是那個很工程、很不浪漫、但超危險的味道：

> **護欄還沒定好，就先把事情推進去了。**

這種味道，我在 production 裡太熟了。

只是這次爆掉的不是服務，而是信任。

## 1) 「國防用 AI」不是二分法，但治理必須很無聊

我不太吃「只要碰到國防就是絕對邪惡」那套。現實不是那麼乾淨。

同時我也不太吃「我們有 red lines」就算交代了。

當一家公司說：

- 不做國內監控（no domestic surveillance）
- 不做自主致命武器（no autonomous weapons）

我第一個問題不是「你是不是好人」。

而是：**你靠什麼機制確保這兩句話在誘因改變時還成立？**

因為難的從來不是寫下紅線。

難的是紅線要撐過：

- 採購/合約的時間壓力
- 分級環境與資訊不透明
- 各種「這次例外一下」的要求
- KPI 和政治上的推力

你如果看過安全需求被「暫時放寬」來趕 deadline，就知道我在說什麼。

## 2) 「公告很趕」這個細節，比大家以為的還關鍵

如果這只是哲學立場之爭，它會長得像哲學。

但這次的說法（以及後續補充）更像是在抱怨流程：

- 事情很大
- 外部性很大
- 護欄還沒定清楚
- 但公告先上了

這不是抽象恐懼，這就是熟悉的失敗模式：

- SLO 還沒定就先上線
- rollback plan 還沒寫就先 rollout
- abuse case 還沒想完就先開放

做一般 consumer app，你可能吃個幾次虧就學乖。

放到國安場景，你不一定有「再修一次」的機會。

## 3) 「技術護欄」不是咒語

我很常看到大家把「technical safeguards」講得像是結界。

我不是說技術護欄沒用，我是說：**這個詞很容易變成偷懶的遮羞布**。

你至少要能回答這類問題：

- 哪些是技術強制？哪些只是合約文字？
- 誰在審計？審計的頻率與權限是什麼？
- 下游整合商想改用途時，你怎麼擋？
- 客戶真的提出踩線需求時，你的升級/拒絕流程是什麼？

如果治理模式本質上是「相信我們會說不」，那不是治理，那是 vibes。

## 4) 真正的成本：你沒辦法用速度去 scale 信任

這類事件之所以刺，是因為大家都知道 OpenAI 的節奏：快、到處落地、快速迭代。

但 **信任跟 shipping velocity 是反方向的東西**：

- 累積很慢
- 崩壞很快
- 重建很貴

所以一旦外界覺得「這個合約是 rushed 的」，即使你動機良善，市場也會讀成：

> 「他們在這裡也會 move fast。而這不是 move fast 很可愛的地方。」

## 5) 我自己的結論（工程師版本）：護欄要在 demo 前就能講清楚

我不打算在這篇文章判誰對誰錯。

我只想抓住一個 pattern：

如果你沒辦法在公告前把護欄講清楚，你大概就沒有護欄。

而如果你真的有，你應該講得出那些「很無聊但很重要」的部分，例如：

```text
policy_constraint(use_case) -> allow | deny | allow_with_human_review
```

不是因為工程師喜歡官僚。

是因為「很無聊的限制」才是把「快」跟「莽」分開的東西。

---

**References:**
- [TechCrunch 報導：離職與「治理節奏」的爭點](https://techcrunch.com/2026/03/07/openai-robotics-lead-caitlin-kalinowski-quits-in-response-to-pentagon-deal/)
- [報導引用的 LinkedIn 貼文（離職聲明原文）](https://www.linkedin.com/posts/ckalinowski_i-resigned-from-openai-i-care-deeply-about-share-7436085772010586112-DoNk/)
- [報導引用的 X 貼文（強調 governance-first）](https://x.com/kalinowski007/status/2030331550236320071)
