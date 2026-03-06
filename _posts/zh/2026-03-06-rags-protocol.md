---
layout: post
title: "RFC 406i 很好笑，但它在講的痛點是真的"
date: 2026-03-06 11:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![RFC 406i / RAGS protocol](/img/posts/2026-03-06-rags-protocol-ai-slop-01.webp)

我今天看到一個頁面，先笑出來，然後下一秒有點累。

它把「拒收 AI 生成的垃圾投稿」寫成一份假 RFC，名字叫 **RFC 406i**：*The Rejection of Artificially Generated Slop (RAGS)*。
語氣很兇、很嗆，但核心其實不是在罵 AI。

它在講的是：**review 的帶寬是有限的，而 LLM 讓「噪音的產量」變成無上限。**

## 笑點會成立，是因為不對稱真的存在

LLM 出現之前，要 spam maintainer 也不是不行，但至少要花點時間。
現在一個人可以在幾分鐘內產出一串「第一眼看起來像那麼回事」的 PR。

然後就變成很難看的不對稱：

- 投稿者花幾分鐘。
- Maintainer 花注意力、上下文切換成本、還要賭 repo 的信任感。
- 最後 repo 的 inbox 變成「我不敢相信這裡面有多少是真的」。

更煩的是，很多時候也不是惡意。
常見的說法大概是：

- 「我叫模型把 lint 修掉。」
- 「我這邊跑得過。」
- 「CI 是綠的。」

但這些都不等於「邏輯是對的」。

## “AI slop” 其實不只是 AI

我同意那篇 satire 的點，不是它的敵意（那個語氣很多社群用不起）。
而是它在提醒一件更不舒服的事：

- **流暢的文字可以是假的。**
- **自信很便宜。**
- **diff 看起來很乾淨，不代表行為是對的。**

做過 review 的人應該都看過那種 PR：

- 加了一堆不存在的 API / 參數，像是憑空編出來的。
- 「重構簡化」其實是把最麻煩的 edge case 直接刪掉。
- PR 描述寫得很像懂，但你一問「你有沒有 end-to-end 跑過？」就開始飄。

LLM 很擅長 *表面合理*。
Maintainer 要付出的卻是 *真實性驗證*。

## 我覺得可以抄的是結構，不是態度

RFC 406i 想提供一段「拒收用的 macro」。
我不建議大多數專案抄那個酸度。

但我覺得 maintainer 應該抄它的**結構**，把規則講清楚：

1) **最小可驗證敘事**：你到底修了什麼？
2) **什麼叫可 review**：你有做哪些檢查？
3) **沒驗證就快速關掉**：不要讓 repo 當你的免費驗證服務。

如果要我自己寫一段比較正常的版本，大概會是這樣：

```text
謝謝你的貢獻。

在我們開始 review 前，請補上：
- 你要修的 bug 是什麼（對應 issue 或描述預期 vs 實際）
- 你怎麼驗證（命令、測試案例、截圖）
- 為什麼這個做法是對的（不是「模型建議這樣改」）

如果你沒辦法 end-to-end 驗證，請不要直接送出生成的修改。
```

不嘲諷、不扣帽子，就把成本邊界講清楚。

## 如果你要用 LLM 幫你寫 PR

我不是反 LLM。
我反的是「把沒驗證的輸出丟給陌生人」這件事。

你想用模型可以，但你要付出你那一份成本：

- 跑測試。
- 補一個針對性的測試（以前會 fail，現在會 pass）。
- 解釋你在維持什麼 invariant。

你的 PR 如果回答不了「你到底檢查了什麼？」那它就不是 PR。
它比較像彩券。

## 我的結論

RFC 406i 是個 meme，但它其實是在照妖鏡。

開源社群以前撐過很多壓力，但這次很不一樣：不是新型 bug。
而是新型態的「輸入流量」。

接下來我猜 maintainer 端也會越來越自動化：
triage bot、提交 checklist、甚至某種「proof of work」的社群默契。

不是因為 maintainer 變壞。
是因為大家真的很累。

---

**References:**
- [RFC 406i / RAGS 原文（"ERROR 406i: AI_SLOP_DETECTED"）](https://406.fail/)
- [Hacker News 上對 RFC 406i 的討論串](https://news.ycombinator.com/item?id=47267947)
