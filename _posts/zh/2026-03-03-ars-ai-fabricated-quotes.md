---
layout: post
title: "當 AI 介入引述，你的編輯標準就變成 runtime checks"
date: 2026-03-03 10:10:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![引述與信任邊界](/img/posts/2026-03-03-ars-ai-quotes-01.webp)

我覺得這次「Ars Technica 因為 AI 產生的假引述引發爭議、之後傳出開除記者」最可怕的點，不是有人用了 AI。

最可怕的是：這整個事故的失敗模式，對任何做過 production 的人來說，**太熟悉了**。

你引進一個「只是幫忙省時間」的工具，把它插進某個關鍵流程，然後你忘了：工具本身的信任邊界，跟你的系統信任邊界完全不是同一回事。

在新聞業，那個關鍵流程就是——**引述（quotes）**。一旦你的流程讓模型碰到引述，編輯標準就不再只是「政策」，而是必須靠機制去擋的 **runtime checks**。

### 事情大概怎麼發生的（先不追殺誰）

公開資訊看起來是：Ars 發了一篇文章，裡面引用了某個真實人物的「直接引述」，但當事人指出自己從沒講過那些話。Ars 隨後撤稿並說明：文章包含由 AI 工具生成的「捏造引述」，而且這是嚴重違反標準的錯誤。

Futurism 另外報導：在這起事件之後，Ars 終止了資深 AI 記者 Benj Edwards 的雇用（至少以目前公開資訊看起來是這樣）。

我不是來寫道德說教文的。工程師視角看，這根本就是一份「工具鏈怎麼把你帶進坑」的事故報告。

差別只在於：軟體事故通常是 500、資料錯、服務掛；新聞事故是讀者信任直接破洞。

### 「文章不是 AI 寫的」其實是錯誤防禦

很多團隊（不只媒體）都喜歡畫一條看起來很乾淨的線：

- 「我們不會發 AI 生成內容。」
- 「我們只用 AI 做整理、抽取、列大綱。」

聽起來很合理，但問題根本不在「AI 有沒有寫完整篇」。

問題在於：**AI 觸碰到了讀者會當成 ground truth 的那一段**。

引述很特別，因為它不只是事實陳述，它還是「歸因陳述」：你在對讀者承諾「這個人就是講了這句話」——而且是逐字逐句。

一旦你把這段流程交給（或半交給）模型處理，你其實是在做一個「機率性變換」。

### 引述不是「資料抽取」

工程師很愛自動化抽取：

- 解析 logs
- 幫你整理 incident timeline
- 抽出 config diff
- 把一大段文字變成結構化重點

但引述不是 logs，引述是**證據（evidence）**。

你的 workflow 只要有一種可能會產生「差不多意思」的引述，你就已經輸了。

像這種看起來很無害的介面，其實就是事故起點：

```text
extract_quotes(article_text) -> ["quote1", "quote2", ...]
```

因為它長得太像 deterministic 的 compiler pass，人的腦袋會自動鬆懈：

「喔，它是抽取，不是生成。」

抱歉，不是。

### production 思維：把 AI 當作 untrusted dependency

如果你想要一個工程上的比喻，我會把這類 AI 工具當成：

- 不穩定的 network call
- 行為未定義的 dependency
- 或一支偶爾會把輸入搞壞的腳本

在 production，你不會用「政策」解決這種事，你會加 guardrails。

下面幾個 guardrails 對工程師來說很直覺，但我覺得很多新聞機構其實還沒把它變成「可運作的流程」。

#### 1) 讓「引述的來源證明」變成第一級 artifact

只要文章裡有引號，內部系統就應該能讓編輯一鍵看到：

- 來源文章/逐字稿的連結
- 對應段落或時間戳
- 原始貼上的片段
- 是誰貼的

這不是官僚，這是 observability。

#### 2) 沒有來源指標就直接擋住不能發

做成 hard gate，像 CI 一樣。

沒有 provenance，就不能 ship。

#### 3) 把「輔助 AI」跟「承載證據的文字」切開

就算你想保留 AI，它也不需要碰某些區域。

最簡單的規則：

- AI 可以摘要
- AI 可以提問題
- AI 不可以產出任何會被呈現為逐字引述的內容

更嚴格一點：**只要在引號內的文字，就是保護區**。

#### 4) 別再把 policy 當成 enforcement

政策通常不是因為寫得不清楚才失效。

政策失效是因為：

- 人會生病
- deadline 會壓人
- 工具鏈很亂
- review 時間被壓縮
- 「就這一次」永遠會發生

所以你要有一個假設「人一定會犯可預期錯誤」的系統。

### 為什麼這種事會一直發生

最不舒服的是：這不是孤例。

現在網路上到處都是：

- 用 AI 摘要假裝報導
- 改寫到 attribution 壞掉的文章
- 「看起來像逐字」其實是 paraphrase 的引述
- 互相引用、來源打轉的資訊回音室

背後的經濟壓力也很真實：流量下滑、平台規則一直變、搜尋變得奇怪，然後管理層不停說「用 AI 做更多、用更少的人」。

當「更多/更少」碰到需要精準的那一塊，出事幾乎是必然。

### 我自己的結論

我不反對 AI 工具，我也會用。但我很討厭那種「工具是中立的」氛圍。

你把機率性機器插進一條會產生主張（claims）的 pipeline，中間任何一段只要被誤信成 deterministic，你就要準備付代價。

軟體業是用 outage 學到這件事。

新聞業現在是用信任學到這件事。

---

**References:**
- [Futurism：關於 Ars Technica 因捏造引述爭議終止 Benj Edwards 雇用的報導](https://futurism.com/artificial-intelligence/ars-technica-fires-reporter-ai-quotes)
- [Ars Technica：撤稿說明（文章包含由 AI 工具生成的捏造引述）](https://arstechnica.com/staff/2026/02/editors-note-retraction-of-article-containing-fabricated-quotations/)
