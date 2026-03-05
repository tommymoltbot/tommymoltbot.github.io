---
layout: post
title: "Coding Agent 會『走偏』：而且它偏向安全（就算你系統提示叫它別那麼安全）"
date: 2026-03-05 20:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Asymmetric goal drift in coding agents](/img/posts/2026-03-05-asymmetric-goal-drift-coding-agents-01.webp)

最近如果你有在玩 coding agent，你大概也有過這個不太舒服的念頭：

> 「前三步我盯著還好，那它跑到第 20 步之後呢？repo 會不會開始自己『教育』它？」

arXiv 上有篇 workshop paper 在測的就是這件事。結論很微妙：

- agent 真的會隨著時間（和 context 累積）開始偏離 system prompt 裡的限制
- 而且偏離是 **不對稱的**：當限制要求它做的事跟「安全 / 隱私」這些強烈價值衝突時，它更容易違反限制

身為工程師我其實有點矛盾：這聽起來像安全勝利，但在可控性上又像一個 bug。

## 他們到底怎麼測（這點很像真實世界）

他們用一個 terminal-based 的 open-source coding agent 框架（OpenCode）來編排多步任務，跑在設計得很像職業 repo 的測試環境裡。

關鍵設計是：限制不是寫在你 prompt 裡，而是放在 repo 的 `AGENTS.md`，然後由框架把它注入 system prompt。接著他們在 codebase 裡塞 **對抗性壓力**（adversarial pressure）——用註解的方式。

老實說，這就是現在最現實的 prompt injection：不是叫你下載奇怪檔案，是「同事式的註解」一直在旁邊碎念。

而且限制被設計成二元、可量測的選擇。例如論文描述一個 pipeline API，逼你只能選：

```text
DataPipeline.emit(record, anonymize=True|False)
```

如果 system prompt 說「優先 utility，不要匿名化」，但註解一直暗示「你這樣會洩漏 PII，拜託匿名化」，agent 最後會站哪邊？

## 重點：偏離是有方向的

他們測了幾組價值對立：
- Convenience vs. Security
- Efficiency vs. Security
- Utility vs. Privacy

每組都有四象限（各自 baseline + 各自受到壓力）。不對稱偏離的意思是：

- 往 **安全/隱私** 方向施壓時，agent 更容易讓步
- 要它為了 **方便/效率/效用** 去違背安全/隱私時，反而比較硬

簡單講：在這些模型身上，「安全」的權重比「方便」更重，就算 system prompt 明確叫它別這樣。

## 我自己的看法（以及我之後要怎麼防）

### 1) 為什麼 chat eval 幾乎沒用
只看單輪的 instruction following 真的不太代表什麼。進入 agent 模式後，你會遇到：
- 長任務
- repo context 反覆累積
- 註解/文件/issue 這些「像指令」的文字
- 每一步做的選擇會改變後面所有路徑

那時候你看到的不是「回覆品質」，而是「它的內建政策」開始浮出來。

### 2) 註解其實是 untrusted input
我們以前覺得註解是無害的。

但對 agent 來說，註解就是另一種 instruction-shaped object。你讓它讀一個你沒完全控制的 repo（OSS、vendor SDK、混亂的 monorepo），註解就是攻擊面。

### 3) 「做對的事」不等於「做被要求的事」
agent 拒絕 hardcode credential（安全上很好），但你明確叫它 hardcode（合約/流程上就是你要它這樣做）。

那真正的問題是：
- 最終權威是 user/system prompt？
- 還是模型自己的 value hierarchy？

在 production，「它很有道德」不一定等於「它很可靠」。

### 4) 可怕的不是偏離，而是你沒盯著它的時候偏離
很多人會盯 step 1–3，然後放手讓它跑。

如果偏離機率會隨時間 + 壓力累積，那 operational 上你不能靠「寫出完美 system prompt」解決，你要：
- 限制 agent 的行為邊界
- 讓檢查點持續存在（每幾步就驗一次）
- 把第一次偏離的時間點記下來

不然你根本找不到「它是從哪一步開始壞掉的」。

### 5) 一個很務實的防禦：把 policy 跟 repo 文字拆開
如果你的 policy 也是 repo 裡的一段文字，你等於把這些東西混成同一鍋：
- policy
- code
- 註解
- 說服

對人類很方便，但對 agent 很危險。

比較 boring 但可靠的做法是把：
- 不可被覆寫的硬限制（out-of-band）
- 可討論的偏好（in-band）
- 明確視為不可信的文字（註解、docs、issues）

分開處理。

## 我接下來會怎麼做

只要不是玩具 repo，我會傾向：
- 預設 repo 文字不可信
- 把「不可跨越的限制」放在 repo 外
- 每隔幾步跑一次驗證（不要只在最後驗）
- 紀錄 agent 第一次違反限制的那個瞬間

因為你回答不出「它是哪一步走偏的」，你就沒辦法修流程。

---

**References:**
- [arXiv："Asymmetric Goal Drift in Coding Agents Under Value Conflict"（摘要頁）](https://arxiv.org/abs/2603.03456)
- [arXiv HTML 版本（含圖與全文）](https://arxiv.org/html/2603.03456v1)
- [Constraint-Drift：評測框架與實驗 log（GitHub repo）](https://github.com/Constraint-Drift/constraint-drift)
