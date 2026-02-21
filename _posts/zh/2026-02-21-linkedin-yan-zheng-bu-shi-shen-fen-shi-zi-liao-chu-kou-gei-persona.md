---
layout: post
title: "LinkedIn 驗證不是身分（比較像把資料出口給 Persona）"
date: 2026-02-21 19:00:00 +0000
categories: [Tech]
tags: [Tech]
author: Tommy
excerpt: "那個『已驗證』徽章比較像 UI 的信任貼紙。真正的交易是：你把護照 + 自拍 + 裝置指紋交給第三方（Persona），資料再穿過一串 subprocessor。把它當成『你在採購一個供應商』，而不是按一下打勾。"
lang: zh
---

![A dark, minimal illustration of a blue checkmark floating above a passport scan frame and a camera selfie outline, connected by data pipeline arrows.](/img/posts/2026-02-21-linkedin-persona-data-export.webp)

我可以理解為什麼很多人想要 LinkedIn 的「已驗證」徽章。

假 recruiter、假帳號、機器人頭像現在已經不是少數，是日常。你看著一個 checkmark，很自然會覺得：「至少這個人比較像真的。」

但我把一篇把整個流程拆開來寫的文章看完之後，只剩下一個結論：

**LinkedIn 驗證比較不像『身分』，更像是一個『資料出口』。**

你不是把護照交給 LinkedIn。

你是在把你的身分資料交給一個第三方的身分驗證供應商。

## 我用五個角度想這件事

1) **「信任貼紙」角度**

在產品層面，驗證是一個 UX 補丁：

- 使用者可以用徽章做快速篩選
- 平台可以說自己在打詐

這不是完全沒用。

但它也不是什麼硬安全保證。

已驗證的帳號依然可能：

- 被社交工程釣走
- 被接管
- 或者只是『真人但行為像 bot』

2) **「你不是客戶」角度**

這個流程的客戶是 LinkedIn。

你是被驗證的輸入。

供應商（這裡是 Persona）最佳化的是：

```text
reduce_fraud_for_platform(user) -> verification_result
```

不是：

```text
minimize_data_collection_for_user(user) -> verification_result
```

所以當流程一直想要多拿一點資料，通常不是因為它在保護你。

3) **「生物特徵不可撤銷」角度**

密碼很爛，但至少能換。

生物特徵剛好相反：

- 你的臉沒辦法 rotate
- 你的護照號碼、生日也不是你說換就能換

供應商如果承諾會刪除 biometric template，那當然好。

但我用工程師的腦袋讀這種承諾時，會一直看三件事：

- 預設（default）
- 例外（exception）
- 法律保留（legal hold）

因為真正決定風險的，通常是例外。

4) **「subprocessor 供應鏈才是重點」角度**

那篇文章把 Persona 公開的 subprocessor 名單也整理出來。

我覺得這是讓整件事從「我在驗證」變成「我在走供應鏈」的關鍵點。

不是陰謀論。

就是很無聊、很現代 SaaS 的現實：大家什麼都外包。

基礎建設、資料分析、風險模型、裝置指紋、客服。

每一跳單獨看都能辯護。

但鏈越長，風險就越不像你以為的那個『3 分鐘的自拍』。

5) **「把它當成 vendor 決策」角度**

我覺得最重要的心態轉換是這個：

**把驗證當成你在公司採購一個新 vendor。**

如果公司說：

> 「把你的護照 + 自拍交給這個第三方，換一個徽章，很快啦。」

你一定會問：

- 會留多久？
- 用途是什麼？
- 怎麼刪？
- 有哪些分包商會碰到資料？

但當我們是個人，就只會按下去。

然後再驚訝「欸怎麼這麼像 onboarding」。

## 我自己的無聊結論（但比較實用）

- 不需要徽章就別做。
- 需要做（求職、業務、招募）就做，但要知道你在換什麼。
- 如果你所在的法域有比較強的個資權利，可以用：申請資料副本、驗證完成後申請刪除。

checkmark 很表面。

真正的交易是那條資料管線。

---

**References：**
- [The Local Stack — “I Verified My LinkedIn Identity. Here's What I Actually Handed Over.”（拆解 Persona 蒐集內容、subprocessor 與法律脈絡）](https://thelocalstack.eu/posts/linkedin-identity-verification-privacy/)
- [Persona — subprocessor 公開名單（哪些公司會處理驗證資料）](https://withpersona.com/legal/subprocessors)
- [US Congress — CLOUD Act 法案資訊（美國公司即使資料放海外仍可能受美方要求提供）](https://www.congress.gov/bill/115th-congress/house-bill/4943)
