---
layout: post
title: "Monty：給 agent 用的安全 Python 解譯器（以及為什麼 tool calling 不是全部）"
date: 2026-02-07 02:01:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Monty 安全 Python 解譯器](/img/posts/2026-02-07-monty-secure-python-interpreter-01.webp)

我最近一直在碎念一件事：**agent 變可靠不是靠 prompt tweak**，而是靠你把介面做成「可驗證」的樣子：合約、schema、重播、回歸測試。

所以看到 **Monty**（Rust 寫的極簡 Python 解譯器，目標是跑 LLM 寫的程式碼、又不要整套 container sandbox）時，我不太把它當「又一個 sandbox」。我把它當成對一個很現實的 production 問題的回答：

> 你要給 agent 一個真正能跑的 execution surface，但又不能把整台機器交出去。

Monty 的賭注是：*不要跑 host*，跑一個小解譯器；然後把所有「碰到外部世界」的能力，都收斂成你控制的外部函式。

## 1) 為什麼需要這種東西：啟動延遲其實是產品需求

用 container 跑程式碼是最直覺的路，但它的稅很高：

- cold start 延遲（幾百 ms 很常見），
- 維運複雜度（image、CVE、seccomp/AppArmor、mount 規則），
- 做小事也要背整套（解析 JSON、排序候選、做字串轉換）。

Monty 主打的是「微秒級」啟動時間，換來的是一個受限的 Python 子集合。

如果你做的 agent 需要反覆迭代：plan → run → 看結果 → 再 run，延遲不是錦上添花，是能不能用的分水嶺。

## 2) 我覺得最重要的是邊界：外部世界只能透過 external functions

我喜歡的是它的 boundary 設計：

- 預設沒有 filesystem，
- 沒有環境變數，
- 沒有網路。

要碰這些，得經過你實作的 *external function call*。

這聽起來很像 tool calling，但形狀更硬：agent 寫 Python，解譯器跑到呼叫邊界就停下來，host 決定要不要放行、回什麼結果。

如果要我用一個介面把它說完，大概是這樣：

```text
external_call(name, args) -> approved_result | denied
```

你可以 log、可以 rate limit、可以要求 schema、可以做版本管理、可以 replay。

而且 Monty 還主打 **snapshot / resume**：跑到外部呼叫停住時把 state 序列化起來，之後再恢復。

這對「多步驟但你不想自己寫一堆狀態機」的 agent 其實很實用。

## 3) 它不是要「跑任意 Python」

Monty 刻意限制功能：std lib 不完整、不能用第三方套件、語言特性也還缺。

這不是缺陷，是安全模型。

真正該問的不是「能不能跑全部」，而是：

- 能不能跑到足夠讓 agent 表達意圖，
- 同時把 host 邊界做得清楚，
- 並且把成本（時間/資源）變得可預期。

在 production，我反而覺得 **更小的語言表面** 是優點：角落少一點，就少一點意外。

## 4) 仍然可能翻車：你不設計介面，agent 會自己設計

即使解譯器很安全，你還是可能把系統做成「很快地跑出錯誤的東西」。

我第一時間會預期兩個失敗模式：

1) **agent 會學會鑽邊界**：你暴露什麼函式簽名，它就把程式碼扭成那個形狀。
2) **Denied 變成隱藏分支**：拿不到東西時，如果你沒設計清楚，它會開始幻想 workaround。

解法也不是「再寫一段 prompt」，而是產品衛生：

- 緊而 typed 的函式簽名，
- 結構化錯誤（讓 agent 可以判斷、而不是亂猜），
- 一套「壞要求」的測試集（像 prompt injection 那種嘗試）必須永遠失敗。

不然 Monty 只是讓你更快地做危險的事情。

## 5) 我在意的是：agent 需要 compute substrate，不只是工具

這裡有個微妙的差別。

Tool calling 其實是假設 model 是 orchestrator：什麼時候 call tool、call 哪個 tool，主要靠 model。

受限解譯器的思路是：**讓 agent 寫一段程式**，然後 host 提供一組受控的「syscall」。

人類的可靠系統就是這樣建出來的。我猜 agent 的可靠系統最後也會長得像這樣。

不是因為 Python 很神。

而是因為「有邊界的 execution」會給你 prompt 永遠給不了的東西：一個可以量測、可以測試、可以強制執行的 surface。

---

**References：**
- [Monty 專案：Rust 寫的極簡、安全 Python 解譯器（給 AI 用）](https://github.com/pydantic/monty)
