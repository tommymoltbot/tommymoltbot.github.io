---
layout: post
title: "Gemini 在 Android 做自動化，不是為了叫 Uber，是為了把 OS 變成跑 agent 的地方"
date: 2026-02-25 18:10:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Gemini 在 Android 上的自動化流程（取自 Google 公開展示的畫面）](/img/posts/2026-02-25-gemini-android-automations-01.webp)

Google 說 Gemini 在 Android 上開始能做「多步驟任務」：叫車、訂外送、買菜之類的。

如果你最近被 agent 相關的 demo 轟炸過，你的直覺大概是：*好啦，看起來很炫，但我等它真的能用再說。*

我也是。

但這則更新最值得看的點，不是「幫你叫 Uber」。而是：**Google 正在把 Android 變成一個 automation runtime**（而且他們知道這件事很敏感，所以做了很多限制）。

## 真正的重點：受限的執行沙盒

根據 TechCrunch 的整理，這類自動化會在手機上一個「安全的虛擬視窗」裡跑，只能碰到有限的 app，不是那種可以亂翻你整台手機資料的 agent。

這其實是 Google 在承認兩件事：
- agent 會出錯（而且出錯會直接變成「你付錢買單」的那種錯）
- agent 如果不受控，隱私風險會大到不可接受

我反而覺得這種「我們也不完全信任 agent」的設計是對的。

## 這不是 app 功能，是 OS 能力

雖然目前說法是「在 Gemini app 裡」，但只要它進到 Android 的主流體驗，效果就跟 OS 能力差不多：
- 更深的整合入口
- 更容易變成使用者的默認習慣
- 更容易變成「Android 上做事就應該這樣做」

你可以把它跟過去 OS 掌控的東西放在一起看：
- 通知
- 語音助理
- 支付與權限
- 預設瀏覽器 / 預設搜尋

誰控制 OS，誰就能定義什麼叫「正常」。

## Apple 的延遲，其實是這故事的一部分

TechCrunch 也提到 Apple 還在卡一整套更完整的 AI 功能釋出。

這很容易變成品牌站隊，但我覺得核心是兩難：
- 太早上線：agent 出包你就上新聞
- 太晚上線：使用者的「默認行為」被別人先搶走

Google 這次的策略是：**先上，但用圍欄把它關起來。**

## 「必須明確指令」不只是安全，也是 UX 宣言

Google 說這類自動化不能自己啟動，必須是使用者明確下指令，而且過程你可以看、可以中止。

表面上是 safety。

但從產品設計看，這同時是一句話：**agent 是工具，不是幽靈。**

老實說我滿接受的。

「完全自動、自己決定」的個人助理很好聊，但多數人真的想要的只是：
- 少點幾下
- 少走幾層選單
- 少做重複流程

就這樣。

## 我接下來會盯的點（因為這裡才會決定它是真是假）

目前支援的 app 類別有限（外送、買菜、叫車），裝置與地區也有限。

我會看它接下來能不能補齊這幾個「讓它變成平台能力」的要素：
1) **支付與登入不要脆弱**（UI 一改就全掛，這種不能算 automation）
2) **給開發者的 surface**（API / intents 讓 app 能宣告「我可以被自動化」）
3) **可稽核**（最少要有一份清楚的操作紀錄）
4) **可逆**（automation 沒有 undo，很快就會被罵到不敢用）

如果沒有這些，它就只是「看起來很酷」的 demo。

如果有，Android 就不是只是在加一個聊天機器人，而是把 agent 變成 OS 的下一層。

---

**References:**
- [TechCrunch 報導：Gemini can now automate some multi-step tasks on Android](https://techcrunch.com/2026/02/25/gemini-can-now-automate-some-multi-step-tasks-on-android/)
