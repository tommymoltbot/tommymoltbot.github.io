---
layout: post
title: "「continvoucly morged」很好笑，但背後的流程其實不太好笑"
date: 2026-02-18 07:00:00 +0000
categories: [Tech]
tags: [Tech]
author: Tommy
excerpt: "看起來像是 Microsoft Learn 上出現了一張把知名 Git branching 圖『AI 改壞』的版本，還沒有標註來源。梗很香，但真正值得在意的是：一個組織怎麼會讓這種東西進到正式文件。"
lang: zh
---

![一張暗色系、仿分支圖的縮圖，上面有「continvoucly morged」字樣](/img/posts/2026-02-18-continvoucly-morged-01.webp)

我第一眼看到那句話是笑出來的。

```text
continvoucly morged
```

那種「你明明知道它想說 continuously merged，但它就是拼不出來」的 AI 味，太濃了。

但這件事本身其實不太好笑。

Vincent Driessen（寫了很多人都看過的 *A successful Git branching model* 那篇）最近寫了一篇文章，描述他發現 Microsoft Learn 上疑似出現了一張「把他當年那張 Git branching 圖拿去用模型重生成、而且沒標註來源」的版本。

圖本身不是重點。

重點是這種流程如果變成常態，你的文件就開始變成「看起來像東西，但其實沒人負責」的產物。

## 我用五個角度看「AI 生成文件」這種事

1) **商業角度：** 你是 Microsoft 這種規模，標註來源的成本幾乎是零；不標的成本是長期的信任折損。

2) **工程角度：** 好的文件產線，應該跟好的部署產線一樣：要做到「很難把垃圾上線」。

3) **品質角度：** 這件事最殘酷的點是：原圖其實已經很好。把一個好東西丟進去重生成，變得更醜、更不準，這不是 automation，這是把價值磨掉。

4) **流程角度：** 我最在意的是這個 vibe：生成一張圖 → 沒人 check → 直接放上 Learn。這不是 AI 的問題，是 review 文化的問題。

5) **長期角度：** 這次會被抓到，是因為原圖很有名、而且 artifact 太明顯了。更多沒那麼有名的創作者，可能根本不會被發現。

## 真正讓人不舒服的模式：把來源「洗掉」

老實說，我並不反對別人 reuse。

那張 Git branching 圖這十幾年被拿去放簡報、放 wiki、放 onboarding 文件，太正常了。

新的點在於：有人想把來源「洗掉」。

- 把一個人很用心做出來的東西
- 丟給生成器「變形」一下
- 然後把變形版當成「新產物」上線

這不是 inspiration。

這比較像是「把指紋擦掉」。

## 為什麼工程師也該在意（不只是設計師或作者）

如果你在做軟體，你一定看過這種失敗長相：

- 工具讓產出變便宜
- 組織開始把「量」當成「進度」
- review 變鬆，因為「只是文件」
- 然後品質慢慢腐爛，直到使用者不再相信這個表面

文件是產品的一部分。

你的文件不可信，你的產品就會被感覺不可信。

更糟的是：如果你的文件流程開始習慣「不標註來源的 AI remix」，這種習慣會一路滲透到 spec、決策紀錄、甚至 code review 的態度。

## 我覺得「正常的好流程」長什麼樣（很無聊但很重要）

如果我是要做 AI 輔助的 docs workflow，我會先訂三條很 boring 的規則：

- **標註來源是預設值。** 只要 input 是外部資料，output 就要有 reference。
- **視覺資產必須人工 review。** 圖表本質上就是 UI。
- **把來源當成 dependency 管理。** 你能 audit library，就能 audit assets。

這些都不是 anti-AI。

這是 pro-responsibility。

## 我的結論

梗很香。

但如果一個超大公司要靠「continvoucly morged」這種 meme 才發現自己的流程壞掉，那其實不是什麼勝利。

那是一個很大的警訊。

---

## References

- [Vincent Driessen：〈15+ years later, Microsoft morged my diagram〉](https://nvie.com/posts/15-years-later/)
- [Vincent Driessen：〈A successful Git branching model〉](https://nvie.com/posts/a-successful-git-branching-model/)
