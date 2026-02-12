---
layout: post
title: "GPT-5.3 Codex-Spark 不是模型文，是 UX 文"
date: 2026-02-12 21:00:00 +0000
categories: [AI]
tags: [AI]
author: Tommy
lang: zh
---

![一個把寫程式回饋迴圈拉緊的示意圖：type → stream → interrupt → edit → ship](/img/posts/2026-02-12-codex-spark-01.webp)

我覺得 AI 發表大概分兩種：

1. 「我們把模型變聰明了。」
2. 「我們把迴圈變短了。」

OpenAI 這次的 [GPT‑5.3‑Codex‑Spark 公告](https://openai.com/index/introducing-gpt-5-3-codex-spark/) 讀起來更像第二種。

坦白說我更在意這種。
因為當你真的每天在用 coding model，延遲不是體感問題，它會直接變成「這東西好不好用」的核心。

## 你很容易忽略的點：time-to-first-token 是產品設計

你跟 LLM 一起寫 code 的時候，思考迴圈其實很脆弱：

- 你丟一個意圖
- 等它回
- 你把上下文重新載回腦袋
- 看它寫了什麼
- 再把方向拉回來

等待一長，你就不太會 steer 了。
不是你變懶，是互動感消失了。

Codex-Spark 比較像在押注一件事：**「快」會解鎖新的互動型態**。

- 小改一下
- 立刻看到
- 半路打斷它
- 再補一句調整

這不是方便而已。
它會改變你「修正模型」的頻率，而那個頻率其實會決定模型最後跟你意圖貼不貼。

## 「1000 tokens/sec」不是重點，「我可以打斷你」才是

行銷一定會把吞吐量拿出來講。
但互動式工作真正的瓶頸，往往不是 tokens/sec。

瓶頸是：這個系統像協作者，還是像 batch job。

模型慢的時候，你會被迫進入這種模式：

```text
prompt -> wait -> accept/reject
```

模型夠快的時候，你才有可能變成：

```text
start -> watch -> interrupt -> reshape -> continue
```

後者就是「LLM 當 autocomplete」跟「LLM 當可塑形的 editor」的分水嶺。

## 真正硬的工程主張：harness 跟 model 一樣重要

這篇公告裡我最有感的一段，是他們花力氣講「端到端延遲」而不是只講 inference 變快。

這種說法很工程。
它暗示你要把這些東西都當成產品表面：

- streaming 路徑
- session 初始化
- network overhead
- per-token overhead

你做過任何一個「看起來很快」的工具就知道：

- 不是只讓它算得快
- 是讓它**更早開始回應**

而他們明講 time-to-first-token 的改善，這就是 UX decision，不是研究論文。

## 戰略面：real-time 跟 long-running 會合流

我相信「兩種模式」這個 framing：

- 你在 flow 裡 → 需要即時小修改
- 你要讓 agent 去 grind → 需要長時間自主跑

但更有趣的是兩者的邊界。

如果 real-time 夠好，你不會只把整個任務丟出去。
你會開始把「微決策」連續地委託給它。

那才是 coding model 變強（而且有點可怕）的地方：它不再是你偶爾呼叫的工具，而是你隨時在塑形的工具。

## 我接下來會看什麼（以還在寫 code 的人視角）

如果 Codex-Spark 真的走向產品，接下來難的其實不是 benchmark 分數，而是 workflow 的 invariant：

- 它是不是預設 **minimal diffs**，讓 code review 還能活？
- 它能不能講清楚「為什麼改」又不寫成小說？
- 它會不會沒被要求就「順便」大重構？
- 它能不能學到團隊規範，但不要變成 vibe？

最重要的是：

- 當 codebase 很髒、context 很亂的時候，它還能不能被打斷、還能不能保持回應？

那才是 latency-first 承諾真正會被驗證的地方。

## References

- [OpenAI 的 GPT‑5.3‑Codex‑Spark 發表（主打 real-time coding）](https://openai.com/index/introducing-gpt-5-3-codex-spark/)
- [公告中提到的 OpenAI × Cerebras 合作說明](https://openai.com/index/cerebras-partnership/)
