---
layout: post
title: "NetBSD 也在做 jails：我反而喜歡它那種『不要變成 container 平台』的態度"
date: 2026-03-05 12:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![NetBSD jails 架構示意](/img/posts/2026-03-05-netbsd-jails-01.webp)

Linux container 會贏，很大一部分是因為它把「生態系」打包賣出去了，不只是因為底層概念多漂亮。
但我今天看 **Jails for NetBSD** 的感覺反而是：這東西很努力在避免自己變成另一個生態系。

它是一個（還在 technology preview）把 jail 模型做進 NetBSD 的原型，核心賣點其實很窄：

- kernel level 的 process isolation
- host 端可見的 supervision 模型
- 一套很小的工具鏈（`jailctl`、`jailmgr`）
- snapshot-based 的監控指標
- 更重要的是：**不做 OCI runtime、不做 image distribution、不做 orchestration control plane**

最後那條，才是我覺得有意思的地方。

## 我真正在乎的是：操作面（operational surface area）到底多大

我看過太多「container 平台」的典型演化路徑：

- 你一開始只是要隔離（namespaces/cgroups）
- 然後加 runtime
- 然後加 daemon
- 然後加 control plane
- 然後再加五層『for production』
- 半年後整個團隊沒人講得清楚：出 bug 的時候到底是哪一層在背鍋

所以當一個專案直接說「我們不是要做 container ecosystem」，我第一反應其實是：*好。*
不是因為生態系不好，而是因為 **大多數團隊根本沒有那個注意力預算去理解整個堆疊**。

Jails for NetBSD 的態度有點像：

- host 依然是主角
- process 在 host 上仍然可見
- lifecycle 操作要明確
- 監控要無聊、可預期

這種「boring technology」的 vibe，我其實更信。

## Host-visible supervision 是個被低估的設計

它有個細節我滿喜歡：在 supervise mode 下，host 會有一個 parent process 管住 jail 裡的 workload。
從 host 的視角，你還是看得到正常的 process tree；但進到 jail 裡，只能看到自己 jail 的 processes。

這種預設很健康。

很多 container tooling 的副作用是：它會讓你忘記底下其實還是一台 OS。
當 host 的視角還是 first-class，你比較不容易養出那種「只有 platform team 才能看得到現實」的文化。

## 網路模型很有立場（但我覺得可以接受）

這個設計是「共享 host network stack」，然後用「port reservation」來避免衝突。
如果你期待的是「NetBSD 版 Kubernetes」，那當然會失望。

但我大概能理解：host-centric 的 routing / firewall 最直觀，
而且 network 的複雜度通常最後還是會漏到你臉上。

至於更強的隔離（資源硬切、更多虛擬網路模型），它也很坦白：那你就用 virtualization（例如 Xen）。
我不一定喜歡這個答案，但至少它沒有假裝自己什麼都能解。

## 我的結論：我寧願要一個小而清楚的 jail 工具，而不是又一個迷你 Kubernetes

這不代表 NetBSD 明天就會翻身。
但它提醒我：市場其實還是需要 **小、緊、可檢查（inspectable）的系統 primitive**。

如果你的目標是：在單機上跑幾個隔離的 workload、工具鏈別爆炸、ops 也能 debug，
那這個專案的方向我覺得很對。

至於它能不能 upstream、會不會有人在乎，我不敢說。
但身為一個有點看膩「堆疊長得比理解還快」的人，我會希望它至少活到被好好討論。

---

**References:**
- [Jails for NetBSD 專案頁（overview / architecture / getting started）](https://netbsd-jails.petermann-digital.de/)
- [NetBSD jails feature branch（GitHub source tree）](https://github.com/MatthiasPetermann/netbsd-src/tree/feature/netbsd-11-jails)
- [Hacker News 討論串](https://news.ycombinator.com/item?id=47258641)
