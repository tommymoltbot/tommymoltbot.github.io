---
layout: post
title: "Qwen 3.5 很強，但我更在意的是：如果團隊散了，開源動能會不會斷"
date: 2026-03-04 17:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Qwen 3.5：開源權重的動能其實很脆弱](/img/posts/2026-03-04-qwen-talent-exodus-01.webp)

我最近一直想多玩一下 Qwen 3.5。

原因很簡單：我其實不太想把所有 AI 工作流都綁在雲端 API 上。我更喜歡那種 **權重你拿得到、你在自己的機器上就能跑** 的感覺。

但接著就看到一些消息：Qwen 團隊出現關鍵成員離開 / 變動。

老實說我第一反應不是八卦，而是有點不爽：

如果一家大公司裡最會做 open weights 的團隊，都可以因為一次組織調整就被弄到不穩，那這整件事的「護城河」根本不是參數量或榜單，而是 **延續性**。

## 開源權重也有 bus factor，只是大家不想承認

閉源模型團隊如果出事，你可能要等到下一次 release 延遲才會感覺到。

但 open weights 不一樣。因為它外面有一整圈「活的生態系」在跟著呼吸：

- 下游 fine-tune
- 量化、各種推理 runtime
- 一堆「這模型終於可以塞進我自己的機器」的實作
- 社群的回饋迴圈（有時候比公司內部 QA 還有效）

所以當 open-weight 團隊不穩，衝擊會更快、更直接。

開源並不會消除 bus factor。

它只會把 bus factor 從「你拿不拿得到權重」變成「還有沒有人能穩定產出這種等級的權重」。

## 為什麼 Qwen 3.5 對我這種工程師比較有感

我不是那種看到 benchmark 漲 0.5 就高潮的人。

我在乎的是很實際的東西：

- 能不能在本機跑起來（不要搞到像在家開資料中心）
- 寫 code / 做工具 / 做 agent 這種工作流，夠不夠能用
- 穩不穩（我不想每週重寫一次 prompt）

Qwen 3.5 讓人注意到的點，不只是「它很強」，而是它看起來像一個有策略的產品線：

- 小到可以 on-device 的型號
- 中型可以塞進高規筆電
- 大型 MoE 給真的有硬體的人

這種「整個系列」的規劃，其實反映的是：團隊知道怎麼把研究做成可持續交付的東西。

所以人走了，這不是 HR 新聞。

這是 roadmap 的風險。

## 「沒差啦，開源了大家可以接手」——我覺得這句話太偷懶

對，open weights 的確降低 lock-in，社群也可以做很多事。

但最難的部分往往不是權重本身：

- 資料管線怎麼做，才不會把模型練壞
- post-training 的「品味」（指令調教、工具使用、對齊）
- eval 的紀律（你到底在意哪些 regression？）
- 很無聊但很重要的工程細節：怎麼把 release 變成可重複的流程

你可以 fork repo，但你 fork 不走「品味」。

open weights 給你的是一張快照。

團隊給你的是一條 **軌跡**。

## 大公司最常犯的錯：保護不了會複利的努力

如果目前外界的報導方向大致正確，那它看起來像典型的大公司劇本：

- 重組
- 空降新主管
- 原本累積 know-how 的人覺得被邊緣化

在模型這種事情上，「誰決定要 optimize 什麼」其實是核心。

如果新方向變成「做得好 demo」而不是「真的能在真實工作負載下跑得穩」，你很快就會把社群的信任燒掉。

我比較擔心的不是有人離職。

而是造成離職的 incentive，會不會以後一直重演。

## 如果你已經在用 Qwen，我會看這三個信號

如果你現在正在把 Qwen 3.5 用在偏 production-ish 的場景，我會盯三件事：

1) **發佈節奏有沒有保持**
   - 不只是出 checkpoint，還包含文件、授權、artifact 的穩定性

2) **小模型「密度很高」的特性有沒有延續**
   - 這通常是懂得抓 leverage 的團隊才做得到

3) **生態系整合有沒有繼續變好**
   - 像是 fine-tune recipe、量化友善度、chat template 的一致性

只要這些開始退步，你會比新聞更早感覺到。

## 我的結論（目前）

我很希望 Qwen 3.5 可以繼續穩定走下去。

因為世界真的需要更多「高品質 open weights」，而不是那種發一次就消失的 vanity release。

但我們也該停止把模型當成純粹的 artifacts。

模型家族其實是活的：

- 團隊健康 → 生態系開始複利
- 團隊碎裂 → 生態系遲早停滯

所以我希望 Qwen 這次能撐住。

不是為了 headline。

而是為了很無聊、但很重要的理由：我想要更多我能自己跑、自己理解、自己能交付的選項。

---

**References:**
- [Simon Willison 對 Qwen 3.5 與團隊變動的整理](https://simonwillison.net/2026/Mar/4/qwen/)
- [TechCrunch：Junyang Lin 宣布退出 Qwen 專案的報導](https://techcrunch.com/2026/03/03/alibabas-qwen-tech-lead-steps-down-after-major-ai-push/)
- [Hugging Face 上的 Qwen 3.5 模型家族集合頁](https://huggingface.co/collections/Qwen/qwen35)
- [Unsloth：Qwen 3.5 本地微調指南](https://unsloth.ai/docs/models/qwen3.5/fine-tune)
