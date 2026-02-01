---
layout: post
title: "你的手機一直在偷偷回報精確 GPS 位置給電信商（而你不知道）"
date: 2026-02-01 11:00:00 +0800
categories: Tech
lang: zh
---

今天早上在 [Hacker News 上看到一篇文章](https://news.ycombinator.com/item?id=46838597)，讓我愣了一下。講的是電信商可以拿到你的**精確 GPS 位置**——不是那種「你在哪個基地台附近」的粗略位置，而是精確到幾公尺的那種。

而且這件事已經發生很多年了。只是我們沒在討論而已。

## 等等，基地台三角定位不是很不準嗎?

對，我也是這樣以為的。

大家都知道電信商可以根據你連接的基地台大概定位你的位置。這就是犯罪影集裡常看到的那種——「嫌疑人在這個基地台 200 公尺範圍內」。不準是因為基地台間距很大,尤其是 5G 普及之前。

但問題是：**這不是全貌。**

在行動通訊標準裡（2G、3G、4G、5G），藏了一些協定，會讓你的手機**主動把 GPS 座標傳給電信商**。在 2G 和 3G 叫 [Radio Resources LCS Protocol (RRLP)](https://projects.osmocom.org/projects/security/wiki/RRLP)。在 4G 和 5G 叫 [LTE Positioning Protocol (LPP)](https://tech-academy.amarisoft.com/LTE_LPP.html)。

運作方式很簡單：網路問「欸你知道自己的 GPS 座標嗎？」然後你的手機就... 告訴它了。

沒有通知。沒有授權提示。就是在背景安靜地握手。

## 為什麼要這樣設計?

官方理由是**緊急救援**。當你打 119 的時候,救援人員需要知道你在哪裡。如果你在室內或訊號不好的地方,GPS 能提供比基地台三角定位準確得多的位置。

這個理由說得通。我懂。

但讓我開始不安的是：**GNSS（GPS、GLONASS、Galileo、北斗）本來就不是設計成雙向系統的。** 它完全是被動的。你的手機讀取衛星訊號來判斷自己在哪——就像讀路標一樣。你不用告訴任何人你讀了路標。沒人知道你讀了哪個路標。

加上 RRLP 和 LPP 之後,行動通訊標準把 GNSS 變成了**主動回報系統**。你的手機現在會在被問到的時候,主動廣播自己的位置給電信商。

而誰可以問？結果是,很多人。

## 誰在用這個功能?

文章提到了幾個案例：

- **美國 DEA（2006）**：透過電信商發送的「ping」取得快遞員手機的 GPS 座標。他們只需要法院命令——**不需要搜索令**。
- **以色列 Shin Bet**：運行一個集中式追蹤系統,收集**以色列境內所有手機**的位置資料。在 COVID-19 期間,他們用這套系統做接觸者追蹤,如果你曾經接近確診者,就會收到簡訊要你隔離。

以色列的案例特別能說明問題。接觸者追蹤在 2020 年 3 月就開始了,離以色列第一個 COVID 病例才幾週。這代表基礎設施早就在那裡了,隨時可以用。他們不是為了 COVID 才建的——這套系統已經用了很多年。

## 讓我不安的部分

我不天真。我知道政府有監控能力。我知道情報機關在做他們該做的事。

但讓我不安的是這件事有多**安靜**。RRLP 和 LPP 不是秘密——它們在[公開規格](https://tech-academy.amarisoft.com/LTE_LPP.html)裡。但不知道為什麼,它們就這樣飛過大家的雷達。我問過的大部分人都不知道這件事在發生。

而且法律框架沒跟上。在美國,從電信商取得 GPS 資料只需要法院命令,不需要搜索令。這比在車上裝 GPS 追蹤器的門檻還低。

另一個未知數：**外國電信商可以遠端利用這個嗎？** 沙烏地阿拉伯曾經利用 [SS7 漏洞監視美國境內的人](https://www.theguardian.com/world/2020/mar/29/revealed-saudis-suspected-of-phone-spying-campaign-in-us)。考慮到電信業界在資安方面的記錄,我不會對國家級駭客能用手機號碼或 IMEI 取得任何人的 GPS 座標感到意外。

## Apple 的 iOS 26.3 更新呢?

Apple 最近在 iOS 26.3 推出了一個功能,限制傳送給行動網路的「精確位置」資料。這個功能只支援搭載 Apple 自家數據機（2025 年推出）的裝置。

[Apple 的公告](https://support.apple.com/en-us/126101)說：

> 行動網路可以根據您的裝置連接的基地台來判斷您的位置。

注意他們沒提到 RRLP 或 LPP。只說「基地台」。經典 Apple——夠模糊,技術上正確,但不是全部真相。

不過,限制精確位置分享是個好的第一步。這需要 Apple 自己的數據機才能做到,顯示他們需要完全控制硬體才能做這件事。這是垂直整合少數的優勢之一。

但我覺得他們接下來應該做的是：

1. **讓使用者完全關閉 GNSS 回報。** 不只是「限制精度」,而是真的關掉。
2. **在電信商要求位置時通知使用者。** 就像 iOS 要求相機或麥克風權限一樣。

如果電信商需要位置資料來做緊急救援,沒問題——針對這些情況做成選擇性加入。但我的手機不應該在網路一問就主動廣播 GPS 座標。

## 我的想法

這不是陰謀論。這甚至不是秘密——它就寫在標準裡。但這麼少人知道這件事,說明了我們大部分人跟我們裝置實際運作方式有多脫節。

我不是叫你把手機丟掉或搬到深山裡住。但我確實覺得我們應該對手機傳送什麼資料有更多控制權,尤其是像 GPS 座標這麼精確的東西。

Apple 在 iOS 26.3 做了一個好的決定。希望更多公司跟進。

而且下次有人跟你說「我們在保護你的隱私」的時候,你應該問：「保護我不被誰侵犯？」

---

## 參考資料

- [Mobile carriers can get your GPS location](https://an.dywa.ng/carrier-gnss.html) — Andy Wang 對 RRLP 和 LPP 的深入分析
- [RRLP 協定概述](https://projects.osmocom.org/projects/security/wiki/RRLP) — Osmocom 安全文件
- [LTE 定位協定 (LPP)](https://tech-academy.amarisoft.com/LTE_LPP.html) — Amarisoft 技術指南
- [Apple iOS 26.3 隱私功能](https://support.apple.com/en-us/126101) — Apple 官方支援文件
- [哈佛法律評論：GPS 追蹤法律分析](https://harvardlawreview.org/print/vol-126/sixth-circuit-holds-that-pinging-a-targets-cell-phone-to-obtain-gps-data-is-not-a-search-subject-to-warrant-requirement-ae-united-states-v-skinner-690-f-3d-772-6th-cir-2012-rehae/) — 美國訴 Skinner 案分析
- [衛報：沙烏地阿拉伯在美國的手機監控](https://www.theguardian.com/world/2020/mar/29/revealed-saudis-suspected-of-phone-spying-campaign-in-us) — SS7 漏洞利用報導
