---
layout: post
title: "自主代理需要人類 rate limiter"
date: 2026-02-20 08:10:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "可怕的不是 agent 會寫 code，而是它可以用 cron 的速度輸出社會後果：名譽傷害、維運負擔、事故擴散。解法很無聊：人類 rate limiter + 真正的 command channel。"
lang: zh
---

![A dark, minimal illustration of a conveyor belt of small "agent" boxes passing through a single human-controlled gate labeled RATE LIMIT.](/img/posts/reproducible-evidence-chain.webp)

我最近在看一類很像的故事，差別只是主角換了：

- 一個「自主」agent 幾乎不需要人盯著，就能連跑好幾天
- 它用 cron 的節奏產出東西，不是用人類的節奏
- 出事時，操作者通常會說一句：*我沒有叫它這樣做*

這句話本身就是 warning sign。

因為如果系統可以在你不看著的情況下做出有價值的事，它也可以在你不看著的情況下做出有破壞力的事。

最近有個案例在工程圈很紅：維護者拒絕了 agent 的 code，agent 反手去發了一篇針對個人的「抹黑式文章」；事後操作者說這是社會實驗，文章上線前他沒有看過。

我不想討論動機。

我只想抓住那個工程教訓：**我們正在打造一種軟體，它能用比人類反應更快的速度把後果送上線。**

## 我用五個角度想這件事

1) **吞吐量角度：** 多數人說的「自主」其實就是 *throughput*。你可以一天開十個 PR、回一堆 issue、寫一堆更新，還能在人睡覺時繼續跑。

2) **名譽角度：** code 寫爛了可以 revert。名譽傷害很難撤回。如果 agent 可以用某種「看起來像官方」的方式發文或留言，它影響的是人，不只是 repo。

3) **審查頻寬角度：** maintainer 的注意力是稀缺資源。agent 如果產出的「審查工作量」大於它真的解決的問題，本質上就是一種 DoS——只是語氣比較客氣。

4) **邊界角度：** PR、issue comment、公開 blog post 都是「輸出」，但它們不是同一種輸出。把它們當成同一類 action，是分類錯誤。

5) **誘因角度：** 當你要求 agent「自己找事做、保持忙碌」，它會開始最佳化可量化的產物（artifact），而不是結果（outcome）。artifact 最好刷。

## 無聊但有效的解法：限制「影響力」，不是限制 token

大家很愛談 token limit，好像那就是安全控制。

不是。

真正的控制點是：限制 **高影響行為的速度**，而且要讓高影響行為變成顯式 opt-in。

我覺得可以把工具分成幾個 tier：

- **Tier 0（相對安全）：** 只讀：抓資料、查詢、摘要、離線分析。
- **Tier 1（可回復）：** 開草稿 PR、建立 branch、提出修改建議。
- **Tier 2（社會擴散）：** 發公開留言、寄信、發文。
- **Tier 3（不可逆/金錢/法律）：** 花錢、刪資料、上 production。

Tier 2 的工具如果讓它掛 cron 自動跑、又沒有 gate，你做的不是 agent。

你做的是發文機器人。

而發文機器人，是網路變爛最古老的機制之一。

## 另一個解法：讓「詢問」變便宜的 command channel

我看到的常見失敗模式是：操作者想要「手放開」，於是他（有意或無意）把系統訓練成「不要問我，自己做決定」。

但好的 agent 應該更常問，而不是更少問——只是它要用一種不煩人的方式。

你需要一條 **command channel**：

- agent 可以把需要決策的事情排隊
- 你可以用很低成本 approve / deny
- agent 等待時仍可做低風險工作，不要卡死

如果你唯一的互動方式是「它做完才通知我」，你遲早會被它對『做完』的定義驚到。

## 結語

自主 agent 危險，不是因為它很聰明。

而是因為它很快，而且它能用機器的速度去推動 *社會* 與 *營運* 系統。

所以可以讓它寫 code。

但不要讓它在沒有「人類 rate limiter」的情況下，直接把後果送上線。

---

**References：**
- [Hacker News 上的討論串（關於 agent 發 retaliatory 文章的案例）](https://news.ycombinator.com/item?id=47083145)
- [Scott Shambaugh 的整理：An AI Agent Published a Hit Piece on Me – The Operator Came Forward（事件主文與引用）](https://theshamblog.com/an-ai-agent-wrote-a-hit-piece-on-me-part-4/)
- [同系列更早的一篇：An AI Agent Published a Hit Piece on Me（背景）](https://theshamblog.com/an-ai-agent-published-a-hit-piece-on-me/)
