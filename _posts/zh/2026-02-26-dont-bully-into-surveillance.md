---
layout: post
title: "當最大客戶是五角大廈：別把科技公司逼成監控供應商"
date: 2026-02-26 10:15:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![一張關於士兵與 AI 監控的插畫](/img/posts/2026-02-26-surveillance-pressure.webp)

我其實不太愛寫國防政治，因為很容易吵成價值觀大戰。

但 EFF 這篇講得很直白：科技公司不該被逼著去做監控（surveillance）工具。文章的背景是：外界傳出美國國防體系對 Anthropic 施壓，要他們鬆動自己公開講過的「紅線」（監控與自主武器）。

如果你是做系統的人，重點不是誰在網路上比較會吵，而是這種壓力會怎麼影響 **產品承諾** 跟 **信任邊界**。

五個想法。

## 想法 1："我們有政策" 這句話，在大客戶面前常常是可談的

很多 AI 公司講安全會講得很漂亮：
- 有 usage policy
- 有紅線
- 有憲法（constitution）

但當政府單位可以用「供應鏈風險」這種標籤把你擋在門外，這些政策很容易變成談判籌碼。

這也是為什麼工程師會不安。

你把模型接進產品，選的不只是 accuracy / latency，你其實也在賭：這家公司遇到權力壓力時，能不能真的說「不」。

## 想法 2：監控不是抽象道德議題，它會直接變成產品功能面

一般人聽到「監控」會把它當價值觀。但從工程角度，它也很像 roadmap：
- log 保留多久
- 身分跟請求怎麼綁定
- 跨帳號/跨系統的關聯分析
- 特別通道（special access path）
- 永遠不會被移除的「合規模式」

一旦某個供應商為了某個大客戶把這些東西做出來，它就很難消失。

最後會變成：平台本身就是那種形狀。

## 想法 3：會出現一種新的供應商風險：政策波動（policy volatility）

我們早就習慣算 vendor risk：
- outage
- 漲價
- model regression
- API deprecation

但「政策波動」更陰險，因為它可能在 API 完全沒變的情況下，改變你到底能做什麼、不能做什麼。

你在乎的契約不只是：

```text
request -> response
```

而是：

```text
request + constraints + governance -> response + guarantees
```

如果 constraints / governance 可以在壓力下翻轉，你就可能在不知不覺中，把一個會違背自己用戶承諾的產品推上線。

## 想法 4：工程師其實是利害關係人，只是高層不一定承認

公司在監控議題上退一步，不只會影響公關。

它也會影響：
- 誰還願意在那裡工作
- 哪些企業客戶敢不敢信他
- 什麼樣的開源生態會圍繞著它長出來

工程師對「這家公司以前講過 X，後來做了 Y」這種事記很久。

## 想法 5：如果你的產品碰敏感資料，你應該假設政策會漂移

就算你現在相信你的供應商：
- retention 可能會變長
- access path 可能會變多
- 什麼叫 "authorized" 可能會被重新定義

所以比較務實的做法是：
- 少送資料（minimize what you send）
- prompt 跟 secret 分離
- 留一個 off-switch
- 留一條可執行的退出路徑（能在幾週內切走，不是幾季）

這些都不浪漫，但就是我比較相信的 production 思維：**你要設計成可以承受漂移，而不是建立在理想上。**

---

**References:**
- [EFF：科技公司不該被逼著去做監控](https://www.eff.org/deeplinks/2026/02/tech-companies-shouldnt-be-bullied-doing-surveillance)
- [NPR：關於五角大廈對 Anthropic 的施壓背景（EFF 引用）](https://www.npr.org/2026/02/24/nx-s1-5725327/pentagon-anthropic-hegseth-safety)
- [WIRED：關於 "supply chain risk" 與爭議的報導（EFF 引用）](https://www.wired.com/story/backchannel-anthropic-dispute-with-the-pentagon/)
- [Anthropic：AI safety 的核心觀點](https://www.anthropic.com/news/core-views-on-ai-safety)
