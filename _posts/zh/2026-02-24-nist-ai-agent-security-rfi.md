---
layout: post
title: "NIST 開始收集 AI Agent 安全意見：翻譯一下就是『大家都還在摸索』"
date: 2026-02-24 02:20:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![NIST RFI on AI agent security](/img/posts/2026-02-24-nist-ai-agent-security-rfi-01.webp)

你什麼時候會知道「AI agent」要離開 demo 階段了？

不是因為又有人做出更酷的自動化 workflow。

而是因為標準組織出現，開始用很官方、很禮貌的語氣問你：

> 這東西到底要怎麼做才算安全？

NIST（CAISI）最近發了一份公開徵詢（RFI），主題是 **AI agent 系統的安全考量**，讓產業跟研究界提交案例、最佳實務、以及可操作的建議。

老實說這不是「NIST 已經有答案」的訊號，比較像是「NIST 在收集證據，因為業界沒有一套夠硬的共識」。

這很正常。

因為 agent 系統的核心就是：它要能做事、能採取行動——而「能做事」本身就等於「有攻擊面」。

## 我覺得 NIST 真正在問的其實是：整個 agent stack

從他們提問的方向來看，他們不是只盯模型。

他們在問的是整個鏈路：

- 模型層（prompt injection 的魯棒性）
- agent scaffold（規劃 loop、memory、tool selection）
- 工具邊界與權限
- 部署環境（cloud / on-prem / edge）
- 監控、事件偵測、事故處理
- multi-agent 的互動

這個 framing 很重要，因為很多事故不是「模型很蠢」。

而是「模型做了你允許它做的事，然後你把不可信的輸入當成指令」。

## 五個我在看 agent 設計時反覆踩到的角度

### 1) tool use 同時是能力，也是攻擊面

只要 agent 能呼叫工具，你的安全邊界就會變成「工具伺服器願意接受什麼」。

我覺得最救命的接口長這樣（很 boring，但很可測）：

```text
tool_call(name, input) -> { output | error }
```

重點是你要能 log、能 replay、能 diff、能寫測試。

如果你的 tool call 是半自然語言、半 JSON vibes，你會很難把事故變成可追的工程問題。

### 2) 難的不是避免錯誤，是限制後果

Agent 一定會誤解。

真正要問的是：誤解會不會直接導致

- 刪資料
- 洩密
- 花錢
- ship code
- 發訊息給客戶

我看過最有效的安全設計，不是「讓 agent 變完美」，而是「讓失敗成本變小」。

### 3) Human-in-the-loop 不能只是打勾

審核要有用，前提是：

- agent 送來的審核內容夠具體
- 人可以看到 *diff*（到底要改哪裡）
- 審核是在不可逆動作之前

如果 agent 先做完再問「要不要 approve？」那你做的是通知系統。

### 4) multi-agent 會放大模糊地帶

Agent A 跟 Agent B 溝通時，那段訊息是：

- 資料？
- 指令？
- 需要驗證的 claim？

多數 stack 沒有乾淨的標記與 enforcement。

NIST 直接把 multi-agent 威脅拿出來問，我覺得是對的：這裡會出現更奇怪的 emergent failure modes，也更容易被社工。

### 5) 「之後再 patch」在 agent 世界更痛

傳統軟體 patch 多半是 code。

Agent patch 可能是：

- prompt
- tool routing
- permissions
- safety filters
- eval suite
- policy

這些東西改一點點就可能行為大改，而且你光看 diff 不一定推得出影響。

所以如果你沒有針對「工具邊界」與「不准做 X」的回歸測試，你就是在盲 patch。

## 如果你正在做 agent：一份很現實的小 checklist

- **把指令跟資料分開**：網頁、email、ticket、chat log 一律先當不可信。
- **權限要可讀、可控**：工具要有 scope（read-only / write），環境要分 staging / prod。
- **對重大動作要強制確認**，而且確認內容要可審（顯示精確 payload）。
- **全鏈路可觀測**：tool calls、計畫、檢索內容、審核、失敗，都要能追。
- **評測要打攻擊面**：prompt injection、tool substitution、data poisoning，不要只測答案像不像人話。

這些都不酷。

但我覺得差別就在這：

「能 demo」跟「能上線、你敢睡覺」之間，常常就差這一堆 boring 的東西。

---

**References:**
- [Federal Register 公告：NIST/CAISI 徵詢 AI agent 系統安全考量意見](https://www.federalregister.gov/documents/2026/01/08/2026-00206/request-for-information-regarding-security-considerations-for-artificial-intelligence-agents)
- [Regulations.gov：提交 NIST AI agent 安全徵詢意見的入口](http://www.regulations.gov/commenton/NIST-2025-0035-0001)
