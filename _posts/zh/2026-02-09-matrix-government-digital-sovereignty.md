---
layout: post
title: "Matrix 正在變成政府的『主權通訊層』——但你得付出代價"
date: 2026-02-09 13:00:00 +0000
categories: Tech
tags: Tech
author: Tommy
lang: zh
image: /img/posts/2026-02-09-matrix-government-digital-sovereignty.webp
---

![Matrix 在政府 IT 的滲透](/img/posts/2026-02-09-matrix-government-digital-sovereignty.webp)

Matrix 其實存在很久了。對多數工程師來說，它一直卡在「概念不錯，以後有空再玩」的清單裡。

但我看到一篇在講「政府因為數位主權而默默採用 Matrix」的報導時，突然覺得這件事要用另一個框架看：

Matrix 不是在贏「最好用的聊天 App」。

它在贏的是：**一個機構可以自己擁有的通訊層（comms layer）**。

這個差別很大。

## 第一反應：那為什麼不是 Signal？

講白一點，如果你是個人使用者，你大概率不該因為「更安全」就選 Matrix 去取代 Signal。

Signal 是產品。

Matrix 是協議 + 生態系，然後你得自己面對一堆現實的運維選擇。

所以當我看到「政府採用」這幾個字，我不會翻譯成「Matrix 比 WhatsApp 好用」。

我會翻譯成：**他們想要從供應商鎖定裡留一條退路**。

而這件事，你很難從封閉平台拿到——就算 UX 再漂亮。

## Matrix 真正擅長的是什麼

Matrix 的本質更像「可聯邦的訊息基礎設施」。

價值主張大概是這樣：

- 你可以自己跑 homeserver
- 身份可以在自己組織的 namespace 裡
- 規則允許的話，可以跟其他組織互通
- 客戶端不爽就換，不被綁死

對政府或高度監管產業來說，killer feature 不是貼圖。

而是：

- *資料主權 / 駐留控制*（至少你自己那段你能掌握）
- *營運控制*（patch 節奏、備份、log、留存策略）
- *整合控制*（把通訊嵌進更大的內部系統）

如果你曾被 SaaS 廠商改條款、改價格、改路線圖搞過一次，你就知道為什麼有人願意吃這個苦。

## 代價：你要主權，就得繼承那些無聊但致命的問題

我覺得「開放協議派」常常沒把這句話講清楚。

認真導入 Matrix，不是導入聊天。

是導入一整套系統問題：

- 身分 / 帳號 / 佈署與權限
- 垃圾訊息與濫用治理
- 搜尋、留存、稽核、合規
- 事件應變（incident response）
- 容量與成本規劃

還有，聯邦（federation）確實會把事情變難，尤其是任何跟 GDPR 類似的「跨邊界保證」相關的東西。

社群裡常有人說「你就自己 host 啊」。

這句話有點像「你就自己上 Kubernetes 啊」。

不是錯，但也不是免費。

## 為什麼是現在

時機其實很合理。

歐盟近年一直在推「數位主權」。但更直接的驅動力我覺得是地緣風險。

當一個機構看到另一個機構因為制裁、政策、或單一供應商的決定，突然失去某些關鍵工具的存取權時，真正的教訓不是「換個更好用的軟體」。

教訓是：**不要把核心運作押在你無法控制的服務上**。

Matrix 剛好是一個勉強能用、而且可以擴大的 building block：

- 夠老：不是玩具
- 夠開放：你真的能自己實作與部署
- 夠彈性：能被嵌進其他產品裡

## 我的工程師結論：把它當 infrastructure，不要當 app

你用「聊天 App」的角度評估 Matrix，很容易得到一個結論：不好用、麻煩、折騰。

但你用「基礎設施」的角度評估，你會開始問比較成熟的問題：

- 我們要跑的 homeserver 成本/資源 footprint 是什麼？
- metadata vs content 的威脅模型怎麼定？
- spam/濫用要怎麼管？要不要關 federation？
- 搜尋與留存策略怎麼做？
- federation 的 trust boundary 在哪裡？

這就是「我們裝了 Element」跟「我們設計了一個通訊系統」的差別。

所以我相信 Matrix 最重要的受眾，從來就不是一般消費者。

而是那些需要『選擇權』的機構。

---

**References:**
- [The Register：Matrix 因數位主權議題被政府採用的報導](https://www.theregister.com/2026/02/09/matrix_element_secure_chat/)
- [Hacker News：為什麼 Matrix 對一般使用者仍然很難普及的討論串](https://news.ycombinator.com/item?id=46944245)
