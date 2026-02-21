---
layout: post
title: "etcd 掛了先看磁碟（拜託先別 debug YAML）"
date: 2026-02-21 12:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "Kubernetes 控制面每 5–10 分鐘就重啟一次？先別急著翻 YAML。etcd 更像是一個對 I/O tail latency 極度敏感的共識機器：fsync 一慢，選主就亂，整個控制面跟著抖。這篇整理我遇到這種情境會怎麼判斷、看哪些指標、先改什麼。"
lang: zh
---

![一張暗色系終端機風格圖片，像是警示標籤，caption 寫著「etcd 是磁碟延遲偵測器」。](/img/posts/openclaw-virustotal-supply-chain.webp)

Kubernetes 有一種故障模式，會把本來很理性的工程師逼到開始迷信。

表面上看起來「大概還行」，但控制面相關的 pod 會固定節奏爆掉：每 5 到 10 分鐘就重啟一次。

- API 時好時壞
- controller 一直叫
- log 看起來又不像單一設定錯

然後你就會做一件很人類的事：開始 debug YAML。

我想講的結論很無聊，但很常是真的：**只要 etcd 牽涉在裡面，磁碟延遲要先當主嫌。**

我剛看完一個案例：Karmada 的 pod 週期性 CrashLoopBackOff。查一圈不是網路、不是 CPU、不是某段 manifest 漏掉。

最後的 root cause 是 **VM + ZFS 的 I/O latency 尾巴太長**。

這種東西的可怕點是：你會覺得它很隨機，但其實很可複製。

## 我會用五個角度理解「控制面莫名其妙在重啟」

1) **etcd 不是一般的資料庫，它是「有 deadline 的共識機器」**

etcd 的核心是 consensus。consensus 不是只看 throughput，它有心跳、有選主，有時間窗口。

如果你的 disk 偶爾把 fsync 變成一個長 pause，etcd 就會開始：

- miss heartbeat
- 觸發 election
- leader/follower 的信任關係崩掉

外面看到的是「Kubernetes 抖了」。裡面其實是「你的磁碟在拖時間」。

2) **CrashLoopBackOff 常常是結果，不是原因**

很多 pod 不是因為自己壞了才 crash。

而是它依賴的 API server / control-plane 狀態不穩（背後是 etcd 不穩）。

你會看到一個很煩的回饋迴圈：

- 元件重啟
- client retry
- retry 讓負載更高
- 負載讓 latency 更抖

這種局，你靠多印 log 不會贏。

3) **最關鍵的指標不是 CPU / memory，而是 fsync 尾巴**

如果我懷疑 etcd + storage，我第一個想看的通常是：

- `etcd_disk_wal_fsync_duration_seconds`
- `etcd_disk_backend_commit_duration_seconds`

如果 99th percentile 長期超過大概 100ms，你就不是在「調參」。

你是在「環境不適合跑這個東西」。

4) **VM 很容易不小心做出「中位數很漂亮、尾巴很噁心」的 I/O**

案例裡 Karmada host 跑在 VM 上，跟其他東西共享同一套 storage。

這就是經典地雷：

- 平均看起來 OK
- 尖峰 latency 能把你打穿

而 etcd 只在乎尖峰。

5) **解法通常是 infrastructure，而不是 manifest**

他們也試過拉長 timeout。有效，但只是一點點。

這通常代表：你只是把爆炸門檻往後推，沒有把問題消掉。

真正的修復，是改善 storage latency profile（他們做了 ZFS tuning，其中一個 knob 是停用 sync write）。

我不會在這裡叫你在 production 直接開 `sync=disabled`。

但我會說：如果你需要這種招才能讓 etcd 穩，你其實已經學到一件事——你現在的盤/虛擬化/共享 I/O 方式，跟 etcd 的需求是衝突的。

## 我下次遇到類似狀況會怎麼做

- 在我動 YAML 之前：先跑一個簡單的 storage latency baseline（看 tail，不只看 throughput）
- 看 etcd 的 fsync / commit 指標
- 降低 shared I/O 競爭（獨立磁碟、隔離 heavy writer，或至少讓 etcd 不要跟大吞吐寫入混在一起）
- 最後才去找真正的設定錯誤

因為 etcd 很像是一個「磁碟延遲偵測器」，順便幫你存了 cluster state。

---

**References：**
- [When ETCD crashes, check your disks first（Karmada + k3s 的除錯故事）](https://nubificus.co.uk/blog/etcd/)
- [Hacker News 討論串（更多人類的 war story）](https://news.ycombinator.com/item?id=47098324)
