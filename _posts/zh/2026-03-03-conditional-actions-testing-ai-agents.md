---
layout: post
title: "測 AI agent 不是『隨便丟幾個 prompt QA』——這根本是系統測試，而且需要可重現"
date: 2026-03-03 16:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![條件式動作（Conditional Actions）測試示意圖](/img/posts/2026-03-03-conditional-actions-testing-01.webp)

每次有人跟我說「我們就讓大家丟幾個 prompt 試試看，沒問題就上線」，我腦中都會自動翻譯成：「付款流程我們用滑鼠點幾下，順了就 deploy。」

短期看起來有效，直到某天它炸掉。然後你會卡在一個很尷尬的問題：

- 是 agent 真的退步了？
- 是 tool / API 那層退步了？
- 還是你的「測試用戶 LLM」這一輪突然開始即興演出？

你只要把 voice / chat agent 做到稍微接近 production，就會發現現實很不友善：

- 對話是 **非線性的**
- 有 tool 之後是 **有狀態的**
- 有 LLM 之後是 **隨機的**

所以 testing 的核心不是「回話好不好聽」，而是：你能不能用**可重現**的方式跑完整個 flow，然後在每次改 prompt、換模型、加工具時抓到 regression。

## 1) 線性腳本一遇到分支就死

典型的 scripted test 是這樣：

1. 使用者說 A
2. agent 回 B
3. 使用者說 C
4. agent 回 D

Demo 還行，真實用戶不會照劇本走。

他們會插話、會岔題、會「還沒問就先講」，voice 還會加碼：ASR 聽錯、沉默太久、講到一半停住、barge-in。

如果你的測試框架不能自然地跟著分支走，那你其實只是在測「happy path 有沒有順」——而那通常是你最不需要花力氣測的那一條路。

## 2) 「用 LLM 扮演測試用戶」本身就是 flaky dependency

很多團隊為了處理分支，會讓另一個 LLM 扮演 user。

結果很快就遇到一些讓人想翻白眼的狀況：
- 明明叫它別提前爆料，它還是會先把姓名、生日、需求一次講完
- 對話 15 turn 之後開始忘記規則
- 卡 loop（「我不是剛剛講過帳號了嗎…」）然後測試永遠跑不完

這也是為什麼「prompt QA」常常兩週很嗨，之後就默默放生。

你真正想要的比較像：**一個 deterministic 的狀態機，上面再撒一點語言能力**。

## 3) 用「條件 → 動作」來寫測試，對話可以分支但結果要可重現

我第一次看到有人把這件事講清楚的時候，整個就懂了：

- 不要用一大坨 instruction prompt 去指揮測試 LLM
- 你要做的是定義一組 **conditions**，以及每個 condition 觸發時測試用戶要做的 **actions**

對話可以分支，但測試還是可重現、可追蹤。

你把它想成「routing」就好：像 UI 的 focus routing、event routing，只是這次 routing 的是對話 turn。

最小的長相大概像這樣：

```text
{
  role: "你是一個要取消門診預約的病人",
  conditions: [
    { id: 0, condition: "", action: "嗨，我要取消預約", fixed_message: true },
    { id: 1, condition: "對方問姓名", action: "王小明", fixed_message: true },
    { id: 2, condition: "對方要驗證身份", action: "1985/01/15", fixed_message: true },
    { id: 3, condition: "對方確認取消完成", action: "謝謝，就這樣", fixed_message: true }
  ]
}
```

重點不是語法，是心法：

- **不要靠 LLM 的當下狀態（vibes）來當你的測試基礎**
- 測試必須是 **condition-triggered** 而且 **每一步都能 log**

## 4) 沒有 mock tools，你根本做不出能跑 CI 的 agent test

Agent 一定會叫 tools。tools 一定會碰網路。網路一定會出事。

如果你的 regression suite 在打真實 API，那你做出來的是一台 chaos machine，不是測試。

你需要一層能讓 tool call：
- schema 可驗證
- 行為 deterministic
- 執行速度快
- 跟 production 隔離

這其實就是我們在一般軟體測試 stub / mock 外部依賴的原因，沒有比較高尚。

## 5) 要評估「整段 session」，不要只看單一 turn

Tracing 工具可以讓每個 turn 看起來都很正常，但整個 session 的邏輯可能已經歪掉。

舉例：流程要求先做身份驗證再繼續。如果 agent 不小心跳過驗證，後面每一句話單獨看都可能「合理」。

這種 bug 只有在你用 evaluator 去判斷整段對話流程時才會暴露：

```text
evaluate_session(transcript) -> { passed: boolean, failure_reason?: string }
```

這也是我覺得「做 agent」最後會變成系統工程的原因：你不是在改一句話，你是在維護一組跨多 turn 的 invariant。

## 如果今天換我負責一個 production agent，我這週會做什麼

1. 挑 3 個最會出事、也最值錢的 flows（取消、退款、驗證）
2. 每個 flow 寫成一個 condition→action evaluator
3. 把工具層 mock 起來
4. 把 20 段真實的 production transcript 變成 regression cases
5. 每次改 prompt / 換模型 / 改工具，一律跑

不浪漫，但這就是「你只是把 agent 做出來」跟「你真的能營運這個 agent」的差別。

---

**References:**
- [Cekura 官方文章：Conditional Actions（用規則化條件式動作，讓 voice/chat agent 測試可重現）](https://www.cekura.ai/blogs/conditional-actions-robust-testing-chatbots-voice-agents)
- [Hacker News 討論串：Cekura Launch HN（談 voice/chat agent 的測試與監控）](https://news.ycombinator.com/item?id=47233044)
