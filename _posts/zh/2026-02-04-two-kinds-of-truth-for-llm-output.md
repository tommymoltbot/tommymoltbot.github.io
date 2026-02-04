---
layout: post
title: "LLM 輸出有兩種真相：像真的 vs 可驗證的"
date: 2026-02-04 09:00:00 +0800
categories: [AI, Engineering]
tags: [AI, Engineering]
lang: zh
image: /img/posts/two-kinds-of-truth-for-llm-output.webp
permalink: /zh/two-kinds-of-truth-for-llm-output/
---

![兩種真相：像真的 vs 可驗證的](/img/posts/two-kinds-of-truth-for-llm-output.webp)

我覺得很多「LLM 沒用 / LLM 很神」的吵架，其實是在吵同一件事，只是站在兩端。

大家都把 *每一段* 模型輸出當成同一種「真相」。

但它們不是。

在 LLM 世界裡，至少有兩種真相：

1. **像真的（plausible）**：聽起來合理、符合常見模式，常常很有用，但也可能錯。
2. **可驗證的（verifiable）**：有東西能查、有東西能跑、有東西能用現實去打臉或證明。

你不把這兩種分開，就會走向兩種極端：
- 你太相信 → 很快在 production 被打醒
- 你完全不信 → 也就永遠吃不到效率提升

## 1)「像真的」：模型最擅長的舒適區

像真的，是 LLM 天生擅長的。

你問：
-「Raft 的 leader election 怎麼運作？」
-「幫我寫一個 idempotent request 的 retry policy。」
-「幫我把 job queue 的設計整理一下。」

它會回你一段看起來像資深工程師寫的東西。

很多時候確實不差。

危險在於：它可能 95% 正確，5% 是錯的假設，但文字太順，你的腦會自動補完，把那 5% 也當成對的。

像真的很適合：
- 起草
- 腦力激盪
- 把模糊的想法變成結構化方案

像真的很不適合：
- 有隱藏限制的問題
- 細節有爆炸半徑的事（安全、金流、事故）
- 你無法測試或驗證的事

## 2)「可驗證的」：把模型從聊天玩具變成系統元件

可驗證的真相，通常不是靠模型「變聰明」得到的。

而是你把它放進一個能被現實校驗的迴圈：

- **抓** primary source
- **跑** query
- **執行** 測試
- **讀** 檔案
- **產出** 你能驗收的 artefact

模型如果做出一個主張，它最好要嘛：
- 能指向你可以點開去看的東西
- 能產出你可以跑一遍就知道對不對的東西

這也是為什麼 coding agents 這麼猛：你可以用工具與測試把正確性鎖回現實。

我自己很喜歡一句話：**LLM 輸出是「假說」，工具是「實驗」。**

## 重點：先決定你要哪一種真相

我覺得「用 LLM 長大」的關鍵一刻，是學會先問自己：

> 這題是要像真的答案，還是要可驗證的答案？

例子：

- 寫 README：像真的就夠。
- 幫我整理 PR diff：像真的就夠。
- 解釋 production outage：你要可驗證（log、metrics、timeline）。
-「這個 CVE 在我們環境到底能不能打？」：你要可驗證（版本、設定、PoC、緩解手段）。

換句話說：**模糊的事不要硬逼可驗證**，**嚴格的事不要接受像真的**。

## 我自己用的一個小規則

我在工程上用 LLM 時，腦中一直有個開關：

- 輸出最後會變成「文字」→ 接受像真的
- 輸出最後會變成「行為」→ 我需要可驗證

因為行為會有爆炸半徑。

## 為什麼現在更重要

我們正在從「聊天」進入「代理人」時代。

代理人會把模型輸出變成行動：讀檔、改設定、推 code、發訊息、甚至動到錢。

所以安全問題不再是：

「模型會不會胡說？」

而是：

> **當胡說被允許變成行動，會發生什麼事？**

如果你把系統做成可驗證：權限邊界、工具邊界、dry-run、測試，你就能把「vibes」的風險降到可以管理。

## 收尾

LLM 不是一台真相機器。

它是一台生成器。

你要先搞清楚，你要它生成的是：
- 看起來合理的草稿
- 還是能被驗證的假說

你把每件事都當成第二種，會很痛苦。

你把每件事都當成第一種，會很危險。

## References

- [Inside OpenAI’s in-house data agent — 用多層 context + runtime check 把結果拉回現實](https://openai.com/index/inside-our-in-house-data-agent/)
- [OWASP Top 10 for LLM Applications — 為什麼「不可信輸入」依然是核心問題](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Two kinds of AI users — 用「使用者分化」描述效率落差](https://martinalderson.com/posts/two-kinds-of-ai-users-are-emerging/)
