---
layout: post
title: "年齡驗證其實是產品安全問題（不是政策 checkbox）"
date: 2026-02-12 01:00:00 +0000
categories: [Tech]
tags: [Tech]
---

![用一張「驗證 = 攻擊面」的概念圖把討論框起來](/img/posts/2026-02-12-kid-age-verification-bypass.webp)

最近年齡驗證被塞進越來越多消費型產品，我完全理解背後動機：
監管想要一個乾淨的入口，平台想要一個「我們有做」的敘事。

但工程角度看，當你把「成年 / 未成年」做成產品裡的一個開關，你其實是在**新增一個攻擊面**。
而這一兩天那種「驗證繞過」的文章、repo、Hacker News 討論串，本質上就是網路照例在做的事：把 gate 當成可被對抗測試的系統。

這不是道德辯論。這是產品安全辯論。

## 你不是在「加功能」，你是在部署一個 oracle

從安全的語言來說，年齡驗證流程是個 **oracle**：

- 吃進使用者提供（或攻擊者偽造）的訊號（自拍、證件、裝置資訊、session token、timestamp）。
- 輸出一個具有價值的二元決策。

一旦這個輸出會決定你能不能加入某個社群（Discord）、能不能講話（直播聊天室）、能不能看內容（短影音 / 社交），就一定會有人去優化這個輸出：要嘛遵守流程，要嘛繞過。

所以你不是「加年齡驗證」。你是在把一個分散式系統拉進你的 threat model。

## 這類系統通常怎麼裂

如果你做過 anti-fraud / anti-abuse，你會覺得很熟：

1. **UI 層很多時候是戲。**
   自拍 UI 是拿來引導一般使用者的，但攻擊者不會照著 UI 玩。

2. **產品與 vendor 的邊界很糊。**
   App + SDK + backend callback + webview/redirect，攻擊面跨好幾個系統。

3. **「只傳 metadata」的隱私設計是雙面刃。**
   不存原始影像很好（隱私），但如果最後依賴的是衍生特徵，這些特徵就可能被仿造（安全）。

4. **最常見的弱點其實是「能不能鑄造一個成功 session」。**
   不是「能不能騙過模型」，而是「能不能生成看起來夠像的 payload，讓 server 端驗過去」。

如果你的 enforcement 故事只剩「我們接了一個自拍供應商」，那你其實把合規押在 vendor 的實作細節上，也押在你整合零失誤。

## 如果我是平台工程師，我會怎麼做

我會把驗證 flow 當成 anti-abuse 在做，而不是 feature：

- 能不能在不誤傷正常使用者的前提下做 **rate limit / retry 控制**？
- 能不能把驗證結果 **綁定到更穩定的東西**（裝置 + 帳號歷史 + 風險分數），而不是一次性 webview？
- 有沒有真正能用的 **telemetry**，而不是只記「成功 / 失敗」？
- 能不能在繞過出現時快速 **換 key、切流程、做熱更新**？
- 如果驗證被打爆了，有沒有「安全模式」能讓產品繼續運作，而不是整個入口一起死？

我也會在內部說白：只要 gate 有價值，繞過不是 bug，是必然。

## 真正的 tradeoff：隱私 / 可驗證性 / 強韌度

大家很愛問「年齡驗證到底好不好」。我覺得更務實的問題是：

- 你越想隱私友善（不留原始證據），
- 你就越仰賴衍生訊號，
- 而衍生訊號越多，你就越需要硬工程（不是 vibes）去維持強韌度。

所以我很懷疑未來的「年齡驗證」會越來越像 anti-abuse：持續調參、對抗迭代、和 incident response。

## References

- [Hacker News 討論串：Discord / Twitch / Snapchat 年齡驗證繞過](https://news.ycombinator.com/item?id=46982421)
- [專案頁：discord/twitch/kick/snapchat age verifier 的說明](https://age-verifier.kibty.town/)
- [The Verge 報導：iOS 26.3 與 macOS 26.3 的安全更新](https://www.theverge.com/tech/877587/ios-26-3-released-transfer-to-android)
