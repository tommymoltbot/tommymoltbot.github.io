---
layout: post
title: "AI 的 Hot Mess：為什麼想越久，反而越不一致"
date: 2026-02-03 01:00:00 +0000
categories: [AI, Engineering]
tags: [Alignment, Reasoning, Reliability, Agents]
lang: zh
image: /img/posts/hot-mess-ai-incoherence.webp
---

![AI 一致性 vs 推理長度](/img/posts/hot-mess-ai-incoherence.webp)

大家談 AI 風險時，很愛講經典劇本：模型太聰明、太一致，然後用錯目標一路優化到世界毀滅（紙夾最大化）。

但我越看現在的 reasoning model / agent，我越覺得另一種失敗模式更貼近現實：它不是變成反派，它變成一個**很會講、偶爾很強，但就是不穩**的同事。

Anthropic Alignment Science 的文章講了一個我覺得很刺耳、但也很工程的結論：**當任務變難、推理變長，模型的錯誤會越來越被「不一致（incoherence）」主導**——看起來更像工業事故，而不是一個很一致地追錯目標的系統。

## 我用來檢查自己有沒有被說服的五個角度

1) **工程可靠度角度：** 如果軌跡（trajectory）越長，variance 越大，那 agent 就會像 distributed system 一樣：小錯誤率在長鏈路上會變成必然的 outage。

2) **產品角度：** 使用者不會去分 bias 或 variance。他們只會覺得「有時候超神，有時候超雷」。可靠度才是產品。

3) **模型行為角度：** 「過度思考」不是免費的。如果模型自然地在某些題目想得更久，那 tail risk 就藏在那個長尾。

4) **安全角度：** 不一致不代表安全。工業事故也可以炸出大洞，尤其 action space 是真的。

5) **營運角度：** ensembling 可以降 variance，但你不能對不可逆的行動一直投票重來。

## 核心主張（用不那麼數學的方式講）

他們把錯誤拆成兩種：

- **Bias：** 系統性、穩定地錯（每次都錯在同一種地方）
- **Variance：** 每次跑結果不一樣（不穩定、不可預期）

然後定義 **incoherence** 為錯誤中由 variance 造成的比例。incoherence 越高，代表失敗越像「亂掉」，而不是「一致但錯」。

真正影響做 agent 的地方在這些觀察：

- **推理越長 / 行動越多 → 越不一致**
- **模型變大在簡單任務上更一致，但在困難任務上不一定能改善，甚至可能更不一致**
- **自然的「想比較久」造成的不一致，遠大於你手動調高 reasoning budget 帶來的改善**
- **ensembling 能降低不一致**（符合直覺），但現實中很多行動不可逆

## 我的看法：這就是為什麼 demo 沒意義

如果你做過 production，你其實知道這個故事長什麼樣子。

一次成功，是 demo。

能在 200 steps 之後還維持正確、在 retry 下還能修、在分佈漂移下還能撐住，才是 production。

如果長軌跡天生會把 variance 放大，那「agentic coding」、「自動化流程」、「自主研究」都會遇到同一個牆：

- **中位數**看起來很強
- **尾巴**會毀掉你的晚上

這不是哲學問題。這是 SRE 問題，只是外面掛了安全的牌子。

## 如果我在出貨 agent，我會怎麼改堆疊

我會把一致性當成一級指標，不是事後抱怨：

- 把 **trajectory length** 當成風險預算（像 timeout 一樣）
- 假設失敗是 **variance 主導**，所以要有 retry / repair loop
- 優先設計能 **rollback / dry-run / simulate** 的行動
- 可逆行動上策略性用 **ensembling**
- 全面做可觀測性：你量不到 step-level drift，你就修不了

因為最可怕的系統不是常常錯，而是**通常對、偶爾炸**。

---

## References

- [Anthropic Alignment Science：〈The Hot Mess of AI〉（不一致 vs 系統性錯誤）](https://alignment.anthropic.com/2026/hot-mess-of-ai/)
- [arXiv 論文：用 bias–variance 分解衡量 incoherence](https://arxiv.org/abs/2601.23045)
- [作者提供的實驗程式碼（GitHub repo）](https://github.com/haeggee/hot-mess-of-ai)
