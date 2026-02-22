---
layout: post
title: "維基百科把 Archive.today 加進垃圾連結黑名單：這其實不是『繞過付費牆』的問題"
date: 2026-02-22 10:06:00 +0000
categories: [Tech]
tags: [Tech]
author: Tommy
excerpt: "維基百科編者決定『棄用並加入 spam blacklist』Archive.today，理由不是道德審判，而是風險控管：涉嫌用訪客瀏覽器跑 DDoS、以及有證據顯示部分存檔被動過。對工程師來說，引用與存檔本質上是一條供應鏈。"
lang: zh
---

![一張帶新聞編輯室氛圍的照片，用來隱喻「存檔、信任與被指控的 DDoS 行為」。](/img/posts/2026-02-22-wikipedia-archive-today-ddos.webp)

如果你曾經在 Wikipedia 上補過 citation，你一定看過那個現實：

- 連結會腐爛
- 原文會消失
- 最後剩下的常常只是一個「archive link」在撐場

所以當維基百科編者決定 **棄用、並把 Archive.today（含相關網域）加進 spam blacklist**，這不是小圈圈吵架。

它是一個很工程的訊號：**你的引用系統裡，其實有一層「信任供應鏈」**。而這層是會壞掉的。

這次的理由也不是「討厭付費牆」。核心是兩件事：

- 不該把讀者導向一個被指控利用訪客瀏覽器參與分散式阻斷服務攻擊（DDoS）的網站
- 如果有證據顯示存檔內容可能被操作方改過，那它就不再是可靠的引用基礎

我覺得這很值得工程師留意。

因為我們很多時候把「存檔」當成管線、當成背景音。

但它其實是你知識系統的一個依賴。

## 這件事最刺的點：存檔服務可能變成主動的對手

被提到的行為很符合 2026 的荒謬：

- 使用者打開 Archive.today
- 看到 CAPTCHA 頁
- 頁面跑 JavaScript，對某個目標站點反覆發 request

也就是說：它不是在被動保存頁面。

它在 **借用你的瀏覽器算力**。

就算你完全不關心 Wikipedia 政治，這也很像一個「依賴開始變髒」的訊號。

如果攻擊目標是一個個人部落格，那種權力不對等也很噁心。

## 我用五個角度把這件事拆開看

1) **這不是道德論戰，而是風險控管**

Wikipedia 本質上是一條公共知識的生產線。任何一個環節如果被指控：

- 把讀者變成攻擊流量，或
- 產出不可信（可被修改）的存檔

黑名單不是「表態」，是把爆炸半徑縮小。

2) **「archive link」其實是一個 dependency**

工程師很熟：依賴變可疑，就先做隔離。

引用也是一樣。

存檔層壞掉，你整張 reference graph 都會變成負債。

3) **繞付費牆從來不是 Wikipedia 的核心價值**

大家確實會拿 Archive.today 來看付費牆後的內容。

但 Wikipedia 要的是：**穩定、可稽核、可被信任的參考鏈**。

「穩定但不可信」比付費牆更糟。付費牆至少不會幫你改歷史。

4) **「存檔被改過」是核彈級指控**

一個正常的 archive 很無聊：保存。

一個能修改保存內容的 archive，就不是 archive。

它是 publisher。

而 publisher 會有立場（有時候甚至是混亂的立場）。

5) **最後還是回到無聊但有效的解法：多重存檔 + 原始來源**

從 Wikipedia 的 guidance 看起來就是：

- 優先連回原始來源
- 需要存檔時，改用其他存檔（例如 Wayback Machine）

不刺激。

但很可靠。

## 給所有「需要長期引用」的人：這是供應鏈問題

如果你在公司做知識庫、內部 wiki、甚至只是維護一份長命的工程文件：

- 不要把單一存檔網域當成魔法
- 把 archived copy 當成 **不可信 mirror** 來設計流程
- 重要參考至少保留兩條保存路徑

還有一個很現實的判斷：

如果你的存檔工具開始在使用者瀏覽器裡跑「額外的東西」來達成它的目的，那就當它是 compromised dependency。

因為它就是。

---

**References：**
- [TechCrunch：維基百科棄用並加入垃圾連結黑名單 Archive.today 的報導](https://techcrunch.com/2026/02/21/wikipedia-blacklists-archive-today-after-alleged-ddos-attack/)
- [Wikipedia：Archive.is RFC 討論頁（共識與證據連結）](https://en.wikipedia.org/wiki/Wikipedia:Requests_for_comment/Archive.is_RFC_5#)
- [Ars Technica：決策與證據整理（含被引用的案例）](https://arstechnica.com/tech-policy/2026/02/wikipedia-bans-archive-today-after-site-executed-ddos-and-altered-web-captures/)
