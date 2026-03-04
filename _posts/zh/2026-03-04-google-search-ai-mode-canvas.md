---
layout: post
title: "Google 把 Canvas 放進 Search 的 AI Mode：Search 正在變成工作區"
date: 2026-03-04 21:00:00
categories: AI
tags: AI
author: Tommy
lang: zh
---

![Google Search AI Mode Canvas：把查詢變成可持續的工作區](/img/posts/2026-03-04-google-search-ai-mode-canvas-01.webp)

Google 把 **AI Mode 的 Canvas** 擴到「美國、英文、所有使用者」了。
如果你之前沒追 Google Labs，這件事用一句話翻譯就是：

Search 不只是回答問題，它開始想要**接住你的工作**。

Canvas 是一個側邊的工作區：你可以把一個想法丟進去，讓它幫你整理、規劃、寫草稿，甚至生成一個小型互動工具（Google 說可以做成可分享的 app / game），然後你再用對話一路迭代。

我不敢說這就是「未來的搜尋」。但這絕對是 **Google 最擅長的那一招：把新功能放到你的預設入口**。

## 這是 UI 的賭注，不是模型的賭注

大家很愛把一切都講成「誰的模型比較強」。
但我覺得更關鍵的是 UI：

- Chat 是你「特地去開」的地方
- Search 是你「每天住在裡面」的地方

Canvas 的訊號很明顯：Google 不想只給你一個答案，它想給你一個可以反覆打磨的草稿本。

這會改變使用者習慣：

- 你不再只問一次就走
- 你開始把它當成「專案」在跑

## 真正想吃下來的是：規劃、整理、那些很無聊但很值錢的工作

你會發現 Google 舉例都不是「寫詩」那種。
它們很務實：

- 把雜亂筆記整理成讀書指南
- 規劃旅行
- 做一個 dashboard 追蹤條件、截止日、金額

這類工作有個特性：
「夠用」通常就能省下大量時間，因為替代方案往往是你自己開文件、拖延、再拖延。

所以對，它不浪漫。
也因此，它可能真的會被用起來。

## Search 變小型 IDE：很酷，也有點讓人不安

Google 說你可以「切換查看底下的 code」再繼續改。
工程師直覺會覺得：

- 低摩擦原型很香
- 讓不會寫 code 的人也能做出東西

但另一半直覺會立刻跳出問題：

- 這段 code 到底跑在哪？
- 權限模型怎麼定？
- 它說會拉「web + Knowledge Graph」，那資料邊界在哪？

一個看起來像軟體、但本質是對話生成的產物，當然可以很有用。
但它也很容易變成「demo 好看、上線就出事」的那種東西。

玩具跟工具的差別，通常不是生成能力，而是：

- 測試
- 可觀測性
- 所有權（誰維護、誰負責）

Canvas 不會把這些魔法消除，它只是讓你更容易跳進去。

## Google 的不公平優勢不是 Gemini，是「預設分頁」

Google 可以把 Canvas 放到一群從來沒：

- 開過 ChatGPT
- 用過 Claude
- 在乎過什麼 context window

的人面前。

只要它距離你每天會用十幾次的搜尋框「少一個 click」，採用就不靠 hype，而是靠習慣。

習慣才是最難被打破的東西。

## 我的看法

我不覺得 Canvas 會取代文件、試算表、真正的 IDE。

但我覺得它正在長出一個很危險也很強的「中間層」：

- 不是傳統搜尋結果頁
- 也不是完整 app
- 而是一個可持續的工作區，慢慢把兩邊都吃掉

做對了，web 會變得更「被摘要」而不是「被點進去」。
做錯了，我們會得到更多自動生成的半成品工具，沒人維護、沒人負責。

不管哪一種，方向都很清楚：Search 正在嘗試變成「工作的起點，也是終點」。

---

**References:**
- [Google 官方部落格：Canvas in AI Mode 擴大開放，並新增寫作與 coding 支援](https://blog.google/products-and-platforms/products/search/ai-mode-canvas-writing-coding/)
- [TechCrunch 報導：Canvas 在 Search 的 AI Mode 對所有美國英文使用者開放](https://techcrunch.com/2026/03/04/https-techcrunch-com-2026-03-04-google-search-rolls-out-geminis-canvas-in-ai-mode-to-all-us-users/)
- [OpenAI 官方介紹：ChatGPT 的 Canvas（對比觸發方式與工作流程）](https://openai.com/index/introducing-canvas/)
