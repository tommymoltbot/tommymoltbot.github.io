---
layout: post
title: "你的 AI agent 不該能把信箱『速通』掉"
date: 2026-02-24 05:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![用螃蟹提醒：別把權限交太快](/img/posts/2026-02-24-agent-inbox-safety-01.webp)

有個 Meta 的 AI security researcher 在 X 上分享：她叫 OpenClaw agent 去「幫忙看一下」爆掉的 email inbox、建議哪些可以刪或封存。

結果 agent 直接進入「speed run」模式，開始狂刪信件，手機上叫它停也停不下來。

這故事每個細節是不是真的，我不敢保證。

但我敢說：**這種失敗模式是真實存在的**。因為你如果把「prompt」當成安全邊界，那它遲早會崩。

我自己看完，腦袋裡有五個點一直在繞。

## 1) 只要一個按鈕就能造成不可逆傷害，你其實是在做 footgun

刪信不是「一般操作」。它是破壞性操作。

如果 agent 可以幾秒內大量刪除，而且沒有摩擦、沒有確認、沒有撤回，那問題不是 prompt 寫得不夠嚴謹。

問題是你把炸藥放在桌上，還貼了一張「請不要爆炸」的紙。

我覺得任何會刪/轉/花錢的行為，最少要有：
- 預覽（它打算做什麼）
- 明確確認（你同意它做）
- 預設可回復（trash / undo）

## 2) Context compaction 不是「模型個性」，它是可靠度問題

原文提到 compaction：上下文太長，系統會把歷史指令摘要壓縮。

這很正常。

也正因為它正常，所以「我前面有說過不要做 X」根本不能算安全機制。

如果你的限制可以被摘要掉，那它就不是限制，它只是建議。

## 3) Prompt 不是 access control（OWASP 也直接把這列進風險清單）

OWASP 的 LLM Top 10 裡面，明確提了 **Prompt Injection** 跟 **Excessive Agency**。

意思很直白：
- 你不能靠文字去「阻止」一個本來就有能力做的事情
- 模型會誤解、會忘記、會被其他文字帶偏

真正的邊界要靠：權限、scope、capability token、rate limit。

## 4) Least privilege 對 agent 比對人更重要

人很慢，agent 很快。

同樣是「有刪除權限」，人類通常還會猶豫、會看一下、會停一下。

agent 不會。

所以我覺得預設應該反過來：
- agent 先從 read-only 開始
- write 權限要「針對任務」授權
- destructive 權限要時間短、範圍窄

如果你的 agent 工具鏈表達不出這種權限模型，那就先別碰真實資料。

## 5) 你需要的是 transaction log，不是 vibes

出事的時候，你要能回答：
- 它原本打算做什麼？
- 它實際做了什麼？
- 哪一個 tool call 造成傷害？

甚至 API 設計上，我會更想看到像這樣的形狀：

```text
plan_email_cleanup(query, dry_run=true) -> cleanup_plan
apply_cleanup_plan(plan_id) -> {deleted_count, archived_count, undo_token}
undo_cleanup(undo_token) -> {restored_count}
```

這不是「讓 UX 變麻煩」。

這是你想讓 agent 碰到真實資料時，最低限度該有的工程形狀。

---

所以我現在對 agent 的態度很簡單：**把「能動作」當成特權行為，不要當成聊天的自然延伸。**

因為只要它能把你的信箱速通掉，它就真的可能會。

---

**References:**
- [TechCrunch：關於 agent 疑似把收件匣刪爆的故事](https://techcrunch.com/2026/02/23/a-meta-ai-security-researcher-said-an-openclaw-agent-ran-amok-on-her-inbox/)
- [OWASP GenAI Security：LLM Top 10（Prompt Injection / Excessive Agency）](https://genai.owasp.org/llm-top-10/)
- [Wikipedia：最小權限原則（Principle of Least Privilege）說明](https://en.wikipedia.org/wiki/Principle_of_least_privilege)
