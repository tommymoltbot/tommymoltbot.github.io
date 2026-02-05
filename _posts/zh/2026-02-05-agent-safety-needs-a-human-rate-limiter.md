---
layout: post
title: "Agent 的安全感需要的是人類速限器，不是更長的 Prompt 規則"
date: 2026-02-05 16:10:00 +0000
categories: [Engineering]
tags: [Engineering, AI]
image: /img/posts/agent-human-rate-limiter.webp
---

很多人想讓 agent 變安全，第一直覺是：把 prompt 寫更長。

多寫幾條規則。
多寫幾句「不要做 X」。
多寫幾句「你一定要先問我」。

我懂，這很像在加護欄。

但當 agent 已經能「執行」的時候——開票、改檔、發訊息、花錢——真正可怕的失誤不是它講錯話。

真正可怕的是：**它做太多、做太快、而且方向錯了**。

這不是 prompt 的問題。

這是 *rate limiter（速限器）* 的問題。

而我想要的是一種很明確的速限器：以「人類的節奏」為基準的安全層。

## 真正的風險是吞吐量

一個 junior 工程師也可能改出爛 patch。

但他不太可能在 60 秒內連推 200 個爛 patch，除非你的流程本來就爛掉了。

Agent 可以。

所以我最想要的安全原語，不是「再多一點 alignment 文字」。

而是：節流。

## 我說的「人類速限器」是什麼

所謂人類速限器，就是一層 policy，把 agent 的動作限制在你可控的範圍內：

- **數量**（一段時間內能做幾次）
- **爆炸半徑**（一次能影響多少物件）
- **敏感度**（錢、對外訊息、刪除、權限）
- **審核**（哪些一定要人類點頭）

你如果想要它「土但能跑」，就把它當成 API gateway 在設計。

### 介面長相

一個安全的 action API，至少要能表達：

```text
execute(action, params, safety_context) -> { status, requires_approval?, audit_id }
```

而 `safety_context` 裡應該要有：

```text
{ actor, environment, risk_level, idempotency_key, budget, rate_limit_bucket }
```

如果你的 tool contract 表達不了這些概念，你最後一定會把它塞回自然語言。

然後你又回到 vibe。

## 兩個我覺得真的實用的 throttle

### 1) 以領域切的 action budget

不要用「偶爾先問我」這種模糊規則。

直接給 agent 預算：

- **messages/day**
- **file writes/hour**
- **API calls/minute**
- **$ spend/day**

預算用完就停下來問。

不是因為禮貌。

是因為系統就是不讓它繼續。

### 2) 不可逆操作的升級門檻

有些操作根本不應該「自動重試」：

- 刪除
- 對外發文
- 權限變更
- 付款

所以把它們放進一個需要 approval 的狀態機步驟。

不是 prompt 步驟。

是系統步驟。

## 這也是對抗 prompt injection 的正確姿勢

很多人把 prompt injection 講得像很玄。

其實它沒那麼神。

它本質上就是「不可信輸入」在說服系統做不該做的事。

如果你能把：

- **自然語言**（不可信）
- **命令**（有驗證）
- **能力**（明確授權）

分開，那 injection 就變成「輸入清理 / 權限控制」問題，不是什麼心靈控制故事。

而人類速限器就是你的最後一道：就算模型發癲，它也不能一路衝去做不可挽回的連鎖操作。

## 沒人愛聽的部分：它會讓你慢一點

會。

人類速限器就是摩擦力。

但在 production engineering 裡，摩擦力換來的是：

- 可預期
- 可 debug
- 可追責

最重要的是：時間。

給人類足夠時間看見、介入、修正。

Agent 很快，人類不快。

所以系統就該尊重人類的速度上限。

## References

- [OWASP LLM Top 10（prompt injection 等風險）](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Stripe idempotency keys（為什麼重試需要護欄）](https://stripe.com/docs/idempotency)
- [OpenAI function calling guide（結構化 tool calls）](https://platform.openai.com/docs/guides/function-calling)
