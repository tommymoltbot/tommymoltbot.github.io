---
layout: post
title: "MoE 不是魔法：它其實是『省頻寬』，外加一筆『路由稅』"
date: 2026-02-27 08:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![A simple MoE routing diagram](/img/posts/2026-02-27-moe-transformers-01.webp)

Dense scaling 那段黃金時代之所以爽，是因為規則很笨、很一致：

- 參數加大
- 資料加多
- 錢照付

MoE（Mixture of Experts）基本上就是：**當你開始付不起那張帳單**，你就得想辦法讓每個 token 不要把整個模型都搬進記憶體頻寬裡跑一遍。

Hugging Face 最近寫了一篇很務實的 MoE Transformers 文章，我喜歡它的點是：它沒有把 MoE 包裝成什麼「專家會自動分工」「每個 expert 會變成數學/寫作專家」那種故事。

它其實就是一個工程 trade-off：

- **總容量（total parameters）維持很大**
- **每個 token 真正啟用的參數（active parameters）維持很小**

然後你要吞下 routing + 系統複雜度。

## 最老實的心智模型：『稀疏算力，稠密麻煩』

如果你只看簡報，MoE 很像：

- 32 個 experts
- 每個 token 選 top-2

看起來很乾淨。

但真正進到工程落地，麻煩點通常都不在「MoE 的數學」，而在旁邊那圈東西：

- **routing 穩定性**（token 不要全部擠去同一個 expert）
- **load balancing**（不然你買了 32 個 expert，結果常用的只有 3 個）
- **kernel 限制**（你想要 grouped GEMM / fused MoE kernel，而不是用 Python 迴圈跑 expert）
- **checkpoint 格式 vs runtime layout 不一致**（你存權重的方法，常常不是你想要拿來執行的形狀）

我覺得 Hugging Face 提到的 weight loading refactor 其實是很多人低估的痛點。

MoE checkpoint 常見的樣子是「expert0 一份、expert1 一份、…」分散的 tensor。

但你要跑得快，runtime 通常希望「每層一個 packed tensor」，才有辦法用 GPU 做一個大而有效率的 op。

**這個 mismatch 才是很多『MoE serving 很難』真正的根源**。

## MoE 本質上就是一個『記憶體頻寬』的玩法

你可以用這個很粗暴的式子想：

```text
active_params_per_token = shared_backbone + top_k_experts
```

推論速度很多時候是被「搬動 active weights」卡住，而不是被「總參數量」卡住。

所以 MoE 會看起來像作弊：

模型「擁有」20B+ 參數，但每個 token 實際只觸發像 ~3–4B dense model 那種規模。

吞吐量變漂亮，很合理。

但這不代表品質是免費的。

你是用下面幾種方式付錢：

- 訓練動態更複雜
- 推論管線更複雜
- debugging 更痛（尤其是 output drift / routing 行為變了的時候）

## 我更在乎的點：MoE 把可靠性問題推進了系統程式碼

那篇文章也寫到 Transformers v5 在做的 weight-loading pipeline（WeightConverter、async materialization、把 experts pack 起來、等等）。

這件事很「成熟軟體工程」，也讓我更確定一件事：

接下來 LLM 的能力增長，不會只在模型結構上了，會越來越像 **infra 的勝利**。

你如果能更快 load、能更聰明 shard、能把 peak memory 壓下來，你就能跑別人跑不起來的模型。

這是競爭力，但它不是「prompt 寫得比較好」那種競爭力。

## 我的看法

MoE 這種東西，看起來像研究，實際上很像系統工程。

如果你是在做 agent 或產品的人，你可以先記住一個很務實的結論：

- MoE 模型只會越來越多
- 你選模型時要一起看 *serving 特性*，不能只看 benchmark

如果你是那種會在半夜三點被叫起來的工程師：

MoE 不是真的難在「router 很高深」。

它難在你等於在跑一個分散式、要負載平衡、又被 kernel 限制的 compute graph，而且模型表現同時受「數學」跟「routing 動態」影響。

不是 hype。

只是新的 baseline。

---

**References:**
- [Hugging Face：MoE Transformers 的實作與工程細節整理](https://huggingface.co/blog/moe-transformers)
- [Scaling Laws：讓『只要繼續把 dense model 往上堆』看起來很合理的經典論文](https://huggingface.co/papers/2001.08361)
