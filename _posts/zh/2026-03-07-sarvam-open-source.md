---
layout: post
title: "Sarvam 30B/105B 開源：我在意的不是榜單，是他們把整個堆疊做出來了"
date: 2026-03-07 12:10:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Sarvam 開源 30B 與 105B](/img/posts/2026-03-07-sarvam-open-source-01.webp)

每次有新的開源模型出來，網路上的流程都很固定：

1) 有人貼 benchmark 表格
2) 有人說「這已經接近 frontier」
3) 然後大家開始吵閉源是不是作弊

Sarvam 這次把 30B 跟 105B 兩個模型開源，當然也可以照這個流程走一遍。

但我覺得真正值得看的點不在「它到底贏誰 0.3 分」。而是在他們的敘事裡，開源只是表面，底下其實在講一件比較硬的事：**他們試圖把訓練、資料、到推論部署整個 stack 在本地做起來，然後真的丟進產品跑。**

這不是什麼理想主義的口號，這比較像工程師在做風險控管：不想把命交給別人的 GPU 時間、API 條款，還有政策心情。

## 1) 「開源權重」是新聞，「開源成本結構」才是重點

很多模型釋出其實長這樣：

- 給你權重
- 祝你服務順利
- 反正你最後還是得買一堆很貴的卡

Sarvam 的文章反而花了不少篇幅在 tokenizer、KV-cache 記憶體、kernel / scheduling、以及 serving 的架構。

老實說，這些內容通常只有真的做過 production 才會在意。

因為你真的上線過 LLM 功能就知道，最後卡住你的很少是「模型不夠聰明」，而是：**延遲、尾延遲、併發、以及每個 request 到底要燒多少錢。**

## 2) MoE 的漂亮承諾：參數變大，但每 token 的算力別跟著爆

他們兩個模型都走 Mixture-of-Experts（MoE）路線。MoE 的吸引力大家都懂：總參數很大，但每次只啟動一小部分 expert，理論上可以把推論成本壓在比較能接受的範圍。

但 MoE 也是那種「paper 上很乾淨，上線後很容易變髒」的東西：

- routing 會不會崩
- expert load balancing 會不會失衡
- batching 效率會不會爛掉
- request 分佈一變，性能是不是直接出現奇怪的 cliff

他們提到用 sigmoid-based routing（而不是 softmax gating）加上 expert-bias 來穩定 routing，我的直覺是：他們八成真的踩過「一堆 expert 沒在工作」那種坑。

另外 30B / 105B 的切法也很現實：

- 30B 走「即時部署、延遲優先」
- 105B 走「需要更深推理、agentic 任務」

我會把它解讀成：一個你敢長期熱啟動、扛流量；一個你在需要深度時再導流過去。

## 3) 印度語系不是 checkbox，是 tokenizer 的數學問題

很多地方講多語言會變成「我們支援 X 種語言」這種 checkbox。

但如果 tokenizer 對某些 script 的效率很差，你會付雙倍代價：

- **成本**：同樣內容變成更多 tokens
- **延遲**：decode step 更多，整體就慢

Sarvam 很明確在談他們為 Indic languages 做 tokenizer 優化，甚至把 romanized 這種「真的有人這樣打字」的用法也納進去。

這點我滿買帳的。因為很多所謂的 multilingual，其實只是「能跑」，但跑得很貴、也不太自然。

## 4) 「主權 AI」對工程師來說，其實就是 operational risk

我不是地緣政治專家，但把話翻譯成工程語言很簡單：

- 你不想核心產品哪天因為 vendor 改條款就壞掉
- 你不想 roadmap 被一個閉源 API 的存取權卡住
- 你不想你的合規故事只能說「相信我們，資料很安全」

如果 Sarvam 這套 stack 真的做得起來，重點就不是「某國有模型」，而是「某國有能力把模型從頭做到尾、再把它運維起來」。

這種能力是會複利的。

## 5) 給真的在做產品的人：把它當系統文章看，不要只當模型新聞看

如果你是做 LLM 應用的人，這篇文章最有價值的用法不是「立刻把 Sarvam 接進去」。

而是把它當一篇 production 系統文章，去看他們到底怎麼想：

- MoE routing 的穩定性怎麼處理？
- 延遲怎麼壓？成本怎麼算？
- 他們認為「真的 agentic」的評估長什麼樣？哪些還是 hype？

就算你最後不跑 Sarvam，這種思路也很重要。

它決定了你做的是「我們加了 AI」

還是「我們負擔得起一直開著 AI」。

---

**References:**
- [Sarvam 官方文章：Open-Sourcing Sarvam 30B and 105B](https://www.sarvam.ai/blogs/sarvam-30b-105b)
- [Hacker News 上的 Sarvam 開源討論串](https://news.ycombinator.com/item?id=47285422)
- [Hugging Face 上的 Sarvam 30B 模型頁（權重與資訊）](https://huggingface.co/sarvamai/sarvam-30b)
- [Hugging Face 上的 Sarvam 105B 模型頁（權重與資訊）](https://huggingface.co/sarvamai/sarvam-105b)
