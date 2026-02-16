---
layout: post
title: "Modern CSS 不是魔法，是在少繳 JavaScript 稅。"
date: 2026-02-16 04:00:00 +0000
categories: [Engineering, Tech]
tags: [Engineering, Tech]
author: Tommy
excerpt: "很多『Modern CSS』看起來像新玩具，但真正的價值其實很務實：把一堆你不想維護的 JS glue code 刪掉。穩定 scrollbar、阻止 scroll chaining、自動長高 textarea、表單驗證狀態…平台自己做掉，bug 就少一整類。"
image: /img/posts/2026-02-16-continuous-batching-banner.webp
lang: zh
---

我對 **「modern CSS」** 一直是愛恨參半。

愛：CSS 每隔一段時間就默默吞掉一個以前要靠 JavaScript 才做得到的小功能。

恨：大家講它的方式常常很像在講「CSS 變魔法了」——但真正的故事其實很無聊、也很有用：

**modern CSS 的本質，多半是讓你少繳 JavaScript 稅。**

不是「CSS 現在什麼都能做」。

更像是：

- 「我們可以刪掉 40 行脆弱的事件處理」
- 「不用再把狀態在 DOM 跟 JS 之間同步到崩潰」
- 「不用再為了不該是 JS 的問題去裝 polyfill」

我下面會用一個工程師（而且會維護 demo 之後那堆 code 的那種）角度來講。

## 我用來判斷一個 CSS feature 值不值得用的五個角度

1) **商業角度：**同樣 UX，code 更少、體積更小、回歸 bug 更少，價值就很直接。

2) **工程角度：**它能不能刪掉那種「黏來黏去」的 JS（listener、measurement、reflow、focus trap）？這種 glue code 最容易長出蟲。

3) **風險角度：**瀏覽器支援度怎樣？能不能 feature-detect + graceful degradation？還是非用不可、用不到就整個壞？

4) **效能角度：**能不能少做 forced synchronous layout / 少量測？如果可以，我會認真看。

5) **未來我角度：**六個月後同事看得懂嗎？還是會被抄成一坨奇怪的巫術？

## 共同模式：CSS 在吃掉那些 UI 邊角問題

很多 UI 問題一開始看起來像「寫點 JS 就好」，但上線後你會發現它會一直咬你：

- modal 裡面的 scroll lock
- scroll chaining（滾到底後把背後頁面一起滾）
- scrollbar 出現/消失造成 layout shift
- textarea 自動長高但不要抖
- 表單驗證樣式不要自己做一套狀態機

以前我們都用 JavaScript 解。

然後一路付利息。

modern CSS 沒有消滅複雜度，它做的是把複雜度 **移到平台**——瀏覽器工程師已經替你把那些怪邊角打完了。

這才是重點。

## 例子 1：不用 padding hack 也能讓 scrollbar 穩定

你如果遇過「開 modal 之後整個頁面左右跳一下」的問題，大概就寫過那套：

- 量 scrollbar 寬度
- body 補 padding-right

它不是不能用，但永遠有例外。

現在有 `scrollbar-gutter: stable;`，意思很直白：

「我先把 scrollbar 的位置留好，layout 不要跳。」

不酷，但它能直接砍掉一整類的 UI 抖動。

## 例子 2：不用 wheel listener 也能阻止 scroll chaining

我最常看到的 modal bug：

- 使用者在 modal 內滾
- 滾到底
- 背後頁面開始一起滾

你可以用 `wheel` listener 擋（然後你會開始跟 passive listener、trackpad、touch、巢狀容器搏鬥）。

或是用：

```text
.modal-content {
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

這就是我說的「少繳 JS 稅」。

## 例子 3：textarea 自動長高，不要每次 input 都量一次

textarea auto-grow 也是經典陷阱：

- height 設成 `auto`
- 讀 `scrollHeight`
- 再把 height 設回 px
- 每次輸入都重複

能跑，但很容易跟 layout / font / animation 糾纏。

新的 CSS 開始出現像 `field-sizing: content;` 這類能力（支援度還沒完美）。

但方向很清楚：**平台想把這件事自己做掉。**

## 例子 4：表單驗證不用自己發明 touched/dirty 狀態機

很多團隊做表單會做一套：

- touched
- dirty
- submitted

因為他們想要「使用者互動過才顯示錯誤」。

CSS selector 像 `:user-valid` / `:user-invalid`，會把部分邏輯交回瀏覽器。

一樣，不是魔法。

只是少一坨你不想維護的 code。

## 「可是 browser support…」——對，這才是你的工作

比較誠實的做法應該是：

1. 支援度夠、fallback 也 OK 的功能就直接用。
2. 新一點的 feature 就做 feature-detect，保底 UX 先能用。
3. 不要把「酷 CSS trick」當成上線理由。

換句話說：採用與否是工程決策，不是 Twitter 決策。

## 我的結論

如果你把 modern CSS 當新玩具，最後很容易被反噬。

但如果你把它當作一種手段：**刪掉 JS glue code**、**降低 UI 回歸 bug**，它就是很高槓桿的升級——因為 moving parts 變少，蟲就少。

我個人最爽的時刻，就是 UI codebase 變小，但產品沒有變爛。

---

## References

- [Modern CSS code snippets（把「不要用 JS 做這些」整理成索引）](https://modern-css.com)
