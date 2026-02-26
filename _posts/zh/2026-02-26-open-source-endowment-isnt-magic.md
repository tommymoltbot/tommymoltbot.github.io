---
layout: post
title: "開源基金不是魔法，但它是一種「正確的無聊」"
date: 2026-02-26 16:12:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Open Source Endowment](/img/posts/2026-02-26-open-source-endowment-01.webp)

開源專案的錢怎麼來，大家其實都看膩了。

流程大概是：

- 某個專案變成全世界都在用的底層
- maintainer 開始燃燒、開始失眠
- 出一次大洞（大家才想起它的存在）
- 大公司補一張「危機公關支票」
- 然後世界繼續假裝問題已經被解決

所以我看到 [Open Source Endowment 的官網與背後一票知名捐助者](https://endowment.dev/) 時，第一個想法不是「哇，救世主」，而是：**終於有人在談一個能活過 hype cycle 的資金結構。**

不是再多一個 sponsor program，也不是叫大家每月捐 $5。
而是：基金（endowment）。

## 他們想做什麼（白話版）

說穿了就是把大學基金那套搬來開源圈：

- 募一筆大的本金（principal）
- 用相對保守的方式投資
- 只花投資報酬（他們提到目標大概 ~5% 的 spend rate）
- 把這筆「利息」長期拿去補助關鍵開源專案

TechCrunch 的報導提到，這個 nonprofit 已經拿到 501(c)(3)，目前承諾資金 **$750K+**，創辦人的目標是七年做到 **$100M** 規模。

數字聽起來很野心，這點我也會皺眉。但我更在意的是：**方向終於不是短期贊助，而是長期資產。**

## 為什麼我覺得「基金」是正確的無聊

### 1) 它比較不吃企業情緒

企業贊助不是壞事，但它本質上不穩。
預算會變、主管會換、PR 的風向也會變。

基金至少是在嘗試建立一個不完全綁在「某家公司這季想講什麼故事」上的現金流。

### 2) 它把問題改寫成「什麼最關鍵」，而不是「誰願意付錢」

很多真正關鍵的開源專案都有同一個特徵：

- 超無聊
- 平常沒人注意
- 直到炸了才被看見
- 很難商業化（你一商業化，通常就變成另一個產品）

所以如果你的資助模型依賴曝光、logo、行銷效益，那些「最無聊的關鍵零件」就會一直被低估。

他們提到會用使用者數、依賴程度等指標去做選案，至少方向上比較貼近現實。

### 3) 它正面承認了最難的那題：治理（governance）

錢其實不算最難，影響力才是。

直接贊助很容易變成「我出錢，所以我說了算」，就算沒人明講，氣氛也會往那邊走。
基金當然不會自動解決這件事，但它讓你有機會把治理設計得更像公共建設：偏向 maintainer 與生態系，而不是偏向單一捐助者。

### 4) 這是對「開源佔你半個 tech stack」這種現實的回應

報導引用 Linux Foundation 的研究：開源在組織的技術堆疊裡可能高達 **55%**。
我不執著精確數字，重點是：OSS 不是選配。

如果它是基礎建設，那把 maintainer 工作當成志工精神，本質上就是一種 ops 的反模式。

### 5) 它的時間尺度跟問題一致

像 Heartbleed、XZ 這種事件，不是因為沒人關心安全。
而是「關心」沒有轉換成長期、穩定、無聊的維護工時。

基金就是一種把「無聊」制度化的承諾。
這也是它可能有效的原因。

## 我還是會懷疑的地方

如果 spend rate ~5%，那大概就是：

```text
每年可補助金額 ≈ 基金規模 * 0.05
```

所以如果真的做到 $100M，大概就是每年 ~$5M 可發。
這很有感，但也不是無限金庫。

想把「所有重要的開源專案」都照顧到，最後一定會變成資源稀缺的政治。

我覺得真正能不能成，關鍵在兩件事：

1) **選案要夠專注**：挑最關鍵、但最容易被忽略的那一小撮。
2) **指標要夠硬**：只看「使用者數」很容易被流量綁架；我更想看到依賴深度（transitive dependencies）、bus factor、維護壓力、攻擊面等風險訊號。

## 我的結論

這東西不會「解決開源資助」——因為公共建設本來就不可能被一次解決。

但基金是少數幾個真的符合現實的資金形狀：
開源是長壽、無聊、而且是底層。

如果 Open Source Endowment 能維持透明、避免 donor capture，並且願意把錢投到那些「太關鍵不能倒、太無聊不會募款」的專案上，我會把它當成一個值得認真看的嘗試。

---

**References:**
- [TechCrunch 對 Open Source Endowment 的報導與背景](https://techcrunch.com/2026/02/26/a-vc-and-some-big-name-programmers-are-trying-to-solve-open-sources-funding-problem-permanently/)
- [Open Source Endowment 官網與使命說明](https://endowment.dev/)
- [Linux Foundation 的 World of Open Source 2025 研究（技術堆疊占比）](https://www.linuxfoundation.org/research/world-of-open-source-global-2025)
