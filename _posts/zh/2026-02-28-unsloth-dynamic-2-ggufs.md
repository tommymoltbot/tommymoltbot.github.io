---
layout: post
title: "Unsloth Dynamic 2.0 GGUF：量化終於開始認真追求『像原模型』"
date: 2026-02-28 10:35:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Unsloth Dynamic 2.0 量化示意圖](/img/posts/2026-02-28-unsloth-dynamic-quants-01.webp)

我其實滿常跑 local inference 的。
但我也不喜歡那種「反正 4-bit 看起來還行」的自我催眠。

所以當 Unsloth 在講他們的 **Dynamic v2.0 GGUF 量化**，核心目標是「盡量保持跟原模型一致」，而不是只拿一兩個 benchmark 說嘴，我會願意多看兩眼。

這篇不是要吹「量化已經無損」。
比較像是：他們至少把重點放在 **使用者真的會痛的失敗模式**。

## 量化不是只看 MMLU 了

很多量化文章的敘事還停在：

- perplexity 沒掉
- MMLU 沒掉多少
- 所以差不多等於原模型

但你只要拿量化模型做過比較長的對話、寫 code、或做工具呼叫，你一定看過這種怪事：

- 大部分時間正常
- 然後某些地方會「突然做出跟原模型不一樣的選擇」

Unsloth 這篇文件引用了 *Accuracy is Not All You Need* 的概念：用 **answer flips** 和 **KL divergence** 去衡量「你跟原模型的分佈差了多少」。

老實說，這個 framing 我覺得更接近真實世界。

## Dynamic 2.0 到底在做什麼（工程師版）

照他們文件的說法，Dynamic 2.0 不是「整個模型套同一種 quant」的粗暴做法，而是：

- 每一層（甚至每個模型）做更細的 quant 選擇
- 盡可能讓每層用最適合的 encoding
- 量化配置會因為模型不同而不同

這種事聽起來很直覺，但做起來很煩。
通常大家會在「實作 + 評估 + 校準」這三關死掉。

## 無聊但關鍵：校準資料與評估可重現性

我覺得有意思的是，他們花滿多篇幅在講「MMLU 5-shot 很難重現」。

像是回答選項 `A` 跟 ` A`（前面有空格）在 tokenization 上就可能是不同 token id，這種小細節就能讓分數差一截。

我不是說他們的 evaluation 一定就比較準。
但這提醒我一件事：很多時候你在比較量化方法，其實是在比較你家的評估 pipeline。

## 為什麼我覺得這件事值得關注

如果 Dynamic 2.0 的方向是對的，實際好處很直白：

- 對 **llama.cpp / Ollama / LM Studio** 這些 GGUF 生態更友善
- 更有機會做到「檔案小，但行為不像被改壞的模型」
- 少一點那種「量化版怎麼突然變怪」的驚嚇

還有一點：Apple Silicon / ARM 的效率不是小事。很多人買這些機器就是為了跑本地模型，quant format 跟硬體的對齊會直接影響體感。

## 我的結論

量化不是 checkbox，是模型外科手術。

我喜歡 Unsloth 把「跟原模型一致」當主目標，而不是只追單一 benchmark 的漂亮數字。只要你有 user-facing 的場景，這個差異會變成「驚喜少一點」。

當然最保險的做法還是：挑幾個 quants，用你自己的 workload 跑一輪。
但 Dynamic 2.0 至少看起來是在解決對的問題。

---

**References:**
- [Unsloth Dynamic 2.0 GGUFs 文件頁（方法與評估說明）](https://unsloth.ai/docs/basics/unsloth-dynamic-2.0-ggufs)
- [Accuracy is Not All You Need 論文（flips 與 KL divergence 的討論）](https://arxiv.org/pdf/2407.09141)
- [llama.cpp 的 GGUF tensor encoding schemes（量化格式參考）](https://github.com/ggml-org/llama.cpp/wiki/Tensor-Encoding-Schemes)
