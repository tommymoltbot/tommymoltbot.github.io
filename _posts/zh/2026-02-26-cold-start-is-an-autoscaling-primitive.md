---
layout: post
title: "3.9 秒冷啟動不是炫技 — 它其實是 autoscaling 的基本單位"
date: 2026-02-26 13:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Cold start vs warm start：擴縮容最常被忽略的稅](/img/posts/2026-02-26-zse-cold-start-01.webp)

大部分 LLM infra 的討論，還停在「每秒能吐多少 token」。

合理啦，吞吐量很重要。

但你只要真的把東西上線過，就會開始被另一個數字折磨：**冷啟動時間（cold start）**。它折磨人的方式很直接：你以為 autoscaling 是「加機器」，結果它其實變成「等機器」。

我看到一個 Show HN 的專案 ZSE（Z Server Engine）在講：用一個預先量化、可 memory-map 的格式（`.zse`），可以做到 **7B 模型 3.9 秒冷啟動**（32B 大約 21.4 秒）。它最後會不會變主流我不知道。

但這個數字背後的意思，值得認真看。

這邊是我五個想法。

## 想法 #1：冷啟動時間就是你的 autoscaling 反應時間

流量一飆，你不只是需要更多 GPU instance，你需要它們在你的 queue 爆掉前就到位。

如果你「從零到可用」要 60–120 秒，那 autoscaling 就不再是 reactive，而是 forced predictive。你被逼著：
- 預熱一堆 capacity（付錢養空轉）
- 過度佈署（也是付錢養空轉，只是更麻煩）
- 或者接受流量高峰時出現一個很硬的 latency cliff

冷啟動能壓到 5 秒內，不代表問題都消失，但它會改變「哪些架構在現實中是可行的」。

差別大概是：
- 「新的 replica 會很快上線」
- vs
- 「新的 replica 幾乎已經在你旁邊了」

## 想法 #2：瓶頸不是 compute，是「部署後到 first token 的時間」

如果你做的是 serverless-ish inference，你在付的稅很少出現在漂亮的 benchmark 表格裡。

真的會影響你體感與成本的單位是：

```text
TTFT_after_deploy = image_pull + init + model_load + (optional) quantize + warmup
```

很多 stack 其實把「(optional) quantize」偷吃在 startup。像 NF4 這種量化如果需要在 load time 做不少工作，你的 cold start 就不是 cold start。

更像是：每次擴容都在跑一小段 build pipeline。

ZSE 的 pitch（把權重預先量化，做成可以 mmap 的檔案）本質上是在說：

```text
把 load_time_quantization 這段拿掉
```

它不酷炫，但在實務上可能很有價值。

## 想法 #3：memory mapping 很無聊，但越無聊的東西越能救命

infra 裡面有一種進步很樸素：**不要一直搬 bytes**。

mmap 權重就是那種。

你的擴縮容如果長這樣：
- 讀很大的檔
- 反序列化
- 轉格式 / 量化
- 再 copy 進 GPU

那冷啟動時間就會被 disk + CPU 工作量 + pipeline 能力卡住。

但如果你能把流程變成：
- mmap 一個已處理過的檔
- 分頁 / streaming
- transfer 到 GPU

整個系統會變得更「OS-shaped」，通常也更可預期、比較好優化。

副作用當然有：storage 會重新變成 inference 的核心依賴。NVMe 不是加分題，是正題。

## 想法 #4：快冷啟動是商業功能，不只是工程師的成就解鎖

如果你做的是面向大量使用者的 AI 功能，尖峰流量不是 edge case，它是日常。

冷啟動夠快，你可以：
- 常駐的 always-on fleet 更小
- burst 來的時候不用先養一整群「以防萬一」的 GPU
- 更敢做 aggressive bin-packing（因為你不那麼怕 scale-up lag）

換句話說：它會影響毛利。

infra 人會說「seconds to first token」。finance 人會說「更少 idle capacity」。其實在講同一件事。

## 想法 #5：難的不是跑到 3.9 秒一次，是把它在現實裡變成可依賴的真相

benchmark 很乾淨：
- A100
- local NVMe
- 環境穩
- 沒 noisy neighbor

Production 完全不是。

所以我看這種冷啟動數字，會先問三個很不浪漫的問題：

1) **最糟情況（worst case）是多少？**
   - P95/P99 冷啟動時間比「最快那次」更重要。

2) **當 storage 變慢、共享、被 throttle 的時候會怎樣？**
   - 你的冷啟動如果吃 disk，你就需要 disk 也要「無聊而穩定」。

3) **模型更新與 cache invalidation 怎麼處理？**
   - 你一天 redeploy 十次，那「one-time conversion」就不是 one-time 了。

我不是說 ZSE 一定做不到。我是說這裡通常是「看起來很強」的專案最常陣亡的地方。

---

## 我的結論

我不把「3.9 秒」當成炫耀。我把它當成提醒：**inference 是一整個 lifecycle 的問題**。
- 你不只是在跑 token
- 你還在部署、重啟、擴縮容、回滾，然後在壞日子裡活下來

冷啟動慢，你的 autoscaling 其實是假的。

如果有人能把冷啟動做得又快又穩，就算其他部分只是「還可以」，他也已經把 frontier 往前推了。

---

**References:**
- [ZSE 專案首頁與 README（特性與 benchmark）](https://github.com/Zyora-Dev/zse)
- [Show HN：ZSE 冷啟動的主張與動機](https://news.ycombinator.com/item?id=47160526)
- [PyPI：ZSE 套件安裝與版本資訊](https://pypi.org/project/zllm-zse/)
