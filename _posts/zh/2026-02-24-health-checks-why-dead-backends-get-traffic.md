---
layout: post
title: "為什麼 load balancer 會一直把流量打到已經死掉的 backend（而且通常不是 bug）"
date: 2026-02-24 03:05:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![被動式健康檢查：第一個壞掉的 request 才會讓 client 察覺](/img/posts/2026-02-24-health-checks-dead-backends-01.webp)

你一定遇過這種場景：

> 「那台機器明明就死了，為什麼 load balancer 還在送流量過去？」

我以前也直覺覺得這是某種「LB 很蠢」或「健康檢查沒做好」。

但後來越看越覺得，這問題其實更像控制系統：

**health check 從來不是 boolean，它是有延遲、有門檻、有取捨的。**

LB 不是看到一個異常就立刻拔掉 backend（那會狂抖、狂切、狂炸）。所以它會等：

- 等下一次 probe
- 等連續失敗 N 次
- 等超時累積到某個程度

代價就是：在那個短短的空窗期，使用者的真實流量會很認真地被送去一台已經出事的機器。

## 大家常忘的點：「healthy」是落後指標

典型 server-side LB 的健康檢查大概長這樣：

```text
health_check(interval, timeout, rise, fall) -> backend_state
```

其中最痛的通常是 `fall`（要連續幾次失敗才算不健康）。

舉個常見組合（每家 LB/每個團隊設定不同，但形狀差不多）：

- 每 5 秒 probe 一次
- timeout 設 2 秒
- 連續失敗 3 次才拔掉

如果 backend 在一次成功 probe 之後立刻硬死，你就很容易看到「還在送流量」這種現象，長度甚至可以到十幾秒。

這不是 LB 做錯事，它是在做你想要它做的事：*不要因為一次失敗就暴走。*

## Client-side load balancing 反應更快…但代價是「一定有人先受傷」

文章把 server-side / client-side 的差異講得很清楚：

- **Server-side LB**：一個 proxy 做決策，大家共用同一份狀態
- **Client-side LB**：每個 client 都拿一份 instance list，自己決定要打哪台

Client-side 的常見武器是 **被動式健康檢查（passive health checks / outlier detection）**：

不是去打 `/health`，而是看「真實 request 的結果」。

所以偵測速度可以快到：*第一個失敗的 request 就觸發隔離*。

但這句話背後其實很殘酷：

**至少會有一個真實 request 先失敗。**

而且不同 client 收斂速度不同：

- Client A 剛好撞到錯誤 → 立刻把那台隔離
- Client B 還沒撞到 → 還以為那台很健康，繼續送

所以你會得到一個「全域不一致，但局部反應很快」的系統。

## 真正的 tradeoff：一致性 vs 失敗的爆炸半徑

我比較喜歡這樣理解：

- Server-side LB：**一致性高**（一個權威狀態），改一次所有人立刻生效
- Client-side LB：**反應快**（在 edge 上立即止血），但狀態是分散的、只會逐步收斂

很多人說「我們需要 client-side LB 才可靠」，其實是在說：

> 我們想把單一故障造成的爆炸半徑縮小，讓每個 client 先自己止血。

而很多人說「client-side LB 很難 debug」，也是真的：

> 分散狀態很難查，你還得把那套邏輯塞到每種語言的 client library 裡。

兩句都對。

## 我自己的結論（以被叫醒過的人角度）

1. 如果你的症狀是「timeout 疊了 30 秒」，第一個要看的通常不是模型或程式，是 **health check 的 fall threshold**：你等於在明說「我願意再餵這台壞掉的機器幾秒」。
2. 不要把 server-side LB 直接等同於慢。你可以把 probe 設很 aggressive，只是你要接受 flapping 風險，然後想好怎麼兜。
3. 真的要走 client-side，就把那些無聊但會殺人的東西先規劃好：版本控管、跨語言一致性、以及不用 SSH 進 200 個 pod 才看得到狀態的 observability。

最後就是：沒有哪一種是「唯一正確」。只有哪一種更符合你的流量型態、SLO，跟你能忍受的痛。

---

**References:**
- [The Instance Is Up. Or Is It? Health Checking in Client-Side vs Server-Side Load Balancing](https://singh-sanjay.com/2026/01/12/health-checks-client-vs-server-side-lb.html)
