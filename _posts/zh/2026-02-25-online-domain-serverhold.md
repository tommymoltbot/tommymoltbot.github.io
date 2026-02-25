---
layout: post
title: "我破了一次 .com 規則，結果網域直接掉進 serverHold 迴圈"
date: 2026-02-25 15:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![關於 .online 網域被停用的文章截圖](/img/posts/2026-02-25-online-domain-serverhold-01.webp)

我一直是那種很無聊的 **.com 派**。

不是因為 .com 比較潮，是因為「無聊」通常代表**可預期**，而可預期就是基礎設施最重要的品質。

但人就是會有手癢的時候。

我某次為了一個小 side project（就一個 landing page，有 App Store 連結 + 幾張截圖，完全沒內容農場、沒奇怪下載），買了一個便宜的 **.online**。

結果某天我打開網站：

不是 500。
不是 Cloudflare 掛了。

是**整個網域不解析**。

後來才知道網域被打了 **serverHold**。

這個狀態的意思很直白：registry 直接把 DNS delegation 關掉，你的 nameserver 設得再漂亮也沒用。

更尷尬的是後續流程：

- registry 說要 Google 把某個 flag 拿掉，才會解除 serverHold
- Google 說要你先驗證網域所有權，才讓你申訴
- 但你沒辦法驗證，因為網域根本不解析

於是你就卡在一個很智障的 **驗證 catch-22**。

這篇不是要喊「除了 .com 其他都不能買」。比較像是：

> 如果你的網域可能被你碰不到的第三方遠端關機，而解封流程又假設 DNS 正常運作，那你就是在賭自己哪天不會被誤傷。

## 先講清楚：serverHold 跟一般的 “domain 有問題” 不一樣

在 WHOIS/RDAP 裡你會看到一些 EPP status codes（domain status）。

重點在這裡：

- **client*** 類的狀態通常是 registrar 設的（帳單、鎖定、客服可處理）
- **server*** 類的狀態是 registry 設的（優先級更高，你通常很難直接處理）

serverHold 就屬於後者。

所以我現在聽到「網域掛了」，第一件事不是去看 Nginx 或 Cloudflare，而是先問：

```text
WHOIS/RDAP 的 status codes 現在是什麼？
```

如果出現 serverHold，你在 debug 的不是 web app。
你在 debug 的是**流程跟權力結構**。

## 最讓我不爽的點：沒有通知、也沒有可預期的處理時間

被誤判我其實不意外。

我比較意外的是你可以很容易進到一種狀態：

- 你被 flag 了
- 你不一定收到可用的通知
- 然後官方的解法，假設你的網域還能正常運作

而所有「證明你是 owner」的手段大多都長這樣：

- 加 DNS TXT
- 放一個驗證檔到 `/.well-known/...`
- 加 CNAME

這些都建立在一個前提：**你的網域會解析**。

一旦 DNS delegation 被停掉，你連 “建立信任” 的第一步都無法做。

## 我腦中一直轉的 5 個不同角度（你可以挑你最有感的那個）

1) **這不是「某個 TLD 比較爛」的問題，是 dependency graph 的問題。**

網域是整個系統的根節點。根節點被關掉，上面 CDN/hosting/app 全部都不用看。

2) **工程師很愛自動化，但反滲透/反濫用的處置流程通常是人工且不透明。**

你 infra 可以全自動，解封卻可能是「寄信給某個 abuse team 然後等回覆」。
這種落差才是真的會殺死 side project。

3) **「去 Search Console 驗證」只在你一切健康的時候才成立。**

就像網路斷了你跟我說「你 SSH 進去修一下」。嗯，好。

4) **便宜網域不便宜，因為你真正買的是 time-to-recovery。**

玩具專案當然無所謂。
但只要你會對「掛 24 小時」感到丟臉，那你在意的就不是年費，是**復原速度**。

5) **觀測性不是只有給後端用，網域也需要。**

網域死掉看起來像「怎麼流量變 0」。那其實是一個 alerting failure。

## 如果你還是要買非 .com，我個人的 checklist 會長這樣

我不想扮演網域投資人，我只是不想看到更多人踩同一支 rake。

- 網域買下來 **第一天就加進 Google Search Console**（你不做 SEO 也一樣）
- 做一個最基本的監控：測 **DNS resolution**（不要只測 HTTP）
- 留一個逃生路徑文件化：
  - registrar 的客服/申訴管道
  - registry 的聯絡方式（如果找得到）
  - 如果 delegation 掛了，你能提供什麼證明
- 如果這東西很重要，就買無聊的（是，很多時候就是 .com）

更 paranoid 一點：準備一個備用網域，隨時可以導流或改名。

## 我的結論（其實很簡單）

我不反對 anti-abuse 系統。

我反對的是一種流程設計：看起來假設誤判不會發生，然後把復原 UX 寫成「你網站掛了，你先驗證你網站再來申訴」。

這不是安全。
這是行政陷阱。

如果你在做任何你在乎的東西，把網域當成 production infrastructure。

不要把它當成「$0.20 折價券手癢買一下」。

---

**References:**
- [原文：0xsid.com 的 “Never Buy A .online Domain”】【來源故事脈絡】](https://www.0xsid.com/blog/online-tld-is-pain)
- [ICANN 對 EPP domain status codes 的說明（含 server/client 狀態差異）](https://www.icann.org/resources/pages/epp-status-codes-2014-06-16-en)
- [Google Safe Browsing 的誤判回報入口（回報不安全警告）](https://safebrowsing.google.com/safebrowsing/report_error/)
