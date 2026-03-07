---
layout: post
title: "Kula：我喜歡這種「很無聊」的自架監控工具"
date: 2026-03-07 07:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Kula 伺服器監控儀表板](/img/posts/2026-03-07-kula-self-hosted-monitoring-01.webp)

大部分「監控」的討論都會卡在同一個點：*「好，那 metrics 要放哪？」*  
然後你選 Prometheus、再選 Grafana、再想遠端儲存、再把 alerting 補起來……最後你就會發現，監控本身變成一個小專案。

所以我看到 **Kula** 這種主打：**單一 binary、零外部依賴、磁碟用量可預期** 的工具，我的第一反應是：

- 不是玩具
- 就是作者跟我一樣，受夠了「為了看 CPU/RAM 結果要養一整套 stack」

從設計上看，Kula 很刻意地想維持「很無聊」：

- 每秒從 Linux 的 **`/proc`** / **`/sys`** 直接讀系統指標
- 寫進 **分層 ring-buffer**（固定大小檔案，寫滿就覆蓋最舊的）
- 同時提供 **Web UI**（REST + WebSocket）跟 **終端機 TUI**

它不是要當「觀測性平台」，它比較像是：你把它丟上去，它就安靜地把你想看的東西留一段時間。

## 我最喜歡的點：磁碟空間是可控的

Kula 的 storage engine 核心邏輯其實很直白：

- 先把檔案預先配置好
- 一直寫
- 寫滿就循環覆蓋

這對小型環境（homelab / 幾台 VPS / side project）超實用。

如果你的需求其實是：
- 「想知道剛剛到底發生什麼事」
- 「想看最近幾小時到幾天的趨勢」
- 「不想把監控也變成要顧的系統」

那 bounded retention 根本不是缺點，是 feature。

而且它很誠實：逼你面對你真正需要的多半是「近期訊號」，不是無限保存。

## 我會有點擔心的點：不要長歪

每個監控工具一開始都很乾淨。

但很快就會有人開始問：
- 「能不能加自訂 metrics？」
- 「能不能做 service 維度？」
- 「能不能順便上 tracing？」

然後你就開始重造一半的平台。

Kula 目前看起來是有選好它的跑道：host-level 指標 + 一個像樣的 UI，就到此為止。如果它能維持這個紀律，它就會一直有價值。

## 如果要快速理解它，先看這些 API 介面就夠了

Kula 的 Web backend 有提供像這樣的 endpoints：

```text
GET /api/current
GET /api/history
GET /api/config
WS  /ws
```

基本上就是「即時資料 + 歷史資料 + live stream」。你想要放在 reverse proxy 後面，也有很清楚的切入點。

## 我的結論

我不會跟你說「把你現有的監控 stack 全換掉」。如果你已經在 Prometheus 生態裡面，而且穩定跑著，那就好好的。

但如果你是：
- 自己的 homelab
- 幾台 VPS
- 不想 babysit 的 side project

那這種 **單一 binary + 磁碟用量可預期** 的工具，我反而比較信。

因為它設計時問的問題，跟我真正在乎的問題是一樣的：

> 「三個月後它還會不會默默跑著，不要吵我？」

---

**References:**
- [Kula 專案 GitHub（README、功能、安裝方式）](https://github.com/c0m4r/kula)
- [Hacker News 討論串：Kula – Lightweight, self-contained Linux server monitoring tool](https://news.ycombinator.com/item?id=47282807)
