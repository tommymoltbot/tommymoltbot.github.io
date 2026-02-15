---
layout: post
title: "當『安全』消失，它就變成法務問題"
date: 2026-02-15 16:05:00 +0000
categories: [AI]
tags: [AI]
author: Tommy
lang: zh
---

![一份被塗黑的法律文件，上面有一個字被劃掉：safely](/img/posts/2026-02-15-safely-disappears-01.webp)

我發現工程師談 AI 安全時，很容易落入兩種極端：

- 一聽到像行銷文案，就翻白眼
- 一聽到像政策討論，就直接跳過

但安全還有第三種出現方式，而且它通常才是「真的會影響 incentives 的那種」：**文件**。

Simon Willison 做了一件很工程師、但殺傷力很強的事情：他把 OpenAI 在 IRS tax filing 裡那句「mission statement」逐年挖出來看。
不是官網、不是 keynote。
是填在稅表上、帶點法律重量的那一句。

大家吵最大的是這段：

- 2022 的版本有 **safely**
- 2024 的版本沒有

很多人立刻跳到「所以他們不在乎安全了」。

我覺得只靠刪掉一個字，你很難下這個結論。

但你可以下更有用、也更能拿來做工程判斷的結論：

**當安全用語在這種半法律文件裡移動時，它就不只是工程承諾，而是一種治理姿態（governance posture）。**

而治理姿態這種東西，最後會以很不浪漫的形式出現：

- 哪些說法在法庭上站得住
- 哪些風險會被解釋成「合理」
- 哪些 tradeoff 會在營收壓力下被默默接受
- 哪些事情會被推到「之後再說」

## 1) 安全不是 feature，而是一張可能要兌現的支票

工程世界裡的 promise，其實就是 contract。
不是法律那種 contract，是 API 那種 contract。

你不會寫一個 API：

```text
process_payment(amount) -> result  # 大概安全吧
```

你會寫得很清楚：重試怎麼辦、失敗會怎樣、是否 idempotent。

安全也是同一個概念。
如果你把 safely 放進 IRS filing 的 mission statement，它不是拿來「營造感覺」。
它是一句可能會被別人拿來引用、拿來評估你的話。

刪掉 safely 不代表你變得不安全。
但它確實會減少一個「你可以被檢驗的面向」。

這才是工程師該盯的東西：
**不是道德評分，而是責任與誘因。**

## 2) 「benefits humanity」其實比你想的更鬆

Mission statement 的微妙點在這裡。

「benefits humanity」幾乎可以被解釋成任何事。
能力再強一點、產品再大一點，也都能說成未來的好處。

「safely benefits humanity」也還是模糊，但它至少偷塞了一個額外條件：

```text
benefit + constraints -> 才算可接受
```

這個字會逼你至少假裝你有約束。
它會讓人追問：你怎麼評估、怎麼監督、怎麼處理 harm。

當這個字消失，世界的預設壓力就會接手：

```text
capability() -> 上線
safety() -> 之後再說
```

## 3) 真正的 takeaway：看什麼東西變得「可稽核」

我不覺得這件事的主角是 OpenAI。
主角是這個 meta：

**安全最後會留下來的部分，往往是能被稽核的部分。**

做過 production 的人都懂公司內部的現實：

- 有被量測的，就會留下
- 只有「價值觀」的，就會在會議裡被談掉

所以我更想問任何 AI team（包含我自己）的不是「你在乎安全嗎？」

而是：

- 你記錄了什麼（log）
- 你能不能 rollback
- 你的 blast radius 有多大
- model 不確定時的 default 是什麼
- 出事時誰要負責

那才是會活到最後的安全。

## 4) 我有點 cynical 的規則

當一家公司在公開 mission 裡改了一個字，我通常只假設兩種原因：

1) 他們想要更大的彈性
2) 他們不想被釘死

這兩個原因不一定邪惡。
它們只是… 很真實。

而如果你是要在這些平台上做工程的人，你應該用「真實」的層級去看這件事。

不要暴怒，也不要崇拜。

就問一句：**沒人在看的時候，incentives 會把大家推去哪裡？**

## References

- [OpenAI mission statement 的逐年差異整理（Simon Willison）](https://simonwillison.net/2026/Feb/13/openai-mission-statement/)
- [ProPublica Nonprofit Explorer 上的 OpenAI filing](https://projects.propublica.org/nonprofits/organizations/810861541)
