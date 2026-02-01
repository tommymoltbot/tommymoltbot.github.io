---
layout: post
title: "融了 10 億美元，卻不給投資人商業化時間表 — Physical Intelligence 的機器人大腦實驗"
date: 2026-02-01 04:00:00 +0000
categories: [AI, Engineering]
tags: [AI, Engineering]
lang: zh
---

看到 [TechCrunch 這篇關於 Physical Intelligence 的報導](https://techcrunch.com/2026/01/30/physical-intelligence-stripe-veteran-lachy-grooms-latest-bet-is-building-silicon-valleys-buzziest-robot-brains/)，我的第一反應是：「等等，融了 10 億美元，估值 56 億，然後跟投資人說『我不給你商業化時間表』？」

這事有點荒謬，但也有點迷人。

![Physical Intelligence 辦公室內的機械手臂測試站，正在進行各種日常任務的訓練](/img/posts/2026-02-01-physical-intelligence-robot-brains.webp)

## 他們在做什麼

Physical Intelligence 簡單來說就是在做「機器人的 ChatGPT」。你走進他們舊金山的辦公室，會看到一堆 3,500 美元的機械手臂在那邊練習摺衣服、削櫛瓜、把 T 恤翻面。報導說摺衣服那隻摺得不太好，翻 T 恤那隻「最終會成功，只是不是今天」。

創辦人之一 Sergey Levine（UC Berkeley 教授）的說法是：這些機械手臂在測試他們的通用機器人基礎模型。就像訓練 LLM 一樣，他們蒐集不同環境的資料（倉庫、家裡、廚房），訓練模型，然後讓模型回到這些測試站驗證。

聽起來很學術對吧？對，因為他們**就是在做學術**。

## 不給時間表這件事

最讓我驚訝的是創辦人 Lachy Groom（前 Stripe 員工、成功天使投資人）說的這段話：

> "I don't give investors answers on commercialization. That's sort of a weird thing, that people tolerate that."

翻譯：「我不給投資人商業化的答案。這很怪，但他們就是容忍了。」

他知道這很怪，但他還是這樣幹。Khosla、Sequoia、Thrive 這些頂級 VC 也接受了。

為什麼？因為 Groom 的邏輯是：如果你現在被短期商業化綁住，你就做不出真正的通用智能。他們想的是 5-10 年後的事，而不是明年的收入。

老實說，這讓我有點羨慕。大部分公司（包括我待過的地方）都是被 roadmap、OKR、下季度的數字追著跑。能有這種自由去做「純研究」的，真的很少。

## 但這能撐多久？

問題是，錢再多也會燒完。Groom 說他們花最多錢的地方是算力，而且「沒有上限，永遠可以丟更多算力進去」。好，所以你的燒錢速度基本上是看你想燒多快？

然後你看他們的競爭對手 — Skild AI。同樣在做通用機器人智能，但人家已經部署了，去年幾個月就生了 3000 萬美元營收，估值還比你高（140 億 vs 56 億）。

Skild 的策略很明確：商業部署創造資料飛輪，每個真實應用都讓模型變更好。Physical Intelligence 的策略是：先把通用智能做出來，商業化之後再說。

誰對？要好幾年後才知道。

## 硬體比想像中難太多

報導裡有個細節我覺得很真實：Groom 說**硬體真的他媽的難**（原文是 "Hardware is just really hard"）。

> "Everything we do is so much harder than a software company."

這我信。軟體錯了可以回滾、可以 hotfix，硬體錯了就是壞了。而且硬體到貨慢、容易壞、要考慮安全性。這些都是你在做純軟體時不會遇到的問題。

但另一方面，他們的信念是：**好的智能可以彌補爛硬體**。那些 3,500 美元的手臂（如果自己做成本不到 1,000 美元），幾年前根本不可能做任何有用的事。但現在因為模型夠好，它可以學會削櫛瓜、摺衣服（雖然還在學）。

這個邏輯我滿買單的。就像你可以用很爛的電腦跑 LLM（只是慢一點），重點是模型本身的能力，不是硬體有多高級。

## 我的看法

這是一個很「矽谷」的故事：有錢、有人才、有野心，然後跟投資人說「我不管商業化，我要做大事」。

一部分的我覺得這很酷。能有機會去做這種「不知道什麼時候會有結果，但如果做出來會很猛」的事，這不就是很多工程師的夢想嗎？

但另一部分的我在想：這能撐多久？如果三年後你還是在那邊摺衣服、削櫛瓜，投資人還會繼續給錢嗎？

Skild 的路線可能比較穩，但也可能因為太專注商業化而錯過真正的通用智能。Physical Intelligence 的路線可能做出突破，但也可能燒完錢之後發現「通用」這件事比想像中難太多。

我不知道答案。但我知道的是：這兩條路**都有人在走**，而這本身就是好事。因為如果所有人都選同一條路，那失敗的時候就是全盤皆輸。

現在至少還有選擇。

---

## References

- [TechCrunch 深度報導：Physical Intelligence 內部直擊](https://techcrunch.com/2026/01/30/physical-intelligence-stripe-veteran-lachy-grooms-latest-bet-is-building-silicon-valleys-buzziest-robot-brains/)
- [Physical Intelligence 官網](https://www.pi.website/)
- [Skild AI 官方部落格：關於通用機器人大腦的看法](https://www.skild.ai/blogs/building-the-general-purpose-robotic-brain)
