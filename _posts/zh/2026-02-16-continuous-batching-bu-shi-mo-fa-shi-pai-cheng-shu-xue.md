---
layout: post
title: "Continuous batching 不是魔法，是排程 + KV cache 的數學。"
date: 2026-02-16 03:00:00 +0000
categories: [Engineering, AI]
tags: [Engineering, AI]
author: Tommy
excerpt: "把 continuous batching 當成 ‘框架功能’ 很容易寫出漂亮 benchmark、很爛的線上服務。它本質上是：因為 KV cache 把 decode 變成可切片的小步驟，所以你終於能把 prefill 和 decode 當成兩個隊列去排程，讓 GPU 不要一直空轉。"
image: /img/posts/2026-02-16-continuous-batching-banner.webp
lang: zh
---

第一次聽到 **continuous batching**，大部分人的腦袋會直接把它歸類成「某個 serving framework 的黑科技」。

但我覺得那種理解方式很危險，因為它會讓你忽略兩個現實：

- 你付錢買的是 GPU 時間，不是 “漂亮的吞吐數字”
- 你真正要守的是 **SLO（尤其是 P99）**，不是 demo 的平均值

我比較喜歡用一句話講它的本質：

- continuous batching 不是 LLM 的特性
- 它是 **排程問題**，而 KV cache 讓這個排程變得可行

## 我用五個角度檢查 continuous batching 到底是不是在講真的

1) **商業角度：** GPU 很貴。任何 idle bubble 都是在把錢燒掉，而且你通常看不到。

2) **系統角度：** 你不是在跑「一個推理」。你是在跑一個 multi-tenant 的 pipeline，流量會抖、會突刺。

3) **歷史角度：** 這不是新問題。Web server、DB、RPC 都在做類似的事：讓昂貴資源保持飽和，但別把 tail latency 送上天。

4) **工程師角度：** 如果你的設計默認「一個 request 就綁死一段 GPU 生涯」，那你遲早撞牆。

5) **我的最低標準：** 如果解釋裡沒有提到 **prefill vs decode**，那多半是行銷。

## 為什麼 batching 會難：prefill 跟 decode 根本不是同一種工作

一個 chat completion 通常可以拆成兩段：

- **Prefill：** 讀完整個 prompt，建好 KV cache。
- **Decode：** 一 token 一 token 產生輸出，重用 KV cache。

Prefill 通常比較「一坨」，decode 則是「很多小步驟」。

線上服務的痛點常常不是你算不出 token，而是你算得很碎：

- request 到達時間是隨機的
- 有些 prompt 很長，有些很短
- 有些回答 20 token 就結束，有些會跑 2,000 token

你很容易在 decode 過程中出現 GPU 空檔：

- 有的序列提前結束
- batch 的形狀一直變
- 你如果用「固定 batch 跑到全部結束」的做法，空轉會很嚴重

## KV cache 是 continuous batching 的前提條件

KV cache 的價值不只是「省計算」。

更重要的是：它讓 decode 變成可以切片、可以排程的小單位。

你可以把 decode 想像成：

```text
每一步：
  讀 KV cache
  算下一個 token
  把新的 K/V 追加進去
```

一旦工作被切成很多小步驟，你就有機會把不同 request 的步驟交錯在一起跑。

這就是 continuous batching 能成立的原因。

## Continuous batching 其實就是：rolling batch，而不是 fixed batch

不要再用這種思路：

- 等到湊滿 N 個 request
- 形成一個 batch
- 一路跑到全部都結束

continuous batching 更像這樣：

- GPU 上維持一個 **active set**（正在 decode 的序列）
- 有序列結束，就把新的 request **補進來**
- 同一輪裡，可能同時做：
  - newcomers 的 prefill
  - ongoing 的 decode

聽起來像 “維持 GPU 忙碌” 而已。

但你真正需要的是一個 scheduler，隨時回答：

- 現在該收多少新 request？
- prefill 要做多少？會不會把 decode 餓死？
- decode 要給多少時間片？會不會讓 TTFT 爆炸？

## 最難吞下去的真相：你在吞吐跟穩定性之間做交易

continuous batching 是吞吐的武器，但它同時也讓你走向一個世界：

- 你會更追求 steady-state utilization
- 你會接受單一 request latency 的波動變大（尤其是 tail）

所以問題永遠不是「要不要 continuous batching」。

而是：

- 你要守的是哪個指標？P50 / P95 / P99？
- 你的流量型態是什麼？突刺多不多？
- prompt 長度分布如何？輸出長度分布如何？

把這些不講清楚，只談吞吐，就是在騙自己。

## 一個我覺得最實用的心智模型：你在排兩個隊列

我會把 GPU 當成同時在服務兩個 queue：

- **prefill queue**（新 request）
- **decode queue**（舊 request）

極端情況：

- 如果你一直偏向 prefill，新 request TTFT 好看，但 streaming 會卡、舊 request 會抖。
- 如果你一直偏向 decode，streaming 很順，但新 request 會排到天荒地老。

好的 continuous batching，就是一套能在兩個 queue 之間取得平衡的政策。

## 我會要求的最低配（不然別跟我說你上線了）

如果你要我相信你的 serving 能扛線上流量，我會想看到：

- 明確的 limits：max batch size / max tokens / max concurrency
- admission control：別收你做不完的工作
- prefill / decode 分開的 budget
- 可觀測性要拆得夠細：
  - TTFT
  - tokens/sec
  - GPU 利用率
  - queue wait time
  - KV cache 記憶體壓力

因為你最終會被真實流量教育：平均值不值錢，尾巴才會殺人。

## 結論（我自己的底線）

Continuous batching 不是你加一個 flag 就會變快。

它其實是在告訴你：

- LLM server 的本質是 **scheduler**
- KV cache 讓 generation 變成可切片的步驟
- continuous batching 讓昂貴硬體不要一直空轉

把它當成行銷 checkbox，你會得到：benchmark 很強、線上很痛。

---

## References

- [Hugging Face：Continuous batching from first principles（視覺化講得很清楚）](https://huggingface.co/blog/continuous_batching)
- [Hugging Face：KV cache（理解 decode 為什麼跟 prefill 不同）](https://huggingface.co/blog/kv-cache)
