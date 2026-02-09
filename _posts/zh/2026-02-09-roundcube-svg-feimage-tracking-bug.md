---
layout: post
title: "Roundcube 的 SVG feImage 漏洞：為什麼你以為的『封鎖遠端圖片』其實還在載入"
date: 2026-02-09 09:05:00 +0000
categories: Engineering
tags: Engineering
author: Tommy
excerpt: "Roundcube 的 HTML sanitizer 把 <feImage href> 當成一般連結處理，沒走『圖片來源要擋遠端』的那條路，結果就能繞過遠端圖片封鎖用來追蹤開信。這種小洞，很典型。"
image: /img/posts/2026-02-09-roundcube-svg-feimage.webp
---

Email client 有一個功能，聽起來很讓人安心：

「封鎖遠端圖片」。

你會以為這代表：就算你打開一封可疑的信，它也不該偷偷去打某個 server，回報 *喔這個人幾點幾分開信、IP 是多少、所在地大概在哪*。

但 Roundcube Webmail 最近有個漏洞，會把這個承諾打穿一個很怪、但很真實的洞：攻擊者可以用 SVG 的 `feImage` 元素塞一個遠端 URL，而 Roundcube 的 HTML sanitizer 會意外放行。

不是 XSS、不是 RCE。

只是追蹤。

也正因為只是追蹤，所以它更像現實世界會發生的事情。

## 一句話講清楚問題

Roundcube 的 sanitizer 其實分兩條路處理 URL：

- 「圖片來源」應該走一條比較嚴格的路，會擋掉外部 URL
- 「一般連結」可以走比較寬鬆的路，允許 `http/https`（因為那是使用者點了才會開）

`<feImage href="https://...">` 被誤判成「一般連結」，所以就被放行了——即使使用者有開啟封鎖遠端圖片。

官方修在 **1.5.13** 與 **1.6.13**。

## 這就是 allowlist 常見的失敗方式

我越做越覺得，HTML sanitizer 本質上就是：

「一堆特例規則黏在一起」。

一開始很合理：

- 允許哪些 tag
- 允許哪些 attribute
- 某些 attribute 要額外檢查

然後 SVG 來了。

SVG 不是「一個 tag」。它是一個完整宇宙，而且很多元素在一般 email 裡很少見。

只要你是手刻 allowlist，你就很容易漏掉某個冷門元素——像這次的 `feImage`。

結果就是：`href` 只有在某幾個 SVG 元素（例如 `image`、`use`）會被當成「圖片來源」處理，`feImage` 沒被列進去，就掉到「一般連結」那條寬鬆路徑。

## 影響到底有多大（為什麼我在意）

這種洞不太會上新聞，但很實用：

- 攻擊者可以確認你有開信
- 可以記錄你的 IP（粗略定位）
- 甚至可以看 user agent、做一些行為指紋

在企業環境裡，「某個人開了某封信」有時候就足夠讓攻擊者把下一步做得更精準。

不是因為它多高深。

而是因為人類很好預測：你開過一次，你可能會再開一次。

## 工程上的教訓：UI 給的是保證感，但底層是分類邏輯

當 UI 寫「封鎖遠端圖片」，使用者會把它當成**保證**。

但底層其實只是程式碼：分支、regex、例外情況。

資安很多時候不是死在「明顯危險的功能」。

而是死在：

- 分類錯誤（classification mistake）
- 兩條路徑一條嚴格、一條寬鬆
- 某個 input 被送錯路徑

如果你在做任何 untrusted input 的 sanitize，你應該預設：

- 攻擊者一定會找到你沒測到的冷門 tag
- 「遠端資源」不只 `<img src>`
- SVG 會把你原本乾淨的心智模型搞爛

## 如果你在用 Roundcube

解法很無聊，但很正確：

- 升級到 **1.5.13** 或 **1.6.13**

如果你短期真的升不上去，可以把 sanitizer 調得更激進（代價是更多 HTML email 會壞掉），但長期還是要吃上游修補。

因為真正的問題不是這個 tag。

真正的問題是：你漏掉任何一個 tag，都可能變成下一個「我以為封鎖了」的洞。

---

### References

- [NULL CATHEDRAL 的完整技術分析與 PoC（含 sanitizer 走錯路徑的原因）](https://nullcathedral.com/posts/2026-02-08-roundcube-svg-feimage-remote-image-bypass/)
- [Roundcube 修補 feImage 分類問題的 commit（看得到修法很直白）](https://github.com/roundcube/roundcubemail/commit/26d7677471b68ff2d02ebe697cb606790b0cf52f)
- [Roundcube 的安全更新公告（提供前因後果脈絡）](https://roundcube.net/news/2025/12/13/security-updates-1.6.12-and-1.5.12)
