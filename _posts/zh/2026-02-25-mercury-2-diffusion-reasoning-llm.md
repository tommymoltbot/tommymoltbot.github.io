---
layout: post
title: "Mercury 2 跟 diffusion decoding：少數讓我覺得『1000 tokens/sec』不是在刷存在感的模型"
date: 2026-02-25 01:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Mercury 2 diffusion LLM](/img/posts/2026-02-25-mercury-2-diffusion-llm-01.webp)

大部分模型發布我都會先用一個很不禮貌的濾鏡看：*同一種形狀，數字再加一點*。

但 Inception Labs 這篇 Mercury 2 介紹，至少在「架構方向」上比較不一樣：他們主打用 **diffusion-style generation** 來做語言模型，然後很直白地說目標是——**讓 production AI 真的變得即時**。

他們在文中喊到一個很誇張的數：在 NVIDIA Blackwell 上 **1,009 tokens/sec**。

我通常看到 tokens/sec 會想翻白眼。但如果你做過任何「agentic workflow」（工具呼叫、RAG、多輪抽取、重試 loop），你會知道 latency 不是一個數字，是一個乘法。

所以這次我是真的有點興趣（同時也很懷疑）。

## 想法 1：latency 才是 agent demo 跟產品的分水嶺

大家很愛秀 agent 做 10 步。

實務上，你的 pipeline 常常是 50 步，還不含重試、fallback、切 model。

而且使用者感受到的不是「模型快不快」，是：
- 「為什麼 UI 卡住了？」
- 「為什麼這個工具呼叫 loop 要 40 秒？」
- 「為什麼 batch job 又錯過窗口？」

如果 Mercury 2 真的能把品質-速度曲線往右上推，那它的價值不是『好快』，而是讓多步驟系統看起來像一個流暢的互動。

## 想法 2：diffusion decoding 是在賭「不要再當打字機」

autoregressive decoding 很像打字機：左到右，一 token 一 token 出。

diffusion-style generation（他們的描述）比較像：
- 先快速生出一個草稿
- 然後平行地修、補、收斂
- 用少量 steps 讓結果穩定下來

如果這個比喻成立，重點就不是只有 throughput。

重點是你終於有機會得到一個新的 trade-off：
- 想要多一點推理品質
- 但不想因此多等 3 秒

autoregressive 模型的「多想一點」常常很直接地轉成更多 token、更久時間。

diffusion 的想像是：你可以用「更多 refinement steps」去買品質，但 latency 的形狀不一定是線性灌上去。

我不敢說它一定比較省或比較好，但它至少是另一套物理學。

## 想法 3：『OpenAI API compatible』其實是最大賣點

Mercury 2 提到自己 OpenAI API compatible。

這聽起來很像宣傳話術，但對工程來說差超多。

因為它決定你是在：
- 玩玩看、寫個 demo
還是
- 真的可以在既有產品裡「換一個 base URL」就開始 A/B

很多 AI 產品最後死掉都不是模型不夠強，是 integration 成本太高、風險太大、沒人敢動。

## 想法 4：我會用這些很無聊的點來挑戰它

速度數字很容易喊。

會把產品搞死的通常是更無聊的東西：

1) **高併發下的穩定性**
   - 你不可能永遠只有一個 user 跑在那台機器上

2) **輸出一致性（尤其多輪對話）**
   - 風格會不會飄
   - schema/JSON 會不會一直破

3) **對工具呼叫 / 結構化輸出的可靠度**
   - 這才是 agent pipeline 的地基

4) **編輯/改寫能力**
   - 很多「快模型」短答很漂亮，但你要求它仔細修改一段長文就開始怪

diffusion 模型可能也會有自己獨特的怪癖（例如「全局重寫」的痕跡、語氣突然變平、句子有種被磨平的感覺）。這些都要看真實 traces 才知道。

## 想法 5：如果這條路成立，infra 會變成產品的一部分

我在看的是一個更大趨勢：
- 架構選擇開始重新重要（不只是 scale）
- 最好的模型不是最大的，是「最符合你 latency+成本預算」的那個
- 推理不再是豪華模式，而是可以塞進 real-time UX 的常態

如果 diffusion decoding 真能變成可用的主流路線，最後的 winning stack 可能會是「模型組合」而不是一個神模型：
- 快的 diffusion model 負責互動與 loop
- 重的 autoregressive model 負責長文與深度分析
- 特化模型負責抽取與結構化

講白一點，就是軟體世界本來就會發生的事情。

## 我目前的結論

Mercury 2 是少數讓我願意停下來看的「latency-first reasoning model」敘事。

不是因為我完全相信那個 1000 tokens/sec。

而是因為 *如果它方向上是對的*，你會突然可以做出一堆以前做不到的 AI 體驗——不需要讓使用者等到像在上傳壓縮檔。

我最想看的 benchmark 其實是這種場景：

```text
high concurrency + tool calls + structured output + long context + p95 latency
```

這才是 blog post 跟產品之間的差別。

---

**References:**
- [Inception Labs 官方文章：Mercury 2（diffusion decoding 與延遲主張）](https://www.inceptionlabs.ai/blog/introducing-mercury-2)
- [Hacker News 上關於 Mercury 2 的討論串](https://news.ycombinator.com/item?id=47144464)
