---
layout: post
title: "AirSnitch 讓『訪客 Wi‑Fi 隔離』看起來更像一種氣氛，不像邊界"
date: 2026-02-26 17:05:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![AirSnitch 與 Wi‑Fi client isolation](/img/posts/2026-02-26-airsnitch-client-isolation-01.webp)

大多數人開訪客 Wi‑Fi，跟鎖浴室門的心態差不多：不是覺得一定會被偷，而是「有邊界比較不尷尬」。

所以我一直把「client isolation（用戶隔離）」當成一個很踏實的保險：你來我家上網可以，但你不要跟我的筆電、NAS、印表機，還有那台默默跑著 Linux 3.10 的 IoT 垃圾說話。

AirSnitch 這篇研究，會讓你重新看待那個路由器設定裡的勾勾：它看起來不太像邊界，更像是一種……氣氛。

## 這次麻煩的點不是「Wi‑Fi 加密又被破解」

研究者不是在說「WPA 又死了」。他們講的是更煩的版本：

就算 Wi‑Fi 的加密本身沒有直接爆炸，**client isolation 仍然可能被繞過**，原因在於更底層（Layer 1/2）的行為、身份綁定與同步不一致，以及各家廠商用很零散、很不標準的方式去「補」隔離功能。

而多數人的直覺模型是：

- 不同 SSID + 不同密碼 = 不同信任區
- 訪客隔離 = 沒有 lateral movement

AirSnitch 的意思大概是：*不要太相信它。*

## 為什麼這對你有影響（就算你每天都在用 HTTPS）

這類攻擊的核心是把自己塞到「機器在中間」的位置（machine-in-the-middle）。一旦做到了，很多老派的套路又回來了。

你可能會想：「但現在大家都 HTTPS 啊。」

嗯，*大部分* 是。但現實世界還是會漏：

- 明文 HTTP 還存在（尤其是公司內部系統、老舊管理介面）
- DNS 只要你站對位置，就很香（你不想被人亂帶路）
- 很多裝置的設計前提仍是「同一個 Wi‑Fi = 可信任的 local network」

如果你做過任何依賴「內網很安全」假設的系統，你應該知道這句話有多危險。

## AirSnitch 讓我覺得不舒服的原因

Wi‑Fi 的歷史上有很多大事件是「協定被打爆」→ 產業花幾年遷移。

AirSnitch 比較像是：管線（Layer 1/2 的一些特性、AP 怎麼把身份和流量對起來）本來就有尖角；各家廠商自己做了一套隔離補丁；補丁之間有縫。

所以它才會在一堆消費級／企業級設備上都能打到至少一種變形攻擊。

## 實務上你可以怎麼看待這件事

我不會說每個人今晚就要改網路架構。但我覺得要更新一下心智模型：

1. **把訪客 Wi‑Fi 當成「比較不信任」，不要當成「已隔離」。**
   你要的是隔離邊界，不是心理安慰。

2. **該更新路由器還是更新。**
   有些緩解措施已經在出現。「可能需要晶片層級修」不是不更新的理由，而是你應該假設它會分階段被修補。

3. **不要讓任何敏感東西依賴『內網安全』假設。**
   看到還在用明文 HTTP 的管理介面，真的不要說「很復古」，那叫 bug。

4. **如果你在公司管網路：威脅模型要重算。**
   很多企業 Wi‑Fi 的預設假設是：client isolation 足以擋掉 ARP spoofing 那種古早年代的本地網路 chaos。這篇研究就是提醒你：年代沒有死，我們只是以為它死了。

Wi‑Fi 沒有因此變得不能用。

它只是回到它原本的樣子：共享媒介，上面疊了很多很聰明、但也會老化的工程。

而如果你是那種會跟鄰居說「密碼給你啦，我有開隔離」的人……我建議你偶爾換一下訪客密碼。不是恐慌，是我們都知道「隔離功能」通常會隨時間變成一種傳說。

---

**References:**
- [Ars Technica 對 AirSnitch（繞過 client isolation）的報導](https://arstechnica.com/security/2026/02/new-airsnitch-attack-breaks-wi-fi-encryption-in-homes-offices-and-enterprises/)
- [NDSS 論文頁：AirSnitch — Demystifying and Breaking Client Isolation in Wi‑Fi Networks](https://www.ndss-symposium.org/ndss-paper/airsnitch-demystifying-and-breaking-client-isolation-in-wi-fi-networks/)
