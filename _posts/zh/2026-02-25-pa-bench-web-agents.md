---
layout: post
title: "PA Bench 把網頁代理的魔法拆掉了（這反而是好事）"
date: 2026-02-25 22:20:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![PA Bench 結果圖表](/img/posts/2026-02-25-pa-bench-01.webp)

我最近越來越受不了一種「computer-use agent」的敘事：

台上 demo 一次順順跑完，大家就開始幻想它明天可以替你處理整個生活。

PA Bench 這個基準測試我覺得反而更有價值，因為它做的事情很不浪漫：**把魔法感抽掉**。

它是 Vibrant Labs 做的一個 benchmark，重點不在「會不會點按鈕」，而是讓 agent 做那種更像助理的工作：在 email 和 calendar 之間來回切換、抽資訊、做寫入，最後還要能被 verifier 檢查「結果是不是完全正確」。

對，完全正確。

## 我用五個角度檢查 PA Bench 到底在量什麼

1) **問題導向：**它量的是人真的會付錢的助理工作（協調、跨 app 的脈絡），還是只是更複雜的點擊題？
2) **底層：**它其實是在量模型能力，還是比較像在量某個 action schema / 工具介面的好壞？
3) **失敗模式：**能不能分出「不會規劃」vs「規劃會但執行不穩」？
4) **上線現實：**如果一個任務上限 75 steps，你腦中要直接浮現成本、延遲、重試次數。
5) **我的偏見：**不把 verification 當一等公民，你最後會出貨一個自信滿滿的雷。

## PA Bench 真正在測的東西：跨 app 的一致性

很多 web-agent benchmark 很像 unit test：
- 開網站
- 點一下
- 打字
- 收工

但真的像助理的工作比較像 integration test：
- 讀 email thread
- 抽出 constraint（日期、航班、參與者）
- 反映到另一個地方（行事曆）
- 然後確認你沒有寫錯人、寫錯時間、寫錯欄位

PA Bench 的設計就是硬逼你進入這種模式：
- 任務必須同時用到 email + calendar
- 在可控的 simulation 裡跑（方便重現）
- 最後 verifier 直接看 backend state 判斷成功與否

所以你不能「差不多」。你把抵達時間填錯，照樣 fail。

聽起來很嚴格，但這其實更接近真實使用者的感受：你錯一個細節，接下來就是我來擦屁股。

## 那個會讓你不舒服的結論

他們的結果很直白：**Claude Opus 4.6** 在 full success rate 上明顯領先，其他模型掉得很兇。

我覺得更值得看的是他們的 error analysis：
- Claude 常常會在 action 沒有效果時，**改路線自救**（不是一直重複同一招到 step 用完）。
- Gemini 很常見的狀況是 **plan 沒問題，但 execution 失手**（append 了不該 append 的字、忘了補 meeting link、欄位沒 replace 乾淨）。
- 缺少 **post-action verification** 是反覆出現的失敗原因。

這也是我覺得大家在 hype agent 時最容易跳過的點：
多數失敗都不是戲劇性崩潰，而是很無聊的小錯。

不是「模型很笨」，而是「它沒有確認最後的狀態是不是對的」。

而這其實是產品設計問題，不只是一句 prompt 可以解決。

如果你的 agent 沒有一個像這樣的習慣迴圈：

```text
plan -> act -> verify -> correct -> verify
```

那你就是在賭運氣。

## 這個 benchmark 給我的一個提醒：要懲罰「幾乎成功」

很多團隊（包括很強的）對 partial credit 都會心軟：
- 「至少找到正確那封 email 了」
- 「event 建起來了，只是欄位不完全對」
- 「就差沒邀一個人」

但 partial credit 正是 demo 工程的溫床。

助理產品最核心的能力其實是：**寫入使用者狀態而且要寫對**。

## 如果我要做助理產品，我會直接偷兩個點子

1) **可重現、可控的評測環境**  
   你可以不用真的 clone Gmail，但你一定要有一個地方能量化進步，不被「網頁改版」干擾。

2) **把 verification 當成一等公民**  
   不是「叫模型再檢查一下」，而是有 budget、有流程、有明確的 verify loop。

agent 最矛盾的地方是：看起來「多做幾步確認」很浪費，但往往是唯一能讓它真的可出貨的東西。

---

**References:**
- [PA Bench 原文：評估網頁代理在真實助理工作流程的表現（Vibrant Labs）](https://vibrantlabs.com/blog/pa-bench)
- [Hacker News 討論串：PA Bench（item 頁）](https://news.ycombinator.com/item?id=47157160)
