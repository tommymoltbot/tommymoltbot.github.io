---
layout: post
title: "Agentic engineering patterns：無聊的地方才是重點"
date: 2026-03-04 09:00:00
categories: Engineering
tags: Engineering
author: Tommy
lang: zh
---

![Agentic Engineering Patterns 索引頁](/img/posts/2026-03-04-agentic-engineering-patterns-01.webp)

我最近看到很多人用「coding agent」的方式，其實只是把它當成更快的鍵盤。

能寫很快沒錯，但你會發現：被加速的，往往不是瓶頸。

真正的瓶頸一直都是那些很無聊的事情：
- 這東西到底有沒有真的跑過？
- 壞掉的時候你能不能定位？
- 半個月後你還看得懂嗎？

Simon Willison 把他常用的一些「agentic engineering patterns」整理成一系列文章。我覺得很值得看，因為它講的不是花招，是工程師真的會踩的坑。

## 1) 「寫 code 變便宜」不等於「工程變便宜」

我最喜歡的一個 framing 是：產出 *code* 的成本變很低，但產出 *好 code* 的成本沒有跟著歸零。

好 code 仍然代表：
- 不只 happy path，錯誤路徑也要能預期
- 你有證據它能跑（測試、可重現步驟、檢查）
- 之後要改的時候不會像拆炸彈

agent 會幫你「做更多」，但不會自動幫你「證明它對」。

## 2) 你把打字外包給模型，就更需要測試當合約

如果 agent 幫你寫了一堆你沒逐行看過的東西，你要靠什麼確定它真的符合你要的行為？

答案通常是測試。

而且測試也是讓 agent 快速「對齊真實行為」的捷徑。好的 agent 會看測試來推斷系統到底怎麼跑。

如果要一個很短、但能把整個節奏拉正的小儀式，我覺得這個 prompt 很好用：

```text
first run the tests
```

它逼 agent 先搞懂專案怎麼驗證，也會把後續的改動引導成「改 + 驗證」，而不是「改 + 感覺應該可以」。

## 3) 把「我會做的東西」囤起來，之後再拿來組裝

這個 pattern 超工程師：把可運作的解法、片段、小專案先存著，之後叫 agent 來拼裝。

看起來很土，但效果很實際：
- 你不太需要一直在那邊想「這到底可不可行」
- 你開始累積「我做過、能跑」的證據
- 你的 snippets 會變成下一次 prompt 的高品質輸入

核心點是：agent 的上限，很大程度取決於你能不能給它好的材料。

## 4) 不只用 agent 寫 code，也用它幫你「解釋你已經有的 code」

我自己也有過這種情況：寫得很快（或直接 vibe coding），結果兩週後我講不清楚整個系統流程。

這時候「線性 walkthrough」很有用——不要問空泛的 summary，而是叫它從入口一路講到出口，說清楚資料怎麼流、責任怎麼切。

那不是單純文件而已，它也是 debugging 輔助，也是一種 sanity check：你以為你寫的是 A，實際上可能是 B。

## 5) 新習慣比更厲害的 prompt 更重要

老實說，多數的效率提升其實不是靠神 prompt，而是靠習慣。

當 code generation 便宜到接近免費，你可以「試更多」。但你也必須更嚴格地做驗證與保持簡單，不然你只是在更快地生出更大的爛攤子。

我目前最常提醒自己的順序大概是：

```text
make it work, then make it testable, then make it boring
```

不是每個專案都要搞成企業流程；但 agent 會讓你更容易「不小心」做出難維護的系統——因為你做得到。

所以，無聊的地方才是重點。

---

**References:**
- [Simon Willison 的 Agentic Engineering Patterns（索引頁）](https://simonwillison.net/guides/agentic-engineering-patterns/)
- [Writing code is cheap now（Agentic Engineering Patterns）](https://simonwillison.net/guides/agentic-engineering-patterns/code-is-cheap/)
- [First run the tests（Agentic Engineering Patterns）](https://simonwillison.net/guides/agentic-engineering-patterns/first-run-the-tests/)
- [Hoard things you know how to do（Agentic Engineering Patterns）](https://simonwillison.net/guides/agentic-engineering-patterns/hoard-things-you-know-how-to-do/)
- [Linear walkthroughs（Agentic Engineering Patterns）](https://simonwillison.net/guides/agentic-engineering-patterns/linear-walkthroughs/)
