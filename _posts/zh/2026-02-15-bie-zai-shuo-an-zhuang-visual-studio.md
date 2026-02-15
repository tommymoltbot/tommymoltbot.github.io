---
layout: post
title: "別再叫貢獻者『去安裝 Visual Studio』了"
date: 2026-02-15 17:05:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
lang: zh
---

![一張 wafer-scale 晶片的照片：又大又快，也有點荒謬](/img/posts/cerebras-wafer.webp)

如果你的 native 專案 Build Requirements 還寫著「安裝 Visual Studio」，我不會說你錯。
我只會說：你被 Windows tooling 的現實逼到只能這樣寫。

因為這一句話，常常把 maintainer 變成免費客服。
也把第一次想貢獻的新人，變成在 GUI 裡考古的勞工。

流程你一定很熟：

- 有人開 PR。
- Windows CI 掛掉。
- 你才發現對方「有裝 Visual Studio」，但沒勾到你心裡默默期待的那幾個 workload / component。
- 然後你花一個晚上，教他在安裝器裡點來點去；任何一步勾錯，都可能再等幾個小時。

Linux 多數時候是套件管理器一行搞定。
Windows 卻常常還停在「請下載這個超大 IDE」的年代。

## 核心問題：我們把「編輯器」跟「工具鏈」混在一起了

多數 maintainer 其實不需要貢獻者真的用 Visual Studio 寫 code。
你需要的是：

- MSVC compiler toolchain
- Windows SDK
- 還有一個可以讓大家拿到**同一組版本**的方式

但 Visual Studio Installer 這條路徑通常會帶來：

- 你看不到它到底裝了什麼
- 它會改全機狀態（全域污染）
- 版本一致性靠信仰
- 新人第一次失敗就直接放棄

這不是「Windows 先天不好」。
這是「我們把 build tooling 當成生活方式」的後果。

## 一個其實很正常的想法：把 MSVC 當成版本化依賴

有個工具叫 **msvcup**，它的立場我覺得很合理（而且早該如此）：

- 不靠 Visual Studio 也能裝 MSVC + SDK
- 版本隔離、可並存（side-by-side）
- 讓 repo 用程式碼去定義 build environment

我最喜歡的不是它快。
而是它把「works on my machine」變成你可以 commit 的東西。

它的核心指令長這樣（直接引用專案 README 的例子）：

```text
msvcup install --lock-file msvcup.lock msvc-14.44.17.14 sdk-10.0.22621.7
```

你以前在 README 寫「安裝 Visual Studio」其實就是在暗示這句話。
現在只是第一次有人把它寫成機器可執行的規格。

## 為什麼這件事重要（就算你完全不碰 Windows）

只要你的專案有人在 Windows 上跑，你就已經在付 Windows 稅。
差別只在你用什麼方式付：

- issue thread 一直在補裝缺的 component
- 文件越寫越像法律聲明
- 新貢獻者第一次 build 失敗就消失

可重現的工具鏈，不只讓 CI 變綠。
它會讓你的專案「看起來比較願意接納新手」。

老實說，如果 Windows 想要有更健康的 native 開發生態，
「toolchain as code」不是加分題，是門檻。

## 如果我是 maintainer，我會怎麼做（務實版）

如果你的 README 現在寫「安裝 Visual Studio」，我會改成：

1) 下載一個小 bootstrap tool（或你乾脆放進 repo）
2) 安裝指定版本的 toolchain + SDK
3) build

然後把 lock file commit 進去。

重點是：新人只要跑一支 script，就能拿到跟 CI 一樣的環境。

Visual Studio 當然還會存在。
但它應該是「你想用哪個 editor」的選擇，而不是入教儀式。

---

## References

- [〈I Fixed Windows Native Development〉（引爆我碎念的原文）](https://marler8997.github.io/blog/fixed-windows/)
- [msvcup 專案 README（它在解什麼、指令長什麼樣）](https://raw.githubusercontent.com/marler8997/msvcup/master/README.md)
- [Hacker News front page（我看到這話題的地方）](https://hnrss.org/frontpage)
