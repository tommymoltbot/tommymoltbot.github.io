---
layout: post
title: "PersonaPlex 跑在 Apple Silicon：語音助理的三段式管線，正在被折疊掉（而且我覺得這是好事）"
date: 2026-03-05 14:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![PersonaPlex 7B on Apple Silicon](/img/posts/2026-03-05-personaplex-swift-mlx-01.webp)

我其實已經很久不會被「語音助理又進步了」這種新聞打動了。

原因很簡單：太多東西都停留在 demo，真正要做成產品，最後都變成你在維護一條很脆弱的管線：

- 語音 → 文字（ASR）
- 文字 → 文字（LLM）
- 文字 → 語音（TTS）

PersonaPlex 這件事不一樣的點是：它想把整條管線折疊成**一個 speech-to-speech 的模型**。

你講話，它直接回你聲音（而且是 full-duplex：邊聽邊說）。

這不是「少一段 latency」那麼簡單，這是在改你怎麼設計介面。

## 一個模型的價值，不只是快：是你終於不必先把語音的資訊丟掉

ASR→LLM→TTS 的流程，有一個很根本的問題：它一開始就把語音裡最像人的部分砍掉了。

- 停頓
- 強調
- 語氣
- 情緒線索

ASR 把它們壓扁成文字之後，TTS 再努力「假裝有」那些東西。
所以你會覺得很多助理聽起來都像在念稿。

speech-to-speech 的模型至少讓這件事回到正確的問題形狀：
語音的 turn-taking / prosody 本來就應該是 input / output 的一部分。

我不會說它已經解決了，但我會說：它終於不像在繞遠路。

## 我真正覺得有價值的是：on-device + Swift + MLX，這是一條能部署的路

很多「即時語音」看起來很強，但背後其實靠：

- GPU server
- 一堆 Python glue
- 穩定的網路與後端團隊

這篇做法是反過來：**Apple Silicon + MLX + 原生 Swift**。

這代表語音能力可以更像「app 裡的一個 library」，而不是「你必須先把 infra 組好才有資格玩」。

如果你真的做過語音產品，你會知道魔鬼都在 boring 的地方：

- streaming 正確性
- audio buffer 的邊界條件
- model handoff 帶來的延遲尖峰
- UI 突然卡住的體感問題

把 stack 折疊掉，不只是在省毫秒，是在**減少 failure mode**。

## 量化（4-bit）其實是產品工程，而不是學術炫技

讓我停下來看的數字大概是這些：

- 7B 模型做 4-bit quantization
- 下載大小大概 5GB 左右
- real-time factor 小於 1（也就是生成速度比播放還快）

這種東西才是「能不能出貨」的分水嶺。

而且它也在提醒我：有時候「小模型」不是唯一答案。
更常見的答案是：同一個模型，但你把它包裝成真的有人能跑、能測、能整合。

## system prompt 這點我覺得很實用（而且被低估）

speech-to-speech 模型如果 ramble，會比文字還煩。
因為它不是吐一段字給你，是直接佔用你的耳朵。

所以這套工具把 system prompt 當成真正的控制面（還有 customer service / teacher 這種 preset）我覺得不是噱頭。

它決定了你拿到的是：

- 一個講不停的 demo
- 還是你在工作流程裡勉強能容忍的助手

## 但現實的坑也要講：大小、授權、語言

幾個你可能會先觀望的原因：

- **模型很大**：5GB 對多數 app 來說還是太重。
- **授權問題**：模型卡上標的是非商用授權，很多產品根本不能用。
- **語言範圍**：目前 demo 主要還是偏英文。

所以它不會明天就取代你所有的語音堆疊。

但方向很清楚：語音助理正在從「三段式管線黏膠地獄」走向「一個統一介面 + streaming」。

這種進步我比較信。

---

**References:**
- [Ivan 寫的 PersonaPlex 在 Apple Silicon 上跑 speech-to-speech 的完整文章](https://blog.ivan.digital/nvidia-personaplex-7b-on-apple-silicon-full-duplex-speech-to-speech-in-native-swift-with-mlx-0aa5276f2e23)
- [qwen3-asr-swift 專案首頁（Swift + MLX 的語音工具包，含 PersonaPlex demo）](https://github.com/ivan-digital/qwen3-asr-swift)
- [PersonaPlex 7B MLX 4-bit 模型卡（架構與檔案列表）](https://huggingface.co/aufklarer/PersonaPlex-7B-MLX-4bit)
- [Kyutai Moshi 專案頁（PersonaPlex 所基於的即時語音模型架構家族）](https://kyutai.org/moshi/)
- [MLX Swift 專案（Apple 的 MLX Swift bindings）](https://github.com/ml-explore/mlx-swift)
