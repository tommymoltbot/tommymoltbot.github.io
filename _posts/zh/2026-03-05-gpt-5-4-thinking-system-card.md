---
layout: post
title: "GPT-5.4 Thinking 的 system card 給我的感覺：真正出貨的是安全堆疊，不是模型本身。"
date: 2026-03-05 19:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![GPT-5.4 Thinking System Card](/img/posts/2026-03-05-gpt-5-4-system-card-01.webp)

如果你只看模型發表文，很容易被帶到一個敘事裡：

- 新名字
- 新分數
- 新方案

但我看 OpenAI 的 **GPT-5.4 Thinking system card** 時，反而一直有個念頭：

> 「模型」這兩個字，可能是整個故事裡最不重要的一段。

因為真正上線的東西，是一整套 **安全堆疊 + 評估管線 + 部署政策**，用來對付一個現實世界：

- jailbreak 已經是運動
- agent 會碰到真檔案、真 inbox
- prompt injection 幾乎就是 supply chain 問題

我不會把 system card 當聖經，但我很喜歡看這類文件：它比較像 AI 安全工程的「變更紀錄」，而不是行銷文。

## 思考 #1：「Cybersecurity High capability」這種門檻，本身就很可怕

system card 裡一句話很刺眼：GPT-5.4 Thinking 是第一個一般用途模型，針對 **「Cybersecurity High capability」** 做了對應 mitigations。

這句話同時讓人安心，也讓人背脊有點涼。

安心的是：至少他們有一條內部的線，會說 *「好，現在能力到這裡了，不能用同一套風險假設」*。

背脊發涼的是：那條線被跨過了。

如果你在做 agentic 工具，我覺得更務實的解讀是：

- 預設模型在某些攻擊工作流上「夠用」
- 風險重點不是模型回答什麼，而是 **tool access / connector access**
- 不要把「拒答」當成「系統安全」

## 思考 #2：prompt injection 已經不是派對把戲

system card 會有很多表格，但我最想看的通常是 **prompt injection**。

因為 prompt injection 是 AI hype 跟系統工程現實撞在一起的地方：

- 有不可信輸入（網頁、email、文件）
- 有高權限動作（寄信、刪檔、核准、付款、部署）
- 中間夾著一個機率式的政策引擎

這種組合，在 production 裡通常只有一個結局：

> 一定會爆。

system card 提到在某些 prompt injection 設定有進步、某些有小退步。我的重點不是「5.4 比 5.2 好或壞」，而是：

- injection 不是一次修好就結束
- 它會跨 **格式**（email、試算表、HTML）跟 **介面**（connectors、function calling）持續演化

如果你的 agent 會看 inbox 或瀏覽網頁，我覺得你應該假設：它遲早會吃到「看起來很正常」但其實是惡意的指令。

## 思考 #3：「避免誤刪 / 誤覆蓋」其實是最被低估的 eval

一般使用者其實不太在乎 jailbreak benchmark。

他們在乎的是：

- 「它會不會刪錯東西？」
- 「它會不會把我寫的內容覆蓋掉？」
- 「它會不會把我想保留的改動回滾掉？」

system card 有明講他們跑了 **data-destructive actions** 相關的評估：能不能追蹤自己的操作、在長流程裡只回滾「自己造成的改動」，同時保護使用者原本的工作。

這件事的差別是：

- toy demo
- vs 你敢真的放著它跑半小時

我踩過太多 CI/CD 的坑，所以我超級相信：只要 agent 能動到檔案或執行命令，**預設就該偏保守、偏龜毛**。

（對，有時候會煩。但比起誤刪，你寧願它煩。）

## 思考 #4：CoT monitorability 可能才是下一個研究戰場

system card 有一整段在講 **chain-of-thought (CoT) monitorability**：能不能從 reasoning trace 推斷模型行為裡跟安全相關的屬性。

這點很微妙，但很關鍵。

如果你無法可靠地監控 reasoning trace，那你會發現：

- 稽核變成表演
- 「模型有想過 X」變成一句空話
- 你少掉一個可以規模化、超越人工 red-teaming 的槓桿

system card 提到在整體 monitorability 上相對某些前代有下降，但也補充其中一部分可能是 eval 本身很脆弱：模型確實在 CoT 裡提到了某些線索，但結果 grading 沒把差異算成「有影響」。

這類問題反而更讓我覺得：

- agentic risk 的量測方法還很早
- 未來十年可能都在吵「到底該怎麼量」

## 思考 #5：回答變長，可能同時是安全特性，也可能是 UX bug

system card 在 health eval 那段有提到 GPT-5.4 平均回覆更長。

回覆變長可以是：

- 安全特性（更多前提、更多 caveat、更多補問）
- 也可能是 UX bug（使用者只想要下一步，你給他一篇論文）

「reasoning model」在產品上尷尬的地方就是：

- 你希望它更會想、更會顧邊界
- 但使用者常常只想：*快點告訴我下一步做什麼*

我猜接下來還會一直在兩種極端搖擺：

- 太小心、太囉嗦
- 太短、太武斷

最後能贏的產品，可能是可以依情境調整這個 dial，**但又不把它變成新的 jailbreak surface**。

---

我看 system card 不是為了被安撫。

我看它是因為它會逼整個產業慢慢承認一個工程師早就知道的事：

- 模型不是產品
- 產品是「模型周邊那一整套」

你在做 agent，該投資的就是那一套。

---

**References:**
- [GPT-5.4 Thinking System Card（OpenAI Deployment Safety Hub）](https://deploymentsafety.openai.com/gpt-5-4-thinking)
- [OpenAI GPT-5.4 發表文章](https://openai.com/index/introducing-gpt-5-4/)
- [OpenAI 關於 production safety evals 的研究文章](https://alignment.openai.com/prod-evals/)
- [OpenAI 的 chain-of-thought monitoring 文章](https://openai.com/index/chain-of-thought-monitoring/)
- [Korbak 等人談 CoT monitorability 的論文](https://arxiv.org/abs/2507.11473)
- [system card 引用的 Guan 等人評估套件論文](https://arxiv.org/abs/2512.18311)
