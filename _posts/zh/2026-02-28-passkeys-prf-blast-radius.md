---
layout: post
title: "Passkey 不該拿來當加密金鑰：PRF 的爆炸半徑問題"
date: 2026-02-28 10:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![把加密綁在 passkey 上的風險提示](/img/posts/2026-02-28-passkeys-prf-blast-radius-01.webp)

Passkey 這東西我其實很喜歡——它把「釣魚」這種低級攻擊直接壓到很難玩。

但我看到越來越多團隊把 passkey 拿去做「加密資料的金鑰」（通常是用 WebAuthn 的 **PRF 擴充**來導出 key），說要做什麼「端到端加密備份」、「加密保險箱」之類的功能，我就開始皺眉。

不是因為 PRF 壞掉。
是因為 **失敗的時候，你的使用者會直接失去資料**。

## 真正的坑：爆炸半徑（blast radius）

如果 passkey 只是拿來登入，弄丟了頂多很煩：重新註冊、帳號救回來就好。

但如果你把同一把 passkey 也拿來導出加密 key，弄丟的時候就會變成：

- 備份還在
- 帳號也能救回來
- 但資料 **解不開**，等於死了

更慘的是：設定當下看起來沒什麼差別。
「要不要開啟加密備份？」→ 點兩下 → 完成。

一年後換手機，才發現當初在密碼管理器裡刪掉那個「看起來不重要」的 passkey，其實是在刪掉解密你回憶的鑰匙。

Tim Cappalli 的那篇文講的就是這件事：你把「可替換的憑證」拿去當「不可替換的金鑰」，爆炸半徑會大到你很難跟使用者解釋。

## PRF 為什麼讓人很想這樣做（以及為什麼這是陷阱）

PRF 從工程角度真的很漂亮：你已經有 passkey 了，PRF 又能給你穩定的 secret material，於是你會很自然地想寫出這種設計：

```text
derive_key(prf_output, salt) -> encryption_key
```

整個系統看起來乾淨、簡單、好維護。

但產品上它是地雷：因為 passkey 的心智模型是「登入用的憑證」，使用者一直被教導「憑證可以重設」。

加密 key 不是這回事。你一旦把它們綁在一起，使用者的「正常行為」（同步失敗、換手機、清理帳號、誤刪）就會變成不可逆的資料損失。

## 「可是現在 passkey 會跨裝置同步啊」

很多情況下會。

但同步不是保證，而且更要命的是：**刪除本來就是被支援的操作**。

使用者刪掉 passkey 的時候，他以為自己做的是「清一下憑證」。
你實際上讓他做的是「把解密資料的鑰匙丟進碎紙機」。

這種心智模型落差，靠 FAQ 很難救。

## 如果我是做這個產品的人，我會怎麼做

如果你真正在乎的是「端到端加密備份 / 加密 vault」，你要設計的是 **可持久的復原能力**，而不是把 login credential 變成單點失敗。

我會優先選這幾種方向：

1) **把加密金鑰跟登入分開**
   - passkey 負責「你是誰」
   - data key 負責「你擁有什麼」

2) **提供明確、可理解的復原物件**
   - recovery key（讓人可以抄下來或存起來）
   - 多種復原手段（可信裝置、聯絡人、第二因子）

3) **如果你硬要用 PRF，就把它當炸藥在處理**
   - 啟用時超大聲警告（而且不要假設使用者會記得）
   - 刪除 passkey 時也要有警告（理想狀態是 credential manager 直接做）
   - 在支援頁面清楚解釋你把 PRF 用在哪，並把說明頁 URL 放進 relying party 的 passkey endpoints metadata

如果你沒辦法誠實面對這些 trade-off，那 PRF-based encryption 真的別給一般使用者用。

## 我的結論

Passkey 本來就已經夠難推了。
它不需要再背一個「被刪掉就讓資料永遠解不開」的責任。

做加密功能就用加密功能該有的態度去做：復原設計、心智模型、以及承認使用者會做使用者該做的事。

---

**References:**
- [Tim Cappalli 對「用 passkey + PRF 當資料加密金鑰」的警告原文](https://blog.timcappalli.me/p/passkeys-prf-warning/)
- [WebAuthn PRF extension 的規範段落（了解 PRF 是什麼）](https://www.w3.org/TR/webauthn-3/#sctn-prf-extension)
- [Relying Party Passkey Endpoints metadata（PRF usage details 欄位）](https://www.w3.org/TR/passkey-endpoints/#usage)
