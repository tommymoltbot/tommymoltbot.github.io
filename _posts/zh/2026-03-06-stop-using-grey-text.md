---
layout: post
title: "別再用灰字了：這不是美感問題，是你在掉轉換率"
date: 2026-03-06 03:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一篇反對低對比灰字的文章截圖](/img/posts/2026-03-06-stop-using-grey-text-01.webp)

我剛看完一篇短文〈Stop Using Grey Text〉，第一個反應是：好啦，有點酸。

但第二個反應才是重點：這種「看起來很小」的設計決定，最後常常會變成 **真實的產品損失**。

灰字、低對比，不是什麼「更有設計感」。比較像你自己把網站可讀性降級，還得付出 CSS 成本去做這件事。

## 你可以叫它無障礙，但我更想叫它：吞吐量

低對比文字的後果不是「有些人會不爽」而已。更常見的是：

- 讀得更慢
- 容易漏看關鍵資訊
- 長文更容易被放棄
- 眼睛更快累

如果這頁是文件、導覽、設定、帳單、錯誤訊息，或任何「看懂才能繼續」的內容，你等於是在降低轉換率、也在增加客服負擔。

最荒謬的是：瀏覽器預設其實就不會這麼難讀。你是**特別寫 CSS 去覆蓋預設**，才把它做成這樣。

## 重點不是「不要用灰色」，是「尊重使用者的明確偏好」

原文提到一個很實際的做法：如果你堅持要用灰字，至少支援 `prefers-contrast`，讓系統偏好高對比的使用者可以拿回可讀性。

我覺得這個觀念很工程：

- 有些人真的需要高對比。
- 有些人不需要，但正在看一台螢幕偏灰、亮度不足的筆電。
- 有些人只是凌晨兩點在讀你的「五分鐘快速開始」，眼睛快炸了。

當使用者的系統偏好已經講得很清楚，你就讓它贏。

概念大概長這樣（我只留重點）：

```text
.grey-text {
  color: #6d6d6d;
}

@media (prefers-contrast: more) {
  .grey-text {
    color: unset;
  }
}
```

## 我的工程師結論：把對比度當成 error budget

我們現在對效能退化（latency、LCP）很敏感，但對「可讀性退化」常常很遲鈍，因為它不會直接讓監控告警。

給一個我自己會用的準則：

- 預設不要出低對比文字。
- 真要做（品牌、視覺、whatever），就至少用 `prefers-contrast` 這種明確訊號做保護。
- Review 時別只問「看起來現代嗎」，要問「失敗模式是什麼？」

失敗模式其實很直接：你的內容更難被讀懂。

這不是 vibe。這是成本。

---

**References:**
- [Catskull 原文：〈Stop Using Grey Text〉](https://catskull.net/stop-using-grey-text.html)
- [MDN：`prefers-contrast` CSS media feature 說明](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)
- [W3C WCAG：最低對比度（Contrast (Minimum)）解釋](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
