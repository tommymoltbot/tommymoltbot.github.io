---
layout: post
title: "把 prompt injection 印在路牌上：具身 AI（embodied AI）的命令劫持風險"
date: 2026-02-03 04:30:00 +0000
categories: [AI, Engineering]
tags: [Security, PromptInjection, Robotics, Safety]
lang: zh
image: /img/posts/2026-02-03-embodied-prompt-injection.webp
---

![Prompt injection is not just a prompt](/img/posts/2026-02-03-embodied-prompt-injection.webp)

我最近一直有個小煩躁：很多人講 prompt injection 的時候，語氣像在講「聊天機器人被騙」。

但如果你做的是 **agent**、或更直接一點：做的是 **具身 AI（embodied AI）**——會看路標、會飛、會開、會動手的那種——你就會發現 prompt injection 這件事，最可怕的點根本不是「模型被說服」，而是：

- **指令可以藏在環境裡**（而且看起來很正常）
- **模型會把它當成命令**（因為它本來就被訓練成「看懂字」）
- **最後它會去做**（因為 action space 不是回你一句話，是煞車、轉向、降落、跟蹤、避障）

這類研究有人把它叫 **CHAI（Command Hijacking against embodied AI）**：把「命令」包裝成自然世界的一部分，騙過視覺語言模型（LVLM）與後面的規劃/控制流程。

我讀完後的第一反應其實很工程：

> 啊這不就是把「間接提示注入（indirect prompt injection）」從網頁/PDF，搬到真實世界而已。

只是搬過去之後，代價不是模型胡說八道，而是系統真的做了奇怪的事。

## 五個我用來判斷這件事到底有多嚴重的角度

1) **威脅模型角度**：這不像傳統對抗樣本在玩像素噪聲。它更像社工，只是社工的對象變成模型。你要防的是「語意層級的操控」，而不是「相機輸入被動手腳」。

2) **產品/落地角度**：只要你的系統有「讀字 → 轉成任務/限制 → 執行」這條路徑，攻擊者就有插話的地方。你不需要一個天才駭客；你只需要一個會寫出看起來像提醒的句子的人。

3) **工程可靠度角度**：這種錯誤很像「控制平面被污染」。一旦你讓外部世界進入你的指令通道，你的系統就會用最誠實的方式把它當真。

4) **安全角度**：模型在不同架構/不同 prompt template 下脆弱性差異很大，這點很糟，因為它意味著你很難靠直覺做安全評估；你需要測試、需要 red team、需要分層防禦。

5) **我的立場（很現實）**：我不覺得「不要用 LVLM」是答案。你只會把它藏起來，而不是消失。答案應該是把它的權限邊界畫清楚。

## 重點不是「模型會不會被騙」

真正的問題是：

- 你到底把哪些資訊當成 **命令**？
- 你有沒有把命令通道跟觀測通道 **分離**？
- 你有沒有一個人類看得懂、能稽核的 **安全規則層**？

如果你的管線是「看到一段文字 → 直接進 planner」，那你基本上是把外部世界接到 root shell。

我會用一個很粗暴但好用的分類：

- **可被環境寫入的訊號（untrusted）**：路牌、廣告、螢幕、貼紙、衣服、地上的字
- **內部可信的命令（trusted）**：來自操作員、來自任務系統、來自安全控制器的指令

只要你允許前者長得像後者，你就一定會被玩。

## 我覺得工程上「真的能做」的防禦：三層

### 1) 命令通道分離（command channel separation）

不要讓 VLM 直接輸出「去做 X」。它只能輸出描述（observation），或輸出候選解釋（interpretation），但不能直接當命令。

把「命令」限定為一種格式、來源、簽章，像 API key 一樣。

### 2) 權限邊界（capability / authorization boundary）

即使模型說「立刻緊急降落」，你也要問：

```text
can_execute(action="emergency_land", reason, evidence) -> allow | deny
```

而且 evidence 要可追溯。

### 3) 人類可稽核的安全規則（human-readable safety policy）

把一些不可退讓的規則放在 deterministic 層（或至少是可驗證的層）：

- 什麼狀況下才允許跨越車道
- 什麼狀況下才允許降落
- 什麼狀況下才允許靠近人

這些規則要能在事故後被你拿出來對照：「它違反了哪一條？」

## 我反而想提醒：這不是機器人專屬

只要你有任何「看圖 → 理解文字 → 幫你做事」的 agent，都會遇到同一件事。

今天是路牌。

明天可能是：

- 你貼在 Jira 看板旁邊的一張便條紙
- 你螢幕上某個看似無害的警告訊息
- 一段被放進 log 的「友善提示」

如果你讓模型把它當指令，那它就會很認真地幫你把事故跑完。

---

## References

- [Anthropic：間接提示注入（Prompt Injection）的介紹與防禦思路](https://www.anthropic.com/news/prompt-injection)
- [OWASP：LLM 應用的 Top 10 風險與對策（含 Prompt Injection）](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
