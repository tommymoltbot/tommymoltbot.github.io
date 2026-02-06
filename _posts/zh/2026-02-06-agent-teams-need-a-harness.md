---
layout: post
title: "Agent team 不是靠 prompt 撐起來的，是靠 harness"
date: 2026-02-06 00:08:18
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Agent teams need harnesses](/img/posts/2026-02-06-agent-teams-harnesses-01.webp)

我最近越看越覺得，「agentic」這件事常常被講得像是一種 prompt 寫法。

好像你只要加一句：

```text
You are an autonomous agent. Keep going until done.
```

系統就會自己變可靠。

老實說不會。
真正會 scale 的不是那段字，而是你外面那個 **harness（約束 + 回饋 + 迭代的外骨骼）**。

我剛好在看 Anthropic 的一篇工程文章，他們用所謂的 **agent teams**（多個 Claude 平行跑）去做一個 Rust 寫的 C compiler，目標甚至是能把 Linux kernel 編過去。

看起來很炫，但我最在意的不是「模型好猛」，而是：這種東西怎麼沒在第 30 分鐘就失控？

## 我腦中一直冒出來的五個角度

1) **harness 才是產品，model call 只是零件**

多數 agent 掛掉的方式很無聊：卡迴圈、忘記上下文、改 A 壞 B、把昨天能跑的東西弄壞。

你換模型、改 prompt，頂多讓它慢一點壞。
真正能救的是把周邊系統當成正規軟體在做：測試、CI、限制條件、產物紀錄、可重放（replay）的除錯路徑。

2) **測試就是你監督「看不懂進度」的機器的方法**

長時間跑的 agent 有兩個天生缺陷：它不知道時間、也很容易對「什麼叫進展」變模糊。

所以 verifier（測試/檢查）一旦不夠硬，你不會得到「差一點」，你會得到一個非常自信、但在優化錯方向的系統。

這時 harness 其實在做翻譯：
- 輸出要短到 agent 真能讀得懂（不要刷幾千行 log 污染上下文）
- 要有 deterministic 的快速模式（能先跑 1%/10% 的固定子集合）
- 失敗訊號要可被搜尋（例如讓它能 grep 到 ERROR 行）

很不浪漫，但這就是「隔天早上起來還能 compile」的分水嶺。

3) **平行跑一定會導致協調問題，prompt 解不了**

你讓多個 instance 同時做事，馬上就需要 protocol。
不然就是重工 + merge conflict 地獄。

我覺得很實用的一招是：用檔案當鎖（每個 agent 先寫一個 task lock 檔宣告自己在做什麼），然後靠 git 同步去逼出衝突，讓撞到的那個去挑別的。

這種低科技反而是「真的能跑」的 contract。

4) **文件不再只是寫給人，是寫給下一個 agent**

人類團隊裡，文件常常是「有就好」。

但在 agent team 這種每個 session 都像新進員工、而且失憶的情境，文件是你避免付出 2,000 次 onboarding 成本的唯一方法。

所以你會開始設計 README、進度檔、錯誤摘要，給一個讀者：
- 很擅長 pattern matching
- 很不擅長腦補缺失的背景
- 如果你不給它很清楚的下一步，它可以浪費幾小時在跑沒必要的東西

5) **上限還是存在：harness 降低混亂，但不會憑空長出品味**

再好的 scaffolding，也只能讓它不漂移、不要亂改、不要回歸。

但像是「到底要選哪個架構」「要買哪個 tradeoff」這種工程判斷，harness 沒辦法替你做完。

## 我自己的結論（站在要上線的人這邊）

你如果想做能跑好幾個小時、甚至好幾天的 agent，先別再吵 prompt。
你該問的是：

- 成功的 contract 是什麼？
- 最快的 feedback loop 長什麼樣？
- 最小、最乾淨的 failure signal 是什麼？
- 我們要留下哪些 artifacts，才能 replay 和 debug？

因為沒有 harness 的 agent，本質上只是「多包幾層的 model call」。

---

**References:**
- [Anthropic 工程文章：用平行 Claude 團隊打造 C compiler](https://www.anthropic.com/engineering/building-c-compiler)
- [claudes-c-compiler 的 GitHub repo](https://github.com/anthropics/claudes-c-compiler)
