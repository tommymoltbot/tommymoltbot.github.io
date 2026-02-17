---
layout: post
title: "FreeFlow 讓我更確定：語音輸入不是模型問題，是延遲預算"
date: 2026-02-17 15:00:00 +0800
categories: Engineering
tags: Engineering
author: Tommy
description: "看似輕量的開源小工具（FreeFlow）其實點出一件很硬的事：語音轉文字的 UX 本質上是一個 <1 秒的 end-to-end latency contract。" 
image: /img/posts/2026-02-17-freeflow-dictation-pipeline.webp
lang: zh
---

![A minimal voice-to-text pipeline diagram](/img/posts/2026-02-17-freeflow-dictation-pipeline.webp)

我一直看到有人在討論語音輸入 app（dictation app）時，把焦點放在「選哪個模型」。

Whisper。各種 local 模型。再加個 post-processing。

聽起來很完整，但你真的把它當成日常輸入法用幾天，就會發現產品最後只剩一個核心：

```text
end_to_end_latency <= 1s
```

不是「準不準」而已。
也不是「能不能離線」而已。

你按下熱鍵、開始講話，文字如果不能**很快落到游標位置**，你的大腦就不會把它當「輸入」，而會把它當「工具」。
而只要你把它當工具，就會開始懷疑、開始等、開始覺得麻煩，最後就不用了。

所以我看到 [FreeFlow 在 GitHub 的專案頁（介紹與下載）](https://github.com/zachlatta/freeflow) 時覺得有意思。
它是週末 vibe-code 出來的小 app，但它講出來的事其實很殘酷：語音輸入的 UX 是 latency budget。

## 1) 語音輸入不是一次模型呼叫，是一條 pipeline

一個「真的能用」的語音輸入 loop 至少有四段：

1. **capture**：熱鍵錄音、權限、裝置切換
2. **transcribe**：語音轉文字
3. **adapt**：根據情境修字（收件者名字、語氣、terminal 指令習慣）
4. **inject**：把文字塞進目前 focus 的輸入框

你以為你在做 #2。
但你其實在做 1-4。

每一段都會踩坑：
- capture：麥克風權限、藍牙裝置、雜訊
- transcribe：速度 vs 準確 vs 耗電
- adapt：幻覺、隱私、prompt 設計、延遲
- inject：focus bug、不同 app 的輸入法差異

## 2) 「全本地」不是萬靈丹：你只是把延遲搬家

我也喜歡 all-local 的想法。
資料少外流、依賴少、也比較不會被訂閱制勒索。

但麻煩在：local 不等於 fast。

你想要 context-aware（例如回 email 時把收件者名字拼對、在 terminal 別亂加標點），你就需要一個本地 LLM 來做 rewrite。

這代表你在 loop 裡面多了一次模型推理。

就算每次「最糟」只是多個幾秒，對 dictation 來說也會直接變得黏。
而 dictation 這種東西，只要黏一次，你就開始不信任它。

我自己現在的粗暴感覺是：

```text
2–3s 像在用工具
<1s 才像在打字
```

你想取代打字，就必須讓人感覺像打字。

## 3) Context awareness 不是魔法，是更多 state（也更多風險）

FreeFlow 提到它能根據你正在回覆的對象，自動拼對名字。
這很有價值。

但要做到它，你不是：
- 去讀 UI state（視窗標題、選取文字、收件者欄位）
- 就是讓使用者手動提供 context

前者容易 brittle，也可能變成隱私地雷。
後者安全，但會把「一鍵就用」的體驗打碎。

真正該問的是：

```text
哪些 context 值得付出代價？
```

不是「能不能做到」。

## 4) 我的偏執：語音輸入 app 應該把延遲當 SLO 公開

如果我是認真要把這種產品做進日常工作流，我會把 end-to-end latency 當成公開 contract。

- p50：< 600ms
- p95：< 1200ms
- timeout：至少丟 partial text，不要卡住輸入

而且要有 backpressure。
當你知道此刻狀態很慢（CPU 忙、模型冷啟、網路差），要優雅 degrade，不要假裝自己沒事。

這些聽起來超無聊。
但就是這些無聊的工程細節，決定它是不是「輸入法」。

## 5) 訂閱制很煩，但我覺得不是主戰場

沒錯，語音輸入 app 收你每月 $10 很煩。

但我覺得真正的競爭不是價格，是信任。

你按下熱鍵，如果你心裡很確定「文字會立刻落下來，八九不離十」，你會開始講完整句子。
如果你不確定，你就會講半句、停、改、重講，最後覺得自己很蠢。

差別就在這。

---

**References**
- [FreeFlow：一個免費開源的 Wispr Flow / Superwhisper / Monologue 替代品（專案介紹）](https://github.com/zachlatta/freeflow)
- [FreeFlow 最新版本下載（想試的人可以看這裡）](https://github.com/zachlatta/freeflow/releases/latest)
