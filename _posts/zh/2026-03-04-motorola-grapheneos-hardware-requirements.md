---
layout: post
title: "Motorola x GrapheneOS：最被低估的安全功能，其實是『可重新上鎖的 bootloader』"
date: 2026-03-04 07:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Motorola x GrapheneOS bootloader](/img/posts/2026-03-04-motorola-grapheneos-bootloader-01.webp)

有一種「安全合作」的新聞我通常看兩行就想滑走：

- 宣布合作
- 發個 badge
- 然後就沒有然後（你手上的那台手機，依然什麼都驗不了）

但這次我覺得值得多看一點。

GrapheneOS 說他們跟 Motorola 做了長期合作，未來會有符合 GrapheneOS 隱私/安全標準、並且提供 **官方 GrapheneOS 支援** 的裝置。

如果你沒玩過刷機，重點其實不在「GrapheneOS 支援」四個字，而是在底下那個很硬、很工程師的硬體要求：

- bootloader 必須 **可解鎖**
- 也必須 **可重新上鎖**
- 而且要支援 **使用者自帶 key（像 Pixel 那種）**，不是廠商幫你開關一下就叫安全

這三件事湊在一起，才有機會把「安全行銷」變成「你真的可以用自己的選擇去驗證」。

## 為什麼我在意『重新上鎖』

很多人把「解鎖 bootloader」當成終點。其實那只是起點。

解鎖讓你能刷入別的 OS；但 **重新上鎖** 才能讓你在開機階段重新拿回 *有意義的* verified boot——而且是針對你選的 OS，不是廠商出廠的 OS。

如果一台裝置的世界觀是：

- 鎖上 bootloader = 只能跑原廠系統
- 解鎖 bootloader = 什麼都能跑，但驗證鏈直接掰

那你就被迫二選一：

- 自由（能自己刷、自己 patch、自己換掉原廠 build）
- vs.
- 完整的開機完整性保證

「可重新上鎖 + 使用者 key」的意思更像是：

> 你可以跑你想跑的 OS，然後把它鎖回一個你可以依賴的 chain-of-trust。

這不只是 geek 玩具。它是一種 *即使你跟廠商關係變差、甚至廠商不再照顧這台機器*，還能保住的安全能力。

## 更細的重點：這不只是 GrapheneOS 的事

GrapheneOS 也提到，硬體會完整支援 **其他作業系統**，包含使用者自己編譯的 GrapheneOS。

這句話我很在意，因為它描述的是一個很務實的標準：

- 不是「我們支援一個被 bless 的替代映像檔」
- 而是「我們支援你擁有這台硬體的主控權」

老實說，最理想的手機安全體驗應該要很無聊：

- 你可以重刷
- 你可以驗證
- 你可以救回來
- 你也可以隨時離開

無聊反而是好事。

## 接下來我會盯什麼（通常就卡在這裡）

合作 headline 很容易寫，真正難的是落地的細節。

等到實際裝置出來，我會看這幾個「成敗關鍵」：

1. **刷入 GrapheneOS（或其他 OS）後，是否真的能用使用者 key 重新上鎖？**
2. **解鎖/上鎖流程有沒有文件，而且 firmware 更新後不會突然變成地雷？**
3. **Motorola 的安全更新節奏是否夠穩定？**
4. **會不會有奇怪的 anti-rollback 機制，搞到你測一次就變磚？**
5. **能不能不用從原廠映像檔抽 blob 也能 build**（GrapheneOS 暗示可能會以官方方式釋出 hardened 的 firmware/driver build）

這些如果都做到，那就不是「Motorola 支援 GrapheneOS」。

而是「終於有另一家廠商，把 verified boot 當成『使用者也能擁有的能力』」。

## 我的看法

手機安全圈子有很多很大聲、很會行銷的 feature：

- AI 隱私
- secure enclave
- military-grade encryption

但真的會改變你能不能掌控裝置的，常常是很安靜、很不性感的那個：

> 你可以刷你要的系統，然後鎖回去。

如果 Motorola 真的能把符合 GrapheneOS 標準的硬體做出來，並且長期維持這個標準，我覺得這是一個有份量的改變。

不是因為大家都會跑 GrapheneOS。

而是它把「裝置不該被困在單一廠商生命週期」這件事，往前推了一步。

---

**References:**
- [GrapheneOS 合作公告與 bootloader 要求討論串（Mastodon thread）](https://grapheneos.social/@GrapheneOS/116160393783585567)
- [GrapheneOS 引用的 Motorola 新聞稿（MWC 2026 B2B solutions）](https://motorolanews.com/motorola-three-new-b2b-solutions-at-mwc-2026/)
