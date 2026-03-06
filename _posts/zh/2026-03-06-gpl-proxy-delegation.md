---
layout: post
title: "GPL 升級的中間路線：用第 14 條 proxy delegation"
date: 2026-03-06 10:30:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![GPL proxy delegation diagram](/img/posts/2026-03-06-gpl-section-14-proxy-01.webp)

GPL 專案每隔一段時間就會遇到一個很煩、但一定要面對的問題：

- 你選 **GPL-3.0-only**：穩，但一旦有多個 copyright holder，要升級版本幾乎是不可能任務。
- 你選 **GPL-3.0-or-later**：彈性很好，但本質上是把「未來 GPL 長什麼樣子」的權力直接交給 FSF。

老實說我兩個都不太愛。

最近看到一個我以前很少聽人提、但其實寫在條文裡的解法：

**用 “GPL-3.0-only” 發佈，但指定一個 proxy，讓他可以公開接受未來版本。**

不是鑽漏洞，是 GPL/AGPL v3 第 14 條就有這個機制。

## 真正的痛點不是法律，是 contributor 現實

理想狀況你是唯一作者，想怎麼改 license 都行。
現實是：

- 你的專案一定會有 contributor。
- contributor 一年後就消失、換公司、換信箱、甚至人都找不到。
- 其中某些 patch 又不是你說拔就能拔掉的那種。

所以當未來真的需要升級 license（出新版、公司法務要求、或是你想跟某些政策對齊），
「去找齊所有人同意」很容易直接卡死。

這也是為什麼很多人乾脆選 “or later”。

但 “or later” 也代表你把未來綁在一個你控制不了的組織上：
你現在就要承諾接受一個還沒寫出來的 license text。
你信不信 FSF 是一回事，這個承諾本身就很不對稱。

## 第 14 條：給你一條中間路

GPLv3 / AGPLv3 有個設計大概是：

- 你的程式可以指定一個 **proxy**，
- 未來如果有新版本 license，
- proxy 只要公開宣告接受，那個版本就會被永久授權可以用在你的程式上。

所以你可以：

- 今天是 **GPL-3.0-only**（預設穩，不自動升級），
- 但保留一個升級出口（不需要找齊所有 contributor），
- 而且升級權掌握在你指定的 proxy（不是自動把決定權丟給 FSF 的未來草稿）。

這點我覺得滿漂亮的：**你不需要在「永遠凍住」跟「永遠自動升級」之間二選一。**

## 實務上怎麼寫

我看到的做法是在 license notice 裡加一段指定 proxy 的文字（提醒：我不是律師，真的重要就找律師看）：

```text
This project is licensed under the GNU Affero General Public License, Version 3.0 only.

Pursuant to Section 14 of the GNU Affero General Public License, Version 3.0,
<NAME> is hereby designated as the proxy who is authorized to issue a public
statement accepting any future version of the GNU Affero General Public License
for use with this Program.

Therefore, notwithstanding the specification that this Program is licensed
under the GNU Affero General Public License, Version 3.0 only, a public
acceptance by the Designated Proxy of any subsequent version of the GNU Affero
General Public License shall permanently authorize the use of that accepted
version for this Program.
```

proxy 你可以指定：

- 原作者本人
- 你控制的基金會 / 公司法人
- 或是專案自己的治理組織（如果你真的有做 governance）

## 我覺得有意思的其實是 governance

這招表面上是 license 小技巧，但我覺得更像是**專案治理的工具**：

1) **把「誰可以決定升級」寫清楚**，不是靠默契。

2) **避免 contributor 變成人肉 lock-in**。
   你可以維持 contributor 保留 copyright（不走 CLA 路線），但專案還是保有升級能力。

3) **信任邊界更明確**。
   “or later” 的信任邊界是「FSF 未來會寫出什麼」。
   proxy delegation 的信任邊界是「這個你指定、而且理論上可以透過治理替換的人/組織」。

4) **逼你面對接班問題**。
   如果 proxy 是單一 maintainer，人不見就麻煩。
   如果 proxy 是一個有制度的 entity，你專案比較像能活 10 年。

我最近越來越確定一件事：很多時候軟體不是敗在技術，而是敗在「這東西到底誰負責、誰能決策」。

## 我的結論

我不會說這是萬用解。
但如果你是 maintainer，心裡的需求是：

- 預設想要 **GPL-3.0-only** 的穩定感
- 又不想一開始就把未來交給外部組織決定
- 同時希望專案別被 contributor 聯絡名單綁死

那這個 Section 14 proxy delegation 真的值得認真看一下。
就算你最後完全用不到，它至少會逼你把「誰能決定什麼」寫出來，這通常是好事。

---

**References:**
- [Runxi Yu：用第 14 條做 GPL 升級的 proxy delegation 解法](https://runxiyu.org/comp/gplproxy/)
- [GNU AGPLv3 授權條文（第 14 條）](https://www.gnu.org/licenses/agpl-3.0.en.html)
