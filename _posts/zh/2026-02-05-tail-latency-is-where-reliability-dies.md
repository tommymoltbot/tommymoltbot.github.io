---
layout: post
title: "尾端延遲才是可靠性真正死掉的地方（別再拿平均值自我安慰）"
date: 2026-02-05 18:00:00 +0000
categories: [Engineering]
tags: [Engineering]
image: /img/posts/latency-tail-p99.webp
---

很多人喜歡說：「我們 API latency 120ms。」

好，那是平均值？p50？哪一條路由？什麼 payload？在什麼流量形狀下？

你只要值過班（on-call）就會知道結論：**可靠性不是死在中位數，而是死在尾端（tail）。**

而尾端正是「平均延遲」最容易騙人的地方。

## Latency 是分佈，不是一個數字

延遲長得比較像一個分佈：
- 大多數請求很快
- 有一些偏慢
- 還有一小撮 *慢到讓人抓狂*

如果你只看中心（avg / p50），你其實是在說：「我只在乎常態。」

但使用者不會只活在常態。他們體感會被那一次最衰的卡住決定。

所以真的在乎可靠性的團隊，最後都會講 percentile：
- p95：95% 的請求都要比這個快
- p99：99% 的請求都要比這個快

p50 到 p99 的差距，才是系統真正的工程故事。

## Tail latency 不是「雜訊」

很多人把尾端當背景噪音。其實不是。

尾端通常是某些真實問題的表徵，例如：
- lock contention
- GC pause
- noisy neighbor
- cache 冷啟（cold cache）
- 下游依賴被打爆
- retry 把負載放大（最常見的死亡螺旋）

最煩的是：你可以維持一個看起來很健康的平均值，但 p99 其實在尖叫。

而 p99 會直接毀掉：
- 付款流程
- 登入體驗
- 「這 app 感覺很慢」的主觀評價
- 看起來漂亮但其實沒用的 SLO

## On-call 現實：你的 pager 基本上就是 p99 偵測器

使用者說「剛剛卡住 20 秒」，那絕對不是 p50 的問題。

那是尾端問題。

尾端難抓，是因為：
- 發生頻率低，小樣本根本看不到
- 可能只在流量尖峰才出現
- retry 會把它藏起來（請求表面上成功了，但系統被你毒死）

所以如果你的觀測只顯示 average，你就是在盲修。

## 如果我得負責把它做成可營運

如果你逼我把這東西做得「無聊但可靠」（我最愛這種），我會做四件事：

1) **按路由追 percentile**

不要只看一個「API latency」。最少要 route + method。

2) **拆開 server time 跟 network time**

不然你會怪錯層。

3) **把延遲跟飽和度綁在一起看**

CPU、記憶體、磁碟 IO、queue depth、連線池… 你瓶頸在哪就看哪。

4) **SLO 要引用 tail**

不要寫「平均 < 200ms」。要寫類似：「GET /foo 的 p99 < 800ms」。

就算一開始做不到，它也會逼你把對話拉回現實。

## 聽起來很簡單，但很多人沒做到

平均值適合做 dashboard。

尾端才是使用者真的會 *記住* 的體感。

想讓系統真的快，不是一直優化 happy path，而是一直去獵那條醜陋的尾巴，直到它不再咬人。

## References

- [Tail Latency（Jeff Dean 經典投影片/談話）](https://research.google/pubs/pub40801/)
- [Google SRE 書（SLO 與 latency 的基本功）](https://sre.google/books/)
