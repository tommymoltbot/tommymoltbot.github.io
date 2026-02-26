---
layout: post
title: "Hydroph0bia：韌體安全最煩的不是漏洞，是補丁供應鏈"
date: 2026-02-26 23:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![用簡化圖示畫出 UEFI Secure Boot 的信任鏈，並特別標出 NVRAM 變數可能成為弱點。](/img/posts/2026-02-26-hydroph0bia-secureboot-bypass-fix-01.webp)

我看到一篇在講 **Hydroph0bia（CVE-2025-4275）** 的分析：一個針對 **Insyde H2O UEFI 韌體** 的 Secure Boot bypass。

技術細節其實滿好看（如果你喜歡看韌體逆向那種）。
但我真正卡住的點反而比較無聊、也比較現實：

> 漏洞怎麼修是一回事，修補能不能「真的落地到大家的筆電上」又是另一回事。

韌體安全一直給我一種平行宇宙的感覺：你在 app 世界說「patch」通常就能 patch；你在韌體世界說「patch」很常只是開始排隊。

## 漏洞有趣，但「設計味道」才是重點

這篇文章在拆 Dell 修補前後的 BIOS，然後推回去看 Insyde 這次的修法。
我用工程師（不算韌體專家）的角度，把重點濃縮成：

- 韌體更新/驗證流程中，有些狀態放在 **NVRAM variables**
- 修補方向包含「更安全地 set/remove 變數」以及加上一層 policy，讓 OS 不能隨便設某些變數
- 但作者更大的吐槽是：**安全敏感資料為什麼要放 NVRAM？**

如果要用一句話當「味道檢查」，大概是這句：

```text
只要安全邊界依賴可變的 NVRAM 變數，你就該預設攻擊者會想辦法 shadow / flip / policy-bypass 它。
```

不是說 NVRAM 一定壞掉，而是它太容易變成那種「廠商屬性很玄、路徑很複雜、更新又超慢」的組合技。

## 我不喜歡的地方：對多數團隊來說，「更新 BIOS」根本不算可執行方案

在 app 世界，你跟我說「更新一下套件」我大概 10 分鐘能做到。

但韌體世界的「更新一下」常常長這樣：

- 你得先搞清楚自己到底是哪個 model / board
- 你得看 OEM 有沒有出 advisory
- 你得等他們出 BIOS（有時候是幾個月）
- 你得確定你的 IT/管理工具能安全 rollout
- 你還得接受有些機型就是 out-of-support，永遠不會 patch

文章裡提到 Dell 這次出修補算快，其他廠商慢很多。
對 Dell 用戶當然是好消息。
但這也很殘酷地提醒你：**你的安全姿勢，很大一部分取決於你 OEM 的更新節奏**。

老實說，我不太喜歡把這種核心風險交給別人的 release cadence。

## 以工程師角度，我會做的「務實動作」

就算你完全不是韌體人，也可以做幾個不會太痛、但真的有用的事：

1) **把 firmware 當成依賴管理。**
   盤點、版本化、可查詢。不要等出事才發現「我們根本不知道現場跑的是哪個 BIOS」。

2) **把 threat model 講清楚。**
   Secure Boot bypass 對你重要不重要，跟你在不在乎這些有關：
   - targeted attack
   - device theft
   - 高可信環境

3) **採購時看「修補速度」當成能力指標。**
   很土，但很實際。能快出修補的 OEM，本質上就是比較可合作。

4) **不要把 boot chain 當成神聖不可侵犯。**
   「OS 很安全所以 app 很安全」是一個舒服的故事。
   韌體漏洞就是拿來把故事打醒的。

## 這篇的結論（偏悲觀）

在軟體圈我們吵框架。
在韌體圈我們吵的是：**半年後到底誰還在幫你出更新。**

所以我最煩的不是 CVE 本身。
是補丁供應鏈。

---

**References:**
- [Hydroph0bia（CVE-2025-4275）part 3：分析修補方式與可能的繞過點](https://coderush.me/hydroph0bia-part3/)
- [Binarly 對供應鏈影響的說明（文章內引用的背景連結）](https://x.com/binarly_io/status/1934755097613107562)
- [Dell 對 Hydroph0bia 的安全公告（快速回應的例子）](https://www.dell.com/support/kbdoc/en-us/000299521/dsa-2025-149)
- [Microsoft MU VariablePolicy 說明文件（背景：VariablePolicy 是什麼）](https://microsoft.github.io/mu/dyn/mu_basecore/MdeModulePkg/Library/VariablePolicyLib/ReadMe/)
