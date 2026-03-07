---
layout: post
title: "Plasma Bigscreen：我等很久的 Linux 電視介面（以及它為什麼值得看）"
date: 2026-03-07 11:00:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![Plasma Bigscreen 主畫面](/img/posts/2026-03-07-plasma-bigscreen.webp)

我一直有個很煩的疑問：

為什麼「Linux 上電視」不是變成 **HTPC 玩家自己折騰**（最後你其實在沙發上操作的是一個普通桌面），就是變成 **封閉的機上盒**（你的客廳像在租平台的）。

所以我看到 **Plasma Bigscreen** 又被提起來的時候，這次沒有只當成「又一個 UI 專案」，我是真的停下來看它在做什麼。

它不是「Kodi 換個皮膚」而已，而是想做一個 TV-first 的桌面環境：設定介面是遙控器導向、哪怕在別的 app 裡也能叫出 home overlay、整體互動設計就是給大螢幕用的。

## 我比較願意相信它的原因：底層用的是很無聊的那一套（但這反而是好事）

它把自己綁在現代 Linux 桌面堆疊上：

- Wayland
- PipeWire
- KDE Plasma + KDE Frameworks
- Flatpak
- NetworkManager
- D-Bus

這串清單看起來很普通，甚至有點「好啦我知道」。

但如果你做的是 TV UI，我覺得「普通」反而是優點。

因為 TV 這種裝置會遇到的坑很現實：
- 顯示/HDMI/EDID 的怪問題
- 音訊路由（尤其有 AVR、Soundbar 的那種）
- 遙控器輸入、搖桿輸入的邊界情況

如果底層是一套奇怪的自製框架，踩到坑就等於進入「祝你好運」。

但如果它用的是大家在桌面上已經跑了很多年的 plumbing（而且還在持續演進），你至少有機會吃到社群共用的修 bug 成果，而不是每次都重造輪子。

## 真正的主張不是功能，而是所有權

他們在「Why?」那段其實講得很直：現在多數 TV 平台都是 walled garden，所以他們想做的是 **更開放、更能被信任、也更重視隱私** 的基底。

老實說，我本來沒想過 TV 也值得認真談「平台所有權」。但現在的 TV 生態真的很怪：

- 你拿不到像樣的更新內容
- 你很難知道蒐集了哪些 telemetry
- 你也不太可能 audit 裡面到底裝了什麼
- 更別說有些系統 UI 還會越用越像廣告版面

手機跟電腦至少我還能選：瀏覽器、launcher、甚至整個 OS。

電視多半就是：要嘛吞下去，要嘛不用。

## 現實面：它還沒「大眾可用」

這專案目前還在開發期。

我覺得有用的地方是：他們沒有硬吹自己已經 ready。官方直接說 **還沒有廣泛可用**，而且計畫從 **Plasma 6.7（六月）** 開始跟著 Plasma release schedule 走，讓各大發行版有機會把它打包進 repos。

對我來說，這算是一個很重要的門檻：能被 distro 打包，才比較像「開始變成基礎設施」，而不是 demo。

## 我會不會今天就把它裝到客廳電視？

還不會。

但我會把它放進觀察清單，原因很簡單：我想看到一個未來是「TV UI 不等於 ad tech」。

如果你本來就有 Jellyfin、或是家裡有閒置的 mini PC / NUC，我覺得這種東西值得你花一點時間試一下，至少看一下方向對不對。

---

**References:**
- [Plasma Bigscreen 官方網站（介紹、截圖與目標）](https://plasma-bigscreen.org/)
- [Get Plasma Bigscreen（可用性說明與 Plasma 6.7 計畫）](https://plasma-bigscreen.org/get/)
