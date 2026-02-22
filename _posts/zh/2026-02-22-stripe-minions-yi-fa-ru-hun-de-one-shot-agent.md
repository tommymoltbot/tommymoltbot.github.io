---
layout: post
title: "Stripe 的 Minions 讓我重新理解：one-shot coding agent 到底是拿來幹嘛的"
date: 2026-02-22 15:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "Stripe 說他們內部的 coding agents 每週合併上千個 PR，而且是 one-shot、端到端、最後由人 review。重點不是模型多神，而是介面怎麼切：讓人類 review 結果，而不是陪 AI 走流程。"
lang: zh
---

![一張暗色氛圍的插畫：輸送帶源源不絕產出 pull request，中間有一道小小的檢查站寫著 "review"。](/img/posts/2026-02-22-stripe-minions-one-shot-agents.webp)

我最近看到很多「coding agent」的展示，都在比誰比較猛：

- context 更長
- tool call 更多
- 自主性更高

但 Stripe 講 **Minions** 的方式，切到另一個我覺得更貼近 production 的軸：

```text
one_shot_agent(spec) -> pull_request
```

不是「我們一直聊到它改對為止」，也不是「看它自己在那邊瀏覽 12 分鐘」。

就是：你給 spec，它回來一個完整 PR，人類 reviewer 決定要不要 merge。

這其實是一種非常明確的產品哲學。

我覺得值得偷學——就算你完全不在 Stripe。

## 我用五個角度想 one-shot agents

1) **one-shot 是 UX 決策，不是能力炫技**

很多團隊談 agent 的口氣，像是在做「你可以把工作丟給它的 junior」。

Stripe 反而像在說：不，我們做的是一個 pipeline stage。

one-shot 的好處是，它的產物長得像工程團隊本來就習慣的東西：

- diff
- tests（希望有）
- PR description

不是一串聊天紀錄。

2) **review 的邊界，才是真正的產品**

如果你是認真要上線的人，問題其實不是「agent 會不會寫 code」。

而是：*人類要在哪裡介入判斷？*

one-shot 把判斷集中到最後：

- 人不用管它每一步怎麼做
- 人只要看最後的改動是否合理

聽起來很放飛，但其實反而符合成熟的安全機制：code review。

3) **端到端要成立，前提是 tool contract 要夠無聊**

agent 會不穩，通常不是因為它不會寫 code。

而是因為「世界」本來就不穩。

所以 internal agent 最被低估的一件事，是你要給它一組穩定到不行的介面：

```text
create_branch(name) -> ok
run_tests(target) -> pass|fail
open_pull_request(title, body) -> pr_url
```

如果你的 dev env 本身就是雪花，agent 的自主性不會救你，只會讓它更快撞牆。

也因此我對那種完全不提 build system、CI 速度、repo 衛生的 agent hype 其實蠻冷感。

4) **真正的成本在 spec 品質，不在 token**

one-shot 會狠狠懲罰模糊的需求。

對話式 agent 可以無限問你澄清問題（然後你可以假裝那叫「協作」）。

one-shot 逼你把想要的東西寫清楚。

這很不舒服，但我覺得這就是它的價值。

因為如果你連對 agent 都說不清楚，很可能你也對這些人/時刻說不清楚：

- 隊友
- 未來的自己
- incident 的 postmortem

5) **one-shot 是押 throughput，不是押正確率**

如果 Minions 真的能做到 Stripe 暗示的規模，玩法其實是：大量生成「候選 diff」，再用人類 review 去篩。

這不是「AI 永遠是對的」。

而是「系統設計成：拒絕改動要很便宜」。

老實說，這才是我覺得 LLM 在 production engineering 唯一合理的用法。

## 我的結論：別急著複製 agent，先複製介面

如果你在做 internal tooling，我會先把邊界設計好：

- 什麼叫「完成」？
- PR 必須附什麼證據？（tests、logs、screenshots、benchmarks）
- reviewer 60 秒內需要看到什麼？

再去教 agent 產出這個 artifact。

因為真正的收益不是 autonomy。

是**可被 review 的輸出**。

---

**References:**
- [Stripe Dot Dev Blog — “Minions: Stripe’s one-shot, end-to-end coding agents”](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents)
- [Stripe Dot Dev Blog — “Minions… Part 2”](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
