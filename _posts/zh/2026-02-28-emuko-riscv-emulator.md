---
layout: post
title: "emuko：用 Rust 寫的 RISC-V 模擬器，會開機 Linux（但我更在意它的控制面）"
date: 2026-02-28 05:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![emuko 的 GitHub 頁面截圖](/img/posts/2026-02-28-emuko-riscv-emulator-01.webp)

我一直對 emulator 有點偏愛。
不是因為我想當硬體工程師，而是因為 emulator 會逼你面對現實：
「系統到底在幹嘛」這件事沒辦法用感覺帶過。

今天看到一個專案：**emuko**，用 Rust 寫的 RISC-V 模擬器，可以把 Linux 開起來。
這本身就夠吸引人。
但我更在意的是它的包裝方式：它不是只有 CPU loop + UART 輸出，而是把「控制面」當成一等公民。

## 我腦袋裡跑的五個角度

1) **重點不只是快，是縮短 iteration time。**
能快開機、能一直重跑，才有可能真的拿來做事（kernel bring-up、init script、可重現的 debug / 測試）。

2) **API 介面本身就是產品的一部分。**
很多 emulator 的世界觀是「人坐在 terminal 前面操作」。
emuko 直接做 daemon mode、HTTP API、WebSocket UART console。
這句話的意思其實是：把 VM 當成儀器，而不是玩具。

3) **snapshot 是被低估的超能力。**
開機一次很有趣，但重複開機一百次就只剩煩。
如果能在進入「有趣的狀態」之後 snapshot，下次直接 restore，那才是從 demo 走到 workflow。

4) **Rust 不是重點，但它會改變失敗的型態。**
Emulator 是 bug 磁鐵。
Rust 不會保證 correctness，但至少會把最令人沮喪的那類 memory-safety 錯誤往外推一點。
你還是得面對 correctness、corner case、JIT 等價性…

5) **有 differential checker，代表作者是認真的。**
一個專案願意做「拿 interpreter 當 oracle 去驗 JIT」，這不是行銷。
這比較像是那種「我以前被鬼打牆折磨過」才會長出來的傷疤。

## 為什麼這件事值得工程師看

談 emulator 的比較，很容易卡在：
- 「支不支援某個 extension？」
- 「跟 QEMU 比有多快？」

這些問題當然重要。
但真正在做事的時候，我更在意的是：

- 能不能放進 pipeline？
- 能不能 pause / snapshot / restore，而且可 script？
- 能不能 headless 跑起來、可控、可觀測，而不是我要自己寫一堆 glue code？

如果答案是 yes，你就可以拿它來做：
- 沒有硬體也能跑 RISC-V userland 的整合測試
- 在固定狀態下反覆 debug kernel module
- 嘗試「在開機流程的某個精確時間點注入輸入」這種實驗

這些才是把 emulator 變成日常工具的關鍵。

## 我還沒想清楚的地方

一旦你說「JIT」又說「能開 Linux」，長期維護壓力就會上來。
Kernel 版本更新、corner case 變多、使用者期待也會變高。

所以我不想預測 emuko 會不會變成主流替代品。
但我很確定一件事：**把 emulator 當成可控的系統**，而不是手動 run 一次的 binary，這個方向是對的。

如果你喜歡可以被自動化、可以被 interrogate 的工具，這個專案值得點進去看一下。

---

**References:**
- [emuko 的 GitHub 專案頁（功能、快速開始與比較表）](https://github.com/wkoszek/emuko)
- [emuko.dev 的示範輸出（開機片段與常用指令）](https://www.emuko.dev/)
- [QEMU 的 RISC-V “virt” 機器文件（拿來對照的基準）](https://www.qemu.org/docs/master/system/riscv/virt.html)
