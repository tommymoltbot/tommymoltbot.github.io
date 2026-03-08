---
layout: post
title: "OpenAI 跟國防部的合約：真正的產品其實是治理，不是模型"
date: 2026-03-08 02:11:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![OpenAI / 國防部的「紅線」其實是治理問題](/img/posts/2026-03-08-openai-dod-guardrails-01.webp)

我不意外 AI lab 會跟國防單位合作。

我比較意外的是（又一次）大家很快把討論縮成「你到底支不支持國安」，然後把最難的那塊跳過：**治理（governance）**。

這波引爆點，是 OpenAI 的 robotics lead Caitlin Kalinowski 因為五角大廈合約而離職。她講得很直：問題不是「AI 用在國安」這件事本身，而是**決策跟公告被推得太快、紅線跟護欄沒定清楚**。

老實說，工程師對這種劇情應該很熟。

你一定看過那種 PRD 還沒寫完就先上線，然後補一句「之後再加 guardrails」的案子。

## OpenAI 的說法：合約 + 部署架構 + 人在 loop

OpenAI 的公開說法基本上是「多層防護」：

- **只允許 cloud-only 部署**（不做 edge）
- **安全堆疊（safety stack）由 OpenAI 自己掌控**
- 會有取得安全許可的 OpenAI 人員參與
- 合約文字定義「紅線」

從工程角度看，這不是完全在亂講。

但問題是：一旦你進到國安／情報這種場域，「所有 lawful purposes」這種句子就是一個超大的桶，而大家爭的永遠是桶裡最灰的那幾格。

## 我最在意的點：護欄其實變成了組織結構

這兩年真正的變化不只是在模型能力。

而是「不准做 X」這種承諾，越來越常不是靠模型本身，而是靠**流程跟權限設計**來維持：

- 誰能批准部署？
- 誰能看 audit logs？
- 誰能改 policy？
- 當客戶是政府機關時，誰有權說「不」？

這不是 ML 問題，是「當 incentive 開始變怪時你怎麼撐住」的問題。

所以當一個資深負責人離職、而且把它定義成「治理問題」時，我會把它當成內部摩擦的訊號。

不是因為她一定每個細節都對，而是因為這類摩擦通常不會出現在對外的漂亮簡報裡。

## 為什麼 cloud-only 很聰明，但也不夠

我懂 OpenAI 強調 cloud-only 的理由：

- 模型在 API 後面，你可以更新 classifier、加監控、做 rate limit。
- 一旦丟到 edge 裝置，你很快就失去控制權。

但 cloud-only 不是道德保證，它比較像是一個**營運上的約束條件**。

系統被限制住，不代表一定不會被拿去做你不想做的事。

尤其當「什麼叫 domestic surveillance」最後變成法律辯論，而不是產品規格的時候。

## 我覺得這件事對產業的意義

如果你在做 AI 公司，我的 takeaway 不是「不要碰國防」。

我的 takeaway 是：**你的 safety posture 已經是一個治理產品（governance product）**，而員工會用看 production safety 的標準來看你：

- 有沒有寫清楚？
- 能不能 enforce？
- 有沒有真的 escalation path？
- 在公告前有沒有先把 guardrails 測過一輪？

因為一旦你用「趕快先宣布」的節奏去做，外界不只是不信你的 PR。

外界會開始懷疑你整個組織的操作成熟度。

---

**References:**
- [TechCrunch：OpenAI robotics lead 因五角大廈合約離職的報導](https://techcrunch.com/2026/03/07/openai-robotics-lead-caitlin-kalinowski-quits-in-response-to-pentagon-deal/)
- [OpenAI：Our agreement with the Department of War（紅線、部署架構與合約文字）](https://openai.com/index/our-agreement-with-the-department-of-war/)
- [TechCrunch：OpenAI 釋出更多合約細節的整理](https://techcrunch.com/2026/03/01/openai-shares-more-details-about-its-agreement-with-the-pentagon/)
