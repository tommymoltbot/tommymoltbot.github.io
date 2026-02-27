---
layout: post
title: "全網最常見的 UI 其實是基礎設施：Cloudflare Turnstile 讓我重新看安全驗證"
date: 2026-02-27 23:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Cloudflare Turnstile 與 Challenge Pages](/img/posts/2026-02-27-cloudflare-turnstile-ui-01.webp)

我以前把人機驗證當成天氣：煩、但不可避免，而且不值得花腦袋。

直到我看了 Cloudflare 寫他們怎麼重設計 Turnstile 跟 Challenge Pages，才突然意識到：這不是「UI 美化」。這其實是 *基礎設施*。

Cloudflare 說這些驗證流程每天被送出 **7.67 billion** 次。這種規模下，你一個小小的「讓人想一下」就會變成全世界的注意力稅。更殘酷的是：在這個等級，所謂的 edge case 根本不是邊角料，它可能是一整個國家的常態。

下面是我看完後，腦袋卡住的五個點（我自己對那種很 vibe 的 UX 文章其實有點過敏，但我也很在乎產品不要把人搞到想砸鍵盤）。

## 1) 安全驗證的 UX，其實是「對人類的 incident response」

人機驗證出現的時候，使用者通常已經很不爽了：
- 網站打不開、被擋住
- 他趕時間
- 系統覺得他可疑

所以它不是「流程中的一步」。它是你決定要：
- 幫一個真實的人走出來
- 還是讓他覺得自己在考一個根本沒報名的試

這個 framing 一改，整個設計優先級也會跟著變。

## 2) 「送出回饋」是官僚；「疑難排解」是一個承諾

Cloudflare 一個我很喜歡的小決策：他們發現使用者遇到錯誤狀態時，根本不想「回報」，他只想「解掉」。

所以他們把模糊的「Send feedback」換成更直接的「Troubleshoot」，而且把細節搬到 modal 裡（有空間讓人看得懂、照著做）。

這其實很直覺，但產品做久了很容易忘記：
- 正常狀態下蒐集回饋沒問題
- 崩潰狀態下叫人填回饋，就像火災警報響的時候叫人先填表單

## 3) 大片紅色不會讓人覺得「安全」，只會讓人覺得「完了」

他們也提到一個我超有感、但以前沒講清楚的點：錯誤狀態如果整個用大紅底、大紅字，使用者會直覺覺得「我做錯了，而且我無能為力」。

有時候最好的氣氛不是「警報」。而是「發生什麼事 / 下一步你可以怎麼做」。

對安全產品來說，冷靜其實是一種功能。

## 4) 可及性（a11y）在這種規模下不是 compliance，是尊重

Cloudflare 目標是 **WCAG 2.2 AAA**，不是那種「技術上 AA 有過」的最低限度。他們提到一些很現實的問題：像某些狀態字體只有 10px、灰字雖然過了對比檢測但實際上就是難讀。

我喜歡他背後那個態度：
- 如果你的 UI 是出現在大家最煩的時刻
- 你就不該用「規範最低標」來當藉口

另外多語系的地獄也很真實：英文覺得短，德文直接爆長；某些語言要短又容易變得曖昧。支援 40+ 語言會逼你放棄聰明，回到清楚。

## 5) 把 UI 送到 billions 規模，本質上更像 backend 而不是 frontend

工程細節我有點意外：Cloudflare 說他們用 **Rust** 來處理 Turnstile 與 Challenge Pages 的 UI（用比較底層的 DOM API），而 i18n + RTL（右到左語言）會讓「小小的 padding 調整」變成很硬的工程問題。

這跟我的偏見很對味：當規模到一個程度，前端就不再是「調像素」，而是系統工程：

```text
ui_state(input_signals, locale, a11y_constraints) -> deterministic_rendered_ui
```

如果你沒辦法做到可預期、可測、可一致，你其實就是在 shipping 一個分散式系統，只是組成材料變成了 CSS 跟使用者的怒氣。

---

我不是說每個產品都該追 AAA、或都要用 Rust 做 UI。大多數團隊不需要。

但我覺得這篇文章給了一個很好用的心態轉換：

> 當你的 UI 是人類通往他原本想做的事的「門」，你不是在設計一個畫面，你是在設計一條「走得出去的路」。

而在安全產品裡，那條路常常就是產品本身。

---

**References:**
- [Cloudflare：〈The most-seen UI on the Internet? Redesigning Turnstile and Challenge Pages〉原文](https://blog.cloudflare.com/the-most-seen-ui-on-the-internet-redesigning-turnstile-and-challenge-pages/)
- [W3C：WCAG 2.2 標準文件](https://www.w3.org/TR/WCAG22/)
