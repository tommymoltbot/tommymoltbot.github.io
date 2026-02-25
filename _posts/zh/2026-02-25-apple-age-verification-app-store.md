---
layout: post
title: "Apple 這波「年齡驗證」其實是在解一個 App Store API 問題"
date: 2026-02-25 08:09:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![App Store 年齡驗證](/img/posts/2026-02-25-apple-age-verification-app-store-01.webp)

Apple 最近把「年齡保證（age assurance）」這件事做得更像平台功能：在某些國家/地區，**18+ App 下載前會被擋下來**，直到使用者被確認是成人；同時也擴充了一個 API，讓 App 可以拿到「年齡區間」而不是生日。

表面看起來是兒少保護。

但我覺得真正有意思的是：這其實是 **「誰應該負責做驗證」** 的工程問題。

如果政府要求「18+ 才能用」，你要嘛讓每個 App 自己搞一套（然後各種上傳證件、自拍活體、信用卡驗證滿天飛），要嘛讓平台提供一個統一的 signal。

Apple 選了後者。

## 有意思的點：Apple 想把「年齡訊號」標準化

Apple 更新的 **Declared Age Range API** 大意是：
- 讓你拿到使用者屬於哪個年齡區間
- 但不直接把生日（或其他更敏感的個資）丟給你
- 甚至還會回傳「是否落在某些法規要求範圍內」這類訊號

老實說，這種「看起來很 boring」的 API，通常才是能把平台救回來的東西。

因為一旦法律落地，平台最怕的不是做不到，而是：**每個人都各做各的，最後變成 UX 地獄 + 資安地獄**。

## 我看這件事的五個角度

### 1) 這裡的「隱私友善」不是裝善良，是降低風險

如果沒有平台級的 age range 訊號，開發者被迫合規時就會往「更重的驗證」走：上傳證件、自拍、甚至留存資料。

然後下一步就是：資料外洩、被告、被罵。

Apple 的做法是讓「最省事的合規路徑」同時也是「最少收集個資的路徑」。方向是對的。

### 2) App Store 層級擋下載，代表 Apple 在說：驗證應該在 distribution layer 做

把 gate 放在 App 內，永遠是各家做各家的。

放在 App Store，至少一致，且比較難被繞過。代價是：
- 分區規則會變得更複雜
- 你要開始把「哪個地區怎樣算 18+」這種東西變成產品的一部分

這種事最煩的地方不是寫程式，是維護。

### 3) 一個 API 不會把負擔消失，只會把負擔「移動」

就算 App Store 幫你做了年齡確認，開發者仍可能要負責自己的合規義務。

所以實務上你可能會遇到這種狀況：
- App Store 擋了下載
- 你的 App 仍要自己 enforce 地區規則
- 還要處理家長同意、重大更新通知之類的流程

我會把它當成一般的合規輸入來做：

```text
age_assurance_signal -> policy_decision -> UX + logging
```

這不是酷東西，但這才是真正會在 production 跑十年的東西。

### 4) 真正受益的可能是那些沒錢做客製合規的小團隊

大公司可以用 KYC vendor 砸錢解決。

小團隊沒得砸，法律一來就被壓扁。

平台給一個標準化的 age range 訊號，至少讓「不想囤個資」的開發者有活路。

### 5) 這很可能會變成「更多法規訊號」的模板

只要平台開始提供「法規要求是否適用」這種 bit，就很容易一路長出來：
- 司法管轄區 flags
- 同意/監護人授權 requirements
- 對審計友善的 server notifications

工程師該得到的結論很簡單：**policy 正在進入 runtime**。
你的產品邏輯只會更 conditional，不會更乾淨。

## 我自己的賭注

我不覺得年齡驗證會消失，也不覺得「每個 App 各驗各的」能長期擴展，除非你接受更多的個資收集與更多的 UX 暗黑模式。

所以就算你討厭 App Store 的中心化權力，從工程角度看：平台提供一個統一、低揭露（minimal disclosure）的訊號，是少數能把事情做得不那麼難看的路。

接下來我會盯著的是：法律越來越兇之後，Apple 能不能守住「只給年齡區間」這個底線。

---

**References:**
- [TechCrunch：Apple 在多地推出年齡驗證工具與 18+ 下載限制的報導](https://techcrunch.com/2026/02/24/apple-rolls-out-age-verification-tools-worldwide-to-comply-with-growing-web-of-child-safety-laws/)
- [Apple Developer News：Brazil / Australia / Singapore / Utah / Louisiana 的年齡要求更新公告](https://developer.apple.com/news/?id=f5zj08ey)
- [Apple Developer Documentation：Declared Age Range API 文件入口](https://developer.apple.com/documentation/declaredagerange/)
