---
layout: post
title: "你的手機一直在偷偷告訴電信商你的 GPS 位置，而你不知道"
date: 2026-01-31 20:05:00 +0000
categories: [Tech]
tags: [隱私, 安全, 手機, GPS, 監控]
author: Tommy
excerpt: "以為關了定位服務就安全了？想太多。多年來，電信商一直透過大多數人從未聽過的內建協議，靜默地從你的手機獲取精確的 GPS 數據。"
image: /img/posts/2026-01-31-phone-gps-carrier.webp
---

Apple 的 iOS 26.3 剛推出一個新的隱私功能，限制分享給電信網絡的「精確位置」數據。聽起來不錯對吧？但當我讀完[這份公告](https://support.apple.com/en-us/126101)，我意識到大多數人可能根本不知道他們在防什麼。

事情是這樣的：大家都知道基地台可以三角定位你的位置。這是老新聞了。你在警匪片裡看過——警察 ping 嫌犯的手機，從基地台取得位置，然後開始追車。精度很粗略——幾十到幾百公尺，取決於基地台密度。

但他們沒告訴你的是：**你的手機一直在靜默地把精確的 GPS 座標發給電信商。**

不是大概位置。不是「在這個社區的某處」。我們說的是個位數公尺的精度——跟你在 Google 地圖上看到的一樣準。

## 等等，什麼？

對，我第一次知道這件事的時候也很驚訝。這不是什麼秘密後門或駭客攻擊。這是寫在蜂窩網絡標準裡的，就在規格書裡。

在 2G 和 3G 網絡裡，有個叫 [Radio Resources LCS Protocol (RRLP)](https://projects.osmocom.org/projects/security/wiki/RRLP) 的東西。在 4G 和 5G 裡，叫做 [LTE Positioning Protocol (LPP)](https://tech-academy.amarisoft.com/LTE_LPP.html)。

基本概念？**網絡問你的手機：「嘿，你知道你的 GPS 座標嗎？」然後你的手機就直接告訴它了。**

沒有通知。沒有權限對話框。它透過所謂的「控制平面協議」靜默發生，這些協議「對終端用戶來說幾乎是隱形的」，某份技術文件是這麼說的。

## 這不是理論

美國緝毒局（DEA）在 2006 年就在用這招了。他們拿到法院命令（甚至不是搜索令）就能 ping 目標的手機，直接從電信商那邊拿 GPS 數據。第六巡迴法院裁定這甚至不算是憲法第四修正案定義的「搜索」。

然後是以色列。這個國家的國家安全局（GSS）已經運行集中式蜂窩追蹤好幾年了——透過電信公司的資料中心，用天線三角測量和 GPS 數據追蹤*所有人*。

當 COVID-19 在 2020 年 3 月來襲時，以色列不需要建什麼花俏的接觸追蹤 app。他們已經有基礎設施了。他們只是重新利用它。如果你曾經接近過確診者,你會收到一封簡訊叫你隔離。這個系統能這麼快、這麼精確地運作，告訴你電信商層級的 GPS 追蹤有多準。

## 根本問題

讓我說清楚：**GPS 本來應該是被動的。** 你的手機接收衛星訊號並計算位置。這就像看路標——你不用告訴任何人你看了路標，而豎立路標的人也不知道誰看了它。

這些協議把這個模型倒過來了。它們把被動接收器變成主動廣播器。

最糟糕的是什麼？這些東西大部分沒有什麼好的技術理由。好，E911（緊急服務）需要位置數據。可以。但「救命，我有危險」和「網絡想隨時知道我在哪」是兩回事。

## Apple 的做法是好的，但還不夠

iOS 26.3 的新功能是朝正確方向邁出的一步。它只在搭載 Apple 自製數據機（2025 年推出）的裝置上可用，這告訴你這件事有多深——他們必須控制整個硬體堆疊才能*開始*限制這些東西。

但 Apple 接下來應該做的是：
1. **讓用戶完全關閉對電信商的 GPS 響應。** 不只是「限制精度」——在緊急電話之外完全關閉它。
2. **在網絡請求位置時顯示通知。** 讓人們看到發生了什麼，而不是只能相信它被阻擋了。

我們需要可見性。現在，這一切都在黑盒子裡發生。

## 電信業的安全文化

這是真正困擾我的部分：我不信任電信業能負責任地處理這些事。

我們知道沙烏地阿拉伯濫用 SS7（一個舊的訊號協議）來監視在美國的人。我們知道電信商系統被入侵過很多次。電信業的安全文化是... 我就說不太好吧。

外國電信商能不能利用 RRLP 或 LPP，只用電話號碼就拉到地球上任何人的 GPS 座標？我不確定。但看看過去的紀錄？我不會太驚訝。

## 現在怎麼辦？

我不是說把你的手機丟進河裡。我是說：**知道發生了什麼事。**

當你在設定裡關閉「定位服務」時，你是在阻止 app 存取你的位置。你沒有阻止你的手機告訴網絡你在哪。這是兩件完全不同的事。

Apple 的新功能有幫助。但它只是一個創可貼，貼在一個更深層的問題上——蜂窩網絡標準預設電信商有權隨時知道關於你的一切。

好消息？至少你現在知道了。而知道是要求更好待遇的第一步。

## References

- [iOS 26.3 公告 - Apple 支援](https://support.apple.com/en-us/126101)
- [Radio Resources LCS Protocol (RRLP) - OsmocomBB Project Wiki](https://projects.osmocom.org/projects/security/wiki/RRLP)
- [LTE Positioning Protocol (LPP) - Amarisoft Tech Academy](https://tech-academy.amarisoft.com/LTE_LPP.html)
- [「電信商可以獲取你的 GPS 位置」- Andrew Wong](https://an.dywa.ng/carrier-gnss.html)
- [哈佛法律評論關於 United States v. Skinner GPS 追蹤案件的評論](https://harvardlawreview.org/print/vol-126/sixth-circuit-holds-that-pinging-a-targets-cell-phone-to-obtain-gps-data-is-not-a-search-subject-to-warrant-requirement-ae-united-states-v-skinner-690-f-3d-772-6th-cir-2012-rehae/)
- [大規模監控如何排擠 COVID-19 接觸追蹤應用程式的安裝 - ACM Digital Library](https://doi.org/10.1145/3579491)
