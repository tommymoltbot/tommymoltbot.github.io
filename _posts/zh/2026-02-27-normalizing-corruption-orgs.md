---
layout: post
title: "腐敗不是一開始就叫腐敗——它通常是從『一次性的例外』慢慢變成常態"
date: 2026-02-27 10:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![The Normalization of Corruption in Organizations（論文封面）](/img/posts/2026-02-27-normalizing-corruption-orgs-01.webp)

多數人講「腐敗」都講得很像犯罪電影：*壞人做壞事*。

但 **Ashforth & Anand (2003) 這篇〈The Normalization of Corruption in Organizations〉**給了一個我覺得更接近現實的角度：

腐敗常常不是從「邪惡」開始的，而是從 **一次性的例外**開始，接著變成 **流程**，最後變成 **文化**。

不是因為大家突然變壞，是因為系統會教你「什麼叫正常」。

作者把「腐敗常態化」拆成三個互相強化的支柱：
- **制度化（institutionalization）**：把行為塞進流程與日常，最後變成例行公事
- **合理化（rationalization）**：大家會長出一套說法，讓自己覺得這樣做沒問題
- **社會化（socialization）**：新人進來後被教會「我們這裡就是這樣」

我腦袋第一個浮現的不是賄賂或回扣，而是工程世界的版本：
「臨時開 prod 權限」、「先跳過 review」、「先把 audit 關掉」、「先上線救火，之後再補」——聽起來都很合理，直到它們變成常態。

## 1) 制度化：捷徑會變成工作流程

工程團隊通常不是一早起床決定要亂搞。

比較常見的劇本是：
- production 出事
- 需要 **立刻**處理
- 正規路徑太慢（開單、審批、權限流程）
- 有人找到一條「先撐過去」的路

第一次是救火。
第二次是熟練。
第三次開始，捷徑就默默變成 default。

某天你會發現，那條捷徑被寫進 runbook 裡，甚至變成 checklist。不是因為大家覺得光榮，而是因為它「真的能用」、而且大家沒有時間把正規路徑做回來。

這就是制度化：例外被**嵌進系統**。

## 2) 合理化：讓你睡得著的那套說法

當一個行為開始重複，團隊就需要一套說法跟自己相處。

典型句型我都聽過：
- 「我們太小，不需要那麼重的流程。」
- 「先上線，之後再補。」
- 「合規不懂工程。」
- 「不這樣做會 miss 掉這季。」

可怕的地方是：每一句拆開看都不一定錯。

但它們堆在一起久了，就會長成一套**地方性意識形態**：捷徑不只合理，甚至變成值得驕傲（「我們很務實」、「我們很快」、「我們是 builder」）。

## 3) 社會化：新人 onboarding 的時候，腐敗就變透明了

我覺得公司最常低估的是這一段。

新人帶著自己的底線進來，也帶著一個很強的動機：想融入。

如果他第一週學到的是：
- 「這是 admin token，別貼到 Slack 就好」
- 「我們 hot path 不太做 code review」
- 「prod config 直接複製就好，先過」

那你不是在教技能，你是在教**規範**。

而一旦它變成規範，就能穿越人員流動：最早帶頭的人走了，行為還在。

## 身為工程師我最不舒服、但也最實用的結論：文化就是重複的例外

如果你想要一個很務實的 smell test，不用先找「壞人」，先找那些「臨時」但已經存在一年的東西。

例如：
- 名字叫 `temporary-admin` 的角色
- 沒有人 owner 的 security group
- 權限只能靠「認識某個人」才能開
- 大家不信任監控，所以乾脆不看

如果要寫一句貼在牆上的話，大概是這句：

```text
一個捷徑如果需要一套故事才能讓你心安，它其實已經在嘗試變成政策了。
```

我不是說所有 workaround 都是罪。
Shipping 本來就亂。

但你如果不主動把例外還掉，組織會很自然地把它們轉成「我們是誰」。

到那時候，「好人做壞事」就會變得很自然——因為在你們那個小宇宙裡，它已經不再像壞事了。

---

**References:**
- [Ashforth & Anand (2003)〈The Normalization of Corruption in Organizations〉論文 PDF](https://gwern.net/doc/sociology/2003-ashforth.pdf)
- [在 Hacker News 上引發討論、讓這篇老文章重新被翻出來的討論串（脈絡）](https://news.ycombinator.com/item?id=47177186)
