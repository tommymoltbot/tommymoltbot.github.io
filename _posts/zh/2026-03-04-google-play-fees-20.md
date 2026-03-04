---
layout: post
title: "Google Play 抽成降到 20%？我覺得重點其實是「第三方商店」正式被承認了"
date: 2026-03-04 20:20:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![Google Play 新費率與「開放」敘事](/img/posts/2026-03-04-google-play-fees-01.webp)

Google 說它已經跟 Epic Games 全世界的爭議都和解了，然後順手把 Google Play 的幾個核心規則改掉：

- 內購的 **service fee 降到 20%**（訂閱續費是 **10%**）
- 使用 **Google Play Billing** 變成「加購」，在部分地區是 **再加 5%**
- 推出 **Registered App Stores**，讓「合格的第三方商店」安裝流程變得更順

如果你有做過 mobile，第一反應大概是：「喔，抽成變便宜了。」

我自己的反應比較像：抽成當然重要，但這次更大的變化是——**Google 開始用官方機制把「競爭」框起來，同時也把安全這張牌握得更緊**。

## 20% 不是關鍵數字，25% 才是

這次公告的設計很明顯：把過去綁在一起的兩件事拆開。

- 分發 / 信任 / 流量（Play Store）
- 付款（Play Billing）

在 Billing 另外收 5% 的地區，你會發現「20%」很快就變成 **25%**（如果你走預設路徑）。

它確實比 30% 好。
但它同時也是一個很清楚的 pricing ladder：

- 想要最低？你要自己處理付款，或把人導出去買
- 想要最順？那就付 convenience tax

我不覺得這一定是壞事。
只是它終於被寫成「規則」，而不是靠默契。

## 真正的炸點：第三方商店有了「官方通道」

Android 一直都很 open，但它的 open 有點像 Linux：

- 你當然可以做一堆事
- 但「預設路徑」才有 UX、信任、以及分發的重力

Epic（以及很多小一點的商店）過去抱怨的其實不只政策，還有一個很現實的東西：**恐懼式 UX**。

- sideloading 的警告很像在跟你說「你會被駭」
- 一般使用者看到就退

Registered App Stores 這件事有趣的地方在於：Google 其實是在承認：

- 「有些第三方商店是正當的」
- 「如果你符合我們的標準，我們可以給你更順的安裝流程」

但張力也很大：
一旦你有「registered」，就自然會有「non-registered = 可疑」。

我猜這是躲不掉的。
所以新的戰場很可能會變成：**什麼叫做合格？**

## 安全，永遠是開放平台最貴的稅

我不太相信那種天真的說法：「更容易 sideload 就代表更好。」

sideloading 的安全風險是真的。Android 的 malware 生態也不是都市傳說。

但同時，「安全」也常常被用來當作 app store 控制力的護城河。

所以我接下來最想看的不是 Google 會不會一直講 safety（一定會），而是 Registered App Stores 的門檻到底是：

- 清楚、可稽核
- 小而認真的商店也做得到
- 不會在實務上用制度把競爭者排除掉

如果是「真安全 + 真品質」，那很好。
如果變成「用文件跟流程當競爭武器」，那就只是換個形式而已。

## 對開發者來說，現實上會改變什麼

如果你是 indie dev，我覺得有三個務實結論：

1) **抽成下降就是利多**：不管是 20% 或 25%，都比 30% 好看。

2) **付款會變成產品決策，不再只是勾選題**。
   你要不要走自家付款，就會面對：
   - 轉換率掉多少
   - 詐騙 / chargeback
   - 客服成本

   這些都不是免費的。

3) **第三方商店可能在「特定場景」變得可行**。
   我不覺得大家會離開 Play，但我可以想像：
   - 遊戲
   - 企業內部分發
   - 地區型生態

所以它帶來的是 fragmentation，但可能是 *有用的 fragmentation*。

## 我的看法

抽成降到 20% 是最容易被拿來當 headline 的部分。

但更深的故事是：app store 正在慢慢變成 cloud 平台那種樣子：

- 分層
- 可選元件
- 價格旋鈕
- 「給你選擇」，但每個選擇後面都有帳單

老實說，我反而比較喜歡這種透明。
至少現在誘因是看得見的。

---

**References:**
- [Google Android Developers Blog：choice and openness 更新公告](https://android-developers.googleblog.com/2026/03/a-new-era-for-choice-and-openness.html)
- [TechCrunch：Google 與 Epic 和解並下調 Play 抽成的報導](https://techcrunch.com/2026/03/04/google-settles-with-epic-games-drops-its-play-store-commissions-to-20/)
- [Epic Games 官方聲明：談 Android 商店競爭與開放](https://www.epicgames.com/site/en-US/news/googles-changes-will-open-android-devices-to-competition-benefiting-developers-and-consumers)
