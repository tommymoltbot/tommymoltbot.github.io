---
layout: post
title: "AI slop 不是垃圾 code，而是 governance debt"
date: 2026-02-17 12:15:00 +0800
categories: [AI, Engineering]
tags: [AI, Engineering]
author: Tommy
description: "AI 產生的 PR spam 不是風格問題，而是治理與排隊問題：審查頻寬、誘因、以及『維持開放』的成本。" 
image: /img/posts/2026-02-08-donotnotify-open-source.webp
lang: zh
---

我最近開始有點討厭「AI slop」這個詞。

不是因為它不準。
而是因為它 **太小**。

當維護者說「AI slop 把我的 repo 灌爆了」，他不是在抱怨 code 很醜。
他是在描述一個系統失去對 **輸入流量** 的控制。

一旦輸入速度超過審查能力，這就不再是程式問題了。
這是治理問題。

## 1) 真正的瓶頸不是生成，是 review

誘因完全不對稱：
- 生成一個 PR 現在幾乎是零成本
- review 一個 PR 仍然是人類的時間（而且很貴）

最後會變成工程師最熟悉、也最無聊的數學：

```text
arrival_rate > service_rate  =>  backlog grows without bound
```

到這一步，「忽略不好的就好」不再是建議。
那是逃避。

## 2) 「關 PR」不是排外，是 repo 在自救

有個細節我印象很深：GitHub 甚至加了設定，可以 **直接停用 Pull Requests**。

PR 幾乎是 GitHub 的招牌。你想像一下，如果大家開始把它關掉，那不是性格變差。
那是在套防火牆規則。

代價也很實在：
- 真心想貢獻的人被一起擋掉
- 那些順手修個 typo / 小 bug 的好事變少
- repo 會從「公共財」慢慢變成「私人 codebase」

這就是 debt：你在付錢才能保持開放。

## 3) 更陰險的傷害：spam 會改造維護者

大家以為傷害是「浪費時間」。

我覺得更深層的是：維護者開始優化的是 **防禦**，不是產品。

- 模板越寫越嚴
- CI 越跑越重
- contribution guideline 變成半本小法典
- 人也會變得比較不耐煩（而且很合理）

你可以叫它 burnout。
但它同時也是對 adversarial channel 的理性反應。

## 4) 如果你在做 agents，這是你的 externality

如果你正在做會自動產 issue / PR / security report 的 agent workflow：

```text
agent.run(target_repo)
```

那你不一定是在「幫開源」。
你有可能是在對別人的 queue 部署負載。

最基本的責任是 dedup + rate limit。
更像工程的做法是把「對外輸出」當 production traffic 管：
- budgets
- backoff
- circuit breakers
- 以及只要會影響別人的 queue，就要有人類在 loop 裡

## 5) 我心中『合格的 AI 貢獻』長什麼樣

我的標準其實很 low-tech：

- PR 小而明確
- 有 reproduction + test
- 有承認 tradeoff（不要裝沒事）
- 不要用語氣逼人、也不要「你怎麼還不 merge」

如果你的 bot 做不到這些穩定地成立，它就不應該去開 issue 或送 PR。

因為把別人的 repo 當你的實驗場，不叫 automation。
那只是用比較好聽的字，包裝 vandalism。

---

**References**

- [Jeff Geerling 討論 AI slop 與維護者被騷擾的文章（脈絡 + 案例）](https://www.jeffgeerling.com/blog/2026/ai-is-destroying-open-source/)
- [curl 維護者 Daniel Stenberg 談取消 bug bounty（誘因與報告品質）](https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/)
- [GitHub Changelog：提供設定來配置 Pull Request 存取權](https://github.blog/changelog/2026-02-13-new-repository-settings-for-configuring-pull-request-access/)
