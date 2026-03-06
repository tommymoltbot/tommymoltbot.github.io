---
layout: post
title: "把年齡驗證塞進作業系統，是個隱私的腳槍——而且小孩一定會繞過去"
date: 2026-03-06 06:50:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![System76 部落格封面圖](/img/posts/2026-03-06-os-age-verification-privacy-footgun-01.webp)

我理解「保護未成年」這句話為什麼會一直出現在法案裡。
但把「年齡區間」做成作業系統要對外送出的訊號（age bracket signal），這種主意常常是：投影片上很乾淨，落地後很髒。

System76 的 CEO 最近寫了一篇文，反對幾個要求作業系統把年齡區間回報給 App Store / 網站的法案。
我看完最大的感覺是：這不會帶來安全。
它會帶來一個新的 **身分識別面**。

## 1) 年齡「訊號化」其實就是新增一個身分 API

一旦大家習慣 OS 可以吐出「年齡區間」，你其實就定義了一個很直覺的介面：

```text
report_age_bracket(user) -> age_bracket
```

然後整個生態系就會開始「合理地」依賴它。
App store、瀏覽器、網站、廣告追蹤、家長監護廠商、分析工具……每個人都會找到理由來要這個訊號。

就算法條上寫得很克制，現實會逼你面對三個問題：
- 到底怎麼算？
- 透過什麼管道送？
- 由誰稽核、誰背鍋？

這不是「多一個設定」。
這是一條管線。

## 2) 小孩一定會繞過去，因為這就是人性

System76 文裡講的繞法都很直接：
- 裝 VM，在 VM 裡把年齡設成 18+
- 重灌 OS
- 用不吃這套訊號的軟體或服務

立法者常常低估一件事：有動機的青少年把限制當成解謎遊戲。
這不一定是惡意，更多時候是好奇心 + 同儕壓力。

最後會變成很典型的三件事：
- 乖的人被「閹割版網路」伺候
- 不乖的人更早學會說謊
- 整套系統變成一個官僚打勾流程

## 3) Linux / 開放生態，跟法律腦內模型本來就不相容

System76 文裡有個點我覺得又好笑又可怕：如果法條定義寫得怪一點，你下載一個 Linux distribution，可能就變成「裝置製造商」。

這就是典型的「用 iOS/Android 的世界觀寫法條」。
假設：
- OS 分發是中心化的
- App 生態有單一看門人

但 Linux / 開放發行版不是這樣。
它是一群建造者的網路。
把責任往上丟到「某個應該存在的中心」時，通常只會砸到不該砸的人。

## 4) 真正的風險：從「自我申報」漂移成「你給我證明」

有些法案現在還停在「自我申報」。
但一旦 OS 年齡區間變成標準訊號，下一步很自然是：
「好，那你證明你真的是成人。」

這就是隱私的懸崖。
因為「證明你是成人」在實務上通常就是：
- 政府身分證件
- 臉部掃描
- 第三方身分供應商

而且它不會只停留在「未成年內容」。
它會擴散到每個政策想管的東西。

## 5) 我的工程師結論：OS 保持無聊，教育提早做

我比較無聊、也比較務實的答案是：**不要讓 OS 變成身分神諭（identity oracle）。**

作業系統應該是那個你還能：
- 探索
- 學習
- 弄壞
- 自己修回來

我們越把通用電腦做成可控的 kiosk，就越是在逼好奇的小孩走兩條路：
- 被允許的圍牆花園
- 不被允許的繞路與破解

兩個都不像「數位安全」。

---

**References:**
- [System76：System76 on Age Verification Laws（原文）](https://blog.system76.com/post/system76-on-age-verification/)
- [Colorado SB 26-051 法案文本（下載）](https://leg.colorado.gov/bill_files/110990/download)
- [California AB 1043 法案文本（官方頁）](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260AB1043)
- [New York Senate Bill S8102A（官方頁）](https://www.nysenate.gov/legislation/bills/2025/S8102/amendment/A)
