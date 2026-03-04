---
layout: post
title: "Outlook.com 郵件『大翻車』這種事，最可怕的不是錯一次，是信任慢慢被磨掉"
date: 2026-03-04 12:20:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![郵件壅塞示意圖](/img/posts/2026-03-04-outlook-email-carnage-01.webp)

我不是想酸 Microsoft。
我只是想提醒一件工程師很熟、但每次出事還是會被打醒的事：
**使用者不會感受到你的架構有多漂亮，他只會感受到你沒演練過的失敗狀態。**

今天的案例是 [Outlook.com 郵件疑似出現延遲、漏信等狀況，引發用戶抱怨](https://www.theregister.com/2026/03/04/users_fume_at_outlookcom_email/)。

而 email 的事故特別痛，因為 email 是一種「信任管線」。
它一旦怪起來，用戶不是只有不爽而已，是會開始懷疑自己的整個流程：
「我到底有沒有寄出去？對方到底有沒有收到？」

## 我在乎的五個角度

### 1) Email 本質上是個你看不到的 queue（所以大家第一反應就是它壞了）
聊天軟體壞掉，你會看到 spinner、看到重送。
Email 壞掉，你通常只看到一片安靜。

這個 UX 空白，會直接變成信任空白：
- 有寄出嗎？
- 有退信嗎？
- 被 filter 了嗎？
- 卡在某個 retry queue 裡嗎？

如果系統是 eventual consistency，那產品也需要 **eventual clarity**。
不然使用者只會用焦慮把空白補滿。

### 2) 可靠性負債（reliability debt）是悄悄累積，然後一次爆很大
大服務很少因為一個「史詩級 bug」才掛。
更多是很多小妥協疊起來：
- 「alert routing 之後再整理」
- 「retry policy 應該還行吧」
- 「這個依賴看起來很穩」

然後某一天，一個 incident 變成幾小時的迷霧，沒人能很有把握地回答：
「影響範圍到底多大？」

### 3) Status page 是產品的一部分，不是公關附件
遇到這種事，用戶要的不是兩週後的完美 postmortem。
用戶要的是 **現在的真相**。

一個好的 status 更新訊息，本質上是一份合約：
- 哪些功能壞了
- 哪些功能沒壞
- 哪些人受影響
- 使用者該做什麼（或不要做什麼）

當客戶需要靠社群平台「集體偵測現實」，你就已經在失速了。

### 4) 真正的成本不是 outage 本身，而是人類的重試行為
最貴的不是「延遲」。
最貴的是使用者會做的自然反應：
- 重寄
- 轉寄
- 暫時換別的信箱
- 產生大量 duplicate
- 打爆客服

這些行為會放大系統負載，還會留下資料一致性問題，等 incident 解除後還要慢慢清。

所以很多時候，最有效的 mitigation 不是只盯 error rate。
而是 **降低使用者的不確定感**。

### 5) 你如果在營運「關鍵通訊服務」，就要把醜狀態拿出來演練
每個系統都有 degraded mode。
差別在於你有沒有把使用者旅程也一起設計好。

值得演練的醜狀態包括：
- 延遲但保證最終會送達
- mailbox 只能部分讀取
- spam filter backlog
- 跨區 failover 造成快取變舊

你不需要完美。
你需要「行為可預期」以及「訊息夠誠實」。

---

**References:**
- [The Register 報導：Outlook.com 郵件狀況引發用戶抱怨](https://www.theregister.com/2026/03/04/users_fume_at_outlookcom_email/)
