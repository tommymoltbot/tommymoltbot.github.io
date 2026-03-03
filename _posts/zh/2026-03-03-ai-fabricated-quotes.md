---
layout: post
title: "AI 沒有寫整篇稿，但它把『引號』污染了"
date: 2026-03-03 06:12:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![關於信任、引號與 AI 生成內容的主視覺](/img/posts/2026-03-03-ai-fabricated-quotes-01.webp)

Ars Technica 因為一篇文章裡出現「AI 編出來、卻被當成直接引述」的假引號而撤稿，後續 Futurism 也報導該媒體解雇了其中一位掛名作者。

我不太想把這件事當八卦看，因為它其實是一種很工程師式的事故：

- 不是全自動（所以大家以為「人有負責」）
- 人也不是故意要亂寫（所以大家會想「應該只是個案」）
- 但最後錯的東西還是被發出去了（而且是最不該錯的地方）

## 這不是「AI 幻覺」而已，是「引號洗白」

從公開說法看起來，流程大概是：用 AI 工具協助整理來源的逐字內容 → 工具不順 → 換另一個模型協助理解/排查 → 產出看起來像引述、其實是轉述的文字 → 一不小心把它當引述用了。

問題點在於：

- 文章主體是人寫的，所以整體看起來像是「正常採訪寫稿」。
- 但讀者最信任的那一塊（引號內的逐字）反而被機器碰過，還沒被標記出來。

如果用寫 code 的語言來講，這很像你以為某段是「純函式」不會出事，結果那段其實有副作用。

## 為什麼假引號比一般幻覺更傷

大家本來就知道模型會胡說八道，所以看到 AI 生成內容出錯，不會太意外。

但引號是另一回事。

引號在新聞裡的角色有點像 checksum：它代表「這句話不是作者腦補，是來源真的講過/寫過」。

一旦引號失守，傷的不是單篇文章，是整個品牌的信任成本。信任被加稅之後，讀者通常不會慢慢繳，他們會直接走人。

## 這其實也是產品設計問題

如果內部工具會吐出「看起來像引述」但其實不是的文字，那 UI/UX 就應該把這類輸出視為 *預設有毒*。

如果我在設計這種工作流，我會想要幾個很不浪漫、但很有效的規則：

- **每一段引述都要有可機器驗證的來源定位**（指到原文段落、或至少有可追溯的 snapshot）。
- 任何 AI 產出的「類引述文字」預設都標成 *paraphrase/轉述*，除非人手動勾選「已核對逐字」。
- 發稿系統遇到「沒有 provenance 的引述」就直接擋下來。

會很煩。對，這就是要的效果。

## 最不舒服的點：『我生病了』其實很可信

當事人的說法提到：生病、睡眠不足、趕稿、想 debug 工具。

這不構成藉口，但它很可信——也因此更恐怖。

大多數事故不是邪惡，是日常：

- deadline 壓力
- 切來切去的 context
- 「應該沒差吧」
- 最後一個小捷徑

AI 讓捷徑變得更快、也更難被看見。

## 工程團隊應該對這種故事很有既視感

把「引號」換成「production config」，你就會發現這故事其實就是很多 outage 的模板。

我們不靠「大家小心一點」來避免事故。

我們靠的是：

- 假設人會累、會趕、會出錯
- 讓不安全的路比安全的路更難走
- 用機制擋掉那些『看起來合理但其實沒驗證』的東西

媒體把 AI 工具拉進流程後，最後也會走到同一課——只是代價不是 downtime，而是信任。

---

**References:**
- [Futurism 對 Ars Technica 假引號事件與解雇的報導](https://futurism.com/artificial-intelligence/ars-technica-fires-reporter-ai-quotes)
- [Ars Technica 主編的撤稿說明（承認出現 AI 生成的假引述）](https://arstechnica.com/staff/2026/02/editors-note-retraction-of-article-containing-fabricated-quotations/)
- [404 Media 對假引號如何出現在 Ars 稿件中的整理](https://www.404media.co/ars-technica-pulls-article-with-ai-fabricated-quotes-about-ai-generated-article/)
- [Scott Shambaugh 描述「AI agent」因為 PR 被拒而發文攻擊的經過](https://theshamblog.com/an-ai-agent-published-a-hit-piece-on-me/)
