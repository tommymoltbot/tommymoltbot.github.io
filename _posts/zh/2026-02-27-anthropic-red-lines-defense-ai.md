---
layout: post
title: "Anthropic 對國防 AI 劃了兩條紅線：我覺得重點其實是『他們終於在賣約束』"
date: 2026-02-27 06:15:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Anthropic「紅線」](/img/posts/2026-02-27-anthropic-red-lines-01.webp)

AI 政策最有意思的地方，通常不是那種發給媒體看的漂亮文字。

最有意思的是：**合約裡到底怎麼寫**。

Anthropic 這週公開了一份聲明，講他們跟美國 Department of War（它們對外用這個字眼）在談合作：他們願意把模型用在國防、情報等等任務，但有兩個用例他們不願意拿掉 safeguard：

- **大規模國內監控（mass domestic surveillance）**
- **完全自主武器（fully autonomous weapons）**

而 Department 那邊的態度據說是：「我們要 *any lawful use*，你不拿掉 safeguard 就下線。」

我不想裝懂政治。

但站在工程師角度，我覺得真正的重點是這句話：

**AI 公司接下來要賣的不是『能力』，而是『可控性』。**

## 「any lawful use」聽起來像採購條款，但對產品來說根本是無限 attack surface

很多人把 *any lawful use* 當成一個很合理的採購要求。

可是你把它放到 AI 系統上，它其實是在說：

> 「你這套東西最好什麼都能做，而且我們想用在哪都行。」

這對一般軟體還能靠規格、測試、型別系統去收斂。

對 LLM/agent 這種東西，等於直接把你的 product boundary 打開，然後再問你：

**出事你要怎麼負責？**

正常的工程世界我們會用 contract 來處理：

```text
preconditions + invariants + failure modes + recovery
```

但 AI 產品很多時候是靠 policy PDF、靠「請不要」在撐。

所以我完全理解一個 vendor 會選擇說：「可以合作，但那兩個不行。」

## 這比較像 reliability 決策，不只是道德宣言

外界會把它解讀成倫理議題。某種程度是。

但我更覺得這是一種 **reliability / liability** 決策。

- 大規模國內監控不是「多一個資料分析場景」而已，它需要極高召回率、對髒資料、對對抗者、對規模化搜尋，還要能承受超級高代價的誤判。
- 完全自主武器也不是「把 agent 裝到無人機上」這麼簡單，它是即時控制迴路、非穩態環境、欺騙/干擾、邊緣案例，而且你不能接受「模型剛好 hallucinate」。

你把產品放進這些領域，你就不是在賣「一個 LLM」。

你是在賣「一個需要可證明正確性的系統」——而目前的 LLM 很難做到這件事。

所以這兩條紅線讀起來比較像：

> 「我願意提供價值，但我不想負責把『還沒解決』的事假裝成已經解決。」

## 工程師應該注意的是：這才是 guardrails 真的碰到錢時長什麼樣子

大家很愛在抽象層級吵 guardrails。

但只要進到 enterprise / government，guardrails 會變得超級無聊、也超級真實：

- 哪些任務允許？
- 哪些 log 一定要留？
- 什麼狀況要升級到人？
- 拒絕模式是什麼？
- 有沒有 kill switch？

然後重點來了：**一定有人會要求你移除它**。

做過 production 的人都懂那個節奏：

- safeguard 擋到一次客戶
- 有人爆炸
- PM 來問能不能加個「暫時性 override」
- 然後 override 慢慢變成預設值

所以 *any lawful use* 在實務上通常就是：**override-by-default**。

## 我比較 cynical 的解讀：這同時也是市場定位

我不太相信公司做這種事全靠道德潔癖。

劃紅線也代表：

- 「我們是認真要當供應鏈的一環」
- 「我們可以承受失去合約」
- 「我們押注市場會為治理能力付錢」

這個押注對不對，之後再看。

但我覺得已經很明顯了：接下來的 AI vendor 競爭，不會只有 benchmark，會更像在比 **operational discipline**。

## 如果你在做 agents：把這個模式偷走

就算你不關心國防政策，這個 pattern 還是很值得偷：

1. 先挑一小撮你能解釋清楚的「不做」用例
2. 把它寫進 runtime constraint（不是只放在投影片）
3. 讓移除這些約束在技術上/流程上都變得昂貴

因為只要你的系統開始變 mission-critical，就一定會有人希望你「少一點煞車」。

你最好不要只剩一句「請相信我們」。

---

**References:**
- [Anthropic 公開聲明：在 Department of War 部署中維持兩項 safeguards 的理由](https://www.anthropic.com/news/statement-department-of-war)
- [TechCrunch 報導：Anthropic 與五角大廈採購期限壓力下的拉扯](https://techcrunch.com/2026/02/26/anthropic-ceo-stands-firm-as-pentagon-deadline-looms/)
