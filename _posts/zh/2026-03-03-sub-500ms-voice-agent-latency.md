---
layout: post
title: "次 500ms 的語音 agent 其實不是 prompt 競賽，是 turn-taking + streaming 的工程問題"
date: 2026-03-03 04:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![低延遲語音 agent 的管線](/img/posts/2026-03-03-sub-500ms-voice-agent-latency.webp)

我一直覺得「語音 agent」這個東西最容易讓人誤判。

因為你第一次 demo 的時候，只要它成功回你一句話，你就會覺得：哇靠，未來到了。

但聊到第三輪，你就會開始感覺不對：
- 它會搶話
- 你插話它停不下來
- 你講完它沉默太久

最近看到一篇作者自己做出 **~400ms end-to-end** 的語音 agent（而且是從 orchestration layer 自己拉起來），我最有感的不是「模型多強」。而是他把問題講得很務實：

**語音體驗的關鍵是 timing，背後是 turn-taking 與 streaming。**

## 1) 語音不是 chat UI，是一個小 state machine

文字聊天很簡單，turn boundary 是你按下送出。

語音是連續的，系統要一直回答同一題：現在是誰在講？

```text
state = LISTENING | SPEAKING
transition A: 使用者開始講 -> 立刻取消 agent 的生成 + 播放
transition B: 使用者講完   -> 立刻開始串流回覆（越快越好）
```

你把這件事想清楚之後，很多「語音 agent 不自然」的問題就突然變得可量化。

## 2) VAD 只能知道「有沒有聲音」，不知道「你是不是講完了」

VAD（Voice Activity Detection）很好用，但它只負責判斷「這段音訊像不像人聲」。

而人講話會停頓、會想一下、會『嗯…』再接下去。

所以真正的 turn-taking 不能只靠 VAD。

要嘛你自己把 VAD + transcript-aware 的規則拼起來，要嘛用那種把 **turn events（start-turn / end-turn）** 當一等公民輸出的 streaming 服務。

## 3) Streaming 不是優化，是產品本體

一個實務上超重要的點：**STT → LLM → TTS 要端到端串流**。

不是「等模型完整回答再念出來」，而是：
- LLM 第 1 個 token 出來就丟給 TTS
- TTS 第 1 個音訊 packet 出來就立刻播放

如果你用傳統的 sequential pipeline：

```text
錄音 -> 轉文字 -> 生成 -> 合成語音 -> 播放
```

那你其實是把「尷尬的空白」寫進 spec 了。

## 4) TTFT + 地理位置，比你想像中更支配一切

語音 agent 的延遲不是單一模型速度。

因為你在一個 turn 裡面同時碰好幾個外部服務（STT、LLM、TTS、電話/語音平台）。每個 round-trip 疊起來，體感就爆炸。

所以一些很不性感但很重要的工程選擇會決定成敗：
- orchestration server 放哪個 region
- WebSocket 連線要不要維持 warm（尤其 TTS）
- 把 first-token latency（TTFT）當成核心 KPI

## 5) 自己拉一層 orchestration 的價值：可 debug

我不是反對平台 SDK。那種東西讓你很快做出 demo，這很好。

但只要你想做成「能賣、能長期跑」的產品，就一定會遇到這些問題：
- 這次是 end-of-turn 判錯，還是模型慢？
- 是 barge-in 沒 cancel 掉，還是 Twilio 那端 buffer 沒 flush？
- 是 TTFT 慢，還是 TTS 連線建立太久？

把系統拆成「小 state machine + 串流管線」，你才有地方插 probe、打 metrics、做回歸測試。

語音 agent 最後會不會讓人覺得自然，真的不是靠你 prompt 寫得多漂亮。

是靠你把 timing 做到「像一個懂得輪流講話的人」。

---

**References:**
- [Nick Tikhonov：從零打造 sub-500ms latency voice agent 的完整紀錄](https://www.ntik.me/posts/voice-agent)
- [Hacker News 討論串（很多細節在留言）](https://news.ycombinator.com/item?id=47224295)
