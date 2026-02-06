---
layout: post
title: "Temporal 的 bundled API 反噬：Masked Namespace（CVE-2025-14986）其實很工程" 
date: 2026-02-06 22:10:00 +0000
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
image: /img/posts/2026-02-06-temporal-masked-namespace.webp
---

![外層 request 與內層 operation 帶了不同 namespace 的示意圖](/img/posts/2026-02-06-temporal-masked-namespace.webp)

我一直覺得「把多個操作包成一個 API」這件事很誘惑。

- client 少打幾次
- 看起來更像交易（transaction）
- PM 會很開心：一次就搞定

但工程師應該要有一個條件反射：**bundled API 會把你拉進一個小型解譯器地獄**。

Temporal 的 **CVE-2025-14986** 就是很典型的例子：外層 request 的 namespace 通過授權檢查，但內層 operation payload 又偷偷帶了另一個 namespace，然後「準備請求」的那段流程竟然用了內層的 namespace。

這不是那種一看就炸裂的 bug。
更像是你以為 invariant 還在，結果它早就默默不見了。

## 正確的心智模型應該是什麼
如果 API 的 envelope（外層）寫的是：

- outer `namespace = AttackerNS`

那系統內部就應該把「所有事情」都當成 AttackerNS 的 scope。

因為不然你就等於在同一個 request 裡允許了兩個身份（identity）。
而這種設計，只要夠複雜，一定會在某個角落用錯。

## 事情怎麼歪掉的（白話版）
Temporal 的 multi operation endpoint：

1) 在入口先用外層 namespace 做 authorization（這一步是對的）
2) 拆包後，內層 operation 可以帶自己的 namespace field
3) 系統在「policy / schema / alias」之類的準備階段，參考了內層 namespace
4) 但在 routing / persistence 的時候，又用回外層、已驗證的 namespace ID

這種「外層檢查 A，但中途用 B」就是典型的 identity binding bug。
安全圈常叫 confused deputy。

## 為什麼我覺得這是工程問題（不是只有 security 才該管）
兩個很工程的理由：

1) **Bundling 會把狀態空間放大。**
   你一旦允許巢狀操作，其實就是在 server 端做一個小 DSL。

2) **Policy evaluation 本身也是跨租戶的觸碰。**
   就算最後資料存回 attacker namespace，你在準備階段去讀取/套用另一個 namespace 的 schema 或 policy，本質上就已經有租戶邊界問題。

而且這類 bug 最容易「每段 code 看起來都合理」，但全局 invariant 已經裂了。

## 修法很無聊，但這才是重點
修補方式很直白：**強制內層 namespace 必須等於外層 namespace**，不一致就直接 fail。

這不帥。
但它把 invariant 拉回來了：一個 request 只能有一個身份。

如果你自己也在設計 bundled API，我的 checklist 很簡單：

- identity 在 envelope 決定一次就好
- 其他欄位全部當不可信輸入
- 巢狀欄位如果跟 envelope 打架，直接拒絕

你如果真的需要「一個 request 內多身份」，那你其實在做的是另一種系統，請你有意識地設計它。

---

**References：**
- [depthfirst：The Masked Namespace Vulnerability in Temporal（CVE-2025-14986）](https://depthfirst.com/post/the-masked-namespace-vulnerability-in-temporal-cve-2025-14986)
- [NVD：CVE-2025-14986 條目](https://nvd.nist.gov/vuln/detail/CVE-2025-14986)
- [Temporal 官方網站（產品與文件入口）](https://temporal.io/)
