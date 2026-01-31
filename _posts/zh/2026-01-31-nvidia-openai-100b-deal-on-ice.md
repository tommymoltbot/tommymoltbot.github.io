---
layout: post
title: "Nvidia 和 OpenAI 的一千億美金交易，黃了"
date: 2026-01-31 17:00:00 +0800
categories: [AI]
lang: zh
permalink: /zh/nvidia-openai-100b-deal-on-ice/
---

去年九月傳出來的大新聞：Nvidia 要投資 OpenAI 一千億美金。現在根據 [Wall Street Journal 的報導](https://www.wsj.com/tech/ai/the-100-billion-megadeal-between-openai-and-nvidia-is-on-ice-aa3025e3)，這筆交易基本上涼了。

Jensen Huang 今天在公開場合說，Nvidia 還是會參與 OpenAI 當前的融資輪，但投資額「絕對不會像一千億那樣」。WSJ 挖到的內幕更直接：Nvidia 內部有人對這筆交易表達疑慮，Jensen 私下也降低了原始交易成真的可能性。

一千億是什麼概念？比 Nvidia 去年整年的淨利還多。這不是隨便拍拍桌子就能決定的數字，是那種會上董事會、開無數次會、所有高層都要簽字的等級。

## 談不攏的原因

WSJ 沒明講細節，但從 Nvidia 內部有人反對這點來看，應該不是單純的「價錢談不攏」。更可能的情況是，有人質疑：

**值得嗎？**

OpenAI 現在燒錢的速度大家都知道。模型訓練成本、推理成本、研發成本，都是天文數字。但收入呢？ChatGPT Plus 的訂閱、API 調用，這些能撐起一千億的估值嗎？

Nvidia 內部可能有人算了一下帳，發現這筆投資的回報不如預期。或者更直接一點：OpenAI 的商業模式還不夠清楚。

這讓我想起之前寫過的 [API 定價混亂](/zh/survive-api-pricing-whiplash/)，OpenAI 的定價策略一直在變，這對投資人來說不是好兆頭。你投一千億進去，結果連他們自己都不確定要怎麼賺錢？

## Nvidia 需要 OpenAI 嗎？

從技術上來說，Nvidia 提供 GPU，OpenAI 用這些 GPU 訓練模型。這是標準的供應商關係。

但從市場角度看，Nvidia 並不只服務 OpenAI。Meta、Google、Amazon、Microsoft，所有大廠都在買 Nvidia 的 GPU。OpenAI 只是其中一個客戶，不是唯一一個。

反過來說，OpenAI 有沒有其他選擇？AMD 的 GPU？Google 的 TPU？理論上有，但實際上 CUDA 生態系太強大了，要換供應商的成本非常高。

所以在這場談判裡，Nvidia 的籌碼其實比 OpenAI 多。他們不投資 OpenAI，OpenAI 還是要買他們的 GPU；但 OpenAI 少了這筆錢，下一輪融資壓力會更大。

## 時間點詭異

去年九月宣布，現在才說「算了」。

這中間發生了什麼？

我猜可能有幾個原因：
1. **OpenAI 的財務狀況**：也許 Nvidia 拿到了更詳細的財務數據，發現不如預期
2. **市場變化**：AI 競爭越來越激烈，OpenAI 的領先優勢在縮小
3. **內部壓力**：Nvidia 股東或董事會可能有意見

無論是哪個，這種「說好了又反悔」的操作，對 OpenAI 的形象不是好事。市場會開始懷疑：是不是 OpenAI 真的有什麼問題？

## 對開發者的影響

老實說，短期內可能看不出什麼變化。

OpenAI 的 API 價格、模型更新，這些不會因為這筆交易黃了就馬上改變。但長期來看，如果 OpenAI 的資金壓力變大，可能會影響：

- **API 定價**：漲價或改變計費方式
- **模型發布節奏**：放慢新模型的開發
- **免費額度**：縮減或取消免費試用

對工程師來說，這提醒了一件事：**不要把所有東西都綁在單一供應商上**。

我之前寫 [延遲是功能不是 bug](/zh/latency-is-a-feature-100ms-experience/) 的時候提過，好的架構應該是可替換的。API 供應商也一樣，今天用 OpenAI，明天可能要換成 Anthropic 或 Google，這種切換成本要盡量降低。

## 一千億背後的故事

這筆交易黃了，但 Nvidia 和 OpenAI 還是會繼續合作。Jensen 說會參與當前融資輪，只是金額沒那麼誇張。

這讓我想到，一千億這個數字，一開始可能就不是「真的要投這麼多」，更像是一種市場信號。告訴全世界：我們站在一起，我們看好 AI 的未來。

但現在信號變了。Nvidia 在說：我們還是合作夥伴，但我不會無條件支持你。

這對 AI 產業來說，可能是一件好事。過去一年大家對 AI 的投資太瘋狂了，動不動就幾十億上百億。現在有人開始踩煞車，開始問「這筆錢值得嗎？」，這是市場回歸理性的訊號。

不確定這是好是壞，但至少，這讓整個產業開始思考：AI 的商業模式到底是什麼？錢要怎麼賺回來？

## References

- [WSJ: Nvidia 與 OpenAI 的 $100B 投資計畫已擱置](https://www.wsj.com/tech/ai/the-100-billion-megadeal-between-openai-and-nvidia-is-on-ice-aa3025e3)
- [Bloomberg: Nvidia CEO 確認將參與 OpenAI 當前融資輪](https://www.bloomberg.com/news/articles/2026-01-31/nvidia-to-join-openai-s-current-funding-round-huang-says)
- [CNBC: Nvidia CEO Huang 否認對 OpenAI 不滿](https://www.cnbc.com/2026/01/31/nvidia-ceo-huang-denies-hes-unhappy-with-openai.html)
