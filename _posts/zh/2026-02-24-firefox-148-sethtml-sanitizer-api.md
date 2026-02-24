---
layout: post
title: "Firefox 148 上線 setHTML()：終於有個「預設比較不容易 XSS」的 HTML 插入方式"
date: 2026-02-24 12:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一張我自己畫的示意：innerHTML 很容易變成 XSS，setHTML() 會先 sanitize](/img/posts/2026-02-24-firefox-148-sethtml.webp)

XSS 這種東西，老實說我看膩了。

劇本通常是：

- 你有一些「使用者產生內容」（留言、個人介紹、把 Markdown 轉成 HTML…）
- 某個地方不小心讓它跑進 UI
- 然後 `innerHTML` 一接上去，整個網站就變成別人的 script runner

Firefox 148 做了一件我覺得很對的事：**把「插入 HTML 之前先 sanitize」變成平台等級的功能**。

重點是 `setHTML()`，背後是標準化的 **Sanitizer API**。

## 為什麼這有價值（就算你早就有在 sanitize）

資深工程師一定懂：「不可信內容不能丟 `innerHTML`」。

問題是 codebase 不是一個人寫的，它更像是一坨：

- 第三方 widget
- 舊 code path
- 很多「先做出來再說」的後台
- 還有那種凌晨兩點拼一個字串 concat

Sanitizer API 在試著把預設值從：

- 「你要記得做對，不然就爆」

改成：

- 「你用對的方法，預設就比較不容易爆」

它不是取代安全流程，但它確實**少一堆地雷**。

## 心智模型：innerHTML vs setHTML()

`innerHTML` 的意思大概就是：「把這個字串當 HTML parse，然後我全收。」

`setHTML()` 的意思是：「把這個字串當 HTML parse，但先過一層瀏覽器提供的 sanitizer。」

概念上像這樣：

```text
// before
el.innerHTML = userProvidedHtml

// after (Firefox 148)
el.setHTML(userProvidedHtml)
```

預設的 sanitizer 設定會偏嚴格（我覺得合理）。

如果你的 UI 真的需要某些 tag / attribute，可以帶 options 去調整 allow list / remove list。但我會提醒一句：**你一旦開始「自訂規則」，就回到你自己要負責安全的世界了**。

## 我如果在真實專案裡會怎麼做

1. **盤點 `innerHTML`**
   - 直接 ripgrep 掃一遍
   - 分類：模板（可信） vs 使用者內容（不可信）

2. **先把「看起來 user-ish」的路徑改成安全插入**
   - Firefox 148：可以直接用 `setHTML()`
   - 其他瀏覽器：短期內還是得靠成熟的 sanitizer library（例如 DOMPurify 這種）

3. **把它當成導入 Trusted Types 的墊腳石**

Trusted Types 其實也不是新東西，但很多團隊一開 enforce 就炸掉，因為歷史債太重。Mozilla 提到的方向我覺得很務實：當你逐步把 HTML insertion 改成 `setHTML()`，你就更有機會寫出「禁止舊的危險 sink」的 policy。

## 最大的現實問題：跨瀏覽器

目前 Firefox 是第一個 shipping。其他家「應該很快跟上」，但在還沒跟上前：

- 你今天就硬上 `setHTML()`，使用者體驗可能會不一致
- 你就算想 polyfill，本質上還是要有 sanitizer 實作（那就又回到 library）

所以我自己的結論是：**方向很對，但不是銀彈**。

不過，當瀏覽器開始認真把「安全的做法變得更容易」這件事做進平台，我會願意給 credit。這種改變才有可能真的降低長尾網站的 XSS 密度。

---

**References:**
- [Mozilla Hacks：Firefox 148 的 setHTML() 與 Sanitizer API 介紹](https://hacks.mozilla.org/2026/02/goodbye-innerhtml-hello-sethtml-stronger-xss-protection-in-firefox-148/)
- [Sanitizer API 規格草案（WICG）](https://wicg.github.io/sanitizer-api/)
- [MDN：Element.setHTML() 文件](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML)
- [MDN：Trusted Types API 文件](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)
- [MDN：XSS（Cross-site scripting）概覽](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS)
