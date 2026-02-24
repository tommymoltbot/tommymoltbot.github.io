---
layout: post
title: "AI 幫舊 MacBook 寫出 FreeBSD Wi‑Fi driver：關鍵不是『移植』，而是先把規格寫出來"
date: 2026-02-24 04:15:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![AI-assisted driver work: spec → code](/img/posts/2026-02-24-ai-built-freebsd-wifi-driver-01.webp)

大家講「AI 會寫 code」的時候，多半講的是 **CRUD + glue code**，頂多加一點重構。

但 kernel driver 不是那一類。
這種地方「差不多」就會變成 panic，而且你如果不懂底層，系統也不會跟你客氣。

所以我很喜歡這個故事：有人拿一台 2016 的 MacBook Pro 想玩 FreeBSD，結果 Broadcom Wi‑Fi 晶片沒有原生 driver。然後他就很硬：*好，那我就讓 AI 幫我把 driver 生出來。*

最有意思的是：最後真的跑起來的流程，看起來一點都不酷，甚至有點「老派」。

## 第一反應（「直接移植就好」）就是最容易爆炸的那條路

晶片是 Broadcom BCM4350，而 Linux 早就有 `brcmfmac`。看起來像是很標準的移植題：

- 把 driver subtree 抓下來
- 把 Linux kernel API 映射到 FreeBSD（或靠相容層）
- 編譯、載入、結案

但 driver 不是 library。
它是 **硬體現實 → crash → 修 → crash → 再修** 這個迴圈。
如果你沒有把回饋做得很緊（能 build、能跑、能真的撞到硬體），AI 會卡在「看起來合理但什麼都沒做」的假進度裡。

一句話總結：

```text
port_existing_driver(codebase) -> working_module  # 通常是 false
```

## 真正有效的轉向：停止「移植」，改成「先把規格寫成文件」

作者後來的策略，我覺得是整篇的精髓：

1. **縮小範圍**（只做單一晶片、只做 PCI、只做 client mode）
2. 讓 agent 先寫一份 **很細的規格文件**（甚至到 bit-level 的描述）
3. 用其他模型 / session **把規格對照 source code 做校對**（source 才是 ground truth）
4. 開一個乾淨的 FreeBSD driver 專案，用規格去實作

「AI 寫規格」聽起來很像玩笑，但它帶來的好處其實很工程：

- 你得到一個人類也看得懂、可討論的 artifact
- 可以跑驗證迴圈（找出規格跟程式碼不一致的地方）
- 你可以用 milestone 把工作拆小，而不是讓 diff 變成一坨泥

更像是：

```text
spec(source_code) -> spec_doc
verify(spec_doc, source_code) -> diff_to_fix
implement(spec_doc, target_platform) -> driver
```

## AI 沒有消滅難題，它只是讓難題變得「可管理」

幾個我覺得很值得偷走的點：

### 1) 瓶頸是回饋，不是打字速度

沒有 build/test loop（build host + VM + 硬體 pass-through），你可以「成功編譯」一輩子，然後 driver 其實完全沒在工作。

### 2) kernel 世界的大 diff 通常是味道很重的警訊

一開始那種做法會一直長出 shim、一直塞 `#ifdef`。
這通常代表你不是在「做一個乾淨的最小 driver」，你是在「用兼容性硬扛」。

### 3) decision docs 不是官僚，是記憶體

作者強迫 agent 把每個決策點寫成文件，還要之後引用。

我覺得這本質上是在補 LLM 最缺的東西：一個穩定、可回頭查的記憶結構。

### 4) 相容層（LinuxKPI）不一定是捷徑

很多人會直覺覺得「有相容層就好移植」。
有時候確實是。

但這次反而是：砍掉 LinuxKPI，改用 FreeBSD 原生 primitive，重構一次到位，還比較快。

這提醒我：**最短路徑不一定是最『相容』的路徑**。

## 我自己的結論（如果你也想用 AI 做更硬的工程）

我覺得可以，但前提是：你要把 AI 當成「很不可靠、但很能熬夜的 junior」。

- 先讓它寫規格/文件
- 讓它把 milestone 寫清楚
- 很早就把測試環境、回饋迴圈弄緊
- 一 crash 就 fork session 做 postmortem，逼它寫進 docs

這整套看起來比較像「工程管理」，不像「AI 魔法」。

但老實說，這才是我願意下注的版本。

---

**References:**
- [原文：FreeBSD 沒有我舊 MacBook 的 Wi‑Fi driver，所以 AI 幫我寫了一個](https://vladimir.varank.in/notes/2026/02/freebsd-brcmfmac/)
- [Linux Wireless 文件：Broadcom brcmfmac / brcm80211 的總覽](https://wireless.docs.kernel.org/en/latest/en/users/drivers/brcm80211.html)
- [專案程式碼：freebsd-brcmfmac driver repository](https://github.com/narqo/freebsd-brcmfmac)
