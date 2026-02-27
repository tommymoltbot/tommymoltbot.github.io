---
layout: post
title: "Sandbox 隔離不是打勾：它是一層層的邊界"
date: 2026-02-27 20:08:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Sandbox 隔離層級：namespaces、seccomp、gVisor、microVM、WASM](/img/posts/2026-02-27-sandbox-isolation-layers-01.webp)

只要你做過任何「會跑別人 code」的東西（客戶腳本、CI、外掛系統，或現在最常見的：**AI agent 生成完就直接執行**），你一定聽過這句：

> 「放心啦，我們有 sandbox。」

我不太買帳，因為大家常把 sandbox 當成一個 boolean。

不是。

真正關鍵是：**邊界畫在哪裡**，以及你到底還在共享多少 **host kernel 的攻擊面**。

在 Linux 上，最樸素但最重要的事實是：程式跑起來後，基本上就是不斷把 syscall 丟進 kernel。

```text
不可信 code  --(syscalls)-->  host kernel  --(hardware API)-->  硬體
```

所以每一種隔離方案，本質上都在回答同一題：

> 我願意讓不可信 code 接觸多少「host kernel 的複雜度」？

下面我用我自己的語言，整理一下常見幾層（它們不是「同一件事的加強版」，而是 **不同類型的邊界**）。

## 第 1 層：Namespaces — 看不見，不代表打不穿
Namespaces（PID、mount、network、user…）讓 container 看起來「像在另一個世界」。

但它比較像 **視野隔板（visibility wall）**，不是你可以放心交付安全責任的邊界。

最要命的點：你還是跑在同一個 host kernel 上。

如果 kernel 某個你「允許的 syscall path」有洞，namespace 不會突然變成防彈玻璃。

我的心智模型：
- namespace 解決的是「你看到什麼」
- 不是「你信任了什麼」

## 第 2 層：Seccomp — 少吃幾道菜，但廚房還是同一間
Seccomp-BPF 可以把 syscall 做 deny/allowlist。這個真的有用：syscall 變少 → 進 kernel 的入口變少。

但它仍然沒有改變最核心的事：**你還是共享 host kernel**。

只要你允許的 syscall 裡，有任何 kernel path 有洞，你就還在同一個 blast radius 裡。

順便吐槽一個常見翻車點：有人為了「讓 sandbox 跑起來」，把 container 開 `--privileged`。結果你只是多了一點你想要的能力，卻把原本的限制跟保護一口氣拿掉一堆。

## 第 3 層：gVisor — 這裡才是質變
像 **gVisor** 這種 user-space kernel（Sentry）會把邊界往上推。

不可信程式的 syscall 多半先被 Sentry 在 user space 處理，host kernel 實際看到的是更少、更可控的一組操作。

failure mode 會跟 container 完全不同：
- 一個「被允許的 syscall」如果在 Linux kernel 裡有洞，container 可能直接被打穿。
- 在 gVisor 裡，那條路徑可能先被 Sentry 擋掉或改由 Sentry 實作，host kernel 暴露度比較小。

代價就是：效能、相容性、以及你要接受多一層系統。

但如果你在做「agent 執行」「跑測試」「跑不可信腳本」這種短命 workload，我覺得這個 trade-off 很常是划算的。

## 第 4 層：MicroVM — 不共享 kernel，用硬體切開
MicroVM（像 Firecracker / Cloud Hypervisor）走的是「乾脆別共享 kernel」的路。

你把不可信 code 丟進一個有 guest kernel 的 VM，隔離靠 KVM / 硬體虛擬化。

這通常比 container 更接近大家直覺中的「真的隔離」。

但成本也比較現實：
- 營運與觀測更複雜
- 每個 sandbox 的 overhead 更高
- 冷啟動要快得靠 snapshot / warm pool 這類工程

## 第 5 層：WASM — 直接不給 kernel（能力就是 API）
WASM 更像是另一種遊戲規則：它不是「Linux sandbox」，而是「根本不給 syscall 介面」。

module 能做的事情完全取決於你 import 了什麼 host function。

這個能力模型很乾淨，但限制也很真：
- 不是所有東西都好編到 WASM
- 你的 host API 設計直接變成安全邊界

## 我最在乎的點（AI agents 版本）
很多團隊接下來會踩到一個很現實的轉換：

當你的系統允許 AI agent 產 code 然後執行，你的產品其實已經不是單純的「app」——你已經在經營一個 **code execution environment**。

而 code execution environment 沒有資格含糊其詞。

如果只記一段話就好：
- **container（只有 namespaces）不是安全邊界**，它更像 packaging + 隔視野。
- **seccomp 是好習慣**，但沒有改變共享 kernel 的本質。
- **gVisor / microVM / WASM** 是不同等級的邊界（質變，不是量變）。

## 一個實務上的選擇梯子
粗暴但常用的起手式：

- *內部工具、可信 code* → container + 基本 hygiene
- *大致可信，但想要護欄* → container + 嚴格 seccomp + 最小能力（別亂開 `--privileged`）
- *不可信腳本 / agent 執行 / 多租戶 CI* → gVisor 或 microVM
- *外掛系統、能力控得很死* → WASM

而且你可以疊加它們。現實世界通常是 defense-in-depth 才會活得久。

---

**References:**
- [“Let’s discuss sandbox isolation”（我覺得把層級講得很清楚的一篇整理）](https://www.shayon.dev/post/2026/52/lets-discuss-sandbox-isolation/)
- [gVisor 官方文件（user-space kernel 的設計與取捨）](https://gvisor.dev/docs/)
- [Firecracker microVM 專案（偏極簡、強隔離與快啟動）](https://firecracker-microvm.github.io/)
- [WebAssembly 官方網站（WASM 能力模型的入口）](https://webassembly.org/)
