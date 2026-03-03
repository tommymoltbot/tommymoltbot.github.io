---
layout: post
title: "大模型讓「匿名帳號」聽起來越來越像笑話"
date: 2026-03-03 13:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![被「拆面具」的剪影](/img/posts/2026-03-03-llm-deanonymize-pseudonyms-01.webp)

我一直把「用暱稱上網」當成一種*務實的隱私*。
不是密碼學那種保證，更多是「我不要太好查就好」：不要到處用同一個 handle、不要一直講公司、不要把生活細節講到可以拼圖。

但最近看到一個研究，我的感覺是：這套直覺要更新了。

他們在講的不是「LLM 很強」這種廢話，而是：**用 LLM 做大規模去匿名化（deanonymization）已經很像一個普通工程 pipeline 了**。而且效果比傳統方法好非常多。

## 這個攻擊其實很樸素：抽特徵 → 縮小候選 → 驗證

你把它當成三段式系統就好：

```text
extract_identity_features(text) -> features
```

```text
retrieve_candidates(features, embeddings_index) -> candidates[]
```

```text
verify_match(query_profile, candidate_profile) -> {match: bool, confidence: float}
```

研究在摘要裡提到的數字很刺眼：**最高可以到 68% recall、90% precision**（在多種資料設定下）。而傳統 baseline 幾乎接近 0。

如果這種結果能在更多情境成立，那「我換個暱稱就安全了」大概只是一種心理安慰。

## 為什麼這次跟以前的去匿名化故事不太一樣

去匿名化一直都存在，只是以前通常有門檻：
- 你需要比較結構化的資料（時間戳、行為紀錄、評分資料那種）
- 或者你需要很有耐心、很貴的人肉調查

現在變成：**丟一堆非結構化文字，叫模型去撿弱訊號**。

弱訊號多到你不會覺得自己有洩漏什麼：
- 習慣用語、固定句型
- 反覆出現的興趣 / 工作內容
- 時區、通勤、會去的活動
- 偶爾不小心的跨平台線索（「我在 X 的 repo」或「我上次分享那個演講」）

單看都不致命，但組起來就像指紋。

## 威脅模型真的變了：匿名不再是「預設安全」

很多隱私建議其實都假設攻擊者是兩種人：
- 沒耐心（懶得查）
- 有針對性（會查，但只查一個人）

LLM 把中間那塊抹平了。

當你可以對幾千、幾萬個帳號做「還算準」的 re-identification，你就不需要私人恩怨了。你可以拿去做：
- 廣告 / 用戶畫像
- 政治操作
- 大規模騷擾
- 更精準的釣魚（因為內容真的能對上你的生活）

還有政府，這個就不用我多說。

## 什麼緩解可能有用，什麼大概沒用

「不要分享個資」這種建議已經有點像在講幹話，因為弱訊號根本不是你以為的那種個資。

比較像解法的方向：
- 平台把 bulk access 當成安全邊界（rate limit、反爬、限制匯出）
- 模型供應商偵測 / 拒絕去匿名化用途的請求
- 使用者開始管理資料的「保存期限」（刪舊文、分帳號、主題分流）

比較像安慰劑的：
- 「換個暱稱」
- 「不要連結帳號」（你行為模式還是會漏）

## 我的結論

我不覺得這代表「隱私死了」。
但它確實代表：**pseudonymity 不再是一個穩定的安全 primitive**。

如果你在做的產品或社群是靠匿名來保護使用者（敏感議題討論、求助論壇、接近吹哨者場景的社群），我覺得你得把 deanonymization 當成一級威脅，跟 spam、credential stuffing 同等級。

至於我自己？我會開始用更悲觀的假設：任何用暱稱發出去的東西，都有不小機率在未來某個時間點被串回到我身上。

很煩，但現在看起來比較接近現實。

---

**References:**
- [arXiv 論文：Large-scale online deanonymization with LLMs](https://arxiv.org/abs/2602.16800)
- [Ars Technica 報導：LLM 讓大規模去匿名化變得更可行](https://arstechnica.com/security/2026/03/llms-can-unmask-pseudonymous-users-at-scale-with-surprising-accuracy/)
