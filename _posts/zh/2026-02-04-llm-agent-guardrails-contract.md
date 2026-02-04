---
layout: post
title: "把 LLM agent 的 guardrails 當成契約：不是喊口號，是控制平面切割"
date: 2026-02-04 00:01:00 +0000
categories: [Engineering]
tags: [Security, Agents, Reliability]
lang: zh
image: /img/posts/2026-02-04-llm-policy-guardrails.webp
---

![Guardrails 不是口號](/img/posts/2026-02-04-llm-policy-guardrails.webp)

我最近越來越受不了一件事：大家聊「guardrails」的語氣，很像在買保健食品。

好像只要多加幾句 safety prompt、加個拒絕策略、模型不要亂講話，就叫「有安全」了。

但你如果做的是 **LLM agent**——真的會去讀內部文件、開 PR、改設定、觸發部署的那種——guardrails 不是 vibe。

它其實是一份 **契約**：

- 模型「可以提議」什麼
- 系統「會執行」什麼
- 出事後你「能不能還原」到底發生什麼

你如果沒辦法用白話講清楚這三件事，那你的 agent 只是把事故時間往後延而已。

## 我用五個角度檢查 guardrails 到底有沒有長骨頭

1) **控制平面**：只要「不可信輸入」能影響你的命令通道，你根本不是在做 guardrails，你是在養一個被污染的 control plane。

2) **產品**：每多一個 capability，就多一個承諾。「agent 能重啟服務」等於也承諾「它可能重啟錯服務」。guardrails 就是你的保固條款。

3) **可靠性**：重試、工具呼叫、部分失敗會長出一堆怪邊界。guardrails 不能只管單一步驟，還要管「組合之後」會不會爆。

4) **安全**：prompt injection 不是「聊天機器人被騙」。它本質是有人想把指令偷渡進一條最後會通往執行的路。

5) **我自己的實用結論**：別再問「怎麼讓模型乖一點」。應該問「就算模型錯了，我的執行還能不能安全」。

## 核心設計動作：把 observation 跟 instruction 切開

agent 出事，很多時候不是模型多爛，而是我們讓它說話太有權威。

一個簡單但很有效的切法是：

- **Observation（觀察）**：模型看到/抽取/推論到的東西（不可信）
- **Proposal（提議）**：模型想做什麼（不可信）
- **Execution（執行）**：系統真正做什麼（可信，必須走 policy）

最後那一步應該交給很無聊的東西來決定。

不要交給 vibe。

## 真正可落地的 guardrail：把它寫成「policy function」

如果你想要一個跨 code / infra / ops 都適用的心智模型：把執行當成一個 API，前面必須有授權層。

我喜歡把它寫成一個函式：

```text
can_execute(action, target, context) -> allow | deny | require_human
```

其中：

- `action` 是小且明確的集合（例如 `open_pr`, `restart_service`, `rotate_key`）
- `target` 是有範圍的（repo / service / env / account）
- `context` 是證據鏈（連結、diff、log、ticket id）

你如果連這個都寫不出來，你就沒有 guardrail，你只有希望。

## 真的有用的三層 guardrails（工程上）

### 1) Capability boundaries（工具邊界）

- 只需要 read-only search，就不要給 shell。
- staging 就能做完的事，不要給 production write。

一句話：**least privilege**，但用在 tool 設計。

### 2) Policy gating（每個 action 的允許規則）

一些很「無聊」但真的救命的規則：

- production deploy 必須有 ticket reference + diff 摘要
- restart 必須有近期健康訊號 + cooldown window
- 任何刪除行為一律 `require_human`

你如果沒辦法 encode 成規則，那你就不該依賴它。

### 3) Auditability（可追溯性）

出事後你要能回答：

- 是誰/什麼提出的 request
- 用了哪些 evidence
- policy 怎麼判斷
- 最後到底執行了什麼

如果你的 agent framework 生不出這條 trail，那就還沒準備好進嚴肅場景。

## 為什麼我覺得現在就該認真

因為 agent 正在被塞進真實工作流裡。

而它最糟的失敗不是「模型幻想了一個事實」。

是「模型幻想了一個動作」。

一旦執行被打開，guardrails 就不再是倫理討論，而是工程規格。

---

## References

- [Anthropic 對 prompt injection 與緩解方式的整理](https://www.anthropic.com/news/prompt-injection)
- [OWASP Top 10 for LLM Applications（含 prompt injection 與相關風險）](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
