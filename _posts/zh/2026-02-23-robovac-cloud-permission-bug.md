---
layout: post
title: "掃地機不是攝影機，但你的雲端後端可能把它當成攝影機"
date: 2026-02-23 13:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張被打碼的示意圖：DJI Romo 客戶端如何跟雲端服務溝通](/img/posts/2026-02-23-robovac-permission-bug-01.webp)

如果你想找一個「工程師看了會冷汗」的故事，這個真的很適合。

有人只是想用 PS5 手把遙控自己的掃地機，寫了一個小工具去跟廠商雲端溝通。結果雲端回他一句：你是 owner。

然後他發現自己不是只拿到一台掃地機的權限，而是差點拿到**上千台**（報導裡是約 7,000 台，跨 24 個國家）。

這個 DJI Romo 事件之所以值得寫，不是因為「哈哈智慧家庭果然很爛」。而是因為它把我們一直在重複犯的錯，濃縮成一個很乾淨的案例：

- 進到最私密空間的裝置（鏡頭 + 麥克風 + 房屋地圖）
- 為了遠端控制而必然存在的雲端 relay
- 後端的授權邏輯一個閃神，把「已登入」當成「什麼都可以做」

故事就這麼簡單。但也正因為這麼簡單，才恐怖。

## 1) Authentication 不是 Authorization（是的，還是）

大家都聽過這句話，但我們還是一直在出貨這種系統：

```text
authenticate(token) -> ok
```

然後最重要的那一段默默沒寫好：

```text
authorize(token, device_id, action) -> allow | deny
```

如果你的 token 可以訂閱到所有裝置的 MQTT topics（或查到所有裝置狀態、鏡頭、地圖），那你的雲端就像共用公寓，拿到一把鑰匙就能開所有房門。

The Verge 的描述是「MQTT-based communication 的 backend permission validation issue」。這種 bug 在 code review 裡看起來可能只是少了一個 if，但在現實世界裡它對應的是：

「一個會在你家裡亂走、還看得到你客廳的機器。」

## 2) 「我們有 TLS」是錯的心智模型

就算傳輸有加密，你還是可以把使用者的隱私搞爛。

原因很簡單：TLS 保護的是「管子」，不是「誰能看管子裡面的東西」。

如果 broker 讓一個 authenticated client wildcard-subscribe，那加密也在正常工作——只是你把明文合法地交給了不該拿到的人。

最可怕的點不是有個電影式駭客，而是：

系統「照設計運作」——只是對錯的人運作。

## 3) 家用機器人本質上是 sensor 平台

一台帶鏡頭、麥克風、會畫你家平面圖的掃地機，不是「只有掃地」。它是移動式感測器平台。

你可以說：麥克風是語音控制、鏡頭是避障、地圖是導航。OK。

但當你把這些資料上雲（或至少可以透過雲端 relay 遠端取得）時，你其實在出貨一個必須用「家用攝影機」標準來對待的產品：

- 每台裝置/每個 topic 的 ACL 要非常嚴
- audit log 要能追
- rate limit 要假設濫用
- 撤銷權限要能即刻生效（不能賭使用者更新 app）

## 4) AI coding tool 不是原因，但它改變了「誰能把漏洞用起來」

我不買「AI 讓大家都變駭客」的恐慌敘事。

但我很買一個更現實的結論：AI 會壓縮「我有個怪想法」到「我有個能打到你 production 的原型」的時間。

漏洞仍然是廠商的責任。

只是能夠發現、驗證、把它做成工具的人，變多了。

所以做 IoT + cloud 的人，真的不要再假設「只有高手才會找到」。你要假設「一個好奇的工程師週末就會撞到」。

## 5) 乏味但有效的答案：Least privilege + topic-level ACL

整件事很像最典型的 least-privilege failure。

如果你用 MQTT（或任何 message broker 類型），底線應該要嚴到讓人覺得煩：

- device 只能 publish 自己的 topics
- user token 只能 subscribe 自己裝置的 topics
- wildcard（像 `#`）在 production 基本上應該不可能

因為你錯一次的代價不是「有人幫我啟動掃地機」。你錯一次的代價是：

- 即時音訊
- 即時影像
- 房屋平面圖
- 粗略地理位置

那不是一個小 bug。那是你不小心出貨了一個你沒打算賣的監控產品。

---

**References:**
- [The Verge：DJI Romo 後端授權漏洞，可能讓人遠端存取鏡頭與控制裝置](https://www.theverge.com/tech/879088/dji-romo-hack-vulnerability-remote-control-camera-access-mqtt)
- [Popular Science：7,000 台掃地機權限外洩事件與智慧家庭隱私焦慮](https://www.popsci.com/technology/robot-vacuum-army/)
