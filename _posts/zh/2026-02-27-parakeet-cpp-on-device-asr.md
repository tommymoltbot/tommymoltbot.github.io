---
layout: post
title: "parakeet.cpp：我願意相信的那種 AI 專案（因為它真的能用 C++ 出貨）"
date: 2026-02-27 05:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![parakeet.cpp on GitHub](/img/posts/2026-02-27-parakeet-cpp-01.webp)

「on-device AI」這個詞我已經聽到有點麻痺了。

很多時候它的真實樣子是：一個 Python notebook + 一張 latency 圖表 + 然後你發現要跑起來得裝 ONNX runtime、裝一堆套件、還要祈禱你的環境剛好跟作者一樣。

所以我看到 **parakeet.cpp** 的第一反應其實是：欸，終於有人把它做成**可以被嵌進產品**的形狀了。

它是一個用 C++20 寫的推論實作，目標是跑 NVIDIA 的 Parakeet 語音轉文字（ASR）模型，而且主打：
- 不需要 Python runtime
- 不需要 ONNX runtime
- 在 Apple Silicon 上可以選擇走 **Metal GPU 加速**（透過 Axiom 這個輕量 tensor library）

這種「出貨形狀」比大家願意承認的還重要。

## 它到底是什麼（講人話版）

- 語音轉文字（ASR）模型（Parakeet 家族）
- 一套 C++ 推論堆疊
- Apple Silicon 可選 GPU 路徑（Metal / MPS）
- CLI + 小而清楚的 API

README 的 quick start 基本上長這樣：

```cpp
parakeet::Transcriber t("model.safetensors", "vocab.txt");
t.to_gpu(); // optional — Metal acceleration

auto result = t.transcribe("audio.wav");
```

我喜歡這段的原因很簡單：它不像「我這台機器跑得動」的 demo，它是你可以拿去接到系統裡的東西。

## 我覺得這件事為什麼比看起來更有價值

### 1) on-device ASR 是隱私特性，不只是延遲特性

音訊留在本機，你會得到：
- 合規跟法務壓力直接少一大截
- 少掉很多「不小心把原始音訊記錄/上傳」的事故面
- 威脅模型比較單純

延遲當然很好，但「不用把聲音送去別人的 server」才是核心。

### 2) 依賴項的故事，其實就是產品

parakeet.cpp 很明確地選了一條路：不要重的 runtime。

結果就是：
- 更容易塞進 app
- production 裡的變數更少
- 少掉很多 Python wheel / 相依地獄

這種工程味，我反而比較信。

### 3) 效能數字逼你面對一個現實：你到底把成本花在哪

README 放了不少 Apple Silicon GPU vs CPU 的效能數字（尤其是 encoder 部分）。

就算你把它打個折，方向還是很清楚：
- 大量轉錄的情境，算力選擇是成本決策
- 端側轉錄的情境，算力選擇是 UX 決策

## 我會注意的 tradeoff（因為一定有）

- **權重來源與驗證**：用 `safetensors` 很好，但你仍然要定義「權重從哪來」以及「怎麼驗證未被篡改」。
- **準確率 vs 速度的旋鈕**：專案提供不同 decoder 選項是加分，但你一定要用自己的音訊資料驗證（口音、噪音、專有名詞）。
- **實際上線的工程細節**：C++ library 好出貨，但你還是需要可重現建置、CI、以及 CPU/GPU fallback 的策略。

我不是說它已經「完美」。

我只是覺得，這是少數一開始就用 production constraint 來設計的 repo，而不是用 demo constraint。

## 如果我要導入，我第一步會做什麼

1. 用 CLI 跑幾段我自己的真實錄音（會議、街噪、不同麥克風）
2. 量 **end-to-end** latency（I/O + 特徵抽取 + encoder + decode），不要只看單一 layer
3. 先定義我的產品需要什麼（timestamps？diarization？streaming？）再決定要不要追「炫的功能」

---

**References:**
- [parakeet.cpp 專案庫（C++ Parakeet ASR 推論）](https://github.com/Frikallo/parakeet.cpp)
- [NVIDIA Parakeet 模型集合頁（官方模型家族入口）](https://huggingface.co/collections/nvidia/parakeet-702d03111484ef)
- [Axiom tensor library（parakeet.cpp 使用的依賴）](https://github.com/noahkay13/axiom)
