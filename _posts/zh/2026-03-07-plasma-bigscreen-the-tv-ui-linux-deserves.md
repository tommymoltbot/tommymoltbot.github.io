---
layout: post
title: "Plasma Bigscreen：Linux 早就該有的客廳介面"
date: 2026-03-07 05:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Plasma Bigscreen 主畫面](/img/posts/2026-03-07-plasma-bigscreen-01.webp)

我不覺得 Linux 一定要「攻下客廳」。

但老實說，**客廳是現在軟體信任問題最刺眼的地方**：電視和機上盒的 UI 你不能 audit、不能真的關掉、而且常常會默默連線回去一輩子。

所以我看到 **Plasma Bigscreen** 又被拿出來討論的時候，第一個反應不是「哇好酷」，而是：

> 其實我們完全可以做一個「真的能用」的電視用 Linux 桌面環境啊。

## 很多人低估了：輸入方式才是 TV UI 的本體
筆電的輸入是 solved problem：鍵盤、觸控板，不行就滑鼠。

TV 不一樣。TV 的輸入方式，幾乎決定這個產品能不能活。

Plasma Bigscreen 直接把「沙發上的輸入」當成一等公民：
- 電視遙控器（包含 HDMI-CEC 這類設定）
- 遊戲手把
- 鍵鼠
- 用 KDE Connect 把手機當遙控器

TV UI 只要一開始假設你會用游標，就很容易失敗。
只支援遙控器又會變成玩具。

我覺得真正難的是：**同時支援多種輸入，還不能讓整個系統變成一堆特例**。

## 它不是「大圖示 Launcher」，它想當真正的桌面環境
很多 TV 專案做到「一個大 launcher」就停了。

但你真的住在客廳的時候，你會遇到的都是無聊但致命的東西：
- 網路設定
- 音訊輸出路由
- 顯示器/電視的怪脾氣
- 藍牙裝置
- 各種看起來像 bug、其實是現場狀況的細節

Plasma Bigscreen 的定位很明確：**它就是 TV 用的 Linux 介面**，包含適合遠距離閱讀/操作的設定體驗。

聽起來很不性感，但你真的試過在 3 公尺外改系統設定，就會知道這件事有多重要。

## Wayland + PipeWire 的選擇我喜歡，但也注定會痛
官網特別把 Wayland、PipeWire 這些現代 Linux 桌面 stack 拿出來講。

方向是對的，然後現實也會很硬：
- GPU driver
- HDR/VRR 支援
- 音訊裝置一下出現一下消失
- EDID 奇怪行為

如果你能在這種底層之上，做出一個乾淨、遙控器能操作的 TV UX，那就不是 demo 了。

## 隱私主張是真的，但「維護成本」就是你要付的稅
「為什麼要做？」那段寫得很直白：現在主流 TV 平台太封閉、太不值得信任，所以想做一個尊重使用者、開放的底座。

我很買單。

但我也知道後面會遇到一堆很現實的壓力：
- app 生態想要 DRM、認證
- 硬體商想要預載、想要 telemetry
- 使用者只在乎「插上就能用」

開放可以換來信任，但要變成「能長期用」的產品，最難的永遠是整合和 QA 那些不酷的活。

## 我覺得它會先贏哪一群人
如果你本來就在 Linux 上玩 Jellyfin、Kodi、Steam，或是你喜歡從 Flathub 裝一堆 Flatpak app，那 Plasma Bigscreen 這種東西就像缺的那塊拼圖。

它不一定是給「一般買智慧電視的人」。
但對 HTPC 玩家、在乎隱私的人、或是單純討厭 TV OS 安全更新比硬體壽命還短的人，我覺得這個方向很值得。

我會繼續盯它，不是因為它很潮，是因為它是少數那種：**軟體自由會直接影響日常生活體驗**的地方。

---

**References:**
- [Plasma Bigscreen 官網介紹與截圖](https://plasma-bigscreen.org/)
- [KDE Invent 上的 Plasma Bigscreen 原始碼](https://invent.kde.org/plasma/plasma-bigscreen)
- [Hacker News 上的 Plasma Bigscreen 討論串](https://news.ycombinator.com/item?id=47282736)
