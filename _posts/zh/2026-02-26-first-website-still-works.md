---
layout: post
title: "第一個網站到現在還能打開（而且這才是重點）"
date: 2026-02-26 08:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![CERN 修復版第一個網站首頁截圖](/img/posts/2026-02-26-first-website-still-works-01.webp)

我今天點進去所謂「第一個網站」，本來以為會看到那種只能截圖留念的博物館級遺跡。
結果它不只活著，還真的能用。

沒有 cookie banner、沒有「接受全部」、沒有要先載一包比內容還大的 JS。就一頁文字跟幾個連結。

它很樸素，樸素到有點好笑。
但也正因為這麼樸素，我突然有點不舒服（是那種有用的不舒服）：我們這些年把 web 做得「更好」了嗎，還是只是做得更重？

## 最讓我在意的不是「以前比較簡單」

大家講早期 web，通常就是一句：「以前比較簡單。」
對，這句沒錯，但也很無聊。

真正有意思的是：**1991 年的東西，2026 年的瀏覽器還看得懂**。

這代表：
- URL 還能解析
- 一些最基本的 markup 假設還成立
- 瀏覽器還知道怎麼把它渲染出來

這其實就是 backward compatibility，只是它不是誰寫在 spec 裡硬逼出來的，而是整個 web 生態「不小心但真的」做到了。

然後你再回頭看現在一堆現代網站／web app：
- build tool 一換就壞
- dependency 小改版 UI 就炸
- 你筆電跑很順，手機中階機直接卡

我們花了超多工程成本在複雜度上，但那個複雜度到底替使用者買到了什麼，老實說很多時候不太明確。

## 第一個網站在優化什麼

CERN 那邊對「Web 怎麼誕生」的描述其實很直白：科學家在不同機構間分享資訊太痛苦了，需要一個更好的資訊共享方式。

所以它的優化目標大概是：
- **互通性**（任何機器、任何實驗室都能用）
- **耐久性**（連結應該要能活很久）
- **去中心化**（不要有單一 gatekeeper）

不是 engagement，也不是 conversion，更不是 retention。

這種取捨不會讓它好看。
但會讓它「活得久」。

## 身為工程師，我的尷尬結論

我不是說所有東西都該回去寫純 HTML。
現在的 web app 能做的事，確實不是 1991 那套可以搞定的。

但我覺得我們也把一些本來應該覺得丟臉的狀況正常化了：
- 送 5MB 給使用者，只為了顯示 2KB 的文字
- 把「讀文章」變成「跑一個 app」
- component library 更新，無障礙直接倒退

第一個網站不酷。
它厲害的是，它把一個極端 baseline 擺在你面前：

> 內容就是產品，而傳遞機制最好夠無聊。

如果你做的是要長期存在的東西（文件、知識庫、公共資訊），無聊其實是 feature，不是缺點。

總之，如果你想同時獲得一點懷舊感跟一點點煩躁感，可以去點一下。它真的還在。

---

**References:**
- [CERN 修復版「第一個網站」入口（info.cern.ch）](https://info.cern.ch/)
- [CERN 說明：Web 如何與為何在 CERN 誕生](https://home.cern/science/computing/birth-web)
- [Wikipedia：World Wide Web 的背景與重要時間點整理](https://en.wikipedia.org/wiki/World_Wide_Web)
