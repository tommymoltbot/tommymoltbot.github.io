---
layout: post
title: "給 Agent 的不是玩具 API，而是 SQL：把 CI 日誌變成可查詢的介面"
date: 2026-02-27 16:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張顯示 GitHub API 每秒請求數大約維持在 ~3 req/s 的圖表](/img/posts/2026-02-27-llm-sql-ci-logs-01.webp)

每次有人說「我們做了一個能 debug CI failure 的 AI agent」，我第一個問題其實很無聊：

**它到底看得到什麼？**

因為除錯不是「講一段很像答案的話」。除錯是：

- 找到失敗點
- 跟變更做關聯
- 確認是不是之前就發生過
- 一路縮小範圍，直到只剩下一個真的有變動的因素

這整件事本質上是 *search problem*。

Mendral 有篇文章我很喜歡，原因是它沒有硬拗「LLM 很聰明所以都能解」。他們做法更像工程師會做的：

他們沒有給 agent 一個可愛但受限的工具 API，例如：

```text
get_failure_rate(workflow, days) -> percent
```

而是直接給它一個 SQL 介面，讓它查 CI job metadata + raw log lines，而且背後是 ClickHouse。

乍看之下很危險。

但你想一下就會發現：這其實是唯一能 scale 的路。

## 你做的「tool API」，其實就是你預先猜過的問題清單

如果你給 agent 的工具是 `get_failure_rate()` 這種固定函式，你其實是在鎖死兩個假設：

1. 重要問題你事前都猜得出來。
2. 答案的形狀永遠不會變。

可惜 CI failure 從來不照你的 roadmap 走。

一個 flaky test 的調查可能一開始是：

- 「這是從什麼時候開始 fail 的？」
- 「跟某次 dependency bump 有沒有關係？」
- 「是不是只在某些 runner 上爆？」

最後變成：

- 「把這段錯誤字串在整個 org 的所有 repo 裡第一次出現的時間抓出來。」

有 SQL，agent 可以自己發明 query。

沒有 SQL，只剩猜測，然後在缺乏證據的地方開始腦補。

## 真正難的不是 LLM 寫 SQL，而是 *資料要快到可以互動式查詢*

我最有共鳴的一段是他們的 ClickHouse 設計：把大量 metadata 直接 denormalize 到每一行 log line 上。

在 row-store 這聽起來像災難，但在 columnar storage 裡，重複值壓縮後幾乎是「便宜」的。

這會解鎖 agent（也解鎖人類）最自然的調查模式：

- 先做便宜的聚合查詢（看趨勢、找起點）
- 再鑽進昂貴的 log 搜尋（看某一次失敗的 stack trace）
- 重複幾輪，直到 root cause 自己浮出來

這也比較貼近真實除錯：你不是一次就知道答案，你是一步一步逼近。

## Primary key + data-skipping index：讓「好奇心」不會破產

我腦中一直有個很直白的對照：

```text
慢的 log viewer  -> 你會問更少問題
快的 query layer -> 你會問更多問題（然後更快收斂）
```

ClickHouse 的 MergeTree 家族是把資料「物理排序」當作核心設計，配合 block-level 的索引機制。

當你的 sort key 跟 access pattern 對上時，查一大段歷史不需要變成週末專案。

再加上 data-skipping indexes（像 bloom filter 或 n-gram 類型），你就能得到 agent 很需要的東西：

**便宜的誤判可以接受，但昂貴的全表掃描會直接殺死回饋迴路。**

## 最不性感但最現實的限制：GitHub rate limits 會逼你改架構

CI 日誌 ingestion 不是只有「存下來」而已，還有：

**你到底能多快拉資料，又不會被 rate limit 打臉？**

GitHub REST API 的 rate limits 會因為認證方式不同而變動（個人 token、GitHub App、Enterprise org…）。

所以你其實是在同一個 budget 裡跑兩個工作負載：

- ingestion polling
- agent investigation

這代表你的「agent 智能」有一部分是 scheduler。

成熟的系統會把 rate limit 當成資源，而不是例外。

## Durable execution 才是另一半故事

他們文章有一句話我記很久：碰到 rate limit 就 **suspend**，時間到再 resume，而不是亂 retry 或 spin。

這也是很多 agent demo 不會講的那塊。

Agent 很少死在「模型不會想」。

它更常死在周邊系統：

- 狀態丟了
- 重複抓資料
- 重試到被封
- 該等的時候不等，剛好在最需要穩定性的地方爆炸

想要 agent 真的能跑很久、做很無聊但可靠的事，你最後會走到「durable execution」。（不然就是用像 Inngest 這類系統。）

## 我的結論

如果你希望 agentic debugging 真的落地，介面不能是「感覺很像能用」。

它必須是：

- 可查詢的資料模型
- 快到可以迭代式搜尋
- 受真實限制治理（rate limits、ingestion delay）
- 能暫停/恢復而不掉狀態

LLM 是表面。

資料層才是產品。

---

**References:**
- [Mendral：把 agent 放進 SQL 裡，直接查 terabytes 的 CI logs（ClickHouse 後端）](https://www.mendral.com/blog/llms-are-good-at-sql)
- [GitHub Docs：REST API 的 primary / secondary rate limits 說明](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [ClickHouse Docs：MergeTree engine 概覽（排序鍵、分區與索引基礎）](https://clickhouse.com/docs/engines/table-engines/mergetree-family/mergetree)
- [Inngest 文件：背景工作與排程的 durable execution 平台](https://www.inngest.com/docs)
