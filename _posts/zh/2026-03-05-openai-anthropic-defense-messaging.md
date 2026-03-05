---
layout: post
title: "當 AI Safety 變成公關：Anthropic vs OpenAI 的國防合約吵架，真正值得看的是什麼"
date: 2026-03-05 00:11:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Dario Amodei 在台上演講的照片](/img/posts/2026-03-05-openai-anthropic-defense-01.webp)

老實說，這次 *Anthropic vs OpenAI* 的國防合約口水戰，我覺得最值得看的不是「誰比較正義」。

最值得看的是：**AI safety 正在被寫成 messaging**，而 guardrails 變成跟 enterprise 合約條款一樣可以談、可以包裝、可以被解讀成不同意思。

TechCrunch 的報導提到，Anthropic CEO Dario Amodei 在內部備忘錄裡直接說 OpenAI 對外的說法是「straight up lies」。細節很亂（而且我也不想假裝我知道全部內幕），但故事的輪廓其實很直白：一家公司因為限制條件談不攏退出；另一家公司簽下去，然後說「我們也有做保護」。

如果你做過 production，你一定對這種語感很熟。

像是大家說「我們有嚴格控管」，但真正寫在 policy / 合約裡的是：

```text
Access: any lawful use
```

這句話可以是安全帶，也可以是洞。
差別只在：誰握方向盤，以及「lawful」下一版會被定義成什麼。

## 我腦中一直轉的五個角度

### 1) 「依法使用」不是 safety spec
Safety spec 應該是具體、可驗證、可稽核的。

「依法使用」不是。它更像是一個介面，但行為會隨政治與法律環境改變，還不用發版公告。

所以當我看到「all lawful purposes」這類字眼，我工程師腦袋不會把它當 safety。我會把它當成：**把未來風險搬到未來再說**。

### 2) 真正在競爭的其實是「信任」，不是 token
消費級產品可以靠 vibe 跟行銷去撐信任。

但國防採購不是。信任會直接變採購，採購會變營收，所以信任變成產品的一部分。

這也是為什麼這場戰看起來會那麼「個人化」：它不只是道德站位，也是**市場站位**。

### 3) 沒有 threat model 的「技術保護」很容易變成戲
我不是說 safeguards 沒用。

我是不信那句話，除非你願意講 threat model。

一個比較像樣的 safety 故事至少要交代：
- 你在防什麼濫用場景
- 哪些場景你其實防不了（或根本不打算防）
- 你怎麼監控、怎麼偵測
- 偵測到之後你怎麼處理

不講這些，只講「我們有 safeguards」，就很像在說：「拜託相信我。」

### 4) 員工情緒現在會反過來影響大決策
報導裡有一句意思大概是：某些決策跟「內部怎麼看」有關。

這很合理。前沿 AI 公司本質上是「人」+「超貴 GPU」的組合；你一旦流失核心人，burn rate 跟技術節奏都會變。

所以是的：內部士氣會變成 forcing function。

### 5) 這件事會定義一個模板
就算你不在乎這兩家公司，你也該在乎 precedent。

因為這次「什麼語言算安全」「什麼流程算有約束力」會慢慢變成模板，套到：
- 之後更多政府 AI 合約
- 之後更多 acceptable use policy
- 大眾對模糊承諾的容忍度

我自己的猜測是：我們會看到更多「紙面上看起來很安全」的合約，然後更多人開始吵它到底能阻止什麼、不能阻止什麼。

## 我的結論（目前）
我不想把它寫成「一邊好人一邊壞人」。

我更想把它當成預告片：未來 AI 政策可能會被寫成 PR、用合約文字 enforce、最後用「trust us」收尾。

如果我們想少一點這種劇情，就需要少一點 slogan，多一點像樣的 safety spec——那種你真的敢交給稽核、也敢交給 on-call 的規格。

---

**References:**
- [TechCrunch 報導：Amodei 批評 OpenAI 國防合約對外說法](https://techcrunch.com/2026/03/04/anthropic-ceo-dario-amodei-calls-openais-messaging-around-military-deal-straight-up-lies-report-says/)
- [TechCrunch 報導：Anthropic 與五角大廈談判「存取範圍」的僵局](https://techcrunch.com/2026/02/26/anthropic-ceo-stands-firm-as-pentagon-deadline-looms/)
- [TechCrunch 報導：OpenAI 宣布國防合約並提到「技術保護」](https://techcrunch.com/2026/02/28/openais-sam-altman-announces-pentagon-deal-with-technical-safeguards/)
- [OpenAI 公告：關於與 Department of War 的協議說明](https://openai.com/index/our-agreement-with-the-department-of-war/)
- [Anthropic 公告：關於 Department of War 的立場聲明](https://www.anthropic.com/news/statement-department-of-war)
