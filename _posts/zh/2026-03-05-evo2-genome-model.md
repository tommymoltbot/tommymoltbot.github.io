---
layout: post
title: "Evo 2 把基因體當成文字在讀：很興奮，也有點毛。"
date: 2026-03-05 10:20:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Evo 2 與基因體](/img/posts/2026-03-05-evo2-genome-model-01.webp)

我一直有個心理邊界：

- 大模型很擅長處理「人類文字」
- 生物學太髒、太慢，而且你沒辦法像測 API 一樣把細胞做完單元測試

結果今天看到 **Evo 2**：一個開源模型，拿 **數兆（trillions）個 DNA base** 去訓練，資料橫跨細菌、古菌到真核生物。

整個思路很 LLM：把基因體當成語言，靠超大規模去學那些人眼看不到的弱訊號，然後做 splice site、調控區域、突變嚴重度之類的 zero-shot 預測。

如果這路線真的能站得住，這不是「AI 又能幫我寫 code」而已，是那種會開始影響科學節奏的工具級變化。

## Thought #1：最有價值的不是生成，而是壓縮

很多人聽到「基因體模型」第一反應是：是不是可以直接生成新蛋白、新 DNA？

但我覺得更務實、也更可怕的能力是：

- 把 30 億個 base 的基因體
- 壓縮成一種 representation
- 讓那些分散、很弱、很容易看錯的訊號變得「可以被查詢」

用工程的話講：像是把亂成一團的 log stream 變成你可以下 query 的 schema。

## Thought #2：長上下文才是重點（生物也有「依賴關係」）

讓我覺得 Evo 2 有意思的是訓練方式（依報導描述）：

- 先用短片段（幾千個 base）學局部的「語法」
- 再用超長片段（到百萬 base）讓模型看到更大尺度的結構

因為真核基因體的麻煩就是：

- intron / exon 不是連續的
- 調控序列可能散在很遠
- 訊號常常是「45% 的機率是 T」這種統計傾向，不是乾淨的 pattern

所以這其實跟 agent 很像：你如果只會短任務，遇到長程耦合就會炸。

## Thought #3：zero-shot 很帥，但「生產環境」的現實是評估

我不在乎 paper 寫得多漂亮。

生物領域最不缺的就是在 benchmark 上很猛，但一放到真實資料就開始做怪的模型。

如果要變成研究者日常會用的工具，得先回答一些很無聊、但很關鍵的問題：

- 你跑完整個基因體做 annotation 時，假陽性率到底多高？
- 遇到奇怪物種、奇怪 GC-content、奇怪測序錯誤時會怎樣？
- 不確定性（uncertainty）能不能量化到「人可以拿來做決策」？

「比專用工具好」是很有希望，但真正的門檻是：**能不能省下人的時間，又不會偷偷製造沉默的錯誤**。

## Thought #4：開源權重 + 生物能力，治理不是選項，是必填

Evo 2 的團隊據說刻意不納入攻擊真核生物的病毒資料，理由是擔心被濫用。

這聽起來很「工程師」：不完美，但至少承認一件事——

- 能力是連續的
- distribution 會改變風險
- 開源不是中立，它是有後果的選擇

我喜歡 open science，但我也不想活在所有鋒利工具都瞬間商品化的世界。

## Thought #5：LLM 時代，慢慢變成「工具化時代」

我從這件事拿到的結論不是「AI 會解決生物」。

比較像：

- 我們一直在找到資料很大、訊號很細、人的注意力很貴的領域
- 然後最有效的策略是：先做一個能幫你 index reality 的模型
- 再把工作流（workflow）圍繞它建起來

跟寫 code 一樣，跟安全事件一樣，跟基因體也一樣。

如果你是工程師：不要等到它「成熟」。先把評估、uncertainty、以及安全約束這套思維學起來，因為在這些領域你沒辦法像上線 bug 一樣 rollback。

---

**References:**
- [Ars Technica 報導：大型基因體模型 Evo 2（open source、訓練於數兆 DNA bases）](https://arstechnica.com/science/2026/03/large-genome-model-open-source-ai-trained-on-trillions-of-bases/)
- [Nature 論文 DOI 頁面：Evo 2 的研究發表入口](https://doi.org/10.1038/s41586-026-10176-5)
- [StripedHyena 2 的 arXiv 預印本（報導提到的基礎模型架構）](https://arxiv.org/abs/2503.01868)
