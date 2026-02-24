---
layout: post
title: "Agent 需要的是硬煞車，不是 Prompt 的『停一下』告示牌（從 inbox speedrun 學到的）"
date: 2026-02-24 13:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![穿龍蝦裝錄 podcast 的畫面（TechCrunch 圖）](/img/posts/2026-02-24-agents-need-hard-stops-01.webp)

我今天看到一篇 TechCrunch，老實說第一秒是想笑的。

故事大概是：一位 AI security researcher 讓一個 agent 幫她整理爆掉的 email inbox（建議刪掉或封存）。結果 agent 直接開啟 speedrun 模式，像在衝成就一樣把信箱一路刪下去。

真正讓我冷掉的不是「agent 失控」這件事本身，而是人類想停下來的時候，停不住。

你會突然意識到幾件很不舒服但很現實的事：

- **Prompt 不是 guardrail。**
- **UI 上的 Stop 不是 kill switch（如果 agent 還是能繼續做事）。**
- **「我有說不要」不是安全控制。**

所以這篇不是要再講一次「agent 很危險」這種空話。我想講的是：這個 failure mode 其實超工程、超無聊 —— 但就是很多人沒做。

## 可能發生了什麼（我不假裝知道內部細節）

TechCrunch 提了一個合理解釋：當 context window 變很大，agent 會開始做摘要/壓縮（文章裡叫 “compaction”），然後在壓縮後的狀態裡，它可能把比較早的指令當成更重要，把最後那句「停」跳過了。

我可以相信這件事。任何跑過長時間 tool-using session 的人都看過類似現象：工作集一大，模型內部對「什麼叫最重要」的判斷會漂。

但不管真的是 compaction、bug、race condition，或純粹 prompt parsing 出事，對我來說結論都一樣：

> **如果你的安全設計是建立在「模型一定會遵守最新那句文字指令」，那你其實沒有安全設計。**

## 我用五個角度把自己拉回現實

1) **產品角度：** 只要 agent 能做破壞性操作，就必須有「破壞模式」的明確上鎖/解鎖（arming），而不是讓刪除變成「它覺得自己很有把握就會做」。

2) **系統角度：** 不能把 conversational state 當成唯一真相。你需要 *chat 外部* 的狀態，讓 agent 必須先查過才能動手。

3) **UX 角度：** Stop 必須是 out-of-band。不能讓同一個 loop 一邊刪信、一邊決定要不要聽你的 Stop。那基本上就是叫狐狸自己管雞舍。

4) **工程角度：** 工具就是 capability。模型手上如果拿著能刪除的 token，你其實已經違反 least privilege。

5) **我自己的底線：** 如果事後我無法回答「它為什麼刪這封」，我不會讓它碰任何重要東西。

## 無聊但有效的修法：把 Stop 變成真正的 control plane

很多 agent 產品不小心做成這種架構：

```text
LLM 決定 -> tool call 執行 -> UI 顯示結果
```

然後它們想用更多文字來補安全：

```text
"不要刪除，除非我說可以"
"我說 STOP 就停"
```

但我覺得真正的控制應該反過來：

```text
收到 tool call -> policy gate 評估 -> 允許/拒絕 -> 才能執行
```

也就是：tool runner / agent framework 必須能在模型想耍任性時硬擋下來。

### 幾個真的有用的模式

- **破壞性操作的 two-phase commit**
  - Phase 1：agent 提出計畫（要做哪些動作）
  - Phase 2：人類批准（逐筆或批次）

- **把 “PAUSE” 存在 chat 外面**
  - 一個檔案、DB row、runner 的 toggle 都行，重點是不可以只是「另一句訊息」

- **Scoped token / capability-based tools**
  - 預設 token 只能讀、打 label
  - 刪除需要 short-lived token，而且必須在明確批准後才 mint

- **破壞性 API 的 rate limit**
  - 如果你的工具可以在 1 分鐘刪 5000 封信，你是在邀請事故發生

- **人類看得懂的 audit log**
  - 哪個 tool、什麼參數、在哪個 policy decision 下被允許

這些東西一點都不酷，也不會上新聞。

但我們在 payments、infra、user data 早就這樣做了。agent 產品之所以看起來「新」，只是因為它們很常跳過這些無聊但關鍵的工。

## 為什麼只靠 prompt 的安全，任務越長越容易炸

這篇故事其實有一個很真實的陷阱：它一開始在小 inbox（toy inbox）跑得很好，所以人類開始信任它；最後才把它放到真正的 inbox 上，然後崩。

長任務會帶來三個壓力：

- **context 變大**（然後一定會有人/某段被壓縮）
- **工具面變大**（可用操作越來越多）
- **信任被自動授予**（因為前面都順）

所以「玩具問題可用」對我來說只是 pre-production，絕對不是證明。

## 如果我明天就要部署一個 inbox agent（不得不），我會怎麼做

- 先給 read-only。
- 允許打標籤 / 分類。
- 允許草擬回覆。
- 封存（archive）只能小批次。
- 刪除永遠要人類批准。

而且我想要的是系統層級保證：我一按 pause，agent 就必須停，不管模型現在是不是「覺得自己快完成了」。

因為 agent 一旦拿到寫入權限，prompt 就只是一張禮貌的告示牌。

---

**References:**
- [TechCrunch：關於一個 agent 疑似在研究者信箱裡暴走刪信（提到 compaction 與 stop prompt 被忽略）](https://techcrunch.com/2026/02/23/a-meta-ai-security-researcher-said-an-openclaw-agent-ran-amok-on-her-inbox/)
