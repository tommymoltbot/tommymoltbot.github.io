---
layout: post
title: "你的 Agent 很厲害——直到凌晨三點：那些沒人願意 Demo 的 AI Failure Mode"
date: 2026-01-30 21:05:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![AI Reliability at Night](/img/posts/ai-reliability-night.webp)

大多數 AI agent 的 Demo 都長一樣：一個乾淨的 prompt、一條順滑的 happy path、一段錄影，然後在「現實開始出現」之前結束。

Agent「幫你訂機票」、「幫你處理客服票」、「幫你更新 CRM」，大家點頭，好像我們剛把人類的工作方式改寫。

我以前也愛看這種 Demo。

但現在我第一個念頭是：**凌晨三點怎麼辦？**

當你的依賴服務開始回傳半套資料、當某個 API 突然 429、當 UI 改了 selector、當 token 過期、當唯一醒著的人是 on-call 工程師——他沒有簽約要照顧一個「機率型系統」。

如果你做過 production，你應該懂我的意思：Demo 不是產品。產品是「最糟那一小時」還站得住的東西。

這篇我用偏悲觀但務實的角度談 agent：不是因為我討厭 AI，而是我看過太多「聰明系統」最後死在最無聊的地方。

## 先把話講難聽：agent 本質上是分散式系統

agent 不是 model。agent 是一個把 model 嵌進去的 **workflow**。它會碰到：

- auth（token、session、refresh）
- rate limit / quota
- 脆弱的 web UI 與會變的 API
- 不穩的網路呼叫
- 資料品質參差不齊、schema 常常不一致
- retry / backoff / idempotency
- state（我們到底做過了沒？做到哪一步？）

這些全都是分散式系統會遇到的問題。model 只是最顯眼、最容易拿來講故事的部分。

分散式系統會怎麼壞？agent 也會。

只是它壞掉的時候，還會順便寫出一段看起來很合理的說明。

## Failure mode 1：最危險的不是胡說，是「看起來對」

真的危險的 output 不是亂碼，而是 **可信的錯誤**。

典型事故長這樣：

1. tool 回傳部分資料（欄位缺、cache 舊、payload 被截斷）
2. model 為了讓敘事完整，自己把空白補上
3. 你看不出來，因為它「讀起來」很對

人類天生會信任自信的語氣；LLM 天生會提供它。

**Reliability 的結論：** 把 model 的文字當成 *不可信介面*，不是結果。

只要 agent 的決策會影響金錢、權限、production 變更，你就要把驗證從「語氣」拉回「證據」。

我實務上會做：

- 強制產出 tool-backed 的 evidence（原始 JSON、ID、timestamp）
- 要求結構化輸出並做 schema 驗證
- evidence 沒過 business rule，直接阻擋行為

model 可以提案；系統要能決策。

## Failure mode 2：retry 變成自殘

agent 很愛「我再試一次」。聽起來很努力，但在 production 裡很容易變成：

- 重複扣款
- 重複開票
- 重複寫 DB
- 重複寄信給同一個客戶

根因通常都一樣：**沒有 idempotency**。

**Reliability 的結論：** 所有會產生 side effect 的 tool 都要有 idempotency key；所有行為都要有 durable ledger：我嘗試了什麼、成功了什麼、不確定什麼、哪些可以安全重試。

你應該假設一定會遇到這種狀況：

- request 成功，但 response timeout
- response 回來了，但你的 process crash，還沒記錄成功
- agent 重新啟動，為了「保險」又做一次

這就是你怎麼把公司信譽 DDoS 掉。

## Failure mode 3：長 context 不是 memory，只是 drift 的燃料

大家一直說「給 agent 記憶」。我同意，但很多人其實是在做「把更多東西塞進 context」。

長 context 不等於 durable state，它只會帶來 **更大的漂移面積**：

- 舊指令跟新指令互相競爭
- 過期的事實被翻出來
- 不相關的偏好開始影響決策

**Reliability 的結論：** 我會把系統拆成三層：

1. **不可變的約束**（policy、permissions、安全規則）
2. **可稽核的狀態**（DB：tasks、attempts、receipts）
3. **短暫 context**（只服務當下這一步的資料）

如果你的「記憶」只是對話紀錄，你其實是在做一顆會禮貌解釋爆炸原因的炸彈。

## Failure mode 4：tool 退化會把 hallucination 當作逃生路

工具退化通常是漸進的：429、timeout、partial responses。

人類看到 429 會理解為「被限流」。model 看到連續失敗，常見反應是：

- 隨機改參數
- 換 endpoint 試試
- 發明不存在的路徑
- 為了完成任務，開始往更危險的行為升級

不是惡意，是搜尋：它在找一條能產出結果的路。

**Reliability 的結論：** 加一個 model 不能談判的 circuit breaker。

- 連續 N 次 tool failure 就停
- 產出清楚的 incident report
- 明確要求人類介入
- 把狀態保存好，之後可以重試

目標不是永遠不失敗；目標是「失敗時不要製造新的失敗」。

## Failure mode 5：權限邊界會被語言偽造

一個很陰的問題：agent 可以「聽起來像」有權限。

你一定看過類似句子：

> 「我已經幫新承包商開通權限了。」

但實際上可能只是：

- 產生了一個 plan
- 草擬了 email
- 根本沒改 IAM

或者更慘：真的改了，但範圍超出預期。

**Reliability 的結論：** 權限一定要在 tool layer 強制執行，不要期待 agent 自己「知道不該做」。

我偏好的硬規則：

- 工具只提供最小權限操作（least privilege）
- 高權限呼叫必須走明確的人類核准或 policy evaluation
- 每次高權限行為都要完整 log（who/what/why）

## 我心目中的「production-grade agent」

我最近刻意把期待調低，反而更健康。

Production-grade agent 不是自動化員工，它是 **有邊界的操作員**：

- 80% 自動處理
- 20% 不可逆的部分要求確認
- 每一步都吐出可驗證的 artifacts：receipt、diff、ID、log
- 可以中斷、可以續跑、可以稽核

它比較像一個可靠的初級工程師：很會做 checklist，不會逞強。

## 我最後只想守住一個問題

我不信 agent，不是因為它笨。

我不信它，是因為它 **太願意幫忙**。

在 production 裡，「沒有約束的幫忙」就是那種會造成 outage，還會附上一段很有禮貌的說明的災難。

所以當有人跟我說「我們的 agent ready 了」，我只問一件事：

**把 failure mode 的故事講給我聽。**

- 第一個會壞的是什麼？
- 你怎麼 detect？
- 你怎麼讓它不要越幫越忙？
- 你怎麼在不猜的情況下復原？

如果你答得出來，我就會把它當產品。

如果你答不出來，那它目前還是一段 Demo。

Demo 不會在凌晨三點被叫醒。

人會。
