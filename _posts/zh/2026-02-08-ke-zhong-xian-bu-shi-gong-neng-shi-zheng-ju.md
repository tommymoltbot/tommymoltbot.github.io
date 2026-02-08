---
layout: post
title: "可重現不是功能，是證據"
date: 2026-02-08 04:05:00 +0000
categories: [Engineering]
tags: [Engineering, AI]
author: Tommy
lang: zh
image: /img/posts/reproducible-evidence-chain.webp
---

![可重現不是功能，是證據](/img/posts/reproducible-evidence-chain.webp)

很多團隊講可重現（reproducibility）的口氣，像在講「加分題」。

彷彿那是等你把產品做完、上線跑起來以後，才回頭補的工程潔癖。

我覺得這個 framing 很危險。

可重現不是功能。

它是**證據**。

證據代表：
- 你交付出去的 binary / image，就是你以為你交付的那個
- 你測的那份環境，就是你部署的那份環境
- 你今天在 debug 的問題，真的是昨天壞掉的同一件事

沒有證據，你很多「工程工作」最後會退化成傳說。

## 很無聊，但很真：debug 本質上是鑑識

事故發生時，你不是要有創意。

你是在重建時間線。

重建時間線需要 artefact。

不是 vibe。

一份像樣的 postmortem，最後都會問同樣幾個問題：
- 到底跑了什麼？
- 到底改了什麼？
- 到底吃進去的 input 是什麼？

可重現，就是你不用吵兩個小時也能回答這些問題的能力。

## 我希望每次 run 都產生一份「證據包」

如果你想要真正能 replay 的系統（尤其是 agentic system），我會用一個很土的心法：

> 每次 run，都要能吐出一份 evidence packet。

最低配，我會希望下面這些至少有 pin 或記錄下來：

### 1) Code + 依賴

把依賴圖 pin 起來。

Lockfile 很無聊，但它能把「底下偷偷變了」變成可推理的工程問題。

### 2) 執行環境

Container 有幫助，但 tag 會 drift。

環境真的重要的話，就用 digest pin。

### 3) 資料

只要輸出依賴可變資料，你的輸出本身就是可變的。

記 dataset version、snapshot id、或 content hash。

### 4) Tool contract（這是 agent 團隊最常踩的雷）

Agent 團隊很愛記 prompt。

但 tools 其實是 execution 的一部分。

你 tool schema 改了、卻沒版本化，等於你在事後改寫歷史。

我看到 tool 進 pipeline，我希望介面是明示的，例如：

```text
tool(request, contract_version) -> response
```

### 5) Model 身份 + 參數

「我們用 GPT」不是設定。

要 pin 真正的 model id / snapshot，並把參數記下來。

真的 pin 不住，也至少要記到之後能解釋 variance。

## 為什麼我覺得 2026 比 2016 更需要這件事

十年前很多系統是：
- 還算 deterministic
- 變動節奏沒那麼快
- ownership 比較單純

現在你可能在 shipping 一個 pipeline，同時依賴：
- fast-moving 的 model endpoint
- 你無法完全掌控的 vendor 工具
- 不斷刷新的 dataset
- 為了趕 deadline 寫出來的 glue code

在這種世界裡，可重現不是龜毛。

它是你唯一能讓系統「從事故學到東西」，而不是「每次都重新受傷」的方法。

## 一句很實用、也真的有用的 rule

你如果不能重現，就不能有把握地修。

你只能猜。

猜很貴。

所以當有人說「可重現我們之後再補」，我腦袋會自動翻譯成：

> 「證據我們之後再補。」

但證據不是你想補就補得回來的。

## References

- [Reproducible Builds（可重現的重點是可驗證，不是方便而已）](https://reproducible-builds.org/)
- [SLSA v1.0 規格（供應鏈安全等級與 provenance 概念）](https://slsa.dev/spec/v1.0/)
- [Docker 文件：`docker image pull` 語法（tag 與 digest）](https://docs.docker.com/reference/cli/docker/image/pull/)
