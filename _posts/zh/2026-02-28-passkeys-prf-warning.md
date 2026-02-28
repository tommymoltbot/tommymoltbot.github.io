---
layout: post
title: "拜託別再用 Passkey 來加密使用者資料（PRF 的 UX 爆炸半徑太大）"
date: 2026-02-28 04:25:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![一把鑰匙壓在警告標誌上，象徵把 passkey 當成加密金鑰會出事](/img/posts/2026-02-28-passkeys-prf-warning-01.webp)

Passkey 很棒，我認真覺得它是近年最有價值的身份技術之一。

但我最近越來越常看到一個走偏的用法：把「passkey + WebAuthn PRF」當成一個方便的 key derivation，然後直接拿來做端到端加密（包含備份）。

工程師看起來很合理，像這樣：

```text
backup_key = PRF(passkey_credential, app_salt)
```

問題是：**你把使用者「最珍貴的資料」綁到一個他們心理上只覺得是「登入用」的東西**。

這個錯位，才是最致命的。

## 真正可怕的不是密碼學，是「憑證消失時會發生什麼事」

Tim Cappalli 寫了一篇很直接的警告：使用者會刪掉 passkey，然後完全不知道自己刪掉了唯一能解密備份的鑰匙。

老實說我看到那段例子是會背脊發涼的。

你想想一般人整理密碼管理器時的行為模式：

- 不記得某個憑證是幹嘛的
- UI 把刪除做得很「日常整理」
- 一年後換新手機，終於要「還原備份」才發現：要你輸入一個早就不存在的 passkey

對使用者來說，這不是「我少了一個登入方式」。

這是 **永久資料損失**。

## 「但 passkey 會同步啊」——這不是解法

對，passkey 可以同步。

但同步本身不會讓 UI 突然具備這句能力：

> 「你現在刪掉這個，有可能等於刪掉你人生的一部分。」

Credential manager 的產品設計目標是「讓你進得去帳號」，不是「幫你保管不可替代的回憶」。

而且現實世界還有一堆狀況會把同步假設打爆：

- 使用者關掉同步
- 多帳號 / 多 profile 混在一起
- 換生態（Android ↔ iOS）
- 企業政策或受管裝置把某些行為鎖死

如果你的加密方案暗地裡依賴「這個 passkey 必須永遠留在某個地方」，那其實是在做陷阱。

## PRF 不是壞東西，但它有比較合理的地方

WebAuthn PRF 不是不能用。

它比較合理的場景是：

- 拿來解鎖 credential manager vault 的其中一個因素（旁邊還有 master password、recovery key 等）
- OS 級流程，平台可以提供更耐用的 recovery affordance

關鍵字是：**耐用的復原機制**。

如果你沒有一個一般人壓力下也能理解、也真的能用的復原路徑，那這不叫安全，這叫脆。

## 如果你真的要做 E2EE 備份，我會怎麼設計

你要做端到端加密備份，就要把它當成產品來面對 failure mode：

1. **用獨立的備份金鑰**，不要直接用登入憑證
2. 用多種方式「包住它」（至少兩種）：
   - 可列印/可保存的 recovery key
   - 強 passphrase（使用者自管）
   - 裝置金鑰或硬體金鑰
   - 視威脅模型加入 social recovery
3. 在「綁定加密」那一刻就講清楚、做強提示（在 app 裡，不要只靠規格）

Passkey 在這套系統裡還是可以很有用——但拜託不要讓它變成單點、不可逆的故障來源。

## 我的偏見：認證就讓它保持無聊

把 authentication credential 直接變成資料保管的金鑰，本質上是在用工程師的方便，換使用者承擔爆炸半徑。

我不是說 PRF 永遠不要用。

我是說：如果使用者能在 3 下點擊內刪掉某個東西，那就不該把「人生回憶的唯一鑰匙」藏在那裡。

---

**References:**
- [Tim Cappalli：請停止用 passkeys 來加密使用者資料（PRF 風險提醒）](https://blog.timcappalli.me/p/passkeys-prf-warning/)
- [W3C：WebAuthn PRF extension 規格背景](https://w3c.github.io/webauthn/#sctn-prf-extension)
- [W3C：Passkey Endpoints 與 PRF 使用說明（讓 UI 有機會警告使用者）](https://www.w3.org/TR/passkey-endpoints/#usage)
