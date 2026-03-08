---
layout: post
title: "AI 本來該省時間，結果只是把工作搬家"
date: 2026-03-08 01:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![AI 把瓶頸從「打字」搬到「驗證」](/img/posts/2026-03-08-ai-longer-hours.webp)

我最近越來越確定一件事：AI 讓你寫 code 更快，但它不會讓你下班更早。

更精準一點講：它只是把工作「搬家」。

Scientific American 那篇在講「為什麼用 AI 的開發者工時反而變長」的文章，把這個現象講得很直白：大家主觀覺得更有效率、PR merge 更多，但交付不穩定、rollback / hotfix 變多，然後你就開始在下班時間補洞。

我自己會用五個完全不同的角度看它。

## 1) 真正的瓶頸不是寫 code，是你敢不敢信它
AI 讓「看起來合理」的 patch 變得很便宜。

但 production 工程最核心的問題其實是：

```text
is_this_change_safe(change) -> confidence
```

confidence 從哪裡來？測試、review、監控、可回滾性、以及你對系統邊界條件的理解。

這些東西不會因為 code generation 變便宜就自動消失。
所以你不是把工作省掉，你只是把工作從「產出」挪到「驗證」。

## 2) 速度一上去，你的流程如果沒跟上，爆炸半徑會變大
能出 2 倍改動，你也同時得到 2 倍機會：
- 漏掉 edge case
- 破壞原本沒寫在文件裡的 implicit contract
- 不小心依賴一個從來沒保證過的行為

DORA 報告用很文明的詞叫「delivery instability」。
工程師的體感叫：rollback 變多、hotfix 變多、半夜被叫起來的機率變高。

最靠北的是：你會覺得你更快，但系統其實更吵。

## 3) 組織會把「生產力提升」直接換算成「把緩衝拿掉」
文章也講到背景：裁員、效率指標、do more with less。

所以就算 AI 真的替你省了一些時間，組織很可能下一秒就拿去買：
- 更多 feature
- 更多實驗
- 更多以前只是「想做」的 deadline

這也是為什麼我一直覺得「AI 會讓大家工時下降」聽起來很天真。
工具不會替你跟工作量談判。

## 4) AI 可能讓你少學東西，然後把時間債藏起來
Scientific American 引了 Anthropic 的研究：在某些設定下，AI assistance 對速度的提升不明顯，但工程師對新 library 的學習（尤其是 debugging 相關）會變弱。

這種 trade 很陰：
- 今天：任務做完了
- 下個月：你還是要碰同一段，但你其實沒有建立 mental model

而「沒有 mental model 的 debug」基本上就是把時間拿去燒掉。

## 5) 它會改變協作模式：前期很爽，後期死在 integration
另一個我覺得很真實的點是：AI 讓你「很多事自己做就好」，人跟人的互動會變少。

有時候沒差。
但代價可能在後面才出現：
- 團隊共同脈絡變薄
- review 變少（連帶 mentoring 也變少）
- 各模組/服務的假設開始不一致

integration 就是個人速度被課稅的地方。

## 我的結論：把 AI 當成不可信輸入
你真的想讓 AI 讓你早點下班，你得把「把 code 變成可靠變更」的部分補起來：
- 先寫清楚 acceptance criteria（讓模型開始打字前就知道什麼叫 done）
- 快且可信的測試（尤其是 contract tests）
- 把 verification 當成流程中的一等公民，而不是最後補
- 用指標抓外溢：rollback/hotfix、out-of-hours commits 這種

不然最後只會變成兩種模式：
- 你主動把工作移到驗證
- 或工作被動移到晚上跟週末

---

**References:**
- [Scientific American：AI 本來該省時間，但可能正在讓工程師工時更長](https://www.scientificamerican.com/article/why-developers-using-ai-are-working-longer-hours/)
- [Google Cloud DORA：AI-assisted software development 報告（2025）](https://cloud.google.com/resources/content/2025-dora-ai-assisted-software-development-report)
- [Harvard Business Review：AI 不會減少工作，它會強化它（2026/02）](https://hbr.org/2026/02/ai-doesnt-reduce-work-it-intensifies-it)
- [Multitudes：AI rollout 與工程產出指標的白皮書（PDF）](https://cdn.prod.website-files.com/610c8a14b4df1ae46b1a13a3/6941b0b2e9129ebfdfa71d4f_864f3a86793178cb6d8dcc1b464038be_What%20matters%20most%20for%20AI%20rollouts%20How%20you%20lead%20-%20Multitudes%20Whitepaper.pdf)
- [Anthropic 研究：AI assistance 對 coding skills 與學習/除錯能力的影響](https://www.anthropic.com/research/AI-assistance-coding-skills)
- [Hacker News：這篇文章在工程師社群的討論串（含不同解讀）](https://news.ycombinator.com/item?id=47292574)
