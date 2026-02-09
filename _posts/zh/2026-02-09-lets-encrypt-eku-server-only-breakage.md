---
layout: post
title: "Let’s Encrypt 這次改動，可能會把某些 Server-to-Server TLS 直接打斷"
date: 2026-02-09 22:05:00 +0000
categories: [Engineering, Tech]
tags: [Engineering, Tech]
author: Tommy
excerpt: "2026/02/11 起 Let’s Encrypt 預設只發 EKU=serverAuth 的憑證。聽起來很合理，但一旦你跑的是 server-to-server 協定（伺服器也會當 TLS client 主動連線），就有機會遇到驗證失敗。"
image: /img/posts/2026-02-09-lets-encrypt-eku-server-only.webp
---

我其實很喜歡那種「沒人在乎、代表運作正常」的基礎建設。

證書（TLS / X.509）就是其中一種。理論上應該很無聊。

但 **小改動 + 大半徑** 的事情一出現，我就會開始緊張。

Let’s Encrypt 宣布：**2026/02/11 起，預設簽發的憑證會把 Extended Key Usage（EKU）改成只包含 server authentication**。

如果你的世界只有 HTTPS，你大概完全不會感覺。

但如果你有跑一些 **server-to-server / federation / mTLS mesh** 這類場景，事情就可能變得很不「無聊」。

## 這次到底改了什麼（用白話講）

很多 CA 以前發的憑證，EKU 會同時包含：

- **serverAuth**：可以用來證明「我是一個伺服器」
- **clientAuth**：可以用來證明「我是一個客戶端」

Let’s Encrypt 要把預設的 **clientAuth 拿掉**。

所以某些 TLS stack 在驗證對方憑證用途時，會認定：

> 你現在扮演的是 client，可是你的憑證沒有 clientAuth，不給過

然後 handshake 就結束。

## 為什麼 server-to-server 會中槍

這裡是最容易踩雷的地方：**TLS 的「client / server」是指連線角色，不是指產品形態。**

在很多 server-to-server 的協定裡：

- A 伺服器主動連到 B 伺服器
- A 會拿自己的憑證證明「我就是 example.com 那台」

從 TLS 角度看：

- 主動發起連線的一方 = **TLS client**
- 被連線的一方 = **TLS server**

所以如果某個 library / config 很死板地把「TLS client 出示的憑證」當成 **client certificate** 來驗 EKU，它就會要求 **clientAuth**。

但 operator 心裡想的是：

- 「這是伺服器的憑證啊，怎麼會不能用？」

兩邊都很像是對的，只是他們根本不是同一種「對」。

## XMPP 是最明顯的案例（Prosody 的文章解釋得很清楚）

我覺得講得最清楚的是 Prosody 團隊這篇：

- [Prosody：Let’s Encrypt EKU 改動對 operator 的影響說明](https://blog.prosody.im/2026-letsencrypt-changes/)

XMPP federation（server-to-server）就是典型案例：

- 伺服器跟伺服器互連
- 憑證用來證明 domain 控制權
- 「誰是 client？」這件事在 spec 跟實務之間會變成語義炸彈

Prosody 說他們早就能接受這種「server-only」憑證，但其他實作不一定。

如果你跑 XMPP：不要等到 2/11 才看 log。

## 我的看法：這不是 Let’s Encrypt 的鍋，是介面（contract）不清楚

表面上看，大家會說：

- 「TLS 很複雜啦」

但底層其實是 **介面定義不夠乾淨**：

- 我們把「憑證」當作「某個 entity 的身份證」
- TLS spec 以「每條連線」的 client/server 角色在描述
- operator 以「這是 server 軟體 / 這是 client app」的產品視角在理解

模型不一致，就會各自長出不同的 implementation。

然後只要一個大 CA 改了預設值，整個生態就開始出現縫。

## 我會怎麼做（如果我真的在營運 federated 系統）

我不覺得每個人都該變 PKI 專家。但這件事至少要當成一次 production change 來處理。

我會做這幾件事：

1. **盤點所有 server-to-server 的協定**
   - XMPP federation、SMTP、mTLS mesh、或任何你們內部「兩台 server 互相驗身份」的東西。

2. **用「EKU=serverAuth only」的路徑做測試**
   - 如果你的 stack 會硬性要求 initiating side 必須有 clientAuth，你很快就會看到失敗。

3. **升級 server 版本（或調整 TLS 驗證策略）**
   - upstream 如果已經修，直接吃 patch。

4. **盯 log 裡的憑證用途錯誤**
   - 常見訊息會像「invalid purpose」「unsupported certificate purpose」或乾脆一個「handshake failure」。

最後講一句比較不討喜的：

當你使用的 CA 生態本質上是由瀏覽器廠商（browser vendor）主導的，你就要預期未來還會有更多「web 的假設」滲透到非 web 的場景。

不一定是惡意。

只是那裡才是壓力來源。

---

### References

- [Prosody 團隊：Let’s Encrypt EKU 改動與 XMPP federation 影響](https://blog.prosody.im/2026-letsencrypt-changes/)
- [Let’s Encrypt 官方公告：預設停止 TLS client authentication EKU](https://letsencrypt.org/2025/05/14/ending-tls-client-authentication)
