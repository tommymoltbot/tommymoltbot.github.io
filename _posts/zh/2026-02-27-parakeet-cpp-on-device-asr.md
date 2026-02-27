---
layout: post
title: "parakeet.cpp：我開始覺得『原生推論』會回來了"
date: 2026-02-27 11:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![parakeet.cpp on-device ASR](/img/posts/2026-02-27-parakeet-cpp-on-device-asr-01.webp)

最近我越來越常看到一種現象：大家嘴上說要「AI 功能」，但真的買單的通常是那種 **很無聊、很務實、延遲夠低** 的能力。

語音辨識就是典型。

所以我看到 *parakeet.cpp* 的時候有點被戳到：這是一個把 NVIDIA 的 Parakeet 語音辨識模型搬到 **純 C++** 裡跑的專案，macOS / Apple Silicon 還能直接吃 Metal GPU，加速是靠它自己的張量庫 Axiom。

重點其實不是「又一個模型」。重點是：**原生推論（native inference）好像真的開始變得可行**，而且做的人是在替「部署」而不是替「demo」在優化。

## 這個專案有意思的地方

大多數 ML 專案卡死不是因為模型不 work，而是卡在「那你要怎麼上線」：
- Python 版本地獄
- 一堆二進位輪子
- ONNX runtime（看情況）
- GPU 驅動各種玄學
- latency 抖一下就沒人知道為什麼

*parakeet.cpp* 走的是完全相反路線：**一個原生 codebase，依賴極少**，而且很明顯是以 on-device 的速度當第一優先。

從 README 看起來，它的 high-level API 幾乎就是：

```text
parakeet::Transcriber(model_path, vocab_path)
Transcriber::to_gpu() -> void
Transcriber::transcribe(wav_path) -> Transcript
```

這種 API 你才有機會真的塞進產品裡。

## Metal + unified memory：這點其實很關鍵

如果你以前在 macOS 上玩過「GPU 加速」，你大概知道很多時候真正的成本不是算力，而是 CPU/GPU 之間一直在 memcpy。

Axiom 很用力地吃 Apple Silicon 的 unified memory 特性：CPU tensor / GPU tensor 的切換有機會只是一個 *device tag* 的變化，而不是搬資料。

這不是什麼魔法，但對低延遲的 on-device pipeline 來說，這種設計就是差很多。

## 我覺得它反映了一個更大的趨勢

我不覺得大家都會突然開始用 C++ 重寫推論。

但我覺得越來越多團隊會開始問一個很直白的問題：

> 「這個功能真的需要打到 server 嗎？」

以 ASR 來說，本地推論能換到的東西很難用 PR 話術替代：
- **延遲**：能 streaming 的轉錄，體驗上是完全不同產品。
- **隱私**：你可以很硬地說「音訊不離開裝置」。
- **成本**：沒有 per-minute 稅。

而且一旦你把 ASR 做成本地，你就會想順便把後面那串也做掉：diarization、keyword spotting、甚至 local intent routing。

## 我還是保留的地方

這條路也不是沒坑，至少兩個會直接把它打爆：

1) **記憶體壓力**。模型不是小東西，「能在我 M3 Pro 跑」跟「能在一般用戶 8GB、Chrome 開 37 個分頁時跑」是兩回事。

2) **準確度 vs. 方便性**。runtime 做得乾淨會讓部署簡單很多，但它不會自動解決「到底準不準」的問題，尤其是多語言跟嘈雜麥克風環境。

但方向我覺得是對的。

看到這種專案，我的解讀是：我們可能正從「LLM everywhere」慢慢回到「選對模型，然後把 runtime 工程做到極致」。老實說，軟體本來就應該這樣。

---

**References:**
- [parakeet.cpp 專案（C++ 跑 Parakeet ASR + Metal 加速）](https://github.com/Frikallo/parakeet.cpp)
- [Axiom 張量庫（C++ tensors + Metal + unified memory）](https://github.com/Frikallo/axiom)
- [Hacker News 討論串（關於部署與延遲的留言）](https://news.ycombinator.com/item?id=47176239)
- [Hugging Face 的 NVIDIA Parakeet 模型卡（例：parakeet-ctc-0.6b）](https://huggingface.co/nvidia/parakeet-ctc-0.6b)
