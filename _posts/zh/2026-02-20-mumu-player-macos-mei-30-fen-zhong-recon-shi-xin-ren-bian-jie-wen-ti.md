---
layout: post
title: "MuMu Player 在 macOS 上跑 recon 指令：這是信任邊界問題"
date: 2026-02-20 07:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "一個 Android 模擬器在背景固定頻率跑系統偵察（process list、LAN 裝置、hosts、launchd 清單）不是『遙測』，而是踩過了信任邊界。正確的做法是把它當成不可信的基礎設施來隔離。"
lang: zh
---

![A dark, minimal illustration of a macOS laptop silhouette with a thin boundary line, and small system-command icons (ps, arp, sysctl) leaking across the line.](/img/posts/2026-02-20-mumu-macos-recon-01.webp)

我不會因為產品有 telemetry 就爆炸。

但我很討厭一種東西：它表面是工具，行為卻像在對我的 Mac 做 incident response。

今天看到一份整理，描述 MuMu Player Pro 在 macOS 上「只要模擬器在跑」，就會固定頻率執行一串系統偵察指令：列出區網裝置、dump 全部 process（還包含完整參數）、讀 hosts、盤點 launch agents / daemons…之類的。

就算你先把地緣政治放一邊，假設它只是「diagnostics」，工程上還是有一條很硬的線：

**一個 Android 模擬器，沒有資格拿到你整台 host 的剖面。**

這不是情緒。這是信任邊界（trust boundary）。

## 我用五個角度去想這件事

1) **邊界角度：** 模擬器本質是 guest workload。Guest workload 不應該能把 host 全地圖化。

2) **資料角度：** 「ps aux + 完整 args」這種東西，等於是替你把『不小心塞在命令列上的秘密』一次吸乾。你不用很粗心也可能中招。

3) **頻率角度：** 一次性的蒐集還能被解釋成「支援用」。每 30 分鐘跑一次，這就不是支援，是 instrumentation。

4) **誘因角度：** 只要你收集了，下一步就一定會有人想用。"We already have the data" 是 scope creep 最常見的起手式。

5) **操作者角度：** 就算廠商永遠不濫用，這些 log 也變成磁碟上一坨整理好的情報。對本地惡意程式來說，超香。

## 我會怎麼做（務實、無聊、但有效）

- **把它當不可信基礎設施。** 至少切一個獨立的 macOS 使用者帳號；理想上是獨立機器或 VM。
- **假設 host 才是產品。** 一旦它需要『你系統的一切』，它就不再只是工具，而是一個 host agent。
- **優先選合約更窄的替代品。** 最好的安全功能，是更小的 surface area。

我不是要大家恐慌。

我只是覺得開發工具的預設值，應該跟我們在 production 上的一樣：

**最小權限、明確介面、乾淨邊界。**

如果一個產品沒辦法清楚解釋為什麼它需要你的區網拓撲跟完整 process list，那它就不該跟你的 editor 同一個信任等級。

---

**References：**
- [Gist：整理 MuMu 在 macOS 上的週期性蒐集（指令與輸出檔案）](https://gist.github.com/interpiduser5/547d8a7baec436f24b7cce89dd4ae1ea)
