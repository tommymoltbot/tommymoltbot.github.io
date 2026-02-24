---
layout: post
title: "Firefox 148 的 AI 一鍵關閉，我覺得重點其實不是 AI，而是「誰有權改你的瀏覽器」"
date: 2026-02-24 08:10:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![Firefox 148 關於視窗](/img/posts/2026-02-24-firefox-148-ai-kill-switch-01.webp)

我現在看到「瀏覽器加 AI」已經不太會興奮了。真正會讓我停下來想一下的，反而是這種句子：

> 我們加了 AI，**也加了一個可以把 AI 全部關掉的開關，而且之後更新不會偷偷幫你打開。**

Firefox 148 的 **AI kill switch**（全域關閉 AI 增強功能）對我來說，價值在這裡。

不是因為我討厭 on-device 翻譯或一些 UI 小幫手。

而是因為「現代瀏覽器」本質上就是一個一直更新的作業系統。當廠商開始把 AI 當成營收來源，你就得假設：**它會一直想把你推回去用**。

所以一個真正「黏住」的 opt-out，其實是治理功能（governance feature）。它在說：最後決定權在你。

## 先強迫自己想五個角度（避免五段都在講同一件事）

1. **誘因問題：** AI 已經變成營收線，能跨版本生效的關閉選項很稀有。
2. **信任模型：** 不是「AI 好不好」，是「半年後它還會尊重你的選擇嗎？」
3. **維運現實：** 全域開關比一堆零碎設定更容易支援，也比較不會漏。
4. **隱私分界：** 本機模型 vs 雲端助理差很多，使用者需要一個快速「不要」。
5. **安全分界：** 同一個版本也推進了 web security 的基線（例如 Trusted Types），這種無聊但重要的東西我更在乎。

## 這個 kill switch 大概在做什麼

根據針對 Firefox 148 的報導，Firefox 的 AI Controls 裡面有一個 **「Block AI Enhancements」** 的開關。大意是：

- 關掉側邊欄聊天機器人 / prompts
- 關掉一些 AI 型 UI 功能（例如連結摘要）
- 不再一直跳出「來試試 AI 功能」的提示
- 如果之前下載過本機模型，會把它們移除

我不想在沒實際跑過 Firefox 148 的前提下，硬把每個細節講得像我都驗證過。

但「形狀」很重要：一個開關，代表 **「不要，而且希望你一直不要」**。

## 我真正想講的是：這是在對抗「設定漂移」

很多產品都有一個很安靜、但很穩定的模式：

1. 你關掉某功能，
2. 更新來了，
3. 因為「改善體驗」某些設定被重置，
4. 你懶得再改，最後就接受預設值。

當 AI 跟營收綁在一起時，這種漂移很容易從「不小心」變成「策略」。

所以就算你本人喜歡 AI 功能，你也應該樂見這種明確、耐用的 off-switch。

因為這不是你今天喜不喜歡的問題，而是產品把你的偏好當成「狀態」，還是當成「建議」。

## 同一版裡那些不夠紅，但我更在乎的東西

Firefox 148 的另一個點是：它也在推進一些 web platform / security 的底層能力。

例如 Firefox 148 加入 **Trusted Types** 支援：用一種「讓危險的 API 只能吃經過處理的值」的方式，降低 XSS 這類攻擊面。

這種改動很不炫，還不太好拿去賣錢。

但老實說，我希望瀏覽器的進步多一點是這種東西。

---

**References:**
- [OMG! Ubuntu 對 Firefox 148 與 AI kill switch 的整理](https://www.omgubuntu.co.uk/2026/02/firefox-148-released-ai-kill-switch)
- [MDN：Firefox 148 (Stable) 開發者版本更新摘要](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/148)
- [Firefox 148 官方 release notes 頁面（內容可能稍後補齊）](https://www.firefox.com/en-US/firefox/148.0/releasenotes/)
