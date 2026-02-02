---
layout: post
title: "OpenAI 自己做了個 data agent，六層 context 背後的真相"
date: 2026-02-02 02:30:00 +0800
categories: [AI, Engineering]
tags: [AI, Engineering]
author: Tommy
lang: zh
permalink: /zh/openai-data-agent-six-layers/
---

![OpenAI Data Agent](/img/posts/openai-data-agent-six-layers.webp)

OpenAI 最近公開了他們內部用的 [data agent](https://openai.com/index/inside-our-in-house-data-agent/)，這不是拿來賣的產品，而是他們工程師自己每天在用的工具。3500 個人、600 PB 資料、7 萬個 table——在這種規模下，光是「找對 table」就能花掉一個早上。

看完之後第一反應是：對，就是這種痛點。

## 問題其實挺真實的

OpenAI 訪問了內部使用者，有人這樣說：

> "我們有很多 table 看起來差不多，我花了超多時間搞清楚它們的差異。有些包含 logged-out user，有些不包含。有些欄位重複，很難分辨誰是誰。"

這不是 OpenAI 特有的問題。任何規模夠大的公司都會碰到：schema 看起來差不多，實際上邏輯完全不同。問錯人、撈錯 table，結果跟著錯一整串。

然後還有那種 180 行的 SQL——看得懂每一行，但整體到底在幹嘛？join 對了嗎？filter 順序會不會炸？這些都是會讓人抓狂的地方。

## 六層 context，不是空談

OpenAI 這個 agent 的核心是「context」，他們堆了六層：

### Layer 1: Table Usage

Schema、欄位型別、table lineage（這個 table 從哪來、流到哪去）。這是基本盤，但還不夠。

### Layer 2: Human Annotations

讓熟悉業務的人去註解「這個 table 是幹嘛的」「這個欄位代表什麼」。聽起來合理，但問題是誰有時間寫？而且會不會過時？

### Layer 3: Codex Enrichment

**這層才是重點。**

他們用 Codex 去掃建 table 的 code，從 Spark、Python、其他 data pipeline 裡抓出這個 table 的生成邏輯。這樣 agent 才能知道：

- 這個 table 每天更新還是每週更新？
- 有哪些欄位是算出來的？
- 資料範圍是什麼？有沒有 filter 掉什麼？

schema 告訴你「這裡有個欄位」，但 code 告訴你「這個欄位怎麼來的」。這才是真正的意義所在。

### Layer 4: Institutional Knowledge

從 Slack、Google Docs、Notion 裡抓出公司內部術語、metric 的定義、某次上線的 context。這聽起來像 RAG，但要做好需要處理權限、cache、還有「哪些文件值得讀」。

### Layer 5: Memory

Agent 會記得之前踩過的坑。比如某個實驗的 filter 條件其實是硬寫在某個 gate 的字串裡，不看 code 根本不知道。如果 agent 第一次被糾正了，它會存下來，下次直接用。

這個概念很重要：**context 不是靜態的，是會學習的。**

### Layer 6: Runtime Context

如果其他層都找不到答案，agent 會直接去 query data warehouse，實際看一下資料長什麼樣。這是最後手段，但有時候就是得這樣。

## 說真的，這些都不容易

我看到很多人看了這篇會覺得「喔 RAG + agent，我也會」。但實際上：

1. **你的 embedding pipeline 跑得動 7 萬個 table 嗎？** 而且還要每天更新，latency 要低。
2. **Codex 真的能穩定掃出所有 pipeline code 的邏輯嗎？** 還是只是運氣好的幾個案例？
3. **Memory 要怎麼存？** 全域的？個人的？會不會 memory 本身就變成新的資料爛攤子？
4. **權限怎麼辦？** 這個 agent 不能讓你撈到你沒權限的 table，但又要能幫你找替代方案。

OpenAI 有 GPT-5、有 Codex、有自己的 Evals API，而且他們自己的資料平台本來就有一定程度的標準化。這些條件不是每家公司都有。

## 最後的觀察

OpenAI 在文章裡提到幾個「學到的教訓」，我覺得滿實在：

**Lesson #1: Less is More**  
他們一開始給 agent 開放太多工具，結果 agent 自己搞混。後來收斂工具數量，效果反而更好。這跟我之前試 agent 的經驗一樣——選項太多，AI 反而不知道該用哪個。

**Lesson #2: Guide the Goal, Not the Path**  
太細的 prompt 反而會限制 agent 的判斷。讓它自己推理路徑，結果更穩。

**Lesson #3: Meaning Lives in Code**  
Schema 只告訴你結構，code 才告訴你意義。這個我完全同意。

---

這篇不是要吹 OpenAI 多厲害。而是看完之後覺得：這才是真的在解決問題，不是 demo。他們做的東西我不一定能做，但至少知道他們在做什麼、為什麼要這樣做。

能不能複製？很難。但至少方向是對的。

## References

- [Inside OpenAI's in-house data agent - OpenAI Engineering Blog](https://openai.com/index/inside-our-in-house-data-agent/)
- [Codex agent documentation - OpenAI](https://openai.com/index/introducing-codex/)
- [GPT-5 flagship model announcement](https://openai.com/index/introducing-gpt-5-2/)
- [OpenAI Evals API documentation](https://platform.openai.com/docs/guides/evals)
- [OpenAI Embeddings API reference](https://platform.openai.com/docs/api-reference/embeddings)
- [Retrieval-augmented generation - Wikipedia](https://en.wikipedia.org/wiki/Retrieval-augmented_generation)
