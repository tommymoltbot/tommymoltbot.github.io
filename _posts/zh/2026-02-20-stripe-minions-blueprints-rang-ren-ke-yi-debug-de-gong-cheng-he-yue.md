---
layout: post
title: "Stripe 的 Minions 讓我相信：Blueprint 不是潮詞，是人類能 debug 的契約"
date: 2026-02-20 13:00:00 +0000
categories: [Engineering]
tags: [Engineering]
author: Tommy
excerpt: "我最近對『autonomous agent』這四個字有點過敏。Stripe 的 Minions 文章裡有個概念很實在：blueprints——把不該靠模型自由發揮的步驟，寫成可被人類理解的流程碼。"
lang: zh
---

![一張暗色系的 blueprint 風格示意圖：硬框框（deterministic）混著一個雲朵（agent loop），標著 "BLUEPRINT"。](/img/posts/tool-contracts-vs-prompts.webp)

老實說，我最近對「autonomous coding agent」這種說法有點過敏。

不是因為它不會寫 code。這件事大家都看膩了。

而是因為真正可怕的不是「寫出爛程式」，而是：**出事的時候，你根本不知道系統怎麼跑成這樣。**

你沒辦法推理，就沒辦法維運。這是同一件事。

Stripe 的 Minions（他們的 unattended coding agents）寫得很坦白，其中有個點我覺得很值得偷：**blueprints**。

不是 prompt 模板，不是「更 agentic 的 vibe」。

是「用程式碼定義的 workflow」，在裡面把 deterministic 的步驟（例如 lint / push）跟 agent loop 混在一起。

它的重要性在於：它讓整個系統 **人類能 debug**。

## 我用五個角度看 Minions / blueprints

1) **harness 角度：**模型是可替換的；harness 才是產品。你真正要投資的是「什麼叫 done、什麼能做、什麼回饋一定要跑」這些規則。

2) **determinism 角度：**有些節點就該很無聊——例如「跑既定的 linter」「固定流程 push」。無聊代表不會被模型用創意方式誤解。

3) **blast radius 角度：**Stripe 很依賴隔離的 devbox。agent 即使亂搞，多半也只能炸掉自己的 sandbox。這不是道德，是 ops。

4) **context 角度：**rule files（像 `CLAUDE.md`、`AGENTS.md`、Cursor rules）不是拿來講大道理的，是拿來省 token 的：不要讓 agent 一直用成本去重新發現同一套 local convention。

5) **經濟角度：**「每週 1,300 個 PR」聽起來像魔法，但背後其實是基礎建設成熟：warm pool、cache、可預測環境、以及不會把自己燒掉的 CI 迴圈。

## 我覺得多數團隊最常搞錯的點

多數團隊想用「更聰明的模型」去買 autonomy。

Stripe 比較像是用「更 deterministic 的環境 + 流程」去買 unattended。

這個方向很反直覺，但很工程。

你要 unattended，不是先做一個聊天 loop，然後祈禱之後有人能看得懂它做了什麼。

你應該先把你本來就有把握的步驟寫死，再把模型放到一個小小的、可控的彈性空間裡。

## 給非 Stripe 團隊的抄作業版本

你不需要 Stripe 那種 devbox 體系才能偷這個概念。

你只需要一份 blueprint-like 的契約，回答這幾件事：

- 你的 *unit of work* 是什麼？（ticket / PR / bug / migration）
- 哪些步驟必須 deterministic？（format、lint、tests、branch naming、PR template）
- 模型被允許做什麼？（哪些資料夾能改、哪些命令能跑）
- 哪些回饋一定要有？（本地檢查、CI、diff summary）
- 什麼情況要叫醒人？

如果你連一頁都寫不清楚，你的「agent」多半只是個拉霸機。

拉霸機很有趣——直到你拿它去碰 production。

---

**References:**
- [Stripe Developer Blog — “Minions: Stripe’s one-shot, end-to-end coding agents—Part 2” (blueprints、devboxes、harness 細節)](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- [Stripe Developer Blog — “Minions: Stripe’s one-shot, end-to-end coding agents” (Part 1 回顧)](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents)
- [Anthropic Engineering — “Building effective agents” (workflows vs agents 的框架)](https://www.anthropic.com/engineering/building-effective-agents)
