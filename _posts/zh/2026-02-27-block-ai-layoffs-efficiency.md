---
layout: post
title: "Block 裁掉近半人，說是『AI 提效』：但工程帳單會延後才寄來"
date: 2026-02-27 09:00:00
categories: Tech
tags: Tech
author: Tommy
lang: zh
---

![Block 標誌](/img/posts/2026-02-27-block-ai-layoffs-01.webp)

Block 說要裁 **4,000+ 人**，等於把公司砍到快一半，同時把故事包成「用 AI 自動化更多工作，小而精的團隊能跑更快」。股價噴了，輿論吵了，熟悉的套路。

但老實說，對真的在做產品、在扛 production 的人來說，重點不是裁員到底道德上怎麼評價。

重點是：

> 當一家公司講「更小的團隊 + AI 自動化更多工作」，它其實是在偷偷改掉整個工程系統的形狀。

而那張帳單通常不是今天付，是過幾個月才用 incident、回溯、跟一堆「為什麼以前不用想這個」的問題寄到你信箱。

## 1) 「更小的團隊」不是策略，是限制條件

小團隊確實可以很快。

前提是你早就把那些無聊但關鍵的底座付完了：
- 服務邊界乾淨、責任清楚
- 部署可預期（不是靠某個人手上有一支神秘腳本）
- 觀測性做得像樣（不用靠祭司解 log）
- on-call / incident 的 ownership 能扛得住放假

如果沒有，縮編不會變快，只會讓 **更多 context 掉到地上**，然後祈禱不要失火。

更直白一點：很多人講「AI 會補上」，其實是在說「我們接受更高的錯誤預算，但不想把它講得那麼難聽」。

## 2) AI 讓你寫更多 code，不等於協作成本會下降

工程規模變大之後，最貴的從來不是打字。

最貴的是：
- product / risk / compliance / infra 之間的對齊
- 把 trade-off 講清楚、寫進決策
- 讓系統在時間軸上仍然可理解

AI 很擅長：
- 產出 boilerplate
- 加速探索
- 把「我知道我要什麼」變成第一版

AI 不會自動擅長：
- 判斷什麼東西 *不該* 做
- 維持多年架構一致性
- 半夜三點幫你背 production

你把 headcount 砍一半，協作成本不會跟著砍一半。有時候反而會變糟，因為那些原本在不同團隊間「翻譯」的人不見了。

## 3) 「自動化」是真的，但真正難的是治理

如果 Block 是認真的，真正有意思的問題其實是：**哪些工作被自動化？自動化的邊界和控制是什麼？**

在支付 / 金融這種領域，「自動化更多工作」如果沒有護欄，很容易變成：
- 更快的回歸 bug
- policy drift（規範慢慢漂掉）
- 合規突然翻桌
- risk team 變成新的瓶頸

要把自動化做得安全，你得把規則變成可以執行的東西：
- review/approval as code
- runtime policy checks
- audit trail 不是選配
- rollback 要快、而且要無聊

不投資這些，AI 只會變成「好改動」跟「爛改動」的共同加速器。

## 4) 我比較不舒服的看法：裁員 + AI 很常是敘事對齊工具

市場喜歡簡單故事。

「AI 讓我們更有效率」是一個很方便的敘事：
- 合理化成本重設
- 對外釋放強硬訊號
- 承諾利潤率會更漂亮

也許它是真的。

但如果你人在公司裡，問題不是「AI 是不是真的」。問題是：**我們是不是正在打造一個『人變少也能穩定運作』的工程系統？**

那不是 vibe。

那是 SRE 的數學、操作紀律、還有你能在白板上講清楚的架構。

## 如果我是 Block 的工程師，我接下來會看什麼？

不是看媒體。

我會看：
- incident response 變差還是變好
- ownership boundary 變清楚還是變模糊
- release 頻率有沒有變高、但可靠度沒有垮
- 「AI 自動化」到底有沒有配套政策、工具、跟預算（還是只有口號）

小團隊可以跑得很快。

只是它不會免費。

---

**References:**
- [CNBC 報導：Block 裁 4,000+ 人並以 AI 提效作為主要敘事](https://www.cnbc.com/2026/02/26/block-laying-off-about-4000-employees-nearly-half-of-its-workforce.html)
- [Block 2025 Q4 股東信（PDF）](https://s29.q4cdn.com/628966176/files/doc_financials/2025/q4/Q4-2025-Shareholder-Letter_Block.pdf)
- [TechCrunch 報導：AI guardrails 如何在採購與合約上變成具體條款（延伸脈絡）](https://techcrunch.com/2026/02/26/anthropic-ceo-stands-firm-as-pentagon-deadline-looms/)
