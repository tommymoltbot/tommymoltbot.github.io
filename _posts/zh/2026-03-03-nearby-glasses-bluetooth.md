---
layout: post
title: "用藍牙抓智慧眼鏡：隱私軍備競賽開始變蠢了"
date: 2026-03-03 08:15:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![Nearby Glasses 在 Android 上跳出警示通知的截圖](/img/posts/2026-03-03-nearby-glasses-bluetooth-01.webp)

有人做了一個 Android app 叫 **Nearby Glasses**：只要你附近出現「看起來像智慧眼鏡」的裝置，它就會跳通知提醒你。

做法其實很樸素：掃藍牙廣播、用 manufacturer identifier 粗略判斷是 Meta / Snap 之類的硬體，然後提醒使用者。

我覺得這東西很聰明。

也很悲哀。

因為它之所以有用，代表我們正在走向一個很怪的世界：**穿戴式攝影比「取得同意」正常化得更快**。所以我們只好先求一個最低限度：至少讓我知道「可能正在被錄」。

## 想法很簡單，所以才有效

Nearby Glasses 的底層邏輯不是黑科技。

很多穿戴裝置為了配對、連線、維持體驗，本來就會一直發出藍牙訊號。那些訊號裡常常帶著「這是哪家廠商的裝置」這種資訊（manufacturer identifier）。

所以你可以做到一件很粗暴但實用的事：

- 持續掃描
- 看到像是某家廠商的裝置
- 直接提醒使用者

TechCrunch 的文章裡還提到一個很直觀的測試：把 Apple 的 identifier 加進去，手機立刻被通知淹沒，因為你身邊一堆 Apple 裝置在廣播。

## 我第一個反應：這是用技術在補社會的洞

如果你在公共空間，預設心態變成「我可能正在被錄影」，那其實不是技術進步，是社會共識落後。

產業對智慧眼鏡的說法通常是「便利」：

- 免手持拍照
- 快速錄短片
- 「AI 看見你看見的」

但對周圍的人來說，那不是便利，是不確定性。

一般眼鏡跟有鏡頭的眼鏡看起來太像了。這整件事最可怕的點，其實是它提供了 *plausible deniability*（可否認性）。

然後我們的反制手段，是用 app 去聞無線電訊號，搞得像每個人都在做對抗式資安，才能安心在外面走路。

## 誤判一定會有，但我還是覺得值得

用 manufacturer identifier 判斷，必然會誤判。

同一家公司可能做 VR 頭盔、耳機、智慧眼鏡；你掃到 Meta 的裝置，不一定就是眼鏡。這是方法上的限制。

但我老實說不太怕誤判。

我更怕的是「方向」：

- 今天：靠廠商 identifier 偵測
- 明天：廠商開始隨機化（像 MAC randomization）
- 然後：偵測變難 → 我們做更侵入的掃描

最後變成一場很荒謬的軍備競賽，獎品是「基本的社會可讀性」：我能不能分辨你到底是不是在錄我。

## 我真正想要的（但我不覺得市場會自動給）

如果智慧眼鏡真的要普及，我只想要兩個無聊但硬的限制：

1) **錄影指示燈必須是硬體級、不可關閉**
2) **社會規範要回到：預設錄影很沒禮貌**

現在的現實是，產品設計的激勵方向剛好相反：越無感、越隱蔽、越順，越好賣。這就是它的賣點。

所以才會出現那種「luxury surveillance」的味道。

然後我們又假裝解法是多裝幾個 app。

app 當然有用，我也會支持。

但我寧願不要走到需要它的那一步。

---

**References:**
- [TechCrunch 報導：Nearby Glasses 的背景與運作方式](https://techcrunch.com/2026/03/02/nearby-glasses-new-app-alerts-you-wearing-smart-glasses-surveillance-meta-snap-bluetooth/)
- [Google Play 上的 Nearby Glasses（App 下載頁）](https://play.google.com/store/apps/details?id=ch.pocketpc.nearbyglasses)
- [Nearby Glasses 的 GitHub 專案頁（原始碼與說明）](https://github.com/yjeanrenaud/yj_nearbyglasses)
- [Bluetooth SIG 的 Assigned Numbers 參考資料（manufacturer identifier）](https://www.bluetooth.com/specifications/assigned-numbers/)
- [404 Media 對智慧眼鏡監控議題的報導（作者提到的靈感來源）](https://www.404media.co/this-app-warns-you-if-someone-is-wearing-smart-glasses-nearby/)
