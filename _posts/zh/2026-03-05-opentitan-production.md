---
layout: post
title: "OpenTitan 真的出貨了：那種看起來很無聊、但我反而更相信的安全里程碑"
date: 2026-03-05 22:10:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![OpenTitan 量產出貨](/img/posts/2026-03-05-opentitan-production-01.webp)

我對「看起來不太像產品發表會」的安全消息一直有偏愛。

因為它通常沒有什麼漂亮的 demo，也不會有那種「改變世界」的敘事。

就像這次：Google 說 **OpenTitan 已經在市售 Chromebook 出貨**。
你如果不是做底層或資安，可能看過就滑走。
但我看到的第一反應其實是：

> 欸…開源的 *silicon root of trust* 真的能量產出貨，這很少見。

## Root of Trust 是什麼？一句話：第一個你要信的東西

所有裝置的安全，最後都會掉到同一個問題：

> 開機那一刻，系統「第一個」信任的是什麼？

如果第一個就被動過手腳，上面不管你做 TPM、做簽章、做 EDR，都很容易變成「有做但沒用」。

把這件事錨定在 **silicon** 上（而不是純 firmware）最大的意義是：
- 比較難被篡改
- 可以做更穩的 secure boot
- 可以把 key 的根放在更可靠的地方
- attestation 才有「可信的起點」

這些東西平常不會讓人興奮，但你只要遇過一次供應鏈事件，或是那種「我們不知道那台機器現在到底跑什麼」的事故，你就會開始尊敬這種無聊。

## 「開源安全晶片」聽起來很矛盾，但其實不該

傳統上，安全晶片常常是黑箱。
有時候理由是「不要給攻擊者提示」，但更多時候其實就是產業慣性：
NDA、專有 IP、供應商鎖定，最後變成一種 *trust by contract*。

OpenTitan 想做的事情是反過來：
- 設計可以被 review
- 可以被測試、被驗證
- 你可以跟商用夥伴買，也可以自己製造（看你的 use case）

我覺得最後一點最關鍵。
你只要依賴過「單一供應商的安全基礎元件」，就會知道安全很快會變成另一種風險：可得性、議價權、出貨節奏、甚至地緣政治。

## 真正讓我買單的不是理想，是他們在吹「品質」

這篇公告我覺得寫得好的地方，是它沒有只講「開源很棒」。
它刻意在講硬體世界裡那堆很不浪漫但很重要的事：
- design verification（DV）的紀律
- coverage（功能/程式碼）做到很高
- 大型 regression suite
- 文件和 onboarding 真的有人在顧

軟體可以先上 v0 再慢慢補。
silicon 通常不行。
你 tape-out 之後，很多錯就是「你要跟它共存很久」。

所以看到他們提「90%+ coverage」和「每晚跑 40k+ tests」這種話，我解讀成：

> 這不是丟個 repo 出來而已，他們是真的用量產品質在做。

我當然不會把 blog post 的數字當成審計報告，但方向是對的。

## PQC secure boot：很前瞻，也很現實

他們還提到 OpenTitan 支援 **post-quantum cryptography（PQC）secure boot**（用 SLH-DSA）。

我對這種「未來防護」一直有點矛盾：
- 一方面，能在 *出貨裝置* 裡看到 PQC 是很硬的成果
- 另一方面，多數組織連傳統金鑰管理都還在踩坑

但也許正因為如此，PQC 這種「不容易改的底層能力」，放在 root of trust 才合理。
你如果要做一個很難換掉的基礎，確實會想把 5-10 年後可能會感謝自己的東西先放進去。

## 工程師角度：這會讓系統更偏向「驗證」而不是「相信供應商」

實際帶來的改變不是那種泛泛的「Chromebook 更安全」。（雖然是。）
更有意思的是：當你有一個比較 commodity、又比較可審的 root of trust，很多系統就可以被設計成 **少信任、強驗證**。

這會改變很多工程討論的形狀：
- procurement 不再只是政治題
- multi-sourcing 變得比較有可能
- audit 不再那麼像「相信我啦」

某種程度上，它跟軟體世界的 reproducible builds 很像：
不是銀彈，但它把你能做的事變多。

## 接下來我會看什麼

公告裡有幾個點我覺得值得繼續追：

1) **資料中心部署**

他們說今年會把 bringup 推進到 Google 的 datacenter。老實說，如果這類 primitive 進到 server fleet，那個影響會比 Chromebook 更大。

2) **第二代：lattice-based PQC**

他們提到 ML-DSA / ML-KEM 在 roadmap 上。如果能在不把晶片搞成研究專案的前提下落地，那會是「開源 silicon 也能跟上密碼學時間線」的強訊號。

3) **IP reuse（Caliptra）**

我很喜歡他們直接講「IP 可以被別的專案 reuse」。資安 IP 最怕的就是每個人都從頭造輪子；能 reuse 已驗證的 block，品質才會真的累積。

講得有點感性，但我真的更相信這種進步：
慢、無聊、但它會出貨。

---

**References:**
- [Google Open Source Blog：OpenTitan shipping in production（出貨公告）](https://opensource.googleblog.com/2026/03/opentitan-shipping-in-production.html)
- [OpenTitan 官方文件入口（overview 與規格）](https://opentitan.org/documentation/index.html)
- [OpenTitan 的 GitHub repo（lowRISC/opentitan）](https://github.com/lowRISC/opentitan)
- [Hacker News 討論串：OpenTitan shipping in production](https://news.ycombinator.com/item?id=47265619)
