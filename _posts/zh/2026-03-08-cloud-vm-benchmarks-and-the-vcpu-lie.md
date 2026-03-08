---
layout: post
title: "雲端 VM Benchmark 2026：vCPU 這個單位其實很會騙人"
date: 2026-03-08 03:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Cloud VM CPU 世代對照圖，以及為什麼 vCPU 讓比較變得很混亂](/img/posts/2026-03-08-cloud-vm-benchmarks-01.webp)

我最近又看到有人在吵雲端成本，吵得很像在解一道乾淨的數學題：

> 「這台每小時多少錢、那台多少錢，算一下不就好了？」

老實說我覺得不是。

不是因為你不會算，而是因為我們都假裝雲端提供了一個可以直接拿來比的單位：**vCPU**。

但 vCPU 很多時候只是「看起來像 CPU」，不一定是你腦中那個「核心」。有時候它真的就是半顆 core（SMT / Hyper-Threading 的一條 thread）。

我把一篇 2026 的 benchmark roundup 看完（**7 家 provider、44 種 VM type、還跨 region 測**），最有價值的其實不是「誰第一名」，而是它提醒你：如果你沒搞懂你買到的是什麼，最後會選到錯的。

## 1) vCPU ≠ core，而且這會直接影響你怎麼看 benchmark
很多 x86 的 instance family，把 **SMT / Hyper-Threading** 當成預設：

- 1 vCPU = 1 thread
- 2 vCPU = 1 個實體 core（兩條 thread）

所以當文章說「用 2 vCPU 來比」，背後可能是：

- 一顆實體 core（有 SMT）
- 或兩顆實體 core（SMT 被關掉）

這兩種差很多，完全不是同一個尺度。

這篇 benchmark 也有提到某些比較新的選項（例如部分 AMD EPYC Turin 的配置）可能 **SMT 是 disabled**，於是「per-2vCPU」看起來會很誇張地漂亮——因為你其實拿到比較多的真 core。

如果你曾經搬 CPU-bound workload，然後覺得突然「平白賺到效能」，這通常就是原因之一。

## 2) Single-thread 效能還是比大家願意承認的更重要
就算到 2026，我還是一直看到很多工作負載卡在：

- 一個 hot loop
- 一個不合時宜的 GC thread
- 一個 DB connection pool 的瓶頸
- 一個 coordinator / scheduler thread

所以我滿喜歡這篇把 **single-thread** 跟 **multi-thread** 拆開看。

很多團隊只看「總吞吐量」，然後 p99 / tail latency 變差再來裝驚訝。

## 3) Region variance 真的存在（而且不只小 provider 才會）
它有一個點我覺得很煩、但也很合理：

> 同一個 instance type，在不同 region 的表現可能不一樣。

以前我只會把這當小 provider 的噪音。

但如果連大雲（所謂 big three）都會不穩，那你就不能拿「CPU label」當成保證。

實務上就是兩句話：

- 你的 production 在哪個 region，就在那個 region benchmark
- 不要以為同一顆 CPU 名字就代表同樣的 sustained performance

## 4) 價格不是「on-demand vs reserved」這麼簡單，它是一棵技能樹
這種文章很適合用來做方向性的決策：

- 哪些 provider 對 CPU-heavy workload 比較划算
- 哪些舊 CPU 世代應該直接避免（有時候會「更貴但更慢」）

但你真的要省錢時，就會掉進定價地獄：

- on-demand
- 1 年 / 3 年承諾
- spot / preemptible
- sustained-use / committed-use
- 甚至還會有「你不設定 min CPU platform，就用舊 CPU 但價格一樣」（這種很 GCP 的驚喜）

如果你的公司把 cloud spend 當成「之後再優化」，那個「之後」通常就會變成永遠。

## 5) 我的順序很土：先挑家族，再跑你自己的 workload
對 CPU-bound workload，我自己會這樣做：

1. 先從文章這種 perf/$ 與 single-thread 表現，挑 2–3 個看起來有希望的 instance family。
2. 跑一次真實 workload replay（或至少有代表性的 microbenchmark）。
3. 驗證 scaling 行為（2 vCPU → 4 vCPU → 8 vCPU），因為 SMT 跟 contention 會讓曲線很詭異。
4. 最後才去談錢（reserved/spot）。

聽起來很廢話對吧。

但我真的看過太多團隊花幾週在吵 pricing tier，最後部署的 workload 其實卡 single-thread，在「便宜」VM 上跑不動，只好 scale out，結果更貴。

所以我現在對 benchmark 的態度是：

- 它很有用
- 但你不要讓 **vCPU** 這個單位，騙你以為你已經比到「真正重要的東西」了

---

**References:**
- [Cloud VM benchmarks 2026：44 種 VM、跨 region 的效能/價格比較](https://dev.to/dkechag/cloud-vm-benchmarks-2026-performance-price-1i1m)
- [Benchmark 原始頁面（同內容、不同站點）](https://devblog.ecuadors.net/cloud-vm-benchmarks-2026-performance-price-1i1m.html)
- [Hacker News 討論串：大家怎麼吐槽這份 benchmark 與雲端定價](https://news.ycombinator.com/item?id=47293119)
