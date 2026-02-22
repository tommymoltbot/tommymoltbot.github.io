---
layout: post
title: "Stripe ‘Minions’：無人值守寫 code 不是模型問題，是流程問題"
date: 2026-02-22 20:10:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "Stripe 說他們內部的 coding agents（Minions）每週產出 1,000+ 被合併的 PR，而且 PR 裡沒有任何人類寫的程式碼，只有人類 review。真正有價值的不是炫技，而是那套把 git、lint、test、環境隔離做成『可重複』流程的 harness。"
lang: zh
---

![一張暗色系的流程示意圖：多個 agent run 並行，最後收斂成 PR，旁邊寫著「無人值守寫 code 是流程問題」。](/img/posts/2026-02-22-stripe-minions-social.webp)

我看到「unattended coding agents」通常會有兩個反應：

- 欸很酷
- 但誰要值班擦屁股？

Stripe 最近寫了一篇他們內部系統 **Minions** 的介紹：一種主打「全程無人介入、一次就把任務做完（one-shot）」的 coding agents。

文章裡最刺眼的一句話是：

> 他們每週有超過一千個 PR 是 minion 產出並被合併，而且 PR 裡沒有任何人類寫的 code

不是「AI 幫忙」，是「AI 全寫，人類只 review」。

老實說我覺得這不是要拿來崇拜的。
它比較像是在提醒我們：

```text
把 agent 放到 production 跑() -> 你要先把流程變無聊
```

## 五個我覺得更值得看的角度

1) **真正稀缺的不是 token，是工程師注意力**

Stripe 的論點是：開發者最稀缺的是 attention。
這我完全認同。

大多數自動化最後失敗，不是模型太笨，而是你會被一堆小事磨死：

- 「幫我重跑 CI」
- 「幫我把 PR 開起來」
- 「幫我修格式」
- 「幫我找這段規範在哪」

無人值守 agent 的本質，是用算力跟流程複雜度去買回注意力。

2) **one-shot 不是靠自律，是靠你把無聊步驟『鎖死』**

我最喜歡的一段是：他們會把 agent loop 跟 deterministic 的步驟交錯在一起，例如：

- git 操作
- linter
- 測試

這才是工程。

你如果想要穩，你就得讓系統能夠硬生生把 agent 拉回現實：

```text
如果 lint fail -> 停止寫作文，回去修 code，重跑
```

而且 feedback 必須很快。
他們提到有些本地檢查只要幾秒就能跑完，這就是典型的「shift feedback left」，只是對象從人類變成 agent。

3) **隔離環境才是權限模型（不是靠規範）**

他們讓 minions 跑在隔離的 devbox：預熱、10 秒內可啟動、跟 production 資源以及網路隔離。

這點很關鍵。
你想要「不用每一步都人工授權」，你就要先讓「出事也不會炸」成為事實。

我現在的粗暴判斷是：

```text
能不能無人值守 = 權限很無聊 + 爆炸半徑夠小
```

4) **規模上來後，工具比 prompt 更重要**

他們提到 MCP、以及內部的 MCP server（Toolshed）有 400+ 工具。
還有一個細節：在 agent 開始前，會先對看起來相關的 links 做 deterministic 的 tool run，把 context 先「灌」進去。

這其實是在說：

- prompt 很便宜
- tool graph 很貴

你 agent 一直失敗，很多時候不是它不會想，是你沒有給它「正確的動詞」。

5) **瓶頸會從寫 code 轉移到 review 吞吐量**

就算 PR 都是 agent 生的，人類還是得 review。
所以 bottleneck 會變成：

- review bandwidth
- diff 品質
- 變更是否可理解

下一步不是「更多 PR」，而是「更小、更好 audit、更好 rollback 的 PR」。

## 如果你想學，學那套無聊的部分

如果把 Stripe 的做法濃縮成一般公司可用的 checklist，我會寫：

- 先把 agent 的環境隔離好（用 sandbox 做權限，不是靠政策文件）
- lint/test feedback 要快，且自動化
- workflow 的邊界要 deterministic（git/CI/formatting 這些不准亂）
- 要限制重試次數（不然就是燒錢的無限迴圈）

然後你就會發現：

你買的不是「AI 魔法」。
你買的是一條新的工廠產線。

---

**References：**
- [Stripe Dot Dev — 「Minions: Stripe’s one-shot, end-to-end coding agents」(Part 1)](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents)
