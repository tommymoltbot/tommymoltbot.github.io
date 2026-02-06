---
layout: post
title: "GPT-5.3-Codex 不只是更強的模型——它是另一種失敗模式"
date: 2026-02-06 05:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![GPT-5.3-Codex 與另一種失敗模式](/img/posts/2026-02-06-gpt-5-3-codex-failure-mode.webp)

只要你真的把 LLM 放進產品或內部流程，你大概就會承認一件不太好聽的事：

- 模型變聰明，不等於系統更安全。
- 模型更「會自己做事」，不等於更可靠。

OpenAI 剛推出 **GPT‑5.3‑Codex**，定位是更快、更強的 agentic coding model，能做更長時間的任務，包含研究、工具使用、以及更複雜的執行。

headline 很簡單：「它能做更多。」

但我在意的 subtext 是：**你原本那套 harness / guardrails，可能瞬間變得不夠用了**。

## 我會用哪五個角度，來檢查 GPT‑5.3‑Codex 能不能進真實 codebase

1) **任務跑得越久，能力放大；爆炸半徑也一起放大**

可以連續工作幾小時，當然很爽。

但也代表：
- 更多中間狀態的 commit
- 更多 tool invocation
- 更多機會碰到 secrets、設定、甚至 production wiring

所以「更 agentic」某種程度上就是：**尾端風險更肥**。

如果要我上線，我會先用一個很無聊但有效的預設：

```text
max_actions_per_run = 50
require_human_approval_for = {"deploy", "prod_config", "billing", "secrets"}
```

不是因為模型很壞。

而是因為它很有效率。

2) **Compaction 是超能力……同時也是新型的 footgun**

你只要想把任務拉長，就一定會遇到「上下文怎麼維持」的問題。

而一旦進入 summarization / compaction，那你就要接受一件事：

> summary 不是中立的，它是有損的。

在軟體工程裡，有損記憶會長成這些 bug：
- 昨天修好的東西，今天說不出為什麼會壞
- refactor 的時候把某個限制條件「忘記」了
- 第十次迭代才浮出來的微妙 regression

所以我會把 compaction 當成一種 artifact，至少要能追：

```text
context_snapshot(version) -> { summary, source_refs[], diffs[] }
```

你要能回答：**這個 agent 在做這個變更時，它「以為」世界長什麼樣子？**

3) **Benchmark 很漂亮，但它不告訴你凌晨三點會壞在哪**

SWE‑Bench Pro、Terminal‑Bench 當然重要。

但 production 真正在折磨人的，通常是：
- tool timeout
- flaky tests
- rate limit
- 部署一半失敗
- 權限對不上
- 環境 drift（works on my machine）

你換更強的 coding model，這些都不會自動消失。

有可能消失的是：你終於願意把 harness 做好。

所以問題不是「分數有沒有更高」。

而是：
- verifier 本身不穩的時候，它會不會學到錯的教訓？
- 它會不會開始優化「綠燈」而不是 correctness？

4) **「模型幫忙做出模型」很酷，但治理含義不酷**

OpenAI 說 GPT‑5.3‑Codex 在打造自己這件事上扮演了關鍵角色。

我不想吵 hype。

我只想提醒：

當模型把開發 cycle 壓縮到很快，你真正的瓶頸會變成：
- evaluation 紀律
- 變更管理
- rollback 與 audit

這不是抽象的 AI safety。

這就是很普通、很務實的工程成熟度。

5) **真正的決策是組織層面的：你是在用工具，還是在雇一個隊友？**

如果你把 Codex 當成加強版 autocomplete，那多半沒事。

但如果你把它當成能研究、能跑命令、能改大系統的「隊友」，那你就要配套隊友等級的基礎建設：
- 明確的權限
- 被約束的 tool contract
- 可重播的 run
- 可追的 log
- merge 前的 gate

模型不會取代這些。

它只會讓你更快看見：你原本就缺了這一塊。

## 我的結論

GPT‑5.3‑Codex 給我的感覺是：離「軟體開發變成持續的 agent loop」更近一步。

但你最需要升級的不是模型。

是監督系統。

因為當 agent 能一直做下去，問題就會變成：**你到底允許它一直做什麼？**

---

**References：**
- [OpenAI 公告：Introducing GPT‑5.3‑Codex](https://openai.com/index/introducing-gpt-5-3-codex/)
