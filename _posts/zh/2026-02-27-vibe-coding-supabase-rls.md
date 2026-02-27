---
layout: post
title: "Vibe Coding 上線到 Production：Supabase RLS 不是選配"
date: 2026-02-27 18:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張用概念圖表現「prompt 變成 production code」的插圖](/img/posts/2026-02-27-vibe-coding-supabase-rls-01.webp)

有一種 bug 會讓我很快不耐煩：**看起來功能都正常，demo 很漂亮，但安全邏輯直接反過來，然後就被丟上 production。**

最近有人聲稱在一個 Lovable-hosted 的 app 裡，挖到一堆基本漏洞，導致約 18K 使用者資料外洩；根因不是什麼高深的 0-day，而是「Supabase 後端看起來有 auth，但關鍵的安全措施（像 RLS、權限判斷）沒有正確落地」。

我覺得最刺眼的是這種失敗模式：

```text
if 使用者已登入:
  拒絕
else:
  放行
```

這不是什麼微妙的邊界情況，這是 **邏輯翻轉**。人類 reviewer 看到大概 5 秒就會皺眉 —— 前提是你真的有 reviewer。

Vibe coding 在這裡撞到現實：production 不在乎你 UI 多像一個「完成品」。

## 1) 問題不只在模型，而是產品給人的錯覺

如果一個平台主打「production-ready、auth included」，大多數人腦中會自動完成一句話：

-「有登入」→「資料就安全」

但在 Supabase（其實在多數後端）世界裡，**authentication 跟 authorization 是兩件事**。
你可以有登入頁、可以有 JWT，但還是可能：

- table 任何人都能讀
- RPC endpoint guest 也能打
- 所謂「admin-only」其實守門條件寫錯

UI 很吵；安全姿態很安靜。
Vibe coding 會把這個失衡放大。

## 2) Supabase 的 RLS 很強，但把它當「之後再補」就是自殺

RLS（Row Level Security）本質上是：你把「誰能看/改哪些 row」這件事交回給資料庫。
這很棒，但也很殘酷：**你沒寫 policy，就等於沒有。**

真正的問題不是 RLS 很難寫，而是「最省力的路」太誘人：

- 先把功能做出來（看起來能用）
- 權限 policy 之後再說（反正先上線）
- 然後你有了使用者、有了需求、有了壓力…就沒有然後了

所以我自己的立場很簡單：**如果平台在生成 Supabase app，RLS 應該要預設開啟，而且要 failure-closed。**
安全的路不能是進階選項。

## 3) 「我們有掃描」不等於你有安全策略

平台很愛講：「發佈前會做安全掃描，會給建議。」

OK。
但如果你把受眾拉到「不懂安全的人也能出 app」，那一個「建議清單」其實不太像 guardrail，比較像貼心提醒。

掃描告訴你「缺 RLS」，就像對新手說「建議有煞車」。
技術上沒錯，但也有點荒謬。

你要讓 prompt-driven builder 真的不翻車，**平台要做的是：把危險的預設值關掉。**

## 4) 追究責任以前，先把預設行為改掉

是的，app owner 對他上線的東西負責。

但如果平台：
- 幫你 host
- 幫你曝光（Discover / showcase）
- 又用「auth included」這種話暗示「已經幫你處理好了」

那再說「都是使用者要自己負責」其實滿難讓人信服。

重點不是 blame game。
重點是：**什麼預設行為可以把這類事故直接消滅？**

因為 production 的爆炸半徑，不會管到底誰該背鍋。

## 5) 給 vibe-coded backend 的無聊但有效 checklist

如果你要上線任何會碰到使用者資料的東西，我會把底線畫在這裡：

- **預設拒絕存取**（先 policy / RLS，後功能）
- **用 guest 身分實際去打 API、去撈資料**（不要只看 UI）
- **每個特權操作至少加 1 個 negative test**（例如「非 admin 不能刪人」）
- **對高風險 endpoint 做 logging + rate limit**（大量寄信、刪帳號、匯出資料）
- **不要把 auth 當 feature** —— 它是邊界

這些都不酷，也不會讓你在 demo 時多一個按鈕。
但它們決定了你是「像個產品」還是「像個事故前夜」。

我比較大的擔心是：vibe coding 正在教一堆人錯的直覺 —— 只要「看起來完成」就算完成。

Production 剛好相反。
你要追的是「出事時能安全地失敗」。

---

**References:**
- [The Register 對 Lovable-hosted app 因基本安全缺失導致約 18K 使用者暴露的報導](https://www.theregister.com/2026/02/27/lovable_app_vulnerabilities/)
- [Supabase 官方文件：Row Level Security（RLS）與 policy 設計](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [OWASP Top 10 概覽（Broken Access Control 為什麼一直反覆出現）](https://owasp.org/www-project-top-ten/)
