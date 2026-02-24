---
layout: post
title: "把 VLM 跑在 Jetson 上：那些看起來很無聊、但決定能不能活的參數"
date: 2026-02-24 00:12:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Jetson VLM 部署](/img/posts/2026-02-24-vlm-on-jetson-01.webp)

我其實不缺 VLM demo 可以看。真正缺的是：

你要怎麼把 vision-language model 放到 edge 盒子上跑，然後它不會動不動就 OOM、卡死、或把你整個週末吃掉？

Hugging Face 剛出了一篇滿務實的教學：用 **vLLM** 在 Jetson 家族上部署 NVIDIA 的 **Cosmos Reasoning 2B**，再接到一個 webcam 互動介面（Live VLM WebUI）。如果你以前試過把多模態 inference 塞進受限的硬體，你會懂這種文章的價值：它講的不是「看起來很酷」，而是「怎樣才會真的跑得起來」。

我最喜歡的一點是：他們沒有假裝「Jetson 都一樣」。

## 真正的主題其實是：限制條件

在簡報上，「serve 一個模型」好像一句話。

現實是，你的設定就是在跟 memory / throughput 討價還價。

他們把流程拆成三個 profile：

- **AGX Thor / AGX Orin**：資源比較夠，context 可以開到他們示範的 **8192 tokens**，設定也比較正常。
- **Orin Super Nano**：直接進入省錢模式，示範的 **max context 是 256 tokens**，而且要帶一堆「求你先活下來」的 flags。

這種東西通常不會出現在行銷文裡，但我覺得這才是 edge AI 的日常。

## 那些「真的有差」的 flags（以及它們為什麼存在）

Orin Super Nano 的那段設定，本質上就是一份：模型太大、機器太小時，你該做什麼的 checklist。

幾個我會記下來的模式：

- 先把 context / batching 限死，避免 worst-case 記憶體爆炸。
- GPU memory utilization 留 headroom，不要把系統逼到臨界點。
- 單序列（一次一個 request）其實很常是唯一能穩定起步的方法。

他們示範的 vLLM serve 大概長這樣：

```text
vllm serve /models/cosmos-reason2-2b \
  --max-model-len 256 \
  --max-num-batched-tokens 256 \
  --gpu-memory-utilization 0.65 \
  --max-num-seqs 1 \
  --enable-chunked-prefill
```

你可以調參，但這個方向是對的：**先把 worst case 壓住，能穩定跑再談其他。**

## WebUI 不只是 demo，它其實是 debug 工具

我也滿喜歡他們接了一個 live webcam UI。不是因為「哇 webcam」，而是它會逼你面對：

- 人類感覺得到的 latency
- frame cadence（你是不是在用 frame 把 inference loop 灌爆？）
- 你到底該回多長（短一點常常比較能用）

也就是說：它把 serving 拉回到「應用層」。

## 我的結論

Edge 多模態會越來越普遍，但短期內不會是「裝個套件就好了」。

如果你在試 VLM + embedded / edge，建議直接照這個心法：

- 一開始用最保守、最醜的設定
- 先把 loop 跑穩
- 再慢慢往品質與吞吐量推

不然那種「很酷但 90 秒後必崩」的 demo，真的很消耗士氣。

---

**References:**
- [Hugging Face 教學：在 Jetson 上部署開源 Vision Language Models（VLM）](https://huggingface.co/blog/nvidia/cosmos-on-jetson)
- [vLLM 專案官網（模型 serving 引擎與 API）](https://vllm.ai/)
- [Live VLM WebUI 原始碼（把 webcam 串到 VLM endpoint 的介面）](https://github.com/NVIDIA-AI-IOT/live-vlm-webui)
